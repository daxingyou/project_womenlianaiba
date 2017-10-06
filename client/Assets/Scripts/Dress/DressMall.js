#pragma strict
#pragma downcast
/*
//dress mall
//create by fullzhu 2012.2.18
//last edit at 2012.2.18 by fullzhu
*/

class DressMall {

	enum GoodsSort {
		SORT_NEW = 1,
		SORT_MALE = 2,
		SORT_FEMALE = 3
	}
	
	enum GoodsSubSort {
		SORT_SUB_HEAD = 1,
		SORT_SUB_CLOTHES = 2,
		SORT_SUB_GLASS = 3,
		SORT_SUB_RING = 4,
		SORT_SUB_CLOAK = 5,
		SORT_SUB_SHOES = 6
	}

	private var mGoodsList : ArrayList = new ArrayList();				//struct ShopCenterRow
	private var mCurGoodsList : ArrayList = new ArrayList();
	private var mOwnerPurchaseList : ArrayList = new ArrayList();
	private var mLoverPurchaseList : ArrayList = new ArrayList();			
	
	private var mPage : PagerMgr;
	private var mSort : GoodsSort;
	private var mSubSort : GoodsSubSort;
	
	private var mPerPagenum : int = 0;
	 
	function DressMall(perPageNum : int) {
		mPerPagenum = perPageNum;
		
		for(var goods : ShopCenterRow in ResManager.LgtMgr.ShopCenterTable) {
			if(goods.visible == false) continue;
			if(NewPlayGuideModule.IsInNewHandTasks()) {
				if(!goods.newcomer ) continue;
				
				var dressID : int = ResManager.LgtMgr.getItemRow(goods.item_id).sub_id;
				var row : ItemDressRow = ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow;
				if(!row) continue;
				var isBoy : boolean = PlayerFriend.GetInstance().IsMainPlayerBoy();
				if(row.sex == sex_type.st_girl && isBoy) continue;
				if(row.sex == sex_type.st_boy && !isBoy) continue;
			} else {
				if(goods.newcomer) continue;
			}
			
			var item : ItemRow = ResManager.LgtMgr.getItemRow(goods.item_id);
			if(item && item.type == ItemType.Clothes) {
				mGoodsList.Add(goods);
			}
		}
	}
	
	public function Clear() {
		//mGoodsList.Clear();
		mCurGoodsList.Clear();
		mOwnerPurchaseList.Clear();
		mLoverPurchaseList.Clear();
		
		mSort = GoodsSort.SORT_NEW;
		mSubSort = GoodsSubSort.SORT_SUB_CLOTHES;
	}
	
	public function Init() {
		mSort = GoodsSort.SORT_NEW;
		mSubSort = GoodsSubSort.SORT_SUB_CLOTHES;
		
		for(var filter : ShopCenterRow in mGoodsList) {
			if(filter.recommend == true) {
				mCurGoodsList.Add(filter);
			}
		}
		
		mPage = new PagerMgr(mCurGoodsList,mPerPagenum);
	}
	
	public function AddOwnerPurchase(goods : ShopCenterRow) {
		var remove_idx : int = -1;
		for(var idx=0; idx<mOwnerPurchaseList.Count; idx++) {
			if(IsEqualSlot(mOwnerPurchaseList[idx],goods)) {
				remove_idx = idx;
				break;
			}
		}
		if(remove_idx != -1) {
			mOwnerPurchaseList.RemoveAt(idx);
		}
		mOwnerPurchaseList.Add(goods);
	}
	
	public function AddLoverPurchase(goods : ShopCenterRow) {
		var remove_idx : int = -1;
		for(var idx=0; idx<mLoverPurchaseList.Count; idx++) {
			if(IsEqualSlot(mLoverPurchaseList[idx],goods)) {
				remove_idx = idx;
				break;
			}
		}
		if(remove_idx != -1) {
			mLoverPurchaseList.RemoveAt(idx);
		}
		mLoverPurchaseList.Add(goods);		
	}
	
	public function RemoveOwnerPurchase(equip_pos) {
		var remove_idx : int = -1;	
		
		for(var idx=0; idx<mOwnerPurchaseList.Count; idx++) {
			var dressID: int = ResManager.LgtMgr.getItemRow((mOwnerPurchaseList[idx] as ShopCenterRow).item_id).sub_id;
			var equipPos : int = (ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).equip_pos;
			if(equipPos == equip_pos) {
				remove_idx = idx;
				break;
			}
		}
		
		if(remove_idx != -1) {
			mOwnerPurchaseList.RemoveAt(remove_idx);
		}
	}
	
	public function RemoveLoverPurchase(equip_pos) {
		var remove_idx : int = -1;
			
		for(var idx=0; idx<mLoverPurchaseList.Count; idx++) {
			var dressID: int = ResManager.LgtMgr.getItemRow((mLoverPurchaseList[idx] as ShopCenterRow).item_id).sub_id;
			var equipPos : int = (ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).equip_pos;
			if(equipPos == equip_pos) {
				remove_idx = idx;
				break;
			}
		}
		
		if(remove_idx != -1) {
			mLoverPurchaseList.RemoveAt(remove_idx);
		}
	}
	
	public function ChangeSort(sort : GoodsSort, subSort : GoodsSubSort) : ArrayList {
		//if(sort == mSort && subSort == mSubSort)
			//return GetPageData(1);
			
		mSort = sort;
		mCurGoodsList.Clear();
		
		var dressID : int = 0;
		if(sort == GoodsSort.SORT_NEW) {
			for(var filter : ShopCenterRow in mGoodsList) {
				if(filter.recommend == true) {
					mCurGoodsList.Add(filter);
				}
			}
		} else if(sort == GoodsSort.SORT_MALE) {
			for(var filter : ShopCenterRow in mGoodsList) {
				dressID = ResManager.LgtMgr.getItemRow(filter.item_id).sub_id;
				if((ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).sex == sex_type.st_boy) {
					mCurGoodsList.Add(filter);
				}
			}
		} else if(sort == GoodsSort.SORT_FEMALE) {
			for(var filter : ShopCenterRow in mGoodsList) {
				dressID = ResManager.LgtMgr.getItemRow(filter.item_id).sub_id;
				if((ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).sex == sex_type.st_girl) {
					mCurGoodsList.Add(filter);
				}
			}
		} else {
			Debug.LogWarning("invalid sort!!!");
		}
		
		//mPage = new PagerMgr(mCurGoodsList,mPerPagenum);
		//return GetPageData(1);
		
		mSubSort = subSort;
		var goodsList : ArrayList = new ArrayList();
		var equipPos : int = 0;
		if(subSort == GoodsSubSort.SORT_SUB_HEAD) {
			equipPos = 0;
		} else if(subSort == GoodsSubSort.SORT_SUB_CLOTHES) {
			equipPos = 1;
		} else if(subSort == GoodsSubSort.SORT_SUB_GLASS) {
			equipPos = 2;
		} else if(subSort == GoodsSubSort.SORT_SUB_RING) {
			equipPos = 3;
		} else if(subSort == GoodsSubSort.SORT_SUB_CLOAK){
			equipPos = 4;
		} else if(subSort == GoodsSubSort.SORT_SUB_SHOES){
			equipPos = 5;
		} else {
			return GetPageData(1);
		}
		for(var goods : ShopCenterRow in mCurGoodsList) {
			var pos : int = GetDressPos(goods.item_id);
			if(equipPos == pos) {
				goodsList.Add(goods);
			}
		}
		mCurGoodsList.Clear();
		mCurGoodsList = goodsList.Clone();
		
		mPage = new PagerMgr(mCurGoodsList,mPerPagenum);
		
		return GetPageData(1);
	}
	
	public function ChangeTopSort(sort : GoodsSort) : ArrayList {
		return ChangeSort(sort, GoodsSubSort.SORT_SUB_CLOTHES);
	}
	
	public function ChangeSubSort(sort : GoodsSubSort) : ArrayList {
		return ChangeSort(mSort, sort);
	}
	
	public function ResetOwnerPurchase() {
		mOwnerPurchaseList.Clear();
	}
	
	public function ResetLoverPurchase() {
		mLoverPurchaseList.Clear();
	}
	
	public function IsExsitDressOwner(equip_pos) {	
		for(var idx=0; idx<mOwnerPurchaseList.Count; idx++) {
			var dressID: int = ResManager.LgtMgr.getItemRow((mOwnerPurchaseList[idx] as ShopCenterRow).item_id).sub_id;
			var equipPos : int = (ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).equip_pos;
			if(equipPos == equip_pos) {
				return true;
			}
		}
		return false;
	}
	
	public function IsExsitDressLover(equip_pos) {	
		for(var idx=0; idx<mLoverPurchaseList.Count; idx++) {
			var dressID: int = ResManager.LgtMgr.getItemRow((mLoverPurchaseList[idx] as ShopCenterRow).item_id).sub_id;
			var equipPos : int = (ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).equip_pos;
			if(equipPos == equip_pos) {
				return true;
			}
		}
		return false;
	}
	
	private function IsEqualSlot(ins : ShopCenterRow, ins_other : ShopCenterRow) {
		var dressID1: int = ResManager.LgtMgr.getItemRow(ins.item_id).sub_id;
		var dressID2: int = ResManager.LgtMgr.getItemRow(ins_other.item_id).sub_id;
	   	return (ResManager.LgtMgr.ItemDressTable[dressID1] as ItemDressRow).equip_pos == (ResManager.LgtMgr.ItemDressTable[dressID2] as ItemDressRow).equip_pos;
	}
	
	private function GetDressPos(itemID : int) : int {
		if(itemID == 0) {
			Debug.Log("item id invalid");
			return -1;
		}
		
		var dressID: int = ResManager.LgtMgr.getItemRow(itemID).sub_id;
        return (ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).equip_pos;
	}
	
	public function GetNextPage() : ArrayList {
		return mPage.NextPage();
	}
	
	public function GetPrePage() : ArrayList {
		return mPage.PrevPage();
	}
	
	public function GetCurrData() : ArrayList {
		return mPage.CurrPage();
	}
	
	public function GetPageData(page : int) : ArrayList {
		return mPage.GetPage(page);
	}
	
	public function GetTotalPageNum() : int {
		return mPage.GetTotalPage();
	}
	
	public function GetCurrPageNum() : int {
		return mPage.GetPageIndex();
	}
	
	public function GetCurSort() : GoodsSort {
		return mSort;
	}
	
	public function GetSubSort() : GoodsSubSort {
		return mSubSort;
	}
	
	public function GetOwnerPurchaseList() : ArrayList {
		return mOwnerPurchaseList;
	} 
	
	public function GetLoverPurchaseList() : ArrayList {
		return mLoverPurchaseList;
	} 
}