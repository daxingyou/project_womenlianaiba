//-----------------game keyword shield----------------------
//-----------------game system keyword shield call----------
//-----------------------------DFA--------------------------
//----------------------------------------------------------
#pragma strict
#pragma downcast
class CallbackOperate {
	private var mResultKey : ArrayList = new ArrayList();
	public function CallbackResult(keyWord : String) {
		mResultKey.Add(keyWord);
		//keyWord = "*";
	}
	public function OutputResult(text : String) : String {
		var result : String = text;
		for(var key:String in mResultKey) {
			var replace : String = "";
			for(var i=0; i<key.Length; i++) {
				replace += "*";
			}
			result = result.Replace(key,replace);
		}
		return result;
	}
}

class KeyWordShield
{
	private class ShieldState {
		public var mFailure : ShieldState;
		public var mPreNode : ShieldState;
		public var mNextStatus : Hashtable= new Hashtable();
		public var mKeyWords : ArrayList = new ArrayList();
		
		function ShieldState(preNode : ShieldState) {
			mPreNode = preNode;
			mFailure = null;
		}
		
		public function AddNext(word : String) : ShieldState {
			if(!mNextStatus.ContainsKey(word)) {
				var newState : ShieldState = new ShieldState(this);
				mNextStatus.Add(word,newState);
				return newState;
			} else {
				return mNextStatus[word];
			}
		}
		
		public function Process(kCallback : CallbackOperate) {
			 for (var str : String in mKeyWords) {
   				 kCallback.CallbackResult(str);
  			 }
		}
	}
	
	public var mStartState : ShieldState;
	public var mKeysMap : Hashtable = new Hashtable();
	
	function KeyWordShield(file_name : String) {
		mStartState = new ShieldState(null);
		mStartState.mFailure = mStartState;
		
		var asset : TextAsset = Resources.Load(file_name,TextAsset);
		if(asset != null) {
			var str : String = asset.text.Replace("\r\n",",");
			var separator : String = ",";
			var wordArray : String[] = str.Split(separator[0]);
			for(var i = 0; i<wordArray.Length; i++) {
				for(var j=wordArray.Length-1; j>i; j--) {
					if(wordArray[i] == wordArray[j]) {
						wordArray[j] = "";
					}
				}
			}
			for(var word : String in wordArray) {
				if(word.Trim() != "") {
					//Add(word);
					mKeysMap.Add(word,0);
				}
			}
			Rebuild();
			
			//UnityEngine.Object.DestroyImmediate(asset,true);
		}
	}
	
	public function Clear() {
		CleanStatus(mStartState);
	}
	
	public function Add(keyWord : String) {
		mKeysMap.Add(keyWord,0);
		Rebuild();
	}
	
	public function Remove(keyWord : String) {
		/*
		var idx : int = -1;
		for(var i=0; i<mKeysMap.Count; i++) {
			if(mKeysMap[i] == keyWord) {
				idx = i;
			}
		}
		if(idx != -1) {
			mKeysMap.RemoveAt(idx);
		}
		*/
		mKeysMap.Remove(keyWord);
		Rebuild();
	}
	
	public function Search(text : String) : String {
		var callback : CallbackOperate = new CallbackOperate();
		return Search(text,callback);
	}
	
	public function Search(text : String,kCallback : CallbackOperate) : String {
		var curState : ShieldState = mStartState;
		var idx : int = 0;
		
		for(idx = 0; idx < text.Length; idx++) {
			while(curState.mNextStatus.ContainsKey(text.Substring(idx,1)) == false) {
				if(curState.mFailure != mStartState) {
					if(curState == curState.mFailure) {
						Debug.Log("search failure");
						break;
					}
					curState = curState.mFailure;
				} else {
					curState = mStartState;
					break;
				}
			}
			if(curState.mNextStatus.ContainsKey(text.Substring(idx,1))) {
				curState = curState.mNextStatus[text.Substring(idx,1)];
				if(curState.mKeyWords.Count != 0) {
					curState.Process(kCallback);
				}
			}
		}
		
		return kCallback.OutputResult(text);
	}
	
	public function HasKeyWordShield(text : String) : boolean {
		var curState : ShieldState = mStartState;
		var idx : int = 0;
		
		for(idx = 0; idx < text.Length; idx++) {
			while(curState.mNextStatus.ContainsKey(text.Substring(idx,1)) == false) {
				if(curState.mFailure != mStartState) {
					if(curState == curState.mFailure) {
						Debug.Log("search failure");
						break;
					}
					curState = curState.mFailure;
				} else {
					curState = mStartState;
					break;
				}
			}
			if(curState.mNextStatus.ContainsKey(text.Substring(idx,1))) {
				curState = curState.mNextStatus[text.Substring(idx,1)];
				if(curState.mKeyWords.Count != 0) {
					return true;
				}
			}
		}
		
		return false;
	}
	
	public function DoAdd(key : String) {
		var idx : int = 0;
		var curState : ShieldState = mStartState;
		
		for(idx = 0; idx < key.Length; idx++) {
			curState = curState.AddNext(key.Substring(idx,1));
		}
		
		curState.mKeyWords.Add(key);
	}
	
	public function Rebuild() {
		CleanStatus(mStartState);
		
		mStartState = new ShieldState(null);
		mStartState.mFailure = mStartState;
		
		//var enumItr : EnumeratorItemTypeAttribute = mKeysMap.Keys();
		//while(enumItr.hasMoreElements()) 
		//{
			//DoAdd(enumItr.nextElement());
		//}
		for(var values:DictionaryEntry in mKeysMap) {
			DoAdd(values.Key);
		}
		
		DoFailure();
	}
	
	public function CleanStatus(state : ShieldState) {
		for(var key in state.mNextStatus) {
			CleanStatus(state.mNextStatus[key]);
		}
		state = null;
	}
	
	public function DoFailure() {
		var failureList : ArrayList = new ArrayList();
		
		for(var values:DictionaryEntry in mStartState.mNextStatus) {
			failureList.Add(mStartState.mNextStatus[values.Key]);
			(mStartState.mNextStatus[values.Key] as ShieldState).mFailure = mStartState;
		}
		
		while(failureList.Count != 0) {
			var start : ShieldState = failureList[0];
			var state : ShieldState;
			failureList.RemoveAt(0);
			
			for(var values:DictionaryEntry in start.mNextStatus) {
				failureList.Add(start.mNextStatus[values.Key]);
				state = start.mFailure;
				
				while(state.mNextStatus.ContainsKey(values.Key) == false) {
					state = state.mFailure;
					if(state == mStartState) {
						break;
					}
				}
				
				if(state.mNextStatus.ContainsKey(values.Key)) {
					(start.mNextStatus[values.Key] as ShieldState).mFailure = state.mNextStatus[values.Key];
					for(var str : String in (start.mNextStatus[values.Key] as ShieldState).mFailure.mKeyWords) {
						(start.mNextStatus[values.Key] as ShieldState).mKeyWords.Add(str);
					}
				} else {
					(start.mNextStatus[values.Key] as ShieldState).mFailure = mStartState;
				}
			}
		}
	}
}