//--------------------------------------------------
// yy平台(2012/10/9 create by hezhr)
//--------------------------------------------------
#pragma strict


class YYplatform extends Platform
{
	//--------------------------------------------------
	public override function inviteFriends() : void
	{
		Application.ExternalCall("YYplatform.invite", null);
	}
	//--------------------------------------------------
	public override function setOwnerOpenId(open_id : String) : void
	{
		Application.ExternalCall("YYplatform.setOwnerOpenId", open_id);
	}
	//--------------------------------------------------
	public override function setLoverOpenId(open_id : String) : void
	{
		Application.ExternalCall("YYplatform.setLoverOpenId", open_id);
	}
	//--------------------------------------------------
	public override function share(type : int, desc : String, title : String, summary : String) : void
	{
		Application.ExternalCall("YYplatform.share", type, desc, title, summary);
	}
	//--------------------------------------------------
	public override function share(type : int, desc : String, title : String, summary : String, picture : String) : void
	{
		Application.ExternalCall("YYplatform.share", type, desc, title, summary, picture);
	}
	//--------------------------------------------------
	public override function reqMakeFriend(target_open_id : String) : void
	{
		Application.ExternalCall("YYplatform.reqMakeFriend", target_open_id);
	}
	//--------------------------------------------------
	public override function tweet(msg : String, picture : String) : void
	{
		Application.ExternalCall("YYplatform.tweet", msg, picture);
	}
	//--------------------------------------------------
	public override function reload() : void
	{
		Application.ExternalCall("YYplatform.reload", null);
	}
	//--------------------------------------------------
	public override function openUrl(url : String) : void
	{
		Application.ExternalCall("YYplatform.openUrl", url);
	}
	//--------------------------------------------------
	public override function httpPost(data : String) : void
	{
		Application.ExternalCall("YYplatform.httpPost", data);
	}
	//--------------------------------------------------
	public override function gotoFriendHome(open_id : String) : void
	{
		Application.ExternalCall("YYplatform.gotoFriendHome", open_id);
	}
	//--------------------------------------------------
	public override function buyGoods(params : String, context : String) : void
	{
		Application.ExternalCall("YYplatform.buy_goods", params, context);
	}
	//--------------------------------------------------
	public override function openVipOP() : void
	{
		Application.ExternalCall("YYplatform.openVipOP", null);
	}
	//--------------------------------------------------
	public override function openVipYOP() : void
	{
		Application.ExternalCall("YYplatform.openVipYOP", null);
	}
	//--------------------------------------------------
	public override function recharge() : void
	{
		Application.ExternalCall("YYplatform.recharge");
	}
	//--------------------------------------------------
	public override function initUserInfo() : void
	{
		Application.ExternalCall("YYplatform.initUserInfo");
	}
	//--------------------------------------------------
	public override function gotoVideo() : void
	{
		//Application.ExternalCall("YYplatform.gotoVideo", null);
	}
	//--------------------------------------------------
	//发送应用消息到子频道
	public override function sendMsgToSubChannel(msg : String, linkStart : int, linkEnd : int, token : int) : void{
		Application.ExternalCall("YYplatform.sendMsgToSubChannel", msg, linkStart, linkEnd, token);
		Debug.Log("---Application.ExternalCall---YYplatform.sendMsgToSubChannel---");
	}
	
	//yy audio logic(edit by fullzhu 2013.2.20)
	public override function CreateRoom() : void {
		Application.ExternalCall("YYplatform.createRoom");
	}
	
	public override function EnterRoom(id : String) : void {
		Application.ExternalCall("YYplatform.enterRoom", id);
	}
	
	public override function LeaveRoom() : void {
		Application.ExternalCall("YYplatform.leaveRoom");
	}
	
	public override function StartSpeak() : void {
		Application.ExternalCall("YYplatform.startSpeak");
	}
	
	public override function StopSpeak() : void {
		Application.ExternalCall("YYplatform.stopSpeak");
	}
	
	public override function EnableAudioMixing() : void {
		Application.ExternalCall("YYplatform.enableAudioMixing");
	}
	public override function DisableAudioMixing() : void {
		Application.ExternalCall("YYplatform.disableAudioMixing");
	}
}

