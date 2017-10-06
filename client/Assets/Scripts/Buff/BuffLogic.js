#pragma strict
#pragma downcast
import iGUI;

class BuffInfo
{
	var data : player_buff_data;		// buff数据
	var saveTime : System.DateTime;		// 保存的时间
	
	function log() : void
	{
		var tm : System.DateTime = saveTime;
		Debug.LogWarning("===== buff -> id: "+data.id+", rest time: "+data.rest_time+", save time: "+tm.Year+"-"+tm.Month+"-"+tm.Day+"-"+tm.Hour+"-"+tm.Minute+"-"+tm.Second);
	}
}

private static var mBuffList : Array = new Array();		// 游戏buff列表
private static var mTimer : Timer = null;
private static var mRefreshTime : int = 500;				// 刷新间隔 微秒
private static var mTimerCount : int = 200000;			// 计时器次数
//--------------------------------------------------

function Awake()
{
	NetHelper.RegistHandler(new notify_player_buff(), handle_notify_player_buff);
	NetHelper.RegistHandler(new notify_add_buff(), handle_notify_add_buff);
}

function Start()
{
	var timer : Timer = new Timer(mRefreshTime, mTimerCount);
	timer.addEventListener(TimerEvent.TIMER, checkBuffTimeout);
	timer.Start();
}
//---------------------------------------------------
// 检查buff过期
private static function checkBuffTimeout() : void
{
	// 如果有buff过期会移除，并且通知更新buff图标
	removeTimeoutBuff();
}
//--------------------------------------------------
// 处理buff列表
private function handle_notify_player_buff(evt : GameEvent, pack : notify_player_buff) : void
{
	mBuffList.Clear();
	// 进行缓存	
	for (var pbd : player_buff_data in pack.buffs)
	{
		addBuff(pbd);
	}
	
	// 事件分布
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLAYR_BUFF));
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.REFRESH_BUFF_ICON));
}
//--------------------------------------------------
// 通知新增buff
private function handle_notify_add_buff(evt : GameEvent, pack : notify_add_buff) : void
{
	var buffID : int = pack.buff.id;
	var buffRow : NewBuffRow = getBuffRow(buffID);
	var content : String = buffRow.sys_msg;
	content = content.Replace("%%%user%%%", DataCenter.getCurPlayerName());
	ChatLogic.getInstance().setTextItemOnListbox(content, Color.white);
	
	removeBuffByType(buffRow.type);
	addBuff(pack.buff);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.REFRESH_BUFF_ICON));
}
//--------------------------------------------------
// 主动请求buff列表
public static function request_get_buff() : void
{
	var req : req_get_buff = new req_get_buff();
	NetHelper.Send(req);
}
//--------------------------------------------------
// 添加buff
private static function addBuff(data : player_buff_data) : void
{
	var buff : BuffInfo = new BuffInfo();
	buff.data = data;
	buff.saveTime = SysTimer.getCurTime();
	mBuffList.Add(buff);
}
//--------------------------------------------------
// 根据id获取buff
public static function getBuff(id : int) : BuffInfo
{
	for (var buff : BuffInfo in mBuffList)
	{
		if (id == buff.data.id)
			return buff;
	}
	return null;
}
//--------------------------------------------------
// 根据id获取未过期的buff
public static function getValidBuff(id : int) : BuffInfo
{
	var buff : BuffInfo = getBuff(id);
	if (null == buff)
		return null;
	
	var second = getLeftSecond(buff);
	if (second >= buff.data.rest_time)	// 过期
		return null;
	
	return buff;
}
//--------------------------------------------------
// 将秒数转化成字符串返回
public static function convertSecondToString(time : int) : String
{
	var hour : int = time / 3600;
	var minite : int = time % 3600 / 60;
	var second : int = time % 3600 % 60;
	var str : String = "";
	// 分隔符
	var splitVar : String = ":";
	if(hour < 10)
		str += "0" + hour + splitVar;
	else
		str += hour + splitVar;
	if(minite < 10)
		str += "0" + minite + splitVar;
	else
		str += minite + splitVar;		
	if(second < 10)
		str += "0" + second;
	else
		str += second;		
	return str;
}
//---------------------------------------------------
// 计算buff剩余时间
public static function getLeftSecond(buff : BuffInfo) : int
{
	// 当前时间 - buff保存时间,再与buff的剩余时间比较
	var differ : System.TimeSpan = Global.subtractStime(SysTimer.getCurTime(), buff.saveTime);
	return Mathf.FloorToInt(differ.TotalSeconds);
}

public static function getBuffList() : Array
{
	return mBuffList;
}
//---------------------------------------------------
// 读取xml中的数据，返回BuffRow
public static function getBuffRow(id : int) : NewBuffRow
{
	return ResManager.LgtMgr.getBuffRow(id);
}
//---------------------------------------------------
// 根据现有某一类的buff取得BuffRow
public static function getBuffRowByType(type : int) : NewBuffRow
{
	var buff : BuffInfo = getBuffByType(type);
	if(buff == null)
		return null;
	var buffRow : NewBuffRow = getBuffRow(buff.data.id);
	if(buffRow != null)
		return buffRow;
	return null;		
}
//---------------------------------------------------
// 根据类型获取未过期的buff
public static function getBuffByType(type : int) : BuffInfo
{
	removeTimeoutBuff();
	for(var buff : BuffInfo in mBuffList)
	{
		var buffRow : NewBuffRow = getBuffRow(buff.data.id);
		if(buffRow.type == type)
			return buff;
	}
	return null;
}
//---------------------------------------------------
// 移除某一类buff
private static function removeBuffByType(type : int) : BuffInfo
{
	for(var i : int = 0; i < mBuffList.length; i++)
	{
		var buff : BuffInfo = mBuffList[i];
		var buffRow : NewBuffRow = getBuffRow(buff.data.id);
		if(buffRow.type == type)
			mBuffList.RemoveAt(i);
	}
}
//---------------------------------------------------
// 移除缓存中过期的buff
public static function removeTimeoutBuff() : void
{
	// 如果有移除过期buff，则通知界面刷新BUFF图标
	var refreshIcon : boolean = false;
	for (var i : int = 0; i < mBuffList.length; i++)
	{
		var buff : BuffInfo = mBuffList[i];
		var second : int = getLeftSecond(buff);
		if(second > buff.data.rest_time)
		{
			mBuffList.RemoveAt(i);
			refreshIcon = true;
		}
	}
	if(refreshIcon)
	{
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.REFRESH_BUFF_ICON));
	}
}
//---------------------------------------------------
// 处理豪华卡buff
public static function handleDecorateCardBuff() : void
{
	if(isExistDecorateCard() && DataCenter.isInSelfHouse())
	{
		iGUICode_MainUI.getInstance().diamond_text2.labelColor = Color.green;
		var buff : BuffInfo = getBuffByType(1);
		var time : Timer = new Timer((buff.data.rest_time) * 1000, 1);
		time.addEventListener(TimerEvent.TIMER, resetDecorateText);
		time.Start();
	}
	else
	{
		resetDecorateText();
	}
}
//---------------------------------------------------
// 重置豪华度颜色
public static function resetDecorateText()
{
	iGUICode_MainUI.getInstance().diamond_text2.labelColor = Color.white;
}
//---------------------------------------------------
// 是否存在豪华卡buff
public static function isExistDecorateCard() : boolean
{
	var buff : BuffInfo = getBuffByType(1);
	if(buff != null)		// 有豪华卡buff
		return true;
	else
		return false;
}