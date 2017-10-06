//--------------------------------------------------
// 平台(2012/10/9 create by hezhr)
//--------------------------------------------------
#pragma strict


class Platform
{
	public function inviteFriends() : void {}
	
	public function setOwnerOpenId(open_id : String) : void {}
	
	public function setLoverOpenId(open_id : String) : void {}
	
	public function share(type : int, desc : String, title : String, summary : String) : void {}
	
	public function share(type : int, desc : String, title : String, summary : String, picture : String) : void {}
	
	public function reqMakeFriend(target_open_id : String) : void {}
	
	public function tweet(msg : String, picture : String) : void {}
	
	public function reload() : void {}
	
	public function openUrl(url : String) : void {}
	
	public function httpPost(data : String) : void {}
	
	public function gotoFriendHome(open_id : String) : void {}
	
	public function buyGoods(params : String, context : String) : void {}
	
	public function openVipOP() : void {}
	
	public function openVipYOP() : void {}
	
	public function recharge() : void {}
	
	public function initUserInfo() : void {}
	
	public function gotoVideo() : void {}
	public function sendMsgToSubChannel(msg : String, linkStart : int, linkEnd : int, token : int) : void{}
	
	//audio logic(edit by fullzhu 2013.2.20)
	public function CreateRoom() : void {}
	public function EnterRoom(id : String) : void {}
	public function LeaveRoom() : void {}
	public function StartSpeak() : void {}
	public function StopSpeak() : void {}
	
	public function EnableAudioMixing() : void {}
	public function DisableAudioMixing() : void {}
}

