#pragma strict

//public var mFbx : Object;
public var mNpcID : int = 0;
public var mColliderCenter : Vector3 = Vector3(0, 0.8, 0);
public var mColliderRadius : float = 0.18;
public var mColliderHeight : float = 1.65;
public var mHightLight : Color = Color(0.4, 0.4 ,0.4, 0);

private var mModel : GameObject;

function Start () {
	//var mFbx : Transform = GameObject.Instantiate(mFbx, Vector3.zero, Quaternion.identity)
	var col:CapsuleCollider = this.gameObject.AddComponent("CapsuleCollider") as CapsuleCollider;
	col.center = mColliderCenter;
	col.radius = mColliderRadius;
	col.height = mColliderHeight;
	
	var trans : Transform = this.gameObject.transform.Find("Model");
	if(trans != null) {
		mModel = trans.gameObject;
		mModel.animation.wrapMode = WrapMode.Loop;
		mModel.animation.Play();
	}
}

//logic funciton 
function DoAnim(anim:String, mode:WrapMode) {
	if(!mModel || anim == "") return ;
	
	mModel.animation.wrapMode = WrapMode.Loop;
	mModel.animation.Play(anim);
}

function GetNpcID() : int {
	return mNpcID;
}