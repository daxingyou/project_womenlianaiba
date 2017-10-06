/*--------------------------------------------------
家具粒子效果脚步(2012/6/26 create by hezhr)
--------------------------------------------------*/
#pragma strict


public var Offset : Vector3 = Vector3.zero;				// 粒子位置
private var mFurnitureObj : GameObject = null;			// 家具模型
private var mParticleObj : GameObject = null;			// 粒子模型
private var mParticleLoader : ModelLoader = null;		// 粒子异步加载


//--------------------------------------------------
// 每帧更新
function Update()
{
	if (mParticleObj)
	{
		mParticleObj.transform.localPosition = Offset;
	}
}
//--------------------------------------------------
// 加载粒子
public function setParticleResource(furni_obj : GameObject, resource : String, pos : Vector3) : void
{
	if (null==furni_obj || null==resource || ""==resource || "(null)"==resource)
		return;
	
	mFurnitureObj = furni_obj;
	var fullDir : String = "Model/Particle/" + resource;	// 粒子的完整路径
	mParticleLoader = Global.GetModelLoaderMgr().AsynLoadModel(fullDir, onLoadFinished, false, true);
	Offset = pos;
}
//--------------------------------------------------
// 回调
private function onLoadFinished(obj : ModelLoader) : void
{
	if (null == mFurnitureObj)
	{
		destroyRes();
		return;
	}
	mParticleObj = obj.mModelObj;
	mParticleObj.transform.parent = mFurnitureObj.transform;
	mParticleObj.transform.localPosition = Offset;
}
//--------------------------------------------------
// 删除粒子
public function destroyRes() : void
{
	GameObject.Destroy(mParticleObj);
	mParticleLoader.Destroy();
}
//--------------------------------------------------
// 添加家具粒子组件
public static function addFurnitureParticle(furni_obj : GameObject, resource : String, pos : Vector3) : void
{
	if (null==furni_obj || null==resource || ""==resource || "(null)"==resource)
		return;
	
	var fp : FurnitureParticle = furni_obj.AddComponent(FurnitureParticle);
	fp.setParticleResource(furni_obj, resource, pos);
}
//--------------------------------------------------
// 删除家具粒子组件
public static function removeFurnitureParticle(furni_obj : GameObject) : void
{
	if (null == furni_obj)
		return;
	
	var fp : FurnitureParticle = furni_obj.GetComponent(FurnitureParticle);
	if (fp)
	{
		fp.destroyRes();
		GameObject.Destroy(fp);
	}
}
//--------------------------------------------------

