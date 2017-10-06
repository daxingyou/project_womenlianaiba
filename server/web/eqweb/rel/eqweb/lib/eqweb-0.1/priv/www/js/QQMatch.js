var htmlPopup;
var htmlInvitList;
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
    fusion.canvas.setHeight("900");
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
        url: "qqmatch?openid="+openid+"&openkey="+openkey,
        cache: false,
        success: 
        function(data)
        {
            var reply = $.parseJSON(eval(data));
//            var reply = {
//                    "status":"show",
//                    "data" : {
//                                "message":"XXX", 
//                                //"inviting":null,
//                                "inviting":{"boyNumber":"1234567", "girlNumber":"234562133"},
//                                "invitedList":[{"openid":"openid", "imageUrl":"http://py.qlogo.cn/friend/48a5beee9d1bd4e732ed131ad25ea85248a8dbec4d7b7800/audited/60", "nickName":"主人"},
//                                             {"openid":"openid", "imageUrl":"http://py.qlogo.cn/friend/48a5beee9d1bd4e732ed131ad25ea85248a8dbec4d7b7800/audited/60", "nickName":"主人"},
//                                             {"openid":"openid", "imageUrl":"http://py.qlogo.cn/friend/48a5beee9d1bd4e732ed131ad25ea85248a8dbec4d7b7800/audited/60", "nickName":"主人"},
//                                             {"openid":"openid", "imageUrl":"http://py.qlogo.cn/friend/48a5beee9d1bd4e732ed131ad25ea85248a8dbec4d7b7800/audited/60", "nickName":"主人"},
//                                             {"openid":"openid", "imageUrl":"http://py.qlogo.cn/friend/48a5beee9d1bd4e732ed131ad25ea85248a8dbec4d7b7800/audited/60", "nickName":"主人"},
//                                             {"openid":"openid", "imageUrl":"http://py.qlogo.cn/friend/48a5beee9d1bd4e732ed131ad25ea85248a8dbec4d7b7800/audited/60", "nickName":"主人"},
//                                             {"openid":"openid", "imageUrl":"http://py.qlogo.cn/friend/48a5beee9d1bd4e732ed131ad25ea85248a8dbec4d7b7800/audited/60", "nickName":"主人"},
//                                             {"openid":"openid", "imageUrl":"http://py.qlogo.cn/friend/48a5beee9d1bd4e732ed131ad25ea85248a8dbec4d7b7800/audited/60", "nickName":"主人"},
//                                             {"openid":"openid", "imageUrl":"http://py.qlogo.cn/friend/48a5beee9d1bd4e732ed131ad25ea85248a8dbec4d7b7800/audited/60", "nickName":"主人"},
//                                             {"openid":"openid", "imageUrl":"http://py.qlogo.cn/friend/48a5beee9d1bd4e732ed131ad25ea85248a8dbec4d7b7800/audited/60", "nickName":"主人"}
//                                            ],
//                                "userInfo":{"openid":"openid", "imageUrl":"http://py.qlogo.cn/friend/48a5beee9d1bd4e732ed131ad25ea85248a8dbec4d7b7800/audited/60", "nickName":"主人"},
//                                "messageList":[]
//                              }
//                };
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
            handleFun(reply.data);
            break;
    }
}

function DestroyHtmlPopup()
{
    if(htmlPopup != null)
    {
        htmlPopup.close();
        htmlPopup = null;
    }
}

function DestroyListPopup()
{
    if(htmlInvitList != null)
    {
        htmlInvitList.close();
        htmlInvitList = null;
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
        showInviting(buildInvitingNormal("", ""));
    }
    
//    if(data.invited && (data.invited.length > 0))
//    {
//        if(data.invited)
//            Invited = data.invited;
//            
//        showInvited(Invited);
//    }
//    else if(data.invited && (data.invited.length == 0))
//    {
//        $("#invited").empty();
//        $("#InvitedPager").hide();
//    }
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

function buildInvitingNormal(boyNumber, girlNumber)
{
    var sb = "";
    sb += "<table>";
    sb += "    <tr>";
    sb += "        <td>";
    sb += "        </td>";
    sb += "        <td colspan=\"2\">";
    sb += "            <div style=\"width:321px;height:90px;\"></div>";
    sb += "        </td>";
    sb += "        <td>";
    sb += "        </td>";
    sb += "    </tr>";
    sb += "    <tr style=\"height:45px;\">";
    sb += "        <td>";
    sb += "        </td>";
    sb += "        <td colspan=\"2\">";
    sb += "            <div id=\"stepDiv\"></div>";
    sb += "        </td>";
    sb += "        <td>";
    sb += "        </td>";
    sb += "    </tr>";
    sb += "    <tr>";
    sb += "        <td>";
    sb += "        </td>";
    sb += "        <td style=\"width:150px;text-align: center; vertical-align: middle; color:#ff0066; font-size:14px;\">";
    sb += "            <div id=\"boyQQDiv\"></div>";
    sb += "        </td>";
    sb += "        <td style=\"width:200px;text-align: left;\">";
    sb += "            <input id=\"boyNumber\" onkeydown=\"if(event.keyCode==13)event.keyCode=9\" onKeyPress=\"if ((event.keyCode <48 || event.keyCode>57)) event.returnValue=false\" type=\"text\" maxlength=\"14\" value=\""+boyNumber+"\" style=\"width:105px;\"/>";
    sb += "        </td>";
    sb += "        <td>";
    sb += "        </td>";
    sb += "    </tr>";
    sb += "    <tr>";
    sb += "        <td>";
    sb += "        </td>";
    sb += "        <td style=\"width:150px; height:60px;text-align: center; vertical-align: middle; color:#ff0066; font-size:14px;\">";
    sb += "            <div id=\"girlQQDiv\"></div>";
    sb += "        </td>";
    sb += "        <td style=\"width:200px;text-align: left;\">";
    sb += "            <input id=\"girlNumber\" onkeydown=\"if(event.keyCode==13)event.keyCode=9\" onKeyPress=\"if ((event.keyCode <48 || event.keyCode>57)) event.returnValue=false\" type=\"text\" maxlength=\"14\" value=\""+girlNumber+"\" style=\"width:105px;\"/>";
    sb += "        </td>";
    sb += "        <td>";
    sb += "        </td>";
    sb += "    </tr>";
    sb += "    <tr>";
    sb += "        <td>";
    sb += "        </td>";
    sb += "        <td colspan=\"2\" valign=\"top\" style=\"height:80px;\">";
    sb += "            <div><ul><li id=\"searchbtn\" onclick=\"reqMatch();\"></li><li style=\"margin-top:20px;\">如何开通?>></li></ul></div>";
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
    sb += "<table>";
    sb += "    <tr>";
    sb += "        <td>";
    sb += "        </td>";
    sb += "        <td colspan=\"2\">";
    sb += "            <div style=\"width:321px;height:90px;\">请确认您的另一半和你配对成功后，刷新页面进入游戏。</div>";
    sb += "        </td>";
    sb += "        <td>";
    sb += "        </td>";
    sb += "    </tr>";
    sb += "    <tr style=\"height:45px;\">";
    sb += "        <td>";
    sb += "        </td>";
    sb += "        <td colspan=\"2\">";
    sb += "            <div id=\"stepDiv\"></div>";
    sb += "        </td>";
    sb += "        <td>";
    sb += "        </td>";
    sb += "    </tr>";
    sb += "    <tr>";
    sb += "        <td>";
    sb += "        </td>";
    sb += "        <td style=\"width:150px;text-align: center; vertical-align: middle; color:#ff0066; font-size:14px;\">";
    sb += "            <div id=\"boyQQDiv\"></div>";
    sb += "        </td>";
    sb += "        <td style=\"width:200px;text-align: left;\">";
    sb += "            <label id=\"boyNumber\">"+ inviting.boyNumber +"</label>";
    sb += "        </td>";
    sb += "        <td>";
    sb += "        </td>";
    sb += "    </tr>";
    sb += "    <tr>";
    sb += "        <td>";
    sb += "        </td>";
    sb += "        <td style=\"width:150px; height:60px;text-align: center; vertical-align: middle; color:#ff0066; font-size:14px;\">";
    sb += "            <div id=\"girlQQDiv\"></div>";
    sb += "        </td>";
    sb += "        <td style=\"width:200px;text-align: left;\">";
    sb += "            <label id=\"girlNumber\">"+ inviting.girlNumber +"</label>";
    sb += "        </td>";
    sb += "        <td>";
    sb += "        </td>";
    sb += "    </tr>";
    sb += "    <tr>";
    sb += "        <td>";
    sb += "        </td>";
    sb += "        <td colspan=\"2\" valign=\"top\">";
    sb += "            <div id=\"cancelbtn\" onclick=\"cancel('"+inviting.boyNumber+"', '"+inviting.girlNumber+"');\"/>";
    sb += "        </td>";
    sb += "        <td>";
    sb += "        </td>";
    sb += "    </tr>";
    sb += "</table>";
    
    return sb;
}

function cancel(boyNumber, girlNumber)
{
    showInviting(buildInvitingNormal(boyNumber, girlNumber));
//    //弹出对话框让用户选择
//    var htmlPopupPara={width:250,height:150,top:100,left:null,title:"选择确认框",content:"确定取消与"+nickName+"配对吗?",showMask:true,language:'zh-cn',closeCallBack:null};
//    var popup = new ConfirmPopup(htmlPopupPara);
//    popup.addCallBack("ok",function(){reqCancel(id);});
//    popup.show();
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
    var htmlPopupPara={width:250,height:150,top:180,left:null,title:"选择确认框",content:"确定接受"+nickName+"的邀请吗?",showMask:true,language:'zh-cn',closeCallBack:null};
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

function reqMatch()
{
    var openid = getOpenId();
    var openkey = getOpenKey();
    var boyNumber =  getBoyNumber();
    var girlNumber = getGirlNumber();
    if(canMatch(boyNumber, girlNumber))
    {
        $.ajax(
	        {
            url: "mateup?openid="+openid+"&openkey="+openkey+"&boyNumber="+boyNumber+"&girlNumber="+girlNumber,
            cache: false,
            success: 
            function(data)
            {
            	var reply = $.evalJSON(eval(data));
//            	var reply = {
//                    "status":"show",
//                    "data" : {
//                                "message":"XXX", 
//                                "inviting":null,
//                                //"inviting":{"boyNumber":"1234567", "girlNumber":"234562133"},
//                                "invitedList":null,
//                                "userInfo":{"openid":"openid", "imageUrl":"http://py.qlogo.cn/friend/48a5beee9d1bd4e732ed131ad25ea85248a8dbec4d7b7800/audited/60", "nickName":"主人"},
//                                "messageList":[]
//                              }
//                };
                if(reply.data.invitedList != null)
                {
                    showInvitList(reply.data.invitedList);
                }
                else
                {
                    alert("邀请对方开通", "现在请通知对方也进入\"我们恋爱吧\"，并且正确输入你们的QQ号码，就可以开通成功啦！\"我们恋爱吧\"：<font color=\"#ff0000\">http://url.cn/1v04X7</font>", null);
                    show(reply, showData);
                }
                //var reply = $.evalJSON(eval(data));
                //showFriends(reply.data.friends);
            }
        });
    }
}

function canMatch(boyNumber, girlNumber)
{
    var re = new RegExp(/^[0-9][0-9]{4,14}$/);
    if(!re.test(boyNumber) || !re.test(girlNumber))   
    {
        alert("消息提示", "请输入正确的QQ号码!", null); 
        return false;
    }
    else
    {
        if(boyNumber == girlNumber)
        {
            alert("消息提示", "你们的QQ号不能相同!", null);
            return false;
        }
        else
        {
            return true;
        }
    }
}

function showInvitList(data)
{
    if(data && data.length && data.length > 0)
    {
        var invitList = buildInvitList(data);
        //弹出对话框让用户选择
        var htmlPopupPara={width:430,height:200,top:50,left:null,title:"选择ta成为你的情侣吧",content:""+invitList+"",showMask:true,language:'zh-cn',closeCallBack:enableFriend};
        htmlInvitList = new CancelPopup(htmlPopupPara);
        htmlInvitList.addCallBack("cancel",function(){enableFriend(); delayMatch();});
        htmlInvitList.show();
        setInvitPager();
    }
    else
    {
        alert("消息提示", "您暂时还没有好友!", null);
        //TODO:弹出QQ好友邀请框
    }
}

function delayMatch()
{
	var openid = getOpenId();
    var openkey = getOpenKey();
    var boyNumber = getBoyNumber();
    var girlNumber = getGirlNumber();
    $.ajax({
        url: "delaymateup?openid="+openid+"&openkey="+openkey+"&boyNumber="+boyNumber+"&girlNumber="+girlNumber,
        cache: false,
        success: 
        function(data)
        {
        	var reply = $.evalJSON(eval(data));         
	        show(reply, showData);
        }
    });
}

function enableFriend()
{
    canShowFriend = true;
}

function setInvitPager()
{
    $("#FriendTable").tablesorter().tablesorterPager({container: $("#FriendPager")});
}


function buildInvitList(data)
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
    var htmlPopupPara={width:250,height:150,top:100,left:null,title:"选择确认框",content:"确定与"+nickName+"一起进入\"我们恋爱吧\"?",showMask:true,language:'zh-cn',closeCallBack:null};
    var popup = new ConfirmPopup(htmlPopupPara);
    popup.addCallBack("ok",function(){reqRegist(openId);});
    popup.show();
}

// 向服务端发出注册请求
function reqRegist(invitedOpenId)
{
    var openid = getOpenId();
    var openkey = getOpenKey();
    var boyNumber = getBoyNumber();
    var girlNumber = getGirlNumber();
    $.ajax({
        url: "confirmmateup?openid="+openid+"&openkey="+openkey+"&exopenid="+invitedOpenId+"&boyNumber="+boyNumber+"&girlNumber="+girlNumber,
        cache: false,
        success: 
        function(data)
        {
        	var reply = $.evalJSON(eval(data));         
            if(reply.data.choiceSex)
            {
                htmlInvitList.close();
                showChoiceSex(invitedOpenId);
            }
            else
            {
                //var reply = $.evalJSON(eval(data));
                show(reply, showData);
            }
        }
    });
}

// 显示选择性别框
function showChoiceSex(invitedOpenId)
{
    var choiceSex = buildChoiceSex();
    //弹出对话框让用户选择
    var htmlPopupPara={width:200,height:80,top:250,left:null,title:"性别选择",content:""+choiceSex+"",showMask:true,language:'zh-cn',closeCallBack:reqMatchBySex};
    htmlPopup = new AlertPopup(htmlPopupPara);
    htmlPopup.addCallBack("ok",function(){reqMatchBySex(invitedOpenId);});
    htmlPopup.show();
}

function reqMatchBySex(invitedOpenId)
{
    var openid = getOpenId();
    var openkey = getOpenKey();
    var boyNumber = getBoyNumber();
    var girlNumber = getGirlNumber();
    var sex = $("input[@type=radio][name=sexItem][checked]").val(); 
    $.ajax({
    	url: "confirmmateup?openid="+openid+"&openkey="+openkey+"&exopenid="+invitedOpenId+"&gender="+sex+"&boyNumber="+boyNumber+"&girlNumber="+girlNumber,      
        cache: false,
        success: 
        function(data)
        {
            var reply = $.evalJSON(eval(data));
            show(reply, showData);
        }
    });
}

function buildChoiceSex()
{
    var sb = "";
    sb += "<table align=\"center\">";
    sb += "    <tr>";
    sb += "        <td>";
    sb += "            <input type=\"radio\" name=\"sexItem\" checked value=\"1\"><font color='#000000'>男</font>";
    sb += "            <input type=\"radio\" name=\"sexItem\" value=\"0\"><font color='#000000'>女</font>";
    sb += "        </td>";
    sb += "    </tr>";
    sb += "</table>";
    
    return sb;
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
    var htmlPopupPara={width:300,height:100,top:250,left:null,title:title,content:"<font color=\"#333333\">"+content+"</font>",showMask:true,language:'zh-cn',closeCallBack:callback};
    var alertpopup = new AlertPopup(htmlPopupPara);
    alertpopup.addCallBack("ok",callback);
    alertpopup.show();
}

function getBoyNumber()
{
    var boyNumber = $("#boyNumber").val();
    
    return $.trim(boyNumber);
}

function getGirlNumber()
{
    var girlNumber = $("#girlNumber").val();
    return  $.trim(girlNumber);
}