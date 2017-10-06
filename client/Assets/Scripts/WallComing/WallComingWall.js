#pragma strict
#pragma downcast

/*--------------------------------------------------
墙来了(2013/1/6 create by hezhr)
--------------------------------------------------*/



class WallComingWall
{
	private var mWallObj : GameObject = null;
	private var mWallObjLoader : ModelLoader = null;
	private var mBeginPos : Vector3;
	private var mEndPos : float = 0.0f;
	private var mLifeTime : float = 0.0f;
	//--------------------------------------------------
	public function WallComingWall(template : String, begin : Vector3, end : float, life : float)
	{
		var fullDir : String = "Model/WallComing/" + template;
		mWallObjLoader = Global.GetModelLoaderMgr().AsynLoadModel(fullDir, onLoadFinished, false, true);
		mBeginPos = begin;
		mEndPos = end;
		mLifeTime = life;
	}
	//--------------------------------------------------
	private function onLoadFinished(obj : ModelLoader) : void
	{
		mWallObj = obj.mModelObj;
		var comp : WallComingWallMove = mWallObj.AddComponent("WallComingWallMove");
		comp.init(mBeginPos, mEndPos, mLifeTime);
	}
	//--------------------------------------------------
	public function destroy() : void
	{
		WallComingLogic.Ctrl.Excute("WALL_DESTROY", null);
		mWallObjLoader.Destroy();
		if (mWallObj)
		{
			GameObject.Destroy(mWallObj);
		}
	}
	//--------------------------------------------------
}


