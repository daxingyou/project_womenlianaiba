#pragma strict
#pragma downcast



class GuestModel
{
	private var mObj : GameObject = null;
	private var mGuestRow : GuestRow = null;
	private var mGuestLoader : ModelLoader = null;
	private var mParticleLoader : ModelLoader = null;
	private var mComp : SpriteGuestComp = null;
	private var mClicked : boolean = false;
	private var mRemainTime : int = 20;					// 剩余显示时间
	private var mVisible : boolean = true;				
	private var mParticleFlag : int = 0;					// 1.开始粒子,2.结束粒子
	private var mParticleEnd : String = "";				// 结束的粒子效果
	//--------------------------------------------------
	public function GuestModel(id : int, bornPos : Vector3)
	{
		mObj = new GameObject("guest_" + id.ToString());
		// 随机出生点
		randomBorn();
		mGuestRow = ResManager.LgtMgr.getGuestRow(id);
		
		// 粒子效果
		var row : NormalSpriteRow = ResManager.LgtMgr.getNormalSpriteRow(1);
		var dir : String = "Model/Sprite/";
		var parStart : String = row.show;
		var parHalo : String = row.halo;		
		mParticleEnd = row.dispear;
		
		if ("" != parStart)
		{
			mVisible = false;
			mParticleFlag = 1;
			mParticleLoader = Global.GetModelLoaderMgr().AsynLoadModel(dir + parStart, onLoadParticleFinished, false, true);
		}
		var res : String = "Model/NPC/" + mGuestRow.model;		
		mGuestLoader = Global.GetModelLoaderMgr().AsynLoadModel(res, onLoadGuestFinished, false, mVisible);

		GuestLogic.Ctrl.Register("CAN_CLICK_GUEST", canClickGuest);
	}
	//--------------------------------------------------
	private function onLoadGuestFinished(obj : ModelLoader) : void
	{
		var spriteObj : GameObject = obj.mModelObj;
		
		CommFunc.setRotate(spriteObj, Vector3(0, Random.Range(0, 360), 0));
		CommFunc.setGameObjVisible(spriteObj, mVisible);
		CommFunc.setParent(mObj, spriteObj);
		CommFunc.setGameObjectLayer(mObj, EQSceneManager.getSingleton().HouseSceneObj);
		createTimer(mRemainTime);

		mComp = obj.mModelObj.AddComponent("SpriteGuestComp");
		mComp.init(obj.mModelObj, mGuestRow);
	}
	
	private function onLoadParticleFinished(obj : ModelLoader) : void
	{
		var particleObj : GameObject = obj.mModelObj;
		CommFunc.setParent(mObj, particleObj);
		var parSys : ParticleSystem = particleObj.GetComponent("ParticleSystem");
		var tm : TimerEx = particleObj.AddComponent("TimerEx");
		tm.init((parSys.duration/2)*1000, 1, null, particleCompleteTimer, null);
		tm.start();
	}
	
	private function onLoadHaloFinished(obj : ModelLoader) : void
	{
		if (mGuestLoader && mGuestLoader.mModelObj)
		{
			CommFunc.setParent(mGuestLoader.mModelObj, "Bip01", obj.mModelObj);
			CommFunc.setGameObjVisible(obj.mModelObj, true);
		}
	}
	
	private function particleCompleteTimer(obj : System.Object) : void
	{
		if (1 == mParticleFlag)
		{
			mVisible = true;
			if (mGuestLoader)
			{
				CommFunc.setGameObjVisible(mGuestLoader.mModelObj, true);
			}
		}
		else if (2 == mParticleFlag)
		{
			destroy(true);
		}
	}
	
	//
	private function createTimer(seconds : float) : void
	{
		var tm : TimerEx = mObj.AddComponent("TimerEx");
		tm.init(seconds*1000, 1, null, completeTimer, null);
		tm.start();
	}
	//--------------------------------------------------
	private function completeTimer(obj : System.Object) : void
	{
		if(mComp && mComp.gameObject)
			GuestLogic.getInstance().destroyGuest(mComp.gameObject, false);
	}
	
	//--------------------------------------------------
	public function destroy(direct : boolean) : void
	{
		if (mComp)
		{
			mComp.destroy();
		}
		if (mGuestLoader)
		{
			mGuestLoader.Destroy();
			mGuestLoader = null;
		}
		if (mParticleLoader)
		{
			mParticleLoader.Destroy();
			mParticleLoader = null;
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
		
		GuestLogic.Ctrl.Unregister("CAN_CLICK_GUEST", canClickGuest);
	}
	//--------------------------------------------------
	public function getGuestObj() : GameObject
	{
		return mGuestLoader ? mGuestLoader.mModelObj : null;
	}
	//--------------------------------------------------
	public function isEqual(obj : GameObject) : boolean
	{
		return CommFunc.existChildGameObj(mObj, obj);
	}
	
	//--------------------------------------------------
	public function onClicked() : void
	{
		// 客人没被设置为可点击时不能点
		if (null == mComp || false == mComp.isCanClicked() || mClicked)
			return;
		
		mClicked = true;
		GuestLogic.request_click_guest(mComp.getAppraise());
		mComp.destroyHeadIcon();		// 删除客人头顶星星
		if(mComp && mComp.gameObject)
		{
			GuestLogic.getInstance().destroyGuest(mComp.gameObject, false);
		}
//		var x : float = Input.mousePosition.x;
//		var y : float = Screen.height - Input.mousePosition.y;
//		showExp(x - 50, y, 111);
//		showDiamond(x + 50, y, 222);
//		showMaterial(x, y + 50, 333);
	}
	//--------------------------------------------------
	private function canClickGuest(canClick : int) : void
	{
		if (false == mClicked)
			return;
		
		// 点击的是该客人
		if (0 == canClick)	// 不可点击
		{
			mClicked = false;
		}
		else
		{
			mComp.destroyHeadIcon();	// 删除客人头顶星星
		}
	}
	//--------------------------------------------------
	//随机出生
	private function randomBorn() : void
	{
		var randomGrid : HouseSceneGrid = HouseSceneGrid.getRandomGridInWalkAreaByFloor(new Array(), 1);
		mObj.transform.position =  randomGrid.GetPosition(Space.World);
	}
	//--------------------------------------------------
}


