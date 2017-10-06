#pragma strict
#pragma downcast



class ChatHistory
{
	private var ITEM_NUM : int = 0;
	private var mChatHistoryList : Array = new Array();
	private var mCurChatHistoryIndex : int = 0;
	//--------------------------------------------------
	public function ChatHistory(itemNum : int)
	{
		ITEM_NUM = itemNum;
	}
	//--------------------------------------------------
	public function pushChatHistory(content : String) : void
	{
		if (null == content || "" == content)
			return;
		
		if (mChatHistoryList.Count >= ITEM_NUM)
		{
			mChatHistoryList.RemoveAt(0);
		}
		mChatHistoryList.Add(content);
		openChatHistory();
	}
	//--------------------------------------------------
	public function openChatHistory() : void
	{
		mCurChatHistoryIndex = mChatHistoryList.Count;
	}
	//--------------------------------------------------
	public function handleKeyCodeUpDown() : String
	{
		if (0 == mChatHistoryList.Count)
			return "";
		
		if (handleKeyCodeUp() || handleKeyCodeDown())
			return CommFunc.valueOfArray(mChatHistoryList, mCurChatHistoryIndex);
		
		return "";
	}
	//--------------------------------------------------
	private function handleKeyCodeUp() : boolean
	{
		if (Event.current.Equals(Event.KeyboardEvent("up")))
		{
			--mCurChatHistoryIndex;
		 	if (mCurChatHistoryIndex < 0)
		 	{
		 		mCurChatHistoryIndex = 0;
		 	}
		 	return true;
		 }
		 return false;
	}
	//--------------------------------------------------
	private function handleKeyCodeDown() : boolean
	{
		if (Event.current.Equals(Event.KeyboardEvent("down")))
		{
			++mCurChatHistoryIndex;
			if (mCurChatHistoryIndex >= mChatHistoryList.Count)
			{
				mCurChatHistoryIndex = mChatHistoryList.Count - 1;
			}
			return true;
		}
		return false;
	}
	//--------------------------------------------------
}


