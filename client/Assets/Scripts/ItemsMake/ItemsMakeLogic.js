#pragma strict
#pragma downcast

/*
//items make logic center
//creat by fullzhu 2012.6.21
//last edit at 2012.6.21 by fullzhu
*/

enum MakeFailType {
	MF_TYPE_UNKNOMN = 1,
	MF_TYPE_LACK = 2
}

class MakeData {
	var RecipeID : UInt64 = 0;
	var LevelData : MakeLevelData = new MakeLevelData();
	var LuckyData : MaterialData = new MaterialData();
	var SaftyData : MaterialData = new MaterialData();
	var ConsumeCrystal : int = 0;
	var SuccessRate : int = 0;
	var SkilledValue : int = 0;
	var NeedLevel : int = 0;
	var ObtainData : ArrayList = new ArrayList();				//struct MaterialData
	var MaterialList : ArrayList = new ArrayList();				//struct MaterialData
	var RecipeList : ArrayList = new ArrayList();				//struct PackGrid
}

class MaterialData {
	var id : int = 0;
	var CurrCount : int = 0;
	var TotalCount : int = 0;
}

class MakeLevelData {
	var Level : int;
	var SkilledValue : int;
	var LVUpSkilledValue : int;
}

public var mLuckyItemTmplID : int = 2200027;
public var mSaftyItemTmplID : int = 2200028;
public var mLuckyItemRate : int = 5;

private var mRecipeData : ItemsMakeRow = null;
private var mMakeData : MakeData = new MakeData();
private var mObtain : item = null;
private var mMatch : MatchCollection;

private static var instance : ItemsMakeLogic;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function GetInstance(){
	return instance;
}

function Start () {
	Init();
}

function Init() {
	mMakeData = new MakeData();
	mObtain = null;
	
	mMakeData.LuckyData.id = mLuckyItemTmplID;
	mMakeData.SaftyData.id = mSaftyItemTmplID;
	
	//TEMP:
	/*
	var testStr : String = "[{9910000,1},{9910001,2},{9910002,3}]";
	var list : ArrayList = GetMaterials(testStr);
	*/
}

function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOUSE_CREATED), HandleNotifyHouseOwnerInfo);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEMSMAKE_RESULT), HandleNotifyItemsMakeResult);
	//EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEMS_CHOOSE), );
}

//hanlde game event
function HandleNotifyHouseOwnerInfo(evt:GameEvent, obj:house_info) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEMSMAKE_ENABLE),false);
}
function HandleNotifyItemsMakeResult(evt:GameEvent, obj:notify_produce) {
	if(obj.result == 0) {
		OnFailed(MakeFailType.MF_TYPE_UNKNOMN);
	} else if(obj.result == 2) {
		OnFailed(MakeFailType.MF_TYPE_LACK);
	} else {
		var row : ItemRow = ResManager.LgtMgr.getItemRow(obj.finished.template_id);
		if(row != null) {
			var params : ArrayList = new ArrayList();
			params.Add(row.name);
			if(mMakeData.NeedLevel == mMakeData.LevelData.Level) {
				Global.GetSysMsgHandler().ShowSysMsg(430,params);
			} else {
				Global.GetSysMsgHandler().ShowSysMsg(438,params);
			}
		}
		
		var plr : Player = ScenePlayerMgr.getMainPlayer().GetComponent("Player");
		plr.setBasicData(obj.player);

		Init();
		mObtain = obj.finished;
		OnSuccess();
	}
}

function HandleNotifyItemsChoose(evt:GameEvent, obj:System.Object) {
	var bc : BackpackClass = obj as BackpackClass;
	if(bc == null || bc.pg == null) return;
	
	if (ItemType.ComposePaper == bc.pg._item._itemInfo.type) {
		AddRecipe(bc.pg._item._instanceID);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_RECIPE));
	}
}

//logic function for external interface
function Open() {
	Init();
	
	UI.getUI().OpenUIRoot("ItemsMakeUI");
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEMSMAKE_ENABLE),true);
	
	Refresh();
}
function Forge() {
	var bSafty : int = mMakeData.SaftyData.CurrCount > 0 ? 1 : 0;
	ItemsMakeNet.GetInstance().ReqItemsMake(mMakeData.RecipeID,mMakeData.LuckyData.CurrCount,bSafty);
}

function CheckForge() : boolean {
	if(mMakeData.RecipeID == 0) {
		Global.GetSysMsgHandler().ShowSysMsg(437);
		Debug.Log("recipe is empty!!");
		return false;
	}
	if(mMakeData.NeedLevel > mMakeData.LevelData.Level) {
		Global.GetSysMsgHandler().ShowSysMsg(428);
		Debug.Log("level lack!!");
		return false;
	}
	if(mMakeData.ConsumeCrystal > SelfItemLogic.getInstance()._loverDiamond) {
		Debug.Log("money not enough!!");
		Global.GetSysMsgHandler().ShowSysMsg(427);
		return false;
	}
	var bMaterialEnough : boolean = true;
	for(var data : MaterialData in mMakeData.MaterialList) {
		if(data.CurrCount > data.TotalCount) {
			bMaterialEnough = false;
			break;
		}
	}
	if(!bMaterialEnough) {
		Global.GetSysMsgHandler().ShowSysMsg(429);
		Debug.Log("material not enough!!");
		return false;
	}
	return true;
}

function AddRecipe(id : UInt64) {
	mMakeData.RecipeID = id;
	mMakeData.LuckyData.CurrCount = 0;
	mMakeData.SaftyData.CurrCount = 0;
	mObtain = null;
	Refresh();
}

function AddLucky(count : int) {
	mMakeData.LuckyData.CurrCount += count;
	
	if(mMakeData.LuckyData.CurrCount < 0) mMakeData.LuckyData.CurrCount = 0;
	
	Refresh();
}

function CheckAddLucky(count : int) {
	if(mMakeData.SuccessRate >= 100) {
		return false;
	}
	if(mMakeData.LuckyData.TotalCount <= 0 || mMakeData.LuckyData.CurrCount == mMakeData.LuckyData.TotalCount) {
		UI.getUI().OpenMsgbox("", Define.getContent(5105),Define.ok,CallbackSure as iGUIEventCallback,Define.cancel,CallbackCancel as iGUIEventCallback);
		return false;
	}
	if(mMakeData.LuckyData.CurrCount == mMakeData.LuckyData.TotalCount) {
		return false;
	}
	
	return true;
}

function AddSafty(count : int) {
	mMakeData.SaftyData.CurrCount += count;
	
	if(mMakeData.SaftyData.CurrCount > 1) mMakeData.SaftyData.CurrCount = 1;
	if(mMakeData.SaftyData.CurrCount < 0) mMakeData.SaftyData.CurrCount = 0;
	
	Refresh();
}

function CheckAddSafty() {
	if(mMakeData.SaftyData.CurrCount > 0) {
		return false;
	}
	if(mMakeData.SaftyData.TotalCount <= 0) {
		UI.getUI().OpenMsgbox("", Define.getContent(5106),Define.ok,CallbackSure as iGUIEventCallback,Define.cancel,CallbackCancel as iGUIEventCallback);
		return false;
	}
	return true;
}

function DelSlotClickEvent() {
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.BACKPACK_CLICKED), HandleNotifyItemsChoose);
}

function RegSlotClickEvent() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.BACKPACK_CLICKED), HandleNotifyItemsChoose);
}

//callback
private function CallbackSure(callback : iGUIElement) {
	PropShopLogic.Ctrl.Excute("open_prop_shop_ui", 0);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEMSMAKE_ENABLE),false);
}

private function CallbackCancel(callback : iGUIElement) {
	//DO NOTHING
}


//logic function for interal
private function OnSuccess() {
	//share
	var row : ItemRow = ResManager.LgtMgr.getItemRow(mObtain.template_id);
	if(row != null) {
		ExternalFlatform.Share(share_type.st_itemmake, Define.getContent(5107, [row.name]), Define.getContent(5098), Define.getContent(5100), null);
	}
	Refresh();
}

private function OnFailed(type : MakeFailType) {
	if(type == MakeFailType.MF_TYPE_UNKNOMN) {
		if(mMakeData.SaftyData.CurrCount == 0) {
			Global.GetSysMsgHandler().ShowSysMsg(439);
		} else {
			Global.GetSysMsgHandler().ShowSysMsg(440);
		}
	} else if(type == MakeFailType.MF_TYPE_LACK){
		Global.GetSysMsgHandler().ShowSysMsg(444);
	} else {
		Debug.Log("unkown type !!!");
	}
	
	Init();
	Refresh();
}

private function Refresh() {
	mMakeData.LuckyData.TotalCount = SelfItemLogic.getInstance().getItemNum(mMakeData.LuckyData.id);
	mMakeData.SaftyData.TotalCount = SelfItemLogic.getInstance().getItemNum(mMakeData.SaftyData.id);
	mMakeData.LevelData = GetSkillLevelData();
	
	var recipe : PackGrid = SelfItemLogic.getInstance().Package.getItemPack(mMakeData.RecipeID);
	if(recipe != null) {
		var data : ItemsMakeRow = GetRecipeData(recipe._item._itemInfo.id);
		if(data != null) {
			mMakeData.ConsumeCrystal = data.diamond;
			mMakeData.SuccessRate = data.success_rate + mLuckyItemRate*mMakeData.LuckyData.CurrCount;
			mMakeData.ObtainData = GetFinishItems(data.finished_item);
			mMakeData.NeedLevel = data.produce_level;
			if(mMakeData.NeedLevel < mMakeData.LevelData.Level) {
				mMakeData.SkilledValue = 0;
			} else {
				mMakeData.SkilledValue = data.experience;
			}
			
			if(mMakeData.SuccessRate > 100) mMakeData.SuccessRate = 100;
		
			var materialList : ArrayList = GetMaterials(data.material_item);
			var recipeList : ArrayList = GetRecipeList();
			mMakeData.MaterialList = materialList;
			mMakeData.RecipeList = recipeList;
		}
	}
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEMSMAKE_REFRESH_INTERFACE));
}

//data operate
function GetRecipeData(id : int) : ItemsMakeRow {
	return ResManager.LgtMgr.ItemsMakeTable[id];
}

function GetSkilledLevel(level : int) : ItemsMakeLVUpRow {
		return ResManager.LgtMgr.ItemsMakeLVUpTable[level];
}

function GetMaterials(material : String) : ArrayList {
	if(material == null || material == "") return null;
	
	var list : ArrayList = new ArrayList();
	var reg : Regex = new Regex("(\\{(\\d+),(\\d+)})");
	mMatch = reg.Matches(material);
	
	for(var i : int = 0; i < mMatch.Count; i++) {
		var mat : MaterialData = new MaterialData();
		var str : String = mMatch[i].Value.Replace("\r\n", "").Replace("{", "").Replace("}", "").Trim();
		var separator : String = ",";
		var wordArray : String[] = str.Split(separator[0]);
		mat.id = ResManager.LgtMgr.ParseInt(wordArray[0]);
		mat.CurrCount = ResManager.LgtMgr.ParseInt(wordArray[1]);
		mat.TotalCount = SelfItemLogic.getInstance().getItemNum(mat.id);
		
		list.Add(mat);
	}
	return list;
}

function GetFinishItems(finish : String) : ArrayList {
	if(finish == null || finish == "") return null;
	
	var list : ArrayList = new ArrayList();
	var reg : Regex = new Regex("(\\{(\\d+),(\\d+)})");
	mMatch = reg.Matches(finish);
	
	for(var i : int = 0; i < mMatch.Count; i++) {
		var mat : MaterialData = new MaterialData();
		var str : String = mMatch[i].Value.Replace("\r\n", "").Replace("{", "").Replace("}", "").Trim();
		var separator : String = ",";
		var wordArray : String[] = str.Split(separator[0]);
		mat.id = ResManager.LgtMgr.ParseInt(wordArray[0]);
		mat.CurrCount = 0;
		mat.TotalCount = 0;
		
		list.Add(mat);
	}
	return list;
}

function GetRecipeList() : ArrayList {
	var list : ArrayList = SelfItemLogic.getInstance().getPackGridList(ItemType.ComposePaper);
	return list;
}

function GetSkillLevelData() : MakeLevelData {
	var main_player : GameObject = ScenePlayerMgr.getMainPlayer();
	var p : Player = main_player.GetComponent("Player");
	var data : player_basic_data = p.getBasicData();
	var result : MakeLevelData = new MakeLevelData();
	if(data == null) return result;
	
	var skilledValue : int = data.produce_experience;
	var level : int = 1;
	var lvupValue : int = 0;
	while(true) {
		var levelData : ItemsMakeLVUpRow = GetSkilledLevel(level);
		lvupValue = levelData.experience;
		
		if(levelData.experience > skilledValue) break;
		
		skilledValue = skilledValue-levelData.experience;
		level++;
	}
	
	result.Level = data.produce_level;
	result.LVUpSkilledValue = lvupValue;
	result.SkilledValue = skilledValue;
	
	return result;
}

function GetMakeData() : MakeData {
	return mMakeData;
}

function GetObtainItem() : item {
	return mObtain;
}

function GetObtainData() : MaterialData {
	if(mObtain == null)	return null;
	
	var data : MaterialData = new MaterialData();
	data.id = mObtain.template_id;
	return data;
}

function GetCurLuckyCount() : int {
	return mMakeData.LuckyData.CurrCount;
}

function GetCurSaftyCount() : int {
	return mMakeData.SaftyData.CurrCount;
}