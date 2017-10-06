$(window).ready(function(){
	PYplatform.setHeight("1000");
	var openid = getOpenId();
	$("#GameIdLabel").text(openid);
	$("#canopy").click(function(){
	PYplatform.showPlayer();
	});
});	

var OpenId;
var OpenKey;

function GetUnity() 
{
	if (typeof unityObject != "undefined") {
		return unityObject.getObjectById("unityPlayer");
	}
	return null;
}

function initUnityParameters()
{
	console.log("start initUnityParameters");
	GetUnity().SendMessage("Global", "setType", getPF());
	GetUnity().SendMessage("Global", "setOpenID", getOpenId());
    GetUnity().SendMessage("Global", "setOpenKey", getOpenKey());
    GetUnity().SendMessage("Global", "setPFKey", getPFKey());
    GetUnity().SendMessage("Global", "setIOpenID", getIOpenID());
}

function showUnityMessage(message)
{
	window.debug.log(message);
}

function tt()
{
	window.debug.log("abc");
}

function getPF()
{
	return getUrlPara("pf") || getPFFromTopFrame() || "pengyou";
}

function getPFFromTopFrame()
{
	return inQzone() ? "qzone" : "pengyou";
}

function inQzone()
{
	try
	{
		parentUrl = top.location.hostname.toLowerCase();
			return parentUrl.indexOf("qzone")>=0
	}
	catch(e)
	{
		return false;
	}
}

function getOpenId()
{
    var openId = getUrlPara("openid");
    var re = new RegExp("^([0-9A-F]{32})$");
    if(re.test(openId))
        return openId;
    else
        return undefined;
}

// 获取用户的OpenKey
// TODO:这里需要做校验
function getOpenKey()
{
    return getUrlPara("openkey");
}

// 获取AppId
function getAppId()
{
    return getUrlPara("appid");
}

function getPFKey()
{
	   return getUrlPara("pfkey");
}

function getIOpenID()
{
	return getUrlPara("iopenid");
}

// 获取Url的参数
function getUrlPara(paraName)
{
    var url = location.href; 
    var reg = "(?:\\?|&){1}"+paraName+"=([^&#]*)";
    var re=new RegExp(reg,"gi"); 
    return re.exec(url)?RegExp.$1:""; 
}
