#pragma strict
#pragma downcast
import System.Globalization;

////// 注意：表里的字段不要带无符号的类型,都用有符号的类型,如:用int,而不要用uint或ushort之类的类型
//每日活跃表
class DailyRewardRow{
	var id : int;
	var desc : String;
	var add_score : int;
	var max_score : int;
}

//--特权房屋表
class SpecialHouseRow implements System.IComparable{
	var id : int;
	var house_tplt_id : int;
	var q_coin : float;
	var count : int;
	
	public final function CompareTo(val : Object) : int{
		var _val : SpecialHouseRow = val as SpecialHouseRow;
		if(this.id < _val.id){
			return -1;
		}
		if(this.id > _val.id){
			return 1;
		}
		return 0;
	}
}
// 玩家特殊权限表player_special_house_tplt.xml
class PlayerSpecialHouseRow
{
	var id : int;
	var unlock_house_ids : Array = new Array();
	var love_coin : int;
	var desc : String;
	var name : String;
	var icon : String;
	var big_icon : String;
	var decoration : int;
	var furniture_count : int;
	var is_show : int;
}
//--房屋等级产权表
class HouseRightRow{
	var grade : int;
	var desc : String;
	var money_type : int;
	var money : int;
	var material1_shop_id : int;
	var material1 : int;
	var num1 : int;
	var material2_shop_id : int;
	var material2 : int;
	var num2 : int;
	var material3_shop_id : int;
	var material3 : int;
	var num3 : int;
	var material4_shop_id : int;
	var material4 : int;
	var num4 : int;
	var icon : String;
	var hover_icon : String;
}
//--自身动作表
class SelfAnimationRow{
	var id : int;
	var ani_name : String;
	var loop_type : int;
	var extend_type : int;
	var btn_n_icon : String;
	var btn_h_icon : String;
	var btn_p_icon : String;
	var tip : String;
}
//--系统消息表
class SysMsgRow
{
	var msg_id:int;
	var msg_content:String;
	var msg_type:int;
}

// 格子信息
class GridInfo
{
	var x : int;
	var z : int;
	
	function GridInfo(){}
	
	function GridInfo(gx : int, gz : int)
	{
		x = gx;
		z = gz;
	}
}

// 家具基础表,house_comp.xml
class HouseCompRow
{
	var id : int;							// 部件id
	var type : int;							// type(1:普通家具2:花盆)
	var name : String;						// 部件名
	var prop_id : int;						// 房屋部件属性
	var pos : Vector3;						// 位移
	var rot : Quaternion;					// 旋转
	var scale : Vector3;					// 缩放
	var model : String;						// 模型
	var cull_level : int;					// 剔除显示的物件等级。 （0－10） 0为不剔除
	var particle : String;					// 粒子模型
	var particle_pos : Vector3;				// 粒子位置
}

// 家具属性表,HouseCompProp.xml
class HouseCompPropRow
{
	var PropID : int;						// 属性唯一id
	var Name : String;						// 属性名称
	var BeWatchMode : int;					// 被观察模式
	var HoldGrid : Array = new Array();		// 占据网格
	var StopGrid : Array = new Array();		// 阻挡网格
	var LayGrid : Array = new Array();  	// 摆放网格
	var SelfHeight : float;					// 自身高度(厘米)	
	var OffsetHeight : float;				// 偏移高度(厘米)
	var AcceptLay : int;					// 可放置其上的类型(用位表示)
	var LayType : int;						// 放置类型(用位表示)
	var CanRep : boolean;					// 可否被替换
	var LightID : int;						// 携带光源
	var HoldType : int;						// 占据类型，可用这来判断是否是靠墙物件
}

// 格子属性表,HouseGridType.xml
class HouseGridTypeRow
{
	var TypeID : int;				// 类型唯一ID
	var Name : String;				// 属性名称
	var ColorSign : Color;			// 网格的颜色标志
	var ShowGridFitment : boolean;	// 在家装模式显示网格外框
	var AcceptLay : int;			// 可放置其上的类型(用位表示)
	var InDoor : boolean;			// 属于室内或室外
};

// 房屋总表,house_tplt.xml
class PlayerHouseRow implements System.IComparable
{
	var id : int;					// 唯一标识
	var	name : String;				// 名称
	var	level : int;				// 等级
	var	type : int;					// 类型
	var model : String;				// 房屋模型
	var	house_furniture : String;	// 默认家具表id,对应default1.xml表
	var born_id : int;				// 对应出生表id
	var	max_players : int;			// 容纳最大玩家数
	var preview_born : int;			// 预览出生点,对应出生表
	var struct_info : String;		// 房屋结构信息
	var right_grade : int;			// 房屋等级
	var is_single : int;
	var icon : String;
	var big_icon : String;
	var tip : String;
	var internal_decoration : int;
	var max_furniture : int;		// 家具上限
	var max_flowerpot : int;		// 限制花盆数量
	var bg_music : String;			// background music
	var max_guest : int;			// 最多客人上限
	var guests : Array = new Array();	// 可选客人列表
	var waiter_pos : Vector3;		// 侍者位置
	var waiter_rotate : int;		// 侍者朝向
	var love_coin : int;			// 搬家恋爱币花费
	
	public final function CompareTo(_val : Object) : int{
		var row_y : PlayerHouseRow = _val as PlayerHouseRow;
		if(this.id < row_y.id)
			return -1;
		if(this.id > row_y.id)
			return 1;
		
		return 0;
	}
};

// 出生表,born.xml
class BornRow
{
	var id : int;				// 唯一标识
	var pos : Vector3;			// 出生点
	var dir : float;			// 人物朝向
	var lookat : Vector3;		// 摄像机焦点
	var pitch : float;			// 摄像机绕Y轴旋转角度
	var yaw : float;			// 摄像机绕X轴旋转角度
	var zoom : float;			// 摄像机的远近
	var farclip : float;		// 摄像机的最远裁剪平面距离
	var field : float;			// 摄像机的视角角度
	var watch_mode : int;		// 房屋观察模式,数值参照HouseWatchMode
	var view_floor : int;		// 显示的楼层,数值代表显示第几楼
}

// 新版的灯光表. Light.xml
class WebLightRow
{
	var ID : int;				// 唯一标识
	var Name : String;			// 名称
	var Pos : Vector3;			// 位移
	var Dir : Vector3;			// 方向
	var Type : int;				// 灯光类型
	var Colour : Color;			// 颜色
	var Intensity : float;		// 强度
	var Range : float;			// 范围
	var SpotAngle : float;		// 聚光灯角度
};

//物品类型, 对应ItemRow.type
enum ItemType
{
	Clothes = 1,				// 衣服
	Furniture = 2,				// 家具
	Prop = 3,					// 道具
	PropCantUse = 4,			// 不可使用道具
	ClothesGift = 5,			// 服装礼包
	ComposePaper = 6,			// 炼金图纸
	ComposeMaterial = 7,		// 炼金材料
	FurnitureGift = 8,			// 家具礼包
	MaterialGift = 9, 			// 材料礼包
	Seed = 10,					// 种子
	Food = 11,					// 食物
}

// 物品总表,item_tplt.xml
class ItemRow
{
	var id : int;						// 唯一标识
	var name : String;					// 名称
	var type : int;						// 类型
	var use_type : int;					// 使用类型
	var icon : String;					// 图片
	var overlap : int;					// 堆叠数
	var sell_price : int;				// 售价
	var sub_id : int;					// 子id
	var bind : int;						// 绑定标识
	var effect_time_id : int;			// 时效id
	var property_id : int;				// 属性id
	var use_level : int;				// 使用等级
	var level : int;					// item level
	var upgrade_id : int;				// 升级表id
};

// 物品说明描述表
class ItemDescriptionRow
{
	var item_id : int;			// 对应ItemRow的id
	var description : String;	// 说明
};

// 物品服装表,item_dress_tplt.xml
class ItemDressRow
{
    var id : int;                     // 唯一标识
    var name : String;                   // 名称
    var sex : int;                    // 性别
    var equip_pos : int;              // 装备的位置
    var equip_placeholder : int;      // 占位符
    var model : String;                  // 对应模型
    var model_body : String;             // 模型对应身体
    var place : int;                  // 存放方式
    var action : String;                 // 动作
    var particle : String;				// particle
    var attach_pos : String;			// particle attach
    var type1 : int;                  // 类型1
    var type2 : int;                  // 类型2
};


/** 商城、商店,sys_shop_tplt.xml
*/
class ShopCenterRow
{
	var goods_id : int;
	var item_id : int;
	var type : int;			 //同ShopCenterClassRow绑定，定同一类型即同一季物品
	var money_type : int;
	var price : int;
	var intro : String;
	var recommend : boolean; //商城专用
	var broadcast_id : int;
	var limit_level : int;	//level limit
	var visible : boolean;
	var newcomer : boolean; 
	var point : int;		//credit
};

/** store class
*/
class ShopCenterClassRow
{
	var id : int;
	var type : int;  //same with ShopCenterRow.type
	var buytype : int; //1,fitment 2,close 3,item
	var icon : String;
	var description : String;
	var newcomer : boolean;
	var auto_fitment : boolean;							// 在该类型下是否可以自动家装
	var unlock : boolean;								// 解锁标识,false,不需要解锁
	var unlock_level : int;								// 解锁所需等级
	var unlock_money : int;								// 解锁所需金钱
	var unlock_material : Array = new Array();			// 解锁所需材料,例如:"10011,10022"或者"10011"
	var unlock_material_count : Array = new Array();	// 解锁所需材料数量,例如:"1,2"或者"1"
	var unlock_material_shop_id : Array = new Array();	// 解锁所需材料的商品id
}

class FlowerRow
{
	var id : int;
	var flower_id : int;
	var level : int;
	var grow : int;
	var model : String;
	var particle : String;
}

//table holiday gift
class HolidayGift {
	var sequence_id : int;
	var start_day : String;
	var duration : int;
	var group_id : int;
	var gift_type : int;
	var item_id : int;
	var count : int;
	var rate : int;
}

// 礼物盒子表,gift_box_tplt.xml
class GiftBoxRow
{
	var id : int;			// 唯一标识
	var type : int;			// 类型
	var name : String;		// 名字
	var price : int;		// 价格
	var model : String;		// 模型
	var icon : String;		// 图标
	var intro : String;		// 说明
}

// 家具使用菜单表,loop_menu.xml
class FurniMenuRow
{
	var id : int;		// 唯一标识
	var func1 : int;	// 功能一,对应家具交互表的id
	var func2 : int;	// 功能二
	var func3 : int;	// 功能三
	var func4 : int;	// 功能四
	var func5 : int;	// 功能五
	var func6 : int;	// 功能六
	var func7 : int;	// 功能七
	var func8 : int;	// 功能一,对应家具交互表的id
	var func9 : int;	// 功能二
	var func10 : int;	// 功能三
	var func11 : int;	// 功能四
	var func12 : int;	// 功能五
	var func13 : int;	// 功能六
	var func14 : int;	// 功能七
	var func15 : int;	// 功能七
}

// 家具交互表,furni_interact.xml
class FurniInteractRow
{
	var id : int;							// 唯一标识
	var name : String;						// 交互名字
	var furni_ani : int;					// 家具动画id,对应家具动画表的id
	var menu_info : Array = new Array();	// 交互菜单,有多个家具动画(如床的动作:趟下,睡觉)时为2个int，当前动画编号/动画编号数目(参考有端的)
	var role_ani : Array = new Array();		// 角色动画名称
	var time : int;							// 播放时间
	var hide_part : Array = new Array();	// 角色隐藏部位
	var mosaic_pos : Array = new Array();	// 马赛克坐标
	var offset_pos : Array = new Array();	// 偏移坐标
	var role_face : int;					// 角色方向
	var use_range : int;					// 家具使用距离
	var use_face : String;					// 家具使用面朝向,策划填二进制数据
	var icon : Array = new Array();			// 图标
	var hint : String;						// 提示
}

// 家具动画表,furni_animation.xml
class FurniAnimationRow
{
	var id : int;							// 唯一标识
	var name : String;						// 名称
	var type : int;							// 动画类型
	var animation : Array = new Array();	// 骨骼动画
	var texture : Array = new Array();		// 纹理动画
	var particle : String;					// 粒子
	var particle_pos : Vector3;				// 粒子位置
	var loop : boolean;						// 是否循环
}

// qqhome gift tabel QQHomeGift.xml
class QQHomeGiftRow {
	var id : int;			//sequence id
	var level : int;		//qqhome level
	var sex : int;			//sex
	var gift1 : int;		//item1(item_id)
	var count1 : int;		//count1
	var gift2 : int;		//item2(item_id)
	var count2 : int;		//count3
	var gift3 : int;		//item2(item_id)
	var count3 : int;		//count3
	var gift_year : int;	//year qqhome(item_id)
	var count_year : int;	//count
}

// 道具使用表,props_item_tplt.xml
class PropUseRow
{
	var id : int;				// 唯一标识
	var target : int;			// 使用对象(1,对自己使用;2,对其他人使用;3,范围使用;4,对所有人使用)
	var is_del : boolean;		// 使用后是否删除(1,删除;0,不删除)
	var intro : String;			// 使用说明
	var animation : String;		// 播放指定的动画
	var ui : String;			// 指定的界面
	var audio : String;			// 播放指定的声音
	var msg : int;				// 显示指定的消息
	var script : String;		// 要执行的脚本
	var arguments : String;		// 参数
}

// 玩家任务表, player_task_tplt.xml
class PlayerTaskRow
{
	var task_id : int;			// 任务id
	var icon : String;			// 任务图标
	var title : String;			// 任务标题
	var describe : String;		// 任务目标
	//需求, 奖励列表相关. 客户端没用
	var reward_items : Array = new Array();			//奖励物品列表
	var reward_items_count : Array = new Array();	//奖励物品数量列表
	var diamond : int;			// 奖励水晶
	var experience : int;		// 奖励经验
	var hp : int;				// 奖励体力
	var is_show : int;			// 是否显示
	var q_coin : int;			// 立即完成需要的Q币
	var target1 : String;		// 目标1
	var target2 : String;		// 目标2
	var target3 : String;		// 目标3
	var type : int;				// 任务类型,1.新手任务;2.系列任务
	var need_player_level : int;		// 该任务所需玩家等级才能看得到
}

//table friend invite gift
class InviteGift {
	var sequence_id : int;
	var group_id : int;
	var gift_type : int;
	var item_id : int;
	var count : int;
	var rate : int;
}

//logon award gift
class LogonAward {
	var day : int;
	var diamond : int;
	var item_id : int;
	var count : int;
}

//物品时效表, item_effect_time_tplt.xml
class EffectTimeRow
{
	var id : int;						// 唯一标识
	var type : int;						// 时效类型
	var effect_time : int;				// 初始时效
	var trade_cut_time : int;			// 转手扣除
	var del_time : String;				// 到期时间
}

//buff table(todo:ext)
class BuffRow {
	var id : int;
	var duration : int;
	var effect_id : int;
}

//avatar effect table
class EffectAvatarRow {
	var id : int;
	var icon : String;
	var model : String;
}

//items make table
class ItemsMakeRow {
	var item_id : int;
	var produce_level : int;
	var diamond : int;
	var material_item : String;
	var finished_item : String;
	var success_rate : int;
	var experience : int;
}
class CommSceneRow
{
	var id : int;
	var name : String;
	var born_id : int;
	var scene_name : String;
	var type : int;				// 1.公共场景,2.酒吧场景
	var bg_music : String;		
}

//items make skill levelup table
class ItemsMakeLVUpRow {
	var level : int;
	var experience : int;
}

//plant seed table
class PlantSeedRow {
	var crop_id : int;
	var name : String;
	var price_type : int;
	var price : int;
	var level : int;
	var event_count : int;
	var ripe_time : int;
	var fruit_id : int;
	var count : int;
	var intro : String;
	var seedling : String;
	var fruit_model : String;
	var icon : String;
}

//plant lock table
class PlantLockRow {
	var number : int;
	var level : int;
	var coin : int;
	var item_id1 : int;
	var goods_id1 : int;
	var count1 : int;
	var item_id2 : int;
	var goods_id2 : int;
	var count2 : int;
	var item_id3 : int;
	var goods_id3 : int;
	var count3 : int;
	var item_id4 : int;
	var goods_id4 : int;
	var count4 : int;
}

//plant fruit row
class PlantFruitRow {
	var id : int;
	var seedID : int;
	var fruitID : int;
	var rate : int;
	var count : int;
	var maturity : String;
}

// 离婚表,divorce_tplt.xml
class DivorceRow
{
	var id : int;			// 唯一标识
	var level : int;		// 等级
	var cost : int;			// 花费
}

// 家具属性值表,furniture_additional_properties_tplt.xml
class FurniturePropertyRow
{
	var id : int;			// 唯一标识
	var decoration : int;	// 属性值
}

//npc logic table npc_tplt.xml
class NpcRow {
	var id : int;
	var sex : int;
	var name : String;
	var anim : String;
	var mode : int;
}

// 服装属性值表,item_dress_additional_properties_tplt.xml
class ClothesPropertyRow
{
	var id : int;			// 唯一标识
	var charm :	int;		// 魅力值
}

// 收集任务表,collect_task_tplt_mapping.xml
class CollectTaskRow
{
	var id : int;											// id
	var content : String;									// 任务面板里的显示内容
	var target : String;									// 任务目标
	var require_item : int;									// 任务需要的物品(单个)
	var require_item_count : int;							// 任务需要的物品数量
}

// 送货任务表,deliver_goods_task_tplt_mapping.xml
class DeliverGoodsTaskRow
{
	var id : int;											// id
	var content : String;									// 任务面板里的显示内容
	var npc_options : String;								// 任务目标的对话选项
	var npc_content : String;								// 任务目标的对话内容
	var target : String;									// 任务目标
	var npc_id : int;										// 任务目标的npc id
	var npc_name : String;									// 任务目标的npc名字
	var require_item : int;									// 任务需要的物品(单个)
}

// 对话任务表,dialogue_task_tplt_mapping.xml
class DialogueTaskRow
{
	var id : int;											// 唯一标识
	var content : String;									// 任务面板里的显示内容
	var npc_options : String;								// 任务目标的对话选项
	var npc_content : String;								// 任务目标的对话内容
	var target : String;									// 任务目标
	var npc_id : int;										// 任务目标的npc id
	var npc_name : String;									// 任务目标的npc名字
}

// 寻物任务表,find_item_task_tplt_mapping.xml
class FindItemTaskRow
{
	var id : int;											// 唯一标识
	var content : String;									// 任务面板里的显示内容
	var npc_options : String;								// 任务目标的对话选项
	var npc_content : String;								// 任务目标的对话内容
	var target : String;									// 任务目标
	var area_event_id : int;								// 任务目标的区域事件标识
	var map_name : String;									// 任务目标的地图名
	var reward_items : Array = new Array();					// 任务能获得的物品(多个)
}

// 功能任务表,function_task_tplt_mapping.xml
class FunctionTaskRow
{
	var id : int;											// 唯一标识
	var content : String;									// 任务面板里的显示内容
	var target : String;									// 任务目标
	var func_id : int;										// 任务需要的功能id
	var func_content : String;								// 任务需要的功能说明
	var func_count : int;									// 任务需要的功能数量
}

// 连环任务表,ring_task_tplt.xml
class RingTaskRow
{
	var ring_count : int;									// 环数
	var due_time : int;										// 任务限定时间
	var stop_require_item : int;							// 时间停止所需物品(单个)
	var stop_require_item_count : int;						// 时间停止所需物品数量
	var reward_items : Array = new Array();					// 获奖物品(多个)
	var reward_items_count : Array = new Array();			// 获奖物品数量
	var reward_diamond : int;								// 获奖水晶
	var reward_exp : int;									// 获奖经验
	var q_coin : int;										// 立即完成所需Q点
}

// friend intimate logic---intimate_level.xml
class FriendIntimateRow
{
	var level : int;
	var toplimit : int;
	var name : String;
	var desc : String;
	var icon : String;
}

// 墙壁地板材质部位替换表,wall_floor_repalce_part_tplt.xml
class WallFloorReplacePartRow
{
	var id : int;											// 房屋id
	var floors : Array = new Array();						// 需要指定替换材料名称的地板名称
	var floors_replace : Array = new Array();				// 材料名称
	var inner_walls : Array = new Array();					// 需要指定替换材料名称的内墙名称
	var inner_walls_replace : Array = new Array();			// 材料名称
	var outer_walls : Array = new Array();					// 需要指定替换材料名称的外墙名称
	var outer_walls_replace : Array = new Array();			// 材料名称
}

// 自动家装表,auto_fitment_tplt.xml
class AutoFitmentRow
{
	var house_id : int;										// 房屋id
	var scheme : int;										// 家具类型,对应系统商城表里的家具类型
	var furniture_id : int;									// 家具id
	var goods_id : int;										// 商城物品id
	var x : int;											// 格子x坐标
	var z : int;											// 格子z坐标
	var height : float;										// 摆放高度
	var face : int;											// 摆放朝向
	var floor : int;										// 摆放楼层
}

// merry  cost table, mateup_diamond.xml
class MerryCostRow {
	var level : int;		//level
	var diamond : int;		//diamond
}

//item upgrade
class ItemUpgradeRow {
	var id : int;			//item id
	var props : String;		//prop id
	var diamond : int;		//diamond
	var proVal : int;		//property value
	var productId : int;	//product item id
}

class RemedyRow {
	var level : int;		//item id
	var awards : String;		//prop id
}
// yy语音频道礼物表,yy_gift_tplt.xml
class YYGiftRow
{
	var id : int;								// 标识,和物品表的id对应
	var type : int;								// 礼物类别,1.普通,2.高级,3.豪华,4.道具
	var hot : boolean;							// 是否热门
	var price : int;							// 礼物价格
	var recv_price : int;						// 实际收到价格
	var probability : int;						// 概率
	var back_price : int;						// 返回价格
	var display_type : int;						// 表现类型,1.秀单张图,2.秀多张图(动画),3.显示模型,可以扩展
	var display_id : int;						// 礼物表现表id
}
// yy语音频道礼物表现表,yy_gift_display_tplt.xml
class YYGiftDisplayRow
{
	var id : int;								// 标识,对应礼物表id
	var num : int;								// 送礼的数量,这里根据数量而显示不同的图片,用来与玩家所选择的数量值进行比较
	var display : Array = new Array();			// 礼物的显示资源,例如:单张图"1.png.u3d",多张图(动画)"1.png.u3d,2.png.u3d,3.png.u3d",模型"1.prefab.u3d"或者"1.mod.u3d"
	var display_time : int;						// 礼物的显示时间,5000表示5秒
	var frame_rate : float;						// 每秒显示多少帧图片,当dispaly为"多张图(动画)"时,此字段要填
	var start_pos : Vector3;					// 随机起始位置,例如:2d图片"2,2,0",3d模型"2,2,2"
	var end_pos : Vector3;						// 随机结束位置,
}

//flower rock award
class FlowerRockAward {
	var nthtime : int;		//item id
	var diamond : int;		//prop id
	var exp : int;			//diamond
	var item_id : int;		//property value
	var item_count : int;	//product item id
	var love_coin : int;	//product item id
}

//flower free rock award
class FlowerFreeRockAward {
	var nthtime : int;		//item id
	var diamond : int;		//prop id
	var exp : int;			//diamond
	var item_id : int;		//property value
	var item_count : int;	//product item id
}

// 客人表,guest_tplt.xml
class GuestRow
{
	var id : int;
	var sex : int;		// 1.男性,2.女性
	var model : String;
	var name : String;
}

// 客人星星表,guest_star_tplt.xml
class GuestStarRow
{
	var id : int;			// 
	var star : String;		// 星星模型
}

// 召唤表,normal_sprite_tplt.xml
class NormalSpriteRow
{
	var id : int;
	var appraise : int;		// 评价分数
	var buff_id : int;		// 
	var model : String;		// 精灵模型
	var show : String;		// 开始显示时的粒子效果
	var dispear : String;	// 结束显示时的粒子效果
	var halo : String;		// 小精灵外圈的粒子效果
}

// 召唤升级表,sprite_upgrade_tplt.xml
class SpriteUpgradeRow
{
	var sprite_id : int;	// 召唤表中小精灵的id
	var level : int;		// 小精灵等级
	var show_count : int;	// 需要出现几次升级,当前格子表示升到下一个等级需要的经验
	var award_money : int;	// 水晶奖励
	var award_exp : int;	// 经验奖励
}

// 侍者表
class WaiterRow
{
	var id : int;
	var waiter_name : String;
	var waiter_lv : int;
	var player_lv : int;
	var explain : String;
	var coin_rate : float;
	var exp_rate : float;
	var item_drop_rate : float;
	var speciality_explain : String;
	var employ_money : int;
	var waiter_mod_name : String;
	var picture : String;
	var up_id : int;
	var up_coin : int;
	var up_house_lv : int;
}

// 新BUFF表
class NewBuffRow
{
	var id : int;
	var type : int;
	var duration : int;
	var normal_icon : String;
	var disable_icon : String;
	var hint : String;
	var sys_msg : String;
	var param : String;
}

// 派对食物表
class PartyFoodRow
{
	var id : int;
	var diamond : int;
	var hp : int;
	var point : int;
	var food_name : String;
	var model_name : String;
}

// alter by zlj 派对酒品表
class PartyDrinkRow
{
    var id            : int; // 酒ID
    var price         : int; // 消费的价格
    var type          : int; // 付费类型(1:水晶币， 2:爱币)
    var master_score  : int; // 请的人积分获得
    var guest_score   : int; // 客人积分获得
    var shout_count   : int; // 每天请客上限
    var shouted_count : int; // 每天被请上限
    var name          : String; // 酒的名字
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
*Xml数据表管理类
*维护各种Xml数据表
*/
class LogicTableManager
{
	public var InitFiles : TextAsset;			// 在编辑面板里挂接文件
	private var mTableMap : Hashtable = new Hashtable();
	private var mAynResMgr : AsynResourceMgr = null;
	private var mLoaderFiles : Array = new Array();
	// 
	private var mHouseCompTable : Hashtable = new Hashtable();
	private var mHouseCompPropTable : Hashtable = new Hashtable();
	var HouseGridTypeTable : Hashtable = new Hashtable();
	var PlayerHouseTable : Hashtable = new Hashtable();
	private var mBornTable : Hashtable = new Hashtable();
	var WebLightTable : Hashtable = new Hashtable();
	private var mItemTable : Hashtable = new Hashtable();
	private var mItemDescriptionTable : Hashtable = new Hashtable();
	var ItemDressTable : Hashtable = new Hashtable();
	var ShopCenterTable : Array = new Array();
	var ShopCenterClassTable : Array = new Array();
	var FlowerTable : Array = new Array();
	private var mSysMsgTable : Hashtable = new Hashtable();
	var HolidayGiftTable : Hashtable = new Hashtable();
	var GiftBoxTable : Hashtable = new Hashtable();
	var FurniMenuTable : Hashtable = new Hashtable();
	var FurniInteractTable : Hashtable = new Hashtable();
	var FurniAnimationTable : Hashtable = new Hashtable();
	var QQHomeGiftTable : Hashtable = new Hashtable();
	private var mPropUseTable : Hashtable = new Hashtable();
	private var mPlayerTaskTable : Hashtable = new Hashtable();
	var HouseRightTable : Hashtable = new Hashtable();
	var SpecialHouseTable : Hashtable = new Hashtable();
	private var mPlayerSpeicalHouseTable : Array = new Array();
	var DailyRewardTable : Hashtable = new Hashtable();
	var SelfAnimationTable : Hashtable = new Hashtable();
	var InviteGiftTable : Hashtable = new Hashtable();
	var LogonAwardTable : Hashtable = new Hashtable();
	var EffectTimeTable : Hashtable = new Hashtable();
	var BuffTable : Hashtable = new Hashtable(); 
	var EffectAvatarTable : Hashtable = new Hashtable();
	var ItemsMakeTable : Hashtable = new Hashtable();
	var ItemsMakeLVUpTable : Hashtable = new Hashtable();
	private var mCommSceneTable : Hashtable = new Hashtable();
	private var mPlantSeedTable : Array = new Array();
	var PlantFruitTable : Hashtable = new Hashtable();
	var DivorceTable : Hashtable = new Hashtable();
	private var mFurniturePropertyTable : Hashtable = new Hashtable();
	private var mClothesPropertyTable : Hashtable = new Hashtable();
	var NpcTable : Hashtable = new Hashtable();
	var MerryCostTable : Hashtable = new Hashtable();
	var FriendIntimateTable : Hashtable = new Hashtable();
	private var mItemUpgradeTable : Hashtable = new Hashtable();
	var RemedyTable : Hashtable = new Hashtable();
	var PlantLockTable : Hashtable = new Hashtable();
	var FlowerRockAwardTable : Hashtable = new Hashtable();
	var FlowerFreeRockAwardTable : Hashtable = new Hashtable();
	private var mCollectTaskTable : Hashtable = new Hashtable();
	private var mDeliverGoodsTaskTable : Hashtable = new Hashtable();
	private var mDialogueTaskTable : Hashtable = new Hashtable();
	private var mFindItemTaskTable : Hashtable = new Hashtable();
	private var mFunctionTaskTable : Hashtable = new Hashtable();
	private var mRingTaskTable : Hashtable = new Hashtable();
	private var mWallFloorReplacePartTable : Hashtable = new Hashtable();
	private var mAutoFitmentTable : Array = new Array();
	private var mYYGiftTable : Array = new Array();
	private var mYYGiftDisplayTable : Array = new Array();
	private var mGuestTable : Hashtable = new Hashtable();
	private var mGuestStarTable: Hashtable = new Hashtable();
	private var mNormalSpriteTable : Hashtable = new Hashtable();
	private var mSpriteUpgradeTable : Array = new Array();
	private var mWaiterTable : Hashtable = new Hashtable();
	private var mBuffTable : Hashtable = new Hashtable();
	private var mPartyFoodTable : Hashtable = new Hashtable();
	private var mPartyDrinkTable : Array = new Array(); // alter by zlj 派对请喝酒表
	//--------------------------------------------------
	private function Init() : void
	{
		for (var file : String in mLoaderFiles)
		{
			var loader : URLLoader = mAynResMgr.getLoader(Global.UrlRoot + file) as URLLoader;
			AddTable(loader.www.assetBundle.mainAsset as TextAsset);
		}
		// 加载各类表格
		LoadHouseCompTable();
		LoadHouseCompPropTable();
		LoadHouseGridTypeTable();
		LoadPlayerHouseTable();
		LoadBornTable();
		LoadWebLightTable();
		LoadItemTable();
		LoadItemDescriptionTable();
		LoadItemDressTable();
		LoadShopCenterTable();
		LoadShopCenterClassTable();
		LoadFlowerTable();
		LoadSysMsgTable();
		LoadHolidayGiftTable();
		LoadGiftBoxTable();
		LoadFurniMenuTable();
		LoadFurniInteractTable();
		LoadFurniAnimationTable();
		LoadQQHomeGiftTable();
		LoadPropUseTable();
		LoadPlayerTaskTable();
		LoadSelfAnimationTable();
		LoadInviteGiftTable();
		LoadLogonAwardTable();
		LoadEffectTimeTable();
		LoadHouseRightTable();
		LoadBuffTable();
		LoadEffectAvatarTable();
		LoadSpecialHouseTable();
		LoadPlayerSpecialHouseTable();
		LoadItemsMakeTable();
		LoadItemsMakeLVUpTable();
		LoadCommSceneTable();
		LoadPlantSeedTable();
		LoadPlantFruitTable();
		LoadDivorceTable();
		LoadFurniturePropertyTable();
		LoadClothesPropertyTable();
		LoadNpcTable();
		LoadDailyRewardTable();
		LoadCollectTaskTable();
		LoadDeliverGoodsTaskTable();
		LoadDialogueTaskTable();
		LoadFindItemTaskTable();
		LoadFunctionTaskTable();
		LoadRingTaskTable();
		LoadFriendIntimateTable();
		LoadWallFloorReplacePartTable();
		LoadAutoFitmentTable();
		LoadMerryTable();
		LoadItemUpgrade();
		LoadRemedy();
		LoadYYGiftTable();
		LoadYYGiftDisplayTable();
		LoadPlantLockTable();
		LoadFlowerRockAwardTable();
		LoadFlowerFreeRockAwardTable();
		LoadGuestTable();
		LoadGuestStarTable();
		LoadNormalSpriteTable();
		LoadSpriteUpgradeTable();
		LoadWaiterTable();
		BartenderSys.getInstance().loadTables();
		LoadNewBuffTable();
		LoadPartyFoodTable();
		LoadPartyDrinksTable(); // alter by zlj
	}
	//--------------------------------------------------
	public function RegLoad(resmgr : ResManager, mgr : AsynResourceMgr) : void
	{
		mAynResMgr = mgr;
		var urls : Array = new Array();
		var sls : String[] = InitFiles.text.Split(["\n", "\r\n"], StringSplitOptions.RemoveEmptyEntries);
		
		var dataYYArr : Array = new Array();
		SeparateInitFiles(sls, mLoaderFiles, dataYYArr);
		if (isYYPlatform())
		{
			mLoaderFiles = GetYYInitFiles(mLoaderFiles, dataYYArr);
		}
		for (var f : String in mLoaderFiles)
		{
			urls.Add(Global.UrlRoot + f);
		}
		resmgr.RegLoad(urls, OnLoadFinished, true);
	}
	//--------------------------------------------------
	private function isYYPlatform() : boolean
	{
		return "yy" == Global.AppType;
	}
	//--------------------------------------------------
	private function OnLoadFinished() : void
	{
		Init();
		Define.initDefine();
	}
	//--------------------------------------------------
	public function AddTable(item : TextAsset) : void
	{
		if (null == item)
			throw "LogicTableManager -> AddTable(TextAsset): item is null!";
		
		if (mTableMap.ContainsKey(item.name))
			throw "LogicTableManager -> AddTable(TextAsset) -> table '" + item.name + "' has exists!";
		
		mTableMap.Add(item.name, item);
	}
	//--------------------------------------------------
	public function RemoveTable(name : String) : void
	{
		if (false == mTableMap.Contains(name))
			throw "LogicTableManager -> RemoveTable(String) -> table '" + name + "' not exists!";
		
		mTableMap.Remove(name);
	}
	//--------------------------------------------------
	public function GetTable(name : String) : TextAsset
	{
		if (false == mTableMap.Contains(name))
			throw "LogicTableManager -> GetTable(String) -> table '" + name + "' not exists!";
		
		return mTableMap[name] as TextAsset;
	}
	//--------------------------------------------------
	private function SeparateTableFilePath(filePath : String) : String[]
	{
		var splts : String[] = filePath.Split(["/"], StringSplitOptions.RemoveEmptyEntries);
		if (2 != splts.Length)
			throw "LogicTableManager -> SeparateTableFilePath(String) -> file '" + filePath + "' path is wrong!";
		
		return splts;
	}
	//--------------------------------------------------
	private function SeparateInitFiles(files : String[], dataArr : Array, dataYYArray : Array) : void
	{
		for (var f : String in files)
		{
			var head : String = SeparateTableFilePath(f)[0];
			if ("Data" == head)
			{
				dataArr.Add(f);
			}
			else if ("DataYY" == head)
			{
				dataYYArray.Add(f);
			}
		}
	}
	//--------------------------------------------------
	private function GetYYInitFiles(dataArr : Array, dataYYArray : Array) : Array
	{
		var arr : Array = new Array();
		for (var dataFile : String in dataArr)
		{
			var dataHead : String = SeparateTableFilePath(dataFile)[1];
			var equal : boolean = false;
			for (var dataYYFile : String in dataYYArray)
			{
				if (dataHead == SeparateTableFilePath(dataYYFile)[1])
				{
					equal = true;
					break;
				}
			}
			if (equal)
				continue;
			
			arr.Add(dataFile);
		}
		for (var f : String in dataYYArray)
		{
			arr.Add(f);
		}
		return arr;
	}
	//--------------------------------------------------
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//--------------------------------------------------
	private function ParseGrid(gstr : String, garr : Array) : void
	{
		gstr = gstr.Trim();
		gstr = gstr.Replace("(null)", "");
		if (0 == gstr.Length)
			return;
		
		var spts : String[] = gstr.Split([" ", "	", ")("], StringSplitOptions.RemoveEmptyEntries);
		try
		{
			for (var i:int = 0; i<spts.Length; ++i)
			{
				var spt : String = spts[i].Replace("(", "");
				spt = spt.Replace(")", "");
				var pts : String[] = spt.Split([","[0]]);
				
				var gi : GridInfo = new GridInfo();
				gi.x = int.Parse(pts[0]);
				gi.z = int.Parse(pts[1]);
				
				garr.Add(gi);
			}
		}
		catch (e : Exception)
			throw Exception("LogicTableManager -> ParseGrid(String, Array) -> gstr = [" + gstr + "] format is wrong.");
	}
	//--------------------------------------------------
	private function CheckStrVType(v : String) : int
	{
		if (v.IndexOf("X") != -1)
			return 16;
		
		return 10;
	}
	//--------------------------------------------------
	private function ParseString(v : String) : String
	{
		return v.Trim().Replace("(null)", "");
	}
	//--------------------------------------------------
	private function ParseVFilter(v : String) : String
	{
		var s : String = v.ToUpper().Trim();
		return s.Replace("(NULL)", "");
	}
	//--------------------------------------------------
	public function ParseInt(v : String) : int
	{
		var s : String = ParseVFilter(v);
		if (0 == s.Length)
			return 0;
		
		try
		{
			if (10 == CheckStrVType(s))
				return int.Parse(s);
			
			return int.Parse(s.Replace("X", ""), NumberStyles.HexNumber);
		}
		catch (e : Exception)
			throw Exception("LogicTableManager -> ParseInt(String) -> v = [" + v + "] format is wrong.");
	}
	//--------------------------------------------------
	private function ParseUIntX(v : String) : int
	{
		var s : String = ParseVFilter(v);
		s = s.Replace("X", "");
		if (0 == s.Length)
			return 0;
		
		try
		{
			return int.Parse(s, NumberStyles.HexNumber);
		}
		catch (e : Exception)
			throw Exception("LogicTableManager -> ParseUIntX(String) -> v = [" + v + "] format is wrong.");
	}
	//--------------------------------------------------
	public function ParseFloat(v : String) : float
	{
		var s : String = ParseVFilter(v);
		if (0 == s.Length)
			return 0;
		
		try
		{
			return float.Parse(s);
		}
		catch (e : Exception)
			throw Exception("LogicTableManager -> ParseFloat(String) -> v = [" + v + "] format is wrong.");
	}
	//--------------------------------------------------
	private function ParseColor(v : String) : Color
	{
		var s : String = v.Replace("#", "");
		if (s.Length != 6 && s.Length != 8)
			return Color.white;
		
		try
		{
			var r : float = int.Parse(s.Substring(0, 2), NumberStyles.HexNumber) / 255.0f;
			var g : float = int.Parse(s.Substring(2, 2), NumberStyles.HexNumber) / 255.0f;
			var b : float = int.Parse(s.Substring(4, 2), NumberStyles.HexNumber) / 255.0f;
			var a : float = 1;
			if (8 == s.Length)
				a = int.Parse(s.Substring(6, 2), NumberStyles.HexNumber) / 255.0f;
			
			return new Color(r, g, b, a);
		}
		catch (e : Exception)
			throw Exception("LogicTableManager -> ParseColor(String) -> v = [" + v + "] format is wrong.");
	}
	//--------------------------------------------------
	private function ParseWebColor(v : String) : Color
	{
		//like 100 200 0 255
		var vv : Vector3 = ParserVector3(v);
		return new Color(vv.x/255.0f, vv.y/255.0f, vv.z/255.0f, 1.0f);
	} 
	//--------------------------------------------------
	private function ParseStringArray(v : String, arr : Array) : void
	{
		v = v.Trim().Replace("(null)", "");
		if (0 == v.Length)
			return;
		
		var spts : String[] = v.Split([" ", "	", ",", ", "], StringSplitOptions.RemoveEmptyEntries);
		if (0 == spts.Length)
			return;
		
		for (var i:int = 0; i<spts.Length; ++i)
		{
			arr.Add(spts[i]);
		}
	}
	//--------------------------------------------------
	public function ParseIntArray(v : String, arr : Array) : void
	{
		v = v.Trim().Replace("(null)", "");
		v = v.Replace("[", "");
		v = v.Replace("{", "");
		v = v.Replace("}", "");
		v = v.Replace("]", "");
		if (0 == v.Length)
			return;
		
		var spts : String[] = v.Split([" ", "	", ",", ", "], StringSplitOptions.RemoveEmptyEntries);
		if (0 == spts.Length)
			return;
		
		try
		{
			for (var i:int = 0; i<spts.Length; ++i)
			{
				arr.Add(int.Parse(spts[i]));
			}
		}
		catch (e : Exception)
			throw Exception("LogicTableManager -> ParseIntArray(String, Array) -> v = [" + v + "] format is wrong.");
	}
	//--------------------------------------------------
	private function ParseFloatArray(v : String) : float[]
	{
		v = v.Trim().Replace("(null)", "");
		if (0 == v.Length)
			return null;
		
		var spts : String[] = v.Split([" ", "	", ",", ", "], StringSplitOptions.RemoveEmptyEntries);
		if (0 == spts.Length)
			return null;
		
		var fls : float[] = new float[spts.Length];
		try
		{
			for (var i:int = 0; i<spts.Length; ++i)
			{
				fls[i] = float.Parse(spts[i]);
			}
		}
		catch (e : Exception)
			throw Exception("LogicTableManager -> ParseFloatArray(String) -> v = [" + v + "] format is wrong.");
		
		return fls;
	}
	//--------------------------------------------------
	private function ParseVector3Array(v : String, arr : Array) : void
	{
		v = v.Trim().Replace("(null)", "");
		if (0 == v.Length)
			return;
		
		var spts : String[] = v.Split(["|"], StringSplitOptions.RemoveEmptyEntries);
		if (0 == spts.Length)
			return;
		
		for (var i:int = 0; i<spts.Length; ++i)
		{
			var str : String = spts[i]; 
			if (str.Contains("("))
			{
				str = str.Trim().Replace("(", ""); 
			}
			if (str.Contains(")"))
			{
				str = str.Trim().Replace(")", ""); 
			}
			arr.Add(ParserVector3(str));
		}
	}
	//--------------------------------------------------
	private function ParserVector3(v : String) : Vector3
	{
		v = v.Trim().Replace("(null)", "");		
		if (0 == v.Length)
			return Vector3.zero;
		
		var spts : String[] = v.Split([" ", "	", ",", ", "], StringSplitOptions.RemoveEmptyEntries);
		if (spts.Length < 3)
			return Vector3.zero;
		
		try
		{
			return new Vector3(float.Parse(spts[0]), float.Parse(spts[1]), float.Parse(spts[2]));
		}
		catch (e : Exception)
			throw Exception("LogicTableManager -> ParserVector3(String) -> v = [" + v + "] format is wrong.");
	}
	//--------------------------------------------------
	private function ParserQuaternion(v : String) : Quaternion
	{
		v = v.Trim().Replace("(null)", "");
		if (0 == v.Length)
			return Quaternion.identity;
		
		var spts : String[] = v.Split([" ", "	", ",", ", "], StringSplitOptions.RemoveEmptyEntries);
		if (spts.Length < 4)
			return Quaternion.identity;
		
		try
		{
			return new Quaternion(float.Parse(spts[0]), float.Parse(spts[1]), float.Parse(spts[2]), float.Parse(spts[3]));
		}
		catch (e : Exception)
			throw Exception("LogicTableManager -> ParserQuaternion(String) -> v = [" + v + "] format is wrong.");
	}
	//--------------------------------------------------
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//--------------------------------------------------
	function LoadHolidayGiftTable() {
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("holiday_gift").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : HolidayGift = new HolidayGift();
			
			if(row.ContainsKey("sequence_id"))
				r.sequence_id = ParseInt(row["sequence_id"]);
			if(row.ContainsKey("start_day"))
				r.start_day = row["start_day"];
			if(row.ContainsKey("duration"))
				r.duration = ParseInt(row["duration"]);
			if(row.ContainsKey("group_id"))
				r.group_id = ParseInt(row["group_id"]);
			if(row.ContainsKey("gift_type"))
				r.gift_type = ParseInt(row["gift_type"]);
			if(row.ContainsKey("item_id"))
				r.item_id = ParseInt(row["item_id"]);
			if(row.ContainsKey("count"))
				r.count = ParseInt(row["count"]);
			if(row.ContainsKey("rate"))
				r.rate = ParseInt(row["rate"]);
				
			HolidayGiftTable.Add(r.sequence_id, r);
		}
	}
	//--------------------------------------------------
	private function LoadSysMsgTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("sysmsg").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : SysMsgRow = new SysMsgRow();
			if(row.ContainsKey("id"))
				r.msg_id = ParseInt(row["id"]);
			if(row.ContainsKey("content"))
				r.msg_content = row["content"];
			if(row.ContainsKey("type"))
				r.msg_type = ParseInt(row["type"]);
			
			mSysMsgTable.Add(r.msg_id, r);
		}
	}
	//--------------------------------------------------
	public function getSysMsgRow(id : int) : SysMsgRow
	{
		if (false == mSysMsgTable.ContainsKey(id))
			throw Exception("LogicTableManager -> getSysMsgRow(int) -> can't find id[" + id + "].");
		
		return mSysMsgTable[id];
	}
	//--------------------------------------------------
	private function LoadHouseCompTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("house_comp").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : HouseCompRow = new HouseCompRow();
			
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("type"))
				r.type = ParseInt(row["type"]);
			if(row.ContainsKey("name"))
				r.name = row["name"];
			if(row.ContainsKey("prop_id"))
				r.prop_id = ParseInt(row["prop_id"]);
			if(row.ContainsKey("pos"))
				r.pos = ParserVector3(row["pos"]);
			if(row.ContainsKey("rot"))
				r.rot = ParserQuaternion(row["rot"]);
			if(row.ContainsKey("scale"))
				r.scale = ParserVector3(row["scale"]);
			if(row.ContainsKey("model"))
				r.model = row["model"];
			if(row.ContainsKey("cull_level"))
				r.cull_level = ParseInt(row["cull_level"]);
			if(row.ContainsKey("particle"))
				r.particle = row["particle"];
			if(row.ContainsKey("particle_pos"))
				r.particle_pos = ParserVector3(row["particle_pos"]);
						
			mHouseCompTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	public function getHouseCompRow(comp_id : int) : HouseCompRow
	{
		if (false == mHouseCompTable.ContainsKey(comp_id))
			throw Exception("LogicTableManager -> getHouseCompRow(int) -> can't find comp id[" + comp_id + "].");
		
		return mHouseCompTable[comp_id];
	}
	//--------------------------------------------------
	private function LoadHouseCompPropTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("house_comp_prop").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : HouseCompPropRow = new HouseCompPropRow();
			
			if(row.ContainsKey("PropID"))
				r.PropID = ParseInt(row["PropID"]);
			if(row.ContainsKey("Name"))
				r.Name = row["Name"];
			if(row.ContainsKey("BeWatchMode"))
				r.BeWatchMode = ParseInt(row["BeWatchMode"]);
			if(row.ContainsKey("HoldGrid"))
				ParseGrid(row["HoldGrid"], r.HoldGrid);
			if(row.ContainsKey("StopGrid"))
				ParseGrid(row["StopGrid"], r.StopGrid);
			if(row.ContainsKey("LayGrid"))
				ParseGrid(row["LayGrid"], r.LayGrid);
			if(row.ContainsKey("SelfHeight"))
				r.SelfHeight = ParseFloat(row["SelfHeight"]);
			if(row.ContainsKey("OffsetHeight"))
				r.OffsetHeight = ParseFloat(row["OffsetHeight"]);
			if(row.ContainsKey("AcceptLay"))
				r.AcceptLay = ParseInt(row["AcceptLay"]);
			if(row.ContainsKey("LayType"))
				r.LayType = ParseInt(row["LayType"]);
			if(row.ContainsKey("CanRep"))
				r.CanRep = (ParseInt(row["CanRep"]) != 0);
			if(row.ContainsKey("LightID"))
				r.LightID = ParseInt(row["LightID"]);
			if(row.ContainsKey("HoldType"))
				r.HoldType = ParseInt(row["HoldType"]);
			
			mHouseCompPropTable.Add(r.PropID, r);
		}
	}
	//--------------------------------------------------
	public function getHouseCompPropRow(prop_id : int) : HouseCompPropRow
	{
		if (false == mHouseCompPropTable.ContainsKey(prop_id))
			throw Exception("LogicTableManager -> getHouseCompPropRow(int) -> can't find prop id[" + prop_id + "].");
		
		return mHouseCompPropTable[prop_id];
	}
	//--------------------------------------------------
	function LoadHouseGridTypeTable()
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("house_grid_type").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : HouseGridTypeRow = new HouseGridTypeRow();
			
			if(row.ContainsKey("TypeID"))
				r.TypeID = ParseInt(row["TypeID"]);
			if(row.ContainsKey("Name"))
				r.Name = row["Name"];
			if(row.ContainsKey("ColorSign"))
				r.ColorSign = ParseColor(row["ColorSign"]);
			if(row.ContainsKey("ShowGridFitment"))
				r.ShowGridFitment = ParseInt(row["ShowGridFitment"]) == 0 ? false : true;
			if(row.ContainsKey("AcceptLay"))
				r.AcceptLay = ParseUIntX(row["AcceptLay"]);
			if(row.ContainsKey("InDoor"))
				r.InDoor = ParseInt(row["InDoor"]) == 0 ? false : true;
			
			HouseGridTypeTable.Add(r.TypeID, r);
		}
	}
	//--------------------------------------------------
	private function LoadPlayerHouseTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("house_tplt").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : PlayerHouseRow = new PlayerHouseRow();
			
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("name"))
				r.name = row["name"];
			if(row.ContainsKey("level"))
				r.level = ParseInt(row["level"]);
			if(row.ContainsKey("type"))
				r.type = ParseInt(row["type"]);
			if(row.ContainsKey("model"))
				r.model = row["model"];
			if(row.ContainsKey("house_furniture"))
				r.house_furniture = row["house_furniture"];
			if(row.ContainsKey("born_id"))
				r.born_id = ParseInt(row["born_id"]);
			if(row.ContainsKey("max_players"))
				r.max_players = ParseInt(row["max_players"]);
			if(row.ContainsKey("preview_born"))
				r.preview_born = ParseInt(row["preview_born"]);
			if(row.ContainsKey("struct_info"))
				r.struct_info = row["struct_info"];
			if(row.ContainsKey("right_grade"))
				r.right_grade = ParseInt(row["right_grade"]);
			if(row.ContainsKey("is_single"))
				r.is_single = ParseInt(row["is_single"]);
			if(row.ContainsKey("icon"))
				r.icon = row["icon"];
			if(row.ContainsKey("big_icon"))
				r.big_icon = row["big_icon"];
			if(row.ContainsKey("tip"))
				r.tip = row["tip"];
			if(row.ContainsKey("internal_decoration"))
				r.internal_decoration = ParseInt(row["internal_decoration"]);
			if(row.ContainsKey("max_furniture"))
				r.max_furniture = ParseInt(row["max_furniture"]);
			if(row.ContainsKey("max_flowerpot"))
				r.max_flowerpot = ParseInt(row["max_flowerpot"]);
			if (row.ContainsKey("bg_music"))
				r.bg_music = row["bg_music"];
			if (row.ContainsKey("max_guest"))
				r.max_guest = ParseInt(row["max_guest"]);
			if (row.ContainsKey("guest_id"))
				ParseIntArray(row["guest_id"], r.guests);
			if (row.ContainsKey("waiter_pos"))
				r.waiter_pos = ParserVector3(row["waiter_pos"]);
			if (row.ContainsKey("waiter_rotate"))
				r.waiter_rotate = ParseInt(row["waiter_rotate"]);
			if (row.ContainsKey("love_coin"))
				r.love_coin = ParseInt(row["love_coin"]);
			
			PlayerHouseTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	public function getPlayerHouseRow(id : int) : PlayerHouseRow
	{
		if (false == PlayerHouseTable.ContainsKey(id))
			throw Exception("LogicTableManager -> getPlayerHouseRow(int) -> can't find id[" + id + "].");
		
		return PlayerHouseTable[id];
	}
	//--------------------------------------------------
	private function LoadBornTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("born").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : BornRow = new BornRow();
			
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("pos"))
				r.pos = ParserVector3(row["pos"]);
			if(row.ContainsKey("dir"))
				r.dir = ParseFloat(row["dir"]);
			if(row.ContainsKey("lookat"))
				r.lookat = ParserVector3(row["lookat"]);
			if(row.ContainsKey("pitch"))
				r.pitch = ParseFloat(row["pitch"]);
			if(row.ContainsKey("yaw"))
				r.yaw = ParseFloat(row["yaw"]);
			if(row.ContainsKey("zoom"))
				r.zoom = ParseFloat(row["zoom"]);
			if(row.ContainsKey("farclip"))
				r.farclip = ParseFloat(row["farclip"]);
			if(row.ContainsKey("field"))
				r.field = ParseFloat(row["field"]);
			if (row.ContainsKey("watch_mode"))
				r.watch_mode = ParseInt(row["watch_mode"]);
			if (row.ContainsKey("view_floor"))
				r.view_floor = ParseInt(row["view_floor"]);
				
			mBornTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	public function getBornRow(id : int) : BornRow
	{
		if (false == mBornTable.ContainsKey(id))
			throw Exception("LogicTableManager -> getBornRow(int) -> can't find id[" + id + "].");
		
		return mBornTable[id];
	}
	//--------------------------------------------------
	private function LoadWebLightTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("light").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : WebLightRow = new WebLightRow();
			
			if(row.ContainsKey("ID"))
				r.ID = ParseInt(row["ID"]);
			if(row.ContainsKey("Name"))
				r.Name = row["Name"];
			if(row.ContainsKey("Pos"))
				r.Pos = ParserVector3(row["Pos"]);
			if(row.ContainsKey("Dir"))
				r.Dir = ParserVector3(row["Dir"]);
			if(row.ContainsKey("Type"))
				r.Type = ParseInt(row["Type"]);
			if(row.ContainsKey("Colour"))
				r.Colour = ParseWebColor(row["Colour"]);
			if(row.ContainsKey("Intensity"))
				r.Intensity = ParseFloat(row["Intensity"]);
			if(row.ContainsKey("Range"))
				r.Range = ParseFloat(row["Range"]);
			if(row.ContainsKey("SpotAngle"))
				r.SpotAngle = ParseFloat(row["SpotAngle"]);
						
			WebLightTable.Add(r.ID, r);
		}
	}
	//--------------------------------------------------
	private function LoadItemTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("item_tplt").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : ItemRow = new ItemRow();
			
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("name"))
				r.name = row["name"];
			if(row.ContainsKey("type"))
				r.type = ParseInt(row["type"]);
			if(row.ContainsKey("use_type"))
				r.use_type = ParseInt(row["use_type"]);
			if(row.ContainsKey("icon"))
				r.icon = row["icon"];
			if(row.ContainsKey("overlap"))
				r.overlap = ParseInt(row["overlap"]);
			if(row.ContainsKey("sell_price"))
				r.sell_price = ParseInt(row["sell_price"]);
			if(row.ContainsKey("sub_id"))
				r.sub_id = ParseInt(row["sub_id"]);
			if(row.ContainsKey("bind"))
				r.bind = ParseInt(row["bind"]);
			if(row.ContainsKey("effect_time_id"))
				r.effect_time_id = ParseInt(row["effect_time_id"]);
			if(row.ContainsKey("property_id"))
				r.property_id = ParseInt(row["property_id"]);
			if(row.ContainsKey("use_level"))
				r.use_level = ParseInt(row["use_level"]);
			if(row.ContainsKey("level"))
				r.level = ParseInt(row["level"]);
			if(row.ContainsKey("upgrade_id"))
				r.upgrade_id = ParseInt(row["upgrade_id"]);
				
			mItemTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	public function getItemRow(item_id : int) : ItemRow
	{
		if (false == mItemTable.ContainsKey(item_id))
			throw Exception("LogicTableManager -> getItemRow(int) -> can't find id[" + item_id + "].");
		
		return mItemTable[item_id];
	}
	//--------------------------------------------------
	private function LoadItemDescriptionTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("item_description_tplt").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : ItemDescriptionRow = new ItemDescriptionRow();
			
			if(row.ContainsKey("item_id"))
				r.item_id = ParseInt(row["item_id"]);
			if(row.ContainsKey("description"))
				r.description = row["description"];
				
			mItemDescriptionTable.Add(r.item_id, r);
		}
	}
	//--------------------------------------------------
	public function getItemDescription(id : int) : String
	{
		if (false == mItemDescriptionTable.ContainsKey(id))
			return "";
		
		return (mItemDescriptionTable[id] as ItemDescriptionRow).description;
	}
	//--------------------------------------------------
	private function LoadItemDressTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("item_dress_tplt").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : ItemDressRow = new ItemDressRow();
			
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("name"))
				r.name = row["name"];
			if(row.ContainsKey("sex"))
				r.sex = ParseInt(row["sex"]);
			if(row.ContainsKey("equip_pos"))
				r.equip_pos = ParseInt(row["equip_pos"]);
			if(row.ContainsKey("equip_placeholder"))
				r.equip_placeholder = ParseInt(row["equip_placeholder"]);
			if(row.ContainsKey("model"))
				r.model = row["model"];
			if(row.ContainsKey("model_body"))
				r.model_body = row["model_body"];
			if(row.ContainsKey("place"))
				r.place = ParseInt(row["place"]);
			if(row.ContainsKey("action"))
				r.action = row["action"];
			if(row.ContainsKey("particle"))
				r.particle = row["particle"];
			if(row.ContainsKey("attach_pos"))
				r.attach_pos = row["attach_pos"];
			if(row.ContainsKey("type1"))
				r.type1 = ParseInt(row["type1"]);
			if(row.ContainsKey("type2"))
				r.type2 = ParseInt(row["type2"]);
				
			ItemDressTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	private function LoadShopCenterTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("sys_shop_tplt").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : ShopCenterRow = new ShopCenterRow();
			
			if(row.ContainsKey("goods_id"))
				r.goods_id = ParseInt(row["goods_id"]);
			if(row.ContainsKey("item_id"))
				r.item_id = ParseInt(row["item_id"]);
			if(row.ContainsKey("type"))
				r.type = ParseInt(row["type"]);
			if(row.ContainsKey("money_type")) 
				r.money_type = ParseInt(row["money_type"]);
			if(row.ContainsKey("price"))
				r.price = ParseInt(row["price"]);
			if(row.ContainsKey("intro"))
				r.intro = row["intro"];
			if(row.ContainsKey("commend"))
				r.recommend = ParseInt(row["commend"]) == 0 ? false : true;
			if(row.ContainsKey("broadcast_id"))
				r.broadcast_id = ParseInt(row["broadcast_id"]);
			if(row.ContainsKey("player_level"))
				r.limit_level = ParseInt(row["player_level"]); 
			if(row.ContainsKey("visible"))
				r.visible = ParseInt(row["visible"]) == 0 ? false : true;
			if(row.ContainsKey("newcomer"))
				r.newcomer = ParseInt(row["newcomer"]) == 0 ? false : true;
			if(row.ContainsKey("point"))
				r.point = ParseInt(row["point"]);
				
			ShopCenterTable.Add(r);
		}
	}
	//--------------------------------------------------
	public function getShopCenterRow(goodsId : int) : ShopCenterRow
	{
		for (var goods : ShopCenterRow in ShopCenterTable)
		{
			if (goodsId == goods.goods_id)
				return goods;
		}
		throw Exception("LogicTableManager -> getShopCenterRow(int) -> not exist goods[" + goodsId + "].");
	}
	//--------------------------------------------------
	private function LoadShopCenterClassTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("sys_shop_class_tplt").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : ShopCenterClassRow = new ShopCenterClassRow();
			
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("type"))
				r.type = ParseInt(row["type"]);
			if(row.ContainsKey("buytype"))
				r.buytype = ParseInt(row["buytype"]);
			if(row.ContainsKey("icon"))
				r.icon = row["icon"];
			if(row.ContainsKey("description"))
				r.description = row["description"];
			if(row.ContainsKey("newcomer"))
				r.newcomer = ParseInt(row["newcomer"]) == 0 ? false : true;
			if(row.ContainsKey("auto_fitment"))
				r.auto_fitment = ParseInt(row["auto_fitment"]) == 0 ? false : true;
			if(row.ContainsKey("unlock"))
				r.unlock = ParseInt(row["unlock"]) == 0 ? false : true;
			if(row.ContainsKey("unlock_level"))
				r.unlock_level = ParseInt(row["unlock_level"]);
			if(row.ContainsKey("unlock_money"))
				r.unlock_money = ParseInt(row["unlock_money"]);
			if(row.ContainsKey("unlock_material"))
				ParseIntArray(row["unlock_material"], r.unlock_material);
			if(row.ContainsKey("unlock_material_count"))
				ParseIntArray(row["unlock_material_count"], r.unlock_material_count);
			if(row.ContainsKey("unlock_material_shop_id"))
				ParseIntArray(row["unlock_material_shop_id"], r.unlock_material_shop_id);
			
			ShopCenterClassTable.Add(r);
		}
	}
	//--------------------------------------------------
	function LoadFlowerTable()
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("flower_tplt").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : FlowerRow = new FlowerRow();
			
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("flower_id"))
				r.flower_id = ParseInt(row["flower_id"]);
			if(row.ContainsKey("level"))
				r.level = ParseInt(row["level"]);
			if(row.ContainsKey("grow"))
				r.grow = ParseInt(row["grow"]);
			if(row.ContainsKey("model"))
				r.model = row["model"];
			if(row.ContainsKey("particle"))
				r.particle = row["particle"];
				
			FlowerTable.Add(r);
		}
	}
	
	function LoadFurniMenuTable()
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("loop_menu").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : FurniMenuRow = new FurniMenuRow();
			
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("func1"))
				r.func1 = ParseInt(row["func1"]);
			if(row.ContainsKey("func2"))
				r.func2 = ParseInt(row["func2"]);
			if(row.ContainsKey("func3"))
				r.func3 = ParseInt(row["func3"]);
			if(row.ContainsKey("func4"))
				r.func4 = ParseInt(row["func4"]);
			if(row.ContainsKey("func5"))
				r.func5 = ParseInt(row["func5"]);
			if(row.ContainsKey("func6"))
				r.func6 = ParseInt(row["func6"]);
			if(row.ContainsKey("func7"))
				r.func7 = ParseInt(row["func7"]);
			if(row.ContainsKey("func8"))
				r.func8 = ParseInt(row["func8"]);
			if(row.ContainsKey("func9"))
				r.func9 = ParseInt(row["func9"]);
			if(row.ContainsKey("func10"))
				r.func10 = ParseInt(row["func10"]);
			if(row.ContainsKey("func11"))
				r.func11 = ParseInt(row["func11"]);
			if(row.ContainsKey("func12"))
				r.func12 = ParseInt(row["func12"]);
			if(row.ContainsKey("func13"))
				r.func13 = ParseInt(row["func13"]);
			if(row.ContainsKey("func14"))
				r.func14 = ParseInt(row["func14"]);
			if(row.ContainsKey("func15"))
				r.func15 = ParseInt(row["func15"]);
			
			FurniMenuTable.Add(r.id, r);
		}
	}
	
	function LoadGiftBoxTable()
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("gift_box_tplt").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : GiftBoxRow = new GiftBoxRow();
			
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("type"))
				r.type = ParseInt(row["type"]);
			if(row.ContainsKey("name"))
				r.name = row["name"];
			if(row.ContainsKey("price"))
				r.price = ParseInt(row["price"]);
			if(row.ContainsKey("model"))
				r.model = row["model"];
			if(row.ContainsKey("icon"))
				r.icon = row["icon"];
			if(row.ContainsKey("intro"))
				r.intro = row["intro"];
			
			GiftBoxTable.Add(r.id, r);
		}
	}
	
	function LoadFurniInteractTable()
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("furni_interact").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : FurniInteractRow = new FurniInteractRow();
			
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("name"))
				r.name = row["name"];
			if(row.ContainsKey("furni_ani"))
				r.furni_ani = ParseInt(row["furni_ani"]);
			if(row.ContainsKey("menu_info"))
				ParseIntArray(row["menu_info"], r.menu_info);
			if(row.ContainsKey("role_ani"))
				ParseStringArray(row["role_ani"], r.role_ani);
			if(row.ContainsKey("time"))
				r.time = ParseInt(row["time"]);
			if(row.ContainsKey("hide_part"))
				ParseIntArray(row["hide_part"], r.hide_part);
			if(row.ContainsKey("mosaic_pos")) 
				ParseVector3Array(row["mosaic_pos"], r.mosaic_pos);
			if(row.ContainsKey("offset_pos")) 
				ParseVector3Array(row["offset_pos"], r.offset_pos);
			if(row.ContainsKey("role_face"))
				r.role_face = ParseInt(row["role_face"]);
			if(row.ContainsKey("use_range"))
				r.use_range = ParseInt(row["use_range"]);
			if(row.ContainsKey("use_face"))
				r.use_face = row["use_face"];
			if(row.ContainsKey("icon"))
				ParseStringArray(row["icon"], r.icon);
			if(row.ContainsKey("hint"))
				r.hint = row["hint"];
			
			FurniInteractTable.Add(r.id, r);
		}
	}
	
	function LoadFurniAnimationTable()
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("furni_animation").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : FurniAnimationRow = new FurniAnimationRow();
			
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("name"))
				r.name = row["name"];
			if(row.ContainsKey("type"))
				r.type = ParseInt(row["type"]);
			if(row.ContainsKey("animation")) 
				ParseIntArray(row["animation"], r.animation);
			if(row.ContainsKey("texture"))
				ParseStringArray(row["texture"], r.texture);
			if(row.ContainsKey("particle"))
				r.particle = row["particle"];
			if(row.ContainsKey("particle_pos"))
				r.particle_pos = ParserVector3(row["particle_pos"]);
			if(row.ContainsKey("loop"))
				r.loop = ParseInt(row["loop"]) == 0 ? false : true;
			
			FurniAnimationTable.Add(r.id, r);
		}
	}
	
	function LoadQQHomeGiftTable()
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("qqhome_gift").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : QQHomeGiftRow = new QQHomeGiftRow();
			
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("level"))
				r.level = ParseInt(row["level"]);
			if(row.ContainsKey("sex"))
				r.sex = ParseInt(row["sex"]);
			if(row.ContainsKey("gift1"))
				r.gift1 = ParseInt(row["gift1"]);
			if(row.ContainsKey("count1"))
				r.count1 = ParseInt(row["count1"]);
			if(row.ContainsKey("gift2"))
				r.gift2 = ParseInt(row["gift2"]);
			if(row.ContainsKey("count2"))
				r.count2 = ParseInt(row["count2"]);
			if(row.ContainsKey("gift3"))
				r.gift3 = ParseInt(row["gift3"]);
			if(row.ContainsKey("count3"))
				r.count3 = ParseInt(row["count3"]);
			if(row.ContainsKey("gift_year"))
				r.gift_year = ParseInt(row["gift_year"]);
			if(row.ContainsKey("count_year"))
				r.count_year = ParseInt(row["count_year"]);
			
			QQHomeGiftTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	private function LoadPropUseTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("props_item_tplt").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : PropUseRow = new PropUseRow();
			
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("target"))
				r.target = ParseInt(row["target"]);
			if(row.ContainsKey("del"))
				r.is_del = (0 == ParseInt(row["del"])) ? false : true;
			if(row.ContainsKey("intro"))
				r.intro = row["intro"];
			if(row.ContainsKey("movie"))
				r.animation = row["movie"];
			if(row.ContainsKey("ui"))
				r.ui = row["ui"];
			if(row.ContainsKey("audio"))
				r.audio = row["audio"];
			if(row.ContainsKey("sysmsg"))
				r.msg = ParseInt(row["sysmsg"]);
			if(row.ContainsKey("module"))
				r.script = row["module"];
			if(row.ContainsKey("arguments"))
				r.arguments = row["arguments"];
			
			mPropUseTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	public function getPropUseRow(id : int) : PropUseRow
	{
		if (false == mPropUseTable.ContainsKey(id))
			throw "LogicTableManager -> getPropUseRow(int) -> can't find id[" + id + "].";
		
		return mPropUseTable[id];
	}
	//--------------------------------------------------
	private function LoadPlayerTaskTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("player_task_tplt").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : PlayerTaskRow = new PlayerTaskRow();
			
			if(row.ContainsKey("task_id"))
				r.task_id = ParseInt(row["task_id"]);
			if(row.ContainsKey("icon"))
				r.icon = row["icon"];
			if(row.ContainsKey("title"))
				r.title = row["title"];
			if(row.ContainsKey("describe"))
				r.describe = row["describe"];
			if(row.ContainsKey("reward_items"))
				ParseIntArray(row["reward_items"], r.reward_items);
			if(r.reward_items.Count != 0 && r.reward_items[0] == 0)				//第一个为0, 清空
				r.reward_items.Clear();
			if(row.ContainsKey("reward_items_count"))
				ParseIntArray(row["reward_items_count"], r.reward_items_count);
			if(r.reward_items_count.Count != 0 && r.reward_items_count[0] == 0)	//第一个为0, 清空
				r.reward_items_count.Clear();
			if(row.ContainsKey("diamond"))
				r.diamond = ParseInt(row["diamond"]);
			if(row.ContainsKey("experience"))
				r.experience = ParseInt(row["experience"]);
			if(row.ContainsKey("hp"))
				r.hp = ParseInt(row["hp"]);
			if(row.ContainsKey("is_show"))
				r.is_show = ParseInt(row["is_show"]);
			if(row.ContainsKey("q_coin"))
				r.q_coin = ParseInt(row["q_coin"]);
			if(row.ContainsKey("target1"))
				r.target1 = ParseString(row["target1"]);
			if(row.ContainsKey("target2"))
				r.target2 = ParseString(row["target2"]);
			if(row.ContainsKey("target3"))
				r.target3 = ParseString(row["target3"]);
			if(row.ContainsKey("type"))
				r.type = ParseInt(row["type"]);
			if(row.ContainsKey("need_player_level"))
				r.need_player_level = ParseInt(row["need_player_level"]);
			
			mPlayerTaskTable.Add(r.task_id, r);
		}		
	}
	//--------------------------------------------------
	public function getPlayerTaskRow(id : int) : PlayerTaskRow
	{
		if (false == mPlayerTaskTable.ContainsKey(id))
			throw Exception("LogicTableManager -> getPlayerTaskRow(int) -> can't find id[" + id + "].");
		
		return mPlayerTaskTable[id];
	}
	//--------------------------------------------------
	function LoadSpecialHouseTable()
	{
		var dt:XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("special_house_tplt").text);
		for(var row:Hashtable in dt.Table)
		{
			var r:SpecialHouseRow = new SpecialHouseRow();
			
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("house_tplt_id"))
				r.house_tplt_id = ParseInt(row["house_tplt_id"]);
			if(row.ContainsKey("q_coin"))
				r.q_coin = ParseFloat(row["q_coin"]);
			if(row.ContainsKey("count"))
				r.count = ParseInt(row["count"]);
			
			SpecialHouseTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	private function LoadPlayerSpecialHouseTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("player_special_house_tplt").text);
		for (var row : Hashtable in dt.Table)
		{
			var r : PlayerSpecialHouseRow = new PlayerSpecialHouseRow();
			
			if (row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if (row.ContainsKey("unlock_house_ids"))
				ParseIntArray(row["unlock_house_ids"], r.unlock_house_ids);
			if (row.ContainsKey("love_coin"))
				r.love_coin = ParseInt(row["love_coin"]);
			if (row.ContainsKey("desc"))
				r.desc = row["desc"];
			if (row.ContainsKey("name"))
				r.name = row["name"];
			if (row.ContainsKey("icon"))
				r.icon = row["icon"];
			if (row.ContainsKey("big_icon"))
				r.big_icon = row["big_icon"];
			if (row.ContainsKey("decoration"))
				r.decoration = ParseInt(row["decoration"]);
			if (row.ContainsKey("furniture_count"))
				r.furniture_count = ParseInt(row["furniture_count"]);
			if (row.ContainsKey("is_show"))
				r.is_show = ParseInt(row["is_show"]);
			
			mPlayerSpeicalHouseTable.Add(r);
		}
	}
	//--------------------------------------------------
	public function getPlayerSpecialHouseTable() : Array
	{
		return mPlayerSpeicalHouseTable;
	}
	//--------------------------------------------------
	public function getPlayerSpecialHouseRow(id : int) : PlayerSpecialHouseRow
	{
		for (var row : PlayerSpecialHouseRow in mPlayerSpeicalHouseTable)
		{
			if (id == row.id)
				return row;
		}
		throw Exception("LogicTableManager -> getPlayerSpecialHouseRow(int) -> can't find id[" + id + "].");
	}
	//--------------------------------------------------
	function LoadDailyRewardTable()
	{
		var dt:XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("daily_active_tplt").text);
		for(var row:Hashtable in dt.Table)
		{
			var r:DailyRewardRow = new DailyRewardRow();
			
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("desc"))
				r.desc = row["desc"];
			if(row.ContainsKey("add_score"))
				r.add_score = ParseInt(row["add_score"]);
			if(row.ContainsKey("max_score"))
				r.max_score = ParseInt(row["max_score"]);
			
			DailyRewardTable.Add(r.id, r);
		}
	}
	
	//--
	function LoadHouseRightTable()
	{
		var dt:XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("house_right_tplt").text);
		for(var row:Hashtable in dt.Table)
		{
			var r:HouseRightRow = new HouseRightRow();
			
			if(row.ContainsKey("grade"))
				r.grade = ParseInt(row["grade"]);
			if(row.ContainsKey("desc"))
				r.desc = row["desc"];
			if(row.ContainsKey("money_type"))
				r.money_type = ParseInt(row["money_type"]);
			if(row.ContainsKey("money"))
				r.money = ParseInt(row["money"]);
	
			if(row.ContainsKey("material1_shop_id"))
				r.material1_shop_id = ParseInt(row["material1_shop_id"]);
			if(row.ContainsKey("material2_shop_id"))
				r.material2_shop_id = ParseInt(row["material2_shop_id"]);
			if(row.ContainsKey("material3_shop_id"))
				r.material3_shop_id = ParseInt(row["material3_shop_id"]);
			if(row.ContainsKey("material4_shop_id"))
				r.material4_shop_id = ParseInt(row["material4_shop_id"]);
			if(row.ContainsKey("material1"))
				r.material1 = ParseInt(row["material1"]);
			if(row.ContainsKey("num1"))
				r.num1 = ParseInt(row["num1"]);
			if(row.ContainsKey("material2"))
				r.material2 = ParseInt(row["material2"]);
			if(row.ContainsKey("num2"))
				r.num2 = ParseInt(row["num2"]);
			if(row.ContainsKey("material3"))
				r.material3 = ParseInt(row["material3"]);
			if(row.ContainsKey("num3"))
				r.num3 = ParseInt(row["num3"]);
			if(row.ContainsKey("material4"))
				r.material4 = ParseInt(row["material4"]);
			if(row.ContainsKey("num4"))
				r.num4 = ParseInt(row["num4"]);
			if(row.ContainsKey("icon"))
				r.icon = row["icon"];
			if(row.ContainsKey("hover_icon"))
				r.hover_icon = row["hover_icon"];
			
			HouseRightTable.Add(r.grade, r);
		}
	}
	
	//--
	function LoadSelfAnimationTable()
	{
		var dt:XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("self_animation_tplt").text);
		for(var row:Hashtable in dt.Table)
		{
			var r:SelfAnimationRow = new SelfAnimationRow();
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("ani_name"))
				r.ani_name = row["ani_name"];
			if(row.ContainsKey("loop_type"))
				r.loop_type = ParseInt(row["loop_type"]);
			if(row.ContainsKey("extend_type"))
				r.extend_type = ParseInt(row["extend_type"]);
			if(row.ContainsKey("btn_n_icon"))
				r.btn_n_icon = row["btn_n_icon"];
			if(row.ContainsKey("btn_h_icon"))
				r.btn_h_icon = row["btn_h_icon"];
			if(row.ContainsKey("btn_p_icon"))
				r.btn_p_icon = row["btn_p_icon"];
			if(row.ContainsKey("tooltip"))
				r.tip = row["tooltip"];
			
			SelfAnimationTable.Add(r.id, r);
		}
	}
	
	function LoadInviteGiftTable() {
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("invite_gift").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : InviteGift = new InviteGift();
			
			if(row.ContainsKey("sequence_id"))
				r.sequence_id = ParseInt(row["sequence_id"]);
			if(row.ContainsKey("group_id"))
				r.group_id = ParseInt(row["group_id"]);
			if(row.ContainsKey("gift_type"))
				r.gift_type = ParseInt(row["gift_type"]);
			if(row.ContainsKey("item_id"))
				r.item_id = ParseInt(row["item_id"]);
			if(row.ContainsKey("count"))
				r.count = ParseInt(row["count"]);
			if(row.ContainsKey("rate"))
				r.rate = ParseInt(row["rate"]);
				
			InviteGiftTable.Add(r.sequence_id, r);
		}
	}
	
	function LoadLogonAwardTable() {
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("player_login_reward_tplt").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : LogonAward = new LogonAward();
			
			if(row.ContainsKey("day"))
				r.day = ParseInt(row["day"]);
			if(row.ContainsKey("diamond"))
				r.diamond = ParseInt(row["diamond"]);
			if(row.ContainsKey("temp_id"))
				r.item_id = ParseInt(row["temp_id"]);
			if(row.ContainsKey("count"))
				r.count = ParseInt(row["count"]);
				
			LogonAwardTable.Add(r.day, r);
		}
	}
	
	function LoadEffectTimeTable()
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("item_effect_time_tplt").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : EffectTimeRow = new EffectTimeRow();
			
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("type"))
				r.type = ParseInt(row["type"]);
			if(row.ContainsKey("effect_time"))
				r.effect_time = ParseInt(row["effect_time"]);
			if(row.ContainsKey("trade_cut_time"))
				r.trade_cut_time = ParseInt(row["trade_cut_time"]);
			if(row.ContainsKey("del_time"))
				r.del_time = row["del_time"];
				
			EffectTimeTable.Add(r.id, r);
		}
	}
	
	//--
	function LoadBuffTable() {
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("polymorph_props_item_tplt").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : BuffRow = new BuffRow();
			
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("duration"))
				r.duration = ParseInt(row["duration"]);
			if(row.ContainsKey("effect_id"))
				r.effect_id = ParseInt(row["effect_id"]);
				
			BuffTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	private function LoadEffectAvatarTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("effect_avatar").text);
		for (var row : Hashtable in dt.Table)
		{
			var r : EffectAvatarRow = new EffectAvatarRow();
			if (row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if (row.ContainsKey("icon"))
				r.icon = row["icon"];
			if (row.ContainsKey("model"))
				r.model = row["model"];
			
			EffectAvatarTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	public function getEffectAvatarRow(id : int) : EffectAvatarRow
	{
		if (false == EffectAvatarTable.ContainsKey(id))
			throw Exception("LogicTableManager -> getEffectAvatarRow(int) -> can't find id[" + id + "].");
		
		return EffectAvatarTable[id];
	}
	//--------------------------------------------------
	function LoadItemsMakeTable() {
		var dt:XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("produce_manual_tplt").text);
		for(var row:Hashtable in dt.Table)
		{
			var r:ItemsMakeRow = new ItemsMakeRow();
			if(row.ContainsKey("item_id"))
				r.item_id = ParseInt(row["item_id"]);
			if(row.ContainsKey("produce_level"))
				r.produce_level = ParseInt(row["produce_level"]);
			if(row.ContainsKey("consume_diamond"))
				r.diamond = ParseInt(row["consume_diamond"]);
			if(row.ContainsKey("material_item"))
				r.material_item = row["material_item"];
			if(row.ContainsKey("finished_item"))
				r.finished_item = row["finished_item"];
			if(row.ContainsKey("success_rate"))
				r.success_rate = ParseInt(row["success_rate"]);
			if(row.ContainsKey("experience"))
				r.experience = ParseInt(row["experience"]);
			
			ItemsMakeTable.Add(r.item_id, r);
		}
	}
	
	function LoadItemsMakeLVUpTable() {
		var dt:XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("produce_level_tplt").text);
		for(var row:Hashtable in dt.Table)
		{
			var r:ItemsMakeLVUpRow = new ItemsMakeLVUpRow();
			if(row.ContainsKey("level"))
				r.level = ParseInt(row["level"]);
			if(row.ContainsKey("experience"))
				r.experience = ParseInt(row["experience"]);
			
			ItemsMakeLVUpTable.Add(r.level, r);
		}
	}
	//--------------------------------------------------
	private function LoadCommSceneTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("common_scene").text);
		
		for (var row : Hashtable in dt.Table)
		{
			var r : CommSceneRow = new CommSceneRow();
			
			if (row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if (row.ContainsKey("name"))
				r.name = row["name"];
			if (row.ContainsKey("born_id"))
				r.born_id = ParseInt(row["born_id"]);
			if (row.ContainsKey("scene_name"))
				r.scene_name = row["scene_name"];
			if (row.ContainsKey("type"))
				r.type = ParseInt(row["type"]);
			if (row.ContainsKey("bg_music"))
				r.bg_music = row["bg_music"];
			
			mCommSceneTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	public function getCommonSceneRow(id : int) : CommSceneRow
	{
		if (false == mCommSceneTable.ContainsKey(id))
			throw Exception("LogicTableManager -> getCommonSceneRow(int) -> can't find id[" + id + "].");
		
		return mCommSceneTable[id];
	}
	//--------------------------------------------------
	private function LoadPlantSeedTable() : void {
		var dt:XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("crop_tplt").text);
		for(var row:Hashtable in dt.Table)
		{
			var r:PlantSeedRow = new PlantSeedRow();
			if(row.ContainsKey("crop_id"))
				r.crop_id = ParseInt(row["crop_id"]);
			if(row.ContainsKey("name"))
				r.name = row["name"];
			if(row.ContainsKey("price_type"))
				r.price_type = ParseInt(row["price_type"]);
			if(row.ContainsKey("price"))
				r.price = ParseInt(row["price"]);
			if(row.ContainsKey("level"))
				r.level = ParseInt(row["level"]);
			if(row.ContainsKey("event_count"))
				r.event_count = ParseInt(row["event_count"]);
			if(row.ContainsKey("ripe_time"))
				r.ripe_time = ParseInt(row["ripe_time"]);
//			if(row.ContainsKey("fruit_id"))
//				r.fruit_id = ParseInt(row["fruit_id"]);
//			if(row.ContainsKey("count"))
//				r.count = ParseInt(row["count"]);
			if(row.ContainsKey("intro"))
				r.intro = row["intro"];
			if(row.ContainsKey("seedling"))
				r.seedling = row["seedling"];
			if(row.ContainsKey("fruit_model"))
				r.fruit_model = row["fruit_model"];
			if(row.ContainsKey("icon"))
				r.icon = row["icon"];
			
			mPlantSeedTable.Add(r);
		}
	}
	//--------------------------------------------------
	public function getPlantSeedTable() : Array
	{
		return mPlantSeedTable;
	}
	//--------------------------------------------------
	public function getPlantSeedRow(id : int) : PlantSeedRow
	{
		for (var row : PlantSeedRow in mPlantSeedTable)
		{
			if (id == row.crop_id)
				return row;
		}
		throw Exception("LogicTableManager -> getPlantSeedRow(int) -> can't find id[" + id + "].");
	}
	//--------------------------------------------------
	function LoadPlantLockTable() {
		var dt:XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("flowerpot_unlock").text);
		for(var row:Hashtable in dt.Table)
		{
			var r:PlantLockRow = new PlantLockRow();
			if(row.ContainsKey("number"))
				r.number = ParseInt(row["number"]);
			if(row.ContainsKey("level"))
				r.level = ParseInt(row["level"]);
			if(row.ContainsKey("coin"))
				r.coin = ParseInt(row["coin"]);
			if(row.ContainsKey("item_id1"))
				r.item_id1= ParseInt(row["item_id1"]);
			if(row.ContainsKey("goods_id1"))
				r.goods_id1= ParseInt(row["goods_id1"]);
			if(row.ContainsKey("count1"))
				r.count1 = ParseInt(row["count1"]);
			if(row.ContainsKey("item_id2"))
				r.item_id2 = ParseInt(row["item_id2"]);
			if(row.ContainsKey("goods_id2"))
				r.goods_id2= ParseInt(row["goods_id2"]);
			if(row.ContainsKey("count2"))
				r.count2 = ParseInt(row["count2"]);
			if(row.ContainsKey("item_id3"))
				r.item_id3 = ParseInt(row["item_id3"]);
			if(row.ContainsKey("goods_id3"))
				r.goods_id3= ParseInt(row["goods_id3"]);
			if(row.ContainsKey("count3"))
				r.count3 = ParseInt(row["count3"]);
			if(row.ContainsKey("item_id4"))
				r.item_id4 = ParseInt(row["item_id4"]);
			if(row.ContainsKey("goods_id4"))
				r.goods_id4= ParseInt(row["goods_id4"]);
			if(row.ContainsKey("count4"))
				r.count4 = ParseInt(row["count4"]);
			
			PlantLockTable.Add(r.number, r);
		}
	}
	
	//--
	function LoadPlantFruitTable() {
		var dt:XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("fruit_tplt").text);
		for(var row:Hashtable in dt.Table)
		{
			var r:PlantFruitRow = new PlantFruitRow();
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("item_id"))
				r.seedID = ParseInt(row["item_id"]);
			if(row.ContainsKey("fruit_id"))
				r.fruitID = ParseInt(row["fruit_id"]);
			if(row.ContainsKey("ratio"))
				r.rate = ParseInt(row["ratio"]);
			if(row.ContainsKey("count"))
				r.count = ParseInt(row["count"]);
			if(row.ContainsKey("model"))
				r.maturity = row["model"];
			
			PlantFruitTable.Add(r.id, r);
		}
	}
	
	//--
	function LoadDivorceTable()
	{
		var dt:XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("divorce_tplt").text);
		
		for (var row : Hashtable in dt.Table)
		{
			var r : DivorceRow = new DivorceRow();
			
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("level"))
				r.level = ParseInt(row["level"]);
			if(row.ContainsKey("cost"))
				r.cost = ParseInt(row["cost"]);
			
			DivorceTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	private function LoadFurniturePropertyTable() : void
	{
		var dt:XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("furniture_additional_properties_tplt").text);
		
		for (var row : Hashtable in dt.Table)
		{
			var r : FurniturePropertyRow = new FurniturePropertyRow();
			
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("decoration"))
				r.decoration = ParseInt(row["decoration"]);
			
			mFurniturePropertyTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	public function getFurniturePropertyRow(id : int) : FurniturePropertyRow
	{
		if (false == mFurniturePropertyTable.ContainsKey(id))
			throw Exception("LogicTableManager -> getFurniturePropertyRow(int) -> can't find id[" + id + "].");
		
		return mFurniturePropertyTable[id];
	}
	//--------------------------------------------------
	private function LoadNpcTable() : void
	{
		var dt:XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("npc_tplt").text);
		
		for (var row : Hashtable in dt.Table)
		{
			var r : NpcRow = new NpcRow();
			
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("sex"))
				r.sex = ParseInt(row["sex"]);
			if(row.ContainsKey("name"))
				r.name = row["name"];
			
			NpcTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	private function LoadClothesPropertyTable() : void
	{
		var dt:XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("item_dress_additional_properties_tplt").text);
		
		for (var row : Hashtable in dt.Table)
		{
			var r : ClothesPropertyRow = new ClothesPropertyRow();
			
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("charm"))
			{
				var charm_str : String = row["charm"] as String;
				if (charm_str.Contains("{") || charm_str.Contains("}") || charm_str.Contains(","))
					r.charm = -1;
				else
					r.charm = ParseInt(charm_str);
			}
			
			mClothesPropertyTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	public function getClothesPropertyRow(id : int) : ClothesPropertyRow
	{
		if (false == mClothesPropertyTable.ContainsKey(id))
			throw Exception("LogicTableManager -> getClothesPropertyRow(int) -> can't find id[" + id + "].");
		
		return mClothesPropertyTable[id];
	}
	//--------------------------------------------------
	private function LoadCollectTaskTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("collect_task_tplt").text);
		
		for (var row : Hashtable in dt.Table)
		{
			var r : CollectTaskRow = new CollectTaskRow();
			
			if (row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if (row.ContainsKey("content"))
				r.content = row["content"];
			if (row.ContainsKey("target"))
				r.target = row["target"];
			if (row.ContainsKey("require_item"))
				r.require_item = ParseInt(row["require_item"]);
			if (row.ContainsKey("require_item_count"))
				r.require_item_count = ParseInt(row["require_item_count"]);
			
			mCollectTaskTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	public function getCollectTaskRow(id : int) : CollectTaskRow
	{
		if (false == mCollectTaskTable.ContainsKey(id))
			throw Exception("LogicTableManager -> getCollectTaskRow(int) -> can't find id[" + id + "].");
		
		return mCollectTaskTable[id];
	}
	//--------------------------------------------------
	private function LoadDeliverGoodsTaskTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("deliver_goods_task_tplt").text);
		
		for (var row : Hashtable in dt.Table)
		{
			var r : DeliverGoodsTaskRow = new DeliverGoodsTaskRow();
			
			if (row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if (row.ContainsKey("content"))
				r.content = row["content"];
			if (row.ContainsKey("target"))
				r.target = row["target"];
			if (row.ContainsKey("npc_id"))
				r.npc_id = ParseInt(row["npc_id"]);
			if (row.ContainsKey("npc_name"))
				r.npc_name = row["npc_name"];
			if (row.ContainsKey("require_item"))
				r.require_item = ParseInt(row["require_item"]);
			
			mDeliverGoodsTaskTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	public function getDeliverGoodsTaskRow(id : int) : DeliverGoodsTaskRow
	{
		if (false == mDeliverGoodsTaskTable.ContainsKey(id))
			throw Exception("LogicTableManager -> getDeliverGoodsTaskRow(int) -> can't find id[" + id + "].");
		
		return mDeliverGoodsTaskTable[id];
	}
	//--------------------------------------------------
	private function LoadDialogueTaskTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("dialogue_task_tplt").text);
		
		for (var row : Hashtable in dt.Table)
		{
			var r : DialogueTaskRow = new DialogueTaskRow();
			
			if (row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if (row.ContainsKey("content"))
				r.content = row["content"];
			if (row.ContainsKey("target"))
				r.target = row["target"];
			if (row.ContainsKey("npc_id"))
				r.npc_id = ParseInt(row["npc_id"]);
			if (row.ContainsKey("npc_name"))
				r.npc_name = row["npc_name"];
			
			mDialogueTaskTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	public function getDialogueTaskRow(id : int) : DialogueTaskRow
	{
		if (false == mDialogueTaskTable.ContainsKey(id))
			throw Exception("LogicTableManager -> getDialogueTaskRow(int) -> can't find id[" + id + "].");
		
		return mDialogueTaskTable[id];
	}
	//--------------------------------------------------
	private function LoadFindItemTaskTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("find_item_task_tplt").text);
		
		for (var row : Hashtable in dt.Table)
		{
			var r : FindItemTaskRow = new FindItemTaskRow();
			
			if (row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if (row.ContainsKey("content"))
				r.content = row["content"];
			if (row.ContainsKey("target"))
				r.target = row["target"];
			if (row.ContainsKey("area_event_id"))
				r.area_event_id = ParseInt(row["area_event_id"]);
			if (row.ContainsKey("map_name"))
				r.map_name = row["map_name"];
			if (row.ContainsKey("reward_item"))
				ParseIntArray(row["reward_item"], r.reward_items);
			
			mFindItemTaskTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	public function getFindItemTaskRow(id : int) : FindItemTaskRow
	{
		if (false == mFindItemTaskTable.ContainsKey(id))
			throw Exception("LogicTableManager -> getFindItemTaskRow(int) -> can't find id[" + id + "].");
		
		return mFindItemTaskTable[id];
	}
	//--------------------------------------------------
	private function LoadFunctionTaskTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("function_task_tplt").text);
		
		for (var row : Hashtable in dt.Table)
		{
			var r : FunctionTaskRow = new FunctionTaskRow();
			
			if (row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if (row.ContainsKey("content"))
				r.content = row["content"];
			if (row.ContainsKey("target"))
				r.target = row["target"];
			if (row.ContainsKey("func_id"))
				r.func_id = ParseInt(row["func_id"]);
			if (row.ContainsKey("func_content"))
				r.func_content = row["func_content"];
			if (row.ContainsKey("func_count"))
				r.func_count = ParseInt(row["func_count"]);
			
			mFunctionTaskTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	public function getFunctionTaskRow(id : int) : FunctionTaskRow
	{
		if (false == mFunctionTaskTable.ContainsKey(id))
			throw Exception("LogicTableManager -> getFunctionTaskRow(int) -> can't find id[" + id + "].");
		
		return mFunctionTaskTable[id];
	}
	//--------------------------------------------------
	private function LoadRingTaskTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("ring_task_tplt").text);
		
		for (var row : Hashtable in dt.Table)
		{
			var r : RingTaskRow = new RingTaskRow();
			
			if (row.ContainsKey("ring_count"))
				r.ring_count = ParseInt(row["ring_count"]);
			if (row.ContainsKey("due_time"))
				r.due_time = ParseInt(row["due_time"]);
			if (row.ContainsKey("stop_require_item"))
				r.stop_require_item = ParseInt(row["stop_require_item"]);
			if (row.ContainsKey("stop_require_item_count"))
				r.stop_require_item_count = ParseInt(row["stop_require_item_count"]);
			if (row.ContainsKey("reward_items"))
				ParseIntArray(row["reward_items"], r.reward_items);
			if (row.ContainsKey("reward_items_count"))
				ParseIntArray(row["reward_items_count"], r.reward_items_count);
			if (row.ContainsKey("reward_diamond"))
				r.reward_diamond = ParseInt(row["reward_diamond"]);
			if (row.ContainsKey("reward_exp"))
				r.reward_exp = ParseInt(row["reward_exp"]);
			if (row.ContainsKey("q_coin"))
				r.q_coin = ParseInt(row["q_coin"]);
			
			mRingTaskTable.Add(r.ring_count, r);
		}
	}
	//--------------------------------------------------
	public function getRingTaskRow(id : int) : RingTaskRow
	{
		if (false == mRingTaskTable.ContainsKey(id))
			throw Exception("LogicTableManager -> getRingTaskRow(int) -> can't find id[" + id + "].");
		
		return mRingTaskTable[id];
	}
	//--------------------------------------------------
	private function LoadFriendIntimateTable() {
		var dt:XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("intimate_level").text);
		
		for (var row : Hashtable in dt.Table)
		{
			var r : FriendIntimateRow = new FriendIntimateRow();
			
			if(row.ContainsKey("level"))
				r.level = ParseInt(row["level"]);
			if(row.ContainsKey("toplimit"))
				r.toplimit = ParseInt(row["toplimit"]);
			if(row.ContainsKey("name"))
				r.name = row["name"];
			if(row.ContainsKey("tooltip"))
				r.desc = row["tooltip"];
			if(row.ContainsKey("icon"))
				r.icon = row["icon"];
			
			FriendIntimateTable.Add(r.level, r);
		}
	}
	//--------------------------------------------------
	private function LoadWallFloorReplacePartTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("wall_floor_repalce_part_tplt").text);
		
		for (var row : Hashtable in dt.Table)
		{
			var r : WallFloorReplacePartRow = new WallFloorReplacePartRow();
			
			if (row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if (row.ContainsKey("floors"))
				ParseStringArray(row["floors"], r.floors);
			if (row.ContainsKey("floors_replace"))
				ParseStringArray(row["floors_replace"], r.floors_replace);
			if (row.ContainsKey("inner_walls"))
				ParseStringArray(row["inner_walls"], r.inner_walls);
			if (row.ContainsKey("inner_walls_replace"))
				ParseStringArray(row["inner_walls_replace"], r.inner_walls_replace);
			if (row.ContainsKey("outer_walls"))
				ParseStringArray(row["outer_walls"], r.outer_walls);
			if (row.ContainsKey("outer_walls_replace"))
				ParseStringArray(row["outer_walls_replace"], r.outer_walls_replace);
			
			mWallFloorReplacePartTable.Add(r.id, r);
		}
	}
	
	//--
	function LoadFlowerRockAwardTable() {
		var dt:XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("flower_love_coin_shake_tplt").text);
		for(var row:Hashtable in dt.Table)
		{
			var r:FlowerRockAward = new FlowerRockAward();
			if(row.ContainsKey("nthtime"))
				r.nthtime = ParseInt(row["nthtime"]);
			if(row.ContainsKey("diamond"))
				r.diamond = ParseInt(row["diamond"]);
			if(row.ContainsKey("exp"))
				r.exp = ParseInt(row["exp"]);
			if(row.ContainsKey("item_id"))
				r.item_id = ParseInt(row["item_id"]);
			if(row.ContainsKey("item_count"))
				r.item_count = ParseInt(row["item_count"]);
			if(row.ContainsKey("love_coin"))
				r.love_coin = ParseInt(row["love_coin"]);
			
			FlowerRockAwardTable.Add(r.nthtime, r);
		}
	}
	
	//--
	function LoadFlowerFreeRockAwardTable() {
		var dt:XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("flower_shake_tplt").text);
		for(var row:Hashtable in dt.Table)
		{
			var r:FlowerFreeRockAward = new FlowerFreeRockAward();
			if(row.ContainsKey("nthtime"))
				r.nthtime = ParseInt(row["nthtime"]);
			if(row.ContainsKey("diamond"))
				r.diamond = ParseInt(row["diamond"]);
			if(row.ContainsKey("exp"))
				r.exp = ParseInt(row["exp"]);
			if(row.ContainsKey("item_id"))
				r.item_id = ParseInt(row["item_id"]);
			if(row.ContainsKey("item_count"))
				r.item_count = ParseInt(row["item_count"]);
			
			FlowerFreeRockAwardTable.Add(r.nthtime, r);
		}
	}
	
	
	//--------------------------------------------------
	public function getWallFloorReplacePartRow(id : int) : WallFloorReplacePartRow
	{
		if (false == mWallFloorReplacePartTable.ContainsKey(id))
		{
			// 这里不抛异常,允许找不到
			Debug.Log("LogicTableManager -> getWallFloorReplacePartRow(int) -> can't find id[" + id + "].");
			return null;
		}
		return mWallFloorReplacePartTable[id];
	}
	//--------------------------------------------------
	private function LoadAutoFitmentTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("auto_fitment_tplt").text);
		
		for (var row : Hashtable in dt.Table)
		{
			var r : AutoFitmentRow = new AutoFitmentRow();
			
			if (row.ContainsKey("house_id"))
				r.house_id = ParseInt(row["house_id"]);
			if (row.ContainsKey("scheme"))
				r.scheme = ParseInt(row["scheme"]);
			if (row.ContainsKey("furniture_id"))
				r.furniture_id = ParseInt(row["furniture_id"]);
			if (row.ContainsKey("goods_id"))
				r.goods_id = ParseInt(row["goods_id"]);
			if (row.ContainsKey("x"))
				r.x = ParseInt(row["x"]);
			if (row.ContainsKey("z"))
				r.z = ParseInt(row["z"]);
			if (row.ContainsKey("height"))
				r.height = ParseFloat(row["height"]);
			if (row.ContainsKey("face"))
				r.face = ParseInt(row["face"]);
			if (row.ContainsKey("floor"))
				r.floor = ParseInt(row["floor"]);
			
			mAutoFitmentTable.Add(r);
		}
	}
	//--------------------------------------------------
	public function getAutoFitmentRows(house_id : int, scheme : int) : Array
	{
		var arr : Array = new Array();
		for (var row : AutoFitmentRow in mAutoFitmentTable)
		{
			if (house_id == row.house_id && scheme == row.scheme)
			{
				arr.Add(row);
			}
		}
		return arr;
	}
	//--------------------------------------------------
	public function getAutoFitmentSchemes(house_id : int) : Array
	{
		var arr : Array = new Array();
		for (var row : AutoFitmentRow in mAutoFitmentTable)
		{
			if (house_id == row.house_id && -1 == CommFunc.indexOfArray(arr, row.scheme))
			{
				arr.Add(row.scheme);
			}
		}
		return arr;
	}
	//--------------------------------------------------
	function LoadMerryTable() {
		var dt:XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("mateup_diamond").text);
		
		for (var row : Hashtable in dt.Table)
		{
			var r : MerryCostRow = new MerryCostRow();
			
			if(row.ContainsKey("level"))
				r.level = ParseInt(row["level"]);
			if(row.ContainsKey("diamond"))
				r.diamond = ParseInt(row["diamond"]);
			
			MerryCostTable.Add(r.level, r);
		}
	}
	//--------------------------------------------------
	private function LoadItemUpgrade() {
		var dt:XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("item_upgrade_tplt").text);
		
		for (var row : Hashtable in dt.Table)
		{
			var r : ItemUpgradeRow = new ItemUpgradeRow();
			
			if(row.ContainsKey("item_sub_id"))
				r.id = ParseInt(row["item_sub_id"]);
			if(row.ContainsKey("consume_items"))
				r.props = row["consume_items"];
			if(row.ContainsKey("consume_diamond"))
				r.diamond = ParseInt(row["consume_diamond"]);
			if(row.ContainsKey("upgraded_property"))
				r.proVal = ParseInt(row["upgraded_property"]);
			if(row.ContainsKey("upgraded_item_id"))
				r.productId = ParseInt(row["upgraded_item_id"]);
			
			mItemUpgradeTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	public function getItemUpgradeRow(id : int) : ItemUpgradeRow
	{
		if (false == mItemUpgradeTable.ContainsKey(id))
		{
			// 这里不抛异常,允许找不到
			Debug.Log("LogicTableManager -> getItemUpgradeRow(int) -> can't find id[" + id + "].");
			return null;
		}
		return mItemUpgradeTable[id];
	}
	//--------------------------------------------------
	function LoadRemedy() {
		var dt:XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("make_up_tplt").text);
		
		for (var row : Hashtable in dt.Table)
		{
			var r : RemedyRow = new RemedyRow();
			
			if(row.ContainsKey("level"))
				r.level = ParseInt(row["level"]);
			if(row.ContainsKey("items"))
				r.awards = row["items"];
			
			RemedyTable.Add(r.level, r);
		}
	}
	//--------------------------------------------------
	private function LoadYYGiftTable() : void
	{
		if (false == isYYPlatform()) return;
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("yy_gift_tplt").text);
		
		for (var row : Hashtable in dt.Table)
		{
			var r : YYGiftRow = new YYGiftRow();
			
			if (row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if (row.ContainsKey("type"))
				r.type = ParseInt(row["type"]);
			if (row.ContainsKey("hot"))
				r.hot = 0 == ParseInt(row["hot"]) ? false : true;
			if (row.ContainsKey("price"))
				r.price = ParseInt(row["price"]);
			if (row.ContainsKey("recv_price"))
				r.recv_price = ParseInt(row["recv_price"]);
			if (row.ContainsKey("probability"))
				r.probability = ParseInt(row["probability"]);
			if (row.ContainsKey("back_price"))
				r.back_price = ParseInt(row["back_price"]);
			if (row.ContainsKey("display_type"))
				r.display_type = ParseInt(row["display_type"]);
			if (row.ContainsKey("display_id"))
				r.display_id = ParseInt(row["display_id"]);
			
			mYYGiftTable.Add(r);
		}
	}
	//--------------------------------------------------
	public function getYYGiftTable() : Array
	{
		return mYYGiftTable;
	}
	//--------------------------------------------------
	public function getYYGiftRow(id : int) : YYGiftRow
	{
		for (var row : YYGiftRow in mYYGiftTable)
		{
			if (id == row.id)
				return row;
		}
		throw Exception("LogicTableManager -> getYYGiftRow(int, int) -> can't find id["+id+"].");
	}
	//--------------------------------------------------
	private function LoadYYGiftDisplayTable() : void
	{
		if (false == isYYPlatform()) return;
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("yy_gift_display_tplt").text);
		
		for (var row : Hashtable in dt.Table)
		{
			var r : YYGiftDisplayRow = new YYGiftDisplayRow();
			
			if (row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if (row.ContainsKey("num"))
				r.num = ParseInt(row["num"]);
			if (row.ContainsKey("display"))
				ParseStringArray(row["display"], r.display);
			if (row.ContainsKey("display_time"))
				r.display_time = ParseInt(row["display_time"]);
			if (row.ContainsKey("frame_rate"))
				r.frame_rate = ParseFloat(row["frame_rate"]);
			if (row.ContainsKey("start_pos"))
				r.start_pos = ParserVector3(row["start_pos"]);
			if (row.ContainsKey("end_pos"))
				r.end_pos = ParserVector3(row["end_pos"]);
			
			mYYGiftDisplayTable.Add(r);
		}
	}
	//--------------------------------------------------
	public function getYYGiftDisplayRow(id : int, num : int) : YYGiftDisplayRow
	{
		for (var row : YYGiftDisplayRow in mYYGiftDisplayTable)
		{
			if (id == row.id && num == row.num)
				return row;
		}
		throw Exception("LogicTableManager -> getYYGiftDisplayRow(int, int) -> can't find id["+id+"], num["+num+"].");
	}
	//--------------------------------------------------
	private function LoadGuestTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("guest_tplt").text);
		
		for (var row : Hashtable in dt.Table)
		{
			var r : GuestRow = new GuestRow();
			
			if (row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if (row.ContainsKey("sex"))
				r.sex = ParseInt(row["sex"]);
			if (row.ContainsKey("model"))
				r.model = row["model"];
			if (row.ContainsKey("name"))
				r.name = row["name"];
			
			mGuestTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	public function getGuestRow(id : int) : GuestRow
	{
		if (false == mGuestTable.ContainsKey(id))
			throw Exception("LogicTableManager -> getGuestRow(int) -> can't find id[" + id + "].");
		
		return mGuestTable[id];
	}
	//--------------------------------------------------
	private function LoadGuestStarTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("guest_star_tplt").text);
		
		for (var row : Hashtable in dt.Table)
		{
			var r : GuestStarRow = new GuestStarRow();
			
			if (row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if (row.ContainsKey("star"))
				r.star = row["star"];
			
			mGuestStarTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	public function getGuestStarRow(id : int) : GuestStarRow
	{
		if (false == mGuestStarTable.ContainsKey(id))
			throw Exception("LogicTableManager -> getGuestStarRow(int) -> can't find id[" + id + "].");
		
		return mGuestStarTable[id];
	}
	//--------------------------------------------------
	private function LoadNormalSpriteTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("normal_sprite_tplt").text);
		
		for (var row : Hashtable in dt.Table)
		{
			var r : NormalSpriteRow = new NormalSpriteRow();
			
			if (row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if (row.ContainsKey("appraise"))
				r.appraise = ParseInt(row["appraise"]);
			if (row.ContainsKey("buff_id"))
				r.buff_id = ParseInt(row["buff_id"]);
			if (row.ContainsKey("modal"))
				r.model = row["modal"];
			if (row.ContainsKey("show"))
				r.show = row["show"];
			if (row.ContainsKey("dispear"))
				r.dispear = row["dispear"];
			if (row.ContainsKey("halo"))
				r.halo = row["halo"];
			
			mNormalSpriteTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	public function getNormalSpriteRow(id : int) : NormalSpriteRow
	{
		if (false == mNormalSpriteTable.ContainsKey(id))
			throw Exception("LogicTableManager -> getNormalSpriteRow(int) -> can't find id[" + id + "].");
		
		return mNormalSpriteTable[id];
	}
	//--------------------------------------------------
	private function LoadSpriteUpgradeTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("sprite_upgrade_tplt").text);
		
		for (var row : Hashtable in dt.Table)
		{
			var r : SpriteUpgradeRow = new SpriteUpgradeRow();
			
			if (row.ContainsKey("id"))
				r.sprite_id = ParseInt(row["id"]);
			if (row.ContainsKey("level"))
				r.level = ParseInt(row["level"]);
			if (row.ContainsKey("show_count"))
				r.show_count = ParseInt(row["show_count"]);
			if (row.ContainsKey("award_money"))
				r.award_money = ParseInt(row["award_money"]);
			if (row.ContainsKey("award_exp"))
				r.award_exp = ParseInt(row["award_exp"]);
			
			mSpriteUpgradeTable.Add(r);
		}
	}
	//--------------------------------------------------
	public function getSpriteUpgradeRow(spriteId : int, level : int) : SpriteUpgradeRow
	{
		for (var row : SpriteUpgradeRow in mSpriteUpgradeTable)
		{
			if (spriteId == row.sprite_id && level == row.level)
				return row;
		}
		return null;
	}
	//--------------------------------------------------
	private function LoadWaiterTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("waiter_tplt").text);
		
		for (var row : Hashtable in dt.Table)
		{
			var r : WaiterRow = new WaiterRow();
			
			if (row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if (row.ContainsKey("waiter_name"))
				r.waiter_name = row["waiter_name"];
			if (row.ContainsKey("waiter_lv"))
				r.waiter_lv = ParseInt(row["waiter_lv"]);
			if (row.ContainsKey("player_lv"))
				r.player_lv = ParseInt(row["player_lv"]);
			if (row.ContainsKey("explain"))
				r.explain = row["explain"];
			if (row.ContainsKey("coin_rate"))
				r.coin_rate = ParseFloat(row["coin_rate"]);
			if (row.ContainsKey("exp_rate"))
				r.exp_rate = ParseFloat(row["exp_rate"]);
			if (row.ContainsKey("item_drop_rate"))
				r.item_drop_rate = ParseFloat(row["item_drop_rate"]);
			if (row.ContainsKey("speciality_explain"))
				r.speciality_explain = row["speciality_explain"];
			if (row.ContainsKey("employ_money"))
				r.employ_money = ParseInt(row["employ_money"]);
			if (row.ContainsKey("waiter_mod_name"))
				r.waiter_mod_name = row["waiter_mod_name"];
			if (row.ContainsKey("picture"))
				r.picture = row["picture"];
			if (row.ContainsKey("up_id"))
				r.up_id = ParseInt(row["up_id"]);
			if (row.ContainsKey("up_coin"))
				r.up_coin = ParseInt(row["up_coin"]);
			if (row.ContainsKey("up_house_lv"))
				r.up_house_lv = ParseInt(row["up_house_lv"]);
			
			mWaiterTable.Add(r.id, r);
		}
	}
	//--------------------------------------------------
	public function getWaiterRow(id : int) : WaiterRow
	{
		if (false == mWaiterTable.ContainsKey(id))
			throw Exception("LogicTableManager -> getWaiterRow(int) -> can't find id[" + id + "].");
			
		return mWaiterTable[id];
	}
	
	//--------------------------------------------------
	// 加载新的BUFF表
	private function LoadNewBuffTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("buff_tplt").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : NewBuffRow = new NewBuffRow();
			
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("type"))
				r.type = ParseInt(row["type"]);
			if(row.ContainsKey("duration"))
				r.duration = ParseInt(row["duration"]);
			if (row.ContainsKey("normal_icon"))
				r.normal_icon = row["normal_icon"];
			if (row.ContainsKey("disable_icon"))
				r.disable_icon = row["disable_icon"];
			if (row.ContainsKey("hint"))
				r.hint = row["hint"];
			if (row.ContainsKey("sys_msg"))
				r.sys_msg = row["sys_msg"];
			if (row.ContainsKey("param"))
				r.param = row["param"];
				
			mBuffTable.Add(r.id, r);
		}
	}
	
	public function getBuffRow(id : int) : NewBuffRow
	{
		if (false == mBuffTable.ContainsKey(id))
			throw Exception("LogicTableManager -> getBuffRow(int) -> can't find id["+ id +"].");
			
		return mBuffTable[id];
	}
	
	// 加载派对食物表
	private function LoadPartyFoodTable() : void
	{
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(GetTable("party_food_tplt").text);
		
		for(var row : Hashtable in dt.Table)
		{
			var r : PartyFoodRow = new PartyFoodRow();
			
			if(row.ContainsKey("id"))
				r.id = ParseInt(row["id"]);
			if(row.ContainsKey("diamond"))
				r.diamond = ParseInt(row["diamond"]);
			if(row.ContainsKey("hp"))
				r.hp = ParseInt(row["hp"]);
			if(row.ContainsKey("point"))
				r.point = ParseInt(row["point"]);
			if(row.ContainsKey("food_name"))
				r.food_name = row["food_name"];
			if(row.ContainsKey("model_name"))
				r.model_name = row["model_name"];
				
			mPartyFoodTable.Add(r.id, r);
		}		
	}
	
	public function getPartyFoodRow(id : int) : PartyFoodRow
	{
		if(false == mPartyFoodTable.ContainsKey(id))
			throw Exception("LogicTableManager -> getPartyFood(int) -> can't find id["+ id +"].");
			
		return mPartyFoodTable[id];
	}
	
	// alter by zlj 派对请喝酒表格
	private function LoadPartyDrinksTable()
	{	
		var dataTable : XmlDataTable = new XmlDataTable();
		dataTable.LoadFromString(GetTable("party_drink_tplt").text);

		for(var row : Hashtable in dataTable.Table)
		{
		    var drinkInfo : PartyDrinkRow = new PartyDrinkRow();
		    if(row.ContainsKey("id"))
		    {
		       drinkInfo.id = ParseInt(row["id"]);
		    }
		    if(row.ContainsKey("name"))
		    {
		       drinkInfo.name = row["name"];
		    }
		    if(row.ContainsKey("price"))
		    {
		       drinkInfo.price = ParseInt(row["price"]);
		    }
		    if(row.ContainsKey("type"))
		    {
		       drinkInfo.type = ParseInt(row["type"]);
		    }
		    if(row.ContainsKey("master_score"))
		    {
		       drinkInfo.master_score = ParseInt(row["master_score"]);
		    }
		    if(row.ContainsKey("guest_score"))
		    {
		       drinkInfo.guest_score = ParseInt(row["guest_score"]);
		    }
		    if(row.ContainsKey("shout_count"))
		    {
		       drinkInfo.shout_count = ParseInt(row["shout_count"]);
		    }
		    if(row.ContainsKey("shouted_count"))
		    {
		       drinkInfo.shouted_count = ParseInt(row["shouted_count"]);
		    }
		    
		    mPartyDrinkTable.Add(drinkInfo);
		}
	} 
	// 获取请喝酒的表格数据
	public function getPartyDrinkTableData() : Array
	{
	    return mPartyDrinkTable;
	}	
}


