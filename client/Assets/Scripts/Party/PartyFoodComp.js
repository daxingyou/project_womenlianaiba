#pragma strict
#pragma downcast
import iGUI;

private var mLastUpdateLayerTime : float = 0;	// 上次更新模型层的时间
private var mAni : Animation = null;
private var mPareObj : GameObject = null;
private var mBornPos : Vector3 = Vector3.zero;	// 出生点

private var mInSelfHouse : boolean = false;	// 是否在自己家
//--------------------------------------------------
public function init(pareObj : GameObject) : void
{
	mPareObj = pareObj;
	mBornPos = pareObj.transform.position;
	initAnimation();
	mInSelfHouse = DataCenter.isInSelfHouse();
	//
}
//--------------------------------------------------
// 食物是否可以点击
public function isCanClicked() : boolean
{
	// 不在自己家才能点
	return !mInSelfHouse;
}
//--------------------------------------------------

//--------------------------------------------------
function Update()
{
	//半秒更新一次layer
	var curr = Time.time;
	if (curr - mLastUpdateLayerTime > 0.5f)
	{
		updateModelLayer();		
		mLastUpdateLayerTime = curr;
	}
}

//--------------------------------------------------
public function destroy() : void
{

}

//--------------------------------------------------
// 更新派对食物所在层
private function updateModelLayer() : void
{
	if (GlobalBlock.isBlock())
		return;
	
	CommFunc.setGameObjectLayer(this.gameObject, EQSceneManager.getSingleton().HouseSceneObj);
}
//--------------------------------------------------

// 初始动作
private function initAnimation() : void
{
	mAni = this.gameObject.GetComponentInChildren(Animation);
	if (null == mAni)
		return;

	if (mPareObj.animation)
	{
		mPareObj.animation.wrapMode = WrapMode.Loop;
		mPareObj.animation.Play();
	}
	// 碰撞器不随着动作而动
	if (false == CommFunc.addMeshCollider(mPareObj, ""))
		throw "SpriteModel -> sprite model can't add mesh collider.";
	
	// 粗略设置碰撞器的位置
	var mc : MeshCollider = mPareObj.GetComponentInChildren(MeshCollider);
	mc.gameObject.transform.localPosition.y = 1.3f;
	return;
}

//--------------------------------------------------