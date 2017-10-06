import iGUI;

@HideInInspector
var upgradeFoodRoot : iGUIRoot;
@HideInInspector
var upgradeFoodPanel : iGUIPanel;
@HideInInspector
var foodPanel : iGUIPanel;
@HideInInspector
var foodNameLab : iGUILabel;
@HideInInspector
var foodImg : iGUIImage;
@HideInInspector
var heartImg1 : iGUIImage;
@HideInInspector
var heartImg2 : iGUIImage;
@HideInInspector
var heartImg3 : iGUIImage;
@HideInInspector
var heartImg4 : iGUIImage;
@HideInInspector
var heartImg5 : iGUIImage;
@HideInInspector
var heartImg6 : iGUIImage;
@HideInInspector
var heartImg7 : iGUIImage;
@HideInInspector
var curLab : iGUILabel;
@HideInInspector
var curLevLab : iGUILabel;
@HideInInspector
var nextLab : iGUILabel;
@HideInInspector
var nextLevLab : iGUILabel;
@HideInInspector
var earnLab : iGUILabel;
@HideInInspector
var earnDiamondImg : iGUIImage;
@HideInInspector
var curPriceLab : iGUILabel;
@HideInInspector
var nextIconLab : iGUILabel;
@HideInInspector
var nextPriceLab : iGUILabel;
@HideInInspector
var needDiamondLab : iGUILabel;
@HideInInspector 
var needDiamondImg : iGUIImage;
@HideInInspector
var consumeLab : iGUILabel;
@HideInInspector
var decorationLab : iGUILabel;
@HideInInspector
var needDecLab : iGUILabel;
@HideInInspector
var stuffPanel : iGUIPanel;
@HideInInspector
var stuffLab : iGUILabel;
@HideInInspector
var fulillBtn : iGUIButton;
@HideInInspector
var stuffImg1 : iGUIImage;
@HideInInspector
var stuffImg2 : iGUIImage;
@HideInInspector
var stuffImg3 : iGUIImage;
@HideInInspector
var stuffImg4 : iGUIImage;
@HideInInspector
var coverLab1 : iGUILabel;
@HideInInspector
var coverLab2 : iGUILabel;
@HideInInspector
var coverLab3 : iGUILabel;
@HideInInspector
var coverLab4 : iGUILabel;
@HideInInspector
var stuffNumLab1 : iGUILabel;
@HideInInspector
var stuffNumLab2 : iGUILabel;
@HideInInspector
var stuffNumLab3 : iGUILabel;
@HideInInspector
var stuffNumLab4 : iGUILabel;
@HideInInspector
var closeBtn : iGUIButton;
@HideInInspector
var infoLab : iGUILabel;
@HideInInspector
var upgradeBtn : iGUIButton;

private static var instance : iGUICode_UpgradeFoodUI;
// 食物表格管理器
private var mBartenderSysTablesMgr : BartenderSysTablesMgr = null;
// 升级的食物数据
private var mUpgradeFoodInfo : BartenderFoodUpgradeInfoRow = null;
// 食物的基础信息
private var mFoodbaseInfo : BartenderFoodBaseInfoRow = null;
// 实心图片
private var heartFullStr  : String = "UISkins/Textures/cookbook/heart_full";
// 空心图片
private var heartEmptyStr : String = "UISkins/Textures/cookbook/heart_empty";
// 购买的商品数组
private var mMarketArray : Array = new Array();
// 判断食物升级状态条件(材料、水晶币和房屋繁华度是否满足)
private var bFulfilStuff1  : boolean = false;
private var bFulfilStuff2  : boolean = false;
private var bFulfilStuff3  : boolean = false;
private var bFulfilStuff4  : boolean = false;
private var bFulfilDiamond : boolean = false;
private var bFulFilDecoration : boolean = false;

function Awake(){
	instance=this;
	registLocalEvent();
}
static function getInstance(){
	return instance;
}

function Start(){
    registCtrlCallback();
    
    if(!mBartenderSysTablesMgr)
    {
       mBartenderSysTablesMgr = BartenderSys.getInstance().getBartenderSysTableMgr();
    }
}

function registCtrlCallback(){
    closeBtn.clickCallback   = ClickCallback_ClosePanelBtn;
    fulillBtn.clickCallback  = ClickCallback_FulfillBtn;
    upgradeBtn.clickCallback = ClickCallback_UpgradeBtn;
    
    // 鼠标进入窗口悬浮信息
    stuffImg1.mouseOverCallback = MouseOverCallback_StuffImg;
    stuffImg2.mouseOverCallback = MouseOverCallback_StuffImg;
    stuffImg3.mouseOverCallback = MouseOverCallback_StuffImg;
    stuffImg4.mouseOverCallback = MouseOverCallback_StuffImg;
    // 鼠标离开 
    stuffImg1.mouseOutCallback = MouseOutCallback_StuffImg;
    stuffImg2.mouseOutCallback = MouseOutCallback_StuffImg;
    stuffImg3.mouseOutCallback = MouseOutCallback_StuffImg;
    stuffImg4.mouseOutCallback = MouseOutCallback_StuffImg;
}

function registLocalEvent(){
    EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_FOOD_UPGRADE_BTN), handleClickFoodUpgradeBtn);
    EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_BUY_SYS_SHOP_GOODS), HandleBuySysShopGoods);
}

function unRegistLocalEvent(){
    EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_FOOD_UPGRADE_BTN), handleClickFoodUpgradeBtn);
    EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_BUY_SYS_SHOP_GOODS), HandleBuySysShopGoods);
}

private function handleClickFoodUpgradeBtn(evt : GameEvent, obj : Object){
     mFoodbaseInfo = obj as BartenderFoodBaseInfoRow;
     createUpgradeFoodUI();
}

// 生成UI数据
private function createUpgradeFoodUI(){
     if(mFoodbaseInfo == null)
     {
        return;
     }
     if(!mBartenderSysTablesMgr)
     {
         mBartenderSysTablesMgr = BartenderSys.getInstance().getBartenderSysTableMgr();
     }
     
     var barFoodUpgradeInfo   : BartenderFoodUpgradeInfoRow = null;
     var foodUpgradeInfoTable : ArrayList = mBartenderSysTablesMgr.getFoodUpgradeInfoTable();
     for(var i = 0; i < foodUpgradeInfoTable.Count; ++i)
     {
         barFoodUpgradeInfo = foodUpgradeInfoTable[i];
         if(mFoodbaseInfo.upgrade_id == barFoodUpgradeInfo.upgrade_id)
         {
             mUpgradeFoodInfo = barFoodUpgradeInfo;
             showUIData();
             return;
         }
     }
}

private function showUIData(){
     if(mUpgradeFoodInfo == null)
     {
        return;
     }
        
     // 食物当前等级
     var curLevel : int = mFoodbaseInfo.cur_level;
     // 显示食物等级标识
     showHeartLevel(curLevel);
     curLevLab.label.text  = curLevel.ToString();
     nextLevLab.label.text = (curLevel+1).ToString();
     
     // 当前产品信息
     var barFoodProduceInfo : BartenderFoodProductInfoRow = mBartenderSysTablesMgr.getProductInfoRow(mFoodbaseInfo.upgrade_id);
     if(barFoodProduceInfo)
     {
         // 产品名字
         foodNameLab.label.text = barFoodProduceInfo.name;
         // 产品图像
         BartenderSys.getInstance().loadIcon(foodImg, barFoodProduceInfo.icon);
         // 当前每格的总价格
         var totalPrice : int = barFoodProduceInfo.price_per_copy * barFoodProduceInfo.copies_per_grid;
         
         // 玩家拥有的水晶币
		 var curDiamond  : int = SelfItemLogic.getInstance().GetCurDiamond();
		 // 升级需要的水晶币
		 var needDiamond : int = mUpgradeFoodInfo.need_diamond;
         consumeLab.label.text = needDiamond.ToString();
         consumeLab.labelColor = curDiamond < needDiamond ? Color.red : Color.white;
		 bFulfilDiamond = curDiamond < needDiamond ? false : true;
         
         // 升级需要的是繁华度
         var needDecoration : int = mUpgradeFoodInfo.need_decoration;
         // 当前房屋的繁华度
         //var curDecoration  : int = DataCenter.getSelfHouseData().decoration;
         var curDecoration  : int = Property.getInstance().getDecoration();
         if(curDecoration < needDecoration)
         {
             bFulFilDecoration     = false;
             needDecLab.labelColor = Color.red;
         }
         else
         {
	         bFulFilDecoration     = true;
	         needDecLab.labelColor = Color.white;
         }
         needDecLab.label.text    = needDecoration.ToString();
     }
     // 下一级别的产品信息
     var nextBarFoodProduceInfo : BartenderFoodProductInfoRow = mBartenderSysTablesMgr.getProductInfoRow(mUpgradeFoodInfo.next_upgrade_id);
     if(nextBarFoodProduceInfo)
     {
         // 下一级别每格的总价格
         var nextTotalPrice : int = nextBarFoodProduceInfo.price_per_copy * nextBarFoodProduceInfo.copies_per_grid;
         curPriceLab.label.text   = totalPrice.ToString() + "→" + nextTotalPrice.ToString();
     }
     
     // 显示需求材料数据
     showStuffData();
}

private function showHeartLevel(level : int){ 
     switch(level)
    {
       case 1:
       heartImg1.image = Resources.Load(heartFullStr);
       heartImg2.image = Resources.Load(heartEmptyStr);
       heartImg3.image = Resources.Load(heartEmptyStr);
       heartImg4.image = Resources.Load(heartEmptyStr);
       heartImg5.image = Resources.Load(heartEmptyStr);
       heartImg6.image = Resources.Load(heartEmptyStr);
       heartImg7.image = Resources.Load(heartEmptyStr);
       break;
       case 2:
       heartImg1.image = Resources.Load(heartFullStr);
       heartImg2.image = Resources.Load(heartFullStr);
       heartImg3.image = Resources.Load(heartEmptyStr);
       heartImg4.image = Resources.Load(heartEmptyStr);
       heartImg5.image = Resources.Load(heartEmptyStr);
       heartImg6.image = Resources.Load(heartEmptyStr);
       heartImg7.image = Resources.Load(heartEmptyStr);
       break;
       case 3:
       heartImg1.image = Resources.Load(heartFullStr);
       heartImg2.image = Resources.Load(heartFullStr);
       heartImg3.image = Resources.Load(heartFullStr);
       heartImg4.image = Resources.Load(heartEmptyStr);
       heartImg5.image = Resources.Load(heartEmptyStr);
       heartImg6.image = Resources.Load(heartEmptyStr);
       heartImg7.image = Resources.Load(heartEmptyStr);
       break;
       case 4:
       heartImg1.image = Resources.Load(heartFullStr);
       heartImg2.image = Resources.Load(heartFullStr);
       heartImg3.image = Resources.Load(heartFullStr);
       heartImg4.image = Resources.Load(heartFullStr);
       heartImg5.image = Resources.Load(heartEmptyStr);
       heartImg6.image = Resources.Load(heartEmptyStr);
       heartImg7.image = Resources.Load(heartEmptyStr);
       break;
       case 5:
       heartImg1.image = Resources.Load(heartFullStr);
       heartImg2.image = Resources.Load(heartFullStr);
       heartImg3.image = Resources.Load(heartFullStr);
       heartImg4.image = Resources.Load(heartFullStr);
       heartImg5.image = Resources.Load(heartFullStr);
       heartImg6.image = Resources.Load(heartEmptyStr);
       heartImg7.image = Resources.Load(heartEmptyStr);
       break;
       case 6:
       heartImg1.image = Resources.Load(heartFullStr);
       heartImg2.image = Resources.Load(heartFullStr);
       heartImg3.image = Resources.Load(heartFullStr);
       heartImg4.image = Resources.Load(heartFullStr);
       heartImg5.image = Resources.Load(heartFullStr);
       heartImg6.image = Resources.Load(heartFullStr);
       heartImg7.image = Resources.Load(heartEmptyStr);
       break;
       case 7:
       heartImg1.image = Resources.Load(heartFullStr);
       heartImg2.image = Resources.Load(heartFullStr);
       heartImg3.image = Resources.Load(heartFullStr);
       heartImg4.image = Resources.Load(heartFullStr);
       heartImg5.image = Resources.Load(heartFullStr);
       heartImg6.image = Resources.Load(heartFullStr);
       heartImg7.image = Resources.Load(heartFullStr);
       break;
    } 
}

// 显示需求材料数据
private function showStuffData(){
     if(mUpgradeFoodInfo)
     {
         if(mUpgradeFoodInfo.need_item_ids.Count != mUpgradeFoodInfo.need_item_cnts.Count || mUpgradeFoodInfo.need_item_ids.Count != mUpgradeFoodInfo.need_shop_ids.Count)
         {
            return;
         }
         mMarketArray.clear();
         for(var i = 0; i < mUpgradeFoodInfo.need_item_ids.Count; ++i)
         {     
			// 升级食物需要的材料数量
			var needNum : int = mUpgradeFoodInfo.need_item_cnts[i];
			// 升级食物需要的物品ID
			var itemID : int = mUpgradeFoodInfo.need_item_ids[i];
			// 升级需要物品对应当商品ID
			var goodID : int = mUpgradeFoodInfo.need_shop_ids[i];
			// 角色拥有的材料数量
			var curNum : int = SelfItemLogic.getInstance().getItemNum(itemID);
			
			var itemInfo : ItemRow = ResManager.LgtMgr.getItemRow(itemID);
			// 物品图标
			var imageStr : String = itemInfo.icon;
			// 物品名字
			//var itemName : String = itemInfo.name;
			// 物品说明
			var itemDec  : String = ResManager.LgtMgr.getItemDescription(itemInfo.upgrade_id);
			// 显示材料面板UI
			ShowUIData(i+1, curNum, needNum, imageStr, itemDec);
			
			if(curNum < needNum)
			{
			   // 向服务器请求爱币购买材料
			   var market : goods_atom = new goods_atom();
			   market.goods_id = goodID;
			   market.count = needNum - curNum;
			   mMarketArray.Add(market);
			}
         }
         
         if(bFulfilStuff1 && bFulfilStuff2 && bFulfilStuff3 && bFulfilStuff4)
         {
            fulillBtn.setEnabled(false);
         }
         else
         {
            fulillBtn.setEnabled(true);
         }
         
         // 升级食物按钮状态
         ShowUpgradeBtnState();
     }
}

private function ShowUIData(flag : int, curNum : int, needNum : int, image : String, itemDec : String){		
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
	
	switch(flag)
	{
	case 1:
       // 显示物品图标
       BartenderSys.getInstance().loadIcon(stuffImg1, image);
       stuffNumLab1.label.text = labelStr;
       stuffNumLab1.labelColor = colorStr; 
       // 物品描述
       stuffImg1.userData = itemDec;
       // 按钮状态判断条件
       bFulfilStuff1 = bFulfil;
	   break;
	case 2:   
       BartenderSys.getInstance().loadIcon(stuffImg2, image); 
       stuffNumLab2.label.text = labelStr;   
       stuffNumLab2.labelColor = colorStr;
       stuffImg2.userData = itemDec;
       bFulfilStuff2 = bFulfil;
	   break;
	case 3:
       BartenderSys.getInstance().loadIcon(stuffImg3, image);
       stuffNumLab3.label.text = labelStr;
       stuffNumLab3.labelColor = colorStr;
       stuffImg3.userData = itemDec;
       bFulfilStuff3 = bFulfil;
	   break;
	case 4:
       BartenderSys.getInstance().loadIcon(stuffImg4, image);
       stuffNumLab4.label.text = labelStr;
       stuffNumLab4.labelColor = colorStr;
       stuffImg4.userData = itemDec;
       bFulfilStuff4 = bFulfil;
	   break;
	}
}


// 关闭面板
private function ClickCallback_ClosePanelBtn(caller : iGUIElement){
     destory();
     closeUIRoot();
}

// 购买补齐升级材料
private function ClickCallback_FulfillBtn(caller : iGUIElement){
     if(mMarketArray.Count > 0)
     {
         FurnitureUnlockLogic.getInstance().requestFillMaterial(mMarketArray);	
     }
}

// 购买商品事件
private function HandleBuySysShopGoods(evt : GameEvent, obj : System.Object){
    // 更新物品数据
    UpdateNum();
}

// 更新拥有的材料数据
private function UpdateNum(){
	if(!mUpgradeFoodInfo || mUpgradeFoodInfo.need_item_ids.Count != mUpgradeFoodInfo.need_item_cnts.Count || mUpgradeFoodInfo.need_item_ids.Count != mUpgradeFoodInfo.need_shop_ids.Count)
	{
	    return;
	}
    for(var i : int = 0; i < mUpgradeFoodInfo.need_item_ids.Count; ++i)
    {
       var needNum  : int = mUpgradeFoodInfo.need_item_cnts[i];
       var itemID   : int = mUpgradeFoodInfo.need_item_ids[i];
       var curNum   : int = SelfItemLogic.getInstance().getItemNum(itemID);
       if(curNum >= needNum)
       {
		  var labelStr : String = curNum.ToString() + "/" + needNum.ToString(); 
	      switch(i+1)
	      {
		      case 1:
		      bFulfilStuff1 = true;
		      stuffNumLab1.label.text = labelStr;
	          stuffNumLab1.labelColor = Color.white;
		      break;
		      case 2:
		      bFulfilStuff2 = true;
		      stuffNumLab2.label.text = labelStr;
	          stuffNumLab2.labelColor = Color.white;	      
		      break;      
		      case 3:
		      bFulfilStuff3 = true;
		      stuffNumLab3.label.text = labelStr;
	          stuffNumLab3.labelColor = Color.white;	      
		      break;
		      case 4:
		      bFulfilStuff4 = true;
		      stuffNumLab4.label.text = labelStr;
	          stuffNumLab4.labelColor = Color.white;	      
		      break;
	      }  
       }
    }    
    // 升级食物按钮状态
	ShowUpgradeBtnState();   
}

private function ShowUpgradeBtnState(){
    if(bFulfilStuff1 && bFulfilStuff2 && bFulfilStuff3 && bFulfilStuff4)
    {   
        // 补齐材料按钮状态
        fulillBtn.setEnabled(false);
        if(bFulfilDiamond && bFulFilDecoration)
        {
            // 食物升级按钮状态
            upgradeBtn.passive = false;
        }
        else
        {
            upgradeBtn.passive = true;
        }
    }
    else
    {
        fulillBtn.setEnabled(true);
        upgradeBtn.passive = true;
    }
}

// 升级
private function ClickCallback_UpgradeBtn(){
    if(mFoodbaseInfo)
    {
       BartenderSys.getInstance().reqUpgradeFood(mFoodbaseInfo.food_id);
       closeUIRoot();
    }
}



function destory(){
    mFoodbaseInfo = null;
    mUpgradeFoodInfo = null;
    mBartenderSysTablesMgr = null;
    mMarketArray.clear();
    unRegistLocalEvent();
}

function closeUIRoot(){
    UI.getUI().SetModal("UpgradeFoodUI", false);
    UI.getUI().CloseUIRoot("UpgradeFoodUI");
}


private function MouseOverCallback_StuffImg(caller : iGUIElement){
    var itemDec : String  = caller.userData;
    // 显示悬浮信息 
    Global.GetSysTooltip().Begin(caller);
	Global.GetSysTooltip().Add(GUIContent(itemDec), BartenderHintStyles.instance.upgradeFoodStyle);
	Global.GetSysTooltip().Show(true, 0, 20);
}

private function MouseOutCallback_StuffImg(caller : iGUIElement){
}