#pragma strict
#pragma downcast


/*--------------------------------------------------
玩家工厂,可在这里根据预制件实例玩家(2011/10/28 create by hezhr)
--------------------------------------------------*/
var playerPrefab:GameObject;	// 玩家预制件
var mainPlayerPrefab:GameObject;	// 主玩家预制件
private static var m_factory:CharacterFactory;
public static var ROLE_DIR:String = "Model/Character/";	// 角色模型资源路径
public static var CLOTHES_DIR:String = "Model/Clothes/";	// 衣服模型资源路径
public static var PARTICLE_DIR:String = "Model/Particle/";	// 粒子资源路径
//--------------------------------------------------
// Use this for initialization
function Start ()
{
	m_factory = this;
}
//--------------------------------------------------
// 创建穿内衣的玩家 传入player_basic_data就可以了
public static function createPlayer(data:player_basic_data):GameObject
{    
   return createPlayer(data, false);
}
//--------------------------------------------------
// 创建玩家 canWear 表示是否穿默认衣服
public static function createPlayer(data:player_basic_data, canWear: boolean):GameObject
{
	var player:GameObject = null;
	var mainPlayer:boolean = ScenePlayerMgr.isMainPlayer(data.account);
	
	var playerPreview: PlayerPreview = new PlayerPreview(CreateRoleConfig.data, data.sex);
    playerPreview.setHairIndex(data.hair);
    playerPreview.setBeardIndex(data.beard);
    playerPreview.setFaceIndex(data.face);
    playerPreview.setSkinColor(data.skin_color);
    playerPreview.setHairColor(data.hair_color);
    var sCloth: String = "";
    var sShoes: String = "";
    var sBody: String = "";
    if (canWear)
    {
        sCloth = Player.getDressModel(playerPreview.clothesList.current());
        sShoes = Player.getDressModel(playerPreview.shoesList.current());
        sBody = Player.getDressBody(playerPreview.clothesList.current());
    }
    else
    {
        var clothID = Player.getDefaultClothID(data.sex);
        sCloth = Player.getDressModel(clothID);
        sBody = Player.getDressBody(clothID);     
    }  
    
	player = CreatePlayer(sBody,
	                                    playerPreview.faceList.current(), 
	                                    playerPreview.hairList.current(), 
	                                    playerPreview.beardList.current(),
	                                    playerPreview.eyelidList.current(),  
	                                    sCloth, 
	                                    sShoes, 
	                                    mainPlayer, 
	                                    data.sex);
    
    var com = player.GetComponent(Player);
    com.changeMaterial("hair", playerPreview.hairMatList.current(), null);
    if (data.sex == sex_type.st_boy)
    {
        if (!isEmpty(playerPreview.beardList.current()))
            com.changeMaterial("beard", playerPreview.beardMatList.current(), null);
    }
    com.changeMaterial("base", playerPreview.bodyMatList.current(), null);
    com.changeMaterial("face", playerPreview.faceMatList.current(), null);
  	com.InitEyeLid(playerPreview.eyelidMatList.current(), playerPreview.eyelidMatList.end());
	com.setBasicData(data);
	com.InitPlayerAnimation();
	com.setHair(playerPreview.hairList.current(), playerPreview.hairMatList.current());
    
	if (!mainPlayer)
	{
		player.name = data.account;
	}
	
	return player;
}
//--------------------------------------------------
// 创建玩家
private static function CreatePlayer(body:String, face:String, hair:String, beard:String, eyelid:String, clothes:String, shoes:String, mainPlayer:boolean, sex:int):GameObject
{
	if (""==body || null==body || ""==face || null==face || ""==hair || null==hair)
	{
		throw new Exception("Error: CharacterFactory -> CreatePlayer(String, String, String, String, String, String, boolean, int) -> parameter is wrong!");
	}
	var player:GameObject = null;
	if (mainPlayer)	// 主玩家
	{
		player = GameObject.Instantiate(m_factory.mainPlayerPrefab);
		player.tag = "MainPlayer";
	}
	else	// 普通玩家
	{
		player = GameObject.Instantiate(m_factory.playerPrefab);
	}
	var model:Model = new Model();
	model.asynCtrl.addOrProcessEvent(new MainModelLoadEvent(ROLE_DIR + body, ROLE_DIR + face, ROLE_DIR + hair, CLOTHES_DIR + clothes));
	model.asynCtrl.addOrProcessEvent(new SetModelParentEvent(player));
	var scale: float = 1.0;
	if (1 == sex)	// 男性
	{
	    scale = (CreateRoleConfig.data["boy"] as Boo.Lang.Hash)["scale"];	    
		model.asynCtrl.addOrProcessEvent(new AddAnimationClipEvent(ROLE_DIR + "male_action.anis.u3d"));
		model.asynCtrl.addOrProcessEvent(new AddCapsuleColliderEvent(Vector3(-0.05, 0.9, 0.04), 0.2, 1.8));
	}
	else if (2 == sex)	// 女性
	{
	    scale = (CreateRoleConfig.data["girl"] as Boo.Lang.Hash)["scale"];
		model.asynCtrl.addOrProcessEvent(new AddAnimationClipEvent(ROLE_DIR + "female_action.anis.u3d"));
		model.asynCtrl.addOrProcessEvent(new AddCapsuleColliderEvent(Vector3(0, 0.8, 0), 0.18, 1.65));
	}
	player.transform.localScale = Vector3(scale, scale, scale);
	
	if (""!=beard && null!=beard)	// 胡子
	{
		model.asynCtrl.addOrProcessEvent(new PartModelLoadEvent("beard", ROLE_DIR + beard));
	}
//	if (""!=clothes && null!=clothes)	// 衣服
//	{
//		model.asynCtrl.addOrProcessEvent(new PartModelLoadEvent("clothes", CLOTHES_DIR + clothes));
//	}
	if (""!=shoes && null!=shoes)	// 鞋子
	{
		model.asynCtrl.addOrProcessEvent(new PartModelLoadEvent("shoes", CLOTHES_DIR + shoes));
	}
	if (""!=eyelid && null!=eyelid)	// 眼皮
	{
		model.asynCtrl.addOrProcessEvent(new PartModelLoadEvent("eyelid", ROLE_DIR + eyelid));
	}
	player.GetComponent(Player).setModel(model);
	return player;
}
//--------------------------------------------------
// 销毁玩家(关于玩家的销毁最终都统一调用这个接口)
public static function DestroyPlayer(player : GameObject) : void
{
	if (null == player)
	{
		return;
	}
	var p : Player = player.GetComponent(Player);
	if (p)
	{
		p.destroy();
	}
	var chat_bubble : PlayerChatBubble = player.GetComponent(PlayerChatBubble);
	if (chat_bubble)
	{
		chat_bubble.destroy();
	}
	GameObject.Destroy(player);
}
//--------------------------------------------------
// 根据游戏高低品质设置材质颜色
public static function setMaterialColorByQuality(mat : Material) : void
{
	if (null == mat)
		return;
	
	mat.color = Global.isHighQuality() ? ScenePlayerMgr.getInstance().HighQualityColor 
										: ScenePlayerMgr.getInstance().LowQualityColor;
}
//--------------------------------------------------



/*--------------------------------------------------
*** 下面为player模型异步加载事件
--------------------------------------------------*/
class MainModelLoadEvent extends MainLoadModelCtrlEvent
{
	private var _bodyObj:GameObject = null;
	private var _faceObj:GameObject = null;
	private var _hairObj:GameObject = null;
	private var _clothesObj:GameObject = null;
	private var _bodyLoader:ModelLoader = null;
	private var _faceLoader:ModelLoader = null;
	private var _hairLoader:ModelLoader = null;
	private var _clothesLoader:ModelLoader = null;
	
	public function MainModelLoadEvent(bodyRes:String, faceRes:String, hairRes:String, clothesRes:String)
	{
		clearReady();
		_bodyLoader = Global.GetModelLoaderMgr().AsynLoadModel(bodyRes, OnLoadBodyFinished, true, false);
		_faceLoader = Global.GetModelLoaderMgr().AsynLoadModel(faceRes, OnLoadFaceFinished, true, false);
		_hairLoader = Global.GetModelLoaderMgr().AsynLoadModel(hairRes, OnLoadHairFinished, true, false);
		_clothesLoader = Global.GetModelLoaderMgr().AsynLoadModel(clothesRes, OnLoadClothesFinished, true, false);
	}
	
	function OnLoadBodyFinished(obj : ModelLoader):void
	{
		_bodyObj = obj.mModelObj;
		checkReady();
	}
	
	function OnLoadFaceFinished(obj : ModelLoader):void
	{
		_faceObj = obj.mModelObj;
		checkReady();
	}
	
	function OnLoadHairFinished(obj : ModelLoader):void
	{
		_hairObj = obj.mModelObj;
		checkReady();
	}

	function OnLoadClothesFinished(obj : ModelLoader):void
	{
		_clothesObj = obj.mModelObj;
		checkReady();
	}
	
	function checkReady():void
	{
		if (_bodyObj && _faceObj && _hairObj && _clothesObj)
		{
			setReady();
		}
	}
	
	function destroyRes():void
	{
		if(_bodyObj)
			Model.destroy(_bodyObj);
		if(_faceObj)
			Model.destroy(_faceObj);
		if(_hairObj)
			Model.destroy(_hairObj);
		if(_clothesObj)
			Model.destroy(_clothesObj);
		
		_bodyLoader.Destroy();
		_faceLoader.Destroy();
		_hairLoader.Destroy();
		_clothesLoader.Destroy();
	}

	// override
	function exce():void
	{
		var model:Model = mAsynModel as Model;
		model.init("model", _bodyObj);
		model.addPart("face", _faceObj, true);
		model.addPart("hair", _hairObj, true);
		model.addPart("clothes", _clothesObj, false);
		model.combine();
		// 不知为何得添加下面两段代码,动画才能播放
		model.getGameObj().animation.cullingType = AnimationCullingType.AlwaysAnimate;
		model.getGameObj().animation.cullingType = AnimationCullingType.BasedOnRenderers;
		model.getGameObj().animation.playAutomatically = false;
		destroyRes();
		// 根据游戏高低品质设置皮肤颜色(脸部,身体)
		CharacterFactory.setMaterialColorByQuality(model.getMaterial("base"));
		CharacterFactory.setMaterialColorByQuality(model.getMaterial("face"));
	}
	
	function cancel():void
	{
		destroyRes();
	}
}
//--------------------------------------------------
class PartModelLoadEvent extends ModelCtrlEvent
{
	private var _partObj:GameObject = null;
	private var _partName:String = "";	// base, face, hair, beard, clothes, pants, shoes
	private var _partLoader:ModelLoader = null;
	private var _funFinish:Function = null;
	
	public function PartModelLoadEvent(partName:String, partRes:String)
	{
	    _DoInit(partName, partRes, null);
	}	

	public function PartModelLoadEvent(partName:String, partRes:String, funFinish)
	{
	    _DoInit(partName, partRes, funFinish);
	}	
	
	private function _DoInit(partName:String, partRes:String, funFinish:Function)
	{	
		clearReady();
		_funFinish = funFinish;
		_partName = partName;
		_partLoader = Global.GetModelLoaderMgr().AsynLoadModel(partRes, OnLoadPartFinished, true, false);
	}
	
	function OnLoadPartFinished(obj : ModelLoader):void
	{
		_partObj = obj.mModelObj;
		setReady();
	}
	
	function destroyRes():void
	{
		if (_partObj)
			Model.destroy(_partObj);
		
		_partLoader.Destroy();
	}
	
	// override
	function exce():void
	{
	    // 完成下载后调用事件
	    if (_funFinish)
	        _funFinish();
	        
		var model:Model = mAsynModel as Model;
		var use_old_mat:boolean = true;
		if ("clothes"==_partName || "pants"==_partName || "shoes"==_partName)
		{
			use_old_mat = false;
		}
		model.addPart(_partName, _partObj, use_old_mat);
		model.combine();
		destroyRes();
		// 根据游戏高低品质设置皮肤颜色(脸部,身体)
		CharacterFactory.setMaterialColorByQuality(model.getMaterial("base"));
		CharacterFactory.setMaterialColorByQuality(model.getMaterial("face"));
	}
	
	function cancel():void
	{
		destroyRes();
	}
}
//--------------------------------------------------
class ChildModelLoadEvent extends ModelCtrlEvent
{
	private var _childObj:GameObject = null;
	private var _childName:String = "";	// 
	private var _holdName:String = "";
	private var _childLoader:ModelLoader = null;
	
	public function ChildModelLoadEvent(childName:String, partRes:String, holdName:String)
	{
		clearReady();
		_childName = childName;
		_childLoader = Global.GetModelLoaderMgr().AsynLoadModel(partRes, OnLoadFinished, true, false);
		_holdName = holdName;
	}
	
	function OnLoadFinished(obj : ModelLoader):void
	{
		_childObj = obj.mModelObj;
		setReady();
	}
	
	function destroyRes():void
	{
		if (_childObj)
			Model.destroy(_childObj);
		
		_childLoader.Destroy();
	}
	
	// override
	function exce():void
	{
		var model:Model = mAsynModel as Model;
		var old:GameObject = model.findChild(_childName);
		if (old)
		{
			model.removeChild(_childName);
			Model.destroy(old);
		}
		model.addChild(_childName, _childObj, _holdName);
	}
	
	function cancel():void
	{
		destroyRes();
	}
}
//--------------------------------------------------
class ModelMaterialLoadEvent extends ModelCtrlEvent
{
	private var _material:Material = null;
	private var _partName:String = "";	// base表身体, face, hair, beard
	private var _materialLoader:ModelLoader = null;
	private var _funFinish:Function;
	
	public function ModelMaterialLoadEvent(partName:String, material:String)
	{
	    _DoInit(partName, material, null);
	}

	public function ModelMaterialLoadEvent(partName:String, material:String, funFinish:Function)
	{
	    _DoInit(partName, material, funFinish);
	}
	
	private function _DoInit(partName:String, material:String, funFinish:Function)
	{
		if (null==material || ""==material)
			throw new Exception("ModelMaterialLoadEvent -> _DoInit(String, String, Function) -> partname [" + partName + "], material is null !");
		
	    _funFinish = funFinish;
		clearReady();
		_partName = partName;
		_materialLoader = Global.GetModelLoaderMgr().AsynLoadMaterial(material, OnLoadFinished, true);
	}
	
	function OnLoadFinished(obj : ModelLoader):void
	{
		_material = obj.mMaterialObj;
		setReady();
	}
	
	function destroyRes():void
	{
		if (_material)
			GameObject.Destroy(_material);
			
		_materialLoader.Destroy();
	}
	
	// override
	function exce():void
	{
	    if (_funFinish)
	        _funFinish();
		
		var model:Model = mAsynModel as Model;
		// 根据游戏高低品质设置皮肤颜色(脸部,身体)
		if ("base" == _partName || "face" == _partName)
		{
			CharacterFactory.setMaterialColorByQuality(_material);
		}
		model.changeMaterial(_partName, _material);
	}
	
	function cancel():void
	{
		destroyRes();
	}
}
//--------------------------------------------------
class SetModelParentEvent extends ChaseMainLoadModelCtrlEvent
{
	private var _parent:GameObject = null;
	
	public function SetModelParentEvent(parent:GameObject)
	{
		_parent = parent;
	}
	
	// override 
	function exce():void
	{
		var model:Model = mAsynModel as Model;
		CommFunc.setParent(_parent, model.getGameObj());
	}
}
//--------------------------------------------------
class AddAnimationClipEvent extends ChaseMainLoadModelCtrlEvent
{
	private var _anis:String;
	
	public function AddAnimationClipEvent(anis:String)
	{
		_anis = anis;
	}
	// override
	function exce():void
	{
		var model:Model = mAsynModel as Model;
		var clips:AnimationClip[] = Global.GetModelLoaderMgr().SyncLoadAnimation(_anis);	// 同步加载,因为动画文件已经预先加载
		for (var clip:AnimationClip in clips)
		{
			model.addClip(clip, clip.name);
			// 设置默认动画
			if (clip.name.Equals("stand"))
			{
				model.getGameObj().animation.clip = clip;
			}
		}
		model.play(WrapMode.Loop);
	}
}
//--------------------------------------------------
class AddCapsuleColliderEvent extends ChaseMainLoadModelCtrlEvent
{
	private var _center:Vector3;
	private var _radius:float;
	private var _height:float;
	public function AddCapsuleColliderEvent(center:Vector3, radius:float, height:float)
	{
		_center = center;
		_radius = radius;
		_height = height;
	}
	// override
	function exce():void
	{
		var model:Model = mAsynModel as Model;
		var col:CapsuleCollider = model.getGameObj().AddComponent("CapsuleCollider");
		col.center = _center;
		col.radius = _radius;
		col.height = _height;
	}
}
//--------------------------------------------------
class PlayModelEvent extends ReplaceChaseMainLoadModelCtrlEvent
{
	private var _animation:String = "";
	private var _wrapMode:WrapMode;
	
	public function PlayModelEvent(ani:String, wrapMode:WrapMode)
	{
		_animation = ani;
		_wrapMode = wrapMode;
	}
	
	// override
	function exce():void
	{
		var model:Model = mAsynModel as Model;
		model.play(_animation, _wrapMode);
	}
}
//--------------------------------------------------
class ChangeMaterialColorEvent extends ReplaceChaseMainLoadModelCtrlEvent
{
	private var _part : String;
	private var _color : Color;
	
	public function ChangeMaterialColorEvent(part : String, col : Color)
	{
		_part = part;
		_color = col;
	}
	
	// override
	function exce() : void
	{
		var model:Model = mAsynModel as Model;
		model.changeMaterialColor(_part, _color);
	}
}
//--------------------------------------------------
class InitPlayerAnimationEvent extends ReplaceChaseMainLoadModelCtrlEvent{
	public function InitPlayerAnimationEvent(){
	
	}
	
	// override
	function exce():void
	{
		var model:Model = mAsynModel as Model;
		model.play(WrapMode.Loop);
	}
}
//--------------------------------------------------
class SetModelVisibleEvent extends ReplaceChaseMainLoadModelCtrlEvent
{
	private var _visible:boolean = true;
	
	public function SetModelVisibleEvent(visible:boolean)
	{
		_visible = visible;
	}
	
	// override 
	function exce():void
	{
		var model:Model = mAsynModel as Model;
		model.setVisible(_visible);
		var col : Collider = model.getGameObj().collider;
		if (col)
		{
			col.enabled = _visible;
		}
	}
}
//--------------------------------------------------
class SetModelLayerEvent extends ReplaceChaseMainLoadModelCtrlEvent
{
	private var _layer:int = 0;
	
	public function SetModelLayerEvent(layer:int)
	{
		_layer = layer;
	}
	
	// override 
	function exce():void
	{
		var model:Model = mAsynModel as Model;
		model.getGameObj().layer = _layer;
	}
}
//--------------------------------------------------
class ModelLoadEvent extends MainLoadModelCtrlEvent
{
	private var _modelName : String = "";
	private var _modelObj : GameObject = null;
	private var _player : Player = null;
	private var _modelLoader : ModelLoader = null;
	
	public function ModelLoadEvent(modelName : String, modelRes : String, p : Player)
	{
		clearReady();
		_modelName = modelName;
		_modelLoader = Global.GetModelLoaderMgr().AsynLoadModel(modelRes, OnLoadBodyFinished, true, true);
		_player = p;
	}
	
	function OnLoadBodyFinished(obj : ModelLoader) : void
	{
		_modelObj = obj.mModelObj;
		setReady();
	}
	
	function destroyRes() : void
	{
		if (_modelObj)
		{
			Model.destroy(_modelObj);
		}
		_modelLoader.Destroy();
	}

	// override
	function exce() : void
	{
		var model : Model = mAsynModel as Model;
		model.setGameObj(_modelName, _modelObj);
		_player.setModel(model);
		_modelObj.animation.wrapMode = WrapMode.Loop;
	}
	
	function cancel():void
	{
		destroyRes();
	}
}
//--------------------------------------------------
class AddAnimationClipEventAsyn extends ChaseMainLoadModelCtrlEvent
{
	private var _anis:String;
	private var _modelLoader : ModelLoader = null;
	
	public function AddAnimationClipEventAsyn(anis:String)
	{
		_anis = anis;
	}
	// override
	function exce():void
	{
		_modelLoader = Global.GetModelLoaderMgr().AsynLoadAnimation(_anis, OnLoadFinished, true);
	}
	
	function OnLoadFinished(obj : ModelLoader) : void {
		var model:Model = mAsynModel as Model;
		var clips:AnimationClip[] = _modelLoader.GetAnimationClip();
		
		for (var clip:AnimationClip in clips)
		{
			model.addClip(clip, clip.name);
			if (clip.name.Equals("stand"))
			{
				model.getGameObj().animation.clip = clip;
			}
		}
	}
}
//--------------------------------------------------
class ChangeEyelid extends ReplaceChaseMainLoadModelCtrlEvent {
	private var _material:Material = null;
	private var _partName:String = "";
	private var _materialLoader:ModelLoader = null;
	private var _funFinish:Function;
	private var _player : Player = null;
	
	public function ChangeEyelid(partName:String, material:String, player : Player)
	{
	    _DoInit(partName, material, player, null);
	}

	public function ChangeEyelid(partName:String, material:String, player : Player, funFinish:Function)
	{
	    _DoInit(partName, material, player, funFinish);
	}
	
	private function _DoInit(partName:String, material:String, player : Player, funFinish:Function)
	{
		if (null==material || ""==material)
			throw new Exception("ChangeEyelid -> _DoInit(String, String, Function) -> partname [" + partName + "], material is null !");
		
		_player = player;
	    _funFinish = funFinish;
		clearReady();
		_partName = partName;
		_materialLoader = Global.GetModelLoaderMgr().AsynLoadMaterial(material, OnLoadFinished, true);
	}
	
	function OnLoadFinished(obj : ModelLoader):void
	{
		_material = obj.mMaterialObj;
		_player.InitChangeEyelidInterval(Random.Range(1,5));
		_player.InitChangeEyelidStartTime(Time.time);
		setReady();
	}
	
	function destroyRes():void
	{
		if (_material)
			GameObject.Destroy(_material);
			
		_player.InitChangeEyelidInterval(0);
		_player.InitChangeEyelidStartTime(0);
		_materialLoader.Destroy();
	}
	
	// override
	function exce():void
	{
	    if (_funFinish)
	        _funFinish();
	        
		var model:Model = mAsynModel as Model;
		model.changeMaterial(_partName, _material);
	}
	
	function cancel():void
	{
		destroyRes();
	}
}
//--------------role particle event-----------------
class EquipParticleLoad extends ModelCtrlEvent {
	private var mObj : GameObject = null;
	private var mLoader : ModelLoader = null;
	private var mAttachBone : String = "";
	private var mPartName : String = "";
	private var mAutoDel : boolean = false;
	
	function EquipParticleLoad(part : String, res : String, attachBone : String, autoDel : boolean) {
		clearReady();
		
		mLoader = Global.GetModelLoaderMgr().AsynLoadModel(res, OnLoadFinished, true, false);
		mAttachBone = attachBone;
		mPartName = part;
		mAutoDel = autoDel;
	}
	private function OnLoadFinished(loader : ModelLoader) : void {
		mObj = loader.mModelObj;
		
		complete();
	}
	function complete()
	{
		setReady();
	}
	function Destroy()
	{
		if (mObj) {
			GameObject.Destroy(mObj);
		}
			
		mLoader.Destroy();
	}
	// override
	function exce():void
	{
		var model:Model = mAsynModel as Model;
		model.addParticle(mPartName, mObj, mAttachBone);
	}
	function cancel():void
	{
		Destroy();
	}
}
//--------------------------------------------------
private static function isEmpty(obj)
{
    return !obj || (obj == "");
}