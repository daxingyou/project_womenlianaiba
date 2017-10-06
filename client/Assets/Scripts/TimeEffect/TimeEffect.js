#pragma strict
#pragma downcast
/*--------------------------------------------------
时效(2012/5/11 create by hezhr)
--------------------------------------------------*/



class TimeEffect
{
	private static var mInstance : TimeEffect = null;
	public static function getInstance() : TimeEffect
	{
		if (null == mInstance)
		{
			mInstance = new TimeEffect();
		}
		return mInstance;
	}
	//--------------------------------------------------
	// 获取物品时效信息
	public function getEffectTimeRow(id : int) : EffectTimeRow
	{
		var table : Hashtable = ResManager.LgtMgr.EffectTimeTable;
		if (table.ContainsKey(id))
		{
			return table[id] as EffectTimeRow;
		}
		throw Exception("TimeEffect -> getEffectTimeRow(int) -> not exist effect time '"+id+"'!");
	}
	//--------------------------------------------------
	// 获取剩余时间
	public function getRemainTime(del_time : stime) : System.TimeSpan
	{
		return Global.subtractStime(del_time, SysTimer.getCurTime());
	}
	//--------------------------------------------------
	// 获取剩余天数
	public function getRemainDays(del_time : stime) : int
	{
		var span : System.TimeSpan = Global.subtractStime(del_time, SysTimer.getCurTime());
		return Mathf.FloorToInt(span.TotalDays);
	}
	//--------------------------------------------------
	// 获取剩余分钟数
	public function getRemainMinutes(del_time : stime) : int
	{
		var span : System.TimeSpan = Global.subtractStime(del_time, SysTimer.getCurTime());
		return Mathf.FloorToInt(span.TotalMinutes);
	}
	//--------------------------------------------------
	// 获取剩余秒数
	public function getRemainSeconds(del_time : stime) : int
	{
		var span : System.TimeSpan = Global.subtractStime(del_time, SysTimer.getCurTime());
		return Mathf.FloorToInt(span.TotalSeconds);
	}
	//--------------------------------------------------
	public function isNull(tm : stime) : boolean
	{
		if (null == tm)
			return true;
		
		if (0==tm.year && 0==tm.month && 0==tm.day && 0==tm.hour && 0==tm.minute && 0==tm.second)
			return true;
		
		return false;
	}
	//--------------------------------------------------
	// 时效是否已到
	public function isMature(del_time : stime) : boolean
	{
//		showStime(del_time);
		if (Global.isStimeNull(del_time))
			return false;
		
		return Global.compareStime(SysTimer.getCurTime(), del_time) >= 0;
	}
	//--------------------------------------------------
	// 获取已购买的物品时效字符串
	public function getEffectTimeStr(it : Item) : String
	{
//		showStime(it._delTime);
		var effect_id : int = it._itemInfo.effect_time_id;
		if (0 == effect_id || Global.isStimeNull(it._delTime))	// 没有时效
			return "";
		
		var row : EffectTimeRow = getEffectTimeRow(effect_id);
		var effect_time_str : String = "";
		if (1 == row.type)	// 有效天数
		{
			var days : int = getRemainDays(it._delTime);
			if (days < 0)
			{
				days = 0;
			}
			effect_time_str = Define.remaintime + "： " + days + Define.day;
		}
		if (2 == row.type)	// 到期时间
		{
			effect_time_str = Define.duetime + "： " + it._delTime.year + Define.year + it._delTime.month + Define.month + it._delTime.day + Define.date;
		}
		if (3 == row.type)	// 有效分钟数
		{
			var minutes : int = getRemainMinutes(it._delTime);
			if (minutes < 0)
			{
				minutes = 0;
			}
			effect_time_str = Define.remaintime + "： " + minutes + Define.minute;
		}
		return effect_time_str;		
	}
	//--------------------------------------------------
	// 获取未购买的物品时效字符串
	public function getEffectTimeStr(item_id : int) : String
	{
		var it : ItemRow = ResManager.LgtMgr.getItemRow(item_id);
		var effect_id : int = it.effect_time_id;
		if (0 == effect_id)	// 没有时效
			return "";
		
		var row : EffectTimeRow = getEffectTimeRow(effect_id);
		var effect_time_str : String = "";
		if (1 == row.type)	// 有效天数
		{
			effect_time_str = Define.remaintime + "：" + row.effect_time + Define.day;
		}
		if (2 == row.type)	// 到期时间
		{
			var result = cutYMD(row.del_time);
			effect_time_str = Define.duetime + "： " + result[0] + Define.year + result[1] + Define.month + result[2] + Define.date;
		}
		if (3 == row.type)	// 有效分钟数
		{
			effect_time_str = Define.remaintime + "：" + row.effect_time + Define.minute;
		}
		return effect_time_str;
	}
	//--------------------------------------------------
	// 截取年月日,date: 20120903
	public function cutYMD(date : String) : String[]
	{
		var year : String = date.Substring(0, 4);
		var month : String = date.Substring(4, 2);
		var day : String = date.Substring(6, 2);
		
		return [year, month, day];
	}
	//--------------------------------------------------
	// 显示stime各个字段(调试用)
	public static function showStime(tm : stime) : void
	{
		Debug.LogWarning("=== showStime(stime): "+tm.year+"-"+tm.month+"-"+tm.day+"-"+tm.hour+"-"+tm.minute+"-"+tm.second);
	}
	public static function showStime(tm : System.DateTime) : void
	{
		Debug.LogWarning("=== showStime(System.DateTime): "+tm.Year+"-"+tm.Month+"-"+tm.Day+"-"+tm.Hour+"-"+tm.Minute+"-"+tm.Second);
	}
	//--------------------------------------------------
}


