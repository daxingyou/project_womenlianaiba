#pragma strict
#pragma downcast

public var waiterObj : GameObject;
private var mWaiter : WaiterModel = null;			//地图上的侍者
private var mWaiterModel : WaiterModel = null;		//侍者更换界面的侍者

private var mWaiterPos : Vector3 = Vector3(490.0, 500.5, 479.5);
private var mWaiterRotation : Vector3 = Vector3(0, 90, 180);

private var mWaiterScene : GameObject;
private var mParent : GameObject = null;

private var mClicked : boolean = false;
private var mInit : boolean = false;

private var mEmployWaiterID : int = 0;
private var mWaiterArr :Array = new Array();
private var WAITER_NUM : int = 4;
private var WAITER_ID_START : int = 1;		//侍者初始id

private static var instance : WaiterLogicCenter;
static function GetInstance(){
	return instance;
}

function Awake(){
	instance=this;
}

function Start ()
{
	RegistEvent();
}

function RegistEvent() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_WAITERUI), handleCloseEntertainUI);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_HOUSE_SCENE), enterHouseScene);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LEAVE_SCENE), leaveHouseScene);
	NetHelper.RegistHandler(new notify_employ_state(), notifyEmployState);
	NetHelper.RegistHandler(new notify_query_waiter_id(), notifyQueryWaiterID);
}

private function enterHouseScene(evt:GameEvent, obj:System.Object) : void
{
	//确定是不是在自己家里
	var reqAccount : String = "";
	if(mWaiter != null){
		mWaiter.destroy();
		mWaiter = null;
	}
	if(DataCenter.isInSelfHouse())
	{
		reqAccount = DataCenter.getMainPlayerAccount();
	}
	else
	{
		reqAccount = Global.GetCurVisitHouseAccount();
	}
	
	var req : req_query_waiter_id = new req_query_waiter_id();
	req.account = reqAccount;
	NetHelper.Send(req);
}

private function leaveHouseScene(evt:GameEvent, obj:System.Object) : void
{
	Clear();
	if(mWaiter != null)
	{
		mWaiter.destroy();
		mWaiter = null;
	}
}

private function notifyQueryWaiterID(evt : GameEvent, pack : notify_query_waiter_id) : void
{
	mEmployWaiterID = pack.waiter_id;
	if(mEmployWaiterID == 0)
	{
		if(DataCenter.isInSelfHouse())
		{
			var req : req_employ_waiter_data = new req_employ_waiter_data();
			req.waiter_id = 1;
			NetHelper.Send(req);
			mEmployWaiterID = WAITER_ID_START;
		}
		else
		{
			if(mWaiter != null)
			{
				mWaiter.destroy();
				mWaiter = null;
			}
		}
	}
	if(mWaiter == null && mEmployWaiterID != 0)
	{
		CreateWaiterOnMap(mEmployWaiterID);
	}
}

function Init() : void
{
	if(waiterObj == null) {
		throw "waiter scene obj is null...";
	}
	mWaiterScene = GameObject.Instantiate(waiterObj);
	
	var light : Light = mWaiterScene.GetComponentInChildren(Light);
	if(AmbientMgr.getSingleton().isDayNight())
	{
		light.intensity = 0.15;
	}
	else
	{
		light.intensity = 0.6;
	}
}

private function initWaiterArr() : void
{
	for(var i : int = 0; i < WAITER_NUM; i++)
	{
		var row : WaiterRow = ResManager.LgtMgr.getWaiterRow(WAITER_ID_START+i);
		mWaiterArr.Add(row);
	}
}

function Clear() : void
{
	if(mWaiterModel != null)
	{
		mWaiterModel.destroy();
		mWaiterModel = null;
	}
	UnityEngine.Object.Destroy(mWaiterScene);
}

private function handleCloseEntertainUI(evt : GameEvent, obj : Object) : void
{
	closeWaiterUIRoot();
	Clear();
}

// 在地图上创建侍者
function CreateWaiterOnMap(id : int) : void
{
	if(mWaiter != null)
	{
		mWaiter.destroy();
	}
	var data : house_info = EQGameSceneMgr.getSingleton().getHouseData();
	var houseRow : PlayerHouseRow = ResManager.LgtMgr.getPlayerHouseRow(data.template_id);
	var pos : Vector3 = houseRow.waiter_pos;
	var direction : int = houseRow.waiter_rotate;
	var rotate : Vector3;
	switch(direction)
	{
		case 1:
			rotate = Vector3.zero;
			break;
		case 2:
			rotate = Vector3(0,90,0);
			break;
		case 3:
			rotate = Vector3(0,180,0);
			break;
		case 4:
			rotate = Vector3(0,-90,0);
			break;
		default:
			rotate = Vector3.zero;
			break;
	}
	mWaiter = new WaiterModel(id,pos,rotate,0);
}

// 创建侍者UI上的模型
function CreateWaiter(waiterID : int) : void
{
	if(mWaiterModel != null)
	{
		mWaiterModel.destroy();
	}
	mWaiterModel = new WaiterModel(waiterID,mWaiterPos,mWaiterRotation,8);
}

private function notifyEmployState(evt:GameEvent, pack:notify_employ_state) : void
{
	if(mWaiterArr.Count == 0)
		initWaiterArr();
	var arr : ArrayList = pack.waiter_up;
	
	for(var i : int = 0; i < arr.Count; i++)
	{
		var tmp : waiter_info = arr[i]; 
		mWaiterArr[tmp.waiter_type - 1] = ResManager.LgtMgr.getWaiterRow(tmp.waiter_id);
	}
	
	if(mWaiter != null && mEmployWaiterID != pack.waiter_id)
	{
		CreateWaiterOnMap(pack.waiter_id);
	}
	
	mEmployWaiterID = pack.waiter_id;
	if(iGUICode_WaiterUIRoot.getInstance() != null)
	{
		iGUICode_WaiterUIRoot.getInstance().freshWaiterList();
	}
}

// 打开侍者界面
function OpenWaiterUIRoot() : void
{
	UI.getUI().OpenUIRoot("WaiterUIRoot");
	UI.getUI().SetModal("WaiterUIRoot", true);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_WAITER_BTN));
}

// 关闭侍者界面
private function closeWaiterUIRoot() : void
{
	UI.getUI().SetModal("WaiterUIRoot", false);
	UI.getUI().CloseUIRoot("WaiterUIRoot");
}

function GetEmployWaiterID() : int
{
	return mEmployWaiterID;
}

function GetWaiterArr() : Array
{
	return mWaiterArr;
}

function ViewLeft() : void
{
	if(mWaiterModel)
	{
		mWaiterModel.Rotate(Vector3(0,-1,0));
	}
}

function ViewRight() : void
{
	if(mWaiterModel)
	{
		mWaiterModel.Rotate(Vector3(0,1,0));
	}
}

function Rotate() : void
{
	var dx : float = Input.GetAxis("Mouse X");
	var speed : float = 10;
	if(mWaiterModel)
	{
		mWaiterModel.Rotate(Vector3(0,dx*speed,0));
	}
}
