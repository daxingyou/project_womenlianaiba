/*--------------------------------------------------
登陆(2011/9/13 create by hezhr)
--------------------------------------------------*/
#pragma strict

private static var m_account:String = "";	// 登陆账号 
private static var m_password:String = "";	// 登陆密码
private static var m_nickname:String = "";	// 昵称
private static var m_sex:int = 0;			// 性别
private static var m_needSelectSex: boolean = false; // 是否需要选择性别
private static var bRepeatLogin : boolean = false;	// 重复登陆标志
public static var hasFinished = false;		// 是否已经登陆
public static var m_avoidRepeatLoginDia : boolean = false;	//避免重复登录对话框提示
//--------------------------------------------------
function Start()
{
	registEvent();
}
//--------------------------------------------------
// 注册事件
public function registEvent()
{
	// 网络消息事件
	NetHelper.RegistHandler(new notify_login_result(), handle_notify_login_result);
	NetHelper.RegistHandler(new notify_repeat_login(), handle_notify_repeat_login);
	NetHelper.RegistHandler(new notify_enter_game(), handle_notify_enter_game);
}
//--------------------------------------------------
// 连接服务器
public static function connect(account:String, password:String, ip:String, port:String, type:String, pfKey:String, iopenID:String, ch:int, srvid:int)
{
	m_account = account;
	m_password = password;
	
	// step1
	PlatformMgr.GetInstance().Init(type);
	// step2
	ExternalFlatform.InitPlatform();
	
	Debug.Log("Login -> connect()");
	if(NetHelper.Connect(ip, Convert.ToInt32(port), handleSocketEvent) == 0) {
		request_login(m_account, m_password, type, pfKey, iopenID, ch, srvid);
	} else {
		Debug.LogWarning("cannot connect server!!");
	}
}
//--------------------------------------------------
// 请求登陆
public static function request_login(acc:String, pw:String, appType:String, pfKey:String, iopenID:String, ch:int, srvid:int )
{
	Debug.Log("Login -> request_login()");
	var packet:req_login  = new req_login();
	packet.account = acc;
	packet.password = pw;
	packet.login_type = appType;
	packet.pf_key = pfKey;
	packet.version = Config.PROTO_VER;
	packet.iopenid = iopenID;
	packet.ch = ch;
	packet.srvid = srvid;
	NetHelper.Send(packet);
	
	// 利用空闲时间初始化iTweeniGUI, 不然首次使用iTweeniGUI会卡一下
	iTweeniGUI.Init(Camera.main.gameObject);
}
//--------------------------------------------------
// 
private static function calc_sex(): void
{
    m_needSelectSex = (m_sex != sex_type.st_girl) && (m_sex != sex_type.st_boy);
    //m_needSelectSex = true;
    
    if (m_needSelectSex) // 如果没有性别信息，默认性别为女
        m_sex = sex_type.st_girl;
        
	if (m_password == "girl")
	{
	    m_sex = sex_type.st_girl;
	}
	else if (m_password == "boy")
	{
	    m_sex = sex_type.st_boy;
	}
}

//--------------------------------------------------
// 处理登陆消息
private function handle_notify_login_result(evt:GameEvent, pack:notify_login_result)
{
	Debug.Log("Login -> handle_notify_login_result()");
	m_nickname = pack.nick_name;
	m_sex = pack.sex;
	
	calc_sex();
	
	if (login_result.lr_ok == pack.result)	// 登陆成功
	{
		AmbientMgr.StartFlag = true;
		request_enter_game();
	}
	else if (login_result.lr_no_roles == pack.result)	// 没有角色
	{
		AmbientMgr.StartFlag = false;
   	    Debug.Log("AppType = " + Global.AppType);
	    if (PlatformMgr.IsPlatYY())
	    {
    	    ExternalFlatform.initUserInfo();
    	}
    	else
    	{
	        showCreatePlayerUI();
	    }
	}
	else if (login_result.lr_fail == pack.result)	// 登陆失败
	{
		Debug.Log("login fail");
	}
	else if (login_result.lr_fail_version == pack.result)	
	{
	    UI.getUI().OpenMsgbox("", Define.getContent(5085),true); // TODO: 这个提示主要是为方便Debug, 发布时应把这个提示去掉 
		Debug.LogError("version error");
	}
	else if (login_result.lr_fail_pwd==pack.result || login_result.lr_fail_account==pack.result)	// 账号或密码错误
	{
		Debug.Log("login fail, password or account error");
	}
	else	// 其他错误
	{
		Debug.Log("login fail, unknow error. result:" + pack.result);
	}
}
//--------------------------------------------------
// 处理账号重复登陆消息
private function handle_notify_repeat_login(evt:GameEvent, pack:notify_repeat_login)
{
	//Debug.Log("notify_repeat_login");
	NetHelper.Close();
	
	bRepeatLogin = true;
	if(!m_avoidRepeatLoginDia)
		UI.getUI().OpenMsgbox("", Define.getContent(5086),Define.refresh,CallbackRefreshPage as iGUIEventCallback);
	//Application.LoadLevel(1);
}	
//--------------------------------------------------
// 客户端准备就绪后，请求进入游戏
public static function request_enter_game()
{
	var packet:req_enter_game = new req_enter_game();
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 处理进入游戏消息
private function handle_notify_enter_game(evt:GameEvent, pack:notify_enter_game)
{
	// 设置主玩家账号
	ScenePlayerMgr.setMainPlayerAccount(m_account);
	
	GameObject.Destroy(GameObject.Find("LightForCreatePlayer"));		

	//print("houseInstId:" + EQGameSceneMgr.getSingleton().GameScene.mInstance_id);
	UI.getUI().CloseUIRoot("LoginUI");
	UI.getUI().OpenUIRoot("MainUI");
	iGUICode_SettingPanelUI.openSettingPanel(0, 0, true);
	SpeakerComp.OpenSpeakerRoot();
	var main : Main = Camera.mainCamera.GetComponent("Main") as Main;
	main.enter_scene_ok(); 
	hasFinished = true;
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.LOGIN_OK));
	if(Global.CustomOpenID != "")
		PlayerFriend.GetInstance().ReqEnterFriendHouse(Global.CustomOpenID,enter_house_type.eht_friend_list);
}
//--------------------------------------------------
// 获取玩家账号
public static function getAccount():String
{
	return m_account;
}
//--------------------------------------------------
// 获取玩家昵称
public static function getNickName():String
{
	return m_nickname;
}
//--------------------------------------------------
// 获取玩家性别
public static function getSex():int
{
	return m_sex;
}
//--------------------------------------------------
// 
private static function handleSocketEvent(id:int, reason:String):void{
	Debug.Log("handleSocketEvent：" + id.ToString() + " " + reason);
	switch(id)
	{
	case GameSocket.NETWORK_CONNECT_ERROR:
		UI.getUI().OpenMsgbox("", Define.getContent(5087) + "\n(" + id.ToString()+")：" + reason, Define.refresh, CallbackRefreshPage as iGUIEventCallback);
		break;
	case GameSocket.NETWORK_ERROR:
		if(bRepeatLogin == false) {
			UI.getUI().OpenMsgbox("", Define.getContent(5088) + "\n(" + id.ToString()+")：" + reason, Define.refresh, CallbackRefreshPage as iGUIEventCallback);
		}
		break;
	}
}
//--------------------------------------------------
// 是否需要选择性别
public static function needSelectSex(): boolean
{
    return m_needSelectSex;
}
//--------------------------------------------------

private static function CallbackRefreshPage(callback : iGUIElement) {
	ExternalFlatform.ReloadPage();
}

public static function setRepeatLoginFlag(isRepeatLogin : boolean) : void
{
	bRepeatLogin = isRepeatLogin;
}

//--------------------------------------------------
public static function setUserName(name: String): void
{
    m_nickname = name;
}
//--------------------------------------------------
public static function setUserSex(sex: String): void
{
   	if (sex == "0")
   	{
   	    m_sex = sex_type.st_girl;
   	}
   	else if (sex == "1")
   	{
   	    m_sex = sex_type.st_boy;
   	}
   	else
   	{
   	    m_sex = 0;
   	}
}
//--------------------------------------------------
static function showCreatePlayerUI(): void
{
	Global.changeQuality(true);
	AmbientMgr.getSingleton().changeDayNight(true, true);
	if (!UI.isUIRootOpen("CreatePlayerUI"))
	{
		if ("yy" == Global.AppType)
		{
			calc_sex();
		}
		UI.getUI().CloseUIRoot("LoginUI");
		UI.getUI().OpenUIRoot("CreatePlayerUI");
	}	
}
//--------------------------------------------------