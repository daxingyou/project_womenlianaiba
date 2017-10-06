#pragma strict
#pragma downcast

/*--------------------------------------------------
墙来了墙的挂接脚本(2013/1/5 create by hezhr)
--------------------------------------------------*/
private var mStartTime : float = 0.0f;		// 墙体开始移动时间
private var mLifeTime : float = 0.0f;		// 墙体生命周期(秒)
private var mSpeed : float = 0.0f;			// 墙体移动速度


//--------------------------------------------------
function Update()
{
	if (0.0f == mSpeed)
		return;
	
	gameObject.transform.position.z -= Time.deltaTime * mSpeed;
	// 墙的生命周期到,销毁墙体
	if (Time.time - mStartTime >= mLifeTime)
	{
		WallComingLogic.Ctrl.Excute("WALL_DESTROY", null);
		GameObject.Destroy(gameObject);
	}
}
//--------------------------------------------------
public function init(beginPos : Vector3, end : float, life : float) : void
{
	gameObject.transform.position = beginPos;
	mStartTime = Time.time;
	mLifeTime = life;
	mSpeed = Mathf.Abs(end - beginPos.z)/life;
}
//--------------------------------------------------


