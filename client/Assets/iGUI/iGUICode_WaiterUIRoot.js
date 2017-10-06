#pragma strict
#pragma downcast
import iGUI;

private static var instance : iGUICode_WaiterUIRoot;

private var mWaiterList : Array = new Array();		//侍者头像列表
private var mWaiterArr : Array = null;				//侍者数据
private var ITEM_NUM : int = 4;					//每页个数
private var mCurPage :int = 0;						//当前页数
private var mPages :int = 0;						//总页数
private var mSelectItem : WaiterRow = null;		//选中项
private var mSelectIndex : int = 0;

private var BClickDownLeft : boolean = false;
private var BClickDownRight : boolean = false;
private var ModelRotate : boolean = false;

function Awake()
{
	instance=this;
	registEvt();
}

function Start()
{
	init();
}

static function getInstance()
{
	return instance;
}

function Update() {
	if(BClickDownLeft)
	{
		WaiterLogicCenter.GetInstance().ViewLeft();
	}
	if(BClickDownRight)
	{
		WaiterLogicCenter.GetInstance().ViewRight();
	}
	if(Input.GetMouseButtonDown(0) && !ModelRotate)
	{
		var pos : Vector3 = new Vector3(Input.mousePosition.x, Input.mousePosition.y, Input.mousePosition.z);
		var rect : Rect = modelImage.getAbsoluteRect();
		
		if(RectContainPos(rect,pos))
		{
			ModelRotate = true;
		}
	}
	if(!Input.GetMouseButton(0) && ModelRotate){
		ModelRotate = false;
	}
	if(ModelRotate)
	{
		WaiterLogicCenter.GetInstance().Rotate();
	}
}

private function RectContainPos(rect : Rect, pos : Vector3) : boolean
{
	var mouse_x : int = pos.x;
    var mouse_y : int = pos.y;
	
	if(mouse_x >= rect.x && mouse_x <= rect.x + rect.width && mouse_y >= rect.y && mouse_y <= rect.y + rect.height)
	{
		return true;
	}
	return false;
}

function init()
{
	WaiterLogicCenter.GetInstance().Init();
	
	RegistCallback();
	
	var id = WaiterLogicCenter.GetInstance().GetEmployWaiterID();
	if(id == 0)
		id = 1;
	SetSelectItem(ResManager.LgtMgr.getWaiterRow(id));
	freshWaiterList(id);
}

private function destroy()
{
	if(mWaiterList.Count != 0)
		mWaiterList.Clear();
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_WAITER_FACE), handleWaiterClick);
}

private function registEvt()
{
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_WAITER_FACE), handleWaiterClick);
}

private function RegistCallback()
{
	closeBtn.clickCallback = clickCallback_closeBtn;
	//prevPageBtn.clickCallback = ClickCallback_prevPageBtn;
	//nextPageBtn.clickCallback = ClickCallback_nextPageBtn;
	employBtn.clickCallback = ClickCallback_employBtn;
	upgradeBtn.clickCallback = ClickCallback_upgradeBtn;
	
	turnLeftBtn.clickUpCallback = CallbackMouseClickUpLeftView;
	turnLeftBtn.clickDownCallback = CallbackMouseClickDownLeftView;
	turnLeftBtn.mouseOutCallback = CallbackMouseMouseOutLeftView;
	turnRightBtn.clickUpCallback = CallbackMouseClickUpView;
	turnRightBtn.clickDownCallback = CallbackMouseClickDownView;
	turnRightBtn.mouseOutCallback = CallbackMouseMouseOutView;
	
}

/*
// 下一页
private function ClickCallback_nextPageBtn()
{
	if(mCurPage+1 <= mPages)
	{
		mCurPage++;
		getWaiterList();
	}	
}

// 前一页
private function ClickCallback_prevPageBtn()
{
	if(mCurPage-1 >=0)
	{
		mCurPage--;
		getWaiterList();
	}	
}
*/

private function clickCallback_closeBtn(caller : iGUIElement)
{	
	destroy();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLOSE_WAITERUI));
}

//雇佣按钮
private function ClickCallback_employBtn()
{
	var p_lv : int = LvExpMgr.GetInstance().GetCurLevel();
	if(p_lv < mSelectItem.player_lv)
	{
		var str : String = "需要将人物等级提升至"+ mSelectItem.player_lv + "，才能雇佣该侍者。";
		UI.getUI().OpenMsgbox("", str, true);
	}
	else
	{
		var content : String = Define.getContent(5141, [mSelectItem.employ_money.ToString()]);
		UI.getUI().OpenMsgbox("", content, "", CallbackOk_employ, "", CallbackCancel_employ);
	}
}

function CallbackOk_employ(caller : iGUIElement)
{
	RequestEmployWaiter(mSelectItem.id);
}

function CallbackCancel_employ(caller : iGUIElement)
{
}

//请求雇佣侍者
private function RequestEmployWaiter(id : int)
{
	var req : req_employ_waiter_data = new req_employ_waiter_data();
	req.waiter_id = id;
	NetHelper.Send(req);
}

//升级按钮
private function ClickCallback_upgradeBtn()
{
	//var h_lv = HouseUpdateComp.getInstance().getCurHouseRight();
	var p_lv : int = LvExpMgr.GetInstance().GetCurLevel();
	var content : String = "";
	if(mSelectItem.up_id == 0)
	{
		content = "侍从当前已经达到等级上限，无法升级。";
		UI.getUI().OpenMsgbox("", content, true);
	}
	else
	{
		if(p_lv < mSelectItem.up_house_lv)
		{
			content = Define.getContent(589, [mSelectItem.up_house_lv.ToString()]);
			UI.getUI().OpenMsgbox("", content, true);
		}
		else
		{
			content = Define.getContent(5141, [mSelectItem.up_coin.ToString()]);
			UI.getUI().OpenMsgbox("", content, "", CallbackOk_upgrade, "", CallbackCancel_upgrade);
		}
	}	
}

function CallbackOk_upgrade(caller : iGUIElement)
{
	RequestUpWaiter(mSelectItem.id);
}

function CallbackCancel_upgrade(caller : iGUIElement)
{
}

//请求升级侍者
private function RequestUpWaiter(id : int)
{
	var req : req_up_waiter_data = new req_up_waiter_data();
	req.waiter_id = id;
	NetHelper.Send(req);
}

private function CallbackMouseClickUpLeftView(callback : iGUIElement) {
	BClickDownLeft = false;
}

private function CallbackMouseClickDownLeftView(callback : iGUIElement) {
	BClickDownLeft = true;
}

private function CallbackMouseMouseOutLeftView(callback : iGUIElement) {
	BClickDownLeft = false;
}

private function CallbackMouseClickUpView(callback : iGUIElement) {
	BClickDownRight = false;
}

private function CallbackMouseClickDownView(callback : iGUIElement) {
	BClickDownRight = true;
}

private function CallbackMouseMouseOutView(callback : iGUIElement) {
	BClickDownRight = false;
}

//生成侍者头像列表
public function freshWaiterList()
{
	mWaiterArr = WaiterLogicCenter.GetInstance().GetWaiterArr();

	if(mSelectIndex >= 0)
	{
		mSelectItem = mWaiterArr[mSelectIndex];
		freshWaiterList(mSelectItem.id);
	}
}

public function freshWaiterList(selectID : int)
{	
	mWaiterArr = WaiterLogicCenter.GetInstance().GetWaiterArr();
	
	mWaiterList.Clear();
	var isOutOfList : boolean = true;	//选中项在当前页中
	
	for(var i:int = 0;i < ITEM_NUM; i++)
	{
		var element : iGUIElement[] = getItemCtrl(i+1);
		var data : WaiterRow = mWaiterArr[i];
		element[0].userData = i;
		element[1].userData = data;
		
		if(selectID != 0)
		{
			
			if(data.id == selectID)
			{
				mSelectIndex = i;
				isOutOfList = false;
			}
		}
		mWaiterList.Add(new WaiterItem(element[0],element[1],priceText,nameText,levelText,specialityText,descriptionText,false));
	}
	
	if(selectID == 0 || isOutOfList)
	{
		var tmpItem = mWaiterList[0] as WaiterItem;
		tmpItem.setSelect(true);
		SetSelectItem(tmpItem.getData());
	}
	else
	{
		tmpItem = mWaiterList[mSelectIndex] as WaiterItem;
		tmpItem.setSelect(true);
		SetSelectItem(tmpItem.getData());
	}
	SetItemContent();
}

//获取物品控件
private function getItemCtrl(index:int) : iGUIElement[]
{
	switch(index){
		case 1:
			return [item_slot1,item_image1];
		case 2:
			return [item_slot2,item_image2];
		case 3:
			return [item_slot3,item_image3];
		case 4:
			return [item_slot4,item_image4];
		default:
			return [item_slot4,item_image4];					
	}
}

// 点击侍者头像回调
private function handleWaiterClick(evt : GameEvent, obj : Object)
{
	mSelectIndex = obj;
	SetSelectItem(mWaiterArr[mSelectIndex]);
	
	for(var i : int =0; i < ITEM_NUM; i++)
	{
		var row : WaiterItem = mWaiterList[i];
		if(row.getData().id != mSelectItem.id)
		{
			row.setSelect(false);
		}
		else
		{
			SetItemContent();
		}
	}
}

private function SetItemContent()
{
	var id : int = WaiterLogicCenter.GetInstance().GetEmployWaiterID();	
	if(id == mSelectItem.id)
	{
		employBtn.passive = true;
		priceLabel.label.text = "正在雇佣中";
		aibImage.enabled = false;
		priceText.enabled = false;
	}
	else
	{
		employBtn.passive = false;
		priceLabel.label.text = "每次雇佣都需花费";
		aibImage.enabled = true;
		priceText.enabled = true;
	}
	if(mSelectItem.up_id == 0)
		upgradeBtn.passive = true;
	else
		upgradeBtn.passive = false;		
	priceText.label.text = "" + mSelectItem.employ_money;
	nameText.label.text = mSelectItem.waiter_name;
	levelText.label.text = "" +mSelectItem.waiter_lv;
	specialityText.label.text = mSelectItem.speciality_explain;
	descriptionText.label.text = mSelectItem.explain;
	WaiterLogicCenter.GetInstance().CreateWaiter(mSelectItem.id);
}

public function SetSelectItem(item : WaiterRow)
{
	mSelectItem = item;
}

public function GetSelectIndex() : int
{
	return mSelectIndex;
}

@HideInInspector
var modelImage : iGUIImage;

@HideInInspector
var turnLeftBtn : iGUIButton;
@HideInInspector
var turnRightBtn : iGUIButton;

@HideInInspector
var prevPageBtn : iGUIButton;
@HideInInspector
var nextPageBtn : iGUIButton;

@HideInInspector
var waiterMainPanel : iGUIPanel;
@HideInInspector
var waitUIRoot : iGUIRoot;
@HideInInspector
var closeBtn : iGUIButton;
@HideInInspector
var waiterFacePanel : iGUIPanel;
@HideInInspector
var employBtn : iGUIButton;
@HideInInspector
var upgradeBtn : iGUIButton;
@HideInInspector

var priceLabel : iGUILabel;
@HideInInspector
var priceText : iGUILabel;

@HideInInspector
var descriptionLabel : iGUILabel;
@HideInInspector
var descriptionText : iGUILabel;

@HideInInspector
var nameLabel : iGUILabel;
@HideInInspector
var nameText : iGUILabel;
@HideInInspector

var levelLabel : iGUILabel;
@HideInInspector
var levelText : iGUILabel;

@HideInInspector
var specialityLabel : iGUILabel;
@HideInInspector
var specialityText : iGUILabel;

@HideInInspector
var aibImage : iGUIImage;

@HideInInspector
var faceListPanel : iGUIPanel;
@HideInInspector
var waiterInfoPanel : iGUIPanel;
@HideInInspector
var waiterModelPanel : iGUIPanel;
@HideInInspector
var titleImage : iGUIImage;
@HideInInspector
var selectWaiterImage : iGUIImage;

@HideInInspector
var tipsLabel : iGUILabel;


@HideInInspector
var item_select : iGUILabel;

@HideInInspector
var item_image1 : iGUIImage;
@HideInInspector
var item_slot1 : iGUIPanel;
@HideInInspector
var item_image2 : iGUIImage;
@HideInInspector
var item_slot2 : iGUIPanel;
@HideInInspector
var item_image3 : iGUIImage;
@HideInInspector
var item_slot3 : iGUIPanel;
@HideInInspector
var item_image4 : iGUIImage;
@HideInInspector
var item_slot4 : iGUIPanel;