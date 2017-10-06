#pragma strict

class SysLog
{
	static function Log (message : System.Object) : void
	{
		Debug.Log(message);
	}
	
	static function LogError (message : System.Object) : void
	{
		Debug.LogError(message);
	}
	
	static function LogWarning(message : System.Object) : void
	{
		Debug.LogWarning(message);
	}
}