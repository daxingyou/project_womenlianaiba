/*
	huangdj	2013-3-29
*/
#pragma strict

class ExchangeRow implements System.IComparable{
	var id : int;
	var type : int;
	var item1_id : int;
	var item1_num : int;
	var item2_id : int;
	var item2_num : int;
	var item3_id : int;
	var item3_num : int;
	var item4_id : int;
	var item4_num : int;
	var reward_module : String;
	var source_icon : String;
	var reward_icon : String;
	var reward_params : Array = new Array();
	
	public final function CompareTo(val : Object) : int{
		var _val : ExchangeRow = val as ExchangeRow;
		if(this.type < _val.type){
			return -1;
		}
		if(this.type > _val.type){
			return 1;
		}
		if(this.type == _val.type && this.id < _val.id){
			return -1;
		}
		if(this.GetType == _val.type && this.id > _val.id){
			return 1;
		}
		return 0;
	}	
}

private var mExchangeTable : ArrayList = new ArrayList();
private var mClassifyList : ArrayList = new ArrayList();
private static var instance : ExchangeComp;

function Awake(){
	instance = this;
	registEvt();
}

static function getInstance() : ExchangeComp{
	return instance;
}
// Use this for initialization
function Start () {
	Init();
}

//
private function registEvt(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_EXCHANGEUI), handleCloseExchangeUI);
}

//
private function handleCloseExchangeUI(evt : GameEvent, obj : Object){
	destroy();
}

//
private function destroy(){
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.CLOSE_EXCHANGEUI), handleCloseExchangeUI);
	mExchangeTable = null;
	mClassifyList = null;
	Destroy(this.gameObject);
}

//--
function GetClassifyData() : ArrayList{
	return mClassifyList;
}

//
function Init(){
	LoadExchangeTable();
	SortExchangeTable();
	ExchangeClassify();
	//以上步骤执行完，代表数据已经准备好了，然后先打开界面root，然后根据数据创建界面
	OpenExchangeUIRoot();
}

//
function OpenExchangeUIRoot(){
	UI.getUI().OpenUIRoot("ExchangeUIRoot");
	UI.getUI().SetModal("ExchangeUIRoot", true);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_EXCHANGE_BTN));
}

//
function SortExchangeTable(){
	mExchangeTable.Sort();
}

//因为排序过，所以最后一个就是最大类型，也就算是类型总数了
private function GetTypeCount() : int{
	return (mExchangeTable[mExchangeTable.Count - 1] as ExchangeRow).type;
}

//把加载进来的表数据按分类存放到各个分类数组中，然后把各个数组存放到一个总的类型数组里面
function ExchangeClassify(){
	var typeCount : int = GetTypeCount();
	
	for(var j:int = 1; j <= typeCount; ++ j){
		var itemList : ArrayList = new ArrayList();
		for(var i:int=0; i < mExchangeTable.Count; ++ i){
			var exchangeRow : ExchangeRow = mExchangeTable[i] as ExchangeRow;
			if(exchangeRow.type == j){
				itemList.Add(exchangeRow);
			}
		}
		mClassifyList.Add(itemList);
	}
}

private function LoadExchangeTable(){
	var dt : XmlDataTable = new XmlDataTable();
	dt.LoadFromString(ResManager.LgtMgr.GetTable("exchange_tplt").text);
	
	for (var _row : Object in dt.Table)
	{
		var row : Hashtable = _row as Hashtable;
		var r : ExchangeRow = new ExchangeRow();
		
		if (row.ContainsKey("id"))
			r.id = ResManager.LgtMgr.ParseInt(row["id"]);
		if (row.ContainsKey("type"))
			r.type = ResManager.LgtMgr.ParseInt(row["type"]);
		if (row.ContainsKey("item1_id"))
			r.item1_id = ResManager.LgtMgr.ParseInt(row["item1_id"].ToString());
		if (row.ContainsKey("item2_id"))
			r.item2_id = ResManager.LgtMgr.ParseInt(row["item2_id"].ToString());
		if (row.ContainsKey("item3_id"))
			r.item3_id = ResManager.LgtMgr.ParseInt(row["item3_id"].ToString());
		if (row.ContainsKey("item4_id"))
			r.item4_id = ResManager.LgtMgr.ParseInt(row["item4_id"].ToString());
		if (row.ContainsKey("item1_num"))
			r.item1_num = ResManager.LgtMgr.ParseInt(row["item1_num"].ToString());
		if (row.ContainsKey("item2_num"))
			r.item2_num = ResManager.LgtMgr.ParseInt(row["item2_num"].ToString());
		if (row.ContainsKey("item3_num"))
			r.item3_num = ResManager.LgtMgr.ParseInt(row["item3_num"].ToString());
		if (row.ContainsKey("item4_num"))
			r.item4_num = ResManager.LgtMgr.ParseInt(row["item4_num"].ToString());
		if (row.ContainsKey("reward_module"))
			r.reward_module = row["reward_module"].ToString();
		if (row.ContainsKey("source_icon"))
			r.source_icon = row["source_icon"].ToString();
		if (row.ContainsKey("reward_icon"))
			r.reward_icon = row["reward_icon"].ToString();
		if (row.ContainsKey("reward_params"))
			 ResManager.LgtMgr.ParseIntArray(row["reward_params"].ToString(), r.reward_params);
		
		mExchangeTable.Add(r);
	}
}