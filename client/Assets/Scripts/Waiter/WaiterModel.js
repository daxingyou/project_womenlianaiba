#pragma strict
#pragma downcast

class WaiterModel
{
	private var mWaiterRow : WaiterRow = null;
	private var mWaiterLoader : ModelLoader = null;
	private var mComp : WaiterModelComp = null;
	private var mLayer : int = 0;
	private var mBornPos : Vector3 = Vector3.zero;
	private var mRotation : Vector3 = Vector3.zero;
	private var mClicked : boolean = false;
	//--------------------------------------------------
	public function WaiterModel(id : int, bornPos : Vector3, rotation : Vector3, layer : int)
	{
		mWaiterRow = ResManager.LgtMgr.getWaiterRow(id);
		mBornPos = bornPos;
		mRotation = rotation;
		mLayer = layer;
		var dir : String = "Model/NPC/" + mWaiterRow.waiter_mod_name;
		mWaiterLoader = Global.GetModelLoaderMgr().AsynLoadModel(dir, onLoadWaiterFinished, false, true);
	}
	//--------------------------------------------------
	private function onLoadWaiterFinished(obj : ModelLoader) : void
	{
		obj.mModelObj.transform.position = mBornPos;
		obj.mModelObj.transform.Rotate(mRotation);
		if(mLayer == 0)
			CommFunc.setGameObjectLayer(obj.mModelObj, EQSceneManager.getSingleton().HouseSceneObj);
		else
			CommFunc.setGameObjectLayer(obj.mModelObj, mLayer);
		mComp = obj.mModelObj.AddComponent("WaiterModelComp");
		mComp.init(mWaiterRow);
	}
	//--------------------------------------------------
	public function destroy() : void
	{
		if (mComp)
		{
			mComp.destroy();
		}
		if (mWaiterLoader)
		{
			mWaiterLoader.Destroy();
			mWaiterLoader = null;
		}
	}
	//--------------------------------------------------
	public function getWaiterObj() : GameObject
	{
		return mWaiterLoader ? mWaiterLoader.mModelObj : null;
	}
	//--------------------------------------------------
	public function isEqual(obj : GameObject) : boolean
	{
		return mWaiterLoader ? obj == mWaiterLoader.mModelObj : false;
	}

	public function Rotate(dir : Vector3)
	{
		var angleY: Single = (CreateRoleConfig.data["rotate_setting"] as Boo.Lang.Hash)["angle"]; 
        var time: Single = (CreateRoleConfig.data["rotate_setting"] as Boo.Lang.Hash)["time"];
		mWaiterLoader.mModelObj.transform.Rotate(dir.x, dir.y * Time.deltaTime * angleY/time, dir.z, Space.World);
	}
}


