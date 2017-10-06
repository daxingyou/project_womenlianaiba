import iGUI;

private static var instance : iGUICode_BuyTheDrinksUI;
function Awake(){
	instance=this;
	
	registerEvents();
}
static function getInstance(){
	return instance;
}

@HideInInspector
var drinkBtn1 : iGUIButton;
@HideInInspector
var drinkBtn2 : iGUIButton;
@HideInInspector
var drinkBtn3 : iGUIButton;
@HideInInspector
var drinkPanel : iGUIPanel;
@HideInInspector
var drinkRoot : iGUIRoot;

// 请喝酒的表格数据
private var mPartyDrinkTable : Array = null;
// 自动关闭2级菜单
private var mAutoClosed : boolean  = true;
// 请玩家喝的酒信息
private var mDrinkInfo : PartyDrinkRow = null;


function Start()
{  
    if(mPartyDrinkTable == null)
    {
       mPartyDrinkTable = ResManager.LgtMgr.getPartyDrinkTableData();
    }
    
    init();
}

function Update()
{
	if (mAutoClosed && Input.GetMouseButtonUp(0))
	{
		drinkPanel.setEnabled(false);
	}
	else
	{
		mAutoClosed = true;
	}
}

public function registerEvents()
{
    drinkBtn1.clickCallback  =  ClickCallback_drinkBtn;
    drinkBtn2.clickCallback  =  ClickCallback_drinkBtn;
    drinkBtn3.clickCallback  =  ClickCallback_drinkBtn;
}

public function unRegisterEvents()
{
    
}

private function init()
{
    drinkBtn1.userData = 0;
    drinkBtn2.userData = 0;
    drinkBtn3.userData = 0;
    
    if(mPartyDrinkTable == null)
    {
       return;
    }
    
    for(var drinkInfo : PartyDrinkRow in  mPartyDrinkTable)
    {
        if(drinkInfo)
        {
            createDrinkData(drinkInfo.id);
        }     
    }
}

// 填充按钮数据
private function createDrinkData(id : int)
{
    switch(id)
    {
       case 1:
           drinkBtn1.userData = id;
           break;
       case 2:
           drinkBtn2.userData = id;
           break;
       case 3:
           drinkBtn3.userData = id;
           break;
       case 4: // 预留，酒的种类后期可能会添加
           break;
       case 5:
           break;                           
    }
}

// 面板显示的位置
private function setPosition(x : float, y : float) : void
{
	mAutoClosed = false;
	drinkPanel.setEnabled(true);
	drinkPanel.setX(x);
	drinkPanel.setY(y - drinkPanel.positionAndSize.height);
}

// 打开或关闭面板
public static function openBuyTheDrinksPanel(x : float, y : float) : void
{
	if (iGUICode_BuyTheDrinksUI.getInstance())
	{
        UI.getUI().CloseUIRoot("BuyTheDrinksUI");
	}
	else
	{   
	    UI.getUI().OpenUIRoot("BuyTheDrinksUI");
		iGUICode_BuyTheDrinksUI.getInstance().setPosition(x, y);
	}
}

// 酒类按钮回调
private function ClickCallback_drinkBtn(caller : iGUIElement)
{
    mAutoClosed = true;
    if(mPartyDrinkTable == null)
    {
        return;
    }
    
    mDrinkInfo = null;
    // 酒的ID
    var drinkID : int = caller.userData;
    for(var drinkInfo : PartyDrinkRow in  mPartyDrinkTable)
    {
	    if(drinkInfo && drinkInfo.id == drinkID)
	    {        
	        mDrinkInfo = drinkInfo;
	        
	        // 询问服务端, 请客人数上限
	        var req_drink_count : req_ask_drink_count = new req_ask_drink_count();
	        req_drink_count.drink_id = drinkInfo.id;
	        NetHelper.Send(req_drink_count);
                                                                                                                                                            
	        return;
	    }
    }
}

// 请喝酒信息反馈
public function treatDrink(player_count : int, cost : int ,  bTopLimit : boolean)
{
     // 派对中没有客人
    if(!player_count)
    {
        return;
    }
    
    var player_count_str : String = player_count.ToString();
    var cost_str : String = cost.ToString();
    
    var content : String;
    if(mDrinkInfo.type == 1) // 水晶币
    {
        if(bTopLimit)
        {
            content = Define.getContent(599, [player_count_str, cost_str]);
        }
        else
        {
            content = Define.getContent(597, [player_count_str, cost_str]);
        }
    }
    else if(mDrinkInfo.type == 2) // 爱情币
    {
        if(bTopLimit)
        {
            content = Define.getContent(600, [player_count_str, cost_str]);
        }
        else
        {
            content = Define.getContent(598, [player_count_str, cost_str]);
        }
    }
    else
    {
        Debug.Log("策划填写了错误的请喝酒付费方式枚举");
        return;
    }

    UI.getUI().OpenMsgbox("", content, "", ClickCallback_OKBtn, "", ClickCallback_CancelBtn);
}

// 确定请喝酒回调函数
private function ClickCallback_OKBtn(caller : iGUIElement)
{
    if(mDrinkInfo)
    {   
        // 请喝酒
        var req_drink : req_party_drink = new req_party_drink();
        req_drink.drink_id = mDrinkInfo.id;
        NetHelper.Send(req_drink);
    }
}

// 取消请喝酒回调函数
private function ClickCallback_CancelBtn(caller : iGUIElement)
{

}


// 接收服务器反馈的请喝酒相关数据
public function setDrinkInfo(const : int, player_count : int, shoutList : ArrayList)
{  
     // 请喝酒上限
     var bTopLimit : boolean = false;
     
     if(mDrinkInfo && mDrinkInfo.shout_count >0)
     {
	    for(var i : int = 0; i < shoutList.Count; ++i)
	    {
	         var shoutInfo : shout_data = shoutList[i];
	         if(shoutInfo.id == mDrinkInfo.id)
	         {
	             if(shoutInfo.count >= mDrinkInfo.shout_count)
	             {
	                 bTopLimit = true;
	             }
	             
	             break;
	         } 
	    }
     }  
     
     treatDrink(player_count, const, bTopLimit); 
}
