#pragma strict

enum FOODLOCKENUM{
	LOCKED = 0,		//锁住
	UNLOCKED = 1,	//没锁住
}

//食物基础表
class BartenderFoodBaseInfoRow{
	var food_id : int;									//食物id
	var upgrade_id : int;								//对应升级表和产品表的ID
	var need_role_level : int;							//解锁需要的角色等级
	var unlock_diamond : int;							//解锁需要的水晶
	var is_default_lock : int;						//是否默认锁住 (1---没锁住，0---默认锁住)
	var min_stock : int;								//最小库存(格子数)
	var max_stock : int;								//最大库存(格子数)
	var max_upgrade_level : int;						//升级的最大等级
	var expand_stock_diamonds : Array = new Array();// per is int	//扩容库存需要的水晶集合
	var expand_stock_times : Array = new Array(); //per is int	//扩充库存需要的时间集合
	var expand_stock_love_coins : Array = new Array();			//扩充库存需要的爱情币集合
	
	//
	var consume_seconds : int;
	var cur_stock_value : int;
	var cur_stock_occupyed_grid : int; //当前库存占用了多少格子
	var cur_premake_stock_value : int; //当前准备增加制作的量
	var cur_atmaking_stock_value : int; //当前正在制作的量
	var cur_level : int;
	var cur_open_gridNum : int;
	var cur_remain_expand_time : stime = null;
	//
	var player_level : int;		// 需要该食物的玩家等级
	var house_level : int;		// 需要该食物的房屋等级
	var particle : String;		// 客人需要该食物时头上显示的粒子效果
	var unsatisfy : String;		// 不满意的粒子效果
}

//食物产品表
class BartenderFoodProductInfoRow{
	var product_id : int;			//产品ID
	var name : String;				//食物名称
	var icon : String;				//食物图标
	var level : int;				//星级
	var shaking_diamond : int;		//调制食物需要的水晶
	var shaking_time : int;			//调制需要的时间
	var copies_per_grid : int;		//每格的份数
	var price_per_copy : float;		//每份的价钱
	var consume_speed : int;		//消费完食物需要的时间
	var sale_time : int;			//销售时间
	var desc : String;				//产品描述
	var love_coin : int;			//立即完成需要的水晶
}

//食物升级表
class BartenderFoodUpgradeInfoRow{
	var upgrade_id : int;			//升级表id
	var need_decoration : int;		//升级所需的豪华度
	var need_diamond : int;			//升级需要的水晶
	var next_upgrade_id : int;		//下一级升级id
	var need_item_ids   : Array = new Array();	//升级需要的物品ID集合
	var need_item_cnts  : Array = new Array();	//升级需要的物品数量集合
	var need_shop_ids   : Array = new Array();  //升级需要的物品在商场中的ID集合 
	var need_love_coins : Array = new Array();  //补齐材料所需的爱情币
}

// add by zlj 制作扩展酒槽表
class BarCntrProductInfoRow{
    var upgrade_id   : int; // 升级酒槽的ID 
    var need_diamond : int; // 升级需要的水晶 
    var need_item_ids  : Array = new Array(); // 升级需要的物品ID集合
    var need_item_cnts : Array = new Array(); // 升级需要的物品数量集合  
    var need_shop_ids  : Array = new Array(); // 升级需要的物品在商城中的ID集合
}

class BartenderSysTablesMgr{
	
	var curUnlockedFoodNum : int = 0;
	private var mFoodCurInfoTable : ArrayList = new ArrayList();
	private var mFoodBaseInfoTable : ArrayList = new ArrayList();
	private var mFoodProductInfoTable : ArrayList = new ArrayList();
	private var mFoodUpgradeInfoTable : ArrayList = new ArrayList();
	private var mInStockFoodTable : ArrayList = new ArrayList();
	// add by zlj 
	private var mBarCntrProductInfoTable : ArrayList = new ArrayList();
	
	//
	public function updateCurStockValue(food_id : int, dvalue : int){
		for(var baseInfo : BartenderFoodBaseInfoRow in mFoodBaseInfoTable){
			if(baseInfo.food_id == food_id){
				baseInfo.cur_stock_value += dvalue;
				break;
			}
		}
	}
	
	public function updateAtmakingProductVale(food_id : int, isAdd : boolean){
		for(var baseInfo : BartenderFoodBaseInfoRow in mFoodBaseInfoTable){
				if(baseInfo.food_id == food_id){
					var productRow : BartenderFoodProductInfoRow = getProductInfoRow(baseInfo.upgrade_id);
					if(isAdd){
						baseInfo.cur_atmaking_stock_value += productRow.copies_per_grid;
					}
					else{
						baseInfo.cur_atmaking_stock_value -= productRow.copies_per_grid;
					}
					break;
				}
		}
	}
	
	public function updatePremakeStockValue(pre_add_food_id : int, dvalue : int, isAdd : boolean){
		for(var baseInfo : BartenderFoodBaseInfoRow in mFoodBaseInfoTable){
				if(baseInfo.food_id == pre_add_food_id){
					//var productRow : BartenderFoodProductInfoRow = getProductInfoRow(baseInfo.upgrade_id);
					if(isAdd){
						baseInfo.cur_premake_stock_value += dvalue;
					}
					else{
						baseInfo.cur_premake_stock_value -= dvalue;
					}
					break;
				}
		}
	}
	
	public function updateExpandFoodStockState(timeInfo : ExpandStockTimeInfo, cancel : boolean){
		for(var baseInfo : BartenderFoodBaseInfoRow in mFoodBaseInfoTable){
				if(baseInfo.food_id == timeInfo.food_id){
					baseInfo.cur_remain_expand_time = timeInfo.during_time;
					if(timeInfo.during_time == null){
						if(!cancel)
							baseInfo.cur_open_gridNum += 1;
					}
					break;
				}
		}
	}
	
	public function updateUnlockedFoodListInfo(unlocked_food_id_list : ArrayList){ 
		for(var food_id : int in unlocked_food_id_list){
			for(var baseInfo : BartenderFoodBaseInfoRow in mFoodBaseInfoTable){
				if(baseInfo.food_id == food_id){
					baseInfo.is_default_lock = FOODLOCKENUM.UNLOCKED;
					break;
				}
			}
		}
	}
	
	public function updateSingleUnlockFoodInfo(food_id : int){
		for(var baseInfo : BartenderFoodBaseInfoRow in mFoodBaseInfoTable){
			if(baseInfo.food_id == food_id){
				baseInfo.is_default_lock = FOODLOCKENUM.UNLOCKED;
				break;
			}
		}
		updateUnlockedFoodNum();
	}
	
	public function updateFoodStockInfos(stock_info_list : ArrayList){
		var cur_stock_info_list_cnt : int = stock_info_list.Count;
		mInStockFoodTable.Clear();
		for(var i : int = 0; i < cur_stock_info_list_cnt; ++ i){
			var stock_info : food_stock_info = stock_info_list[i] as food_stock_info;
			
			for(var j : int = 0; j < mFoodBaseInfoTable.Count; ++ j){
				var baseInfoRow : BartenderFoodBaseInfoRow = mFoodBaseInfoTable[j] as BartenderFoodBaseInfoRow;
				if(stock_info.id == baseInfoRow.food_id){
					baseInfoRow.cur_stock_value = stock_info.value;
					baseInfoRow.cur_open_gridNum = stock_info.size;
					baseInfoRow.consume_seconds = stock_info.seconds;
					baseInfoRow.cur_remain_expand_time = stock_info.due_time;
					if(	baseInfoRow.cur_remain_expand_time != null 
						&& baseInfoRow.cur_remain_expand_time.year != 0
						&& baseInfoRow.cur_remain_expand_time.month != 0
						&& baseInfoRow.cur_remain_expand_time.day != 0
						&& baseInfoRow.cur_remain_expand_time.hour != 0
						&& baseInfoRow.cur_remain_expand_time.minute != 0
						&& baseInfoRow.cur_remain_expand_time.second != 0){
						
						BartenderSys.is_at_expanding_stock = true;
						BartenderSys.at_expanding_stock_food_id = baseInfoRow.food_id;
						var timeInfo : ExpandStockTimeInfo = new ExpandStockTimeInfo();
						timeInfo.food_id = baseInfoRow.food_id;
						timeInfo.during_time = baseInfoRow.cur_remain_expand_time;
						EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_EXPAND_FOOD_STOCK), timeInfo);
					}
					if(stock_info.value > 0)
						mInStockFoodTable.Add(baseInfoRow);
					break;
				}
			}
		}
		updateUnlockedFoodNum();
		initFoodUpgradeInfos();
	}
	
	function initFoodUpgradeInfos(){
		for(var baseInfo : BartenderFoodBaseInfoRow in mFoodBaseInfoTable){
			var productRow : BartenderFoodProductInfoRow = getProductInfoRow(baseInfo.upgrade_id);
			baseInfo.cur_level = productRow.level;
		}
	}
	
	public function updateFoodUpgradeInfos(upgrade_list : ArrayList){
		for(var i : int=0; i < upgrade_list.Count; ++ i){
			var upgrade_info : food_upgrade_info = upgrade_list[i] as food_upgrade_info;
			var productRow : BartenderFoodProductInfoRow = getProductInfoRow(upgrade_info.upgrade_id);
			var level : int = productRow.level;
			
			for(var baseInfo : BartenderFoodBaseInfoRow in mFoodBaseInfoTable){
				if(baseInfo.food_id == upgrade_info.id){
					baseInfo.cur_level = level;
					baseInfo.upgrade_id = upgrade_info.upgrade_id;
					break;
				}
			}
		}
	}
	
	public function updateSingleFoodUpgradeInfo(pack : notify_upgrade_food){
		for(var baseInfo : BartenderFoodBaseInfoRow in mFoodBaseInfoTable){
			if(baseInfo.food_id == pack.id){
				var productRow : BartenderFoodProductInfoRow = getProductInfoRow(pack.upgrade_id);
				var level : int = productRow.level;
				baseInfo.cur_level = level;
				baseInfo.upgrade_id = pack.upgrade_id;
				break;
			}
		}
	}
	
	//
	public function updateUnlockedFoodNum(){
		curUnlockedFoodNum = 0;
		for(var baseInfo : BartenderFoodBaseInfoRow in mFoodBaseInfoTable){
			if(baseInfo.is_default_lock == FOODLOCKENUM.UNLOCKED){
				++ curUnlockedFoodNum;
				
			}
		}
	}
	
	//
	public function getUnlockedFoodNum() : int{
		return curUnlockedFoodNum;
	}
	
	//判断食物是否有库存
	public function foodIsInStock(food_id : int) : boolean {
		for(var baseInfo : BartenderFoodBaseInfoRow in mInStockFoodTable){
			if(baseInfo.food_id == food_id){
				return true;
			}
		}
		
		return false;
	}
	
	//获取有库存的食物列表
	public function getInStockFoodList() : ArrayList{
		return mInStockFoodTable;
	}
	
	//获取食物表
	public function getFoodBaseInfoTable() : ArrayList {
		return mFoodBaseInfoTable;
	}
	
	//获取食物表信息
	public function getFoodBaseInfoRow(food_id : int) : BartenderFoodBaseInfoRow{
		for(var baseInfo : BartenderFoodBaseInfoRow in mFoodBaseInfoTable){
			if(baseInfo.food_id == food_id){
				return baseInfo;
			}
		}
		
		throw new Exception("food_id: " + food_id + "is not exist in player_food_tplt");
	}
	//获取符合玩家等级和房屋等级的食物表信息
	public function getFoodBaseInfoRowByLevel(playerLevel : int) : Array {
		var needArr : Array = new Array();
		for(var baseInfo : BartenderFoodBaseInfoRow in mFoodBaseInfoTable){
			var res : int = EQGameSceneMgr.getSingleton().compareHouseLevel(baseInfo.house_level);
			if(playerLevel >= baseInfo.player_level && -1 != res){
				needArr.Add(baseInfo);
			}
		}
		return needArr;
	}
	//获取产品表
	public function getProductInfoTable() : ArrayList {
		return mFoodProductInfoTable;
	}
	
	//获取产品表信息
	public function getProductInfoRow(product_id : int) : BartenderFoodProductInfoRow{
		for(var i : int = 0; i < mFoodProductInfoTable.Count; ++ i){
			var infoRow : BartenderFoodProductInfoRow = mFoodProductInfoTable[i] as BartenderFoodProductInfoRow;
			if(infoRow.product_id == product_id){
				return infoRow;
			}
		}
		
		throw new Exception("product_id: " + product_id + "is not exist in player_food_product_tplt");
	}
	
	//获取升级表
	public function getFoodUpgradeInfoTable() : ArrayList {
		return mFoodUpgradeInfoTable;
	}
	
	//获取食谱列表的食谱个数
	public function getFoodListCount() : int{
		if(mFoodBaseInfoTable){
			return mFoodBaseInfoTable.Count;
		}
		
		return 0;
	}
	
	// add by zlj 获取制作扩展酒槽容器的物品表
	public function getBarCntrProductInfoTable() : ArrayList{
	    return mBarCntrProductInfoTable;  
	}
	
	public function loadTables(){
		loadFoodBaseInfoTable();
		loadFoodProductInfoTable();
		loadFoodUpgradeInfoTable();
		loadBarCntrProductInfoTable(); // add by zlj
	}
	
	public function clearRuntimeDatas(){
		for(var baseInfo : BartenderFoodBaseInfoRow in mFoodBaseInfoTable){
			baseInfo.cur_stock_occupyed_grid = 0;
			baseInfo.cur_premake_stock_value = 0;
			baseInfo.cur_remain_expand_time = null;
		}
		curUnlockedFoodNum = 0;
	}
	
	public function clearTables(){
		mFoodBaseInfoTable.Clear();
		mFoodProductInfoTable.Clear();
		mFoodUpgradeInfoTable.Clear();
		mBarCntrProductInfoTable.Clear();
		mFoodBaseInfoTable = null;
		mFoodProductInfoTable = null;
		mFoodUpgradeInfoTable = null;
		mBarCntrProductInfoTable = null; // add by zlj
	}
	
	private function loadFoodBaseInfoTable(){
	
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(ResManager.LgtMgr.GetTable("player_food_tplt").text);
		
		for (var _row : Object in dt.Table)
		{
			var row : Hashtable = _row as Hashtable;
			var r : BartenderFoodBaseInfoRow = new BartenderFoodBaseInfoRow();
			
			if (row.ContainsKey("id"))
				r.food_id = ResManager.LgtMgr.ParseInt(row["id"].ToString());
			if (row.ContainsKey("upgrade_id"))
				r.upgrade_id = ResManager.LgtMgr.ParseInt(row["upgrade_id"].ToString());
			if (row.ContainsKey("level"))
				r.need_role_level = ResManager.LgtMgr.ParseInt(row["level"].ToString());
			if (row.ContainsKey("unlock_diamond"))
				r.unlock_diamond = ResManager.LgtMgr.ParseInt(row["unlock_diamond"].ToString());
			if (row.ContainsKey("is_lock"))
				r.is_default_lock = ResManager.LgtMgr.ParseInt(row["is_lock"].ToString());
			if (row.ContainsKey("min_stock")){
					r.min_stock = ResManager.LgtMgr.ParseInt(row["min_stock"].ToString());
					r.cur_open_gridNum = r.min_stock;
				}
			if (row.ContainsKey("max_stock"))
				r.max_stock = ResManager.LgtMgr.ParseInt(row["max_stock"].ToString());
			if (row.ContainsKey("max_upgrade_level"))
				r.max_upgrade_level = ResManager.LgtMgr.ParseInt(row["max_upgrade_level"].ToString());
			if (row.ContainsKey("expand_stock_diamond"))
				 ResManager.LgtMgr.ParseIntArray(row["expand_stock_diamond"].ToString(), r.expand_stock_diamonds);
			if (row.ContainsKey("expand_stock_time"))
				 ResManager.LgtMgr.ParseIntArray(row["expand_stock_time"].ToString(), r.expand_stock_times);
			if (row.ContainsKey("expand_stock_love_coin"))
				 ResManager.LgtMgr.ParseIntArray(row["expand_stock_love_coin"].ToString(), r.expand_stock_love_coins);
			if (row.ContainsKey("player_level"))
				r.player_level = ResManager.LgtMgr.ParseInt(row["player_level"].ToString());
			if (row.ContainsKey("house_level"))
				r.house_level = ResManager.LgtMgr.ParseInt(row["house_level"].ToString());
			if (row.ContainsKey("particle"))
				r.particle = row["particle"];
			if (row.ContainsKey("unsatisfy"))
				r.unsatisfy = row["unsatisfy"];
			
			mFoodBaseInfoTable.Add(r);
		}
	
	}
	
	private function loadFoodProductInfoTable(){
	
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(ResManager.LgtMgr.GetTable("player_food_product_tplt").text);
		
		for (var _row : Object in dt.Table)
		{
			var row : Hashtable = _row as Hashtable;
			var r : BartenderFoodProductInfoRow = new BartenderFoodProductInfoRow();
			
			if (row.ContainsKey("product_id"))
				r.product_id = ResManager.LgtMgr.ParseInt(row["product_id"].ToString());
			if (row.ContainsKey("name"))
				r.name = row["name"].ToString();
			if (row.ContainsKey("icon"))
				r.icon = row["icon"].ToString();
			if (row.ContainsKey("level"))
				r.level = ResManager.LgtMgr.ParseInt(row["level"].ToString());
			if (row.ContainsKey("diamond"))
				r.shaking_diamond = ResManager.LgtMgr.ParseInt(row["diamond"].ToString());
			if (row.ContainsKey("consume_time"))
				r.shaking_time = ResManager.LgtMgr.ParseInt(row["consume_time"].ToString());
			if (row.ContainsKey("copies"))
				r.copies_per_grid = ResManager.LgtMgr.ParseInt(row["copies"].ToString());
			if (row.ContainsKey("price"))
				r.price_per_copy = ResManager.LgtMgr.ParseFloat(row["price"].ToString());
			if (row.ContainsKey("consume_speed"))
				r.consume_speed = ResManager.LgtMgr.ParseInt(row["consume_speed"].ToString());
			if (row.ContainsKey("sale_time"))
				r.sale_time = ResManager.LgtMgr.ParseInt(row["sale_time"].ToString());
			if (row.ContainsKey("desc"))
				r.desc = row["desc"].ToString();
			if (row.ContainsKey("love_coin"))
				r.love_coin = ResManager.LgtMgr.ParseInt(row["love_coin"].ToString());
			
			mFoodProductInfoTable.Add(r);
		}
	
	}
	
	private function loadFoodUpgradeInfoTable(){
	
		var dt : XmlDataTable = new XmlDataTable();
		dt.LoadFromString(ResManager.LgtMgr.GetTable("player_food_upgrade_tplt").text);
		
		for (var _row : Object in dt.Table)
		{
			var row : Hashtable = _row as Hashtable;
			var r : BartenderFoodUpgradeInfoRow = new BartenderFoodUpgradeInfoRow();
			
			if (row.ContainsKey("upgrade_id"))
				r.upgrade_id = ResManager.LgtMgr.ParseInt(row["upgrade_id"].ToString());
			if (row.ContainsKey("item_ids"))
				ResManager.LgtMgr.ParseIntArray(row["item_ids"].ToString(), r.need_item_ids);
			if (row.ContainsKey("item_count"))
				ResManager.LgtMgr.ParseIntArray(row["item_count"].ToString(), r.need_item_cnts);
			if (row.ContainsKey("shop_ids"))
			    ResManager.LgtMgr.ParseIntArray(row["shop_ids"].ToString(), r.need_shop_ids);	
			if (row.ContainsKey("decoration"))
				r.need_decoration = ResManager.LgtMgr.ParseInt(row["decoration"].ToString());
			if (row.ContainsKey("diamond"))
				r.need_diamond = ResManager.LgtMgr.ParseInt(row["diamond"].ToString());
			if (row.ContainsKey("next_upgrade_id"))
				r.next_upgrade_id = ResManager.LgtMgr.ParseInt(row["next_upgrade_id"].ToString());
			if (row.ContainsKey("item_love_coin"))
				ResManager.LgtMgr.ParseIntArray(row["item_love_coin"].ToString(), r.need_love_coins);
			mFoodUpgradeInfoTable.Add(r);
		}
	
	}
	
	// add by zlj
	private function loadBarCntrProductInfoTable(){
	    var dt : XmlDataTable = new XmlDataTable();
	    dt.LoadFromString(ResManager.LgtMgr.GetTable("player_food_produce_area_tplt").text);
	    for(var _row : Object in dt.Table)
	    {
	        var row : Hashtable = _row as Hashtable;
	        var r : BarCntrProductInfoRow = new BarCntrProductInfoRow();
	        
	        if(row.ContainsKey("id"))
	        {
	           r.upgrade_id = ResManager.LgtMgr.ParseInt(row["id"].ToString());
	        }
	        if(row.ContainsKey("item_ids"))
	        {
	           ResManager.LgtMgr.ParseIntArray(row["item_ids"].ToString(), r.need_item_ids);
	        }
	        if(row.ContainsKey("item_count"))
	        {
	           ResManager.LgtMgr.ParseIntArray(row["item_count"].ToString(), r.need_item_cnts);
	        }
	        if(row.ContainsKey("shop_ids"))
	        {
	           ResManager.LgtMgr.ParseIntArray(row["shop_ids"].ToString(), r.need_shop_ids);
	        }
	        if(row.ContainsKey("diamond"))
	        {
	           r.need_diamond = ResManager.LgtMgr.ParseInt(row["diamond"].ToString());
	        }
	        
	        mBarCntrProductInfoTable.Add(r);
	    }
	}
		
}