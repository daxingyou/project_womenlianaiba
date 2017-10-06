import iGUI;

private static var instance : iGUICode_UnLockInfoRoot;
function Awake(){
	instance=this;
	RegistEvt();
}
function RegistEvt(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_BUY_SYS_SHOP_GOODS), HandleNotifyBuySysShopGoods);
}

static function getInstance(){
	return instance;
}
@HideInInspector
var label1 : iGUILabel;
@HideInInspector
var closeButton : iGUIButton;
@HideInInspector
var unLockBtn : iGUIButton;
@HideInInspector
var fillMaterialsBtn : iGUIButton;
@HideInInspector
var levelLabel : iGUILabel;
@HideInInspector
var diamondLabel : iGUILabel;
@HideInInspector
var houseRightImage : iGUIImage;
@HideInInspector
var houseRightNamelabel : iGUILabel;
@HideInInspector
var nameLabel4 : iGUILabel;
@HideInInspector
var fillMaterialBtn4 : iGUIButton;
@HideInInspector
var numLabel4 : iGUILabel;
@HideInInspector
var materialIcon4 : iGUIImage;
@HideInInspector
var material4Panel : iGUIPanel;
@HideInInspector
var nameLabel3 : iGUILabel;
@HideInInspector
var fillMaterialBtn3 : iGUIButton;
@HideInInspector
var numLabel3 : iGUILabel;
@HideInInspector
var materialIcon3 : iGUIImage;
@HideInInspector
var material3Panel : iGUIPanel;
@HideInInspector
var nameLabel2 : iGUILabel;
@HideInInspector
var fillMaterialBtn2 : iGUIButton;
@HideInInspector
var numLabel2 : iGUILabel;
@HideInInspector
var materialIcon2 : iGUIImage;
@HideInInspector
var material2Panel : iGUIPanel;
@HideInInspector
var nameLabel1 : iGUILabel;
@HideInInspector
var fillMaterialBtn1 : iGUIButton;
@HideInInspector
var numLabel1 : iGUILabel;
@HideInInspector
var materialIcon1 : iGUIImage;
@HideInInspector
var material1Panel : iGUIPanel;
@HideInInspector
var materialsContainer : iGUIContainer;
@HideInInspector
var mainPanel : iGUIPanel;
@HideInInspector
var unLockInfoRoot : iGUIRoot;
//
var mLvWeight : int = 5;
private var materials_array : Array = new Array();
private var mDiamond : int = 0;
private var mLevel : int = 0;
private var mUnlockItemInfo : UnLockItemInfoClass = null;

function ExtenalInitData(unlockItemInfo : UnLockItemInfoClass, diamond : int, lv : int, materials : Array){
	mUnlockItemInfo = unlockItemInfo;
	mDiamond = diamond;
	mLevel = lv;
	materials_array = materials;
	
	StartUnlockUILogic();
}

function StartUnlockUILogic(){
	InitHouseRightInfo();
	InitLevelDiamondInfo();
	InitMaterialsUI();
	InitUnlockBtnState();
	InitFillMaterialsBtnState();
}

function Start(){
	RegistCallback();
}

function InitFillMaterialsBtnState(){
	if(IsMaterialsEnough()){
		fillMaterialsBtn.setEnabled(false);
		fillMaterialsBtn.clickCallback = null;
	}
	else{
		fillMaterialsBtn.setEnabled(true);
		fillMaterialsBtn.clickCallback = ClcikCallback_fillMaterialsBtn;
	}
}

function InitUnlockBtnState(){
	var need_lv : int = mLevel;
	var need_diamond : int = mDiamond;
	if(IsLvEnough(need_lv) && IsDiamondEnough(need_diamond) && IsMaterialsEnough()){
		unLockBtn.clickCallback = ClickCallback_unLockBtn;
		unLockBtn.style.normal.background = Resources.Load("UISkins/Textures/unlock/unlock_n") as Texture2D;
		unLockBtn.style.hover.background = Resources.Load("UISkins/Textures/unlock/unlock_h") as Texture2D;
		unLockBtn.style.active.background = Resources.Load("UISkins/Textures/unlock/unlock_n") as Texture2D;
	}
	else{
		unLockBtn.clickCallback = null;
		unLockBtn.style.normal.background = Resources.Load("UISkins/Textures/unlock/unlock_p") as Texture2D;
		unLockBtn.style.hover.background = Resources.Load("UISkins/Textures/unlock/unlock_p") as Texture2D;
		unLockBtn.style.active.background = Resources.Load("UISkins/Textures/unlock/unlock_p") as Texture2D;
	}
}

function IsMaterialsEnough() : boolean {
	for(var i:int = 0; i < materials_array.Count; ++ i){
		var mat_info : UnlockMaterialItemsClass = materials_array[i] as UnlockMaterialItemsClass;
		if(mat_info.existing_num < mat_info.num){
			return false;
		}
	}
	return true;
}

function RegistCallback(){
	closeButton.clickCallback = ClickCallback_closeConfirmBtn;
}

function ClcikCallback_fillMaterialsBtn(caller : iGUIElement){
	var all_materials_price : int = 0;
	var deta_materials : Array = new Array();
	for(var i:int = 0; i < materials_array.Count; ++ i){
		var mat_info : UnlockMaterialItemsClass = materials_array[i] as UnlockMaterialItemsClass;
		if(mat_info.material_itmid == 0 || mat_info.material_goodsid == 0){
			continue;
		}
		var existing_num : int = SelfItemLogic.getInstance().getItemNum(mat_info.material_itmid);
		var shop_row : ShopCenterRow = ResManager.LgtMgr.getShopCenterRow(mat_info.material_goodsid);
		var good_id : int = shop_row.goods_id;
		var price : int = shop_row.price;
		var num : int = mat_info.num;
		var deta_num : int = num - existing_num;
		if(deta_num > 0){
			var total_price : int = deta_num * price;
			all_materials_price += total_price;
			var user_data : goods_atom = new goods_atom();
			user_data.count = deta_num;
			user_data.goods_id = good_id;
			deta_materials.Push(user_data);
		}
	}
	FurnitureUnlockLogic.getInstance().requestFillMaterial(deta_materials);
}

function ClickCallback_unLockBtn(caller : iGUIElement){
	ClickCallback_requestRightBtn(caller);
}

function InitHouseRightInfo(){
	houseRightNamelabel.label.text = mUnlockItemInfo.name;
	var _tex : Texture2D = Resources.Load("UISkins/Textures/HouseUpdate/" + mUnlockItemInfo.icon) as Texture2D;
	houseRightImage.image = _tex;
}

function InitMaterialsUI(){
	ClearMaterialsUIInfo();
	if(materials_array.Count == 0)
		return;
	
	for(var i:int = 0; i < materials_array.Count; ++ i){
		var mat_info : UnlockMaterialItemsClass = materials_array[i] as UnlockMaterialItemsClass;
		var mat_itm_id : int = mat_info.material_itmid;
		if(mat_itm_id == 0){
			continue;
		}
		var itm_row : ItemRow = ResManager.LgtMgr.getItemRow(mat_itm_id);
		var mat_icon : String = itm_row.icon;
		var mat_imgfrm : iGUIImage = materialsContainer.items[i].items[0] as iGUIImage;
		var namelbl : iGUILabel = materialsContainer.items[i].items[3] as iGUILabel;
		var numlbl : iGUILabel = materialsContainer.items[i].items[1] as iGUILabel;
		var btn : iGUIButton = materialsContainer.items[i].items[2] as iGUIButton;
		namelbl.label.text = itm_row.name;
		var numdesc : String = mat_info.existing_num.ToString() + "/" + mat_info.num.ToString();
		numlbl.label.text = numdesc;
		if(!IsMaterialEnough(mat_info.existing_num, mat_info.num)){
			numlbl.labelColor = Color.red;
			btn.userData = mat_info;
			btn.clickCallback = ClickCallback_fillMaterialBtn;
			btn.setEnabled(true);
		}
		else{
			numlbl.labelColor = Color.white;
			btn.userData = null;
			btn.clickCallback = null;
			btn.setEnabled(false);
		}
		LoadIcon(mat_imgfrm, mat_icon);
	}
}

function IsMaterialEnough(cur_num : int, need_num : int){
	if(cur_num < need_num)
		return false;
	else
		return true;
}
function ClickCallback_fillMaterialBtn(caller : iGUIElement){
	var data : UnlockMaterialItemsClass = caller.userData as UnlockMaterialItemsClass;
	var existing_num : int = SelfItemLogic.getInstance().getItemNum(data.material_itmid);
	var shop_row : ShopCenterRow = ResManager.LgtMgr.getShopCenterRow(data.material_goodsid);
	var good_id : int = shop_row.goods_id;
	var price : int = shop_row.price;
	var num : int = data.num;
	var deta_num : int = num - existing_num;
	if(deta_num > 0){
		var total_price : int = deta_num * price;
		var user_data : goods_atom = new goods_atom();
		user_data.count = deta_num;
		user_data.goods_id = good_id;
		var mat_arr : Array = new Array();
		mat_arr.Add(user_data);
		FurnitureUnlockLogic.getInstance().requestFillMaterial(mat_arr);
	}
}

function ClearMaterialsUIInfo(){
	for(var i:int=0; i < materialsContainer.itemCount; ++ i){
		var imgfrm : iGUIImage = materialsContainer.items[i].items[0] as iGUIImage;
		var namelbl : iGUILabel = materialsContainer.items[i].items[3] as iGUILabel;
		var numlbl : iGUILabel = materialsContainer.items[i].items[1] as iGUILabel;
		var btn : iGUIButton = materialsContainer.items[i].items[2] as iGUIButton;
		btn.userData = null;
		btn.clickCallback = null;
		imgfrm.image = null;
		namelbl.label.text = "";
		numlbl.label.text = "";
	}
}

function LoadIcon(imgfrm : iGUIImage, icon : String){
	var _asynIcon : AsynIcon = new AsynIcon(function (img : Texture){imgfrm.image = img;}, null);
	_asynIcon.load("Icon/" + icon); 	
	
}

function InitLevelDiamondInfo(){
	var need_lv : int = mLevel;
	var need_diamond : int = mDiamond;
	levelLabel.label.text = Define.getContent(5198, [need_lv.ToString()]);
	diamondLabel.label.text = need_diamond.ToString();
	if(IsLvEnough(need_lv)){
		levelLabel.labelColor = Color.white;
	}
	else{
		levelLabel.labelColor = Color.red;
	}
	if(IsDiamondEnough(need_diamond)){
		diamondLabel.labelColor = Color.white;
	}
	else{
		diamondLabel.labelColor = Color.red;
	}

}

function IsLvEnough(lv : int) : boolean{
	var p_lv : int = LvExpMgr.GetInstance().GetCurLevel();
	if(p_lv >= lv){
		return true;
	}
	else{
		return false;
	}
}

function IsDiamondEnough(d : int){
	var cur_diamond : int = SelfItemLogic.getInstance().GetCurDiamond();
	if(cur_diamond >= d){
		return true;
	}
	else{
		return false;
	}
}

function ClickCallback_requestRightBtn(caller : iGUIElement){
	var need_lv : int = mLevel;
	var need_diamond : int = mDiamond;
	if(IsLvEnough(need_lv) && IsDiamondEnough(need_diamond)){
		ReqBuyHouseRight(need_lv / mLvWeight);
		ClickCallback_closeConfirmBtn(null);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.BUY_HOUSE_RIGHT));
	}
}

function ReqBuyHouseRight(grade : int){
	var req : req_buy_house_right = new req_buy_house_right();
	req.grade = grade;
	NetHelper.Send(req);
	if(grade == 6){
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.SENDMSGTOYYSUBCHANNEL), new MsgToYYParams(SENDTO_YYSUBCHANNEL_MSGTYPE.FROM_HOUSEUPDATE, "", ""));
	}
}
public function InitCommData(materials : Array){
	InitMaterialsData(materials);
	InitMaterialsUI();
}

public function InitMaterialsData(materials : Array){
	materials_array = materials;
}

function ClickCallback_closeConfirmBtn(caller : iGUIElement){
	CloseUnlockConfirmUI();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_CONFIRMWIN));
}

function HandleNotifyBuySysShopGoods(evt : GameEvent, obj : Object){
	for(var i:int = 0; i < materials_array.Count; ++ i){
		var mat_info : UnlockMaterialItemsClass = materials_array[i] as UnlockMaterialItemsClass;
		var mat_itm_id : int = mat_info.material_itmid;
		if(mat_itm_id == 0){
			continue;
		}
		mat_info.existing_num = SelfItemLogic.getInstance().getItemNum(mat_itm_id);
	}
	InitMaterialsUI();
	InitUnlockBtnState();
	InitFillMaterialsBtnState();
}

function CloseUnlockConfirmUI(){
	CloseRoot();
}

function OnDestroy(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_BUY_SYS_SHOP_GOODS), HandleNotifyBuySysShopGoods);
}

function CloseRoot(){
	UI.getUI().SetModal("UnLockInfoRoot", false);
	UI.getUI().CloseUIRoot("UnLockInfoRoot");
}