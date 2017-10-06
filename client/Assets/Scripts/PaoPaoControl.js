/*
	泡泡功能
	ToDo: 创建一个泡泡的控制器
*/
#pragma strict
#pragma downcast
import iGUI;

class PaoPaoControl{
	//泡泡控件对应的泡泡控制器列表
	private static var mPpctrlList : Hashtable = new Hashtable();
	
	private var mInterval_Enable : float;
	private var mCount_Enable : int;
	private var mPpEle : iGUIElement;
	private var mEnablePpTimer : Timer;
	private var mInterval_Disable : float;
	private var mCount_Disable : int;
	private var mHost_ele : iGUIElement;
	
	//--根据控件名获取控件相应的泡泡控制器
	public static function GetPpCtrol(key_ele : iGUIElement) : PaoPaoControl{
		if(!_IsPpCtrlInList(key_ele))
			return null;
		
		return mPpctrlList.Item[key_ele.variableName];
	}	
	//构造函数
	public function PaoPaoControl(interval_enable : float, cnt_enable : int, interval_disable : float, cnt_disable : int, ppEle : iGUIElement, host_ele : iGUIElement){
		//1.给成员变量赋值
		//2. 创建一个定时器并启动
		mInterval_Enable = interval_enable;
		mCount_Enable = cnt_enable;
		mInterval_Disable = interval_disable;
		mCount_Disable = cnt_disable;
		mPpEle = ppEle;
		mHost_ele = host_ele;
		_CreateEnableTimer(mInterval_Enable, mCount_Enable, mPpEle);
		_AddPpCtrl();
	}
	//--获取定时器
	public function GetPpTimer() : Timer{
		if(_IsPpTimerNotExist())
			throw "++------pptimer is not exist-------++";
		return mEnablePpTimer;
	}
	//--停止定时器
	public function StopPpTimer(){
		if(_IsPpTimerNotExist())
			throw "++------pptimer is not exist-------++";
		mEnablePpTimer.Stop();
		mEnablePpTimer = null;
		mPpEle.setWidth(0);
		mPpEle.setHeight(0);
		mPpEle.setEnabled(false);
		_RemovePpCtrl(mPpEle);
	}
	//--重置定时器
	public function ResetPpTimer(){
		if(_IsPpTimerNotExist())
			throw "++------pptimer is not exist-------++";
		mEnablePpTimer.Reset();
	}

//---------------------------------------------------------------

//--内部实现

//---------------------------------------------------------------
	//--将泡泡加入泡泡列表中
	private function _AddPpCtrl(){
		//1.检查是否存在相同控件
		//2.若列表中不存在，则加入此泡泡
		if(_IsPpCtrlInList(mPpEle))
			return;
		mPpctrlList.Add(mPpEle.variableName, this);
		
//		//--test
//		for(var itm : DictionaryEntry in mPpctrlList){
//			Debug.Log("+++------------------++"+itm.Key + "----" + itm.Value.mInterval_Enable);
//		}
	}
	//--移除控件相应的泡泡控制器
	private function _RemovePpCtrl(ele : iGUIElement){
		mPpctrlList.Remove(ele.variableName);
	}
	//--检查控件对应的泡泡是否已经在列表中
	private static function _IsPpCtrlInList(ele : iGUIElement):boolean{
		if(mPpctrlList.ContainsKey(ele.variableName) && mPpctrlList.Item[ele.variableName] != null)
			return true;
		
		return false;
	}
	//--创建定时器,
	//@ele_param: 是代表定时器控制的控件
	private function _CreateEnableTimer(interval : float, cnt : int, ele_param : iGUIElement){
		mEnablePpTimer = new Timer(interval, cnt, ele_param);
		mEnablePpTimer.addEventListener(TimerEvent.TIMER, OnTimer_ToEnable);
		mEnablePpTimer.addEventListener(TimerEvent.TIMER_COMPLETE, OnTimerComplete_ToEnable);
		mEnablePpTimer.Start();
	}
	//--定时器是否存在
	private function _IsPpTimerNotExist() : boolean{
		if(!mEnablePpTimer)
			return true;
		return false;
	}
	//--触发显示泡泡定时激活事件
	private function OnTimer_ToEnable(_timer : Timer, ctrl : iGUIElement){
		//1.通知泡泡显示
		//2.创建启动隐藏泡泡的定时器
		if(mHost_ele != null && mHost_ele.enabled){
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ENABLEWATERPP_ONTIMER), ctrl);
			_CreateDisableTimer();
		}
		else{
			ctrl.setWidth(0);
			ctrl.setHeight(0);
			ctrl.setEnabled(false);
		}
	}
	//--触发显示泡泡定时器停止事件
	private function OnTimerComplete_ToEnable(_timer : Timer, ctrl : iGUIElement){
		// 隐藏泡泡
		//EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ENABLEWATERPP_TIMECOMPLETE), ctrl);
	}
	//--创建隐藏泡泡定时器
	private function _CreateDisableTimer(){
		var timer_disable : Timer = new Timer(mInterval_Disable, mCount_Disable, mPpEle);
		timer_disable.addEventListener(TimerEvent.TIMER, OnTimer_ToDisable);
		timer_disable.addEventListener(TimerEvent.TIMER_COMPLETE, OnTimerComplete_ToDisable);
		timer_disable.Start();
	}
	//--触发隐藏泡泡定时事件
	private function OnTimer_ToDisable(_timer : Timer, ctrl : iGUIElement){
		//不做处理，只是为创建Timer对象所必须的回调函数
	}
	//--触发隐藏泡泡定时器停止事件
	private function OnTimerComplete_ToDisable(_timer : Timer, ctrl : iGUIElement){
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.DISABLEWATERPP_TIMECOMPLETE), ctrl);
	}
	
}