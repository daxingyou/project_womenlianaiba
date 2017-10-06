#pragma strict
#pragma downcast
import iGUI;



private var MaxFireworksCount : int = 5;
private var mCurFireworksCount : int = 0;
private var mFireworksTempArray : Array = new Array();
private var mFireworksModelArray : Array = new Array();
private var mFireworksPareObj : GameObject = null;
public static var Ctrl : Controller = new Controller();
public var AudioObjPrefab : GameObject = null;
//--------------------------------------------------
private static var instance : PropFireworksLogic = null;
function Awake() {
	instance = this;
}
//--------------------------------------------------
public static function getInstance() : PropFireworksLogic {
	return instance;
}
//--------------------------------------------------
function Start() {
	mFireworksPareObj = new GameObject("Fireworks");
	Ctrl.Register("DESTROY_FIREWORKS", destroyFireworks);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LEAVE_SCENE), leaveHouseScene);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_USE_ITEM_BY_SCENE), useItemByScene);
}
//--------------------------------------------------
private function displayFireworks(row : PropUseRow) : void {
	if (mCurFireworksCount >= MaxFireworksCount) {
		mFireworksTempArray.Add(row);
	} else {
		mFireworksModelArray.Add(FireworksModel.createFireworks(row, mFireworksPareObj));
		++mCurFireworksCount;
	}
}
//--------------------------------------------------
private function destroyFireworks(param : FireworksModel) : void {
	if (mFireworksTempArray.Count > 0) {
		var row : PropUseRow = mFireworksTempArray[0];
		mFireworksTempArray.RemoveAt(0);
		mFireworksModelArray.Remove(param);
		mFireworksModelArray.Add(FireworksModel.createFireworks(row, mFireworksPareObj));
	} else {
		--mCurFireworksCount;
	}
}
//--------------------------------------------------
private function leaveHouseScene(evt:GameEvent, obj:System.Object) : void {
	mFireworksTempArray.Clear();
	mCurFireworksCount = 0;
	for (var fireworskModel : FireworksModel in mFireworksModelArray) {
		fireworskModel.destroy();
	}
	mFireworksModelArray.Clear();
}
//--------------------------------------------------
private function useItemByScene(evt:GameEvent, itemId:int) : void {
	var row : PropUseRow = ResManager.LgtMgr.getPropUseRow(itemId);
	displayFireworks(row);
}
//--------------------------------------------------





class FireworksModel {
	private var mObj : GameObject = null;
	private var mFireworksLoader : ModelLoader = null;
	private var mMusic : AudioModule = null;
	//--------------------------------------------------
	public function FireworksModel(row : PropUseRow, pos : Vector3, pare : GameObject) {
		mObj = new GameObject("fireworks_" + row.id.ToString());
		mObj.transform.position = pos;
		CommFunc.setParent(pare, mObj);
		// 加载
		mFireworksLoader = Global.GetModelLoaderMgr().AsynLoadModel("Model/Particle/" + row.animation, onLoadFireworksFinished, false, true);
		mMusic = new AudioModule(PropFireworksLogic.getInstance().AudioObjPrefab, "Music/" + row.audio, false);
	}
	//--------------------------------------------------
	private function onLoadFireworksFinished(obj : ModelLoader) : void {
		var fireworksObj : GameObject = obj.mModelObj;
		CommFunc.setParent(mObj, fireworksObj);
		var parSys : ParticleSystem = fireworksObj.GetComponent("ParticleSystem");
		var tm : TimerEx = fireworksObj.AddComponent("TimerEx");
		tm.init((parSys.duration/2)*1000, 1, null, fireworksCompleteTimer, null);
		tm.start();
	}
	//--------------------------------------------------
	private function fireworksCompleteTimer(obj : System.Object) : void {
		destroy();
		PropFireworksLogic.Ctrl.Excute("DESTROY_FIREWORKS", this);
	}
	//--------------------------------------------------
	public function destroy() : void {
		if (mFireworksLoader) {
			mFireworksLoader.Destroy();
			mFireworksLoader = null;
		}
		if (mMusic) {
			mMusic.destroy();
			mMusic = null;
		}
		GameObject.Destroy(mObj);
	}
	//--------------------------------------------------
	public static function createFireworks(row : PropUseRow, pare : GameObject) : FireworksModel {
		if (null == row)
			return null;
		
		var mplayer : GameObject = ScenePlayerMgr.getMainPlayer();
		var pos : Vector3 = mplayer.transform.position;
		var arr : Array = HouseSceneGrid.getAroundGridsInWalkArea(pos);
		if (arr.Count > 0) {
			var grid : HouseSceneGrid = CommFunc.randomOfArray(arr);
			pos = grid.GetPosition(Space.World);
		}
		return new FireworksModel(row, pos, pare);
	}
	//--------------------------------------------------
}

