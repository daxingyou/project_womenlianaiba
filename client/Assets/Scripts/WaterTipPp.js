/*
	浇水泡泡提示
*/
#pragma strict

var mInterval_OnTimer:float = 120000f;
var mPaopaoLife:float = 5000f;
private var mEnablePpTimer:Timer = null;
private var mEnableCount:int = 0;
private var mDisableCount:int = 1;

//--
function Start(){
	mEnablePpTimer = new Timer(mInterval_OnTimer, mEnableCount);
	mEnablePpTimer.addEventListener(TimerEvent.TIMER, OnTimer_EnablePp);
	mEnablePpTimer.addEventListener(TimerEvent.TIMER_COMPLETE, Timer_EnablePp_Complete);
	mEnablePpTimer.Start();
}
//--
function OnDisable(){
	mEnablePpTimer.Stop();
	mEnablePpTimer = null;
}
//--
function OnTimer_EnablePp(_timer:Timer, obj:Object){
	/*
		1.向主界面发送显示提示泡泡的消息
		2.启动一个定时器，用来定时泡泡显示时长
	*/
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ENABLEWATERPP_ONTIMER), null);
	var disablePpTimer:Timer = new Timer(mPaopaoLife, mDisableCount);
	disablePpTimer.addEventListener(TimerEvent.TIMER, OnTimer_DisablePp);
	disablePpTimer.addEventListener(TimerEvent.TIMER_COMPLETE, Timer_DisablePp_Complete);
	disablePpTimer.Start();
}
//--
function OnTimer_DisablePp(_timer:Timer, obj:Object){
	//不做处理，只是为创建Timer对象所必须的回调函数
}
//--
function Timer_DisablePp_Complete(_timer:Timer, obj:Object){
	//显示泡泡的时长到，向主界面发送隐藏提示泡泡的消息
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.DISABLEWATERPP_TIMECOMPLETE), null);
}
//--
function Timer_EnablePp_Complete(_timer:Timer, obj:Object){
	//手动停止计时器后，向主界面发送计时器停止事件
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ENABLEWATERPP_TIMECOMPLETE), null);
}

//--启用爱情树浇水提示泡泡功能组件
//--@params:
//--	@obj:表示该组件挂接在传入的obj参数对象上
static function EnableComponent(obj:GameObject){
	// 在指定对象上挂接此组件
	if (obj == null)
		throw "WaterTipPp's obj is null...";
	if(obj.GetComponent("WaterTipPp") == null)
		obj.AddComponent("WaterTipPp");
}
//--终止爱情树浇水提示泡泡功能
//--@params:
//-- obj:表示在obj对象上移除该组件
static function DisableComponent(obj:GameObject){
	//在指定对象上移除此组件
	if (obj == null)
		throw "WaterTipPp's obj is null...";
	if(obj.GetComponent("WaterTipPp"))
		Destroy(obj.GetComponent("WaterTipPp"));
		
}