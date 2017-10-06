#pragma strict

private static var mPlat : Platform = new Platform();

// 进入游戏时调用
public static function InitPlatform() : void
{
	if (PlatformMgr.IsPlatQZone() || PlatformMgr.IsPlatPY() || PlatformMgr.IsPlatQTwiter())		// qzone,朋友网,微博
	{
		mPlat = new PYplatform();
	}
	else if (PlatformMgr.IsPlatYY())	// YY
	{
		mPlat = new YYplatform();
	}
}

public static function InviteFriends()
{
	mPlat.inviteFriends();
}

public static function SetOwnerOpenID(openID:String)
{
	mPlat.setOwnerOpenId(openID);
}

public static function SetLoverOpenID(openID:String)
{
	mPlat.setLoverOpenId(openID);
}

// desc : "快来当市长吧",
// title : "我们恋爱吧",
// summary : "2011年全球游戏巨制《我们恋爱吧》全球玩家都在玩，快来我们恋爱吧！",
// pics : "logo.png", 备注此图片必须上传到cdn上
// type : 分享的类型(如派对,配对,关注)
// "应用内分享"
public static function Share(type:int, desc:String, title:String, summary:String)
{
	mPlat.share(type, desc, title, summary);
}

public static function Share(type:int, desc:String, title:String, summary:String, picture:String)
{
	mPlat.share(type, desc, title, summary, picture);
}

// 请求加好友
public static function ReqMakeFriend(targetOpenID:String)
{
	mPlat.reqMakeFriend(targetOpenID);
}

// msg : 默认显示在说说文字输入框中的文字内容。
// picture : 要发表带贴图的说说时，这里需要传入图片的链接。, 备注此图片必须上传到cdn上
// "发表说说"
public static function Tweet(msg:String, picture:String)
{
	mPlat.tweet(msg, picture);
}

//刷新页面
public static function ReloadPage()
{
	mPlat.reload();
}

public static function OpenUrl(url : String)
{
	mPlat.openUrl(url);
}

public static function HttpPost(data : String)
{
	mPlat.httpPost(data);
}

public static function gotoFriendHomePage(openID:String)
{
	mPlat.gotoFriendHome(openID);
}

public static function buyGoods(params:String, context:String)
{
	mPlat.buyGoods(params, context);
}

public static function openVipOP()
{
	mPlat.openVipOP();
}

public static function openVipYOP()
{
	mPlat.openVipYOP();
}

public static function recharge()
{
	mPlat.recharge();
}

public static function initUserInfo()
{
	mPlat.initUserInfo();
}

public static function gotoVideo()
{
	mPlat.gotoVideo();
}

public static function SendMsgToYYSubChannel(msg : String, linkStart : int, linkEnd : int, token : int){
	mPlat.sendMsgToSubChannel(msg, linkStart, linkEnd, token);
}

//audio logic(edit by fullzhu 2013.2.20)
public static function CreateRoom() : void {
	mPlat.CreateRoom();
}
public static function EnterRoom(id : String) : void {
	mPlat.EnterRoom(id);
}
public static function LeaveRoom() : void {
	mPlat.LeaveRoom();
}
public static function StartSpeak() : void {
	mPlat.StartSpeak();
}
public static function StopSpeak() : void {
	mPlat.StopSpeak();
}

public static function EnableAudioMixing() : void {
	mPlat.EnableAudioMixing();
}

public static function DisableAudioMixing() : void {
	mPlat.DisableAudioMixing();
}