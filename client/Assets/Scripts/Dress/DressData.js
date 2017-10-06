#pragma strict
#pragma downcast
/*
//dress data center
//creat by fullzhu 2012.2.18
//last edit at 2012.2.18 by fullzhu
*/

class DressData {

	private var mBaseData : player_basic_data = new player_basic_data();
	
	private var mInitEquip : ArrayList = new ArrayList();				//init equip(item_id)
	private var mInitEquipIns : ArrayList = new ArrayList();			//init equip(pack_grid)
	private var mDressEquip : ArrayList = new ArrayList();				//dress equip
	
	function DressData(data : player_basic_data) {
		mBaseData = data;
		for(var equip : pack_grid in mBaseData.body) {
			mInitEquip.Add(equip.item_data.template_id);
			mInitEquipIns.Add(equip);
		}
		mDressEquip = mInitEquip.Clone();
	}
	
	public function Clear() {
		mBaseData = new player_basic_data();
		mInitEquip.Clear();
		mDressEquip.Clear();
	}
	
	public function Reset() {
		mDressEquip = mInitEquip.Clone();
	}
	
	public function Equip(itemID : int) {
		var bReplace : boolean = false;
		var equipPos : int = GetDressPos(itemID);
		if(equipPos == -1) return ;
		
		for(var idx=0; idx<mDressEquip.Count; idx++) {
			var pos : int = GetDressPos(mDressEquip[idx]);
			if(pos == equipPos) {
				mDressEquip[idx] = itemID;
				bReplace = true;
				break;
			}
		}
		if(!bReplace) {
			mDressEquip.Add(itemID);
		}
	}
	
	public function UnEquip(itemID : int) {
		var remove_idx : int = -1;
		
		for(var idx=0; idx<mDressEquip.Count; idx++) {
			if(mDressEquip[idx] == itemID) {
				remove_idx = idx;
				break;
			}
		}
		
		if(remove_idx != -1) {
			mDressEquip.RemoveAt(remove_idx);
		}
	}
	
	public function IsExsitDress(equip_pos : int) : boolean {
		for(var idx=0; idx<mDressEquip.Count; idx++) {
			var itemId : int = mDressEquip[idx];
			if (0 == itemId) continue;
			var dressID: int = ResManager.LgtMgr.getItemRow(itemId).sub_id;
			var equipPos : int = (ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).equip_pos;
			if(equipPos == equip_pos) {
				return true;
			}
		}
		return false;
	}
	
	public function IsExsitBase(equip_pos : int) : boolean {
		for(var idx=0; idx<mBaseData.body.Count; idx++) {
			var itemId : int = (mBaseData.body[idx] as pack_grid).item_data.template_id;
			if (0 == itemId) continue;
			var dressID: int = ResManager.LgtMgr.getItemRow(itemId).sub_id;
			var equipPos : int = (ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).equip_pos;
			if(equipPos == equip_pos) {
				return true;
			}
		}
		return false;
	}
	
	public function IsInitEquip(item_ins_id : UInt64) : boolean {
		for(var ins : pack_grid in mInitEquipIns) {
			if(ins.item_data.instance_id == item_ins_id)
				return true;
		}
		return false;
	}
	
	//data operate
	private function GetDressPos(itemID : int) : int {
		if (0 == itemID) return -1;
		var dressID: int = ResManager.LgtMgr.getItemRow(itemID).sub_id;
	    return (ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).equip_pos;
	}
	
	public function GetDressEquip() : ArrayList {
		return mDressEquip;
	}
	
	public function GetDressInit() : ArrayList {
		return mInitEquip;
	}
	
	public function GetDressInsInit() : ArrayList {
		return mInitEquipIns;
	}
	
	public function GetBodyDress(equip_pos) : item {
		var ins : item = null;
		for(var idx=0; idx<mBaseData.body.Count; idx++) {
			var itemId : int = (mBaseData.body[idx] as pack_grid).item_data.template_id;
			if (0 == itemId) continue;
			var dressID: int = ResManager.LgtMgr.getItemRow(itemId).sub_id;
			var equipPos : int = (ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).equip_pos;
			if(equipPos == equip_pos) {
				ins = (mBaseData.body[idx] as pack_grid).item_data;
				break;
			}
		}
		
		return ins;
	}
}