/**
note:   派对食物页面
author: zlj
date:   20130801
*/

#pragma strict

import iGUI;

@HideInInspector
var introduceLab : iGUILabel;
@HideInInspector
var page_label : iGUILabel;
@HideInInspector
var right_page_btn : iGUIButton;
@HideInInspector
var left_page_btn : iGUIButton;
@HideInInspector
var first_page_btn : iGUIButton;
@HideInInspector
var item_select : iGUILabel;
@HideInInspector
var item_num16 : iGUILabel;
@HideInInspector
var item_image16 : iGUIImage;
@HideInInspector
var item_slot16 : iGUIPanel;
@HideInInspector
var item_num15 : iGUILabel;
@HideInInspector
var item_image15 : iGUIImage;
@HideInInspector
var item_slot15 : iGUIPanel;
@HideInInspector
var item_num14 : iGUILabel;
@HideInInspector
var item_image14 : iGUIImage;
@HideInInspector
var item_slot14 : iGUIPanel;
@HideInInspector
var item_num13 : iGUILabel;
@HideInInspector
var item_image13 : iGUIImage;
@HideInInspector
var item_slot13 : iGUIPanel;
@HideInInspector
var item_num12 : iGUILabel;
@HideInInspector
var item_image12 : iGUIImage;
@HideInInspector
var item_slot12 : iGUIPanel;
@HideInInspector
var item_num11 : iGUILabel;
@HideInInspector
var item_image11 : iGUIImage;
@HideInInspector
var item_slot11 : iGUIPanel;
@HideInInspector
var item_num10 : iGUILabel;
@HideInInspector
var item_image10 : iGUIImage;
@HideInInspector
var item_slot10 : iGUIPanel;
@HideInInspector
var item_num9 : iGUILabel;
@HideInInspector
var item_image9 : iGUIImage;
@HideInInspector
var item_slot9 : iGUIPanel;
@HideInInspector
var item_num8 : iGUILabel;
@HideInInspector
var item_image8 : iGUIImage;
@HideInInspector
var item_slot8 : iGUIPanel;
@HideInInspector
var item_num7 : iGUILabel;
@HideInInspector
var item_image7 : iGUIImage;
@HideInInspector
var item_slot7 : iGUIPanel;
@HideInInspector
var item_num6 : iGUILabel;
@HideInInspector
var item_image6 : iGUIImage;
@HideInInspector
var item_slot6 : iGUIPanel;
@HideInInspector
var item_num5 : iGUILabel;
@HideInInspector
var item_image5 : iGUIImage;
@HideInInspector
var item_slot5 : iGUIPanel;
@HideInInspector
var item_num4 : iGUILabel;
@HideInInspector
var item_image4 : iGUIImage;
@HideInInspector
var item_slot4 : iGUIPanel;
@HideInInspector
var item_num3 : iGUILabel;
@HideInInspector
var item_image3 : iGUIImage;
@HideInInspector
var item_slot3 : iGUIPanel;
@HideInInspector
var item_num2 : iGUILabel;
@HideInInspector
var item_image2 : iGUIImage;
@HideInInspector
var item_slot2 : iGUIPanel;
@HideInInspector
var item_num1 : iGUILabel;
@HideInInspector
var item_image1 : iGUIImage;
@HideInInspector
var item_slot1 : iGUIPanel;
@HideInInspector
var item_slot_list : iGUIPanel;
@HideInInspector
var close_btn : iGUIButton;
@HideInInspector
var partyPack_panel : iGUIPanel;
@HideInInspector
var root : iGUIRoot;

private static var instance : iGUICode_PartyPackUI;
// 派对食物页面管理器
private var partyPackMgr : PagerMgr = null;
private var mSlotArray : Array = new Array();
// 每页的物品数量
private var numCurPage : int = 16;
function Awake()
{
	instance=this;
}
static function getInstance()
{
	return instance;
}


function Start ()
{
    registerEvents();
    
    // 生成页面控件列表
    createSlots();
    
    // 获取派对食物类型物品
    var foodList = SelfItemLogic.getInstance().getPackGridList(ItemType.Food);
    // 生成食物列表页面
    createPartyFoodPage(foodList);    
}

function registerEvents()
{   
    // 注册按钮的回调函数
    close_btn.clickCallback      = ClickCallback_closeBtn;
    first_page_btn.clickCallback = ClickCallback_firstPageBtn;
    left_page_btn.clickCallback  = ClickCallback_prePageBtn;
    right_page_btn.clickCallback = ClickCallback_nextPageBtn;
    // 派对食物道具页面改变
    EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.PARTYPACK_CHANGE), HandleShowPageChange);
    // 页面格子点击事件
    EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.BACKPACK_CLICKED), HandleGridItemsChoose);
}

function unRegisterEvents()
{
    EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.PARTYPACK_CHANGE), HandleShowPageChange);
    EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.BACKPACK_CLICKED), HandleGridItemsChoose);
}

// 创建列表
private function createSlots() : void
{
	for (var i:int=0; i< numCurPage; ++i)
	{
		var element : iGUIElement[] = getItemCtrl(i);
		mSlotArray.Add(new BackpackSlot(root, element[0], element[1], element[2], item_select));
	}
}

// 获取物品控件
private function getItemCtrl(index : int) : iGUIElement[]
{
	var element : iGUIElement[] = null;
	switch(index)
	{
	   case 0:
	       element = [item_slot1, item_image1, item_num1];
	   break;
	   case 1:
	   	   element = [item_slot2, item_image2, item_num2];
	   break;
	   case 2:
	   	   element = [item_slot3, item_image3, item_num3];
	   break;
	   case 3:
	   	   element = [item_slot4, item_image4, item_num4];
	   break;
	   case 4:
	   	   element = [item_slot5, item_image5, item_num5];
	   break;
	   case 5:
	   	   element = [item_slot6, item_image6, item_num6];
	   break;
	   case 6:
	   	   element = [item_slot7, item_image7, item_num7];
	   break;
	   case 7:
	   	   element = [item_slot8, item_image8, item_num8];
	   break;
	   case 8:
	   	   element = [item_slot9, item_image9, item_num9];
	   break;
	   case 9:
	   	   element = [item_slot10, item_image10, item_num10];
	   break;
	   case 10:
	   	   element = [item_slot11, item_image11, item_num11];
	   break;
	   case 11:
	   	   element = [item_slot12, item_image12, item_num12];
	   break;	
	   case 12:
	   	   element = [item_slot13, item_image13, item_num13];
	   break;
	   case 13:
	   	   element = [item_slot14, item_image14, item_num14];
	   break;
	   case 14:
	   	   element = [item_slot15, item_image15, item_num15];
	   break;
	   case 15:
	   	   element = [item_slot16, item_image16, item_num16];
	   break;
	   default:
	       element = [item_slot1, item_image1, item_num1];
	   break;	      	   	   	   	   
	}
	
	return element;
}

// 清除列表
private function clearSlots() : void
{
	for (var slot : BackpackSlot in mSlotArray)
	{
		slot.setContent(null);
	}
	mSlotArray.Clear();
}

// 点击关闭按钮
private function ClickCallback_closeBtn(caller : iGUIElement)
{
    ClosePartyPackUI();
    clearSlots();
}

// 首页
private function ClickCallback_firstPageBtn(caller : iGUIElement)
{
    if(!partyPackMgr || partyPackMgr.CurrPage() == 1)
    {
        return;
    }
    
    var foodList : ArrayList = partyPackMgr.GetPage(1);
    EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.PARTYPACK_CHANGE), foodList);
}

// 前一页
private function ClickCallback_prePageBtn(caller : iGUIElement)
{
    if(!partyPackMgr || partyPackMgr.CurrPage() == 1)
    {
        return;
    }
    
    var foodList : ArrayList = partyPackMgr.PrevPage();
    EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.PARTYPACK_CHANGE), foodList);
}

// 后一页
private function ClickCallback_nextPageBtn(caller : iGUIElement)
{
    if(!partyPackMgr || partyPackMgr.CurrPage() == GetTotalPageNum())
    {
       return;
    }
    
    var foodList : ArrayList = partyPackMgr.NextPage();
    EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.PARTYPACK_CHANGE), foodList);
}

// 生成派对食物类型列表页面(创建食物派对类型)
public function createPartyFoodPage(foodList : ArrayList)
{
    partyPackMgr = new PagerMgr(foodList, numCurPage);
    var curFoodList : ArrayList = partyPackMgr.CurrPage();
    EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.PARTYPACK_CHANGE), curFoodList);
    
    // 设置一个随机食物图标
    setDefaultSelFoodBg(foodList);
}

// 选择食物按钮图标
private function setDefaultSelFoodBg(foodList : ArrayList)
{
    var count     : int    = foodList.Count;
    var foodID    : int    = 0;
    var foodLevel : int    = 0;
    var foodIcon  : String = null;
    if(count > 0)
    {
        var randomNum = Random.Range(0, count);
        // 判断数组是否越界
        if(randomNum < 0 || randomNum >= foodList.Count)
        {
            return;
        }
        var grid : PackGrid = foodList[randomNum] as PackGrid;
        foodID    = grid._item._itemInfo.id;
        foodLevel = grid._item._itemInfo.level;
        foodIcon  = grid._item._itemInfo.icon;
    }
    iGUICode_PartyCreateUI.getInstance().SetSelFoodBg(foodID, foodLevel, foodIcon);
}

// 派对食物道具页面改变                 
private function HandleShowPageChange(evt : GameEvent, obj : Object)
{
    var foodList : ArrayList = obj as ArrayList;
    for(var i : int = 0; i < mSlotArray.Count; ++i)
    {
       var slot : BackpackSlot = mSlotArray[i] as BackpackSlot; 
       if(i < foodList.Count) // 防止数组越界
       {
          var grid : PackGrid = foodList[i] as PackGrid;
          slot.setContent(grid); 
       }
       else
       {
          slot.setContent(null); 
       }
    }

    // 显示页面标签
    showPageLabel();
}

// 显示页面标签
private function showPageLabel()
{
    if(partyPackMgr)
    {
        var curPage   : int   = partyPackMgr.GetPageIndex();
        curPage = curPage ? curPage : 1;
        var totalPage : int   = GetTotalPageNum();
        totalPage = totalPage ? totalPage : 1;
        page_label.label.text = curPage.ToString() + "/" + totalPage.ToString(); 
    }
}

// 获取派对食物总页数
private function GetTotalPageNum() : int
{   
   var num : int = partyPackMgr ? partyPackMgr.GetTotalPage() : 1;
   return num;
}

// 格子选择点击事件
private function HandleGridItemsChoose(evt : GameEvent, obj : Object)
{
    var backPack : BackpackClass = obj as BackpackClass; 
    if(backPack == null || backPack.pg == null)
    {
       return;
    }

    iGUICode_PartyCreateUI.getInstance().SetSelFoodBg(backPack.pg._item._itemInfo.id, backPack.pg._item._itemInfo.level , backPack.pg._item._itemInfo.icon);
}

// 设置界面的显示位置
public function SetPosition(posX : float, posY : float)
{
    partyPack_panel.setX(posX);
    partyPack_panel.setY(posY);
}

// 关闭界面
public function ClosePartyPackUI()
{
    UI.getUI().CloseUIRoot("PartyPackUI");
    unRegisterEvents();
    partyPackMgr = null;
}


