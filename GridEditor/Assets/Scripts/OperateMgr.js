#pragma strict
public enum OperateType
{
	Clean = 0,          // 清空所有属性
	Room,          // 编辑房屋
	Wall,           // 编辑墙壁
	Grid            // 编辑网格
}

public enum GridIndexType
{
	frame = 0,				// 框架
	indoor_floor = 1,		// 室内地板
	balcony,				// 阳台
	outdoor_auxiliary,		// 室外辅助
	stop_grid,				// 阻挡网格
	indoor_door,			// 室内专用门
	outdoor_door,			// 室外专用门
	outdoor_floor,			// 室外地板
	stop_floor1,			// 阻挡地板1
	stop_floor2,			// 阻挡地板2
	light_door,				// 带光源的门
	transmit_point,			// 传送点
}

public enum RoomIndexType
{
	zero = 0,
	one = 1,
	two,
	three,
	four,
	five,
	six,
	seven,
	eight,
	nine,
	ten,
	eleven,
	twelve,
	thirteen,
	fourteen,
	fifteen,
	sixteen,
	seventeen,
	eighteen,
	nineteen,
	twenty
}

public var operate : OperateType = OperateType.Wall;
public var gridTypeIndex : GridIndexType;
public var room : RoomIndexType;