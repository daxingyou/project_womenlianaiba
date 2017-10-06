/*--------------------------------------------------
替换墙纸地板(2012/11/6 created by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast


private static var mInstance : WallFloorReplace = null;
private var mClickGameObj : GameObject = null;					// 鼠标点击的模型
private var mRoomSlots : Array = new Array();					// 

//--------------------------------------------------
function Awake()
{
	mInstance = this;
}
//--------------------------------------------------
public static function getInstance() : WallFloorReplace
{
	if (null == mInstance)
	{
		throw Exception("WallFloorReplace -> instance is null.");
	}
	return mInstance;
}
//--------------------------------------------------
function Update()
{
//	if (false == FitmentLogic.getInstance().inFitmenting)	// 非家装模式
//		return;
//	
//	if (UI.getUI().IsMouseOverUI())	// 鼠标在界面上
//		return;
//	
//	if (Input.GetMouseButtonDown(0))
//	{
//		leftButtonDown();
//	}
//	if (Input.GetMouseButtonUp(0))
//	{
//		leftButtonUp();
//	}
}
//--------------------------------------------------
// 鼠标左键按下
private function leftButtonDown()
{
	mClickGameObj = PickMgr.getSingleton().getPickObject();
}
//--------------------------------------------------
// 鼠标左键弹起
private function leftButtonUp()
{
	if (mClickGameObj && mClickGameObj==PickMgr.getSingleton().getPickObject())
	{
		var result = HouseScene.parseFrameCompName(mClickGameObj.name);
		if (null == result)		// 非框架
			return;
		
		var type : int = result[0];
		var floor : int = result[1];
		var room : int = result[2];
		
		if (floor < 1 || room < 1)
			return;
		
		switch (type)
		{
		case HouseComponentPropertyType.HCP_FLOOR:
			replaceFloor(floor, room);
			break;
		case HouseComponentPropertyType.HCP_IN_WALL:
		case HouseComponentPropertyType.HCP_OUT_WALL:
			replaceWall(floor, room);
			break;
		}
	}
}
//--------------------------------------------------
// 替换地板
private function replaceFloor(floor : int, room : int) : void
{
	var scene : HouseScene = UpDownStair.getHouseScene();
	if (null == scene)
		return;
	
	var xz : int[] = scene.getXZ(Camera.main.ScreenPointToRay(Input.mousePosition));
	if (null == scene.getGrid(floor, xz[0], xz[1]))
		return;
	
	setRoomSlot(floor, room, false, "0200021.png.u3d");
}
//--------------------------------------------------
// 替换墙纸
private function replaceWall(floor : int, room : int) : void
{
	setRoomSlot(floor, room, true, "0200034.png.u3d");
}
//--------------------------------------------------
public function setRoomSlot(floor : int, room : int, isWall : boolean, tex : String) : void
{
	for (var slot : WallFloorReplaceSlot in mRoomSlots)
	{
		if (slot.equal(floor, room, isWall))
		{
			slot.cancel();
			if (null != tex && "" != tex)
			{
				slot.load(tex);
			}
		}
	}
}
//--------------------------------------------------
public function cancelRoomSlots() : void
{
	for (var slot : WallFloorReplaceSlot in mRoomSlots)
	{
		slot.cancel();
	}
}
//--------------------------------------------------
public function initRoomSlots() : void
{
	cancelRoomSlots();
	mRoomSlots.Clear();
	for (var hsr : HouseSceneRoom in HouseSceneRoomMgr.getInstance().getRooms())
	{
		mRoomSlots.Add(new WallFloorReplaceSlot(hsr.FloorNo, hsr.RoomNo, true));
		mRoomSlots.Add(new WallFloorReplaceSlot(hsr.FloorNo, hsr.RoomNo, false));
	}
}
//--------------------------------------------------





class WallFloorReplaceSlot
{
	private var mFloor : int = 0;
	private var mRoom : int = 0;
	private var mIsWall : boolean = false;
	private var mTexture : String = "";
	private var mAsynTexture : AsynIcon = null;
	
	public function WallFloorReplaceSlot(floor : int, room : int, isWall : boolean)
	{
		mFloor = floor;
		mRoom = room;
		mIsWall = isWall;
		mAsynTexture = new AsynIcon(setTexture, null);
	}
	
	public function load(tex : String) : void
	{
		if (tex == mTexture)
			return;
		
		mTexture = tex;
		mAsynTexture.load("Icon/" + tex);
	}
	
	public function cancel() : void
	{
		mAsynTexture.cancel();
	}
	
	public function equal(floor : int, room : int, isWall : boolean) : boolean
	{
		return floor==mFloor && room==mRoom && isWall==mIsWall;
	}
	
	private function setTexture(tex : Texture) : void
	{
		if (null == tex)
			return;
		
		if (mIsWall)
			HouseSceneRoomMgr.getInstance().changeWall(mFloor, mRoom, tex);
		else
			HouseSceneRoomMgr.getInstance().changeFloor(mFloor, mRoom, tex);
	}
}


