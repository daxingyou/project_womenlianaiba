/* create by Y3
 * 全局阻塞方案
 * 只有一个实例
 * 记得调用一次startBlock就必须在调用一次endBlock. 否则程序会被卡死
 * 阻塞方法可以被多人同时调用.
 * 本来还在犹豫这个方案设计上多复杂, 结果发现压根就没东西. 你看, 代码就这么点.
 */
#pragma strict


private static var _block:int = 0;

public static function isBlock() : boolean
{
	return (_block!=0);
}

public static function startBlock(open_loading_ui : boolean) : void
{
	if (_block == 0)
	{
		NetHelper.Pause();
		// open ui
		if (open_loading_ui)
		{
			UI.getUI().StartLoading();
		}
	}

	_block++;
}

public static function endBlock() : void
{
	_block--;
	
	if (_block == 0)
	{
		NetHelper.Continue();
		// close ui
		UI.getUI().EndLoading();
	}
}

