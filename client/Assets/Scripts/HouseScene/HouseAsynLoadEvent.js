/*--------------------------------------------------
房屋及房屋部件相关的异步事件(2011/11/11 create by hezhr)
--------------------------------------------------*/
#pragma strict



/*--------------------------------------------------
*** HosueScene异步事件
--------------------------------------------------*/
// 房屋场景加载事件(包括模型文件和xml文件,两个文件的名称要一样,如:0001.mod.u3d,0001.xml.u3d,且都要放在"/Scene/0001"目录下面)
class HouseSceneLoadEvent extends MainLoadModelCtrlEvent
{
	private var mHouseSceneName : String = "";
	private var mHouseObj : GameObject = null;				// 房屋模型
	private var mHouseObjLoader : ModelLoader = null;
	private var mHouseFile : TextAsset = null;				// 房屋xml文件 
	private var mHouseFileLoader : URLLoader = null;
	function HouseSceneLoadEvent(houseObjName : String, houseFileName : String)
	{
		clearReady();
		mHouseSceneName = houseObjName.Remove(houseObjName.IndexOf("."[0]));
		var dir : String = "Scene/" + mHouseSceneName + "/";
		mHouseObjLoader = Global.GetModelLoaderMgr().AsynLoadModel(dir + houseObjName, onLoadObjFinished);
		mHouseFileLoader = Global.GetAsynResMgr().asynLoad(dir + houseFileName, onLoadFileFinished, true) as URLLoader;
	}
	function onLoadObjFinished(obj : ModelLoader) : void
	{
		mHouseObj = obj.mModelObj;
		checkReady();
	}
	function onLoadFileFinished(loader : IURLLoader, deleCount : int) : void
	{
		mHouseFile = loader.getWWW().assetBundle.mainAsset as TextAsset;
		checkReady();
	}
	function checkReady() : void
	{
		if (mHouseObj && mHouseFile)
		{
			setReady();
		}
	}
	function destroyRes() : void
	{
		// 销毁房屋模型
		if (mHouseObj)
		{
			GameObject.Destroy(mHouseObj);
		}
		mHouseObjLoader.Destroy();
		// 销毁房屋xml文件
		if (mHouseFile)
		{
			GameObject.Destroy(mHouseFile);
		}
		Global.GetAsynResMgr().removeDelegate(mHouseFileLoader.url, onLoadFileFinished);
	}
	// override
	function exce() : void
	{
		var model : HouseScene = mAsynModel as HouseScene;
		CommFunc.setParent(model.GameObj, mHouseObj);
		CommFunc.setGameObjStatic(model.GameObj, true);
		mHouseObj.name = mHouseSceneName;
		model._loadFromString(mHouseFile.text);
		model.buildFrameComps(mHouseObj);
	}
	function cancel() : void
	{
		destroyRes();
	}
}
//--------------------------------------------------





/*--------------------------------------------------
*** HouseSceneComponent异步事件
--------------------------------------------------*/
// 房屋部件模型加载事件
class HouseComponentModelLoadEvent extends MainLoadModelCtrlEvent
{
	private var mCompObj : GameObject = null;
	private var mCompObjLoader : ModelLoader = null;
	private var mParticleObj : GameObject = null;
	private var mParticleObjLoader : ModelLoader = null;
	private var mCompRow : HouseCompRow = null;
	private var mIsFrame : boolean = false;
	function HouseComponentModelLoadEvent(compRow : HouseCompRow, isFrame : boolean)
	{
		clearReady();
		mIsFrame = isFrame;
		// 框架:墙壁,地板
		if (isFrame)
		{
			setReady();
			return;
		}
		mCompRow = compRow;
		// 加载房屋部件:门,窗等.异步加载
		var compDir : String = "Model/Furniture/" + compRow.model;
		mCompObjLoader = Global.GetModelLoaderMgr().AsynLoadModel(compDir, onLoadCompFinished, false, true);
		// 加载粒子效果
		if (null != compRow.particle && "" != compRow.particle && "0" != compRow.particle)
		{
			var particleDir : String = "Model/Particle/" + compRow.particle;
			mParticleObjLoader = Global.GetModelLoaderMgr().AsynLoadModel(particleDir, onLoadParticleFinished, false, true);
		}
	}
	function onLoadCompFinished(obj : ModelLoader) : void
	{
		mCompObj = obj.mModelObj;
		attachParticle(mCompObj, mParticleObj);
		setReady();
	}
	function onLoadParticleFinished(obj : ModelLoader) : void
	{
		mParticleObj = obj.mModelObj;
		attachParticle(mCompObj, mParticleObj);
	}
	function attachParticle(comp : GameObject, particle : GameObject) : void
	{
		if (null == comp || null == particle)
			return;
		
		CommFunc.setGameObjVisible(particle, CommFunc.isGameObjVisible(comp));
		CommFunc.setParent(comp, particle);
		CommFunc.setPosition(particle, mCompRow.particle_pos);
	}
	function destroyRes() : void
	{
		// 销毁粒子效果
		if (mParticleObj)
		{
			GameObject.Destroy(mParticleObj);
		}
		if (mParticleObjLoader)
		{
			mParticleObjLoader.Destroy();
		}
		// 销毁部件模型
		if (mCompObj)
		{
			GameObject.Destroy(mCompObj);
		}
		mCompObjLoader.Destroy();
	}
	// override
	function exce() : void
	{
		if (mIsFrame)
			return;
		
		var model : HouseSceneComponent = mAsynModel as HouseSceneComponent;
		if (null == model.GameObj)	// 部件加载完,但是房屋已经被销毁
		{
			destroyRes();
			return;
		}
		mCompObj.name = model.Template + "_" + mCompObj.GetHashCode().ToString("X");
		CommFunc.setGameObjectLayer(mCompObj, model.GameObj.layer);		// 和父节点同一个层次
		CommFunc.addMeshCollider(mCompObj, "");							// 加碰撞器,这样鼠标才能选取
		CommFunc.setParent(model.GameObj, mCompObj);					// 设置父节点
		CommFunc.setGameObjStatic(model.GameObj, true);					// 设置为静态遮挡
		FurnitureComponent.setFurniAniPos(mCompObj, 1, 0);				// 停在第0帧
		model.ModelObj = mCompObj;
		model.SysnVisible();
		// 
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_HOUSE_COMP_LOAD_FINISHED), model);
	}
	function cancel() : void
	{
		destroyRes();
	}
}
//--------------------------------------------------
// 房屋部件显示事件
class HouseComponentSetVisibleEvent extends ReplaceChaseMainLoadModelCtrlEvent
{
	private var _visible : boolean = false;
	function HouseComponentSetVisibleEvent(visible:boolean)
	{
		_visible = visible;
	}
	// override
	function exce() : void
	{
		var model : HouseSceneComponent = mAsynModel as HouseSceneComponent;
		if (null == model.GameObj)
		{
			model.GameObj = GameObject.Find(model.Template);
		}
		model._setVisible(_visible);
	}
}
//--------------------------------------------------
// 家具设置动画位置事件
class FurnitureCompSetAnimationPosEvent extends ReplaceChaseMainLoadModelCtrlEvent
{
	private var mTotalFrame : int = 0;
	private var mFrame : int = 0;
	function FurnitureCompSetAnimationPosEvent(total_frame : int, frame : int)
	{
		mTotalFrame = total_frame;
		mFrame = frame;
	}
	// override
	function exce() : void
	{
		var model : HouseSceneComponent = mAsynModel as HouseSceneComponent;
		FurnitureComponent.setFurniAniPos(model.ModelObj, mTotalFrame, mFrame);
	}
}
//--------------------------------------------------
// 家具播放动画
class FurnitureCompPlayAnimationEvent extends ReplaceChaseMainLoadModelCtrlEvent
{
	private var mMode : WrapMode = WrapMode.Once;
	function FurnitureCompPlayAnimationEvent(mode : WrapMode)
	{
		mMode = mode;
	}
	// override
	function exce() : void
	{
		var model : HouseSceneComponent = mAsynModel as HouseSceneComponent;
		FurnitureComponent.playFurniAni(model.ModelObj, mMode);
	}
}
//--------------------------------------------------
// 家具停止动画
class FurnitureCompStopAnimationEvent extends ReplaceChaseMainLoadModelCtrlEvent
{
	function FurnitureCompStopAnimationEvent()
	{
	}
	// override
	function exce() : void
	{
		var model : HouseSceneComponent = mAsynModel as HouseSceneComponent;
		FurnitureComponent.stopFurniAni(model.ModelObj);
	}
}
//--------------------------------------------------


