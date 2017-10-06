#pragma strict
//
//配置文档管理 Config.txt
//
class ConfigMgr
{
	private static var CfgString : String = "";
	private static var iniObj : IniProcessor;
	
	static function Init(cfgStr : String)
	{
		CfgString = cfgStr;
		
		iniObj = new IniProcessor();
		iniObj.Ini();
	}
	
	//
	//获取配置文件的值
	//@cls: 主键
	//@key: 子键
	//
	static function GetValue(cls : String, key : String) : String
	{
		return iniObj.GetKeyValue(CfgString, cls, key);
	}
	
	//
	//获取配置文件的值
	//主键为默认 Variable
	//@key: 子键
	//
	static function GetValue(key : String) : String
	{
		return GetValue("Variable", key);
	}
}