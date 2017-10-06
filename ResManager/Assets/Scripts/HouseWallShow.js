import System;

class HouseWallShow{
/** 房屋配件类型. 
@remarks 以下这些是预先定义的类型.(0-127)为保留类型.  用户自定义类型应从128开始
*/
enum HouseComponentPropertyType
{
	HCP_NONE				= 0,
	HCP_STATIC				= 1,			//简单的类型
	HCP_FLOOR				= 2,			//地板
	HCP_OUT_WALL			= 3,			//外墙
	HCP_IN_WALL				= 4,			//内墙
	HCP_ROOF				= 5,			//屋顶
	HCP_TCX					= 6,			//T脚线
	HCP_JIAJU				= 7,			//家具
};

/// 房屋的观察模式
enum HouseWatchMode
{
	HW_MODE_HIDE	= 0,		// 隐藏, 没这种观察模式. 调试需要而已
	HW_MODE_1		= 1,		// 观察模式1, 无墙
	HW_MODE_2		= 2,		// 观察模式2, 半墙
	HW_MODE_3		= 3,		// 观察模式3, 全墙
	HW_MODE_4		= 4,		// 观察模式4, 屋顶
};

/// 房屋部件被观察模式
enum CompBeWatchMode
{
	CW_MODE_ROOF	= 0,		// 显示到屋顶
	CW_MODE_INWALL	= 1,		// 显示到内墙
	CW_MODE_OUTWALL	= 2,		// 显示到外墙
	CW_MODE_COMM	= 3,		// 普通物件,全部观察.
	CW_MODE_LIMIT	= 4,		// 上限
};

var watchMode : int = HouseWatchMode.HW_MODE_2;
var downFloor = true;
var hasUpFloor : boolean;

var cam : Camera = Camera.Main;


private var BeWatchMode = [CompBeWatchMode.CW_MODE_COMM,
CompBeWatchMode.CW_MODE_COMM, 
CompBeWatchMode.CW_MODE_COMM, 
CompBeWatchMode.CW_MODE_OUTWALL, 
CompBeWatchMode.CW_MODE_INWALL, 
CompBeWatchMode.CW_MODE_ROOF, 
CompBeWatchMode.CW_MODE_COMM, 
CompBeWatchMode.CW_MODE_COMM];

//返回[flag, type, floor, room];
function parseOldDefMeshFile(baseName : String)
{
	var type : ushort;
	var floor : byte = 1;
	var room : byte = 0;

	var strVec = baseName.Split("_"[0]);
	
	var flag = false; 
	//for (var str : String in strVec) 
	for ( var i : int = 0; i < strVec.Length; i++ )
	{
		var str = strVec[i];
		
		if ( str == "groundbase" )
		{
			type = HouseComponentPropertyType.HCP_STATIC;
			flag = true;
		}
		else if ( str == "innerwall" || str == "inneredge" )
		{
			type = HouseComponentPropertyType.HCP_IN_WALL;
			flag = true;
		}
		else if ( str == "outwall" || str == "outedge" )
		{
			type = HouseComponentPropertyType.HCP_OUT_WALL;
			flag = true;
		}
		else if ( str == "floor" )
		{
			type = HouseComponentPropertyType.HCP_FLOOR;
			flag = true;
		}
		else if ( str == "roof" )
		{
			type = HouseComponentPropertyType.HCP_ROOF;
			flag = true;
		}
		else if ( str == "tcx" || str == "edgetcx" )
		{
			type = HouseComponentPropertyType.HCP_TCX;
			flag = true;
		}
		else if ( str == "jiaju" )
		{
			type = HouseComponentPropertyType.HCP_JIAJU;
			flag = true;
		}

	
		if ( flag )
		{
			var strnum : String = "NOT NUM";
			if ( strVec.Length > i+1 )
				strnum = strVec[i+1];
				
			var num : byte;
			if ( !byte.TryParse(strnum, num) )
			{
				flag = false;
				break;
			}
			
			floor = num/100;
			room = num%100;
			break;
		}
	}
	
	return [flag, type, floor, room];
}

function calcWatchMode(parent : Transform)
{
	cam = Camera.mainCamera;
	var nodes = parent.GetComponentsInChildren(Transform);
	for (var node : Transform in nodes)
	{
		//print(node.gameObject.name);
		var v = parseOldDefMeshFile(node.gameObject.name);
		if ( v[0] )	//flag : true
		{
			if ( node.renderer == null )
				continue;

			var type = v[1];
			var floor = v[2];
			var watch : int;
			if ( downFloor )
			{
				if ( floor == 1 )
					watch = watchMode;
				else
					watch = HouseWatchMode.HW_MODE_HIDE;
			}
			else
			{
				if ( floor == 1 )
					watch = HouseWatchMode.HW_MODE_4;
				else
					watch = watchMode;
			}
			
			if ( BeWatchMode[type] + watch > CompBeWatchMode.CW_MODE_LIMIT	)
			{
				node.renderer.enabled = true;
			}
			else if ( BeWatchMode[type] + watch == CompBeWatchMode.CW_MODE_LIMIT )
			{
				// 如果是外墙，计算隐藏
				if ( BeWatchMode[type] == CompBeWatchMode.CW_MODE_OUTWALL )
				{
					// 面对隐藏
					var nor : Vector3 = node.rotation * Vector3(1,0,0);
					var vec : Vector3 = node.position - cam.transform.position;
					// 由于u3d用的是左手定则, 所以这里必须倒过来设置
					if ( Vector3.Dot(vec, nor) < 0.0001 )
						node.renderer.enabled = false;
					else
						node.renderer.enabled = true;
				}
				else
				{
					node.renderer.enabled = true;
				}
			}
			else
			{
				node.renderer.enabled = false;
			}
		}
		else	//flag : false
		{
			if ( node.renderer	!= null )
				node.renderer.enabled = false;
		}
	}
}

function isHasUpFloor(parent : Transform) : boolean
{
	var nodes = parent.GetComponentsInChildren(Transform);
	for (var node : Transform in nodes)
	{
		//print(node.gameObject.name);
		var v = parseOldDefMeshFile(node.gameObject.name);
		if ( v[0] )	//flag : true
		{
			if ( node.renderer == null )
				continue;
				
			var floor = v[2];
			if ( floor == 2 )
				return true;
		}
	}
	return false;
}
}