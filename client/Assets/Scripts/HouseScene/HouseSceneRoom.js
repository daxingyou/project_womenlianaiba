/*--------------------------------------------------
房屋房间(2012/11/5 created by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast



class HouseSceneRoom
{
	public var FloorNo : int = 0;
	public var RoomNo : int = 0;
	public var FloorObj : GameObject = null;
	public var InnerWallObjs : Array = new Array();
	public var OuterWallObjs : Array = new Array();
}


class HouseSceneRoomMgr
{
	private var mRooms : Array = new Array();
	private var mRow : WallFloorReplacePartRow = null;
	private static var mInstance : HouseSceneRoomMgr;
	//--------------------------------------------------
	public static function getInstance() : HouseSceneRoomMgr
	{
		if (null == mInstance)
		{
			mInstance = new HouseSceneRoomMgr();
		}
		return mInstance;
	}
	//--------------------------------------------------
	public function init(scene_id : int) : void
	{
		mRooms.clear();
		mRow = null;
		mRow = ResManager.LgtMgr.getWallFloorReplacePartRow(scene_id);
	}
	//--------------------------------------------------
	public function parseHouseComp(floor : int, room : int, type : HouseComponentPropertyType, comp : GameObject) : void
	{
		if (floor < 1 || room < 1)
		{
			// 避免点击外墙时,会穿透到内墙
			if (HouseComponentPropertyType.HCP_OUT_WALL == type)
			{
				CommFunc.addMeshCollider(comp, "");
			}
			return;
		}
		var hsr : HouseSceneRoom = null;
		switch (type)
		{
		case HouseComponentPropertyType.HCP_FLOOR:
			hsr = addRoom(floor, room);
			hsr.FloorObj = comp;
			CommFunc.addMeshCollider(comp, "");
			break;
		case HouseComponentPropertyType.HCP_IN_WALL:
			hsr = addRoom(floor, room);
			hsr.InnerWallObjs.Add(comp);
			CommFunc.addMeshCollider(comp, "");
			break;
		case HouseComponentPropertyType.HCP_OUT_WALL:
			hsr = addRoom(floor, room);
			hsr.OuterWallObjs.Add(comp);
			CommFunc.addMeshCollider(comp, "");
			break;
		}
	}
	//--------------------------------------------------
	public function changeWall(floor : int, room : int, tex : Texture) : void
	{
		var hsr : HouseSceneRoom = getRoom(floor, room);
		if (null == hsr)
			return;
		
		for (var inner : GameObject in hsr.InnerWallObjs)
		{
			replaceTexture(null == mRow ? null : mRow.inner_walls, null == mRow ? null : mRow.inner_walls_replace, inner, tex);
		}
		
		for (var outer : GameObject in hsr.OuterWallObjs)
		{
			replaceTexture(null == mRow ? null : mRow.outer_walls, null == mRow ? null : mRow.outer_walls_replace, outer, tex);
		}
	}
	//--------------------------------------------------
	public function changeFloor(floor : int, room : int, tex : Texture) : void
	{
		var hsr : HouseSceneRoom = getRoom(floor, room);
		if (null == hsr)
			return;
		
		replaceTexture(null == mRow ? null : mRow.floors, null == mRow ? null : mRow.floors_replace, hsr.FloorObj, tex);
	}
	//--------------------------------------------------
	public function getRooms() : Array
	{
		return mRooms;
	}
	//--------------------------------------------------
	private function getRoom(floor : int, room : int) : HouseSceneRoom
	{
		for (var hsr : HouseSceneRoom in mRooms)
		{
			if (floor == hsr.FloorNo && room == hsr.RoomNo)
				return hsr;
		}
		return null;
	}
	//--------------------------------------------------
	private function addRoom(floor : int, room : int) : HouseSceneRoom
	{
		var hsr : HouseSceneRoom = getRoom(floor, room);
		if (null == hsr)
		{
			hsr = new HouseSceneRoom();
			hsr.FloorNo = floor;
			hsr.RoomNo = room;
			mRooms.Add(hsr);
		}
		return hsr;
	}
	//--------------------------------------------------
	private function replaceTexture(replaceArr : Array, partArr : Array, obj : GameObject, tex : Texture) : void
	{
		var mr : MeshRenderer = obj.GetComponent(MeshRenderer);
		if (null == replaceArr || 0 == replaceArr.Count || null == partArr || 0 == partArr.Count)
		{
			mr.materials[0].mainTexture = tex;
			return;
		}
		var part : String = "";
		for (var i:int = 0; i < replaceArr.Count; ++i)
		{
			if (obj.name == replaceArr[i])
			{
				part = partArr[i];
				break;
			}
		}
		if ("" == part)
		{
			mr.materials[0].mainTexture = tex;
			return;
		}
		for (var mat : Material in mr.materials)
		{
			if (part + " (Instance)" == mat.name)
			{
				mat.mainTexture = tex;
				return;
			}
		}
	}
	//--------------------------------------------------
}


