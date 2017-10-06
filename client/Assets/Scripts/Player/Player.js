/*----------------------------------------------------------------------------------------------------
玩家组件(2011/10/8 create by hezhr)
----------------------------------------------------------------------------------------------------*/
#pragma strict
#pragma downcast

import iGUI;

class EquipParticle {
	public var part : String;
	public var loader : EquipParticleLoad;
}

var chg_eyelid_interval : int = 50;
private var m_basicData:player_basic_data = null;	// 玩家基本数据
private var m_model:Model = null;	// 玩家模型
private var m_headup : iGUILabel = null;
private var change_eyelid_interval : float = 0;
private var start_change_eyelid_time : float = 0;
private var eyeLidOpened_mat : String = "";
private var eyeLidClosed_mat : String = "";
private var m_hideEquip : List.<String> = new List.<String>();			// 隐藏的装备部位
private var m_childEvents : Dictionary.<String, ChildModelLoadEvent> = new Dictionary.<String, ChildModelLoadEvent>();	// 子部位模型加载事件
private var m_particleEvents : ArrayList = new ArrayList();		//struct EquipParticle;
private var m_oldHair : String = "";			// 旧的发型
private var m_oldHairColor : String = "";		// 旧的发色
private var m_isVisible : boolean = true;		// 是否显示

//--------------------------------------------------
function Update()
{
	if(!m_headup)
	{
		//setBasicData的时候有可能没创建出来，放这里创建
		var headup_root:iGUIRoot = UI.getUI().OpenUIRoot("PlayerHeadupRoot");
		m_headup = headup_root.addElement("iGUILabel", Rect(0,0,100,20));
		m_headup.style.alignment = TextAnchor.MiddleCenter;
		m_headup.style.wordWrap  = false;
		m_headup.style.fontSize = 15;
		m_headup.style.fontStyle = FontStyle.Bold;
		UI.getUI().SetIgnoreMouseOver(m_headup, true);
	}
	else
	{
		var pos:Vector3 = this.gameObject.GetComponent(PlayerMove).getPos();
		var c:Vector3 = Camera.main.WorldToScreenPoint( pos + Vector3(0,1.8f,0));

		if(c.z > 0)
		{
			var x = c.x - m_headup.positionAndSize.width/2;
			if(x<2 && x>0) x=2;
			else if(x>-2 && x<0) x=-2;
			m_headup.setX(x);
			var y = Camera.main.pixelHeight - c.y - m_headup.positionAndSize.height;
			if(y<2 && y>0) y=2;
			else if(y>-2 && y<0) y=-2;
			m_headup.setY(y);

			m_headup.label.text = Global.GetKeyWordShield().Search(m_basicData.username);
			var size : Vector2 = m_headup.style.CalcSize(m_headup.label);
			m_headup.setWidth(size.x);
			m_headup.setHeight(size.y);
			m_headup.enabled = true;
		}
		else
		{
			m_headup.enabled = false;
		}
	}

	//--换眼皮
	if(start_change_eyelid_time != 0 && change_eyelid_interval != 0){
		if(Time.time - start_change_eyelid_time > change_eyelid_interval){
			if (m_model && m_model.asynCtrl.isMainLoaded()){
				ChangePlayerEyelid("eyelid", eyeLidClosed_mat, null);
				InitChangeEyelidStartTime(0);
				//InitChangeEyelidInterval(Random.Range(1,5));
				StartOpenEyelid();
			}
		}
	}
}
//--------------------------------------------------
// 设置人物模型
public function setModel(m : Model) : void
{
	if (null == m)
		throw new Exception("Player -> setModel(Model) -> m is null!");

	if (m_model)
	{
		m_model.destroyGameObj();
		m_model = null;
	}

	m_model = m;

	if (!m.isNull())
	{
		CommFunc.setParent(this.gameObject, m.getGameObj());
	}
}
//--------------------------------------------------
// 获取人物模型
public function getModel() : Model
{
	return m_model;
}
//--------------------------------------------------
// 获取人物模型对象
public function getModelObj() : GameObject
{
	if (hasModel())
	{
		return m_model.getGameObj();
	}
	return null;
}
//--------------------------------------------------
// 玩家是否有模型
public function hasModel() : boolean
{
	if (m_model && !m_model.isNull())
	{
		return true;
	}
	return false;
}
//--------------------------------------------------
// 销毁玩家实例
public function destroy() : void
{
	var headup_root : iGUIRoot = UI.getUI().OpenUIRoot("PlayerHeadupRoot");
	if (headup_root && m_headup)
	{
		headup_root.removeElement(m_headup);
	}

	m_model.destroyGameObj();
}
//--------------------------------------------------
// 改变上衣
public function changeClothes(clothesItemID : int) : void
{
    changeClothes(clothesItemID, null);
}
//--------------------------------------------------
// 改变上衣
public function changeClothes(clothesItemID : int, funFinish : Function) : void
{
    _addPart("clothes", getDressModel(clothesItemID), funFinish);
    // 找到服装对应的身体,
    _addPart("base", getDressBody(clothesItemID), funFinish);
}
//--------------------------------------------------
// 添加/改变部位,part:face头部,hair头发,beard胡子 shoes鞋子
public function addPart(part : String, resc : String) : void
{
    addPart(part, resc, null);
}
//--------------------------------------------------
// 添加/改变部位,part:face头部,hair头发,beard胡子,shoes鞋子
public function addPart(part : String, resc : String, funFinish : Function) : void
{
    if ("base"==part || "clothes"==part)
        return;

    _addPart(part, resc, funFinish);
}
//--------------------------------------------------
// 添加/改变部位,part:base身体,face头部,hair头发,beard胡子,clothes衣服,shoes鞋子,ring戒指
private function _addPart(part : String, resc : String, funFinish : Function) : void
{
	var temp : String = "";
	if ("base"==part || "face"==part || "hair"==part || "beard"==part)	// 模型部位
	{
		temp = CharacterFactory.ROLE_DIR + resc;
	}
	else if ("clothes"==part || "shoes"==part)	// 衣服部位
	{
		temp = CharacterFactory.CLOTHES_DIR + resc;
	}
	else
	{
		throw new Exception("Player -> addPart(String, String, Function) -> part [" + part + "] is wrong!");
	}

	if (null==resc || ""==resc)
		throw new Exception("Player -> addPart(String, String, Function) -> part [" + part + "], resc is null!");

	m_model.asynCtrl.addOrProcessEvent(new PartModelLoadEvent(part, temp, funFinish));
}
//--------------------------------------------------
// 移除部位
public function removePart(part : String, sex: int) : void
{
	m_model.removePart(part);
	m_model.combine();
	if ("clothes" == part)	// 穿默认衣服
	{
		changeClothes(getDefaultClothID(sex));
	}
}
//--------------------------------------------------
// 显示装备
public function showEquip(equip : String) : void
{
	if (false == m_hideEquip.Contains(equip))
		return;

	m_hideEquip.Remove(equip);
	var body : ArrayList = m_basicData.body;
	var pg : pack_grid = null;

	if ("hat" == equip)					// 帽子
	{
		pg = body[0] as pack_grid;
		if (0!=pg.item_data.template_id && !TimeEffect.getInstance().isMature(pg.item_data.del_time))
		{
			addHat(getDressModel(pg.item_data.template_id),getDressBody(pg.item_data.template_id),getDressParticleResc(pg.item_data.template_id),getDressParticleAttach(pg.item_data.template_id));
		}
	}
	else if ("clothes" == equip)		// 衣服
	{
		pg = body[1] as pack_grid;
		if (0!=pg.item_data.template_id && !TimeEffect.getInstance().isMature(pg.item_data.del_time))
		{
			changeClothes(pg.item_data.template_id);
		}
	}
	else if ("glasses" == equip)		// 眼镜
	{
		pg = body[2] as pack_grid;
		if (0!=pg.item_data.template_id && !TimeEffect.getInstance().isMature(pg.item_data.del_time))
		{
			addGlasses(getDressModel(pg.item_data.template_id),getDressParticleResc(pg.item_data.template_id),getDressParticleAttach(pg.item_data.template_id));
		}
	}
	else if ("ring" == equip)		// 眼镜
	{
		pg = body[3] as pack_grid;
		if (0!=pg.item_data.template_id && !TimeEffect.getInstance().isMature(pg.item_data.del_time))
		{
			addRing(getDressModel(pg.item_data.template_id),getDressParticleResc(pg.item_data.template_id),getDressParticleAttach(pg.item_data.template_id));
		}
	}
	else if ("cloak" == equip)			// 鞋子
	{
		pg = body[4] as pack_grid;
		if (0!=pg.item_data.template_id && !TimeEffect.getInstance().isMature(pg.item_data.del_time))
		{
			addCloak(getDressModel(pg.item_data.template_id),getDressParticleResc(pg.item_data.template_id),getDressParticleAttach(pg.item_data.template_id));
		}
	}
	else if ("shoes" == equip)			// 鞋子
	{
		pg = body[5] as pack_grid;
		if (0!=pg.item_data.template_id && !TimeEffect.getInstance().isMature(pg.item_data.del_time))
		{
			addPart("shoes", getDressModel(pg.item_data.template_id));
		}
	}
}
//--------------------------------------------------
// 隐藏装备
public function hideEquip(equip : String) : void
{
	if (m_hideEquip.Contains(equip))
		return;

	if ("clothes"==equip || "shoes"==equip)
	{
		removePart(equip, m_basicData.sex);
	}
	else if ("hat"==equip || "glasses"==equip)
	{
		removeChild(equip);
	}
	else
	{
		throw new Exception("Player -> hideEquip(String) -> equip [" + equip + "] is wrong!");
	}
	m_hideEquip.Add(equip);
}
//--------------------------------------------------
// 装备是否显示
public function isEquipShow(equip : String) : boolean
{
	return (false == m_hideEquip.Contains(equip));
}
//--------------------------------------------------
// 添加帽子
public function addHat(hat_resc : String, hat_hair : String, particle_resc : String, bone : String) : void
{
	if (null==hat_resc || ""==hat_resc)
		throw new Exception("Player -> addHat(String, String) -> hat_resc is null!");

	if (null==hat_hair || ""==hat_hair)
		throw new Exception("Player -> addHat(String, String) -> hat_hair is null!");

	// step1:戴上帽子
	addChild("hat", hat_resc, "Hat001", particle_resc, bone);
	if ("(null)"==hat_hair || "null"==hat_hair)
		return;

	// step2:改变帽子对应的发型
	var res : String = hat_hair;
	if (false == res.Contains(".mod.u3d"))	// 填的是数字
	{
		var spts : String[] = m_oldHair.Split(["."], StringSplitOptions.RemoveEmptyEntries);
		res = spts[0] + "_" + hat_hair + ".mod.u3d";
	}
	addPart("hair", res);
	changeMaterial("hair", m_oldHairColor, null);
}
//--------------------------------------------------
// 添加眼镜
public function addGlasses(glassess_resc : String, particle_resc : String, bone : String) : void
{
	if (null==glassess_resc || ""==glassess_resc)
		throw new Exception("Player -> addGlasses(String) -> glassess_resc is null!");

	addChild("glasses", glassess_resc, "Glass001", particle_resc, bone);
}

// add ring
public function addRing(resc : String, particle_resc : String, bone : String) : void
{
	if (null==resc || ""==resc)
		throw new Exception("Player -> addRing(String) -> glassess_resc is null!");

	addChild("ring", resc, "Bip01 L Finger1", particle_resc, bone);
}

// add cloak
public function addCloak(resc : String, particle_resc : String, bone : String) : void
{
	if (null==resc || ""==resc)
		throw new Exception("Player -> addCloak(String) -> glassess_resc is null!");

	addChild("cloak", resc, "Back001", particle_resc, bone);
}
//--------------------------------------------------
// 添加子部件
public function addChild(child : String, resc : String, holdBone : String, particle : String, attachBone : String) : void
{
	if ("hat"!=child && "glasses"!=child && "ring" != child)
		throw new Exception("Player -> addChild(String, String, String) -> child [" + child + "] is wrong!");

	if (null==resc || ""==resc)
		throw new Exception("Player -> addChild(String, String, String) -> child [" + child + "], resc is null!");

	if (null==holdBone || ""==holdBone)
		throw new Exception("Player -> addChild(String, String, String) -> child [" + child + "], holdBone is null!");

	if (m_childEvents.ContainsKey(child))
	{
		removeChild(child);
	}
	var event : ChildModelLoadEvent = new ChildModelLoadEvent(child, CharacterFactory.CLOTHES_DIR + resc, holdBone);
	m_model.asynCtrl.addOrProcessEvent(event);
	m_childEvents.Add(child, event);
	
	addParticle(child, particle, attachBone);
}
//--------------------------------------------------
// 移除子部件
public function removeChild(child : String) : void
{
	if (false == m_childEvents.ContainsKey(child))
		return;

	m_model.removeChild(child);
	m_childEvents[child].cancel();
	m_childEvents.Remove(child);
	if ("hat" == child)		// 脱下帽子,还原旧的发型
	{
		addPart("hair", m_oldHair);
		changeMaterial("hair", m_oldHairColor, null);
	}
	
	removeParticle(child);
}
//--------------------------------------------------
// 改变部位材质,part:base身体,face头部,hair头发,beard胡子
public function changeMaterial(part : String, resc : String, funFinish : Function) : void
{
	if (null==resc || ""==resc)
		throw new Exception("Player -> changeMaterial(String, String, Function) -> part [" + part + "], resc is null !");

	if ("base"==part || "face"==part || "hair"==part || "beard"==part)	// 模型部位
	{
		m_model.asynCtrl.addOrProcessEvent(new ModelMaterialLoadEvent(part, CharacterFactory.ROLE_DIR + resc, funFinish));
	}
	else
	{
		throw new Exception("Player -> changeMaterial(String, String, Function) -> part [" + part + "] is wrong!");
	}
}
//--------------------------------------------------
// 播放动画
public function play(ani:String, mode:WrapMode):void
{
	m_model.asynCtrl.addOrProcessEvent(new PlayModelEvent(ani, mode));
	if(SelfAnimationComp.is_playing_self_ani){
		if(mode != WrapMode.Loop){
			var obj : GameObject = m_model.getGameObj();
			if(canPlay(ani)) {
				var start_time_info : StartSelfAniTimeInfo = new StartSelfAniTimeInfo(Time.time, obj.animation[ani].clip.length);
				EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_PLAY_SELF_ANI), start_time_info);
			}
		}
	}

}
//--------------------------------------------------
// 是否可播放制定动画
public function canPlay(name : String) : boolean
{
	if (null == m_model.getClip(name))
	{
		return false;
	}
	return true;
}
//--------------------------------------------------
// 初始化默认动画
public function InitPlayerAnimation() : void
{
	m_model.asynCtrl.addOrProcessEvent(new InitPlayerAnimationEvent());
}
//--------------------------------------------------
// 设置可见性
public function setVisible(visible : boolean) : void
{
	if (visible == m_isVisible)
	{
		return;
	}
	m_isVisible = visible;
	m_model.asynCtrl.addOrProcessEvent(new SetModelVisibleEvent(visible));
}
//--------------------------------------------------
// 是否可见
public function isVisible() : boolean
{
	return m_isVisible;
}
//--------------------------------------------------
// 设置层
public function setLayer(layer : int) : void
{
	m_model.asynCtrl.addOrProcessEvent(new SetModelLayerEvent(layer));
}
//--------------------------------------------------
// 获取基本数据
public function getBasicData() : player_basic_data
{
	return m_basicData;
}
//--------------------------------------------------
// 设置基本数据
public function setBasicData(data : player_basic_data) : void
{
	m_basicData = data;
}
//--------------------------------------------------
// 设置玩家身体数据
public function setBodyData(body : ArrayList) : void
{
	m_basicData.body = body;
}
//--------------------------------------------------
// 设置头发相关
public function setHair(hair : String, hair_color : String) : void
{
	m_oldHair = hair;
	m_oldHairColor = hair_color;
}
//--------------------------------------------------
// 获取账号
public function getAccount() : String
{
	return m_basicData.account;
}
//--------------------------------------------------
// 获取名字
public function getName() : String
{
	return m_basicData.username;
}
//--------------------------------------------------
// 是否为男性
public function isMale() : boolean
{
	if (1 == m_basicData.sex)
	{
		return true;
	}
	return false;
}
//--------------------------------------------------
public function IsTransform() : boolean {
	return this.gameObject.GetComponent(PlayerTransform).IsTransform();
}
//--------------------------------------------------
// 设置装备
public function setEquips(grid_vec : ArrayList) : void
{
	// 帽子
	var hat_pg : pack_grid = grid_vec[0] as pack_grid;
	var hat_id : int = hat_pg.item_data.template_id;
	if (0!=hat_id && !TimeEffect.getInstance().isMature(hat_pg.item_data.del_time) && isEquipShow("hat"))
	{
		addHat(getDressModel(hat_id), getDressBody(hat_id),getDressParticleResc(hat_id),getDressParticleAttach(hat_id));
	}
	else
	{
		removeChild("hat");
	}
	// 衣服
	var clothes_pg : pack_grid = grid_vec[1] as pack_grid;
	var clothes_id : int = clothes_pg.item_data.template_id;
	if (0!=clothes_id && !TimeEffect.getInstance().isMature(clothes_pg.item_data.del_time) && isEquipShow("clothes"))
	{
		changeClothes(clothes_id);
	}
	else
	{
		changeClothes(getDefaultClothID(m_basicData.sex));
	}
	// 眼镜
	var glasses_pg : pack_grid = grid_vec[2] as pack_grid;
	var glasses_id : int = glasses_pg.item_data.template_id;
	if (0!=glasses_id && !TimeEffect.getInstance().isMature(glasses_pg.item_data.del_time) && isEquipShow("glasses"))
	{
		addGlasses(getDressModel(glasses_id),getDressParticleResc(glasses_id),getDressParticleAttach(glasses_id));
	}
	else
	{
		removeChild("glasses");
	}
	// ring
	var ring_pg : pack_grid = grid_vec[3] as pack_grid;
	var ring_id : int = ring_pg.item_data.template_id;
	if (0!=ring_id && !TimeEffect.getInstance().isMature(ring_pg.item_data.del_time) && isEquipShow("ring"))
	{
		addRing(getDressModel(ring_id),getDressParticleResc(ring_id),getDressParticleAttach(ring_id));
	}
	else
	{
		removeChild("ring");
	}
	// cloak
	var cloak_pg : pack_grid = grid_vec[4] as pack_grid;
	var cloak_id : int = cloak_pg.item_data.template_id;
	if (0!=cloak_id && !TimeEffect.getInstance().isMature(cloak_pg.item_data.del_time) && isEquipShow("cloak"))
	{
		addCloak(getDressModel(cloak_id),getDressParticleResc(cloak_id),getDressParticleAttach(cloak_id));
	}
	else
	{
		removeChild("cloak");
	}
	// 鞋子
	var shoes_pg : pack_grid = grid_vec[5] as pack_grid;
	var shoes_id : int = shoes_pg.item_data.template_id;
	if (0!=shoes_id && !TimeEffect.getInstance().isMature(shoes_pg.item_data.del_time) && isEquipShow("shoes"))
	{
		addPart("shoes", getDressModel(shoes_id));
	}
	else
	{
		removePart("shoes", m_basicData.sex);
	}
}
//--------------------------------------------------
// 改变朝向,face:朝向(0,朝x轴;1,朝-z轴;2,朝-x轴;3,朝z轴)
public function changeFace(face : int) : void
{
	// 角色的初始的方向为2,朝-x轴
	if (face<0 || face>3)
		throw new Exception("Player -> changeFace(int) -> face [" + face + "] is wrong!");

	transform.localRotation = Quaternion.Euler(0, 90.0*CommFunc.ToU3DFace(face), 0);
}
//--------------------------------------------------
// 获取物品服装表
public static function getDressRow(item_id : int) : ItemDressRow
{
	var ir : ItemRow = ResManager.LgtMgr.getItemRow(item_id);
	var dress_tabel : Hashtable = ResManager.LgtMgr.ItemDressTable;
	if (false == dress_tabel.ContainsKey(ir.sub_id))
		throw new Exception("Player -> getDressModel(int) -> item dress table not exist [" + ir.sub_id + "]!");

	return dress_tabel[ir.sub_id] as ItemDressRow;
}
//--------------------------------------------------
// 取得衣服对应的模型
public static function getDressModel(item_id : int) : String
{
    return getDressRow(item_id).model;
}
//--------------------------------------------------
// 取得衣服对应的身体模型
public static function getDressBody(item_id : int) : String
{
	return getDressRow(item_id).model_body;
}
//--------------------------------------------------
// 取得玩家默认衣服
public static function getDefaultClothID(sex : int) : int
{
    if (sex == sex_type.st_boy)
    {
        return 300010;	// 男的内衣
	}
	// 女的内衣
	return 350010;
}

//-------particle
public static function getDressParticleResc(item_id : int) : String {
	return getDressRow(item_id).particle;
}

public static function getDressParticleAttach(item_id : int) : String {
	return getDressRow(item_id).attach_pos;
}
//
//--------------------------------------------------
function ChangeEyelidColor(cur : String){
	eyeLidClosed_mat = cur;
}
//--------------------------------------------------
function InitEyeLid(cur_eyelid : String, trans_eyelid : String){
	eyeLidOpened_mat = trans_eyelid;
	eyeLidClosed_mat = cur_eyelid;
	//默认睁眼
	ChangePlayerEyelid("eyelid", eyeLidOpened_mat, null);
	//InitChangeEyelidInterval(1);
	//InitChangeEyelidStartTime(Time.time);
}
//--
function StartOpenEyelid(){
	 //--
    var yanpi_timer : Timer = new Timer(chg_eyelid_interval, 1);
    yanpi_timer.addEventListener(TimerEvent.TIMER, OnTimer_OpenEyelid);
	yanpi_timer.addEventListener(TimerEvent.TIMER_COMPLETE, OnTimerComplete_OpenEyelid);
	yanpi_timer.Start();
    //
}
//--
private function OnTimer_OpenEyelid(_timer : Timer, obj : Object){
	ChangePlayerEyelid("eyelid", eyeLidOpened_mat, null);
	InitChangeEyelidStartTime(Time.time);
}
//--
private function OnTimerComplete_OpenEyelid(_timer : Timer, obj : Object){

}
//--
function InitChangeEyelidInterval(t : float){
	change_eyelid_interval = t;
}
//--
function InitChangeEyelidStartTime(t : float){
	start_change_eyelid_time = t;
}
//--
function ChangePlayerEyelid(part : String, eyelid : String, finishfunc : Function){
	m_model.asynCtrl.addOrProcessEvent(new ChangeEyelid(part, CharacterFactory.ROLE_DIR + eyelid, this, finishfunc));
}

//particle operator
private function addParticle(part : String, particle : String, attachBone : String) {
	if(part == null||part == ""||part == "(null)"||particle==null||particle == ""||particle == "(null)"|| attachBone == null || attachBone == ""||attachBone == "(null)") return ;
	
	var event : EquipParticleLoad = new EquipParticleLoad(part, CharacterFactory.PARTICLE_DIR + particle, attachBone, false);
	var ep : EquipParticle = new EquipParticle();
	ep.part = part;
	ep.loader = event;
	m_model.asynCtrl.addOrProcessEvent(event);
	m_particleEvents.Add(ep);
}

private function removeParticle(part : String) {
	for(var ep : EquipParticle in m_particleEvents) {
		if(ep.part == part) {
			ep.loader.cancel();
		}
	}
}
//--------------------------------------------------
// 设置皮肤颜色(脸部,身体),当切换游戏高低品质时,需要用到,不然,当低品质时(顶点光照),角色皮肤会变黑
public function setSkinColor(col : Color) : void
{
	m_model.asynCtrl.addOrProcessEvent(new ChangeMaterialColorEvent("base", col));
	m_model.asynCtrl.addOrProcessEvent(new ChangeMaterialColorEvent("face", col));
}
//--------------------------------------------------


