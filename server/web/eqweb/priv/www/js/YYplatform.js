    debugMode=false;
var YYplatform = {};
function init() {
    yy.channel.userListPopMenu.addEventListener(IYYChannelUserListPopMenu.CLICKED, onMenuClicked);
}
function onMenuClicked(eventData) {
		GetUnity().SendMessage("Global", "externalVisitFriendHouse", eventData.uid+"");
		//location.reload();
     //"<br>菜单被点击，uid=" + eventData.uid + " cid=" + eventData.cid;
}

$(document).ready(function(){
		init();
       var menuName = "拜访Ta的小屋";	
       var ret = yy.channel.userListPopMenu.setPopMenu(menuName);
       $("#yyno").html("ID:" + getOpenId());
	//document.write(location.href);
});	

function GetUnity() 
{
	if (typeof unityObject != "undefined") {
		return unityObject.getObjectById("unityPlayer");
	}
	return null;
}

function showUnityMessage(message)
{
	//document.write("11111");
	//console.log(message);
}

function initUnityParameters()
{
	//console.log("start initUnityParameters");
	GetUnity().SendMessage("Global", "setOpenID", getOpenId());
	GetUnity().SendMessage("Global", "setType", getPF());
	GetUnity().SendMessage("Global", "setSrvid", parseInt(getUrlPara("srvid")));
	GetUnity().SendMessage("Global", "setCH", parseInt(getUrlPara("ch")));
	//GetUnity().SendMessage("Global", "SetCustomOpenID", getUrlPara("targetuid"));
}

function getOpenId()
{
    var openId = getUrlPara("uid");
    return openId;
}

function getPF()
{
	   return "yy";
}

YYplatform.invite=function()
{
    yy.interaction.invite(2);
};

YYplatform.sendMsgToSubChannel=function(msg, linkstart, linkend, token)
{
    var subChannelInfo = yy.channel.getCurrentChannelInfo();
    var subChannelId = subChannelInfo.longId;
    yy.channel.appMsg.sendMsgToSubChannel(subChannelId, msg, linkstart, linkend, token);
};


YYplatform.enableAudioMixing=function()
{
    var rid = yy.audio.enableAudioMixing();
}

YYplatform.disableAudioMixing=function()
{
    var rid = yy.audio.disableAudioMixing();
}

YYplatform.createRoom=function()
{
    var rid = yy.tempAudioSession.createRoom();
    GetUnity().SendMessage("Global", "OnCreateRoom", rid.toString());
}

YYplatform.enterRoom=function(rid)
{
    var result = yy.tempAudioSession.enterRoom(parseInt(rid));
    GetUnity().SendMessage("Global", "OnEnterRoom", result);
}

YYplatform.leaveRoom=function()
{
    var result = yy.tempAudioSession.leaveRoom();
    GetUnity().SendMessage("Global", "OnLeaveRoom", result);
}

YYplatform.startSpeak=function()
{
    var result = yy.tempAudioSession.startSpeak();
    GetUnity().SendMessage("Global", "OnStartSpeak", result);
}

YYplatform.stopSpeak=function()
{
    var result = yy.tempAudioSession.stopSpeak();
    GetUnity().SendMessage("Global", "OnStopSpeak", result);
}

// 获取Url的参数
function getUrlPara(paraName)
{
    var url = location.href; 
    var reg = "(?:\\?|&){1}"+paraName+"=([^&#]*)";
    var re=new RegExp(reg,"gi"); 
    return re.exec(url)?RegExp.$1:""; 
}

YYplatform.initUserInfo = function() 
{
	var userInfo = yy.user.getCurrentUserInfo();
	if (userInfo != null) 
	{
		GetUnity().SendMessage("Global", "setUserName", userInfo.name);
		GetUnity().SendMessage("Global", "setUserSex",  "" + userInfo.sex);
	}
	GetUnity().SendMessage("Global", "showCreatePlayerUI", "");
}

YYplatform.reload=function()
{
	location.reload();
};

YYplatform.recharge = function () {
    yy.finance.recharge();
}
