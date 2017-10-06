/*
	--许愿单组件
	--2012-03-20
*/
#pragma strict
#pragma downcast
class WishClass{
	public var mWishId : UInt64;
	public var mGoodsId : UInt64;
	public var mWishTime : stime;
	public var mWishAccount : String;
	public var wish_type : int;
	
	//
	public function WishClass(wish_id : UInt64, good_id : UInt64, account : String, wish_time : stime, wish_type : int){
		mWishId = wish_id;
		mGoodsId = good_id;
		mWishTime = wish_time;
		mWishAccount = account;
		this.wish_type = wish_type;
	}
}
private static var mCurSatisfyWish_Account : String = "";
private static var mCurSatisfyWish_GoodsID : UInt64 = 0;
private static var mTargetAccount : String = "";
private var mCurWishList : Hashtable = new Hashtable();
private var mWishRecord : ArrayList = new ArrayList();
private static var MAX_CNT = 5; 
static var has_two_owner : boolean = false;

function Awake(){
	RegistEvt();
}
//--
private function RegistEvt(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_SELF_HOUSE), HandleEnterSelfHouse);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_WISH_ADD_FAIL), HandleNotifyAddWishFail);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_WISH_ADD), HandleNotifyAddWish);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_WISH_LIST), HandleNotifyWishList);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_WISH_DEL), HandleNotifyDelWish);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_SATISFY_SUCC), HandleNotifyWishSatisfySucc);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_SATISFY_FAIL), HandleNotifyWishSatisfyFail);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_WISH_RECORD), HandleNotifyWishRecord);
}
//--请求满足愿望
public static function ReqSatisfyWish(wish_acc : String, goods_id : UInt64, price : int, price_type : int){
	mCurSatisfyWish_Account = wish_acc;
	mCurSatisfyWish_GoodsID = goods_id;
	var params : ArrayList = new ArrayList();
	params.Add(price);
	if(price_type == pay_goods_type.pgt_love_coin){
		if(PlatformMgr.IsPlatYY()){
			Global.GetSysMsgHandler().ShowSysMsg(532,params);
		}
		else{
			Global.GetSysMsgHandler().ShowSysMsg(532,params);
		}
	}
	else if(price_type == pay_goods_type.pgt_game_gold){
		Global.GetSysMsgHandler().ShowSysMsg(338,params);
	}
}
//--
static function _ConfirmSatisfyWish(caller : iGUIElement){
	_ConfirmSatisfyWish();
}
//--
static function _ConcelSatisfyWish(caller : iGUIElement){
	_ConcelSatisfyWish();
}
//--
public static function _ConfirmSatisfyWish(){
	SubmitReqSatisfyWish(mCurSatisfyWish_GoodsID);
	mCurSatisfyWish_GoodsID = 0;
}
//--
public static function _ConcelSatisfyWish(){
	mCurSatisfyWish_GoodsID = 0;
}
//--提交请求加入愿望
public static function ReqAddWish(itm_id : UInt64, type : int){
	if(itm_id == 0)
		throw "item_id is error...";
	var req : req_wish_add = new req_wish_add();
	req.wish_type = type;
	req.goods_id = itm_id;
	NetHelper.Send(req);
}
//--处理接收加入愿望失败
private function HandleNotifyAddWishFail(evt : GameEvent, obj : notify_wish_add_fail){
	UI.getUI().OpenMsgbox("",obj.message,true);
}
//--处理接收到加入愿望
private function HandleNotifyAddWish(evt : GameEvent, obj : notify_wish_add){
	//1.创建愿望结构
	_CreateWish(obj.wish);
	Global.GetSysMsgHandler().ShowSysMsg(336);
}
//--
private function _CreateWish(wish : player_love_wish){
	//Debug.Log("++++++++++++++++++" +wish.wish_id+"---"+wish.goods_id+"---"+wish.account+"----"+wish.wish_time.day);
	var add_wish : WishClass = new WishClass(wish.wish_id, wish.goods_id, wish.account, wish.wish_time, wish.wish_type);
	_AddWish(add_wish);
}
//--add wish
private function _AddWish(wish : WishClass){
	//2.todo：检查是否存在相同的许愿单ID
	//3.todo：将新增加的愿望加入到许愿单列表中
	if(!_IsWishIdExist(wish.mWishId))
		_AddToWishList(wish);
	
}
//--添加愿望到愿望列表
private function _AddToWishList(wish : WishClass){
	//1.添加列表
	//2.通知更新
	mCurWishList.Add(wish.mWishId,wish);
	//--满5条时隐藏许愿按钮
	_SetWishBtnEnable(mCurWishList.Count);
	_NotifyAddWish(wish);
}
//--通知更新
private function _NotifyAddWish(wish : WishClass){
	//ADD_WISH_DATA
	if(!UI.getUI().GetUIRoot("WishListRoot"))
		UI.getUI().OpenUIRoot("WishListRoot");
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.ADD_WISH_DATA),wish);
}
//------------------------------
//--设置当前查看的玩家许愿单的帐号
private static function _SetTargetAccount(account : String){
	mTargetAccount = account;
}
//--
private static function _GetTargetAccount() :String{
	return mTargetAccount;
}
//----------------------
//--请求许愿单列表
public static function ReqWishList(account : String){
	if(account == "")
		return;
	_SetTargetAccount(account);
	var req : req_wish_list = new req_wish_list();
	req.account = account;
	NetHelper.Send(req);
}
//--判断是否在查看自己的许愿单
private function _IsWatchSelfWish() : boolean{
	return _GetTargetAccount() == ScenePlayerMgr.getMainPlayerAccount() ? true : false;
}
//--处理接收愿望列表
private function HandleNotifyWishList(evt : GameEvent, obj : notify_wish_list){
	//判断是否是主人自己，若是继续下面的步骤，若不是则转到另外的处理逻辑
	//1.检查列表是否为空，若不为空则清空
	//2.添加到列表
	if(!_IsWatchSelfWish()){
		_UpdateTargetWishList(obj.wish_list);
		return;
	}
	for(var i : int = 0; i < obj.wish_list.Count; ++ i){
		_CreateWish(obj.wish_list[i] as player_love_wish);
	}
	//比对客户端缓存列表，是否客户端缓存数据存在无效数据
	_ContrastWishList(obj.wish_list);
	_SetWishBtnEnable(mCurWishList.Count);
}
//--
private function _ContrastWishList(server_wish_list : ArrayList){	
	//for(var _wish_id:UInt64 in mCurWishList.Keys){
	var _will_remove_items : Array = new Array();
	for(var de:DictionaryEntry in mCurWishList){
		var idx : UInt64 = Convert.ToUInt64(de.Key);
		if(!_IsContainInServerWishList(server_wish_list, idx)){
			var _remove_wish : WishClass = mCurWishList.Item[idx] as WishClass;
			_NotifyDelWish(_remove_wish);
			_will_remove_items.Add(idx);
		}
	}
	for(var i:int=0; i < _will_remove_items.Count; ++i ){
		mCurWishList.Remove(_will_remove_items[i]);
	}
}
//--检查客户端缓存的愿望列表的项是否在服务端发下来的列表中
private function _IsContainInServerWishList(_list : ArrayList, wish_id : UInt64) : boolean{
	for(var i : int = 0; i < _list.Count; ++ i){
		var p_wish : player_love_wish = _list[i] as player_love_wish;
		if(wish_id == p_wish.wish_id){
			return true;
		}
	}
	return false;
}
//--满5条时隐藏许愿按钮
private function _SetWishBtnEnable(list_cnt : int){
	if(list_cnt == MAX_CNT){
		//TO_WISHLIST_MAX true
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.TO_WISHLIST_MAX),true);
	}
	else{
		//TO_WISHLIST_MAX false
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.TO_WISHLIST_MAX),false);
	}
}
/*
//--检查许愿单列表是否为空
private function _IsWishListNull() : boolean{
	return mCurWishList.Count == 0 ? true : false;
}
*/

//--检测某个愿望单是否存在列表中
private function _IsWishIdExist(wish_id :UInt64) : boolean{
	return mCurWishList.ContainsKey(wish_id);
}

/*
//--清空愿望列表
private function _ClearWishList(){
	mCurWishList.Clear();
}
*/

//--根据愿望单号移除对应的愿望
private function _RemoveWish(wish_id : UInt64){
	//1.检查是否存在
	//2.从列表中删除对应的数据
	//3.通知更新
	if(!_IsWishIdExist(wish_id)){
		Debug.Log("this wish item is not exist...");
		return;
	}
	var _remove_wish : WishClass = mCurWishList.Item[wish_id] as WishClass;
	_NotifyDelWish(_remove_wish);
	mCurWishList.Remove(wish_id);
	//--满5条时隐藏许愿按钮
	_SetWishBtnEnable(mCurWishList.Count);
}
//--
private function _NotifyDelWish(wish :WishClass){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.DEL_WISH_DATA),wish);
}
//--更新目标用户的愿望列表
private function _UpdateTargetWishList(wish_list : ArrayList){
	//NOTIFY_CLEAR_TARGET_WISH_LIST
	//NOTIFY_TARGET_WISH_LSIT
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_CLEAR_TARGET_WISH_LIST));
	for(var i : int = 0; i < wish_list.Count; ++ i){
		var p_wish : player_love_wish = wish_list[i] as player_love_wish;
		var _wish : WishClass = new WishClass(p_wish.wish_id, p_wish.goods_id, p_wish.account, p_wish.wish_time, p_wish.wish_type);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.NOTIFY_TARGET_WISH_LSIT),_wish);
	}
	//--	
}
//----------------------
//--删除相关
//--请求删除
public static function ReqDelWish(wish_id : UInt64){
	var req : req_wish_delete = new req_wish_delete();
	req.wish_id = wish_id;
	NetHelper.Send(req);
}
//--处理接收删除愿望
private function HandleNotifyDelWish(evt : GameEvent, obj : notify_wish_delete){
	//1.删除愿望
	_RemoveWish(obj.wish_id);
}
//----------------------
//--满足相关
//--请求满足愿望
static function SubmitReqSatisfyWish(wish_id : UInt64){
	var req : req_wish_satisfy = new req_wish_satisfy();
	req.wish_id = wish_id;
	NetHelper.Send(req);
}
//--处理接收成功满足
function HandleNotifyWishSatisfySucc(evt : GameEvent, obj : Object){
	Global.GetSysMsgHandler().ShowSysMsg(400);
	//if(DataCenter.isInSelfHouse()){
	//	ReqWishList(ScenePlayerMgr.GetMainPlayerLoverAccount());
	//}
	//else{
		if(mCurSatisfyWish_Account != "")
			ReqWishList(mCurSatisfyWish_Account);
	//}
}
//--处理满足愿望失败
function HandleNotifyWishSatisfyFail(evt : GameEvent, obj : notify_wish_satisfy_fail){
	UI.getUI().OpenMsgbox("",obj.message,true);
}
//----------------------
//--愿望历史记录
//--
public static function ReqWishRecord(account : String){
	var req : req_wish_history_list = new req_wish_history_list();
	req.account = account;
	NetHelper.Send(req);
}
//--接收愿望记录
private function HandleNotifyWishRecord(evt : GameEvent, obj : notify_wish_history_list){
	//1.添加到记录列表
	_FillRecordList(obj.history_list);
}
//--填充记录列表
private function _FillRecordList(record_list : ArrayList){
	//mWishRecord = record_list;
	_UpdateWishRecord(record_list);
}
//--通知更新愿望记录
private function _UpdateWishRecord(record_list : ArrayList){
	//UPDATE_WISH_RECORD
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.UPDATE_WISH_RECORD),record_list);
}
//--
function HandleEnterSelfHouse(evt : GameEvent, obj : house_info){
	//has_two_owner
	if(obj.boy == "" || obj.girl == ""){
		has_two_owner = false;
	}
	else{
		has_two_owner = true;
	}
}