#pragma strict
// 数据中心

//格子信息
public class GridType
{
	// 类型
	public var typeId : int;
	
	// 颜色
	public var color : Color;
}

public var GridTypes : GridType[];

// 根据TypeId获取格子类型
function GetGridType(typeId : int) : GridType
{
	for(var i = 0; i < GridTypes.length; i++)
	{
		var gridType : GridType = GridTypes[i] as GridType;
		if(gridType.typeId == typeId)
			return gridType;
	}
	
	return null;
}

// 根据索引Id获取格子类型
function GetGridTypeByIndex(index : int) : GridType
{
	if(GridTypes.length >= index)
		return GridTypes[index];
	else
		return null;
}