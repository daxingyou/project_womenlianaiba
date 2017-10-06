#pragma strict

/* 注意
 * 使用和增加这些配置变量的时候, 请务必判断其变量的有效性. 因为在升级的时候可能会增加变量, 
 * 而以前编译的scene是没对应变量的.
 */

//--------------------------------------------------
// 房屋的xml
var HouseXML : TextAsset = null;
// 家具的xml.目前只有室外才有这样的家具列表, 房屋的家具都是由服务器发送过来.
var HouseCompXML : TextAsset = null;
// 房屋的节点名字
var HouseNodeName : String = null;
//--------------------------------------------------
// 允许日夜变化
var EnableDayNightChange : boolean = true;
// 保持白天/黑夜标识,只有当EnableDayNightChange为false时,此标识才会有用
var DayNight : boolean = true;
// 白天环境光颜色
var AmbientColor1 : Color = Color(0.8f, 0.8f, 0.87f, 1.0f);
// 夜晚环境光颜色
var AmbientColor2 : Color = Color(0.07f, 0.09f, 0.17f, 1.0f);
// 允许使用天空盒和雾
var EnableUseSkyBoxAndFog : boolean = false;
// 白天天空盒
var SkyBox1 : Material = null;
// 白天雾颜色
var FogColor1 : Color = Color(0.5, 0.5, 0.5);
// 白天雾的密度
var FogDensity1 : float = 0.0015f;
// 白天雾的起始距离（我们只使用线性雾）
var FogStartDistance1 : float = 0;
// 白天雾的结束距离
var FogEndDistance1 : float = 300;
// 夜晚天空盒
var SkyBox2 : Material = null;
// 夜晚雾颜色
var FogColor2 : Color = Color(0, 0, 0);
// 夜晚雾的密度
var FogDensity2 : float = 0.0015f;
// 夜晚雾的起始距离
var FogStartDistance2 : float = 0;
// 夜晚雾的结束距离
var FogEndDistance2 : float = 300;
//--------------------------------------------------
function Start()
{
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LOVE_SCENE_LOAD_OK));
	AmbientMgr.getSingleton().setAutoDayNightChange(EnableDayNightChange, DayNight);
}
//--------------------------------------------------


 