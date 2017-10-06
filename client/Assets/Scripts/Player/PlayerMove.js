/*----------------------------------------------------------------------------------------------------
玩家移动组件(2011/10/13 create by hezhr)
----------------------------------------------------------------------------------------------------*/
#pragma strict
#pragma downcast
public var m_runSpeed : float = 0.05f;
public var m_walkSpeed : float = 0.02f;
private var m_moveSpeed:float = m_walkSpeed;			// 移动速度
public var m_rotateTime:float = 0.2f;			// 转弯过渡时间0.2


private var m_moveBegin:Vector3 = Vector3.zero;	// 移动开始位置
private var m_moveEnd:Vector3 = Vector3.zero;	// 移动结束位置
private var m_movePath: Array = null;           // 移动路径 
private var m_lastUpdateLayerTime:float = 0;	// 上次更新模型层的时间

public var m_headup : iGUILabel = null;

private var is_moving : boolean = false;
private static var m_leftButtonDownPos:Vector3 = Vector3.zero;	// 鼠标左键按下时的位置
private var mDegree : float = 180.0f;			// 模型初始朝向-x轴
private var start_move_player_guide : boolean = false;
private var mWalkType : int = walk_type.wt_walk;	// 行走方式,默认是行走

//--------------------------------------------------

function Awake(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_RUNSWITCH_BTN), HandleClickRunSwitchBtn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.START_MOVE_PLAYER), HandleStartMovePlayer);
}

function Start()
{
}
function OnDestroy()
{
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_RUNSWITCH_BTN), HandleClickRunSwitchBtn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.START_MOVE_PLAYER), HandleStartMovePlayer);
}
//--
function HandleStartMovePlayer(evt : GameEvent, obj : Object){
	start_move_player_guide = true;
}
//--------------------------------------------------
function FixedUpdate()
{
	_moveUpdate();
}
//--------------------------------------------------
function Update()
{
	//半秒更新一次layer
	var curr = Time.time;
	if( curr - m_lastUpdateLayerTime > 0.5 )
	{
		updateModelLayer();
		
		m_lastUpdateLayerTime = curr;
	}
}
//--------------------------------------------------
function isMoving(): boolean
{
    if (m_movePath)
        return true;
	
    return false;
}
//--------------------------------------------------
function isMainPlayer(): boolean
{
    return (ScenePlayerMgr.getMainPlayer() == gameObject);
}
//--------------------------------------------------
// 更新移动,此函数放在FixedUpdate()里
private function _moveUpdate()
{ 
    if (!m_movePath)
        return;
        
	if (isMainPlayer() && (EQSceneManager.getSingleton().getState() == SceneState.SS_DECORATE))
		return;
	
	var pos:Vector3 = transform.position;
	pos = CommFunc.getPositionBySpeed(m_moveBegin, m_moveEnd, pos, m_moveSpeed);
	if (pos == transform.position)	
	{
	    if (m_movePath.length > 1) // 还有路径未走完
	    {
	        transform.position = m_movePath[0];
	        m_moveBegin = transform.position;
	        m_moveEnd = m_movePath[1];
	        changePlayerDir(true);
	        m_movePath.RemoveAt(0);
	    }
	    else // 全部走完了，停止移动
	    {	       
		    m_movePath = null;
		    var com: MainPlayer = gameObject.GetComponent(MainPlayer);
		    if (com)
		    {
		        // 请求停止行走
		        MainPlayer.request_stop_walk(m_moveEnd);    
		    }
		}
	}
	else
	{
    	transform.position = pos;	// 在移动中
	}
}
//--------------------------------------------------
// 更新模型应该所在的层
private function updateModelLayer():void
{
	if(GlobalBlock.isBlock())		//因为可能碰到房屋正在加载的情况. update时候调用这个不安全啊.
		return;
	
	CommFunc.setGameObjectLayer(this.gameObject, EQSceneManager.getSingleton().HouseSceneObj);
}
//--------------------------------------------------
public function getPos():Vector3
{
	return transform.position;
}
//--------------------------------------------------
// 查找路径
public function findPath(dest:Vector3): Array
{
	var currPos: Vector3 = transform.position;
	var sce: HouseScene = EQSceneManager.getSingleton().HouseSceneObj;
	var path: Array = IndoorPath.findPath(currPos, dest, sce);
	
	if (path)
	{
		path.RemoveAt(0); // 第一个位置是自已的当前位置, 所以移除掉
	}
	return path;
}
//--------------------------------------------------
// 准备移动,接收到开始移动消息后调用
public function startWalk(dest:Vector3, p:Player):void
{
    if (null == p)
    {
		return;
	}
	m_movePath = findPath(dest);
	
	if (m_movePath)
	{
    	m_moveBegin = transform.position;	// 开始移动位置总是当前位置
    	m_moveEnd = m_movePath[0];
		changePlayerDir(false);
		SetIsMoving(true);
		changeWalkType(true);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_START_WALK));
	}
	else // 找不到路径
	{
	}	
}
//--------------------------------------------------
// 结束移动,接收到停止移动消息后调用
public function stopWalk(dest:Vector3, p:Player):void
{
	if (null == p)
	{
		return;
	}
	m_movePath = null;
	

	m_moveBegin = Vector3.zero;
	m_moveEnd = Vector3.zero;
	
	transform.position = dest;
	
	p.play("stand", WrapMode.Loop);
	SetIsMoving(false);
	if(start_move_player_guide){
		start_move_player_guide = false;
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.PLAYER_REACH_TARGET));
		EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.START_MOVE_PLAYER), HandleStartMovePlayer);
	}
	handlePlayerInStair(dest);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_STOP_WALK));
}
//--------------------------------------------------
// 获取鼠标点击的结果,返回[格子,坐标]
public static function getClickResult(all_house : boolean) : System.Object[]
{
	var result : System.Object[] = new System.Object[2];
	result[0] = null;
	result[1] = Vector3.zero;
	
	var scene : HouseScene = UpDownStair.getHouseScene();
	if (null == scene)
		return result;
	
	var res : System.Object[] = scene.rayGrid(Camera.main.ScreenPointToRay(Input.mousePosition), all_house);
	result[0] = res[1];
	result[1] = res[2];
	
	return result;
}
//--------------------------------------------------
// 获取鼠标点击的格子
public static function getClickGrid(all_house : boolean) : HouseSceneGrid
{
	var res : System.Object[] = getClickResult(all_house);
	return res[0];
}
//--------------------------------------------------
// 获取鼠标点击的坐标
public static function getClickPos(all_house : boolean) : Vector3
{
	var res : System.Object[] = getClickResult(all_house);
	return res[1];
}
//--------------------------------------------------
// 获取要行走的目标点,此函数放在FixedUpdate()里
public static function getTargetPos(all_house : boolean) : Vector3
{
	if (Input.GetMouseButtonDown(0))		// 鼠标左键按下
	{
		m_leftButtonDownPos = getClickPos(all_house);
	}
	if (Input.GetMouseButtonUp(0))			// 鼠标左键弹起
	{
		var offset : float = 0.38f;	// 鼠标位置的偏移量
		var pos : Vector3 = getClickPos(all_house);
		var distance : float = Vector3.Distance(m_leftButtonDownPos, pos);
		m_leftButtonDownPos = Vector3.zero;
		if (distance < offset)
		{
			return pos;
		}
	}
	return Vector3.zero;
}
//--------------------------------------------------
// 玩家改变朝向,is_delay,表示是否要过渡
private function changePlayerDir(is_delay : boolean) : void
{
    iTweeniGUI.Stop(gameObject);
    if (is_delay)
    {
    	iTweeniGUI.RotateTo(gameObject, Vector3(0, rotateDegree(), 0), m_rotateTime);
    }
    else
    {
    	gameObject.transform.localRotation = Quaternion.Euler(0, rotateDegree(), 0);
    }
}
//--------------------------------------------------
// 获取玩家的选择度数
private function rotateDegree() : float
{
	mDegree = CommFunc.calcRadiusXZ(m_moveBegin, m_moveEnd);
	// 由于人物模型的初始朝向-x轴,所以这里需要转换
	return (mDegree < 180.0f) ? (180.0f - mDegree) : (540.0f - mDegree);
}
//--------------------------------------------------
// 设置玩家朝向角度
public function setDegree(degree : float) : void
{
	mDegree = degree;
	var rotate_degree : float = (degree < 180.0f) ? (180.0f - degree) : (540.0f - degree);
	gameObject.transform.localRotation = Quaternion.Euler(0, rotate_degree, 0);
}
//--------------------------------------------------
// 获取玩家的朝向角度
public function getDegree() : float
{
	return mDegree;
}
//--------------------------------------------------
public function SetIsMoving(f : boolean)
{
	is_moving = f;
}
//--------------------------------------------------
public function GetIsMoving():boolean
{
	return is_moving;
}
//--------------------------------------------------
// 处理停止走路时是否在传送点
private function handlePlayerInStair(pos : Vector3) : void
{
	var grid : HouseSceneGrid = UpDownStair.getGrid(pos);
	if (false == UpDownStair.isTransmitGrid(grid))
		return;
	
	// 没有对应的传送点
	if ("" == grid.Param1)
		return;
	
	// 获取制定参数的传送格子
	var arr : Array = UpDownStair.getTransmitGrids(grid);
	var trans_grid : HouseSceneGrid = HouseSceneGrid.getNearestGrid(arr, grid.GetPosition(Space.World));
	if (null == trans_grid)
		return;
	
	// 传送格子被设置为阻挡,则不能传送
	if (trans_grid.Blocked)
		return;
	
	// 设置玩家传送坐标并同步
	var target : Vector3 = trans_grid.GetPosition(Space.World);
	gameObject.transform.position = target;
	if (ScenePlayerMgr.isMainPlayer(gameObject))
	{
		MainPlayer.request_sync_position(target);
		// 改变观察楼层
		if (false == UpDownStair.isPosInViewFloor(target))
		{
			// 为海景别墅做特殊处理(二楼走下一楼,不切换观察楼层)
			if (2 == UpDownStair.getViewFloorNum() && 130001 == EQGameSceneMgr.getSingleton().getHouse().getHouseInfo().template_id)
			{
				return;
			}
			UpDownStair.getInstance().changeUpDownStairs();
		}
	}
	else
	{
		UpDownStair.getInstance().handlePlayerLoadFinished(null, gameObject);
	}
}
//--------------------------------------------------
function HandleClickRunSwitchBtn(evt : GameEvent, obj : Object){
	if (null == this.gameObject || !ScenePlayerMgr.isMainPlayer(this.gameObject)) {	// 非主玩家
		return;
	}
	mWalkType = walk_type.wt_walk == mWalkType ? walk_type.wt_run : walk_type.wt_walk;
	MainPlayer.request_sync_walk_type(mWalkType);
	setWalkType(mWalkType);
}
//--------------------------------------------------
private function changeWalkType(playAni : boolean) : void {
	if (null == this.gameObject)
		return;
	
	var moveAni : String = "";
	if (walk_type.wt_walk == mWalkType) {
		m_moveSpeed = m_walkSpeed; 
		moveAni = "walk";
	} else if (walk_type.wt_run == mWalkType) {
		m_moveSpeed = m_runSpeed;
		moveAni = "run";
	}
	if (!playAni)
		return;
	
	var p : Player = this.gameObject.GetComponent(Player);
	if (p) {
		moveAni = p.IsTransform() ? "walk" : moveAni;
		p.play(moveAni, WrapMode.Loop);
	}
}
//--------------------------------------------------
public function setWalkType(type : int) : void {
	mWalkType = type;
	changeWalkType(is_moving);
}
//--------------------------------------------------
public function refreshWalkType() : void {
	setWalkType(mWalkType);
}
//--------------------------------------------------