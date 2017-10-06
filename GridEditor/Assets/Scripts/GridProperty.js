#pragma strict
public class GridIndex
{
	var floor : int = 0;
	var x : int = 0;
	var z : int = 0;
	var height : float = 0.0f;
}

public var type : int = -1;			// 格子类型
public var roomType : int = -1;		// 房屋类型
public var index : GridIndex;  		// 格子位置
public var param1 : String = "";	// 连接其他格子的参数

public function clean()
{
	type = -1;
	roomType = -1;
}

public function setType(index:int)
{
	type = index;
}

public function setRoomType(index:int)
{
	roomType = index;
}