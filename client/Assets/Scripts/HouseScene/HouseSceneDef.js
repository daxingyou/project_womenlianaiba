/*--------------------------------------------------
定义房屋相关类型(2012/5/24 modify by hezhr)
--------------------------------------------------*/
#pragma strict



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

/// 网格显示方式
enum GridDisplayMode
{
	GD_MODE_HIDE	= 0,		// 不显示, 隐藏用, 没有这种方式
	GD_MODE_GAME	= 1,		// 游戏中非家装模式也就是这种方式. 当然目前的效果和GD_MODE_HIDE一样
	GD_MODE_FITMENT	= 2,		// 只显示有特定属性的网格边框, 在游戏家装模式为这种方式
	GD_MODE_STYLE	= 3,		// 只用于编辑器 显示网格的边框和类型
	GD_MODE_CONNECTEDNESS	= 4,// 只用于编辑器 显示网格的边框和类型和房间号和连通性
};

/// 房屋系统的一些方法返回值, 根据这些值, 界面自行显示提示
enum HouseReturnValue
{
	HRV_FAIL		= 0,		// 失败
	HRV_OK			= 1,		// 成功

	// 摆放网格相关
	HRV_LAYED		= 2,		// 已经摆放
	HRV_NO_GRID_LAY	= 3,		// 没有网格放置
	HRV_WALL_STOP	= 4,		// 有墙体阻挡
	HRV_NEAR_WALL	= 5,		// 必须靠墙
	HRV_NO_LAY_SPACE= 6,		// 没有摆放空间
	HRV_NO_AUTO_LAYWALL	= 7,	// 不能自动靠墙

	// 拿取相关
	HRV_NO_LAYED	= 20,		// 没摆放
	HRV_NOTAKE_FRAME= 21,		// 框架部件不能拿取
	HRV_NOTAKE		= 21,		// 无法拿取

	// 摆放属性相关
	HRV_HAS_COMP_LAY= 40,		// 有物件摆放在上面
	HRV_NO_MATCH_LAYTYPE = 41,	// 放置属性不符
};

enum HouseGridType
{
	HGT_FRAME				= 1,			//框架网格
};

/** 房屋配件类型. 
@remarks 以下这些是预先定义的类型.(0-127)为保留类型.  用户自定义类型应从128开始
*/
enum HouseComponentPropertyType
{
	HCP_NONE				= 0,
	HCP_STATIC				= 1,			// 简单的类型
	HCP_FLOOR				= 2,			// 地板
	HCP_OUT_WALL			= 3,			// 外墙
	HCP_IN_WALL				= 4,			// 内墙
	HCP_ROOF				= 5,			// 屋顶
	HCP_TCX					= 6,			// T脚线
};

/// 家装模式
enum eFitmentMode
{
	FMM_NONE	= 0,
	FMM_ADD		= 1,		// 添加
	FMM_EDIT	= 2,		// 编辑

	FMM_CONUT	
};

/// 区域灯光类型
enum ZoneLightType
{
	ZLT_NONE,
	ZLT_ACTIVE,				// 主动光
	ZLT_PASS,				// 穿透光
	ZLT_DIRECT,				// 方向光
};

/// 主动光穿透类型, 可能不放在这里
enum PierceType
{
	PIERCE_NONE = 0,		// 不可穿透
	PIERCE_OUTDOOR = 1,		// 可穿透到室外
	PIERCE_INDOOR = 2,		// 可穿透到室内
};

public static var HOUSE_DEF_FLOOR_HEGHT : float = 2.8f; 		// 楼层默认高度(米)
public static var HOUSE_GRID_SIZE : float = 0.8f; 				// 房屋格子的边长(米)
public static var HOUSE_GRID_HALF_SIZE : float = 0.4f;			// 房屋格子的半径(米)

public static var HOUSE_BLOCKED_GRID_TYPE : int = 144; 		// 阻挡格子 
public static var HOUSE_ASSIST_GRID_TYPE : int = 130; 		// 室外辅助格子 
public static var HOUSE_VISIBLE_GRID_TYPE : int = 127; 		// 可见格子 

public static var WALL_FACE_COUNT : int = 4; 				// 格子有几面墙
public static var WALL_FACE_X : int = 0; 					// X墙
public static var WALL_FACE_NX : int = 2; 					// NX墙
public static var WALL_FACE_Z : int = 3; 					// Z墙
public static var WALL_FACE_NZ : int = 1; 					// NZ墙


