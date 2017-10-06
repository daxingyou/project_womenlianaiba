#pragma strict
#pragma downcast



class YYGift3D
{
	private var mPareObj : GameObject = null;
	private var mGiftObj : GameObject = null;
	private var mGiftObjLoader : ModelLoader = null;
	private var mLife : float = 0.0f;
	private var mRandomPos : Vector3 = Vector3.zero;
	public static var Gift3DCtrl : Controller = new Controller();
	//--------------------------------------------------
	public function YYGift3D(res : String, life : float, start : Vector3, end : Vector3, pare : GameObject)
	{
		mLife = life;
		mRandomPos = Vector3(Random.Range(start.x, end.x), Random.Range(start.y, end.y), Random.Range(start.z, end.z));
		mPareObj = pare;
		mGiftObjLoader = Global.GetModelLoaderMgr().AsynLoadModel("YYGift/" + res, onLoadFinished, false, true);
	}
	//--------------------------------------------------
	public function destroy() : void
	{
		mGiftObjLoader.Destroy();
		if (mGiftObj)
		{
			GameObject.Destroy(mGiftObj);
		}
	}
	//--------------------------------------------------
	private function onLoadFinished(obj : ModelLoader) : void
	{
		mGiftObj = obj.mModelObj;
		mGiftObj.transform.position = mRandomPos;
		CommFunc.setParent(mPareObj, mGiftObj);
		createTimer(mLife);
	}
	//--------------------------------------------------
	private function createTimer(life : float) : void
	{
		if (0.0f == life)
			return;
		
		var tm : TimerEx = mGiftObj.AddComponent("TimerEx");
		tm.init(life, 1, null, completeTimer, null);
		tm.start();
	}
	//--------------------------------------------------
	private function completeTimer(obj : System.Object) : void
	{
		destroy();
		Gift3DCtrl.Excute("DESTROY_3D_GIFT", null);
	}
	//--------------------------------------------------
	public static function createYYGift3D(row : YYGiftDisplayRow, pare : GameObject) : YYGift3D
	{
		if (null == row || 1 != row.display.Count)
			return null;
		
		return new YYGift3D(row.display[0], row.display_time, row.start_pos, row.end_pos, pare);
	}
	//--------------------------------------------------
}


