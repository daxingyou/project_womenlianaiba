/*--------------------------------------------------
家具数据处理(2012/2/14 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast


//--------------------------------------------------
// 获取家具菜单项,id:家具部件id
public static function getFurniMenuRow(id : int) : FurniMenuRow
{
	var table : Hashtable = ResManager.LgtMgr.FurniMenuTable;
	if (table.ContainsKey(id))
	{
		return table[id];
	}
	return null;
}
//--------------------------------------------------
// 获取家具有效的菜单,id:家具部件id
public static function getFurniMenu(id : int) : Array
{
	var menu_arr : Array = new Array();
	var row : FurniMenuRow = getFurniMenuRow(id);
	if (row)
	{
		menu_arr.Add(row.func1);
		menu_arr.Add(row.func2);
		menu_arr.Add(row.func3);
		menu_arr.Add(row.func4);
		menu_arr.Add(row.func5);
		menu_arr.Add(row.func6);
		menu_arr.Add(row.func7);
		menu_arr.Add(row.func8);
		menu_arr.Add(row.func9);
		menu_arr.Add(row.func10);
		menu_arr.Add(row.func11);
		menu_arr.Add(row.func12);
		menu_arr.Add(row.func13);
		menu_arr.Add(row.func14);
		menu_arr.Add(row.func15);
	}
	return menu_arr;
}
//--------------------------------------------------
// 获取家具交互项,id:对应家具菜单表的func1,func2...
public static function getFurniInteractRow(id : int) : FurniInteractRow
{
	var table : Hashtable = ResManager.LgtMgr.FurniInteractTable;
	if (table.ContainsKey(id))
	{
		return table[id];
	}
	throw "Error: FurnitureDataHandler -> getFurniInteractRow(int) -> can't find id '"+id+"'!";
}
//--------------------------------------------------
// 获取家具动画项,id:对应家具互动表的furni_ani
public static function getFurniAnimationRow(id : int) : FurniAnimationRow
{
	var table : Hashtable = ResManager.LgtMgr.FurniAnimationTable;
	if (table.ContainsKey(id))
	{
		return table[id];
	}
	throw "Error: FurnitureDataHandler -> getFurniAnimationRow(int) -> can't find id '"+id+"'!";
}
//--------------------------------------------------

