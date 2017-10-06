
class YYUserInfoClass extends PlatResInfoCtrl {
	public var imageElement : iGUILabel;
	public var nameElement : iGUILabel;
	
	//overwrite
	public function Callback() {
		if(URLValid) {
			imageElement.style.normal.background = image;
		} else {
			imageElement.style.normal.background = Resources.Load("UISkins/Textures/Common1/default_avatar");
		}
		if(info.nickname == "") {
			nameElement.label.text = Define.unknow;
		} else {
			nameElement.label.text = info.nickname;
		}
		
	}
}

