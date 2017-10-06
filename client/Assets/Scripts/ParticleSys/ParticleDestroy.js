#pragma strict
/*
//particle system--destroy auto
//creat by fullzhu 2012.5.29
//last edit at 2012.5.29 by fullzhu
*/

private var mParticleSystem : ParticleSystem;
private var mPlayerObj : GameObject = null;

private var mRemainTime : float = 0;					//remain time(second)
private var mTotalTime : float = 0;

function Awake() {
	mParticleSystem = this.gameObject.GetComponent(ParticleSystem);
	mPlayerObj = this.gameObject;
	
	mRemainTime = 0;
	if (mParticleSystem) {
		mTotalTime = mParticleSystem.startLifetime + mParticleSystem.duration;
	}
}
	
function Start() {
}
	
function Update() {
	if (0 == mTotalTime)
		return;
	
	mRemainTime += Time.deltaTime;
	if(mRemainTime >= mTotalTime) {
		Destroy();
	}
}

function Destroy() {
	GameObject.Destroy(this.gameObject);
}