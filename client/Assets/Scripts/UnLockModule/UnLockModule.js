class UnlockMaterialItemsClass{
	var material_goodsid : int = 0;
	var material_itmid : int = 0;
	var num : int = 0;
	var existing_num : int = 0;
	
	public function UnlockMaterialItemsClass(m : int, goods_id : int, exist_num : int, num : int){
		material_goodsid = goods_id;
		material_itmid = m;
		existing_num = exist_num;
		this.num = num;
	}
}

class UnLockItemInfoClass{
	var name : String = "";
	var item_id : int = 0;
	var icon : String = "";
}

class UnLockCommClass{
	//private var mMaterials_array : Array = new Array();
	public var mUi_instance : iGUICode_UnLockInfoRoot;
	
	public function UnLockCommClass(need_materials : Array){
		OpenUnLockInfoRoot();
		mUi_instance = iGUICode_UnLockInfoRoot.getInstance();
		mUi_instance.InitCommData(need_materials);
		//mMaterials_array = need_materials;
	}
	
	//--
	function OpenUnLockInfoRoot(){
		UI.getUI().OpenUIRoot("UnLockInfoRoot");
		UI.getUI().SetModal("UnLockInfoRoot", true);
	}
}

