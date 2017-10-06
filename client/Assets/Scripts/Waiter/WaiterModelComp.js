#pragma strict
#pragma downcast
import iGUI;

private var mWaiterRow : WaiterRow = null;
private var mAni : Animation = null;

//--------------------------------------------------
public function init(row : WaiterRow) : void
{
	mWaiterRow = row;
	initAnimation(0);
}

//--------------------------------------------------
function Start()
{
	
}

public function destroy() : void
{
	
}

// 初始动作
private function initAnimation(sex : int) : void
{
	mAni = this.gameObject.GetComponentInChildren(Animation);
	if (null == mAni)
		return;
	/*
	var clips : AnimationClip[];
	if (1 == sex)	// 男性
	{
		clips = Global.GetModelLoaderMgr().SyncLoadAnimation(CharacterFactory.ROLE_DIR + "male_action.anis.u3d");
		addCapsuleCollider(Vector3(-0.05, 0.9, 0.04), 0.2, 1.8);
	}
	else	// 女性
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
	}*/
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

