// 花藤数据表的读取
#pragma strict
class FlowerTable
{
	private static var flowerInst : FlowerTable;
	static function GetInst()
	{
		if(flowerInst)
			return flowerInst;
		else
			return new FlowerTable();
	}
	
	// 根据花藤Id跟等级获取花藤数据
	function Get(flowerId : int, level : int) : FlowerRow
	{
		var flowerTable : Array = ResManager.LgtMgr.FlowerTable;
		for(var i = 0; i < flowerTable.length; i++)
		{
			var flowerRow : FlowerRow = flowerTable[i] as FlowerRow;
			if((flowerRow.flower_id == flowerId) && (flowerRow.level == level))
				return flowerRow;
		}
		
		return null;
	}
}