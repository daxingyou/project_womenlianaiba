var PYplatform = {};

//是否显示了窗口
PYplatform.visibleOfDialog=false;

PYplatform.tryToShowDialog=function(){
	setTimeout("PYplatform.autoshowPlayer()", 500);
};

PYplatform.hidePlayer=function()
{
	//$("#unityPlayer").css("visibility","hidden");
	$("#unityPlayer").css("height","0px");
	$("#unityPlayer").css("width","0px");
	//$("#unityPlayer").hide();
	$("#canopy").show();
};

PYplatform.showPlayer=function()
{
	$("#canopy").hide();
	//$("#unityPlayer").show();
	//$("#unityPlayer").css("visibility","visible");
	$("#unityPlayer").css("height","600px");
	$("#unityPlayer").css("width","760px");
};

PYplatform.autoshowPlayer=function()
{
	var d = $(top.document).find("div[id*=dialog]");
	if(!d.length)
	{
		if(PYplatform.visibleOfDialog)
		{
			PYplatform.showPlayer();
		}
		else
		{
			PYplatform.tryToShowDialog();
		}
	}
	else
	{
		PYplatform.visibleOfDialog=true;
		PYplatform.tryToShowDialog();
	}
};

//获取应用Id
PYplatform.getAppId=function()
{
		return PYConfig.appid;
};

//弹出邀请框
PYplatform.	inviteFriends=function(){
	  PYplatform.visibleOfDialog=false;
		PYplatform.hidePlayer();
		fusion2.dialog.invite({
			onSuccess: PYplatform.showPlayer,
			onCancel: PYplatform.showPlayer,
			onClose: PYplatform.showPlayer,
			img: "http://app35398.imgcache.qzoneapp.com/app35398/images/logo.png"
		});
		//fusion.dialog.inviteFriend({"appid":getAppId()});
		//PYplatform.tryToShowDialog();
};

//跳转到个人主页
PYplatform.gotoHome=function()
{
	fusion.nav.toHome();
};

//跳转到好友主页
PYplatform.gotoFriendHome=function(openId)
{
	fusion.nav.toFriendHome(openId);
};

//跳转到男主人主页
PYplatform.gotoOwnerHome=function()
{
	if(PYplatform.ownerOpenId)
	{
		PYplatform.gotoFriendHome(PYplatform.ownerOpenId);
	}
};

//跳转到女主人主页
PYplatform.gotoLoverHome=function()
{
	if(PYplatform.loverOpenId)
	{
		PYplatform.gotoFriendHome(PYplatform.loverOpenId);
	}
};

//设置男主人ID
PYplatform.setOwnerOpenId=function(openId)
{
	PYplatform.ownerOpenId=openId;	
};

//设置女主人ID
PYplatform.setLoverOpenId=function(openId)
{
	PYplatform.loverOpenId=openId;	
};

//发表说说
PYplatform.tweet=function(msg)
{
	var img="";
	if(arguments.length>1)
	{
		img=arguments[1];
	}
	options = {"msg" : msg, "url": img};
	fusion2.dialog.tweet(options);
};

//分享游戏应用信息
//每个QQ号限一次，多次发送，会返回发送失败的返回码
PYplatform.share=function(title, summary)
{
	var url="http://app.pengyou.com/"+PYplatform.getAppId();
	fusion2.dialog.share({"title": title, "summary":summary, "url":url});
};

PYplatform.setHeight=function(height)
{
	fusion.canvas.setHeight(height+"");
};