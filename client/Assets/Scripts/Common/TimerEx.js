#pragma strict
#pragma downcast


private var mRunning : boolean = false;					// 运行标识
private var mStartTime : float = 0.0f;					// 开始时间
private var mInterval : float = 0.0f;					// 每次时间间隔(秒)
private var mTotalCount : int = 0;						// 执行总次数,0表示无限循环
private var mCurCount : int = 0;						// 当前次数
private var mCallbackListen : Function = null;
private var mCallbackEnd : Function = null;
private var mParam : System.Object = null;
//--------------------------------------------------
function FixedUpdate()
{
	if (false == mRunning || false == checkOneTime())
		return;
	
	// 定时器运行
	if (0 == mTotalCount)	// 无限循环
	{
		excuteCallback(mCallbackListen);
	}
	else					// 有限循环
	{
		if (++mCurCount < mTotalCount)
		{
			excuteCallback(mCallbackListen);
		}
		else	// 最后一次
		{
			excuteCallback(mCallbackEnd);
			stop();
		}
	}
}
//--------------------------------------------------
private function checkOneTime() : boolean
{
	if (Time.time - mStartTime >= mInterval)
	{
		mStartTime = Time.time;
		return true;
	}
	return false;
}
//--------------------------------------------------
private function excuteCallback(callback : Function) : void
{
	if (callback)
	{
		callback(mParam);
	}
}
//--------------------------------------------------
// 初始定时器;interval:微秒1000=1s
public function init(interval : float, total : int, listen : Function, end : Function, param : System.Object) : void
{
	mInterval = interval / 1000;
	mTotalCount = total;
	mCallbackListen = listen;
	mCallbackEnd = end;
	mParam = param;
}
//--------------------------------------------------
// 开始
public function start() : void
{
	mRunning = true;
	mStartTime = Time.time;
}
//--------------------------------------------------
// 停止
public function stop() : void
{
	mRunning = false;
	mCurCount = 0;
}
//--------------------------------------------------
// 获取参数
public function getParam() : System.Object
{
	return mParam;
}
//--------------------------------------------------


