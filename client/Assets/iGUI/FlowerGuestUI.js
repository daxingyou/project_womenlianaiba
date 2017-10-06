#pragma strict
#pragma downcast
import iGUI;
import System.DateTime;

private static var instance : FlowerGuestUI;
private var playerSettingMgr : PlayerSettingMgr;
function Awake(){
	instance=this;
	playerSettingMgr = Camera.main.GetComponent("PlayerSettingMgr") as PlayerSettingMgr;
	playerSettingMgr.playMusic("flower");
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.REQUEST_SHOW_FLOWER_DATA), ShowFlowerData);
}

static function getInstance(){
	return instance;
}
@HideInInspector
var TimeLabel : iGUILabel;
@HideInInspector
var label1 : iGUILabel;
@HideInInspector
var LevelLabel : iGUILabel;
@HideInInspector
var CloseImg : iGUIImage;
@HideInInspector
var DecorateImg : iGUIImage;
@HideInInspector
var ToolImg : iGUIImage;
@HideInInspector
var FertilizeImg : iGUIImage;
@HideInInspector
var WaterImg : iGUIImage;
@HideInInspector
var image3 : iGUIImage;
@HideInInspector
var textarea1 : iGUITextarea;
@HideInInspector
var image2 : iGUIImage;
@HideInInspector
var GrowLabel : iGUILabel;
@HideInInspector
var image1 : iGUIImage;
@HideInInspector
var panel1 : iGUIPanel;

private var FruitDateTime:DateTime = Convert.ToDateTime("2011-11-24 17:50:00");

function ShowFlowerData(evt:GameEvent, obj:System.Object)
{
	var pack : notify_flower_data = obj as notify_flower_data;
	var time : stime = pack.fruit_time;
	var fowerRow : FlowerRow = FlowerTable.GetInst().Get(pack.id, pack.level);
	FruitDateTime = Convert.ToDateTime(pack.fruit_time.year + "-" + 
					pack.fruit_time.month + "-" + pack.fruit_time.day + " " + 
					pack.fruit_time.hour + ":" + pack.fruit_time.minute + ":" + 
					pack.fruit_time.second);
	GrowLabel.label.text = pack.grow.ToString() + "/" + fowerRow.grow.ToString();
	LevelLabel.label.text = pack.level.ToString();
}

function Update()
{
	var dt1:DateTime = DateTime.Now;
	var ts:TimeSpan = FruitDateTime - dt1;
	var day : String = ts.Days.ToString();
	var hour : String = ts.Hours.ToString();
	var minute : String = ts.Minutes.ToString();
	var seconds : String = ts.Seconds.ToString();
	if(ts.Days <= 0 && ts.Hours <= 0 && ts.Minutes <= 0 && ts.Seconds <= 0)
	{
		day = "0";
		hour = "0";
		minute = "0";
		seconds = "0";
		TimeLabel.enabled = false;
	}
	else
	{
		TimeLabel.enabled = true;
	}
	TimeLabel.label.text = Define.getContent(5127, [day, hour, minute, seconds]);
	TimeLabel.enabled = false;
}

function OnDestroy () {
    EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.REQUEST_SHOW_FLOWER_DATA), ShowFlowerData);
}

function WaterImg_Click(caller : iGUIImage){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.REQUEST_WATER));
}

function CloseImg_Click(caller : iGUIImage){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.REQUEST_FLOWER_CLOSE));
	UI.getUI().CloseUIRoot("FlowerGuestUI");
	playerSettingMgr.playMusic("main");
}

function DecorateImg_Click(caller : iGUIImage){
	Global.GetSysMsgHandler().ShowSysMsg(242);
}

function FertilizeImg_Click(caller : iGUIImage){
	Global.GetSysMsgHandler().ShowSysMsg(242);
}

function ToolImg_Click(caller : iGUIImage){
	Global.GetSysMsgHandler().ShowSysMsg(242);
}