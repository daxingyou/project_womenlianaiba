#pragma strict


private static var mTimeSpan : System.TimeSpan;	// 客户端与服务器的时间差值
//--------------------------------------------------
public static function init(st : stime) : void
{
	// 服务端时间
	var serverTime : System.DateTime = new System.DateTime(st.year, st.month, st.day, st.hour, st.minute, st.second);
	// 时间差值 = 客户端时间 - 服务器时间
	mTimeSpan = System.DateTime.Now.Subtract(serverTime);
}
//--------------------------------------------------
public static function getCurTime() : System.DateTime
{
	// 服务端时间 = 客户端时间 - 时间差值
	return System.DateTime.Now.Subtract(mTimeSpan);
}
//--------------------------------------------------


