#pragma strict
#pragma downcast
/*
//player transform class
//creat by fullzhu 2012.5.15
//last edit at 2012.5.15 by fullzhu
*/

public static var TRANSFORM_DIR:String = "Model/Transform/";

private var mPlayer : Player;
private var mPlayerMove : PlayerMove;
private var mCurBuff : int = 0;
private var mPlayerObj : GameObject = null;

private var mInterval:float = 1000f;				//show time interval
private var mRemainTime : int = 0;					//remain time(second)
private var mTimer:Timer = null;					//Timer

private var mInitModel : Model = null;
private var mTransformModel : Model = null;
private var mParticleModel : Model = null;

//load particle
class AppearParticleLoad extends MainLoadModelCtrlEvent {
	private var mParticleObj : GameObject = null;
	private var mParModelLoader : ModelLoader = null;
	private var mAttachObj : GameObject = null;
	private var mName : String = "";
	
	function AppearParticleLoad(name : String, res : String, attach : GameObject) {
		clearReady();
		
		mParModelLoader = Global.GetModelLoaderMgr().AsynLoadModel(res, OnLoadParFinished);
		mAttachObj = attach;
		mName = name;
	}
	
	private function OnLoadParFinished(loader : ModelLoader) : void {
		mParticleObj = loader.mModelObj;
		
		complete();
	}
	
	function complete()
	{
		setReady();
	}
	
	function Destroy()
	{
		if (mParticleObj)
		{
			GameObject.Destroy(mParticleObj);
		}
			
		mParModelLoader.Destroy();
	}

	// override
	function exce():void
	{
		mParticleObj.name = mName;
		
		if(mAttachObj != null) {
			mParticleObj.transform.parent = mAttachObj.transform;
			mParticleObj.transform.position = mAttachObj.transform.position;
		}
		mParticleObj.AddComponent(ParticleDestroy);
		//mParticleObj.transform.position.y += 70;
	}
	

	function cancel():void
	{
		Destroy();
	}
}

function Awake() {
	mPlayer = this.gameObject.GetComponent(Player);
	mPlayerMove = this.gameObject.GetComponent(PlayerMove);
	mPlayerObj = this.gameObject;
}
	
function Start() {
}
	
function Update() {
}
	
function Add(buffID: int) {
	var buff : BuffRow = GetBuff(buffID);
	if(buff == null) return ;
		
	Add(buffID,buff.duration);
}
	
function Add(buffID: int, time : int) {	
	mCurBuff = buffID;
	mRemainTime = time;
	
	var buff : BuffRow = GetBuff(buffID);
	if(buff == null) return ;
	var effect : EffectAvatarRow = GetModelEffect(buff.effect_id);
	if(effect == null) return ;
	
	mParticleModel = new Model();
	mParticleModel.asynCtrl.addOrProcessEvent(new AppearParticleLoad("yanwu.prefab.u3d",TRANSFORM_DIR+"yanwu.prefab.u3d",this.gameObject));
	mTransformModel = new Model();
	mTransformModel.asynCtrl.addOrProcessEvent(new ModelLoadEvent(effect.model,TRANSFORM_DIR+effect.model+".mod.u3d",mPlayer));
	mTransformModel.asynCtrl.addOrProcessEvent(new AddCapsuleColliderEvent(Vector3(0, 0.8, 0), 0.18, 1.65));
	//mTransformModel.asynCtrl.addOrProcessEvent(new AddAnimationClipEventAsyn(TRANSFORM_DIR+effect.model+".anis.u3d"));
	//mTransformModel.asynCtrl.addOrProcessEvent(new ModelMaterialLoadEvent(effect.model,TRANSFORM_DIR+effect.model+".mat.u3d"));
	
	StartTimer();
	var pm : PlayerMove = this.gameObject.GetComponent(PlayerMove);
	if (pm) {
		pm.refreshWalkType();
	}
}
	
function Remove() {
	mCurBuff = 0;
	mRemainTime = 0;
	
	Revert();
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_TRANSFORM_CANCEL),mPlayer.getAccount());
	var pm : PlayerMove = this.gameObject.GetComponent(PlayerMove);
	if (pm) {
		pm.refreshWalkType();
	}
}

function Revert() {
	var data : player_basic_data = mPlayer.getBasicData();
	if(data == null) return ;
	var roleDir : String = CharacterFactory.ROLE_DIR;
	var clotherDir : String = CharacterFactory.CLOTHES_DIR;
	
	mInitModel = new Model();
	var playerPreview: PlayerPreview = new PlayerPreview(CreateRoleConfig.data, data.sex);
    playerPreview.setHairIndex(data.hair);
    playerPreview.setBeardIndex(data.beard);
    playerPreview.setFaceIndex(data.face);
    playerPreview.setSkinColor(data.skin_color);
    playerPreview.setHairColor(data.hair_color);
    
    var body: String = "";
    var face : String = "";
    var hair : String = "";
    var beard : String = "";
    var eyelid : String = "";
    var clothes: String = "";
    var shoes: String = "";
    
    if(Player.getDressBody(playerPreview.clothesList.current()) != null) {
    	if(Player.getDressBody(playerPreview.clothesList.current()) == "") {
    		Debug.Log("-----------------======="+playerPreview.clothesList.current());
      	}
    	body = roleDir+Player.getDressBody(Player.getDefaultClothID(data.sex));
    }
    if(playerPreview.faceList.current() != null && playerPreview.faceList.current() != "") {
    	face = roleDir+playerPreview.faceList.current();
    }
    if(playerPreview.hairList.current() != null && playerPreview.hairList.current() != "") {
    	hair = roleDir+playerPreview.hairList.current();
    }
    if(playerPreview.beardList.current() != null && playerPreview.beardList.current() != "") {
    	beard = roleDir+playerPreview.beardList.current();
    }
    if(playerPreview.eyelidList.current() != null && playerPreview.eyelidList.current() != "") {
    	eyelid = roleDir+playerPreview.eyelidList.current();
    }
    if(Player.getDressModel(playerPreview.clothesList.current()) != null && Player.getDressModel(playerPreview.clothesList.current()) != "") {
    	clothes = clotherDir+Player.getDressModel(playerPreview.clothesList.current());
    }
    if(Player.getDressModel(playerPreview.shoesList.current()) != null && Player.getDressModel(playerPreview.shoesList.current()) != "") {
    	shoes = clotherDir+Player.getDressModel(playerPreview.shoesList.current());
    }
    
    mInitModel.asynCtrl.addOrProcessEvent(new MainModelLoadEvent(body,face,hair,clothes));
    mInitModel.asynCtrl.addOrProcessEvent(new SetModelParentEvent(mPlayerObj));
    if(data.sex == sex_type.st_boy) {
    	mInitModel.asynCtrl.addOrProcessEvent(new AddAnimationClipEvent(roleDir + "male_action.anis.u3d"));
		mInitModel.asynCtrl.addOrProcessEvent(new AddCapsuleColliderEvent(Vector3(-0.05, 0.9, 0.04), 0.2, 1.8));
	} else if(data.sex == sex_type.st_girl) {
		mInitModel.asynCtrl.addOrProcessEvent(new AddAnimationClipEvent(roleDir + "female_action.anis.u3d"));
		mInitModel.asynCtrl.addOrProcessEvent(new AddCapsuleColliderEvent(Vector3(0, 0.8, 0), 0.18, 1.65));
	}
	if (beard != "")
	{
		mInitModel.asynCtrl.addOrProcessEvent(new PartModelLoadEvent("beard", beard));
	}
	/*
	if (shoes != "")
	{
		model.asynCtrl.addOrProcessEvent(new PartModelLoadEvent("shoes", shoes));
	}
	*/
	if (eyelid != "")
	{
		mInitModel.asynCtrl.addOrProcessEvent(new PartModelLoadEvent("eyelid", eyelid));
	}
	mPlayer.setModel(mInitModel);
	
	if(IsStringValid(playerPreview.hairMatList.current())) {
		mPlayer.changeMaterial("hair", playerPreview.hairMatList.current(), null);
	}
    if (data.sex == sex_type.st_boy && IsStringValid(playerPreview.beardMatList.current())) {
    	mPlayer.changeMaterial("beard", playerPreview.beardMatList.current(), null);
    }
    if(IsStringValid(playerPreview.bodyMatList.current())) {
    	mPlayer.changeMaterial("base", playerPreview.bodyMatList.current(), null);
    }
    if(IsStringValid(playerPreview.faceMatList.current())) {
    	mPlayer.changeMaterial("face", playerPreview.faceMatList.current(), null);
    }
  	mPlayer.InitEyeLid(playerPreview.eyelidMatList.current(), playerPreview.eyelidMatList.end());
    
	mPlayer.setEquips(data.body);
	
	mPlayer.play("stand", WrapMode.Loop);
}
	
function IsTransform() {
	return mCurBuff != 0;
}

private function StartTimer() {
	if(mTimer != null) {
		mTimer.Reset();
		mTimer = null;
	}
	mTimer = new Timer(mInterval,mRemainTime);
	mTimer.addEventListener(TimerEvent.TIMER,CallbackTimerTrigger);
	mTimer.addEventListener(TimerEvent.TIMER_COMPLETE,CallbackTimerStop);
	mTimer.Start();
}

function Destroy() {
	if(mTimer != null) {
		mTimer.Reset();
		mTimer = null;
	}
	if(mInitModel != null) {
		mInitModel.destroyGameObj();
		mInitModel = null;
	}
	if(mTransformModel != null) {
		mTransformModel.destroyGameObj();
		mTransformModel = null;
	}
	if(mParticleModel != null) {
		mParticleModel.destroyGameObj();
		mParticleModel = null;
	}
}

//callback
private function CallbackTimerTrigger() {
	mRemainTime--;
	
	if(mPlayer.getAccount() == DataCenter.getMainPlayerAccount()) {
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_TRANSFORM_REFRESH_REMAIN_TIME),mRemainTime);
	}
}

private function CallbackTimerStop() {
	var plr : GameObject = ScenePlayerMgr.getPlayer(mPlayer.getAccount());
	if(plr != null) {
		Remove();
	} else {
		Destroy() ; 
	}
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_TRANSFORM_REFRESH_REMAIN_TIME),0);
}

private function IsStringValid(obj) : boolean {
	return obj != null && obj != "";
}
	
//data operator
public function GetRemainTime() : int {
	return mRemainTime;
}

public function GetCurrBuff() : int {
	return mCurBuff;
}
	
private function GetBuff(id : int) : BuffRow {
	return ResManager.LgtMgr.BuffTable[id];
}
	
private function GetModelEffect(id : int) : EffectAvatarRow {
	return ResManager.LgtMgr.EffectAvatarTable[id];
}