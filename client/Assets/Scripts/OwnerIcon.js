#pragma strict
#pragma downcast
import iGUI;



class OwnerIcon extends PlatResInfoCtrl {
	public var imageElement : iGUIImage;
	public var nameElement : iGUILabel;
	public var qqhzElement : iGUIButton;
	public var qqhzYearElement : iGUIButton;

	//overwrite
	public function Callback() {
		if(URLValid) {
			imageElement.image = image;
		} else {
			imageElement.image = Resources.Load("UISkins/Textures/Common1/default_avatar");
		}
		if(info.nickname.Length > 4) {
			nameElement.label.text = info.nickname.Substring(0,4)+"...";
		} else {
			nameElement.label.text = info.nickname;
		}

		if(info.is_yellow_vip == 0 && info.is_yellow_year_vip == 0) {
			qqhzElement.style.normal.background = null;
			qqhzElement.setEnabled(false);
			qqhzYearElement.setEnabled(false);
		} else if(info.is_yellow_vip != 0 && info.is_yellow_year_vip == 0){
			qqhzElement.style.normal.background = Resources.Load("UISkins/Textures/hz/hz_lv"+info.yellow_vip_level.ToString());
			qqhzElement.setEnabled(true);
			qqhzYearElement.setEnabled(false);
		} else if(info.is_yellow_year_vip != 0){
			qqhzElement.style.normal.background = Resources.Load("UISkins/Textures/hz/hz_lv"+info.yellow_vip_level.ToString());
			qqhzElement.setEnabled(true);
			qqhzYearElement.setEnabled(true);
		} else {
			Debug.Log("do nothing--unknown qqhometype---CallbackFriendHeadIconShow!!");
		}

		var fImage : FriendImage = new FriendImage();
		fImage.account = account;
		fImage.name = info.nickname;
		fImage.image = image;
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_REQUEST_UPDATE_FRIEND_ITEM_INFO),fImage);
	}
}


