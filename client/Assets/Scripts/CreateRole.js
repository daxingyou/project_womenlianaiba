#pragma strict
#pragma downcast

/*--------------------------------------------------
创建角色(2011/9/20 create by hezhr)
--------------------------------------------------*/
class CreateRole
{
    //--------------------------------------------------
    // 成员 
    private var m_playerPreview: PlayerPreview; // 玩家预览
    private var m_player: GameObject;
    private var m_funFinish: Function;

    
    function CreateRole(funFinish)
    {
        m_funFinish = funFinish;
    }
    	
	//--------------------------------------------------
	// 设置性别
	function setSex(sex: int)
	{
        m_playerPreview = new PlayerPreview(CreateRoleConfig.data, sex);
        showPlayer(sex);
	}
	
	//--------------------------------------------------
	// 初始化
	function init()
	{
        registEvent();
        var cam : Camera = Camera.main;
        enableMainCameraScript(false);        
        cam.gameObject.AddComponent("Backdrop");  	
        cam.transform.position = Vector3(0, 0, 0);         
        cam.transform.eulerAngles = Vector3(CreateRoleConfig.data["camera_angle_x"], 0, 0);       
	}
	
	//--------------------------------------------------
	// 注册事件
	function registEvent()
	{
	    EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.ROLE_CREATE_OK), role_create_ok);

		// 网络消息事件
		NetHelper.RegistHandler(new notify_create_role_result(), handle_notify_create_role_result);
	}
	//--------------------------------------------------
	// 请求创建角色
	static function request_create_role(basic_data:player_basic_data, equips:item[])
	{
		var packet:req_create_role = new req_create_role();
		packet.basic_data = basic_data;
		packet.iopenid = Global.IopenID;
		packet.basic_data.produce_level = 1;
		for (var equip:item in equips)
		{		    
			packet.equips.Add(equip);
		}
		NetHelper.Send(packet);
	}
	//--------------------------------------------------
	// 处理请求创建角色消息
	private function handle_notify_create_role_result(evt:GameEvent, pack:notify_create_role_result)
	{
		if (create_role_result.rr_ok == pack.result)	// 创建角色成功
		{
			// 触发创建角色成功事件
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ROLE_CREATE_OK));
		}
		else if (create_role_result.rr_fail == pack.result)	// 创建角色失败
		{
		}
	}
	
	//--------------------------------------------------
	// 
	function getPlayer(): Player
	{
	    if (!m_player)
	        return null;
   	    return m_player.GetComponent(Player);
	}
	//--------------------------------------------------
	// 
	static function createPlayerBySex(sex:int):GameObject
	{
	    var data: player_basic_data = new player_basic_data();
	    data.sex = sex;
	    data.hair = 0;
        data.beard = 0;
        data.face = 0;
        data.skin_color = 0;
        data.hair_color = 0;   
	    return createPlayer(data);  
	}
	
	//--------------------------------------------------
	// 
	static function createPlayer(data:player_basic_data):GameObject
	{
	    return createPlayer(data, true);
	}

	//--------------------------------------------------
	// 
	static function createPlayer(data:player_basic_data, canWear: boolean):GameObject
	{
	    return CharacterFactory.createPlayer(data, canWear);
	}

    //--------------------------------------------------
    // 
    function role_create_ok(evt:GameEvent, obj:System.Object)
    { 
    	enableMainCameraScript(true);
    	// 删除背景脚本
		GameObject.Destroy(Camera.main.GetComponent("Backdrop"));		
		// 删除背景图
		GameObject.Destroy(Camera.main.transform.Find("Backdrop").gameObject);		
		       
	    UI.getUI().CloseUIRoot("CreatePlayerUI");
	    CharacterFactory.DestroyPlayer(m_player);
	    Login.request_enter_game();
	    InformationCollect.sendDeviceInfo(Global.OpenID);
    }
    
	//--------------------------------------------------
	private function getXYZ(sSex: String, sKey: String): Boo.Lang.Hash
	{
	    var dic: Boo.Lang.Hash = (CreateRoleConfig.data[sSex] as Boo.Lang.Hash);
	    return (dic[sKey] as Boo.Lang.Hash);
	}
	//--------------------------------------------------
	private function getSingle(dic: Boo.Lang.Hash, sKey: String): Single
	{
	    return dic[sKey];
	}
	//--------------------------------------------------
	// 
    function showPlayer(sex: int)
    {
		CharacterFactory.DestroyPlayer(m_player);
    	
	    m_player = createPlayerBySex(sex);	  
        m_player.AddComponent("PlayerAnimationLoop");


        var pos: Boo.Lang.Hash;
        var rot: Boo.Lang.Hash;            
        if (sex == sex_type.st_boy)
        {            
            pos = getXYZ("boy", "position");
            rot = getXYZ("boy", "rotation");           
        }
        else
        {   
            pos = getXYZ("girl", "position");
            rot = getXYZ("girl", "rotation");           
        }
        m_player.transform.position = Vector3(getSingle(pos, "x"), getSingle(pos, "y"), getSingle(pos, "z"));
   	    m_player.transform.eulerAngles = Vector3(getSingle(rot, "x"), getSingle(rot, "y"), getSingle(rot, "z"));
    }

	//--------------------------------------------------
	// 
    function reqCreateRole(hair, beard, face, hairColor, skinColor, clothesItemID, shoesItemID)
    {        
	    // 
	    var data:player_basic_data = new player_basic_data();
	    data.account = Login.getAccount();
	    data.username = Login.getNickName();
	    data.sex = getSex();
	    data.skin_color = skinColor;
	    data.face = face;
	    data.beard = beard;
	    data.hair = hair;
	    data.hair_color = hairColor;
	    data.online_time = 0.0;
	    data.house_id = 0;
	    data.first_photo_player = "";
	    // 
	    var e_1:item = new item();
	    e_1.template_id = 0;
	    var e_2:item = new item();
	    e_2.template_id = clothesItemID;
	    var e_3:item = new item();
	    e_3.template_id = 0;
	    var e_4:item = new item();
	    e_4.template_id = 0;
	    var e_5:item = new item();
	    e_5.template_id = 0;
	    var e_6:item = new item();
	    e_6.template_id = shoesItemID;
	    var e_7:item = new item();
	    e_7.template_id = 0;
	    var e_8:item = new item();
	    e_8.template_id = 0;
	    var equips:item[] = new item[8];
	    equips[0] = e_1;
	    equips[1] = e_2;
	    equips[2] = e_3;
	    equips[3] = e_4;
	    equips[4] = e_5;
	    equips[5] = e_6;
	    equips[6] = e_7;
	    equips[7] = e_8;
	    request_create_role(data, equips);
    }

	//--------------------------------------------------
	// 旋转玩家
    function rotatePlayer(bReverse)
    {
        if (!m_player)
            return;
            
        var angleY: Single = getSingle(CreateRoleConfig.data["rotate_setting"] as Boo.Lang.Hash, "angle"); // 每次旋转的角度
        var time: Single = getSingle(CreateRoleConfig.data["rotate_setting"] as Boo.Lang.Hash, "time");  // 每次旋转的时间
       
        if (bReverse)
            angleY = - angleY;
        m_player.transform.Rotate(0, Time.deltaTime * angleY / time, 0, Space.World);
//	    iTween.RotateAdd(m_player, Vector3(0, angleY, 0), time);    
    } 
    
    //--------------------------------------------------
    function prevHair()
    {    
    	m_playerPreview.prevHair();
        getPlayer().addPart("hair", m_playerPreview.hairList.current(), m_funFinish);   
        getPlayer().changeMaterial("hair", m_playerPreview.hairMatList.current(), m_funFinish);	
    }
    
    //--------------------------------------------------
    function nextHair()
    {    
    	m_playerPreview.nextHair();
        getPlayer().addPart("hair", m_playerPreview.hairList.current(), m_funFinish);   
        getPlayer().changeMaterial("hair", m_playerPreview.hairMatList.current(), m_funFinish);
    }    
    	
    //--------------------------------------------------
    function prevHairColor()
    {    
	    m_playerPreview.prevHairColor();
        getPlayer().changeMaterial("hair", m_playerPreview.hairMatList.current(), m_funFinish);
        if (getSex() == sex_type.st_boy)
        {
            if (!isEmpty(m_playerPreview.beardList.current()))
                getPlayer().changeMaterial("beard", m_playerPreview.beardMatList.current(), m_funFinish);
        }
    }

    //--------------------------------------------------
    function nextHairColor()
    {    
	    m_playerPreview.nextHairColor();
        getPlayer().changeMaterial("hair", m_playerPreview.hairMatList.current(), m_funFinish);
        if (getSex() == sex_type.st_boy)
        {
            if (!isEmpty(m_playerPreview.beardList.current()))
                getPlayer().changeMaterial("beard", m_playerPreview.beardMatList.current(), m_funFinish);
        }
    }    
    
    //--------------------------------------------------
    function prevFace()
    {    
	    m_playerPreview.prevFace();
        getPlayer().addPart("face", m_playerPreview.faceList.current(), m_funFinish);   
        getPlayer().changeMaterial("face", m_playerPreview.faceMatList.current(), m_funFinish);
    }
    
    //--------------------------------------------------
    function nextFace()
    {    
    	m_playerPreview.nextFace();
        getPlayer().addPart("face", m_playerPreview.faceList.current(), m_funFinish);   
        getPlayer().changeMaterial("face", m_playerPreview.faceMatList.current(), m_funFinish);
    }    
    
    //--------------------------------------------------
    function applyBeard(view: PlayerPreview, com: Player)
    {
        if (isEmpty(view.beardList.current()))
        {
            com.removePart("beard", sex_type.st_boy);
            if (m_funFinish)
                m_funFinish();
        }
        else
        { 
            com.addPart("beard", view.beardList.current(), m_funFinish);       
            com.changeMaterial("beard", view.beardMatList.current(), m_funFinish);
        }
    }
    
    //--------------------------------------------------
    function prevBeard()
    {    
        m_playerPreview.prevBeard();
        applyBeard(m_playerPreview, getPlayer());
    }
        
    //--------------------------------------------------
    function nextBeard()
    {    
        m_playerPreview.nextBeard();        
        applyBeard(m_playerPreview, getPlayer());
    }
    
    //--------------------------------------------------
    function setPlayerSkin(idx: int)
    {
        m_playerPreview.setSkinColor(idx);
        getPlayer().changeMaterial("base", m_playerPreview.bodyMatList.current(), m_funFinish);
        getPlayer().changeMaterial("face", m_playerPreview.faceMatList.current(), m_funFinish);
        getPlayer().ChangePlayerEyelid("eyelid", m_playerPreview.eyelidMatList.end(), m_funFinish);
        getPlayer().ChangeEyelidColor(m_playerPreview.eyelidMatList.current());
    }

    //--------------------------------------------------
    function setPlayerClothes(idx: int)
    {
        m_playerPreview.clothesList.setIndex(idx);
        getPlayer().changeClothes(m_playerPreview.clothesList.current(), m_funFinish);
    }
    //--------------------------------------------------
    function setPlayerShoes(idx: int)
    {
        m_playerPreview.shoesList.setIndex(idx);
        
        var s: String = Player.getDressModel(m_playerPreview.shoesList.current());
        getPlayer().addPart("shoes", s, m_funFinish);
    }
    //--------------------------------------------------
    function reqCreateRole()
    {
        reqCreateRole(m_playerPreview.hairList.index,
                      m_playerPreview.beardList.index,   
                     m_playerPreview.faceList.index,   
                     m_playerPreview.getHairColorIndex(),
                     m_playerPreview.getSkinColorIndex(),
                     m_playerPreview.clothesList.current(),
                     m_playerPreview.shoesList.current()                     
                                           );
    }
    //--------------------------------------------------
	function enableMainCameraScript(bActive: boolean)
	{
	    var cam = Camera.main;
        for (var script: MonoBehaviour in cam.GetComponents(MonoBehaviour)) 
        {  
            script.enabled = bActive;
        }
	}
    //--------------------------------------------------
    function getSex(): int
    {
        return m_playerPreview.getSex();
    }
    //--------------------------------------------------
    private static function isEmpty(obj)
    {
        return !obj || (obj == "");
    }
    
}