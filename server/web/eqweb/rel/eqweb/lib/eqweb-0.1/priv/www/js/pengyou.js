var htmlPopup;
var UserInfo;
var Inviting;
var Invited;
var OpenId = undefined;
var OpenKey;
var hasRegistRefresh = false;
var canShowFriend = true;
var hasShowInvitFriend = false;

// 页面初始化后
// 1.每次进游戏弹出邀请界面
// 2.提交服务端获取该用户是否有注册信息
$(document).ready(function () {
    //TODO:显示邀请好友界面
    //showInviteDialog();
    //$("#main").hide();
    fusion.canvas.setHeight("800");
    var openid = getOpenId();
    var openkey = getOpenKey();
    $("#GameIdLabel").text(openid);
    getpengyou(openid, openkey);
});

//定时刷新
function refresh()
{
    if(!hasRegistRefresh)
    {
        //每一分钟刷新一次页面
        $(document).everyTime(60000, 'refresh_timer', function() {
            var openid = getOpenId();
            var openkey = getOpenKey();
            getpengyou(openid, openkey);
        });
        
        //当时间到达15分钟后, 自动停止定时刷新功能, 并启动手动刷新功能
        $(document).oneTime(900000, 'stop_timer', function() {
            $(document).stopTime('refresh_timer');
        });
    }
}

function getpengyou(openid, openkey)
{
    $.ajax(
	{
    url: "pengyou?openid="+openid+"&openkey="+openkey,
    cache: false,
    success: 
    function(data)
    {
        var reply = $.parseJSON(eval(data));
        show(reply, showData);
    }
});
}

function show(reply, handleFun)
{
    switch(reply.status)
    {
        case "error": // 如果出错，弹出提示信息
            alert("消息提示", reply.data.message, null);
            break;
        case "redirect":
            window.location.href = reply.data.url;
            break;
        case "matchsucc":// 配对成功后弹出提示,并跳转页面
            alert("消息提示", reply.data.inviting.nickName + "与" + reply.data.invited.nickName + "配对成功!", function(){window.location.href = reply.data.url;});
            break;
        case "show":
            showFailureMessage(reply);
            $("#main").show();
            if(htmlPopup != null)
            {
                htmlPopup.close();
                htmlPopup = null;
            }
            handleFun(reply.data);
            break;
    }
}

function showFailureMessage(reply)
{
    if(reply.data.failureMessage != null)
        alert("消息提示", reply.data.failureMessage, null);
}

function setUserInfo(data)
{
    if(data.userInfo)
    {
        UserInfo = data.userInfo;
    }
}

function setInviting(data)
{
    if(data.inviting)
        Inviting = data.inviting;
}

// 显示页面信息
function showData(data)
{
    if(data.inviting != null)
    {
        setUserInfo(data);
        setInviting(data);
        showInviting(buildInviting(UserInfo,  Inviting, data.id));
        hasRegistRefresh = true;
    }
    else
    {          
        hasShowInvitFriend = true;
        setUserInfo(data);
        showInviting(buildInvitingNormal());
    }
    
    if(data.invited && (data.invited.length > 0))
    {
        if(data.invited)
            Invited = data.invited;
            
        showInvited(Invited);
    }
    else if(data.invited && (data.invited.length == 0))
    {
        $("#invited").empty();
        $("#InvitedPager").hide();
    }
}

function showDataByRefuse(data)
{
    if(data.invited && (data.invited.length > 0))
    {
        if(data.invited)
            Invited = data.invited;
            
        showInvited(Invited);
    }
    else
    {
        $("#invited").empty();
        $("#InvitedPager").hide();
    }
}


// 显示主动邀请的信息
function showInviting(content)
{
    $("#inviting").empty();
    $("#inviting").append(content);
}

function buildInvitingNormal()
{
    var sb = "";
    sb += "<table>";
    sb += "    <tr>";
    sb += "        <td>";
    sb += "        </td>";
    sb += "        <td colspan=\"2\">";
    sb += "            <div id=\"title\" style=\"background-image: url(../images/3.png); background-repeat:no-repeat;*background: none;*filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true', sizingMethod='corp', src='../images/3.png');width:321px;height:59px;\"></div>";
    sb += "        </td>";
    sb += "        <td>";
    sb += "        </td>";
    sb += "    </tr>";
    sb += "    <tr>";
    sb += "        <td>";
    sb += "        </td>";
    sb += "        <td style=\"width:205px;text-align: center; vertical-align: middle; color:#ff0066; font-size:14px;\">";
    sb += "            从你的好友里把ta找出来吧";
    sb += "        </td>";
    sb += "        <td>";
    sb += "            <a id=\"searchbtn\" onclick=\"reqFriends();\" /></a>";
    sb += "        </td>";
    sb += "        <td>";
    sb += "        </td>";
    sb += "    </tr>";
    sb += "</table>";
    
    return sb;
}

function buildInviting(Owner, inviting, id)
{
    var sb = "";
    sb += "<table align='center'>";
    sb += "<tr>";
    sb += "    <td colspan=\"3\" align=\"center\">确认配对成功后，请刷新页面进入游戏</td>";
    sb += "</tr>";
    sb += "<tr>";
    sb += "    <td colspan=\"3\" align=\"center\"><div style=\"background-image: url(../images/13.png); background-repeat:no-repeat;*background: none;*filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true', sizingMethod='corp', src='../images/13.png');width:126px;height:18px;\"></div></td>";
    sb += "</tr>";
    sb += "<tr>";
    sb += "    <td>";
    sb += "        <table>";
    sb += "            <tr>";
    sb += "                <td><img id=\"OwnerImg\" width=\"60px\" src="+ getImageUrl(Owner.imageUrl) +" /></td>";
    sb += "            </tr>";
    sb += "            <tr>";
    sb += "                <td align=\"center\"><label id=\"OnwerName\">"+ Owner.nickName +"</label></td>";
    sb += "            </tr>";
    sb += "        </table>";
    sb += "    </td>";
    sb += "    <td>";
    sb += "        <table>";
    sb += "             <tr>";
    sb += "                 <td>你正在耐心等待ta...</td>";
    sb += "             </tr>";
    sb += "             <tr>";
    sb += "                 <td align=\"center\" colspan=\"3\">";
    sb += "                     <div id=\"cancelbtn\" onclick=\"cancel('"+inviting.nickName+"', '"+id+"');\"/>";
    sb += "                 </td>";
    sb += "             </tr>";
    sb += "        </table>";
    sb += "    </td>";
    sb += "    <td>";
    sb += "        <table>";
    sb += "            <tr>";
    sb += "                <td><img id=\"invitingImg\" width=\"60px\" src="+ getImageUrl(inviting.imageUrl) +"  /></td>";
    sb += "            </tr>";
    sb += "            <tr>";
    sb += "                <td align=\"center\"><label id=\"invitingName\">"+ inviting.nickName +"</label></td>";
    sb += "            </tr>";
    sb += "        </table>";
    sb += "    </td>";
    sb += "</tr>";

    sb += "</table>";
    
    return sb;
}

function cancel(nickName, id)
{
    //弹出对话框让用户选择
    var htmlPopupPara={width:250,height:150,top:100,left:null,title:"选择确认框",content:"确定取消与"+nickName+"配对吗?",showMask:true,language:'zh-cn',closeCallBack:null};
    var popup = new ConfirmPopup(htmlPopupPara);
    popup.addCallBack("ok",function(){reqCancel(id);});
    popup.show();
}

function reqCancel(id)
{
    var openid = getOpenId();
    var openkey = getOpenKey();
    $.ajax(
		{
        url: "cancel?openid="+openid+"&openkey="+openkey+"&account="+openid+"&id="+id,
        cache: false,
        success: 
        function(data)
        {
            //$(document).stopTime('refresh_timer');
            //hasRegistRefresh = false;
            enableFriend();
            var reply = $.evalJSON(eval(data));
            show(reply, showData);
        }
    });
}

// 显示被邀请的信息
function showInvited(invited)
{
    $("#invited").empty();
    var sb = "";
    sb += "<table id=\"invitedTable\" class=\"tablesorter\">";
    sb += "	<thead>";
	sb += "	<tr>";
	sb += "		<th></th>";
	sb += "		<th></th>";
	sb += "		<th></th>";
	sb += "		<th></th>";
	sb += "	</tr>";
	sb += "</thead><tbody>";
    for(var i = 0; i < invited.length; i++)
    {
        if(i % 4 == 0)
            sb += "    <tr>";
        sb += buildInvited(invited[i]);
        
        if((i + 1) % 4 == 0)
            sb += "    </tr>";
    }
    sb += "</tbody></table>";
   
    $("#invited").append(sb);
    setInvitedPager(invited);
}

function setInvitedPager(invited)
{
    $("#InvitedPager").show();
    $("#invitedTable").tablesorter().tablesorterPager({container: $("#InvitedPager")});
}

function buildInvited(data)
{
    var sb = "";
    sb += "<td>";
    sb += "    <table title=\""+data.nickName+"想和你拥有一个完整的家\">";
    sb += "        <tr>";
    sb += "            <td><img src=\""+getImageUrl(data.imageUrl)+"\" width=\"60px\" height=\"60px\" /></td>";
    sb += "        </tr>";
    sb += "        <tr>";
    sb += "            <td align=\"center\">"+data.nickName+"</td>";
    sb += "        </tr>";
    sb += "        <tr>";
    sb += "            <td align=\"center\"><a href=\"#\" onclick=\"acceptInvitConfirm('"+data.openId+"', '"+data.nickName+"');\">接受</a> <a href=\"#\" onclick=\"delInvitConfirm('"+data.id+"', '"+data.nickName+"');\">删除</a></td>";
    sb += "        </tr>";
    sb += "    </table>";
    sb += "</td>";
    
    return sb;
}

function acceptInvitConfirm(invitingOpenId, nickName)
{
        //弹出对话框让用户选择
    var htmlPopupPara={width:250,height:150,top:100,left:null,title:"选择确认框",content:"确定接受"+nickName+"的邀请吗?",showMask:true,language:'zh-cn',closeCallBack:null};
    var popup = new ConfirmPopup(htmlPopupPara);
    popup.addCallBack("ok",function(){acceptInvit(invitingOpenId);});
    popup.show();
}

// 接收邀请
function acceptInvit(invitingOpenId)
{
    var openid = getOpenId();
    var openkey = getOpenKey();
    $.ajax(
		{
        url: "invited?openid="+openid+"&openkey="+openkey+"&invited="+openid+"&inviting="+invitingOpenId,
        cache: false,
        success: 
        function(data)
        {
            var reply = $.evalJSON(eval(data));
            show(reply, showData);
        }
    });
}

function delInvitConfirm(id, nickName)
{
        //弹出对话框让用户选择
    var htmlPopupPara={width:250,height:150,top:100,left:null,title:"选择确认框",content:"确定删除"+nickName+"的邀请吗?",showMask:true,language:'zh-cn',closeCallBack:null};
    var popup = new ConfirmPopup(htmlPopupPara);
    popup.addCallBack("ok",function(){refuse(id);});
    popup.show();
}

//删除邀请
function refuse(id)
{
    var openid = getOpenId();
    var openkey = getOpenKey();
    $.ajax(
		{
        url: "refuse?openid="+openid+"&openkey="+openkey+"&account="+openid+"&id="+id,
        cache: false,
        success: 
        function(data)
        {
            var reply = $.evalJSON(eval(data));
            show(reply, showDataByRefuse);
        }
    });
}

function reqFriends()
{
    if(canShowFriend)//解决用户多次点击按钮的问题
    {
        canShowFriend = false;
        var openid = getOpenId();
        var openkey = getOpenKey();
        $.ajax(
		    {
            url: "friendlist?openid="+openid+"&openkey="+openkey,
            cache: false,
            success: 
            function(data)
            {
                var reply = $.evalJSON(eval(data));
                showFriends(reply.data.friends);
            }
        });
    }
}

function showFriends(data)
{
    var friends = buildFriends(data);
    if(data && data.length && data.length > 0)
    {
        //弹出对话框让用户选择
        var htmlPopupPara={width:430,height:200,top:50,left:null,title:"选择ta成为你的情侣吧",content:""+friends+"",showMask:true,language:'zh-cn',closeCallBack:enableFriend};
        htmlPopup = new AlertPopup(htmlPopupPara);
        htmlPopup.addCallBack("ok",function(){enableFriend();});
        htmlPopup.show();
        setFriendPager();
    }
    else
    {
        alert("消息提示", "您暂时还没有好友!", null);
        //TODO:弹出QQ好友邀请框
    }
}

function enableFriend()
{
    canShowFriend = true;
}

function setFriendPager()
{
    $("#FriendTable").tablesorter().tablesorterPager({container: $("#FriendPager")});
}


function buildFriends(data)
{
    var sb = "";
    sb += "<table><tr><td>"
    sb += "<table id=\"FriendTable\">";
    sb += "	<thead>";
	sb += "	<tr>";
	sb += "		<th></th>";
	sb += "		<th></th>";
	sb += "		<th></th>";
	sb += "		<th></th>";
	sb += "	</tr>";
	sb += "</thead><tbody>";
	var dataLength = 0;
	if(data && data.length)
	{
		dataLength = data.length;
	}
    for(var i = 0; i < dataLength; i++)
    {
        if(i % 5 == 0)
            sb += "    <tr>";

        if(data[i].nickName == "" && data[i].imageUrl == "")
            sb += "        <td onMouseOver=\"this.style.backgroundColor='#fc337a'\"   onMouseOut= \"this.style.backgroundColor='#ffffff' \" title=\""+data[i].openId+"\" onclick=\"regist('"+data[i].openId+"', '"+data[i].nickName+"');\">";
        else
            sb += "        <td onMouseOver=\"this.style.backgroundColor='#fc337a'\"   onMouseOut= \"this.style.backgroundColor='#ffffff' \" onclick=\"regist('"+data[i].openId+"', '"+data[i].nickName+"');\">";
            
        sb += "            <table>";
        sb += "                <tr>";
        sb += "                    <td><img width=\"60px\" height=\"60px\" src=\""+getImageUrl(data[i].imageUrl)+"\" /></td>";
        sb += "                </tr>";
        sb += "                <tr>";
        sb += "                    <td align=\"center\" style=\"color:#666666\">"+getName(data[i].nickName)+"</td>";
        sb += "                </tr>";
        sb += "            </table>";
        sb += "        </td>";
        
        if((i + 1) % 5 == 0)
            sb += "    </tr>";
    }
    sb += "</tbody></table>";
    sb += "</td></tr>";
    sb += "<tr><td align='center'>"
    sb += "<table id=\"FriendPager\" cellpadding=\"0\" border=\"0\" cellspacing=\"0\">";
    sb += "    <tr>";
    sb += "        <td>";
    sb += "            <label class=\"prev\" style=\"cursor:pointer;color:#666666\">上一页</label>&nbsp;&nbsp;&nbsp;&nbsp;";
    sb += "            <input type=\"text\" readonly=\"readonly\" style=\"width:50px; text-align:center;\" class=\"pagedisplay\" />&nbsp;&nbsp;&nbsp;&nbsp;";
    sb += "            <label class=\"next\" style=\"cursor:pointer;color:#666666\">下一页</label>";
    sb += "            <select class=\"pagesize\" style=\"visibility:hidden\">";
    sb += "                <option selected=\"selected\" value=\"2\">2</option>";
    sb += "            </select>";
    sb += "        </td>";
    sb += "    </tr>";
    sb += "</table>";
    sb += "</td></tr>";
    sb += "</table>";
    
    return sb;
}

function regist(openId, nickName)
{
    //弹出对话框让用户选择
    var htmlPopupPara={width:250,height:150,top:100,left:null,title:"选择确认框",content:"确定与"+nickName+"配对吗?",showMask:true,language:'zh-cn',closeCallBack:null};
    var popup = new ConfirmPopup(htmlPopupPara);
    popup.addCallBack("ok",function(){reqRegist(openId);});
    popup.show();
}

// 向服务端发出注册请求
function reqRegist(invitedOpenId)
{
    var openid = getOpenId();
    var openkey = getOpenKey();
    $.ajax({
        url: "inviting?openid="+openid+"&openkey="+openkey+"&inviting="+openid+"&invited="+invitedOpenId,
        cache: false,
        success: 
        function(data)
        {
            var reply = $.evalJSON(eval(data));
            show(reply, showData);
        }
    });
}


// 获取用户的OpenId
// TODO:这里需要做校验
function getOpenId()
{
    if(OpenId != undefined)
        return OpenId;
        
    var openId = getUrlPara("openid");
    var re = new RegExp("^([0-9A-F]{32})$");
    if(re.test(openId))
        OpenId = openId;
    else
        OpenId = undefined;
        
    return OpenId;
}

// 获取用户的OpenKey
// TODO:这里需要做校验
function getOpenKey()
{
    if(!OpenKey)
        OpenKey = getUrlPara("openkey");
    return OpenKey
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

function getName(name)
{
    if(name == "")
        return "&nbsp;"
    else
        return name;
}

function getImageUrl(url)
{
    if(url == "")
        return "../images/none.png";
    else
        return url;
}

function alert(title, content, callback)
{
    var htmlPopupPara={width:300,height:100,top:50,left:null,title:title,content:"<font color=\"#333333\">"+content+"</font>",showMask:true,language:'zh-cn',closeCallBack:callback};
    var alertpopup = new AlertPopup(htmlPopupPara);
    alertpopup.addCallBack("ok",callback);
    alertpopup.show();
}