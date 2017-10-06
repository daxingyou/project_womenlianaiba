/*--------------------------------------------------
灯光属性脚本,主要为了编辑用(2012/8/27 create by hezhr)
--------------------------------------------------*/
#pragma strict



private var mOldDayMode : boolean = true;					// 旧的模式
public var DayMode : boolean = true;						// 白天模式
public var DayColor : Color = Color.white;					// 白天颜色
public var DayIntensity : float = 0.0f;						// 白天强度
public var DayRange : float = 0.0f;							// 白天范围(方向光没用到)
public var DayAngle : int = 0;								// 白天角度(聚光有用到)
public var NightColor : Color = Color.white;				// 晚上颜色
public var NightIntensity : float = 0.0f;					// 晚上强度
public var NightRange : float = 0.0f;						// 晚上范围(方向光没用到)
public var NightAngle : int = 0;							// 晚上角度(聚光有用到)
public var Floor : int = 0;									// 楼层编号
public var Room : int = 0;									// 房间编号



function Update()
{
	changeDayNight();
}
//--------------------------------------------------
// 切换白天/晚上
private function changeDayNight() : void
{
	if (DayMode)	// 当前为白天模式
	{
		if (mOldDayMode)	// 不是刚从晚上模式切换过来
		{
			setDayProperty();
		}
		else				// 刚从晚上模式切换过来
		{
			mOldDayMode = true;
			setDayInspector();
		}
	}
	else			// 当前为晚上模式
	{
		if (mOldDayMode)	// 刚从白天模式切换过来
		{
			mOldDayMode = false;
			setNightInspector();
		}
		else				// 不是刚从白天模式切换过来
		{
			setNightProperty();
		}
	}
}
//--------------------------------------------------
// 设置白天属性
private function setDayProperty() : void
{
	DayColor = light.color;
	DayIntensity = light.intensity;
	DayRange = light.range;
	DayAngle = light.spotAngle;
}
//--------------------------------------------------
// 设置白天控制面板
private function setDayInspector() : void
{
	light.color = DayColor;
	light.intensity = DayIntensity;
	light.range = DayRange;
	light.spotAngle = DayAngle;
}
//--------------------------------------------------
// 设置晚上属性
private function setNightProperty() : void
{
	NightColor = light.color;
	NightIntensity = light.intensity;
	NightRange = light.range;
	NightAngle = light.spotAngle;
}
//--------------------------------------------------
// 设置晚上控制面板
private function setNightInspector() : void
{
	light.color = NightColor;
	light.intensity = NightIntensity;
	light.range = NightRange;
	light.spotAngle = NightAngle;
}
//--------------------------------------------------
// 穿透光初始
public function initPassLight(plr : PassLightRes, day : boolean) : void
{
	DayColor = Color(plr.dColor.x/255.0f, plr.dColor.y/255.0f, plr.dColor.z/255.0f, 1.0f);
	DayIntensity = plr.dInte;
	DayRange = plr.dRange;
	NightColor = Color(plr.nColor.x/255.0f, plr.nColor.y/255.0f, plr.nColor.z/255.0f, 1.0f);
	NightIntensity = plr.nInte;
	NightRange = plr.nRange;
	Floor = plr.floor;
	Room = plr.room;
	
	if (day)
		setDayInspector();
	else
		setNightInspector();
	
	DayMode = day;
	mOldDayMode = day;
}
//--------------------------------------------------
// 方向光初始
public function initDirectLight(dlr : DirectLightRes, day : boolean) : void
{
	DayColor = Color(dlr.dColor.x/255.0f, dlr.dColor.y/255.0f, dlr.dColor.z/255.0f, 1.0f);
	DayIntensity = dlr.dInte;
	NightColor = Color(dlr.nColor.x/255.0f, dlr.nColor.y/255.0f, dlr.nColor.z/255.0f, 1.0f);
	NightIntensity = dlr.nInte;
	Floor = dlr.floor;
	Room = dlr.room;
	
	if (day)
		setDayInspector();
	else
		setNightInspector();
	
	DayMode = day;
	mOldDayMode = day;
}
//--------------------------------------------------
// 聚光初始
public function initSpotLight(slr : SpotLightRes, day : boolean) : void
{
	DayColor = Color(slr.dColor.x/255.0f, slr.dColor.y/255.0f, slr.dColor.z/255.0f, 1.0f);
	DayIntensity = slr.dInte;
	DayRange = slr.dRange;
	DayAngle = slr.dAngle;
	NightColor = Color(slr.nColor.x/255.0f, slr.nColor.y/255.0f, slr.nColor.z/255.0f, 1.0f);
	NightIntensity = slr.nInte;
	NightRange = slr.nRange;
	NightAngle = slr.nAngle;
	Floor = slr.floor;
	Room = slr.room;
	
	if (day)
		setDayInspector();
	else
		setNightInspector();
	
	DayMode = day;
	mOldDayMode = day;
}
//--------------------------------------------------
// 获取位置
public function getPos() : String
{
	var pos : Vector3 = transform.position;
	return pos.x.ToString() + " " + pos.y.ToString() + " " + pos.z.ToString();
}
//--------------------------------------------------
// 获取方向
public function getDir() : String
{
	var dir : Vector3 = Vector3(transform.rotation.x, transform.rotation.y, transform.rotation.z);
	return dir.x.ToString() + " " + dir.y.ToString() + " " + dir.z.ToString();
}
//--------------------------------------------------
// 获取白天灯光颜色
public function getDayColor() : String
{
	var col : Vector3 = Vector3(DayColor.r*255.0f, DayColor.g*255.0f, DayColor.b*255.0f);
	return col.x.ToString() + " " + col.y.ToString() + " " + col.z.ToString();
}
//--------------------------------------------------
// 获取白天灯光强度
public function getDayIntensity() : String
{
	return DayIntensity.ToString();
}
//--------------------------------------------------
// 获取白天灯光范围
public function getDayRange() : String
{
	return DayRange.ToString();
}
//--------------------------------------------------
// 获取白天灯光角度
public function getDayAngle() : String
{
	return DayAngle.ToString();
}
//--------------------------------------------------
// 获取晚上灯光颜色
public function getNightColor() : String
{
	var col : Vector3 = Vector3(NightColor.r*255.0f, NightColor.g*255.0f, NightColor.b*255.0f);
	return col.x.ToString() + " " + col.y.ToString() + " " + col.z.ToString();
}
//--------------------------------------------------
// 获取晚上灯光强度
public function getNightIntensity() : String
{
	return NightIntensity.ToString();
}
//--------------------------------------------------
// 获取晚上灯光范围
public function getNightRange() : String
{
	return NightRange.ToString();
}
//--------------------------------------------------
// 获取晚上灯光角度
public function getNightAngle() : String
{
	return NightAngle.ToString();
}
//--------------------------------------------------
// 获取楼层编号
public function getFloorNo() : String
{
	return Floor.ToString();
}
//--------------------------------------------------
// 获取房屋编号
public function getRoomNo() : String
{
	return Room.ToString();
}
//--------------------------------------------------


