
function Awake(){
	RegistEvt();
}

function Start(){
	RegistNetHandler();
}
//--
function RegistNetHandler(){
	NetHelper.RegistHandler(new notify_first_payment_return_reward(), NotifyFirstPaymentReturnReward);
}
//--
function RegistEvt () {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.POST_FIRSTPAYMENTSTATUS), HandleReceiveFirstPaymentStatus);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.GET_FIRSTPAYMENT_REWARD), HandleAfterGetReward);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_FIRSTPAYMENTBTN), HandleClickFirstPayBtn);
}
//--
function HandleReceiveFirstPaymentStatus(evt : GameEvent, obj : Object){
	var result : int = Convert.ToInt32(obj);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.FIRSTPAYMENT_STATUSRESULT), result);
}
//--
function NotifyFirstPaymentReturnReward(evt : GameEvent, pack : notify_first_payment_return_reward){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.GET_FIRSTPAYMENT_REWARD));
	var reward_result : int = pack.returned;
//	if(reward_result == 0){ // 没有领奖
		
//	}
//	else if(reward_result == 1){
		
//	}
}
//--
function HandleAfterGetReward(evt : GameEvent, obj : Object){
	
}
//--
function HandleClickFirstPayBtn(evt : GameEvent, obj : Object){
	iGUICode_FirstPayRoot.Init();
	HandleAfterLogin.reqFirstPaymentStatus();
}

function OnDestroy(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.GET_FIRSTPAYMENT_REWARD), HandleAfterGetReward);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_FIRSTPAYMENTBTN), HandleClickFirstPayBtn);

}