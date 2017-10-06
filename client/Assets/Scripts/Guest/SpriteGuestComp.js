#pragma strict
#pragma downcast
import iGUI;

private var mMoveSpeed : float = 0.02f;			// 移动速度
private var mRotateTime : float = 0.2f;			// 转弯过渡时间0.2
private var mMovePath : Array = null;           // 移动路径
private var mMoveBegin : Vector3 = Vector3.zero;	// 移动开始位置
private var mMoveEnd : Vector3 = Vector3.zero;	// 移动结束位置
private var mLastUpdateLayerTime : float = 0;	// 上次更新模型层的时间
private var mDegree : float = 180.0f;			// 模型初始朝向-x轴
private var mAni : Animation = null;
private var mPareObj : GameObject = null;
private var mGuestRow : GuestRow = null;
private var mReachTargetCount : int = 0;		// 到达目标点的次数
private var mBornPos : Vector3 = Vector3.zero;	// 出生点
private var mNameLabel : iGUILabel = null;		// 名字控件
private var mTimer : Timer = null;
private var mNeedFoodRow : BartenderFoodBaseInfoRow = null;	// 需要的食物
private var mNeedFoodLoader : ModelLoader = null;	// 需要食物的模型
private var mHeadIconLoader : ModelLoader = null;	// 客人头顶模型
private var mExistFood : boolean = false;	// 是否存在随机到的食物
private var mIsSatisfy : int = 0;				// 是否满意,0:不满意(没有酒水),1:不满意(有酒水),2:满意(有酒水)
private var mIsHeadLoaded : boolean = false;	// 头顶模型是否加载完
private var mAppraise : int = 1;	// 当前客人的评价分数,默认为1
private var mInSelfHouse : boolean = false;	// 是否在自己家
//--------------------------------------------------
public function init(pareObj : GameObject, row : GuestRow) : void
{
	mPareObj = pareObj;
	mBornPos = pareObj.transform.position;
	mGuestRow = row;
	initAnimation(row.sex);
	mInSelfHouse = DataCenter.isInSelfHouse();
	//
	showNeedFood();
}
//--------------------------------------------------
// 是否存在食物
public function isExistFood() : boolean
{
	return mExistFood;
}
//--------------------------------------------------
// 客人是否可以点击
public function isCanClicked() : boolean
{
	// 自己家才能点击客人,并且客人满意
	return mInSelfHouse && 2 == mIsSatisfy && mIsHeadLoaded;
}
//--------------------------------------------------
// 获取当前客人的评价分数
public function getAppraise() : int
{
	return mAppraise;
}
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
function OnGUI()
{
	showName();
}
//--------------------------------------------------
public function destroy() : void
{
	var headupRoot : iGUIRoot = UI.getUI().OpenUIRoot("PlayerHeadupRoot");
	if (headupRoot && mNameLabel)
	{
		headupRoot.removeElement(mNameLabel);
	}
	destroyTimer();
	destroyNeedFood();
	destroyHeadIcon();
}

//--------------------------------------------------
// 更新客人所在层
private function updateModelLayer() : void
{
	if (GlobalBlock.isBlock())
		return;
	
	CommFunc.setGameObjectLayer(this.gameObject, EQSceneManager.getSingleton().HouseSceneObj);
}
//--------------------------------------------------

// 初始动作
private function initAnimation(sex : int) : void
{
	mAni = this.gameObject.GetComponentInChildren(Animation);
	if (null == mAni)
		return;
	
	var clips : AnimationClip[];
	if (0 == sex) //无性
	{
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
	else if (1 == sex)	// 男性
	{
		clips = Global.GetModelLoaderMgr().SyncLoadAnimation(CharacterFactory.ROLE_DIR + "male_action.anis.u3d");
		addCapsuleCollider(Vector3(-0.05, 0.9, 0.04), 0.2, 1.8);
	}
	else if(2 == sex)	// 女性
	{
		clips = Global.GetModelLoaderMgr().SyncLoadAnimation(CharacterFactory.ROLE_DIR + "female_action.anis.u3d");
		addCapsuleCollider(Vector3(0, 0.8, 0), 0.18, 1.65);
	}
	for (var clip : AnimationClip in clips)
	{
		mAni.AddClip(clip, clip.name);
		if (clip.name.Equals("stand"))
		{
			mAni.clip = clip;
		}
	}
	mAni.wrapMode = WrapMode.Loop;
	mAni.Play();
}
//--------------------------------------------------
// 播放动作
private function playAnimation(aniName : String, loop : boolean) : void
{
	if (null == mAni)
		return;
	
	mAni[aniName].wrapMode = loop ? WrapMode.Loop : WrapMode.Once;
	mAni.Play(aniName);
}
//--------------------------------------------------
// 添加碰撞器
private function addCapsuleCollider(center : Vector3, radius : float, height : float) : void
{
	var col : CapsuleCollider = this.gameObject.AddComponent("CapsuleCollider");
	col.center = center;
	col.radius = radius;
	col.height = height;
}
//--------------------------------------------------
// 创建定时器,参数:时间间隔,标识
private function createTimer(interval : float, flag : int) : void
{
	mTimer = new Timer(interval, 1, flag);
	mTimer.addEventListener(TimerEvent.TIMER, oneTime);
	mTimer.addEventListener(TimerEvent.TIMER_COMPLETE, overTime);
	mTimer.Start();
}
//--------------------------------------------------
// 删除定时器
private function destroyTimer() : void
{
	if (mTimer)
	{
		mTimer.Stop();
		mTimer = null;
	}
}
//--------------------------------------------------
private function oneTime(tmr : Timer, obj : System.Object) : void 
{
	var flag : int = obj;
	switch (flag)
	{
	case 0:	// 没有找到随机可行走的位置,在一定时间后重新寻找
		//randomWalk();
		break;
	case 1:	// 在出生点,显示完需要食物效果,检查是否有食物
		checkNeedFoodExist();
		break;
	case 2:	// 在随机位置,并播放完动作,准备回出生点
		//startWalk(mBornPos);
		break;
	}
}
//--------------------------------------------------
private function overTime(tmr : Timer, obj : System.Object) : void {}
//--------------------------------------------------
// 显示所需食物
private function showNeedFood() : void
{
	var row : BartenderFoodBaseInfoRow = GuestLogic.getInstance().getRandomNeedFood();
	if (null == row || null == row.particle || "" == row.particle || !mInSelfHouse)
	{
		createTimer(1500, 1);
	}
	else
	{
		mNeedFoodRow = row;
		mExistFood = BartenderSys.getInstance().foodIsInStock(row.food_id);
		var existFood : boolean = mExistFood;
		if (!existFood && NewHandGuideLogic.getInstance().isClickGuestNewHandTask())	// 在做点击客人的新手任务时,设置为一定有库存
		{
			existFood = true;
		}
		// 有食物时,有百分之八十的概率满意
		mIsSatisfy = existFood ? (CommFunc.getProbability(80) ? 2 : 1) : 0;
		var dir : String = "Model/Particle/" + row.particle;
		mNeedFoodLoader = Global.GetModelLoaderMgr().AsynLoadModel(dir, onLoadNeedFoodParticleFinished, false, true);
	}
}
//--------------------------------------------------
// 所需食物加载完成
private function onLoadNeedFoodParticleFinished(obj : ModelLoader) : void
{
	CommFunc.setParent(mPareObj, obj.mModelObj);
	obj.mModelObj.transform.position.y = 2.5f;
	createTimer(1500, 1);
}
//--------------------------------------------------
// 删除所需食物模型
private function destroyNeedFood() : void
{
	if (mNeedFoodLoader)
	{
		mNeedFoodLoader.Destroy();
		mNeedFoodLoader = null;
	}
}
//--------------------------------------------------
// 检查是否存在食物
private function checkNeedFoodExist() : void
{
	if (null == mNeedFoodRow || !mInSelfHouse)
	{
		//randomWalk();
		return;
	}
	// 删除索要食物效果
	destroyNeedFood();
	// 根据满意度显示不同头顶图标
	switch (mIsSatisfy)
	{
	case 0:	// 不满意(没有酒水),显示不满意图标
		showHeadIcon(mNeedFoodRow.unsatisfy);
		break;
	case 1:	// 不满意(有酒水),不显示图标
		//randomWalk();
		break;
	case 2:	// 满意(有酒水),显示满意图标
		// 根据条件显示小星星|大星星
		var starId : int = 0;
		var buff : BuffInfo = BuffLogic.getValidBuff(1);
		// 有buff,则有百分之五十的概率产生超级评价
		if (buff)
		{
			var probability : boolean = CommFunc.getProbability(50);
			starId = probability ? 1 : 10;
			mAppraise = probability ? 1 : 10;
		}
		var row : GuestStarRow = ResManager.LgtMgr.getGuestStarRow(starId);
		showHeadIcon(row.star);
		break;
	}
}
//--------------------------------------------------
// 显示头顶图标(根据满意度)
private function showHeadIcon(icon : String) : void
{
	if (null == icon || "" == icon)
		return;
	
	var dir : String = "Model/Particle/" + icon;
	mHeadIconLoader = Global.GetModelLoaderMgr().AsynLoadModel(dir, onLoadHeadIconFinished, false, true);
}
//--------------------------------------------------
// 头顶模型加载完成
private function onLoadHeadIconFinished(obj : ModelLoader) : void
{
	CommFunc.setParent(mPareObj, obj.mModelObj);
	obj.mModelObj.transform.position.y = 2.5f;
	mIsHeadLoaded = true;
	//randomWalk();
}
//--------------------------------------------------
// 删除头顶模型
public function destroyHeadIcon() : void
{
	if (mHeadIconLoader)
	{
		mHeadIconLoader.Destroy();
		mHeadIconLoader = null;
	}
}
//--------------------------------------------------
// 显示头顶名字
private function showName() : void
{
	if ("" == mGuestRow.name)
		return;
	
	if (null == mNameLabel)
	{
		var headupRoot : iGUIRoot = UI.getUI().OpenUIRoot("PlayerHeadupRoot");
		mNameLabel = headupRoot.addElement("iGUILabel", Rect(0,0,100,20));
		mNameLabel.style.alignment = TextAnchor.MiddleCenter;
		mNameLabel.labelColor = Color(0,255,0);
		mNameLabel.style.wordWrap  = false;
		mNameLabel.style.fontSize = 15;
		mNameLabel.style.fontStyle = FontStyle.Bold;
		UI.getUI().SetIgnoreMouseOver(mNameLabel, true);
	}
	else
	{
		var c : Vector3 = Camera.main.WorldToScreenPoint(mPareObj.transform.position + Vector3(0, 1.8f, 0));
		if (c.z > 0)
		{
			var x : float = c.x - mNameLabel.positionAndSize.width/2;
			if (x < 2 && x > 0)
			{
				x = 2;
			}
			else if (x > -2 && x < 0) 
			{
				x = -2;
			}
			mNameLabel.setX(x);
			var y : float = Camera.main.pixelHeight - c.y - mNameLabel.positionAndSize.height;
			if (y < 2 && y > 0)
			{
				y = 2;
			}
			else if (y > -2 && y < 0)
			{
				y = -2;
			}
			mNameLabel.setY(y);
			
			mNameLabel.label.text = mGuestRow.name;
			var size : Vector2 = mNameLabel.style.CalcSize(mNameLabel.label);
			mNameLabel.setWidth(size.x);
			mNameLabel.setHeight(size.y);
			mNameLabel.enabled = true;
		}
		else
		{
			mNameLabel.enabled = false;
		}
	}
}
//--------------------------------------------------