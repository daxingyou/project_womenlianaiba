#pragma strict
#pragma downcast

/*----------------------------------------------------------------------------------------------------
管理场景和玩家的类(2011/10/11 create by hezhr)
----------------------------------------------------------------------------------------------------*/

private static var m_instance : ScenePlayerMgr = null;
private static var m_mainPlayerLoverAccount : String = "";
private static var m_mainPlayerAccount:String = "";
private static var m_mainPlayer:GameObject = null;
private static var m_mainPlayerHouseData:house_info = null;
private static var m_scene:EQGameScene = null;
private static var m_playerList:Hashtable = new Hashtable();				// 房屋里的玩家列表
private var m_clickGameObj : GameObject = null;								// 鼠标点击的模型
private var m_srcColor : Hashtable = new Hashtable();						// 角色原始颜色
public var HighLight : Color = Color(0.17, 0.17, 0.17, 0.0);				// 高品质角色高亮
public var LowLight : Color = Color(0.43, 0.43, 0.43, 0.0);					// 低品质角色高亮
public var HighQualityColor : Color = Color(0.46, 0.46 ,0.46, 1.0);			// 高品质玩家皮肤颜色
public var LowQualityColor : Color = Color(0.88, 0.88 ,0.88, 1.0);			// 低品质玩家皮肤颜色

//--------------------------------------------------
function Awake()
{
	m_instance = this;
}
function Start()
{
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_MOUSE_IN_MODEL), _mouseInPlayer);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_MOUSE_OUT_MODEL), _mouseOutPlayer);
}
function Update()
{
	// 点击角色模型
	_clickPlayer();
}
//--------------------------------------------------
public static function getInstance() : ScenePlayerMgr
{
	if (null == m_instance)
	{
		throw new Exception("ScenePlayerMgr -> instance is null!");
	}
	return m_instance;
}
//--------------------------------------------------
// 点击角色操作
private function _clickPlayer()
{
	// in fitment state, it can't click scene
	if (FitmentLogic.getInstance().inFitmenting)
	{
		return;
	}
	if (UI.getUI().IsMouseOverUI())	// 鼠标在界面上
	{
		return;
	}
	if (Input.GetMouseButtonDown(0))
	{
		_leftButtonDown();
	}
	if (Input.GetMouseButtonUp(0))
	{
		_leftButtonUp();
	}
}
//--------------------------------------------------
// 鼠标左键按下
private function _leftButtonDown()
{
	m_clickGameObj = PickMgr.getSingleton().getPickObject();
}
//--------------------------------------------------
// 鼠标左键弹起
private function _leftButtonUp()
{
	if (m_clickGameObj && m_clickGameObj==PickMgr.getSingleton().getPickObject())
	{
		if (isPlayer(m_clickGameObj))
		{
			var pare_obj : GameObject = m_clickGameObj.transform.parent.gameObject;
			
			var all_house : boolean = (1 == UpDownStair.getViewFloorNum() ? false : true);
			var grid : HouseSceneGrid = PlayerMove.getClickGrid(all_house);
			var player_floor : int = UpDownStair.getFloorNumByPos(pare_obj.transform.position);
			if (grid && grid.Creator.FloorNO != player_floor)	// 点击的格子和点击的人物不在同一层
			{
				return;
			}
			
			if (PropUseLogic.getInstance().IsProUseToOther() && !isMainPlayer(pare_obj.GetComponent(Player).getAccount()))
			{
				EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_USE_ITEM_WITH_PRO), pare_obj);
			}
			else if (PropUseLogic.getInstance().IsProUseToSelf() && isMainPlayer(pare_obj.GetComponent(Player).getAccount()))
			{
				EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_USE_ITEM_WITH_PRO), pare_obj);
			}
			else if (PropUseLogic.getInstance().IsProUseToAll())
			{
				EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_USE_ITEM_WITH_PRO), pare_obj);
			}
			else
			{
				EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_CLICK_PLAYER), pare_obj);
			}
		}
	}
}
//--------------------------------------------------
// 鼠标移进角色模型
private function _mouseInPlayer(evt:GameEvent, obj:GameObject)
{
	if (false == isPlayer(obj))
		return;
	
	if (obj.renderer)
	{
		for (var mat : Material in obj.renderer.materials)
		{
			if (!m_srcColor.Contains(mat.GetInstanceID()))
			{
				m_srcColor.Add(mat.GetInstanceID(), mat.color);
			}
			mat.color += Global.isHighQuality() ? HighLight : LowLight;
		}
	}
}
//--------------------------------------------------
// 鼠标移出角色模型
private function _mouseOutPlayer(evt:GameEvent, obj:GameObject)
{
	if (false == isPlayer(obj))
		return;
	
	if (obj.renderer)
	{
		for (var mat : Material in obj.renderer.materials)
		{
			if (m_srcColor.Contains(mat.GetInstanceID()))
				mat.color = m_srcColor[mat.GetInstanceID()];
		}
		m_srcColor.Clear();
	}
}
//--------------------------------------------------
// 判断是否是角色模型
public static function isPlayer(obj:GameObject):boolean
{
	if (null == obj)
		return false;
	
	if (obj.GetComponent(Player))
		return true;
	
	var pare : Transform = obj.transform.parent;
	if (null == pare)
		return false;
	
	if (pare.gameObject && pare.gameObject.GetComponent(Player))
		return true;
	
	return false;
}
//--------------------------------------------------
// 设置主玩家账号
public static function setMainPlayerAccount(account:String):void
{
	if ("" == m_mainPlayerAccount)
	{
		m_mainPlayerAccount = account;
	}
}
//--------------------------------------------------
// 设置主玩家房屋数据
public static function setMainPlayerHouseData(data : house_info):void
{
	if (null == m_mainPlayerHouseData)
	{
		m_mainPlayerHouseData = data;
		return;
	}
	var basic_data : player_basic_data = getMainPlayerData();
	if (data.house_id == basic_data.house_id)
	{
		m_mainPlayerHouseData = data;
	}
}
//--------------------------------------------------
// 主玩家是否单身
public static function isMainPlayerSingle():boolean
{
	if (""==m_mainPlayerHouseData.boy || ""==m_mainPlayerHouseData.girl)
		return true;
	
	return false;
}
//--------------------------------------------------
// 获取主玩家账号
public static function getMainPlayerAccount():String
{
	return m_mainPlayerAccount;
}
//--------------------------------------------------
// 获取主玩家房屋数据
public static function getMainPlayerHouseData() : house_info
{
	return m_mainPlayerHouseData;
}
//--------------------------------------------------
// 是否为主玩家
public static function isMainPlayer(account:String):boolean
{
	if (account == m_mainPlayerAccount)
	{
		return true;
	}
	return false;
}
//--------------------------------------------------
// 是否为主玩家
public static function isMainPlayer(go : GameObject) : boolean
{
	if (isPlayer(go) && go.GetComponent("MainPlayer"))
		return true;
	
	return false;
}
//--------------------------------------------------
// 获取主玩家
public static function getMainPlayer():GameObject
{
	if (null == m_mainPlayer)
	{
		m_mainPlayer = GameObject.FindWithTag("MainPlayer");
	}
	return m_mainPlayer;
}
//--------------------------------------------------
// 获取主玩家名字
public static function getPlayerName() : String
{
	var MainPlayer:GameObject = getMainPlayer();
	var player : Player = MainPlayer.GetComponent("Player") as Player;
	return player.getName();
}
//--------------------------------------------------
// 获取主玩家数据
public static function getMainPlayerData() : player_basic_data
{
	var main_player : GameObject = getMainPlayer();
	if (null == main_player)
		return null;
	
	var p : Player = main_player.GetComponent("Player");
	return p.getBasicData();
}
//--------------------------------------------------
// 设置场景
public static function setScene(scene:EQGameScene):void
{
	m_scene = scene;
}
//--------------------------------------------------
// 获取场景
public static function getScene():EQGameScene
{
	return m_scene;
}
//--------------------------------------------------
// 获取玩家列表
public static function getPlayerList():Hashtable
{
	return m_playerList;
}
//--------------------------------------------------
// 获取玩家
public static function getPlayer(account:String):GameObject
{
	if (isMainPlayer(account))
	{		    
		return getMainPlayer();
	}
	
	if (m_playerList.ContainsKey(account))
	{		   
		return m_playerList[account];
	}
	
	Debug.LogWarning("not find player: " + account);
	return null;
}
//--------------------------------------------------
// 添加玩家
public static function addPlayer(account:String, player:GameObject):void
{
	if (isMainPlayer(account) || m_playerList.ContainsKey(account))
	{
		return;
	}
	m_playerList.Add(account, player);
}
//--------------------------------------------------
// 移除玩家
public static function removePlayer(account:String):void
{
	if (!m_playerList.ContainsKey(account))
	{
		return;
	}
	
	//transform destroy
	var plr:GameObject = getPlayer(account);
	if (plr != null)
	{
		var trans : PlayerTransform = plr.GetComponent(PlayerTransform);
		trans.Destroy();
	}
	
	CharacterFactory.DestroyPlayer(m_playerList[account]);
	m_playerList.Remove(account);
}
//--------------------------------------------------
// 清空所有玩家
public static function clearPlayer():void
{
	for (var kv : DictionaryEntry in m_playerList)
	{
		//destroy transform
		var plr : GameObject = kv.Value;
		var trans : PlayerTransform = plr.GetComponent(PlayerTransform);
		trans.Destroy();
		
		CharacterFactory.DestroyPlayer(kv.Value);
	}
	m_playerList.Clear();
}
//--------------------------------------------------
// 玩家移动类型
public static function notifyWalkType(account:String, type:int):void
{
	var player:GameObject = getPlayer(account);
	if (null == player)
		return;
	
	var pm : PlayerMove = player.GetComponent(PlayerMove);
	if (pm)
	{
		pm.setWalkType(type);
	}
}
//--------------------------------------------------
// 玩家开始移动
public static function notifyStartWalk(account:String, dest:Vector3):void
{
	var player:GameObject = getPlayer(account);
	if (!player)
	{
		return;
	}
	
	var p:Player = player.GetComponent(Player);
	var pm:PlayerMove = player.GetComponent(PlayerMove);
	if (pm)
		pm.startWalk(dest, p);
	
	if(isMainPlayer(account))
	{
		var mainPlayer : MainPlayer = getMainPlayer().GetComponent("MainPlayer") as MainPlayer;
		mainPlayer.ShowMoveDest(true, dest);
	}
}
//--------------------------------------------------
// 玩家停止移动
public static function notifyStopWalk(account:String, dest:Vector3):void
{
	var player:GameObject = getPlayer(account);
	if (!player)
	{
		return;
	}
	var p:Player = player.GetComponent(Player);
	player.GetComponent(PlayerMove).stopWalk(dest, p);
	
	if(isMainPlayer(account))
	{
		var mainPlayer : MainPlayer = getMainPlayer().GetComponent("MainPlayer") as MainPlayer;
		mainPlayer.ShowMoveDest(false, dest);
		
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_MAIN_PLAYER_STOP_WALK));
	}
}
//--------------------------------------------------
// 创建玩家
public static function createPlayer(data:player_basic_data):GameObject
{
    // 先移除，防止bug
	removePlayer(data.account);
	
    var p: GameObject = CreateRole.createPlayer(data, false);
    addPlayer(data.account, p);
    return p;
}
//--------------------------------------------------
public static function SetMainPlayerLoverAccount(account : String){
	m_mainPlayerLoverAccount = account;
}
//--
public static function GetMainPlayerLoverAccount() : String {
	return m_mainPlayerLoverAccount;
}
//--
public static function IsMainPlayerLoverAccount(acc : String) : boolean{
	if(acc == m_mainPlayerLoverAccount){
		return true;
	}
	return false;
}
//--------------------------------------------------
// 设置游戏高低品质
public function setHighLowQuality(high : boolean) : void
{
	var col : Color = high ? HighQualityColor : LowQualityColor;
	var p : Player = null;
	// 主玩家
	var m_player : GameObject = getMainPlayer();
	if (m_player)
	{
		p = m_player.GetComponent("Player");
		if (p)
			p.setSkinColor(col);
	}
	// 其他玩家
	for (var kv : DictionaryEntry in m_playerList)
	{
		p = (kv.Value as GameObject).GetComponent("Player");
		if (p)
			p.setSkinColor(col);
	}
}
//--------------------------------------------------