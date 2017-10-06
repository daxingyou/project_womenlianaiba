
enum SENDTO_YYSUBCHANNEL_MSGTYPE{
	FROM_LEVEL,
	FROM_PEIDUI,
	FROM_DIAMOND,
	FROM_SPECIALHOUSE,
	FROM_HOUSEUPDATE,
}

//
class MsgToYYParams{
	var msg_type : int;
	var boy : String;
	var girl : String;
	
	public function MsgToYYParams( msg_type : int, boy : String, girl : String){
		this.msg_type = msg_type;
		this.boy = boy;
		this.girl = girl;
	}
}

// Use this for initialization
function Awake () {
	RegistEvt();
}

//
function RegistEvt() : void{
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.SENDMSGTOYYSUBCHANNEL), HandleSendMsgToYYSubChannel);
}
// Update is called once per frame
function HandleSendMsgToYYSubChannel(evt : GameEvent, obj : Object) : void {
	if(!PlatformMgr.IsPlatYY()){
		return;
	}
	var msg_params : MsgToYYParams = obj as MsgToYYParams;
	var msg_type : int = msg_params.msg_type;
	var player_name : String = DataCenter.getCurPlayerName();
	var linkStart : int = 0;
	var linkEnd : int = 0;
	var msg : String = "";
	switch(msg_type){
		case SENDTO_YYSUBCHANNEL_MSGTYPE.FROM_LEVEL:
			msg = Define.getContent(5108, [player_name]);
			break;
		case SENDTO_YYSUBCHANNEL_MSGTYPE.FROM_PEIDUI:
			msg = Define.getContent(5109, [msg_params.boy, msg_params.girl]);
			break;
		case SENDTO_YYSUBCHANNEL_MSGTYPE.FROM_DIAMOND:
			msg = Define.getContent(5110, [player_name]);
			break;
		case SENDTO_YYSUBCHANNEL_MSGTYPE.FROM_SPECIALHOUSE:
			msg = Define.getContent(5111, [player_name]);
			break;
		case SENDTO_YYSUBCHANNEL_MSGTYPE.FROM_HOUSEUPDATE:
			msg = Define.getContent(5112, [player_name]);
			break;
	}
	linkEnd = msg.Length - 1;
	ExternalFlatform.SendMsgToYYSubChannel(msg, 0, linkEnd, msg_type);
}

