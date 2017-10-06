import iGUI;

private static var instance : iGUICode_NewHandTaskRewardUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var ok_btn : iGUIButton;
@HideInInspector
var item_count3 : iGUILabel;
@HideInInspector
var item_icon3 : iGUILabel;
@HideInInspector
var item_count2 : iGUILabel;
@HideInInspector
var item_icon2 : iGUILabel;
@HideInInspector
var item_count1 : iGUILabel;
@HideInInspector
var item_icon1 : iGUILabel;
@HideInInspector
var tip_label3 : iGUILabel;
@HideInInspector
var exp_label : iGUILabel;
@HideInInspector
var exp_icon : iGUILabel;
@HideInInspector
var diamond_label : iGUILabel;
@HideInInspector
var diamond_icon : iGUILabel;
@HideInInspector
var tip_label2 : iGUILabel;
@HideInInspector
var describe_label : iGUILabel;
@HideInInspector
var tip_label1 : iGUILabel;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;


private var SLOT_NUM : int = 3;
private var mSlotArray : Array = new Array();

function Start() {
	ok_btn.clickCallback = ClickCallback_ok_btn;
}

function OnDestroy() {
	for (var slot : NewHandTaskRewardSlot in mSlotArray) {
		slot.setContent(0, 0);
	}
	mSlotArray.Clear();
}

function ClickCallback_ok_btn(caller : iGUIElement) : void {
	UI.getUI().SetModal("NewHandTaskRewardUI", false);
	UI.getUI().CloseUIRoot("NewHandTaskRewardUI");
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_CLOSE_NEW_HAND_TASK_REAWARD_UI));
}

public function init(taskId : int) : void {
	for (var i:int=0; i<SLOT_NUM; ++i) {
		var elems : iGUIElement[] = getItemControl(i);
		mSlotArray.Add(new NewHandTaskRewardSlot(elems[0], elems[1]));
	}
	//
	var row : PlayerTaskRow = ResManager.LgtMgr.getPlayerTaskRow(taskId);
	describe_label.label.text = row.target1;
	diamond_label.label.text = row.diamond.ToString();
	exp_label.label.text = row.experience.ToString();
	for (var j:int = 0; j<row.reward_items.Count; ++j) {
		var itemId : int = row.reward_items[j];
		var itemCount : int = row.reward_items_count[j];
		setItemContent(j, itemId, itemCount);
	}
}

private function setItemContent(index : int, id : int, count : int) : void {
	if (index >= mSlotArray.Count) {
		return;
	}
	(mSlotArray[index] as NewHandTaskRewardSlot).setContent(id, count);
}

private function getItemControl(index : int) : iGUIElement[] {
	if (0 == index) return [item_icon1, item_count1];
	if (1 == index) return [item_icon2, item_count2];
	// 2 == index
	return [item_icon3, item_count3];
}




class NewHandTaskRewardSlot {
	private var mItemIcon : iGUILabel = null;
	private var mItemCount : iGUILabel = null;
	private var mItemRow : ItemRow = null;
	private var mAsynIcon : AsynIcon = null;
	
	public function NewHandTaskRewardSlot(itemIcon : iGUILabel, itemCount : iGUILabel) {
		mItemIcon = itemIcon;
		mItemCount = itemCount;
		mAsynIcon = new AsynIcon(setTexture, Resources.Load("UISkins/Textures/Common1/icon_loading_01"));
		itemIcon.mouseOverCallback = MouseOverCallback_itemIcon;
		setContent(0, 0);
	}
	
	public function setContent(itemId : int, count : int) : void {
		if (0 == itemId) {
			setVisible(false);
			mAsynIcon.cancel();
			setTexture(null);
			mItemRow = null;
			return;
		}
		mItemRow = ResManager.LgtMgr.getItemRow(itemId);
		mAsynIcon.load("Icon/" + mItemRow.icon);
		mItemCount.label.text = count.ToString();
		setVisible(true);
	}
	
	private function setTexture(tex : Texture) : void {
		mItemIcon.style.normal.background = tex;
	}
	
	private function setVisible(visible : boolean) : void {
		mItemIcon.setEnabled(visible);
		mItemCount.setEnabled(visible);
	}
	
	private function MouseOverCallback_itemIcon(caller : iGUIElement) : void {
		if (null == mItemRow) {
			return;
		}
		ItemHint.ShowPackItemHint(caller, mItemRow, true);
	}
}

