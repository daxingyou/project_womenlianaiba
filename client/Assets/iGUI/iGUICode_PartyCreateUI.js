#pragma strict
#pragma downcast
import iGUI;

class PartyCreatIcon extends PlatResInfoCtrl {
	public var imageElement : iGUILabel;
	public var nameElement : iGUILabel;
	
	//overwrite
	public function Callback() {
		if(URLValid) {
			imageElement.style.normal.background = image;
		} else {
			imageElement.style.normal.background = Resources.Load("UISkins/Textures/Common1/default_avatar");
		}
		nameElement.label.text = Global.limitTextLength(info.nickname, 4, Define.unknow, "...");
	}
}

private static var instance : iGUICode_PartyCreateUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}

@HideInInspector
var delFood_btn : iGUIButton;
@HideInInspector
var foodLevel_img : iGUIImage;
@HideInInspector
var select_cover_img : iGUIImage;
@HideInInspector
var selectFood_img : iGUIImage;
@HideInInspector
var selete_food_lab : iGUILabel;
@HideInInspector
var cancel_btn : iGUIButton;
@HideInInspector
var create_btn : iGUIButton;
@HideInInspector
var tip_label4 : iGUILabel;
@HideInInspector
var describe_input_label : iGUITextarea;
@HideInInspector
var describe_label : iGUILabel;
@HideInInspector
var title_input_label : iGUITextfield;
@HideInInspector
var title_label : iGUILabel;
@HideInInspector
var type_select_list : iGUIDropDownList;
@HideInInspector
var type_label : iGUILabel;
@HideInInspector
var house_label : iGUILabel;
@HideInInspector
var player_label : iGUILabel;
@HideInInspector
var tip_label3 : iGUILabel;
@HideInInspector
var photo_icon : iGUILabel;
@HideInInspector
var tip_label2 : iGUILabel;
@HideInInspector
var close_btn : iGUIButton;
@HideInInspector
var tip_label1 : iGUILabel;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;



private var mImageLoader : PlatResLoader = null;
//--------------------------------------------------
function Start()
{
	// 界面事件注册
	close_btn.clickCallback              = ClickCallback_close_btn;
	create_btn.clickCallback             = ClickCallback_create_btn;
	cancel_btn.clickCallback             = ClickCallback_close_btn;
	delFood_btn.clickCallback            = ClickCallback_delFood_btn; // alter by zlj 删除派对食物按钮
	selectFood_img.clickCallback         = ClickCallback_select_food_btn; // 选择食物
	type_select_list.valueChangeCallback = ValueChangeCallback_type_select_list;
	// 其他初始操作
	init();
}
//--------------------------------------------------
function OnDestroy()
{
	mImageLoader.Cancel();
}
//--------------------------------------------------
function ClickCallback_close_btn(caller : iGUIElement)
{
	closePartyCreateUI();
	Party.Ctrl.Excute("OPEN_PARTY_UI", false);
}
//--------------------------------------------------
function ClickCallback_create_btn(caller : iGUIElement)
{
	var type : int = type_select_list.selectedIndex + 1;
	var title : String = title_input_label.value;
	var describe : String = describe_input_label.value;
	// 条件判断
	if (0 == type)						// 没有选择派对类型
	{
		UI.getUI().OpenMsgbox("", Define.getContent(5186), true);
		return;
	}
	if (""==title || ""==describe)		// 派对标题或派对描述内容为空
	{
		UI.getUI().OpenMsgbox("", Define.getContent(5187), true);
		return;
	}
	// 保存派对相关信息
	Party.Ctrl.Set("party_type", type);
	Party.Ctrl.Set("party_title", title);
	Party.Ctrl.Set("party_describe", describe);
	//
	iGUICode_PartyPropSelectUI.getInstance().ClickCallback_create_btn(caller);
}
//--------------------------------------------------
function ValueChangeCallback_type_select_list(caller : iGUIElement)
{
	var content : String = "";
	switch ((caller as iGUIDropDownList).selectedIndex)
	{
	case 0:						// 普通派对
		content = Define.getContent(5188);
		break;
	case 1:						// 私人派对
		content = Define.getContent(5189);
		break;	
	}
	type_label.label.text = content;
}
//--------------------------------------------------
private function init() : void
{
	// 头像和名字控件
	var image : PartyCreatIcon = new PartyCreatIcon();
	image.imageElement = photo_icon;
	image.nameElement = player_label;
	mImageLoader = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(ScenePlayerMgr.getMainPlayerAccount(), image);
	// 其他控件
	house_label.label.text = Global.limitTextLength(DataCenter.getSelfHouseData().name, 6, "", "...");
	type_select_list.selectedIndex = 0;					// -1:默认没有选择派对类型,0:默认选择普通派对
	type_label.label.text = Define.getContent(5188);	// 默认派对描述
	var money : int = Party.Ctrl.Get("create_need_money");
	tip_label4.label.text = tip_label4.label.text.Replace("{0}", money.ToString());
	
	// alter by zlj 打开派对食物背包
    UI.getUI().OpenUIRoot("PartyPackUI");
	UI.getUI().SetModal("PartyPackUI", false);
	iGUICode_PartyPackUI.getInstance().SetPosition(frame.positionAndSize.x + frame.positionAndSize.width, frame.positionAndSize.y);
}
//--------------------------------------------------
public function closePartyCreateUI() : void
{
	UI.getUI().SetModal("PartyCreateUI", false);
	UI.getUI().CloseUIRoot("PartyCreateUI");
	//UI.getUI().CloseUIRoot("PartyPropSelectUI"); // alter by zlj 
	if(iGUICode_PartyPackUI.getInstance())
	{
	   iGUICode_PartyPackUI.getInstance().ClosePartyPackUI();
	}
	selectFood_img.userData = null;
    selectFood_img.image    = null;
	//foodLevel_img.image     = null;
	
}
//--------------------------------------------------


// add by zlj 
// 选择食物按钮回调函数
private function ClickCallback_select_food_btn(caller : iGUIElement)
{
     if(!iGUICode_PartyPackUI.getInstance())
     {
	     UI.getUI().OpenUIRoot("PartyPackUI");
	     UI.getUI().SetModal("PartyPackUI", false);
	     iGUICode_PartyPackUI.getInstance().SetPosition(frame.positionAndSize.x + frame.positionAndSize.width, frame.positionAndSize.y);
     }
}

// 删除食物按钮回调
private function ClickCallback_delFood_btn(caller : iGUIElement)
{
    if(selectFood_img.image != null )
    {
        selectFood_img.userData = 0;
	    selectFood_img.image    = null;
	    //foodLevel_img.image     = null;
    }
}

// 设置派对食物背景
public function SetSelFoodBg(foodID : int, level : int, icon : String)
{   
    // 忽略鼠标事件
    foodLevel_img.ignoreClicks    = true;
	foodLevel_img.ignoreMouseOver = true; 
	
	selectFood_img.userData = foodID;
	if(foodID == 0)
	{
	   //foodLevel_img.image  = null;
	   selectFood_img.image = null;
	}
	else
	{
	   BartenderSys.getInstance().loadIcon(selectFood_img, icon);
	   // 食物等级图标
//	   if(level > 0)
//	   {
//		   var imgName : String = "food_lv" + level.ToString();
//		   foodLevel_img.image  = Resources.Load("UISkins/Textures/cookbook/" + imgName); 
//	   }
	}
}

// 创建派对食物类型ID
public function GetPartyFoodID() : int
{
    return selectFood_img.userData;
}

