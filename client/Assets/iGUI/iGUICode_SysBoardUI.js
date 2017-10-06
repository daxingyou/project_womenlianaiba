import iGUI;

private var mInit : boolean = false;
private var mSpeed : float = 1.0f;
private var mInteral : float = 200.0f;
private var mLoopInteral : float = 0.0f;
private var mTotalCount : int = 0;
private var mCurWordsNum : int = 0;
private var mTotalWowdsNum : int = 0;
private var mMsg : String = "";
private var mTimer:Timer = null;
private var mLoopTimer : Timer = null;

private var mNoticeMsg : String = "";
private var mNoticeCurWordsNum : int = 0;
private var mNoticeTotalWowdsNum : int = 0;
private var mNoticeCount : int = 0;
private var mNoticeInteral : float = 0.0f;
private var mNoticeTimer:Timer = null;
private var mNoticeLoopTimer : Timer = null;
private var mNoticeEnable : boolean = false;

function Start() {
	Init();
	UI.getUI().SetIgnoreMouseOver(LabContent, true);
	UI.getUI().SetIgnoreMouseOver(LabServerBoard, true);
	
	mInteral = SysBoardLogic.GetInstance().GetScrollSpeed();
	
	mTotalCount = SysBoardLogic.GetInstance().GetScrollCount();
	mLoopInteral = SysBoardLogic.GetInstance().GetScrollInternal();
	
	mNoticeCount = SysBoardLogic.GetInstance().GetNoticeCount();
	mNoticeInteral = SysBoardLogic.GetInstance().GetNoticeInternal();
}

public function Init() {
	Enable(false);
	EnableNotice(false);
	
	mInit = true;
}

private function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOUSE_CREATED), HandleNotifyHouseOwnerInfo);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_SYSBOARD_UPDATE_CONTENT), HandleNotifyUpdateContent);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_SYSBOARD_STOP), HandleNotifyStopSysBoard);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_SYSBOARD_SHOW_NOTICE), HandleNotifyShowNotice);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.POST_DLGSHOW_EVENT), HandleNotifyEnableNotice);
}

//handle client net msg
private function HandleNotifyHouseOwnerInfo(evt:GameEvent, obj:house_info) {
	if(mNoticeEnable == false) {
		EnableNotice(false);
	}
}

private function HandleNotifyUpdateContent(evt:GameEvent, obj:BoardInfo) {
	if(obj.type == BoardType.BT_System) {
		StopLoop();
		Stop();
		
		Enable(true);
		
		mMsg = obj.content as String;
		mTotalWowdsNum = mMsg.Length;
		
		StartTimer();
		StartLoopTimer();
	} else if(obj.type == BoardType.BT_ServerNotice) {
		StopNoticeLoop();
		NoticeStop();
		
		EnableNotice(true);
		
		mNoticeMsg = obj.content as String;
		mNoticeTotalWowdsNum = mNoticeMsg.Length;
		
		StartNoticeTimer();
		StartNoticeLoopTimer();
	}
}

private function HandleNotifyStopSysBoard(evt:GameEvent, obj:BoardType) {
	if(obj == BoardType.BT_System) {
		StopLoop();
		Stop();
	} else if(obj == BoardType.BT_ServerNotice) {
		StopNoticeLoop();
		NoticeStop();
	}
}

private function HandleNotifyShowNotice(evt:GameEvent, obj:Object) {
	EnableNotice(true);
}

private function HandleNotifyEnableNotice(evt:GameEvent, obj:Object) {
	EnableNotice(obj);
}

//logic function for extern
public function Enable(enable : boolean) {
	if(enable) {
		root1.depth = 20;
	} else {
		root1.depth = 100;
	}
	LabContent.setEnabled(enable);
}

public function EnableNotice(enable : boolean) {
	LabServerBoard.setEnabled(enable);
	
	mNoticeEnable = enable;
}


//logic function for internal
private function StartTimer() {
	if(mTimer != null) {
		mTimer.Reset();
		mTimer = null;
	}
	mTimer = new Timer(mInteral,mTotalCount*mTotalWowdsNum/mSpeed);
	mTimer.addEventListener(TimerEvent.TIMER,Run);
	mTimer.addEventListener(TimerEvent.TIMER_COMPLETE,Stop);
	mTimer.Start();
}

private function StartLoopTimer() {
	if(mLoopTimer != null) {
		mLoopTimer.Reset();
		mLoopTimer = null;
	}
	mLoopTimer = new Timer(mLoopInteral*60*1000.0f,0);
	mLoopTimer.addEventListener(TimerEvent.TIMER,RunLoop);
	mLoopTimer.addEventListener(TimerEvent.TIMER_COMPLETE,StopLoop);
	mLoopTimer.Start();
}

private function Run() {
	mCurWordsNum += mSpeed;
	
	if(mCurWordsNum >= mTotalWowdsNum) {
		mCurWordsNum = 0;
	}
	var outMsg : String = mMsg.Substring(0,mCurWordsNum);
	/*
	for(var i=mCurWordsNum; i<mTotalWowdsNum; i++) {
		outMsg += " ";
	}
	*/
	LabContent.label.text = outMsg;
}

private function RunLoop() {
	Enable(true);
	StartTimer();
}

private function StopLoop() {
	if(mLoopTimer != null) {
		mLoopTimer.Reset();
		mLoopTimer = null;
	}
}

private function Stop() {
	if(mTimer != null) {
		mTimer.Reset();
		mTimer = null;
	}
	
	mCurWordsNum = 0;
	LabContent.label.text = "";
	
	Enable(false);
}

//notice
private function StartNoticeTimer() {
	if(mNoticeTimer != null) {
		mNoticeTimer.Reset();
		mNoticeTimer = null;
	}
	mNoticeTimer = new Timer(mInteral,mNoticeTotalWowdsNum/mSpeed);
	mNoticeTimer.addEventListener(TimerEvent.TIMER,NoticeRun);
	mNoticeTimer.addEventListener(TimerEvent.TIMER_COMPLETE,NoticeStop);
	mNoticeTimer.Start();
}

private function StartNoticeLoopTimer() {
	if(mNoticeLoopTimer != null) {
		mNoticeLoopTimer.Reset();
		mNoticeLoopTimer = null;
	}
	mNoticeLoopTimer = new Timer(mNoticeInteral*1000.0f + mNoticeTotalWowdsNum*mInteral,mNoticeCount-1);
	mNoticeLoopTimer.addEventListener(TimerEvent.TIMER,RunNoticeLoop);
	mNoticeLoopTimer.addEventListener(TimerEvent.TIMER_COMPLETE,StopNoticeLoop);
	mNoticeLoopTimer.Start();
}

private function NoticeRun() {
	mNoticeCurWordsNum += mSpeed;
	
	if(mNoticeCurWordsNum >= mNoticeTotalWowdsNum) {
		mNoticeCurWordsNum = 0;
	}
	var outMsg : String = mNoticeMsg.Substring(0,mNoticeCurWordsNum);
	/*
	for(var i=mCurWordsNum; i<mTotalWowdsNum; i++) {
		outMsg += " ";
	}
	*/
	LabServerBoard.label.text = outMsg;
	//add channel label(yy)
	var yyLabel : iGUILabel = Global.getChannelSysBoardLabel();
	if(yyLabel != null) {
		yyLabel.label.text = outMsg;
	}
}

private function RunNoticeLoop() {
	EnableNotice(true);
	StartNoticeTimer();
}

private function StopNoticeLoop() {
	if(mNoticeLoopTimer != null) {
		mNoticeLoopTimer.Reset();
		mNoticeLoopTimer = null;
	}
	
	//EnableNotice(false);
}

private function NoticeStop() {
	if(mNoticeTimer != null) {
		mNoticeTimer.Reset();
		mNoticeTimer = null;
	}
	
	mNoticeCurWordsNum = 0;
	LabServerBoard.label.text = "";
	//add channel label(yy)
	var yyLabel : iGUILabel = Global.getChannelSysBoardLabel();
	if(yyLabel != null) {
		yyLabel.label.text = "";
	}
	
	//EnableNotice(false);
}

/*
private function Pause() {
	mTimer.Reset();
}
*/

private static var instance : iGUICode_SysBoardUI;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function getInstance(){
	return instance;
}

@HideInInspector
var LabServerBoard : iGUILabel;
@HideInInspector
var LabContent : iGUILabel;
@HideInInspector
var root1 : iGUIRoot;
