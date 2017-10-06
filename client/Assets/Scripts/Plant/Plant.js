#pragma strict
#pragma downcast
/*
//plant class
//creat by fullzhu 2012.7.11
//last edit at 2012.7.11 by fullzhu
*/

public static var PLANT_DIR:String = "Model/Plant/";

//load seedling
class SeedlingModelLoadEvent extends MainLoadModelCtrlEvent {
	private var mObj : GameObject = null;
	private var mLoader : ModelLoader = null;
	private var mAttachObj : GameObject = null;
	private var mName : String = "";
	
	function SeedlingModelLoadEvent(name : String, res : String, attach : GameObject) {
		clearReady();
		
		mLoader = Global.GetModelLoaderMgr().AsynLoadModel(res, OnLoadFinished);
		mAttachObj = attach;
		mName = name;
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
		if (mObj)
		{
			GameObject.Destroy(mObj);
		}
			
		mLoader.Destroy();
	}
	// override
	function exce():void
	{
		if (!CommFunc.isGameObjVisible(mAttachObj))
		{
			CommFunc.setGameObjVisible(mObj, false);
		}
		//
		mObj.name = mName;
		
		if(mAttachObj != null) {
			mObj.transform.parent = mAttachObj.transform;
			mObj.transform.position = mAttachObj.transform.position;
			
			mObj.layer = mAttachObj.layer;   										//light
			for (var comp : Component in mObj.GetComponentsInChildren(Transform))
			{
				var trans : Transform = comp as Transform;
				trans.gameObject.layer = mObj.layer;
			}
		}
		CommFunc.addMeshCollider(mObj, "");
		
		var plantIns : Plant = mAsynModel as Plant;
		if(mName == "Seedling") { 
			plantIns.OnSeedLoaded(mObj);
		} else {
			plantIns.OnPlantLoaded(mObj);
		}
	}
	function cancel():void
	{
		Destroy();
	}
}

//load plant
class PlantModelLoadEvent extends MainLoadModelCtrlEvent {
	private var mObj : GameObject = null;
	private var mLoader : ModelLoader = null;
	private var mReplaceObj : GameObject = null;
	private var mName : String = "";
	
	function PlantModelLoadEvent(name : String, res : String, replace : GameObject) {
		clearReady();
		
		mLoader = Global.GetModelLoaderMgr().AsynLoadModel(res, OnLoadFinished);
		mReplaceObj = replace;
		mName = name;
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
		if (mObj)
		{
			GameObject.Destroy(mObj);
		}
			
		mLoader.Destroy();
	}
	// override
	function exce():void
	{
		if (!CommFunc.isGameObjVisible(mReplaceObj))
		{
			CommFunc.setGameObjVisible(mObj, false);
		}
		//
		mObj.name = mName;
		
		if(mReplaceObj != null) {
			mObj.transform.parent = mReplaceObj.transform.parent;
			mObj.transform.position = mReplaceObj.transform.position;
			
			mObj.layer = mReplaceObj.layer;   										//light
			for (var comp : Component in mObj.GetComponentsInChildren(Transform))
			{
				var trans : Transform = comp as Transform;
				trans.gameObject.layer = mObj.layer;
			}
		}
		CommFunc.addMeshCollider(mObj, "");
		
		GameObject.Destroy(mReplaceObj);
		
		var plantIns : Plant = mAsynModel as Plant;
		if(mName == "Seedling") { 
			plantIns.OnSeedLoaded(mObj);
		} else {
			plantIns.OnPlantLoaded(mObj);
		}
	}
	function cancel():void
	{
		Destroy();
	}
}

//load evt
class EvtFrameLoad extends MainLoadModelCtrlEvent {
	private var mObj : GameObject = null;
	private var mLoader : ModelLoader = null;
	private var mAttachObj : GameObject = null;
	private var mName : String = "";
	private var mAutoDel : boolean = false;
	
	function EvtFrameLoad(name : String, res : String, attach : GameObject, autoDel : boolean) {
		clearReady();
		
		mLoader = Global.GetModelLoaderMgr().AsynLoadModel(res, OnLoadFinished);
		mAttachObj = attach;
		mName = name;
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
		if (mObj)
		{
			GameObject.Destroy(mObj);
		}
			
		mLoader.Destroy();
	}
	// override
	function exce():void
	{
		if (!CommFunc.isGameObjVisible(mAttachObj))
		{
			CommFunc.setGameObjVisible(mObj, false);
		}
		//
		mObj.name = mName;
		
		if(mAttachObj != null) {
			mObj.transform.parent = mAttachObj.transform;
			mObj.transform.position = mAttachObj.transform.position;
			
			var mesh : MeshRenderer = mAttachObj.GetComponentInChildren(MeshRenderer);
			if(mesh != null) {
				mObj.transform.position.y += mesh.bounds.size.y + 0.5;
			}
		}
		if(mAutoDel) {
			mObj.AddComponent(ParticleDestroy);
		}
		
		var plantIns : Plant = mAsynModel as Plant;
		plantIns.SetEvtEffectObj(mObj);
	}
	function cancel():void
	{
		Destroy();
	}
}

class Plant extends AsynModel {

	private var mData : PlantSeedRow = null;
	private var mInstanceID : UInt64 = 0;
	private var mInst : crop_data = null;				//inst data
	private var mTrigEvt : crop_event = null;			// 已触发事件
	private var mCurEvt : crop_event = null;			// 当前事件
	
	private var mInterval:float = 1000f;				//show time interval
	private var mRemainTime : int = 0;					//remain time(second)
	private var mTimer:Timer = null;					//Timer
	
	private var mEvtTimer : Timer = null;				//event Timer
	private var mEvtRemainTime : int = 0;				//event remain timer
	
	private var mPotObj : GameObject = null;			//flowerpot object
	private var mPlantObj : GameObject = null;			//gameobject of plant
	private var mEvtEffectObj : GameObject = null;		//event effect object
	
	private var mActive : boolean = false;
	private var mCrop : boolean = false;
	private var mEvtTrig : boolean = false;
	
	private var mAsynCtrl:AsynModelCtrl = new AsynModelCtrl(this);
	
	function Plant(data : PlantSeedRow,inst : crop_data, potObj : GameObject) {
		mData = data;
		mInstanceID = inst.inst_id;
		mPotObj = potObj;
		
		mInst = inst;
		ParseEvt(inst, false);
	}
	
	function ParseEvt(inst : crop_data, curTrig : boolean) {
		mTrigEvt = null;
		if (mCurEvt && curTrig) {
			mCurEvt.time = 0;
		}
		mCurEvt = null;
		// 没有事件
		if (null == inst || 0 == inst.evt.Count) {
			return;
		}
		// 设置事件触发时间
		for (var i:int = 1; i<inst.evt.Count; ++i) {
			var pre : crop_event = inst.evt[i - 1] as crop_event;
			var cur : crop_event = inst.evt[i] as crop_event;
			cur.time = cur.time - pre.time;
		}
		var index : int = -1;
		for (var j:int = 0; j<inst.evt.Count; ++j) {
			var evt : crop_event = inst.evt[j] as crop_event;
			if (evt.time <= 0) {	// 找到已触发事件
				index = j;
			}
		}
		if (-1 == index) {
			mCurEvt = inst.evt[0];
		} else {
			mTrigEvt = inst.evt[index];
			if (index + 1 < inst.evt.Count) {
				mCurEvt = inst.evt[index + 1];
			}
		}
	}
	
	function Active() {
		mRemainTime = mInst.rest_time;
		if(mRemainTime == 0) {
			OnCrop();
		} else {
			LoadSeedlingModel();
			StartCropTimer();
		}
		
		mActive = true;
	}
	
	function Refresh(data : crop_data) {
		mInst = data;
		ParseEvt(data, false);
		HandleEvt();
	}
	
	function Watering() {
		if(mEvtEffectObj) {
			GameObject.Destroy(mEvtEffectObj);
		}
		
		LoadWaterModel();
		mEvtTrig = false;
	}
	
	function Fertilize() {
		if(mEvtEffectObj) {
			GameObject.Destroy(mEvtEffectObj);
		}
		
		LoadFerModel();
		mEvtTrig = false;
	}
	
	function Harvest() {
		Destroy();
	}
	
	function Remove() {
		Destroy();
	}
	
	function Replaced() {
		LoadPlantModel();
	}
	
	private function StartCropTimer() {
		if(mTimer != null) {
			mTimer.Reset();
			mTimer = null;
		}
		mTimer = new Timer(mInterval,mRemainTime);
		mTimer.addEventListener(TimerEvent.TIMER,CallbackTimerTrigger);
		mTimer.addEventListener(TimerEvent.TIMER_COMPLETE,CallbackTimerStop);
		mTimer.Start();
	}
	
	private function StartEvtTimer() {
		if(mEvtTimer != null) {
			mEvtTimer.Reset();
			mEvtTimer = null;
		}
		mEvtTimer = new Timer(mInterval,mEvtRemainTime);
		mEvtTimer.addEventListener(TimerEvent.TIMER,CallbackEvtTimerTrigger);
		mEvtTimer.addEventListener(TimerEvent.TIMER_COMPLETE,CallbackEvtTimerStop);
		mEvtTimer.Start();
	}
	
	private function Destroy() {
		if(mTimer != null) {
			mTimer.Reset();
			mTimer = null;
		}
		if(mEvtTimer != null) {
			mEvtTimer.Reset();
			mEvtTimer = null;
		}
		
		if(mInst) {
			mInst = null;
			ParseEvt(null, false);
		}
		
		mAsynCtrl.clearEvent();
		
		if(mPlantObj) {
			GameObject.Destroy(mPlantObj);
			mPlantObj = null;
		}
		
		if(mEvtEffectObj) {
			GameObject.Destroy(mEvtEffectObj);
			mEvtEffectObj = null;
		}
	}
	
	private function OnCrop() {
		if(mEvtTimer != null) {
			mEvtTimer.Reset();
			mEvtTimer = null;
		}
		
		LoadPlantModel();
		
		mCrop = true;
		mEvtTrig = false;
	}
	
	private function OnEvtTrigger() {
		Debug.Log("event trigger!!!!!");
		
		if (mTrigEvt == null) return;
		
		if (1 == mTrigEvt.type) {			// 浇水
			LoadWaterEvtEffect();
		} else if (2 == mTrigEvt.type) {	// 施肥
			LoadFerEvtEffect();
		}
		
		mEvtTrig = true;
	}
	
	private function HandleEvt() {
		if (mTrigEvt && 0 != mTrigEvt.id) {		// 有事件被触发,显示效果
			OnEvtTrigger();
		}
		if (mCurEvt && 0 != mCurEvt.id) {		// 有要触发的事件,开启定时器
			mEvtRemainTime = mCurEvt.time;
			StartEvtTimer();
		}
	}
	
	public function OnSeedLoaded(obj : GameObject) {
		SetPlantObj(obj);
		HandleEvt();
	}
	
	public function OnPlantLoaded(obj : GameObject) {
		SetPlantObj(obj);
		
		LoadCropEvtEffect();
	}
	
	private function LoadSeedlingModel() {
		mAsynCtrl.addOrProcessEvent(new SeedlingModelLoadEvent("Seedling",PLANT_DIR+mData.seedling,mPotObj));
	}
	
	private function LoadPlantModel() {
		if(mPlantObj) {
			mAsynCtrl.addOrProcessEvent(new PlantModelLoadEvent("Plant",PLANT_DIR+mData.fruit_model,mPlantObj));
		} else {
			mAsynCtrl.addOrProcessEvent(new SeedlingModelLoadEvent("Plant",PLANT_DIR+mData.fruit_model,mPotObj));
		}
	}
	
	private function LoadFerModel() {
		mAsynCtrl.addOrProcessEvent(new EvtFrameLoad("Fertilize",PLANT_DIR+"eat.prefab.u3d",mPlantObj,true));
	}
	
	private function LoadWaterModel() {
		mAsynCtrl.addOrProcessEvent(new EvtFrameLoad("Watering",PLANT_DIR+"drink.prefab.u3d",mPlantObj,true));
	}
	
	private function LoadFerEvtEffect() {
		mAsynCtrl.addOrProcessEvent(new EvtFrameLoad("EventEffect",PLANT_DIR+"hungry.prefab.u3d",mPlantObj,false));
	}
	
	private function LoadWaterEvtEffect() {
		mAsynCtrl.addOrProcessEvent(new EvtFrameLoad("EventEffect",PLANT_DIR+"thirsty.prefab.u3d",mPlantObj,false));
	}
	
	private function LoadCropEvtEffect() {
		mAsynCtrl.addOrProcessEvent(new EvtFrameLoad("EventEffect",PLANT_DIR+"harvest.prefab.u3d",mPlantObj,false));
	}

	//callback
	private function CallbackTimerTrigger() {
		mRemainTime--;
		
		var time : CountdownTimer = new CountdownTimer();
		time.FurnitureID = mInstanceID;
		time.RemainTime = mRemainTime;
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_REFRESH_REMAIN_TIME),time);
	}
	
	private function CallbackTimerStop() {
		OnCrop();
	}
	
	private function CallbackEvtTimerTrigger() {
		mEvtRemainTime--;
	}
	
	private function CallbackEvtTimerStop() {
		ParseEvt(mInst, true);
		HandleEvt();
	}
	
	//data operator
	public function SetPlantObj(obj : GameObject) {
		mPlantObj = obj;
	}
	
	public function SetPotObj(obj : GameObject) {
		mPotObj = obj;
	}
	
	public function SetEvtEffectObj(obj : GameObject) {
		mEvtEffectObj = obj;
	}
	
	public function GetInstanceID() {
		return mInstanceID;
	}
	
	public function GetEventID() {
		var id : int = 0;
		if(mTrigEvt != null) {
			id = mTrigEvt.id;
		}
		return id;
	}
	
	public function GetEventType() {
		var type : int = 0;
		if(mTrigEvt != null) {
			type = mTrigEvt.type;
		}
		return type;
	}
	
	public function GetRemainTime() : int {
		return mRemainTime;
	}
	
	public function GetFitment() : HouseSceneComponent {
		return EQGameSceneMgr.getSingleton().getHouse().getComponentByInstanceID(mInstanceID);
	}
	
	public function IsCrop() : boolean {
		return mCrop;
	}
	
	public function IsActive() : boolean {
		return mActive;
	}
	
	public function IsWaterEvtTrig() : boolean {
		return mEvtTrig && mTrigEvt.type == 1;
	}
	
	public function IsFerEvtTrig() : boolean {
		return mEvtTrig && mTrigEvt.type == 2;
	}
	
	public function GetInstData() : crop_data {
		return mInst;
	}
}