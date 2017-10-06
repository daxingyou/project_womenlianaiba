#pragma strict
#pragma downcast
/*
//dress pack
//create by fullzhu 2012.2.18
//last edit at 2012.2.18 by fullzhu
*/

class DressPack {

	enum DressSort {
		SORT_MALE = 1,
		SORT_FEMALE = 2
	}
	
	private var mEquipList : ArrayList = new ArrayList();			//struct item(Item)
	private var mCurEquipList : ArrayList = new ArrayList();
	private var mBoyDressList : ArrayList = new ArrayList();
	private var mGirlDressList : ArrayList = new ArrayList();
	
	private var mSort : DressSort;
	
	private var mPerPageNum : int = 0;
	private var mStartPos : int = 0;
	private var mEndPos : int = 5;
	private var mBBoy : boolean = false;
	private var mCostGold : int = 0;
	private var mCostRMB : int = 0;
	private var mCostCredit : int = 0;		
	
	function DressPack(perPageNum : int, bBoy : boolean) {
		mBBoy = bBoy;
		mPerPageNum = perPageNum;
		
		Init();
	}
	
	public function Clear() {
		mEquipList.Clear();
		mCurEquipList.Clear();
		mBoyDressList.Clear();
		mGirlDressList.Clear();
		
		mSort = DressSort.SORT_MALE;
		mStartPos = 0;
		mEndPos = mPerPageNum;
		mCostGold = 0;
		mCostRMB = 0;
		mCostCredit = 0;
	}
	
	public function Init() {
		Clear();
		
		var pack : ItemPack = SelfItemLogic.getInstance()._loverPackage;
		for(var i=0; i<pack.count(); ++i) {
			var grid : PackGrid = pack.getPackGrid(i);
			if (ItemType.Clothes == grid._item._itemInfo.type) {
				mEquipList.Add(grid._item);
			}
		}
		
		if(mBBoy == true) {
			mSort = DressSort.SORT_MALE;
			
			for(var equip : Item in mEquipList) {
				if((ResManager.LgtMgr.ItemDressTable[equip._itemInfo.sub_id] as ItemDressRow).sex == sex_type.st_boy) {
					mCurEquipList.Add(equip);
				}
			}
		} else {
			mSort = DressSort.SORT_FEMALE;
			
			for(var equip : Item in mEquipList) {
				if((ResManager.LgtMgr.ItemDressTable[equip._itemInfo.sub_id] as ItemDressRow).sex == sex_type.st_girl) {
					mCurEquipList.Add(equip);
				}
			}
		}
	}
	
	public function AddDress(item_ins : Item,bPreview : boolean) {
		var dress_list : ArrayList;
		if(mSort == DressSort.SORT_MALE) {
			dress_list = mBoyDressList;
		} else {
			dress_list = mGirlDressList;
		}
		
		var dressID: int = ResManager.LgtMgr.getItemRow(item_ins._itemInfo.id).sub_id;
		var equipPos : int = (ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).equip_pos;
		var dressSex : int = (ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).sex;
		var insertIdx : int = GetItemCurrIdx(item_ins);
		RemoveDress(equipPos,dressSex,bPreview,insertIdx);
		
		if(bPreview == false) {
			RemoveEquipList(item_ins);
		}
		
		dress_list.Add(item_ins);
	}
	
	public function RemoveDress(equip_pos : int, sex : int, bPreview : boolean,insert_idx : int) {
		var remove_idx : int = -1;
		var dress_list : ArrayList;
		
		if(sex == sex_type.st_boy) {
			dress_list = mBoyDressList;
		} else {
			dress_list = mGirlDressList;
		}
		
		for(var idx=0; idx<dress_list.Count; idx++) {
			var dressID: int = ResManager.LgtMgr.getItemRow((dress_list[idx] as Item)._itemInfo.id).sub_id;
			var equipPos : int = (ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).equip_pos;
			if(equipPos == equip_pos) {
				remove_idx = idx;
				break;
			}
		}
		if(remove_idx != -1) {
			if(bPreview == false) {
				AddEquipList(dress_list[idx],insert_idx);
			}
			dress_list.RemoveAt(idx);
		}
	}
	
	public function IsExsitDress(equip_pos : int) : boolean {
		var dress_list : ArrayList;
		if(mSort == DressSort.SORT_MALE) {
			dress_list = mBoyDressList;
		} else {
			dress_list = mGirlDressList;
		}
		
		for(var idx=0; idx<dress_list.Count; idx++) {
			var dressID: int = ResManager.LgtMgr.getItemRow((dress_list[idx] as Item)._itemInfo.id).sub_id;
			var equipPos : int = (ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).equip_pos;
			if(equipPos == equip_pos) {
				return true;
			}
		}
		return false;
	}
	
	public function IsExsitDressBoy(itemID : UInt64,bBoy : boolean) : boolean {
		var dress_list : ArrayList;
		if(bBoy) {
			dress_list = mBoyDressList;
		} else {
			dress_list = mGirlDressList;
		}
		
		for(var idx=0; idx<dress_list.Count; idx++) {
			if((dress_list[idx] as Item)._instanceID == itemID) {
				return true;
			}
		}
		return false;
	}
	
	public function RemoveDress(itemID : UInt64,bBoy : boolean){
		var remove_idx : int = -1;
		var dress_list : ArrayList;
		
		if(bBoy) {
			dress_list = mBoyDressList;
		} else {
			dress_list = mGirlDressList;
		}
		
		for(var idx=0; idx<dress_list.Count; idx++) {
			if((dress_list[idx] as Item)._instanceID == itemID) {
				remove_idx = idx;
				break;
			}
		}
		if(remove_idx != -1) {
			dress_list.RemoveAt(idx);
		}
	}
	
	public function AddEquipList(ins : Item,idx : int) {
		if(ins == null) {
			Debug.Log("ins is null!!");
			return ;
		}
		
		if(idx < 0) {
			mEquipList.Add(ins);
		} else {
			mEquipList.Insert(idx,ins);
		}
		
		if(mSort == DressSort.SORT_MALE && (ResManager.LgtMgr.ItemDressTable[ins._itemInfo.sub_id] as ItemDressRow).sex == sex_type.st_boy) {
			if(idx < 0) {
				mCurEquipList.Add(ins);
			}else {
				mCurEquipList.Insert(idx,ins);
			}
		} else if(mSort == DressSort.SORT_FEMALE && (ResManager.LgtMgr.ItemDressTable[ins._itemInfo.sub_id] as ItemDressRow).sex == sex_type.st_girl){
			if(idx < 0) {
				mCurEquipList.Add(ins);
			}else {
				mCurEquipList.Insert(idx,ins);
			}
		}
	}
	
	public function RemoveEquipList(ins : Item) {
		var remove_idx : int = -1;
		for(var idx=0; idx<mEquipList.Count; idx++) {
			if((mEquipList[idx] as Item)._instanceID == ins._instanceID) {
				remove_idx = idx;
				break;
			}
		}
		if(remove_idx != -1) {
			mEquipList.RemoveAt(remove_idx);
		}
		
		var cur_remove_idx : int = -1;
		for(idx=0; idx<mCurEquipList.Count; idx++) {
			if((mCurEquipList[idx] as Item)._instanceID == ins._instanceID) {
				cur_remove_idx = idx;
				break;
			}
		}
		if(cur_remove_idx != -1) {
			mCurEquipList.RemoveAt(cur_remove_idx);
		}
	}
	
	public function ResetBoyDress() {
		mBoyDressList.Clear();
		
		var girlArray : ArrayList = new ArrayList();
		for(var idx=0; idx<mEquipList.Count; idx++) {
			if((ResManager.LgtMgr.ItemDressTable[(mEquipList[idx] as Item)._itemInfo.sub_id] as ItemDressRow).sex == sex_type.st_girl) {
				girlArray.Add(mEquipList[idx]);
			}
		}
		mEquipList.Clear();
		mEquipList = girlArray.Clone();
			
		var pack : ItemPack = SelfItemLogic.getInstance()._loverPackage;
		for(var i=0; i<pack.count(); ++i) {
			var grid : PackGrid = pack.getPackGrid(i);
			if (ItemType.Clothes == grid._item._itemInfo.type && (ResManager.LgtMgr.ItemDressTable[grid._item._itemInfo.sub_id] as ItemDressRow).sex == sex_type.st_boy) {
				mEquipList.Add(grid._item);
			}
		}
		
		if(mSort == DressSort.SORT_MALE) {
			mCurEquipList.Clear();
			for(var equip : Item in mEquipList) {
				if((ResManager.LgtMgr.ItemDressTable[equip._itemInfo.sub_id] as ItemDressRow).sex == sex_type.st_boy) {
					mCurEquipList.Add(equip);
				}
			}
		}
	}
	
	public function ResetGirlDress() {
		mGirlDressList.Clear();
		
		var boyArray : ArrayList = new ArrayList();
		for(var idx=0; idx<mEquipList.Count; idx++) {
			if((ResManager.LgtMgr.ItemDressTable[(mEquipList[idx] as Item)._itemInfo.sub_id] as ItemDressRow).sex == sex_type.st_boy) {
				boyArray.Add(mEquipList[idx]);
			}
		}
		mEquipList.Clear();
		mEquipList = boyArray.Clone();
		
		var pack : ItemPack = SelfItemLogic.getInstance()._loverPackage;
		for(var i=0; i<pack.count(); ++i) {
			var grid : PackGrid = pack.getPackGrid(i);
			if (ItemType.Clothes == grid._item._itemInfo.type && (ResManager.LgtMgr.ItemDressTable[grid._item._itemInfo.sub_id] as ItemDressRow).sex == sex_type.st_girl) {
				mEquipList.Add(grid._item);
			}
		}
		
		if(mSort == DressSort.SORT_FEMALE) {
			mCurEquipList.Clear();
			for(var equip : Item in mEquipList) {
				if((ResManager.LgtMgr.ItemDressTable[equip._itemInfo.sub_id] as ItemDressRow).sex == sex_type.st_girl) {
					mCurEquipList.Add(equip);
				}
			}
		}
	}
	
	public function AddCost(gold : int, rmb : int, credit : int) {
		mCostGold += gold;
		mCostRMB += rmb;
		mCostCredit += credit;
		if(mCostGold < 0) mCostGold = 0;
		if(mCostRMB < 0) mCostRMB = 0;
		if(mCostCredit < 0) mCostCredit = 0;
	}
	
	public function SetCost(gold : int, rmb : int, credit : int) {
		mCostGold = gold;
		mCostRMB = rmb;
		mCostCredit = credit;
	}
	
	public function ChangeSort(sort : DressSort) : ArrayList {
		if(sort == mSort)
			return GetPageData(0);
			
		mSort = sort;
		mCurEquipList.Clear();
		mStartPos = 0;
		mEndPos = mPerPageNum;
		
		var pack : ItemPack = SelfItemLogic.getInstance()._loverPackage;
		if(sort == DressSort.SORT_MALE) {
			for(var equip : Item in mEquipList) {
				if((ResManager.LgtMgr.ItemDressTable[equip._itemInfo.sub_id] as ItemDressRow).sex == sex_type.st_boy) {
					mCurEquipList.Add(equip);
				}
			}
		} else if(sort == DressSort.SORT_FEMALE) {
			for(var equip : Item in mEquipList) {
				if((ResManager.LgtMgr.ItemDressTable[equip._itemInfo.sub_id] as ItemDressRow).sex == sex_type.st_girl) {
					mCurEquipList.Add(equip);
				}
			}
		} else {
			Debug.LogWarning("invalid sort!!!");
		}
		
		return GetPageData(0);
	}
	
	/*
	private function IsEqualSlot(ins : Item, ins_other : Item) {
		var dressID1: int = ResManager.LgtMgr.getItemRow(ins._itemInfo.id).sub_id;
		var dressID2: int = ResManager.LgtMgr.getItemRow(ins_other._itemInfo.id).sub_id;
	   	return ResManager.LgtMgr.ItemDressTable[dressID1].equip_pos == ResManager.LgtMgr.ItemDressTable[dressID2].equip_pos;
	}
	*/
	
	public function GetPageData(move_num : int) : ArrayList {
		var startPos = mStartPos + move_num;
		var endPos = mEndPos + move_num;
		if(move_num >= 0) {
			if(mCurEquipList.Count < mPerPageNum) {
				startPos = 0;
				endPos = mCurEquipList.Count-1;
			} else {
				if(startPos < 0) {
					startPos = 0;
				}
				if(endPos > mCurEquipList.Count-1) {
					endPos = mCurEquipList.Count-1;
				}
				else if(endPos < mPerPageNum-1) {
					endPos = mPerPageNum-1;
				}
				
				if(endPos - startPos < mPerPageNum-1) {
					startPos = endPos - mPerPageNum + 1;
				}
			}
		} else {
			if(startPos < 0) {
				startPos = 0;
			}
			if(endPos-startPos < mPerPageNum-1) {
				if(startPos + mPerPageNum > mCurEquipList.Count) {
					endPos = mCurEquipList.Count-1;
				} else {
					endPos = startPos + mPerPageNum - 1;
				}
			}
		}
		
		var pageData : ArrayList = new ArrayList();
		
		for(var i = startPos; i<=endPos; i++) {
			pageData.Add(mCurEquipList[i]);
		}
		
		mStartPos = startPos;
		mEndPos = endPos;
		
		return pageData;
	}
	
	public function GetItemCurrIdx(ins : Item) {
		var result : int = -1;
		
		for(var idx=0; idx<mCurEquipList.Count; idx++) {
			if(ins._instanceID == (mCurEquipList[idx] as Item)._instanceID) {
				result = idx;
				break;
			}
		}
		
		return result;
	}
	
	public function GetCurSort() : DressSort {
		return mSort;
	}
	
	public function GetBoyDressList() : ArrayList {
		return mBoyDressList;
	}
	
	public function GetGirlDressList() : ArrayList {
		return mGirlDressList;
	}
	
	public function GetCurEquipList() : ArrayList {
		return mCurEquipList;
	}
	
	public function GetCostGold() : int {
		return mCostGold;
	}
	
	public function GetCostRMB() : int {
		return mCostRMB;
	}
	
	public function GetCostCredit() : int {
		return mCostCredit;
	}
}