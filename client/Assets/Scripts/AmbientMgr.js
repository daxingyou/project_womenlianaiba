#pragma strict
#pragma downcast


// 环境模式
enum AmbientMode
{
	AM_NORMAL,				// 支持自动切换昼夜,支持渐变
	AM_CHANGE,				// 支持自动切换昼夜,不支持渐变;例如花藤模式
	AM_GRADUAL,				// 不支持自动切换昼夜,支持渐变;例如家装模式
	AM_NONE,				// 不支持自动切换昼夜,不支持渐变
}


//--------------------------------------------------
private static var mInstance : AmbientMgr = null;
function Awake()
{
	mInstance = this;
}
public static function getSingleton() : AmbientMgr
{
	if (null == mInstance)
		throw "AmbientMgr -> instance is null.";
	
	return mInstance;
}
//--------------------------------------------------
// 配置参数(供策划在编辑器里修改)
public var Schedule : String = "(6:00:00,1)(18:00:00,0)";						// 昼夜切换时间表,1:白天,0:晚上
public var GradualChangeTime : float = 3.0f;									// 环境光渐变时间
public var DefaultDayAmbient : Color = Color(0.8f, 0.8f, 0.87f, 1.0f);			// 默认白天环境光
public var DefaultNightAmbient : Color = Color(0.07f, 0.09f, 0.17f, 1.0f);		// 默认夜晚环境光
public var FlowerAmbient : Color = Color(0.31f, 0.31f, 0.31f, 1.0f);			// 花藤环境光
// 当前环境参数
private var mOpenFog : boolean = false;											// 是否打开雾
private var mDayFogColor : Color = Color(0.5f, 0.5f, 0.5f);						// 白天雾颜色
private var mDayFogDensity : float = 0.0015f;									// 白天雾密度
private var mDayFogStart : float = 0.0f;										// 白天雾开始点
private var mDayFogEnd : float = 300.0f;										// 白天雾结束点
private var mDayAmbient : Color = DefaultDayAmbient;							// 白天环境光
private var mDaySky : Material = null;											// 白天天空盒
private var mNightFogColor : Color = Color(0.0f, 0.0f, 0.0f);					// 夜晚雾颜色
private var mNightFogDensity : float = 0.0015f;									// 夜晚雾密度
private var mNightFogStart : float = 0.0f;										// 夜晚雾开始点
private var mNightFogEnd : float = 300.0f;										// 夜晚雾结束点
private var mNightAmbient : Color = DefaultNightAmbient;						// 夜晚环境光
private var mNightSky : Material = null;										// 夜晚天空盒
// 保存当前场景的昼夜环境光
private var mSceneDayAmbient : Color = DefaultDayAmbient;
private var mSceneNightAmbient : Color = DefaultNightAmbient;
// 控制参数
private var mMode : AmbientMode = AmbientMode.AM_NORMAL;						// 环境模式
private var mDayNight : boolean = true;											// 当前模式的昼夜标识
private var mBeginGradual : boolean = false;									// 开始渐变标识
private var mBeginTime : float = 0.0f;											// 开始渐变时间
private var mTimeDistance : int = 0;											// 昼夜切换时间点到当前时间的长度
private var mRealDayNight : boolean = true;										// 当前实际的昼夜标识
private var mRefreshTime : float = 0.0f;										// 刷新的时间
private var mAutoChangeDayNight : boolean = true;								// 是否自动切换昼夜
public static var StartFlag : boolean = false;									// 
//--------------------------------------------------
function Update()
{
	if (false == StartFlag || false == mAutoChangeDayNight)
		return;
	
	// step1:灯光渐变
	gradualChange();
	// step2:自动切换
	autoChange();
}
//--------------------------------------------------
// 复位环境
public function resetAmbient()
{
	openFog(false);
	setSky(null, null);
	setSceneAmbient(DefaultDayAmbient, DefaultNightAmbient);
	setAutoDayNightChange(true, mRealDayNight);
}
//--------------------------------------------------
// 设置模式
public function setMode(mode : AmbientMode) : void
{
	mMode = mode;
	switch (mode)
	{
	case AmbientMode.AM_NORMAL:
		setAmbient(mSceneDayAmbient, mSceneNightAmbient);
		syncDayNight(false);
		break;
	case AmbientMode.AM_CHANGE:
		openFog(false);
		setAmbient(FlowerAmbient, FlowerAmbient);
		immediateChange(mDayNight);
		break;
	case AmbientMode.AM_GRADUAL:
		break;
	default:	// AmbientMode.AM_NONE
		break;
	}
}
//--------------------------------------------------
// 是否白天
public function isDayNight() : boolean
{
	return mDayNight;
}
//--------------------------------------------------
// 打开雾化
public function openFog(open : boolean) : void
{
	mOpenFog = open;
}
//--------------------------------------------------
// 设置雾化颜色
public function setFogColor(dayColor : Color, nightColor : Color) : void
{
	mDayFogColor = dayColor;
	mNightFogColor = nightColor;
}
//--------------------------------------------------
// 设置雾化密度
public function setFogDensity(dayDensity : float, nightDensity : float) : void
{
	mDayFogDensity = dayDensity;
	mNightFogDensity = nightDensity;
}
//--------------------------------------------------
// 设置雾化开始点,结束点
public function setFogStartEnd(dayStart : float, dayEnd : float, nightStart : float, nightEnd : float) : void
{
	mDayFogStart = dayStart;
	mDayFogEnd = dayEnd;
	mNightFogStart = nightStart;
	mNightFogEnd = nightEnd;
}
//--------------------------------------------------
// 设置场景环境光
public function setSceneAmbient(dayAmbient :Color, nightAmbient : Color) : void
{
	mSceneDayAmbient = dayAmbient;
    mSceneNightAmbient = nightAmbient;
    setAmbient(dayAmbient, nightAmbient);
}
//--------------------------------------------------
// 设置环境光
private function setAmbient(dayAmbient : Color, nightAmbient : Color) : void
{
	mDayAmbient = dayAmbient;
	mNightAmbient = nightAmbient;
}
//--------------------------------------------------
// 设置天空盒
public function setSky(daySky : Material, nightSky : Material) : void
{
	mDaySky = daySky;
	mNightSky = nightSky;
}
//--------------------------------------------------
// 设置是否自动切换昼夜
public function setAutoDayNightChange(auto : boolean, dn : boolean) : void
{
	mAutoChangeDayNight = auto;
	if (auto)
	{
		dn = refreshTimer();
	}
	changeDayNight(dn, true);
}
//--------------------------------------------------
// 切换昼夜
public function changeDayNight(dn : boolean, immediately : boolean) : boolean
{
	// 直接切换
	if (immediately)
	{
		mBeginGradual = false;
		mDayNight = dn;
		immediateChange(dn);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_END_CHANGE_DAYNIGHT), dn);
		return true;
	}
	// 渐变切换
	if (mBeginGradual || dn == mDayNight)
		return false;
	
	mBeginGradual = true;
	mBeginTime = Time.time;
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_BEGIN_CHANGE_DAYNIGHT), !dn);
	return true;
}
//--------------------------------------------------
// 同步昼夜
public function syncDayNight(refresh : boolean) : void
{
	changeDayNight(refresh ? refreshTimer() : mRealDayNight, true);
}
//--------------------------------------------------
// 刷新时间,返回当前昼夜状态,true,白天,false,晚上
private function refreshTimer() : boolean
{
	// 当前时间
	var now : DateTime = SysTimer.getCurTime();	
	// 获取昼夜时间切换点
	var daynight : String[] = Schedule.Split(["(", ")"], StringSplitOptions.RemoveEmptyEntries);
	// 默认假设下个昼夜切换点是明天
	var spts : String[] = daynight[0].ToString().Split([":", ","], StringSplitOptions.RemoveEmptyEntries);
	var h : int = int.Parse(spts[0]);
	var m : int = int.Parse(spts[1]);
	var s : int = int.Parse(spts[2]);
	var distance : int = (h*3600 + m*60 + s) + 3600*24 - (now.Hour*3600 + now.Minute*60 + now.Second);
	var day : boolean = (0 == int.Parse(spts[3]));		// true,当前为白天,false,当前为晚上
	// 判断下个昼夜切换点是否为今天
	for (var i:int=0; i<daynight.Length; ++i)
	{
		spts = daynight[i].ToString().Split([":", ","], StringSplitOptions.RemoveEmptyEntries);
		h = int.Parse(spts[0]);
		m = int.Parse(spts[1]);
		s = int.Parse(spts[2]);
		var dist : int = (h*3600 + m*60 + s) - (now.Hour*3600 + now.Minute*60 + now.Second);
		if (dist > 0)		// 下个昼夜切换点是今天
		{
			distance = dist;
			day = (0 == int.Parse(spts[3]));
			break;
		}
	}
	// 测试用
//	distance = 10;
//	day = !mRealDayNight;
	// 保存数据
	mTimeDistance = distance;
	mRealDayNight = day;
	mRefreshTime = Time.time;
	// 返回当前昼夜状态
	return day;
}
//--------------------------------------------------
// 立即改变
private function immediateChange(dn : boolean) : void
{
    RenderSettings.ambientLight = dn ? mDayAmbient : mNightAmbient;
    RenderSettings.skybox = dn ? mDaySky : mNightSky;
    RenderSettings.fog = mOpenFog;
    if (mOpenFog)
    {
    	RenderSettings.fogMode = FogMode.Linear;
    	RenderSettings.fogColor = dn ? mDayFogColor : mNightFogColor;
    	RenderSettings.fogStartDistance = dn ? mDayFogStart : mNightFogStart;
    	RenderSettings.fogEndDistance = dn ? mDayFogEnd : mNightFogEnd;
    }
}
//--------------------------------------------------
// 渐变,每帧监听
private function gradualChange() : void
{
	if (false == mBeginGradual)
		return;
	
	var distance : float = Time.time - mBeginTime;
	if (distance < GradualChangeTime)	// 环境光渐变中
	{
		if (AmbientMode.AM_NORMAL == mMode || AmbientMode.AM_GRADUAL == mMode)		// 支持渐变模式
		{
			var per : float = distance * 1.0f / GradualChangeTime;
			if (mDayNight)	// 白天
			{
				RenderSettings.ambientLight = mDayAmbient - per * (mDayAmbient - mNightAmbient);
			}
			else			// 夜晚
			{
				RenderSettings.ambientLight = mNightAmbient + per * (mDayAmbient - mNightAmbient);
			}
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_IN_CHANGE_DAYNIGHT), per);
		}
	}
	else	// 环境光渐变结束
	{
		mBeginGradual = false;
		mDayNight = !mDayNight;
		immediateChange(mDayNight);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_END_CHANGE_DAYNIGHT), mDayNight);
	}
}
//--------------------------------------------------
// 自动切换昼夜,每帧监听
private function autoChange() : void
{
	if (Time.time - mRefreshTime < mTimeDistance)
		return;
	
	// step1:刷新定时器
	refreshTimer();
	// step2:自动切换
	if (AmbientMode.AM_NORMAL == mMode || AmbientMode.AM_CHANGE == mMode)	// 支持自动切换昼夜模式
	{
		changeDayNight(mRealDayNight, false);
	}
}
//--------------------------------------------------


