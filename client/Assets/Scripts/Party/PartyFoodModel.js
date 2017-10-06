#pragma strict
#pragma downcast

class PartyFoodModel
{
	private var mObj : GameObject = null;
	private var mPartyFoodRow : PartyFoodRow = null;
	private var mFoodModelLoader : ModelLoader = null;
	private var mComp : PartyFoodComp = null;
	private var mLayer : int = 0;
	private var mBornPos : Vector3 = Vector3.zero;
	private var mRotation : Vector3 = Vector3.zero;
	private var mClicked : boolean = false;
	//--------------------------------------------------
	public function PartyFoodModel(id : int, bornPos : Vector3, layer : int)
	{
		mObj = new GameObject("food_" + id.ToString());
		mPartyFoodRow = ResManager.LgtMgr.getPartyFoodRow(id);
		mBornPos = bornPos;
		mRotation = Vector3(0, Random.Range(0, 360), 0);
		mLayer = layer;
		var dir : String = "Model/partyfood/" + mPartyFoodRow.model_name;
		mFoodModelLoader = Global.GetModelLoaderMgr().AsynLoadModel(dir, onLoadWaiterFinished, false, true);
	}
	//--------------------------------------------------
	private function onLoadWaiterFinished(obj : ModelLoader) : void
	{
		obj.mModelObj.transform.position = mBornPos;
		obj.mModelObj.transform.Rotate(mRotation);
		if(0 == mLayer)
			CommFunc.setGameObjectLayer(obj.mModelObj, EQSceneManager.getSingleton().HouseSceneObj);
		else
			CommFunc.setGameObjectLayer(obj.mModelObj, mLayer);
			
		CommFunc.setParent(mObj, obj.mModelObj);
		
		mComp = obj.mModelObj.AddComponent("PartyFoodComp");
		mComp.init(obj.mModelObj);
	}
	//--------------------------------------------------
	public function destroy() : void
	{
		if (mComp)
		{
			mComp.destroy();
		}
		if (mFoodModelLoader)
		{
			mFoodModelLoader.Destroy();
			mFoodModelLoader = null;
		}
	}
	//--------------------------------------------------
	public function getPartyFoodObj() : GameObject
	{
		return mFoodModelLoader ? mFoodModelLoader.mModelObj : null;
	}
	//--------------------------------------------------
	public function isEqual(obj : GameObject) : boolean
	{
		return CommFunc.existChildGameObj(mObj, obj);
	}
	//--------------------------------------------------
	public function isClicked() : boolean
	{
		return mComp.isCanClicked();
	}

	//--------------------------------------------------
	public function onClicked() : void
	{
		if(null == mComp || false == mComp.isCanClicked())
			return;
		var content : String = Define.getContent(5221);
		UI.getUI().OpenMsgbox("", content, "", CallbackOk_eatPartyFood, "", CallbackCancel_doNothing);
	}
	
	public function CallbackOk_eatPartyFood(caller : iGUIElement)
	{
		Party.getInstance().requestEatFood(mPartyFoodRow.id);
	}
	
	public function CallbackCancel_doNothing(caller : iGUIElement)	{}
}


