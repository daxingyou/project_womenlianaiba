#pragma strict

/*----------------------------------------------------------------------------------------------------
主玩家组件(2011/10/8 create by hezhr)
----------------------------------------------------------------------------------------------------*/
private var m_moveTarget:Vector3 = Vector3.zero;	// 主玩家的移动目标点
public var m_sync_gap = 0.5f;						// 请求同步行走间隔
private var m_sync_cur = 0.0f;						// 请求同步行走当前时间

var jiantouPrefab:GameObject;
private var m_destArrow:GameObject = null;
private var m_firstPerson : boolean = false;		// 第一人称

//--------------------------------------------------

function FixedUpdate()
{
	_moveUpdate();
}

function Update()
{
	if (GlobalBlock.isBlock())
		return;
	
	_clickToWalk();
}

//--------------------------------------------------
// 移动,放在FixedUpdate()里
private function _moveUpdate()
{
	if (null==gameObject.GetComponent(PlayerMove)
		|| !gameObject.GetComponent(Player).hasModel())
	{
		return;
	}

    if (gameObject.GetComponent(PlayerMove).isMoving())
    {
        // 同步坐标
		if (Time.time > m_sync_cur)
		{
			m_sync_cur = Time.time + m_sync_gap;
        	var currPos : Vector3 = gameObject.transform.position;
        	var moveComp : PlayerMove = gameObject.GetComponent(PlayerMove);
			request_sync_position(currPos);
		}
    }
}
//--------------------------------------------------
// 请求行走类型
public static function request_sync_walk_type(type : int) : void
{
	var packet : req_sync_walk_type = new req_sync_walk_type();
	packet.type = type;
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 请求开始行走
public static function request_start_walk(curr_pos : Vector3, dest_pos : Vector3) : void
{
	var packet : req_start_walk = new req_start_walk();
	var temp_curr : point = new point();
	temp_curr.x = curr_pos.x;
	temp_curr.y = curr_pos.y;
	temp_curr.z = curr_pos.z;
	var temp_dest : point = new point();
	temp_dest.x = dest_pos.x;
	temp_dest.y = dest_pos.y;
	temp_dest.z = dest_pos.z;
	packet.curr_pos = temp_curr;
	packet.dest_pos = temp_dest;
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 请求移动同步
public static function request_sync_position(pos : Vector3) : void
{
	var packet : req_sync_position = new req_sync_position();
	var temp : point = new point();
	temp.x = pos.x;
	temp.y = pos.y;
	temp.z = pos.z;
	packet.pos = temp;
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 请求停止行走
public static function request_stop_walk(pos : Vector3) : void
{
	var packet : req_stop_walk = new req_stop_walk();
	var temp : point = new point();
	temp.x = pos.x;
	temp.y = pos.y;
	temp.z = pos.z;
	packet.pos = temp;
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 设置主玩家的移动目标点
public function setMoveTarget(target:Vector3):void
{
    if (!Login.hasFinished)
        return;
	
	var currPos : Vector3 = FurnitureInteract.getInstance().getPlayerPos(gameObject.GetComponent(Player).getAccount());
	if (-Vector3.one == currPos)
	{
		currPos = gameObject.transform.position;
	}
	var sce: HouseScene = EQSceneManager.getSingleton().HouseSceneObj;
	if (IndoorPath.findPath(currPos, target, sce)) // 如果有路走，才请求行走
	{
		m_moveTarget = target;
	    if (m_moveTarget != currPos)	// 请求开始行走
	    {
		    request_start_walk(currPos, m_moveTarget);
	    }
	}
}
//--------------------------------------------------
// 点击行走
private function _clickToWalk() : void
{
	var all_house : boolean = (1 == UpDownStair.getViewFloorNum() ? false : true);
	if (false == _isClickValid(all_house))	// 放在前面,不然鼠标会穿透界面
		return;
	
	var click : Vector3 = PlayerMove.getTargetPos(all_house);
	if (Vector3.zero == click)
		return;
	
	setMoveTarget(click);
}
//--------------------------------------------------
// 点击是否有效
private function _isClickValid(all_house : boolean) : boolean
{
	// 家族模式下
	if (FitmentLogic.getInstance().inFitmenting)
		return false;
	
	// 鼠标在界面上
	if (true == UI.getUI().IsMouseOverUI())
		return false;
	
	// 点击在人物模型或有占据网格的家具上
	var pick_obj : GameObject = PickMgr.getSingleton().getPickObject();
	if (pick_obj)
	{
		var grid : HouseSceneGrid = PlayerMove.getClickGrid(all_house);
		if (ScenePlayerMgr.isPlayer(pick_obj))				// 鼠标在人物上
		{
			var player_floor : int = UpDownStair.getFloorNumByPos(pick_obj.transform.parent.position);
			if (grid && grid.Creator.FloorNO != player_floor)	// 点击的格子和点击的人物不在同一层
				return true;
			
			return false;
		}
		var comp : HouseSceneComponent = HSCManager.getSingleton().getHouseSceneComponent(pick_obj);
		if (comp)											// 鼠标家具上
		{
			if (0 == comp.CompPropRow.StopGrid.Count)	// 家具不占据网格
				return true;
			
			if (grid && grid.Creator.FloorNO != comp.FloorNo)	// 点击的格子和点击的家具不在同一层
				return true;
			
			return false;
		}
		if (NpcMgr.GetInstance().IsNpc(pick_obj))			// 鼠标在NPC上
		{
			return false;
		}
		if (SpriteLogic.getInstance().isSprite(pick_obj))	// 鼠标在小精灵上
		{
			return false;
		}
		if (GuestLogic.getInstance().isGuest(pick_obj))		// 鼠标在客人上
		{
			return false;
		}
	}
	
	return true;
}
//--------------------------------------------------
// 显示箭头
public function ShowMoveDest(show:boolean, dest:Vector3)
{
	if(m_destArrow == null)
	{
		m_destArrow = Instantiate(jiantouPrefab);
		m_destArrow.SetActiveRecursively(false);
	}
	
	if(show)
	{
		m_destArrow.transform.position = dest;
		m_destArrow.SetActiveRecursively(true);
	}
	else
	{
		m_destArrow.SetActiveRecursively(false);
	}
}
//--------------------------------------------------
// 设置第一人称
public function setFirstPerson(flag : boolean) : void
{
	m_firstPerson = flag;
}
//--------------------------------------------------
// 是否第一人称
public function isFirstPerson() : boolean
{
	return m_firstPerson;
}
//--------------------------------------------------


