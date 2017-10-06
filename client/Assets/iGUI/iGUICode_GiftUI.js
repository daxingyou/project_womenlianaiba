#pragma strict
#pragma downcast
import iGUI;

class GiftIcon {
	public var gift : HolidayGift = null;	// gift data
	public var asynIcon : AsynIcon = null;	// asyn icon manager
	public var iconSlot : iGUIImage;		// icon slot ui
	
	public function CallbackIconLoad(tex : Texture) {
		iconSlot.image = tex;
	}
}

private var bgAsynIcon : AsynIcon = null;
private var mHoliday : stime = new stime();
private var mGiftRandomList : ArrayList = new ArrayList();			//struct GiftIcon
private var mResultGift : GiftIcon = new GiftIcon();				//result gift
private var mGiftNum : int = 5;										//gift number

function Start() {
	Init();
}

private function Init() {
	BtnGiftGetGift.clickCallback = CallbackMouseClickGift;
	ImgGift1.mouseOverCallback = CallbackMouseOverGift;
	ImgGift2.mouseOverCallback = CallbackMouseOverGift;
	ImgGift3.mouseOverCallback = CallbackMouseOverGift;
	ImgGift4.mouseOverCallback = CallbackMouseOverGift;
	ImgGift5.mouseOverCallback = CallbackMouseOverGift;
	ImgGiftResult.mouseOverCallback = CallbackMouseOverGift;
	
	bgAsynIcon =  new AsynIcon(CallbackBGIcon, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	bgAsynIcon.load("UI/Bottom_plate.png.u3d");
}

private function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_GIFT_ACTIVE), HandleNotifyGiftActive);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_GIFT_RESULT), HandleNotifyGiftResult);
}

//handle client net msg
private function HandleNotifyGiftActive(evt:GameEvent, obj:System.Object) {
	WinGift.setEnabled(obj);
	ImgGiftResult.image = Resources.Load("UISkins/Textures/Holiday/Valentine_s_Day/Question_mark");
	BtnGiftGetGift.style.normal.background = Resources.Load("UISkins/Textures/Holiday/Valentine_s_Day/Start");
	BtnGiftGetGift.style.hover.background = Resources.Load("UISkins/Textures/Holiday/Valentine_s_Day/Start_hover");
	BtnGiftGetGift.style.active.background = Resources.Load("UISkins/Textures/Holiday/Valentine_s_Day/Start");
	BtnGiftGetGift.passive = false;
	LabCountResult.label.text = "";
	
	BtnGiftGetGift.userData = false;
	
	mGiftRandomList.Clear();
	
	mHoliday = GiftMgr.GetHoliday();
	
	/*TEMP
	mHoliday.year = 2012;
	mHoliday.month = 2;
	mHoliday.day = 4;
	*/
	
	var num : int = 0;
	for(var gift : DictionaryEntry in ResManager.LgtMgr.HolidayGiftTable) {
		var gift_itm : HolidayGift = gift.Value;
		var day : stime	 = AnalyTime(gift_itm.start_day,".");
		if(day.year == mHoliday.year && day.month == mHoliday.month && day.day + gift_itm.duration-1 >= mHoliday.day) {
			var gift_icon : GiftIcon = new GiftIcon();
			
			if(num == 0) {
				if(gift_itm.count == 1 || gift_itm.count == 0) {
					LabCount1.label.text = "";
				} else {
					LabCount1.label.text = gift_itm.count.ToString();
				}
				ImgGift1.userData = gift_icon;
				gift_icon.iconSlot = ImgGift1;
			} else if(num == 1) {
				if(gift_itm.count == 1 || gift_itm.count == 0) {
					LabCount2.label.text = "";
				} else {
					LabCount2.label.text = gift_itm.count.ToString();
				}
				ImgGift2.userData = gift_icon;
				gift_icon.iconSlot = ImgGift2;
			} else if(num == 2) {
				if(gift_itm.count == 1 || gift_itm.count == 0) {
					LabCount3.label.text = "";
				} else {
					LabCount3.label.text = gift_itm.count.ToString();
				}
				ImgGift3.userData = gift_icon;
				gift_icon.iconSlot = ImgGift3;
			} else if(num == 3) {
				if(gift_itm.count == 1 || gift_itm.count == 0) {
					LabCount4.label.text = "";
				} else {
					LabCount4.label.text = gift_itm.count.ToString();
				}
				ImgGift4.userData = gift_icon;
				gift_icon.iconSlot = ImgGift4;
			} else if(num == 4) {
				if(gift_itm.count == 1 || gift_itm.count == 0) {
					LabCount5.label.text = "";
				} else {
					LabCount5.label.text = gift_itm.count.ToString();
				}
				ImgGift5.userData = gift_icon;
				gift_icon.iconSlot = ImgGift5;
			} else {
				Debug.Log("there is something wrong in the table");
			} 
			
			gift_icon.gift = gift_itm;
			if(gift_itm.gift_type == 1) {
				gift_icon.asynIcon =  new AsynIcon(gift_icon.CallbackIconLoad, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
				gift_icon.asynIcon.load("Icon/" + ResManager.LgtMgr.getItemRow(gift_itm.item_id).icon);
			} else if(gift_itm.gift_type == 2) {
				gift_icon.iconSlot.image = Resources.Load("UISkins/Textures/Common1/gift_crystal");
			} else {
				Debug.Log("there is something wrong in the table");
			}
			
			mGiftRandomList.Add(gift_icon);
			
			num++;
			if(num >= mGiftNum) {
				break;
			}
		}
	}
	
	ImgGiftResult.userData = mResultGift;
	mResultGift.gift = new HolidayGift();
}

private function HandleNotifyGiftResult(evt:GameEvent, obj:notify_get_holiday_gift_result) {
	BtnGiftGetGift.style.normal.background = Resources.Load("UISkins/Textures/Holiday/Valentine_s_Day/Enter");
	BtnGiftGetGift.style.hover.background = Resources.Load("UISkins/Textures/Holiday/Valentine_s_Day/Enter_hover");
	BtnGiftGetGift.style.active.background = Resources.Load("UISkins/Textures/Holiday/Valentine_s_Day/Enter");
	BtnGiftGetGift.passive = false;
	BtnGiftGetGift.userData = true;
	
	var animation : iGUITextureAnimation = ImgGiftResult.getTextureAnimation("animationgift");
	animation.stop();
	
	if(obj.result == 1) {
		if(obj.item_count == 1 || obj.item_count == 0) {
			LabCountResult.label.text = "";
		} else {
			LabCountResult.label.text = obj.item_count.ToString();
		}
		mResultGift.gift.item_id = obj.item_id;
		mResultGift.gift.gift_type = 1;
		mResultGift.iconSlot = ImgGiftResult;
		mResultGift.asynIcon =  new AsynIcon(mResultGift.CallbackIconLoad, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
		mResultGift.asynIcon.load("Icon/" + ResManager.LgtMgr.getItemRow(mResultGift.gift.item_id).icon);
	} else if(obj.result == 2) {
		if(obj.diamond == 1 || obj.diamond == 0) {
			LabCountResult.label.text = "";
		} else {
			LabCountResult.label.text = obj.diamond.ToString();
		}
		mResultGift.gift.count = obj.diamond;
		mResultGift.gift.gift_type = 2;
		mResultGift.iconSlot = ImgGiftResult;
		mResultGift.iconSlot.image = Resources.Load("UISkins/Textures/Common1/gift_crystal");
	} else {
		WinGift.setEnabled(false);
		Debug.Log("wrong!!!!!");
		return;
	}
}

//internal function
private function ShowGiftTip(slot : GiftIcon) {
	if(slot == null) return ;
	if(slot.gift.gift_type == 1) {
		ItemHint.ShowPackItemHint(slot.iconSlot, ResManager.LgtMgr.getItemRow(slot.gift.item_id), false);
	}
}
/*
private function RandomResult() {
	var random_num : float = Random.Range(0,100);
	
	var rateAdd : int = 0;
	for(var i=0; i<mGiftRandomList.Count; i++) {
		mGiftRandomList[i].rate += rateAdd;
		rateAdd = mGiftRandomList[i].rate;
	}
	
	var kRate : int = 100;
	var idx : int = 0;
	for(var j=0; j<mGiftRandomList.Count; j++) {
		if(mGiftRandomList[j].rate <= kRate && mGiftRandomList[j].rate >= random_num) {
			kRate = mGiftRandomList[j].rate;
			idx = j;
		}
	}
	
	var animation : iGUITextureAnimation = ImgGiftResult.getTextureAnimation("animationgift");
	animation.stop();
	
	mResultGift.gift = mGiftRandomList[idx];
	mResultGift.iconSlot = ImgGiftResult;
	mResultGift.asynIcon =  new AsynIcon(mResultGift.CallbackIconLoad, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
	mResultGift.asynIcon.load("Icon/" + ResManager.LgtMgr.getItemRow(mResultGift.gift.item_id).icon);
	
	//EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REQUEST_GIFT_ROLL)); 
}
*/
private function AnalyTime(str : String, sep : String) : stime {
	/*
	var time : stime = new stime();
	var timeStr : String[] = str.Split(sep[0]);
	if(timeStr.Length < 3) {
		Debug.Log("table error~~");
	} else {
		time.year = ResManager.LgtMgr.ParseInt(timeStr[0]);
		time.month = ResManager.LgtMgr.ParseInt(timeStr[1]);
		time.day = ResManager.LgtMgr.ParseInt(timeStr[2]);
	}
	*/
	var time : stime = new stime();	
	
	var YYYYMMDD: int = int.Parse(str);	
	
	time.year = YYYYMMDD / 10000;
	time.month = (YYYYMMDD / 100) % 100;
	time.day = YYYYMMDD % 100;
	
	return time;
}

private function NoticeGiftRoll() {
	yield WaitForSeconds(Global.mGiftRandomTime);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_REQUEST_GIFT_ROLL));
	
	//var animation : iGUITextureAnimation = ImgGiftResult.getTextureAnimation("animationgift");
	//animation.stop();
	
	
	/*TEMP
	var pack : notify_get_holiday_gift_result = new notify_get_holiday_gift_result();
	pack.result = 1;
	pack.item_id = 200012;
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_GIFT_RESULT),pack);
	*/
}

//callback function
private function CallbackMouseClickGift(callback : iGUIElement) {
	if(BtnGiftGetGift.userData == true) {
		WinGift.setEnabled(false);
	} else {
		var animation : iGUITextureAnimation = ImgGiftResult.getTextureAnimation("animationgift");
		if(animation != null) {
			for(var i=0; i<mGiftRandomList.Count; i++) {
				animation.images[i] = (mGiftRandomList[i] as GiftIcon).iconSlot.image;
				if(i >= 5) {
					break;
				}
			}
			animation.playFromStart();
		}
		//RandomResult();
		callback.passive = true;
		NoticeGiftRoll();
	} 
} 
private function CallbackMouseOverGift(callback : iGUIElement) {
	ShowGiftTip(callback.userData);
}

private function CallbackBGIcon(tex:Texture) {
	WinGift.style.normal.background = tex;
}

//UI
private static var instance : iGUICode_GiftUI;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function getInstance(){
	return instance;
}
@HideInInspector
var LabCount1 : iGUILabel;
@HideInInspector
var LabCount2 : iGUILabel;
@HideInInspector
var LabCount3 : iGUILabel;
@HideInInspector
var LabCount4 : iGUILabel;
@HideInInspector
var LabCount5 : iGUILabel;
@HideInInspector
var LabCountResult : iGUILabel;
@HideInInspector
var BtnGiftGetGift : iGUIButton;
@HideInInspector
var ImgGift1 : iGUIImage;
@HideInInspector
var ImgGift2 : iGUIImage;
@HideInInspector
var ImgGift3 : iGUIImage;
@HideInInspector
var ImgGift4 : iGUIImage;
@HideInInspector
var ImgGift5 : iGUIImage;
@HideInInspector
var ImgGiftResult : iGUIImage;
@HideInInspector
var WinGift : iGUIPanel;
@HideInInspector
var GiftUI : iGUIRoot;