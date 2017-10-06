/*--------------------------------------------------
家具互动(2012/2/14 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast



private static var mInstance : FurnitureInteract = null;
private static var mCtrl : Controller = new Controller();			// 控制器
private var mGameObj : GameObject = null;							// 点击的模型
private var mFurniture : HouseSceneComponent = null;				// 点击的家具
private var mFurniInteractRow : FurniInteractRow = null;			// 家具交互数据
private var mPlayerPos : Hashtable = new Hashtable();				// 保存玩家使用家具前的位置
private var mPlayerRow : Hashtable = new Hashtable();				// 保存玩家的家具交互信息
private var mSrcColor : Color;										// 家具材质颜色
public var HightLight : Color = Color(0.4, 0.4 ,0.4, 0);			// 家具高亮颜色(白色)
// 下面的参数用来微调人物的位置偏移
public var DebugState : boolean = false;							// 调试状态(默认为false)
public var Offset : Vector3 = Vector3.zero;							// 当在调试状态时,此值用来微调人物的位置
private var RoleObj : GameObject = null;							// 微调的人物模型
private var OldRolePos : Vector3 = Vector3.zero;					// 人物模型的原始位置
//



//--------------------------------------------------
function Awake()
{
	mInstance = this;
	registEvents();
	DebugState = false;
}
function Update()
{
	clickFurniture();
	handleDebug();
}
//--------------------------------------------------
public static function getInstance() : FurnitureInteract
{
	return mInstance;
}
//--------------------------------------------------
// 事件注册
private function registEvents() : void
{
	// 网络事件注册
	NetHelper.RegistHandler(new notify_start_use_furniture(), handle_notify_start_use_furniture);
	NetHelper.RegistHandler(new notify_stop_use_furniture(), handle_notify_stop_use_furniture);
	NetHelper.RegistHandler(new notify_change_furniture_status(), handle_notify_change_furniture_status);
	// 普通事件注册
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_MOUSE_IN_MODEL), mouseInFurniture);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_MOUSE_OUT_MODEL), mouseOutFurniture);
	// 其他事件注册
	addObserver("use_funiture", useFurniture);
}
//--------------------------------------------------
// 鼠标移进家具模型
private function mouseInFurniture(evt : GameEvent, obj : System.Object) : void
{
	var comp : HouseSceneComponent = HSCManager.getSingleton().getHouseSceneComponent(obj as GameObject);
	if (null == comp)
		return;
	
	var render : Renderer = CommFunc.getRenderer(obj);
	if (render)
	{
		mSrcColor = render.material.color;
		render.material.color += HightLight;
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.PICKMGR_MOVEIN_FURNI), null);
	}
}
//--------------------------------------------------
// 鼠标移出家具模型
private function mouseOutFurniture(evt : GameEvent, obj : System.Object) : void
{
	var comp : HouseSceneComponent = HSCManager.getSingleton().getHouseSceneComponent(obj as GameObject);
	if (null == comp)
		return;
	
	var render : Renderer = CommFunc.getRenderer(obj);
	if (render)
	{
		render.material.color = mSrcColor;
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.PICKMGR_MOVEOUT_FURNI), null);
	}
}
//--------------------------------------------------
// 点击家具
private function clickFurniture() : void
{
	// 家装模式,返回
	if (FitmentLogic.getInstance().inFitmenting)
		return;
	
	// 鼠标左键按下,鼠标不在界面上
	if (Input.GetMouseButtonDown(0) && false==UI.getUI().IsMouseOverUI())
	{
		leftButtonDown();
	}
	// 鼠标左键弹起
	if (Input.GetMouseButtonUp(0))
	{
		leftButtonUp();
	}
}
//--------------------------------------------------
// 鼠标左键按下
private function leftButtonDown() : void
{
	mGameObj = PickMgr.getSingleton().getPickObject();
} 
//--------------------------------------------------
// 鼠标左键弹起
private function leftButtonUp() : void
{
	if (mGameObj && mGameObj==PickMgr.getSingleton().getPickObject())	// 点中家具,打开交互界面
	{
		mFurniture = HSCManager.getSingleton().getHouseSceneComponent(mGameObj);
		if (mFurniture)
		{
			var all_house : boolean = (1 == UpDownStair.getViewFloorNum() ? false : true);
			var grid : HouseSceneGrid = PlayerMove.getClickGrid(all_house);
			if (grid && grid.Creator.FloorNO != mFurniture.FloorNo)		// 点击的格子和点击的家具不在同一层
			{
				return;
			}
		}
		UI.getUI().OpenUIRoot("FurnitureInteractUI");
		publishEvent("click_funiture", mFurniture);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICKON_FURNITURE), mFurniture);
	}
	else		// 关闭交互界面
	{
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICKON_OUTSIDEHOUSE), null);
		UI.getUI().EnableUIRoot("FurnitureInteractUI", false);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.FURNIINTERACTUI_UNENABLED));
	}
	mGameObj = null;
}
//--------------------------------------------------
// 发布事件
public static function publishEvent(event : String, obj : System.Object) : void
{
	mCtrl.Excute(event, obj);
}
//--------------------------------------------------
// 添加事件观察者
public static function addObserver(event : String, observer : Function) : void
{
	mCtrl.Register(event, observer);
}
//--------------------------------------------------
// 移除事件观察者
public static function delObserver(event : String, observer : Function) : void
{
	mCtrl.Unregister(event, observer);
}
//--------------------------------------------------
// 使用家具
private function useFurniture(param : System.Object) : void
{
	mFurniInteractRow = param;
	var distance : int = mFurniInteractRow.use_range;
	if (0 == distance)			// 家具无使用范围限制,请求使用家具
	{
		var pos : Vector3 = getPlayerPos(ScenePlayerMgr.getMainPlayerAccount());
		var curr_pos : Vector3 = (pos != -Vector3.one) ? pos : ScenePlayerMgr.getMainPlayer().transform.position;
		var status : int = 0;
		if (DataCenter.isPlayerInHouse())	// 室内场景
		{
			status = EQGameSceneMgr.getSingleton().getHouse().getFurnitureByInstanceID(mFurniture.InstId).status;
		}
		request_walk_for_use_furniture(curr_pos, curr_pos, mFurniture.InstId, mFurniture.CompId, mFurniInteractRow.id, status);
	}
	else						// 有使用范围,获取使用范围
	{
		// 玩家和所点家具不在同一楼层,则提示寻路失败
		var player_floor_num : int = UpDownStair.getFloorNumByPos(ScenePlayerMgr.getMainPlayer().transform.position);
		var hold_grid : HouseSceneGrid = mFurniture.HoldGrids[0];
		var furniture_floor_num : int = hold_grid.Creator.FloorNO;
		if (player_floor_num != furniture_floor_num)
		{
			publishEvent("find_path_failed", null);
			return;
		}
		//
		var hs : HouseScene = EQSceneManager.getSingleton().HouseSceneObj;
		var use_grids : Array = getUseGrids(hold_grid.Creator, mFurniture.HoldGrids, distance, mFurniInteractRow.use_face, mFurniture.Face);
		if (0 == use_grids.Count)		// 无有效的可使用格子
		{
			publishEvent("find_path_failed", null);
		}
		else							// 寻路
		{
			findPath(hs, use_grids);
		}
	}
}
//--------------------------------------------------
// 寻路
private function findPath(hs : HouseScene, around_grids : Array) : void
{
	if (null == mFurniture)
		throw "Error: FurnitureInteract -> findPath(HouseScene, Array) -> furniture is null!";
	
	if (null == mFurniInteractRow)
		throw "Error: FurnitureInteract -> findPath(HouseScene, Array) -> furniture interact row is null!";
	
	var pos : Vector3 = getPlayerPos(ScenePlayerMgr.getMainPlayerAccount());
	var curr_pos : Vector3 = (pos != -Vector3.one) ? pos : ScenePlayerMgr.getMainPlayer().transform.position;
	var grid : HouseSceneGrid = getNearestCanWalkGrids(hs, around_grids, curr_pos);
	if (null == grid)	// 没有找到
	{
		publishEvent("find_path_failed", null);
	}
	else
	{
		var target_pos : Vector3 = grid.GameObj.transform.position;
		var status : int = 0;
		if (DataCenter.isPlayerInHouse())	// 室内场景
		{
			status = EQGameSceneMgr.getSingleton().getHouse().getFurnitureByInstanceID(mFurniture.InstId).status;
		}
		request_walk_for_use_furniture(curr_pos, target_pos, mFurniture.InstId, mFurniture.CompId, mFurniInteractRow.id, status);
	}
}
//--------------------------------------------------
// 获取最近可寻路的格子
private function getNearestCanWalkGrids(hs : HouseScene, use_grids : Array, curr_pos : Vector3) : HouseSceneGrid
{
	var can_walk_grids : Array = new Array();
	for (var grid : HouseSceneGrid in use_grids)
	{
		if (IndoorPath.findPath(curr_pos, grid.GameObj.transform.position, hs))
		{
			can_walk_grids.Add(grid);
		}
	}
	if (0 == can_walk_grids.Count)
	{
		return null;
	}
	return HouseSceneGrid.getNearestGrid(can_walk_grids, curr_pos);
}
//--------------------------------------------------
// 获取可使用的格子,face:读取FurniInteract.xml里的使用面,二进制
private function getUseGrids(hsf : HouseSceneFloor, hold_grids : Array, distance : int, use_face : String, cur_face : int) : Array
{
	// 获取使用距离范围内的格子
	var around_grids : Array = HouseSceneGrid.getAroundGrids(hold_grids, hsf, distance);
	if (0 == around_grids.Count)
	{
		return around_grids;
	}
	// 对使用面进行反序转换(表格里面使用面是逆时针填写的),如1011 -> 1101
	var face : int[] = reverseUseFace(use_face);
	// 获取占据格子的x和z坐标的最大最小值
	var pos : int[] = new int[4];
	var grid : HouseSceneGrid = hold_grids[0];
	pos[0] = grid.X;	// max x
	pos[1] = grid.X;	// min x
	pos[2] = grid.Z;	// max z
	pos[3] = grid.Z;	// min z
	for (var hold_grid : HouseSceneGrid in hold_grids)
	{
		var x : int = hold_grid.X;
		var z : int = hold_grid.Z;
		pos[0] = x > pos[0] ? x : pos[0];
		pos[1] = x < pos[1] ? x : pos[1];
		pos[2] = z > pos[2] ? z : pos[2];
		pos[3] = z < pos[3] ? z : pos[3];
	}
	// 获取有效的可使用格子
	var use_grids : Array = new Array();
	for (var around_grid : HouseSceneGrid in around_grids)
	{
		if (checkUseFace(around_grid, face, cur_face, pos))
		{
			use_grids.Add(around_grid);
		}
	}
	return use_grids;
}
//--------------------------------------------------
// 反序使用面
private function reverseUseFace(use_face : String) : int[]
{
	if (4 != use_face.Length)
		throw "Error: FurnitureInteract -> reverseUseFace(String) -> parameter is wrong";
	
	var face : int[] = new int[4];
	if ('1' == use_face[3])	{ face[0] = 1; } else { face[0] = 0; }
	if ('1' == use_face[2])	{ face[1] = 1; } else { face[1] = 0; }
	if ('1' == use_face[1])	{ face[2] = 1; } else { face[2] = 0; }
	if ('1' == use_face[0])	{ face[3] = 1; } else { face[3] = 0; }
	return face;
}
//--------------------------------------------------
// 检查使用面
private function checkUseFace(around_grid : HouseSceneGrid, use_face : int[], cur_face : int, max_min_pos : int[]) : boolean
{
	// 判断格子是否在使用面上
	var x_max : int = max_min_pos[0];
	var x_min : int = max_min_pos[1];
	var z_max : int = max_min_pos[2];
	var z_min : int = max_min_pos[3];
	
	for (var i:int=0; i<4; ++i)
	{
		if (!use_face[i])
			continue;
		
		switch ((i + cur_face) % 4)
		{
		case 0:		// x
			if (around_grid.X > x_max) { return true; } break;
		case 1:		// -z
			if (around_grid.Z < z_min) { return true; } break;
		case 2:		// -x
			if (around_grid.X < x_min) { return true; } break;
		case 3:		// z
			if (around_grid.Z > z_max) { return true; } break;
		}
	}
	
	return false;
}
//--------------------------------------------------
// 请求行走计划(使用家具)
public static function request_walk_for_use_furniture(curr : Vector3, target : Vector3, instance_id : UInt64, template_id : int, function_id : int, status : int) : void
{
	var packet : req_walk_for_use_furniture = new req_walk_for_use_furniture();
	var temp_curr : point = new point();
	temp_curr.x = curr.x;
	temp_curr.y = curr.y;
	temp_curr.z = curr.z;
	var temp_target : point = new point();
	temp_target.x = target.x;
	temp_target.y = target.y;
	temp_target.z = target.z;
	packet.curr_pos = temp_curr;
	packet.dest_pos = temp_target;
	packet.instance_id = instance_id;
	packet.function_id = function_id;
	packet.furni_temp_id = template_id;
	packet.status = status;
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 处理通知开始使用家具消息,广播
private function handle_notify_start_use_furniture(evt : GameEvent, pack : notify_start_use_furniture) : void
{
	Debug.Log("=== account: "+pack.account+" = index: "+pack.position_index+" = instance_id: "+pack.instance_id+" = function_id: "+pack.function_id+" = pos: "+pack.walk_pos);
	var furni : HouseSceneComponent = null;
	if (DataCenter.isPlayerInHouse())
	{
		furni = EQGameSceneMgr.getSingleton().getHouse().getComponentByInstanceID(pack.instance_id);
	}
	if (DataCenter.isPlayerInCommonScene() || DataCenter.isPlayerInPubScene())
	{
		furni = EQGameSceneMgr.getSingleton().getCommScene().getComponentByInstanceID(pack.instance_id);
	}
	if (null==furni || null==furni.GameObj)
		return;
	
	var interact_row : FurniInteractRow = FurnitureDataHandler.getFurniInteractRow(pack.function_id);
	// 保存玩家位置
	savePlayerPos(pack.account, new Vector3(pack.walk_pos.x, pack.walk_pos.y, pack.walk_pos.z));
	// 开始人物交互
	startPlayerInteract(pack.account, furni, pack.position_index, interact_row);
	// 家具动画
	FurnitureComponent.startUseFurniture(furni, pack.position_index, interact_row);
}
//--------------------------------------------------
// 处理通知请求改变家具状态,广播
private function handle_notify_change_furniture_status(evt : GameEvent, pack : notify_change_furniture_status) : void
{
	Debug.Log("=== account: "+pack.account+" = instance_id: "+pack.instance_id+" = status: "+pack.new_status+" = function_id: "+pack.function_id);
	var furni : HouseSceneComponent = EQGameSceneMgr.getSingleton().getHouse().getComponentByInstanceID(pack.instance_id);
	if (null==furni || null==furni.GameObj)
		return;
	
	var interact_row : FurniInteractRow = FurnitureDataHandler.getFurniInteractRow(pack.function_id);
	// 改变家具状态
	FurnitureComponent.changeFurnitureState(furni, interact_row, pack.new_status);
}
//--------------------------------------------------
// 请求停止使用家具
public static function request_stop_use_furniture() : void
{
	var packet : req_stop_use_furniture = new req_stop_use_furniture();
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 处理通知请求停止家具消息,广播
private function handle_notify_stop_use_furniture(evt : GameEvent, pack : notify_stop_use_furniture) : void
{
	Debug.Log("=== account: "+pack.account+" = instance_id: "+pack.instance_id+" = pos_index: "+pack.position_index);
	var furni : HouseSceneComponent = null;
	if (DataCenter.isPlayerInHouse())
	{
		furni = EQGameSceneMgr.getSingleton().getHouse().getComponentByInstanceID(pack.instance_id);
	}
	if (DataCenter.isPlayerInCommonScene() || DataCenter.isPlayerInPubScene())
	{
		furni = EQGameSceneMgr.getSingleton().getCommScene().getComponentByInstanceID(pack.instance_id);
	}
	if (null==furni || null==furni.GameObj)
		return;
	
	DebugState = false;
	RoleObj = null;
	// 删除玩家位置
	delPlayerPos(pack.account);
	// 结束人物交互
	stopPlayerInteract(pack.account); 
	// 家具动画
	FurnitureComponent.stopUseFurniture(furni, pack.position_index);
}
//--------------------------------------------------
// 设置玩家的朝向
private function setPlayerFace(p : Player, furni_face : int, role_face : int) : void
{
	var face : int = furni_face + role_face - 2;	// 角色默认朝向为2,所以需要-2,方向才会正确
	if (face < 0)
	{
		face += 4;
	}
	else if (face >= 4)
	{
		face -= 4;
	}
	p.changeFace(face);
}
//--------------------------------------------------
// 获取玩家的位置偏移
private function getPlayerOffsetPos(furni_face : int, offset : Vector3) : Vector3
{
	if (1 == furni_face) return Vector3(offset.z, offset.y, -offset.x);
	if (2 == furni_face) return Vector3(-offset.x, offset.y, -offset.z);
	if (3 == furni_face) return Vector3(-offset.z, offset.y, offset.x);
	// 0 == furni_face
	return offset;
}
//--------------------------------------------------
// 设置人物动作
private function setPlayerAni(p : Player, role_ani : Array) : void
{
	Debug.LogWarning("==== set player ani: "+p.getAccount()+", anis: "+role_ani.ToString());
	var ani : String = CommFunc.randomOfArray(role_ani);
	if (null == ani)
		return;
	
	Debug.LogWarning("--- ani: "+ani);
	p.play(ani, WrapMode.Loop);
}
//--------------------------------------------------
// 开始人物交互
private function startPlayerInteract(account : String, furni : HouseSceneComponent, pos : int, row : FurniInteractRow) : void
{
	var player_obj : GameObject = ScenePlayerMgr.getPlayer(account);
	if (null == player_obj)
		throw Exception("FurnitureInteract -> startPlayerInteract(String, HouseSceneComponent, FurniInteractRow) -> can't find player account[" + account + "].");
	
	var p : Player = player_obj.GetComponent("Player");
	// 交互朝向
	setPlayerFace(p, furni.Face, row.role_face);
	// 交互坐标
	var fur_pos : Vector3 = furni.getAttachGrid().GameObj.transform.position;
	if (DebugState)	// 调试状态
	{
		player_obj.transform.position = fur_pos;
		RoleObj = player_obj;
		OldRolePos = fur_pos;
	}
	else
	{
		if (0 != row.offset_pos.Count)
		{
			if (pos >= row.offset_pos.Count)
				throw Exception("FurnitureInteract -> startPlayerInteract(String, HouseSceneComponent, FurniInteractRow) -> pos = "+pos+", row id = "+row.id+", offset pos count = "+row.offset_pos.Count+"!");
			
			player_obj.transform.position = fur_pos + getPlayerOffsetPos(furni.Face, row.offset_pos[pos]);
		}
	}
	// 人物动作
	setPlayerAni(p, row.role_ani);
	// 隐藏部位
	showHidePlayerPart(p, row.hide_part, false);
	// 保存交互信息
	savePlayerRow(account, row);
}
//--------------------------------------------------
// 结束人物交互
private function stopPlayerInteract(account : String) : void
{
	var player_obj : GameObject = ScenePlayerMgr.getPlayer(account);
	if (null == player_obj)
		throw Exception("FurnitureInteract -> stopPlayerInteract(String) -> can't find player account[" + account + "].");
	
	var p : Player = player_obj.GetComponent("Player");
	// 人物动作
	p.play("stand", WrapMode.Loop);
	// 显示部位
	var row : FurniInteractRow = getPlayerRow(account);
	showHidePlayerPart(p, row.hide_part, true);
	// 删除交互信息
	delPlayerRow(account);
}
//--------------------------------------------------
// 保存玩家位置
private function savePlayerPos(account : String, pos : Vector3) : void
{
	if (mPlayerPos.ContainsKey(account))
	{
		mPlayerPos[account] = pos;
		return;
	}
	mPlayerPos.Add(account, pos);
}
//--------------------------------------------------
// 删除玩家位置
private function delPlayerPos(account : String) : void
{
	var player_obj : GameObject = ScenePlayerMgr.getPlayer(account);
	if (mPlayerPos.ContainsKey(account))
	{
		player_obj.transform.position = mPlayerPos[account];
		mPlayerPos.Remove(account);
	}
}
//--------------------------------------------------
// 获取玩家位置
public function getPlayerPos(account : String) : Vector3
{
	if (mPlayerPos.ContainsKey(account))
	{
		return mPlayerPos[account];
	}
	return -Vector3.one;
}
//--------------------------------------------------
// 保存玩家家具交互信息
private function savePlayerRow(account : String, row : FurniInteractRow) : void
{
	if (mPlayerRow.ContainsKey(account))
	{
		mPlayerRow[account] = row;
		return;
	}
	mPlayerRow.Add(account, row);
}
//--------------------------------------------------
// 删除玩家家具交互信息
private function delPlayerRow(account : String) : void
{
	if (mPlayerRow.ContainsKey(account))
	{
		mPlayerRow.Remove(account);
	}
}
//--------------------------------------------------
// 获取玩家家具交互信息
private function getPlayerRow(account : String) : FurniInteractRow
{
	if (mPlayerRow.ContainsKey(account))
		return mPlayerRow[account];
	
	throw Exception("FurnitureInteract -> getPlayerRow(String) -> can't find funiture interact row which player account[" + account + "].");
}
//--------------------------------------------------
// 显示/隐藏角色部位
private function showHidePlayerPart(role : Player, part_arr : Array, show : boolean) : void
{
	if (1==part_arr.Count && 0==part_arr[0])	// 不隐藏
		return;
	
	// 1-帽子,2-服装,3-眼镜,4-背部,5-鞋子,6-手持,7-饰物
	for (var part : int in part_arr)
	{
		var part_name : String = "";
		switch (part)
		{
		case 1: part_name = "hat"; break;
		case 2: part_name = "clothes"; break;
		case 3: part_name = "glasses"; break;
		case 4: part_name = ""; break;
		case 5: part_name = "shoes"; break;
		case 6: part_name = ""; break;
		case 7: part_name = ""; break;
		default :
			throw Exception("FurnitureInteract -> showHidePlayerPart(Player, Array, boolean) -> part [" + part + "] is wrong!");
		}
		
		if ("" == part_name)
			continue;
		
		if (show)
			role.showEquip(part_name);
		else
			role.hideEquip(part_name);
	}
}
//--------------------------------------------------
// 玩家是否在进行家具交互
public function isInteractFurniture(account : String) : boolean
{
	return -Vector3.one != getPlayerPos(account);
}
//--------------------------------------------------
// 调试状态处理函数
private function handleDebug() : void
{
	if (DebugState && RoleObj)
	{
		RoleObj.transform.position = OldRolePos + Offset;
	}
	else
	{
		Offset = Vector3.zero;
	}
}
//--------------------------------------------------


