#pragma strict
#pragma downcast
import iGUI;

private static var instance : FlowerLog;
private var pageMgr : PagerMgr;
function Awake(){
	instance=this;
	NetHelper.RegistHandler(new notify_flower_log(), handle_notify_flower_log);
}
static function getInstance(){
	return instance;
}
@HideInInspector
var image2 : iGUIImage;
@HideInInspector
var image1 : iGUIImage;
@HideInInspector
var panel1 : iGUIPanel;
@HideInInspector
var Log : iGUITextarea;
@HideInInspector
var PageInfo : iGUILabel;
@HideInInspector
var PrevPage : iGUIImage;
@HideInInspector
var NextPage : iGUIImage;
@HideInInspector
var RecordLabel : iGUILabel;
@HideInInspector
var Close : iGUIImage;
@HideInInspector
var LogWindow : iGUIWindow;
@HideInInspector
var root1 : iGUIRoot;


function handle_notify_flower_log(evt:GameEvent, pack:notify_flower_log)
{
	if(pack.logs.Count > 0)
	{
		PrevPage.enabled = true;
		NextPage.enabled = true;
		PageInfo.enabled = true;
		pageMgr = new PagerMgr(pack.logs, 25);
		ShowLog(pageMgr.CurrPage());
	}
	else
	{
		PrevPage.enabled = false;
		NextPage.enabled = false;
		PageInfo.enabled = false;
	}
}


function Close_Click(caller : iGUIImage){
	NetHelper.UnregistHandler(NetMsgType.msg_notify_flower_log);
	UI.getUI().CloseUIRoot("FlowerLog");
}

function NextPage_Click(caller : iGUIImage){
	var data : ArrayList = pageMgr.NextPage();
	ShowLog(data);
}

function ShowLog(data : ArrayList)
{
	var message : String = "";
	for(var i = 0; i < data.Count; i++)
	{
		var flowerLog : flower_log = data[i] as flower_log;
		switch(flowerLog.op)
		{
			case 1:// 浇水
				var logtime : stime = flowerLog.time;
				var br : String = "\n";
				if (0 == i)
				{
					br = "";
				}
				message += br + FormatDate(logtime.month.ToString()) + "-" + FormatDate(logtime.day.ToString()) + " " + FormatDate(logtime.hour.ToString()) + ":" + FormatDate(logtime.minute.ToString()) + ":" + FormatDate(logtime.second.ToString()) +
							"," + flowerLog.name + Define.getContent(5128, [flowerLog.grow.ToString()]);
				break;
			case 2:// 施肥
				break;
		}
	}
	Log.setValue(message);
	PageInfo.label.text = pageMgr.GetPageIndex() + "/" + pageMgr.GetTotalPage();
}

function FormatDate(param:String)
{
	if(param.length==1)
		return "0" + param;
 	else
 		return param;
}

function PrevPage_Click(caller : iGUIImage){
	var data : ArrayList = pageMgr.PrevPage();
	ShowLog(data);
}

function Log_ValueChange(caller : iGUITextarea){
	
}

function image1_Click(caller : iGUIImage){
	
}