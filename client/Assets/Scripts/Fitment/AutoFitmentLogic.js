/*--------------------------------------------------
*** 自动家装逻辑(2012/12/4 created by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast



private static var mInstance : AutoFitmentLogic = null;
private var mHouseId : int = 0;
private var mSchemes : Array = new Array();


//--------------------------------------------------
function Awake()
{
	mInstance = this;
}
//--------------------------------------------------
public static function getInstance() : AutoFitmentLogic
{
	return mInstance;
}
//--------------------------------------------------
// 回收所有已摆放家具
private function recoverAllFurnitures() : void
{
	// step1:还原所有家装操作
	FitmentLogic.getInstance().recoverAllOperate();
	// step2:回收进入家装前摆放的家具
	for (var kv : DictionaryEntry in EQGameSceneMgr.getSingleton().getHouse().getFurnitureUids())
	{
		var uid : int = kv.Value;
		var comp : HouseSceneComponent = HSCManager.getSingleton().getHouseSceneComponent(uid);
		var comp_id : int = comp.CompId;
		// 为个别门和窗户单独存在的房屋模型做特殊处理
		if (2000000 == comp_id || 2000001 == comp_id || 2000002 == comp_id || 2100000 == comp_id)
			continue;
		
		// 放入回收车
		FitmentLogic.getInstance().addToTakeCart(comp);
		// 销毁家具模型
		HSCManager.getSingleton().destroyHouseSceneComponent(uid);
	}
}
//--------------------------------------------------
// 根据摆放方案摆放家具
private function layFurnituresByScheme(house_id : int, scheme : int) : void
{
	var arr : Array = ResManager.LgtMgr.getAutoFitmentRows(house_id, scheme);
	for (var row : AutoFitmentRow in arr)
	{
		var item : ItemRow = ResManager.LgtMgr.getItemRow(row.furniture_id);
		if (ItemType.Furniture != item.type)	// 家具
			continue;
		
		// 构造家具
		var comp : HouseSceneComponent = HSCManager.getSingleton().createHouseSceneComponent();
		comp.parseRes(item.sub_id, item.id);
		comp.load();
		var grid : HouseSceneGrid = EQSceneManager.getSingleton().HouseSceneObj.getGrid(row.floor, row.x, row.z);
		if (null == grid)
			throw Exception("AutoFitmentLogic -> layFurnituresByScheme(int) -> house["+house_id+"], scheme["+scheme+"], floor["+row.floor+"], x["+row.x+"], z["+row.z+"].");
		
		// 摆放家具
		comp.lay(grid, row.face, row.height);
		// 添加到购物车
		FitmentLogic.getInstance().addToShopCart(comp, ResManager.LgtMgr.getShopCenterRow(row.goods_id));
	}
}
//--------------------------------------------------
// 初始自动家装,返回是否有摆放方案
public function initAutoFitment() : void
{
	mHouseId = EQGameSceneMgr.getSingleton().getHouse().getHouseInfo().template_id;
	mSchemes = ResManager.LgtMgr.getAutoFitmentSchemes(mHouseId);
}
//--------------------------------------------------
// 是否可以自动家装
public function canAutoFitment(scheme : int) : boolean
{
	// step1:没有摆放方案
	if (null == mSchemes || 0 == mSchemes.Count)
	{
		Debug.LogWarning("AutoFitmentLogic -> canAutoFitment() -> house[" + mHouseId + "] has no schemes.");
		return false;
	}
	// step2:类型判断
	if (-1 == CommFunc.indexOfArray(mSchemes, scheme))
	{
		Debug.LogWarning("AutoFitmentLogic -> canAutoFitment() -> house[" + mHouseId + "] has no scheme[" + scheme + "].");
		return false;
	}
	return true;
}
//--------------------------------------------------
// 自动家装
public function autoFitment(scheme : int) : void
{
	if (false == canAutoFitment(scheme))
		return;
	
	FitmentLogic.getInstance().handleCurPickComp();
	recoverAllFurnitures();
	layFurnituresByScheme(mHouseId, scheme);
}
//--------------------------------------------------


