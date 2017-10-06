#pragma strict
#pragma downcast



class SpriteModel
{
	private var mObj : GameObject = null;					// 
	private var mId : int = 0;								//
	private var mSpriteLoader : ModelLoader = null;			// 
	private var mHaloLoader : ModelLoader = null;			// 
	private var mParticleLoader : ModelLoader = null;		// 
	private var mLayer : int = 0;							// 模型显示的层
	private var mVisible : boolean = true;					// 小精灵模型加载完初始是否可见
	private var mRemainTime : int = 0;						// 剩余显示时间
	private var mParticleFlag : int = 0;					// 1.开始粒子,2.结束粒子
	private var mParticleEnd : String = "";					// 结束粒子
	//--------------------------------------------------
	public function SpriteModel(id : int, res : String, parStart : String, parEnd : String, parHalo : String, pos : Vector3, remainShowTime : int, pare : GameObject, ly : int)
	{
		mObj = new GameObject("sprite_" + id.ToString());
		mObj.transform.position = pos;
		CommFunc.setParent(pare, mObj);
		// 
		mId = id;
		mRemainTime = remainShowTime;
		mLayer = ly;
		// 加载
		var dir : String = "Model/Sprite/";
		if ("" != parStart)
		{
			mVisible = false;
			mParticleFlag = 1;
			mParticleLoader = Global.GetModelLoaderMgr().AsynLoadModel(dir + parStart, onLoadParticleFinished, false, true);
		}
		mSpriteLoader = Global.GetModelLoaderMgr().AsynLoadModel(dir + res, onLoadSpriteFinished, false, mVisible);
		mHaloLoader = Global.GetModelLoaderMgr().AsynLoadModel(dir + parHalo, onLoadHaloFinished, false, mVisible);
	}
	//--------------------------------------------------
	private function createTimer(seconds : float) : void
	{
		var tm : TimerEx = mObj.AddComponent("TimerEx");
		tm.init(seconds*1000, 1, null, completeTimer, null);
		tm.start();
	}
	//--------------------------------------------------
	private function completeTimer(obj : System.Object) : void
	{
		SpriteLogic.getInstance().destroySprite(mId, true);
	}
	//--------------------------------------------------
	private function onLoadParticleFinished(obj : ModelLoader) : void
	{
		var particleObj : GameObject = obj.mModelObj;
		CommFunc.setParent(mObj, particleObj);
		var parSys : ParticleSystem = particleObj.GetComponent("ParticleSystem");
		var tm : TimerEx = particleObj.AddComponent("TimerEx");
		tm.init((parSys.duration/2)*1000, 1, null, particleCompleteTimer, null);
		tm.start();
	}
	//--------------------------------------------------
	private function particleCompleteTimer(obj : System.Object) : void
	{
		if (1 == mParticleFlag)
		{
			mVisible = true;
			if (mSpriteLoader)
			{
				CommFunc.setGameObjVisible(mSpriteLoader.mModelObj, true);
			}
		}
		else if (2 == mParticleFlag)
		{
			destroy(true);
		}
	}
	//--------------------------------------------------
	private function onLoadSpriteFinished(obj : ModelLoader) : void
	{
		var spriteObj : GameObject = obj.mModelObj;
		if (spriteObj.animation)
		{
			spriteObj.animation.playAutomatically = true;
			spriteObj.animation.wrapMode = WrapMode.Loop;
		}
		// 碰撞器不随着动作而动
		if (false == CommFunc.addMeshCollider(spriteObj, ""))
			throw "SpriteModel -> sprite model can't add mesh collider.";
		
		// 粗略设置碰撞器的位置
		var mc : MeshCollider = spriteObj.GetComponentInChildren(MeshCollider);
		mc.gameObject.transform.localPosition.y = 1.3f;
		CommFunc.setRotate(spriteObj, Vector3(0, Random.Range(0, 360), 0));
		CommFunc.setGameObjVisible(spriteObj, mVisible);
		CommFunc.setParent(mObj, spriteObj);
		CommFunc.setGameObjectLayer(mObj, mLayer);
		createTimer(mRemainTime);
		if (mHaloLoader && mHaloLoader.mModelObj)
		{
			CommFunc.setParent(obj.mModelObj, "Bip01", mHaloLoader.mModelObj);
			CommFunc.setGameObjVisible(mHaloLoader.mModelObj, true);
		}
	}
	//--------------------------------------------------
	private function onLoadHaloFinished(obj : ModelLoader) : void
	{
		if (mSpriteLoader && mSpriteLoader.mModelObj)
		{
			CommFunc.setParent(mSpriteLoader.mModelObj, "Bip01", obj.mModelObj);
			CommFunc.setGameObjVisible(obj.mModelObj, true);
		}
	}
	//--------------------------------------------------
	public function destroy(direct : boolean) : void
	{
		if (mParticleLoader)
		{
			mParticleLoader.Destroy();
			mParticleLoader = null;
		}
		if (mSpriteLoader)
		{
			mSpriteLoader.Destroy();
			mSpriteLoader = null;
		}
		if (mHaloLoader)
		{
			mHaloLoader.Destroy();
			mHaloLoader = null;
		}
		if (direct || "" == mParticleEnd)
		{
			GameObject.Destroy(mObj);
			return;
		}
		//
		mParticleFlag = 2;
		var dir : String = "Model/Sprite/";
		mParticleLoader = Global.GetModelLoaderMgr().AsynLoadModel(dir + mParticleEnd, onLoadParticleFinished, false, true);
	}
	//--------------------------------------------------
	public function getId() : int
	{
		return mId;
	}
	//--------------------------------------------------
	public function isEqual(obj : GameObject) : boolean
	{
		return CommFunc.existChildGameObj(mObj, obj);
	}
	//--------------------------------------------------
	public function getSpriteObj() : GameObject
	{
		if (null == mSpriteLoader)
			return null;
		
		return mSpriteLoader.mModelObj;
	}
	//--------------------------------------------------
	public function setCanClicked(canClicked : boolean) : void
	{
		var obj : GameObject = getSpriteObj();
		if (null == obj)
			return;
		
		var mc : MeshCollider = obj.GetComponentInChildren(MeshCollider);
		if (null == mc)
			return;
		
		mc.enabled = canClicked;
	}
	//--------------------------------------------------
}


