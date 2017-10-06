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
	GetUnity().SendMessage("Global", "setType", "pengyou");
	GetUnity().SendMessage("Global", "setOpenID", getOpenId());
    GetUnity().SendMessage("Global", "setOpenKey", getOpenKey());
}

function showUnityMessage(message)
{
	window.debug.log(message);
}

function tt()
{
	window.debug.log("abc");
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

// 获取Url的参数
function getUrlPara(paraName)
{
    var url = location.href; 
    var reg = "(?:\\?|&){1}"+paraName+"=([^&#]*)";
    var re=new RegExp(reg,"gi"); 
    re.exec(url);
    return RegExp.$1; 
}