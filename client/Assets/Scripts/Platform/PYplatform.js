//--------------------------------------------------
// qzone,朋友网平台(2012/10/9 create by hezhr)
//--------------------------------------------------
#pragma strict


class PYplatform extends Platform
{
	//--------------------------------------------------
	public override function inviteFriends() : void
	{
		Application.ExternalCall("PYplatform.inviteFriends", null);
	}
	//--------------------------------------------------
	public override function setOwnerOpenId(open_id : String) : void
	{
		Application.ExternalCall("PYplatform.setOwnerOpenId", open_id);
	}
	//--------------------------------------------------
	public override function setLoverOpenId(open_id : String) : void
	{
		Application.ExternalCall("PYplatform.setLoverOpenId", open_id);
	}
	//--------------------------------------------------
	public override function share(type : int, desc : String, title : String, summary : String) : void
	{
		Application.ExternalCall("PYplatform.share", type, desc, title, summary);
	}
	//--------------------------------------------------
	public override function share(type : int, desc : String, title : String, summary : String, picture : String) : void
	{
		Application.ExternalCall("PYplatform.share", type, desc, title, summary, picture);
	}
	//--------------------------------------------------
	public override function reqMakeFriend(target_open_id : String) : void
	{
		Application.ExternalCall("PYplatform.reqMakeFriend", target_open_id);
	}
	//--------------------------------------------------
	public override function tweet(msg : String, picture : String) : void
	{
		Application.ExternalCall("PYplatform.tweet", msg, picture);
	}
	//--------------------------------------------------
	public override function reload() : void
	{
		Application.ExternalCall("PYplatform.reload", null);
	}
	//--------------------------------------------------
	public override function openUrl(url : String) : void
	{
		Application.ExternalCall("PYplatform.openUrl", url);
	}
	//--------------------------------------------------
	public override function httpPost(data : String) : void
	{
		Application.ExternalCall("PYplatform.httpPost", data);
	}
	//--------------------------------------------------
	public override function gotoFriendHome(open_id : String) : void
	{
		Application.ExternalCall("PYplatform.gotoFriendHome", open_id);
	}
	//--------------------------------------------------
	public override function buyGoods(params : String, context : String) : void
	{
		Application.ExternalCall("PYplatform.buy_goods", params, context);
	}
	//--------------------------------------------------
	public override function openVipOP() : void
	{
		Application.ExternalCall("PYplatform.openVipOP", null);
	}
	//--------------------------------------------------
	public override function openVipYOP() : void
	{
		Application.ExternalCall("PYplatform.openVipYOP", null);
	}
	//--------------------------------------------------
	public override function initUserInfo() : void
	{
		Application.ExternalCall("YYplatform.initUserInfo");
	}
	//--------------------------------------------------
	public override function gotoVideo() : void
	{
		Application.ExternalCall("PYplatform.gotoVideo", null);
	}
	//--------------------------------------------------
	
	public override function EnableAudioMixing() : void {}
	public override function DisableAudioMixing() : void {}
	
}

