#pragma strict

import iGUI;


@HideInInspector
var BarCntrProduceUIRoot : iGUIRoot;
@HideInInspector
var BarCntrPanel : iGUIPanel;
@HideInInspector
var ContainerPanel : iGUIPanel;
@HideInInspector
var Item1 : iGUIImage;
@HideInInspector
var Item2 : iGUIImage;
@HideInInspector
var Item3 : iGUIImage;
@HideInInspector
var Item4 : iGUIImage;
@HideInInspector
var Item5 : iGUIImage;
@HideInInspector
var DiamondImg : iGUIImage;
@HideInInspector
var  ItemCount1 : iGUILabel;
@HideInInspector
var  ItemCount2 : iGUILabel;
@HideInInspector
var  ItemCount3 : iGUILabel;
@HideInInspector
var  ItemCount4 : iGUILabel;
@HideInInspector
var  ItemCount5 : iGUILabel;
@HideInInspector
var CloseBtn  : iGUIButton;
@HideInInspector
var UnlockBtn : iGUIButton;
@HideInInspector
var SupplyStuffBtn1  : iGUIButton;
@HideInInspector
var SupplyStuffBtn2  : iGUIButton;
@HideInInspector
var SupplyStuffBtn3  : iGUIButton;
@HideInInspector
var SupplyStuffBtn4  : iGUIButton;
@HideInInspector
var SupplyAllStuffBtn  : iGUIButton;

// 要升级的酒槽ID
private var mUpgradeID : int = 0;
// 升级酒槽的数据
private var mBarCntrInfo : BarCntrProductInfoRow = null;
// 食品表格管理器 
private var mBartenderTablesMgr : BartenderSysTablesMgr = null;

// 判断解锁按钮状态条件(材料和水晶币是否满足)
private var bFulfilStuff1  : boolean = false;
private var bFulfilStuff2  : boolean = false;
private var bFulfilStuff3  : boolean = false;
private var bFulfilStuff4  : boolean = false;
private var bFulfilDiamond : boolean = false;

private static var instance : iGUICode_BarCntrProduceUI;


function Awake(){
	instance=this;
	registLocalEvent();
}
function Start(){  
	registCtrlsCallback();

   if(!mBartenderTablesMgr)
   {  
      mBartenderTablesMgr = BartenderSys.getInstance().getBartenderSysTableMgr();
   }
  
   // 生成面板数据
   CreatePanelData();
     
   // 设置相关数据
   SupplyStuffBtn1.userData = 1;
   SupplyStuffBtn2.userData = 2;
   SupplyStuffBtn3.userData = 3;
   SupplyStuffBtn4.userData = 4;
   SupplyAllStuffBtn.userData = 5;
}

static function getInstance(){
	return instance;
}

// 回调函数
function registCtrlsCallback(){
	CloseBtn.clickCallback = ClickCallback_closePanelBtn;
	UnlockBtn.clickCallback = ClickCallback_UnlockBtn;
	SupplyStuffBtn1.clickCallback = ClickCallback_SupplyStuffBtn;
	SupplyStuffBtn2.clickCallback = ClickCallback_SupplyStuffBtn;
	SupplyStuffBtn3.clickCallback = ClickCallback_SupplyStuffBtn;
	SupplyStuffBtn4.clickCallback = ClickCallback_SupplyStuffBtn;
	SupplyAllStuffBtn.clickCallback = ClickCallback_SupplyStuffBtn;    
	
	// 鼠标进入和离开悬浮信息
	Item1.mouseOverCallback = MouseOverCallback_ItemImg;
	Item2.mouseOverCallback = MouseOverCallback_ItemImg;
	Item3.mouseOverCallback = MouseOverCallback_ItemImg;
	Item4.mouseOverCallback = MouseOverCallback_ItemImg;
	Item1.mouseOutCallback = MouseOutCallback_ItemImg;
	Item2.mouseOutCallback = MouseOutCallback_ItemImg;
	Item3.mouseOutCallback = MouseOutCallback_ItemImg;
	Item4.mouseOutCallback = MouseOutCallback_ItemImg;
}


// 注册UI事件
function registLocalEvent(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_SUPPLY_STUFF_BTN), HandleSupplyStuffs);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_UNLOCK_BARCONTAIN_BTN), HandleUnlockBarContain);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_BUY_SYS_SHOP_GOODS), HandleBuySysShopGoods);
}
// 取消UI事件注册
function unRegistLocalEvent(){
    EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_SUPPLY_STUFF_BTN), HandleSupplyStuffs);
    EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_UNLOCK_BARCONTAIN_BTN), HandleUnlockBarContain);
    EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_BUY_SYS_SHOP_GOODS), HandleBuySysShopGoods);
}


// 关闭面板
function ClickCallback_closePanelBtn(caller : iGUIElement){
	destroy();
	closeUIRoot();
}

function ClickCallback_SupplyStuffBtn(caller : iGUIElement){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_SUPPLY_STUFF_BTN), caller);
}

function ClickCallback_UnlockBtn(caller : iGUIElement){
    EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_UNLOCK_BARCONTAIN_BTN), caller);
}

// 购买商品事件
private function HandleBuySysShopGoods(evt : GameEvent, obj : System.Object){
    // 更新物品数据
    UpdateNum();
}

function destroy(){
    mUpgradeID = 0;
    mBarCntrInfo = null;
    mBartenderTablesMgr = null;
	unRegistLocalEvent();
}

function closeUIRoot(){
	UI.getUI().SetModal("BarCntrProduceUI", false);
	UI.getUI().CloseUIRoot("BarCntrProduceUI");
}

// 设置要解锁的酒槽格子ID
public function setUnlockBarCntrID(upgradeID : int){
   mUpgradeID = upgradeID + 1; 
}

// 补冲所需材料
function HandleSupplyStuffs(evt : GameEvent, obj : Object){  
    var clickBtn : iGUIButton = obj as iGUIButton;
    var flag : int = clickBtn.userData;
   
    // 角色拥有的物品数量
    var curNum : int;
    // 升级酒槽需要的物品数量
    var needNum : int;
    // 升级酒槽需要的物品ID
    var itemID : int;
    // 升级需要物品对应当商品ID
    var goodID : int;
    
    // 购买的商品数组
    var mat_arr : Array = new Array();
    mat_arr.clear();
    for(var i = 0; i< mBarCntrInfo.need_item_ids.Count; ++i)
    {
        if(flag == 1 && (i+1) == flag)
        {
           needNum = mBarCntrInfo.need_item_cnts[i];
	       itemID = mBarCntrInfo.need_item_ids[i];
	       goodID = mBarCntrInfo.need_shop_ids[i];
	       curNum = SelfItemLogic.getInstance().getItemNum(itemID);
	       if(curNum < needNum)
		   {   
		       // 向服务器请求爱币购买材料
		       BuyGoods(curNum, needNum, goodID);
	       }  
	           
	       break;
        }
        else if(flag == 2 && (i+1) == flag)
        {
           needNum = mBarCntrInfo.need_item_cnts[i];
	       itemID = mBarCntrInfo.need_item_ids[i];
	       goodID = mBarCntrInfo.need_shop_ids[i];
	       curNum = SelfItemLogic.getInstance().getItemNum(itemID);
	       if(curNum < needNum)
		   {   
		       // 向服务器请求爱币购买材料
		       BuyGoods(curNum, needNum, goodID);
	       }
	          
	       break;
        }
        else if(flag == 3 && (i+1) == flag)
        {
           needNum = mBarCntrInfo.need_item_cnts[i];
	       itemID = mBarCntrInfo.need_item_ids[i];
	       goodID = mBarCntrInfo.need_shop_ids[i];
	       curNum = SelfItemLogic.getInstance().getItemNum(itemID);
	       if(curNum < needNum)
		   {   
		       // 向服务器请求爱币购买材料
		       BuyGoods(curNum, needNum, goodID);
	       }
		   
	       break;
        }
        else if(flag == 4 && (i+1) == flag)
        {
           needNum = mBarCntrInfo.need_item_cnts[i];
	       itemID = mBarCntrInfo.need_item_ids[i];
	       goodID = mBarCntrInfo.need_shop_ids[i];
	       curNum = SelfItemLogic.getInstance().getItemNum(itemID);
	       if(curNum < needNum)
		   {   
		       // 向服务器请求爱币购买材料
		       BuyGoods(curNum, needNum, goodID);
	       }
	       
	       break;
        }
        else if(flag == 5)
        {
           needNum = mBarCntrInfo.need_item_cnts[i];
	       itemID = mBarCntrInfo.need_item_ids[i];
	       goodID = mBarCntrInfo.need_shop_ids[i];
	       curNum = SelfItemLogic.getInstance().getItemNum(itemID);
	       if(curNum < needNum)
		   {   
		       // 向服务器请求爱币购买材料
		       var market : goods_atom = new goods_atom();
			   market.goods_id = goodID;
			   market.count = needNum - curNum;
			   mat_arr.Add(market);
	       }
        }
    }	
    
    // 购买缺失的全部材料
    if(flag == 5)		
    {
	    FurnitureUnlockLogic.getInstance().requestFillMaterial(mat_arr);	
    }	
}

private function showLabelUI(btnFlg: int, labelStr : String, colorStr : Color, bFulfil : boolean){
   switch(btnFlg)
   {
      case 1:
      ItemCount1.label.text = labelStr;
      ItemCount1.labelColor = colorStr;
      bFulfilStuff1 = bFulfil;
      if(bFulfil)
      {
          SupplyStuffBtn1.setEnabled(false);
      }
      else
      {
          SupplyStuffBtn1.setEnabled(true);
      }
      break;
      case 2:
      ItemCount2.label.text = labelStr;
      ItemCount2.labelColor = colorStr;
      bFulfilStuff2 = bFulfil;
      if(bFulfil)
      {
          SupplyStuffBtn2.setEnabled(false);
      }
      else
      {
          SupplyStuffBtn2.setEnabled(true);;
      }
      break;
      case 3:
      ItemCount3.label.text = labelStr;
      ItemCount3.labelColor = colorStr;
      bFulfilStuff3 = bFulfil;
      if(bFulfil)
      {
          SupplyStuffBtn3.setEnabled(false);;
      }
      else
      {
          SupplyStuffBtn3.setEnabled(true);;
      }
      break;
      case 4:
      ItemCount4.label.text = labelStr;
      ItemCount4.labelColor = colorStr;
      bFulfilStuff4 = bFulfil;
      if(bFulfil)
      {
          SupplyStuffBtn4.setEnabled(false);;
      }
      else
      {
          SupplyStuffBtn4.setEnabled(true);;
      }
      break;
   }
}

// 解锁
function HandleUnlockBarContain(evt : GameEvent, obj : Object){
    if(!mUpgradeID)
    {
	    return;
    }
    
    iGUISmartPrefab_shakingPanel.getInstance().reqExpandProduceArea(mUpgradeID - 1);
    
    // 解锁后关闭面板
    destroy();
	closeUIRoot();
}

// 创建升级酒槽数据
public function CreatePanelData(){  
    if(!mUpgradeID)
    {
       return;
    }
    
    
    var barCntrInfo : BarCntrProductInfoRow = null;
    var barCntrList : ArrayList = mBartenderTablesMgr.getBarCntrProductInfoTable();   
    for(var i : int = 0; i < barCntrList.Count; ++i)
    {
        barCntrInfo =  barCntrList[i] as BarCntrProductInfoRow;
        if(mUpgradeID == barCntrInfo.upgrade_id)
        {
            mBarCntrInfo = barCntrInfo;
            CreateUIData();
            return;
        }      
    }
} 

private function CreateUIData(){
    if(mBarCntrInfo)
    {
		// 角色拥有的物品数量
	    var curNum : int;
	    // 升级酒槽需要的物品数量
	    var needNum : int;
	    // 升级酒槽需要的物品ID
	    var itemID : int;
	    // 物品图标
	    var imageStr : String;
	    // 物品名字
	    var itemName : String;
	    
	    var imageFlag : String;
	    for(var i : int = 0; i < mBarCntrInfo.need_item_ids.Count; ++i)
	    {
	       needNum = mBarCntrInfo.need_item_cnts[i];
	       itemID = mBarCntrInfo.need_item_ids[i];
	       imageStr = ResManager.LgtMgr.getItemRow(itemID).icon;
	       //itemName = ResManager.LgtMgr.getItemRow(itemID).name;
	       itemName = ResManager.LgtMgr.getItemDescription(ResManager.LgtMgr.getItemRow(itemID).upgrade_id);
	       curNum = SelfItemLogic.getInstance().getItemNum(itemID);
	       
	       ShowUIData(i+1, curNum, needNum, imageStr, itemName);
	    }
	    
	    // 玩家拥有的水晶币
	    var curDiamond  : int = SelfItemLogic.getInstance().GetCurDiamond();
	    // 升级需要的水晶币
	    var needDiamond : int = mBarCntrInfo.need_diamond;
	    if(curDiamond < needDiamond)
	    {
	       ItemCount5.labelColor = Color.red;
	       bFulfilDiamond = false;
	    }
	    else
	    {
	       ItemCount5.labelColor = Color.white;
	       bFulfilDiamond = true;
	    }
	    // 显示升级需要的水晶币数量
	    ItemCount5.label.text = needDiamond.ToString();
	    
	    // 解锁按钮状态
	    ShowUnlockBtnState();
    }
}


private function ShowUIData(number : int, curNum : int, needNum : int, image : String, name : String){	
	switch(number)
	{
	case 1:
       // 显示物品图标
       BartenderSys.getInstance().loadIcon(Item1, image);
       Item1.userData = name;
	   break;
	case 2:   
       BartenderSys.getInstance().loadIcon(Item2, image); 
       Item2.userData = name;    
	   break;
	case 3:
       BartenderSys.getInstance().loadIcon(Item3, image);
       Item3.userData = name;
	   break;
	case 4:
       BartenderSys.getInstance().loadIcon(Item4, image);
       Item4.userData = name;
	   break;
	}
	
   var colorStr : Color;
   // 材料是否满足
   var bFulfil : boolean;
   if(curNum < needNum)
   {
      colorStr = Color.red;
      bFulfil = false;
   }
   else
   {
      colorStr = Color.white;
      bFulfil = true;
   }
	var labelStr : String = curNum.ToString() + "/" + needNum.ToString();
	// 显示标签信息
	showLabelUI(number, labelStr, colorStr, bFulfil);
}

private function ShowUnlockBtnState(){
    if(bFulfilStuff1 && bFulfilStuff2 && bFulfilStuff3 && bFulfilStuff4)
    {
        SupplyAllStuffBtn.setEnabled(false);
        
        if(bFulfilDiamond)
		{
		   UnlockBtn.passive = false;
		}
		else
		{
		   UnlockBtn.passive = true;
		} 	
    }  
    else
    {	
       UnlockBtn.passive = true;
       SupplyAllStuffBtn.setEnabled(true);
    }  
}

// 更新拥有的材料数据
private function UpdateNum(){
    var curNum   : int;
    var needNum  : int;
    var itemID   : int;
    var labelStr : String; 
    for(var i : int = 0; i < mBarCntrInfo.need_item_ids.Count; ++i)
    {
       needNum  = mBarCntrInfo.need_item_cnts[i];
       itemID   = mBarCntrInfo.need_item_ids[i];
       curNum   = SelfItemLogic.getInstance().getItemNum(itemID);
       if(curNum >= needNum)
       {
		   labelStr = curNum.ToString() + "/" + needNum.ToString();
           showLabelUI(i+1, labelStr, Color.white, true);    
       }
    }    
    // 解锁按钮状态
	ShowUnlockBtnState();   
}

// 购买单件商品
private function BuyGoods(curNum : int, needNum : int, goodID : int){
    var mat : goods_atom = new goods_atom();
    var mat_arr : Array = new Array();
    mat_arr.clear();
	mat.goods_id = goodID;
    mat.count = needNum - curNum;
    mat_arr.Add(mat);
    FurnitureUnlockLogic.getInstance().requestFillMaterial(mat_arr);
}

private function MouseOverCallback_ItemImg(caller : iGUIElement){
    var itemName : String  = caller.userData;

    Global.GetSysTooltip().Begin(caller);
	Global.GetSysTooltip().Add(GUIContent(itemName), BartenderHintStyles.instance.upgradeFoodStyle);
	Global.GetSysTooltip().Show(true, 0, 50);
}

private function MouseOutCallback_ItemImg(caller : iGUIElement){
}
