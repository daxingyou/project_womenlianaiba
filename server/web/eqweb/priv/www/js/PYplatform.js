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
	$("#unityPlayer").css("height","625px");
	$("#unityPlayer").css("width","900px");
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

PYplatform.getURL = function()
{
	var pf = getPF().toLowerCase();
	var url;
	switch(pf)
	{
		case "qzone":
			url="http://user.qzone.qq.com/2202410116/infocenter#!app=35398";
			break;
		case "weibo":
		case "tapp":
			url = "http://app.t.qq.com/app/play/35398";
			break;
		default:
			url="http://apps.pengyou.com/35398";
	}
    return url + "?rand="+Math.floor(Math.random()*1000000+1);
};

PYplatform.getCacheURL = function(image)
{
    return  PYConfig.cdnHost + "images/" + image;
}

//弹出邀请框
PYplatform.	inviteFriends=function(){
	  PYplatform.visibleOfDialog=false;
		PYplatform.hidePlayer();
		fusion2.dialog.invite({
			onSuccess: PYplatform.showPlayer,
			onCancel: PYplatform.showPlayer,
			onClose: PYplatform.showPlayer,
			img: PYplatform.getCacheURL("logo.png")
		});
		//fusion.dialog.inviteFriend({"appid":getAppId()});
		//PYplatform.tryToShowDialog();
};

//跳转到个人主页
PYplatform.gotoHome=function()
{
	fusion2.nav.toHome({"self":true});
};

//跳转到好友主页
PYplatform.gotoFriendHome=function(openId)
{
	fusion2.nav.toFriendHome({"openid":openId,"self":false});
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

// 请求加好友
PYplatform.reqMakeFriend=function(targetOpenID)
{
	fusion2.dialog.addPal( 
  {
    //要添加为好友人的openid
    openid : targetOpenID//, 


//    //可选。透传参数，用于onSuccess和onCancel回调时传入的参数，用于识别请求。
//    context : "addPal _12345", 
//
//
//
//    // 可选。用户操作后的回调方法
//    onSuccess : function (opt) 
//    { alert(fusion.JSON.stringify(opt)); },
//
//
//
//    // 可选。用户取消操作后的回调方法。
//    // 用户取消时将同时关闭对话框，因此将先触发onCancel回调再触发onClose回调。
//    onCancel : function (opt) 
//    { alert("Cancelled: " + opt.context); }, 
//
//
//
//    // 可选。对话框关闭时的回调方法。
//    // 主要用于对话框关闭后进行UI方面的调整，onSuccess和onCancel则用于应用逻辑的处理，避免过度耦合
//    onClose : function () 
//    { alert("Closed") }
  })

};

//发表说说
PYplatform.tweet=function(msg, picture)
{
	fusion2.dialog.tweet
    ({
      "msg":msg,
      "url":PYplatform.getCacheURL(picture),
      onSuccess : PYplatform.showPlayer,
      onCancel : PYplatform.showPlayer,
      onClose : PYplatform.showPlayer
    });
};

PYplatform.isAbsoluteURL=function(url)
{
		if(!url)
		{
			return false;
		} 
		if(url.length < 10)
		{
			return false;
		}
		return url.substr(0, 4).toLowerCase()=="http";
};

//分享游戏应用信息
//每个QQ号限一次，多次发送，会返回发送失败的返回码
PYplatform.share=function(type, desc, title, summary, picture, succcallback, url)
{
	PYplatform.visibleOfDialog=false;
	PYplatform.hidePlayer();
	var spicture;
	if(PYplatform.isAbsoluteURL(picture))
	{
		spicture=picture;
	}
	else
	{
		spicture = (!!picture)?PYplatform.getCacheURL(picture):PYplatform.getLogo();
	}
	fusion2.dialog.share({
	    "desc" : desc,
	    "title" : title, 
	    "summary" : summary, 
	    "url" : url || PYplatform.getURL(),
	    "pics" : spicture,
	    "context" : "share",
	      onSuccess : function (opt) { 
			GetUnity().SendMessage("Global", "ShareSuccessCallback", type);
			PYplatform.showPlayer();
	      },
		onCancel: PYplatform.showPlayer,
		onClose: PYplatform.showPlayer
	});
};

PYplatform.recharge=function()
{
	PYplatform.hidePlayer();
	fusion2.dialog.recharge
	({
		//可选。对话框关闭时的回调方法。
		onClose : function () {
					PYplatform.showPlayer();
				 }
	});
};

PYplatform.openUrl=function(url)
{
	window.open(url, '_blank');
}

PYplatform.gotoVideo = function(){
			location.href = "/home/video" + location.search;
}

PYplatform.setHeight=function(height)
{
	fusion.canvas.setHeight(height+"");
};

PYplatform.reload=function()
{
	location.reload();
};

PYplatform.getLogo=function()
{
	return "http://app35398.imgcache.qzoneapp.com/app35398/images/logo.png";
	//return	PYplatform.getCacheURL("logo.png");
};

PYplatform.getReportBugUrl = function()
{
	return PYConfig.reportBugUrl
};

PYplatform.httpPost = function(data)
{
	if($("#post_bug_form").length)
	{
		$("#post_bug_data").val(data);
	}
	else
	{
		 $("body").append(
		 "<div style=\"display:none\">" +
	     "<form id=\"post_bug_form\" method=\"post\"  target=\"post_bug_iframe\" action=\"" + PYplatform.getReportBugUrl() + "\">" +
        "<textarea id=\"post_bug_data\" name=\"data\">"  + data  + "{browser:\"" + navigator.userAgent+ "\"}</textarea>" +
    	 "</form></div>");
   	}
   	if($("#post_bug_iframe").length==0)
   	{
		$("body").append("<div style=\"display:none\"><iframe id=\"post_bug_iframe\" name=\"post_bug_iframe\" width=0 height=0 border=0></iframe></div>");
	}
	$("#post_bug_form").get()[0].submit();
};

PYplatform.buy_goods = function(param, context)
{
	PYplatform.hidePlayer();
	options = {};
	options["param"]=param;
	options["sandbox"]=!!PYplatform.getSandbox();
	if(context)
	{
		options["context"]=context;
	}
	options["onCancel"]=function(opt) { 
		GetUnity().SendMessage("Global", "CancelQQOrder", opt.context);
	};
	options["onSuccess"]=function(opt) {		
	};
	options["onClose"]=function(){
		PYplatform.showPlayer();
	};
	fusion2.dialog.buy(options);
};

PYplatform.getSandbox = function()
{
	return PYConfig.sandbox;
};

PYplatform.openVipOP = function()
{
	var appid=PYplatform.getAppId();
	var url="http://pay.qq.com/qzone/index.shtml?aid=game" + appid + ".op"
	window.open(url, '_blank');		
};

PYplatform.openVipYOP = function()
{
	var appid=PYplatform.getAppId();
	var url="http://pay.qq.com/qzone/index.shtml?aid=game" + appid + ".yop&paytime=year"
	window.open(url, '_blank');		
};
