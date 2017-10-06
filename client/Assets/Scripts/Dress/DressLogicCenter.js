#pragma strict
#pragma downcast
/*
//dress net center
//creat by fullzhu 2012.2.18
//last edit at 2012.2.18 by fullzhu
*/

private var mBoyAvatar : DressAvatar = null;
private var mGirlAvatar : DressAvatar = null;
private var mPlayerData : DressData = null;
private var mLoverData : DressData = null;
private var mDressPack : DressPack = null;
private var mDressMall : DressMall = null;

private var mPerPackPageNum : int = 11;
private var mPerMallPageNum : int = 12;

private var mBSingle : boolean = false;

public var avatarObj : GameObject;
public var mBoyAvatarPos : Vector3 = Vector3(470.1, 500.5, 479.5);
private var mBoyRotation : Vector3 = Vector3(0, 90, 180);
public var mGirlAvatarPos : Vector3 = Vector3(499.9, 500.5, 479.5);
private var mGirlRotation : Vector3 = Vector3(0, 90, 180);

private var mAvatarScene : GameObject;

private static var instance : DressLogicCenter;
function Awake(){
	instance=this;
	
	RegistEventMsg();
}
static function GetInstance(){
	return instance;
}

function Start () {
}

function RegistEventMsg() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_INIT_DRESS_BASE_INFO), HandleNotifyDressBaseInfo);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_DRESS_RESULT), HandleNotifyDressResult);
}

//hanlde game event
function HandleNotifyDressBaseInfo(evt:GameEvent, obj:notify_start_change_dress) {
	var bBoy : boolean = PlayerFriend.GetInstance().IsMainPlayerBoy();
	
	var ownerEquip : ArrayList = new ArrayList();
	var ownerSlotData : ArrayList = new ArrayList();
	for(var equip : pack_grid in obj.owner.body) {
		ownerEquip.Add(equip.item_data.template_id);
		var slotData : EquipSlotData = new EquipSlotData();
		slotData.goodsID = 0;
		slotData.itemID = equip.item_data.template_id;
		slotData.instanceID = equip.item_data.instance_id;
		ownerSlotData.Add(slotData);
	}
	mPlayerData = new DressData(obj.owner);
	
	var loverData : player_basic_data = null;
	if(obj.lover.account == "") {
		mBSingle = true;
		
		if(bBoy)
			loverData = ContructBaseData(sex_type.st_girl);
		else
			loverData = ContructBaseData(sex_type.st_boy); 
	} else {
		mBSingle = false;
		
		loverData = obj.lover;
	}
	
	var loverEquip : ArrayList = new ArrayList();
	var loverSlotData : ArrayList = new ArrayList();
	for(var equip : pack_grid in loverData.body) {
		loverEquip.Add(equip.item_data.template_id);
		var slotData1 : EquipSlotData = new EquipSlotData();
		slotData1.goodsID = 0;
		slotData1.itemID = equip.item_data.template_id;
		slotData1.instanceID = equip.item_data.instance_id;
		loverSlotData.Add(slotData1);
	}
	mLoverData = new DressData(loverData);
	
	if(bBoy) {
		mBoyAvatar = new DressAvatar(obj.owner);
		mBoyAvatar.Init(ownerEquip,mBoyAvatarPos,mBoyRotation);
		
		mGirlAvatar = new DressAvatar(loverData);
		mGirlAvatar.Init(loverEquip,mGirlAvatarPos,mGirlRotation);
		
		for(var equip in ownerSlotData) {
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_BOY_SLOT_ICON),equip);
		}
		
		for(equip in loverSlotData) {
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_GIRL_SLOT_ICON),equip);
		}
		
	} else {
		mBoyAvatar = new DressAvatar(loverData);
		mBoyAvatar.Init(loverEquip,mBoyAvatarPos,mBoyRotation);
		
		mGirlAvatar = new DressAvatar(obj.owner);
		mGirlAvatar.Init(ownerEquip,mGirlAvatarPos,mGirlRotation);
		
		for(equip in ownerSlotData) {
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_GIRL_SLOT_ICON),equip);
		}
		
		for(equip in loverSlotData) {
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_BOY_SLOT_ICON),equip);
		}
	}
}

function HandleNotifyDressResult(evt:GameEvent, obj:notify_change_dress) {
	if(obj.type == change_dress_type.cdt_ok) {
		DressMainPlayer(obj.body);
		// 保存主玩家装备数据
		var main_player : GameObject = ScenePlayerMgr.getMainPlayer();
		var p : Player = main_player.GetComponent("Player");
		p.setBodyData(obj.body);
		
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_ENABLE),false);
		Clear();
	} else if(obj.type == change_dress_type.cdt_coin_fail){
		UI.getUI().OpenMsgbox("", Define.getContent(5095),true);
	} else if(obj.type == change_dress_type.cdt_item_fail){
		var dressID: int = 0;
		var equipPos : int = 0;
		
		if(PlayerFriend.GetInstance().IsMainPlayerBoy()) {
			for(var ins : item in obj.item_list) {
				dressID = ResManager.LgtMgr.getItemRow(ins.template_id).sub_id;
				if(ResManager.LgtMgr.ItemDressTable[dressID] == null) {
					Debug.Log("invalid dress_id"+dressID.ToString());
					continue;
				}
				equipPos = (ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).equip_pos;
				
				UnDressMainPlayer(ins.template_id,sex_type.st_boy);
				
				mBoyAvatar.UnDress(ins.template_id,sex_type.st_boy);
				mPlayerData.UnEquip(ins.template_id);
				mDressPack.RemoveDress(ins.instance_id,true);
				EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_CLEAR_BOY_SLOT_ICON),equipPos);
			}
		} else {
			for(var ins : item in obj.item_list) {
				dressID = ResManager.LgtMgr.getItemRow(ins.template_id).sub_id;
				if(ResManager.LgtMgr.ItemDressTable[dressID] == null) {
					Debug.Log("invalid dress_id"+dressID.ToString());
					continue;
				}
				equipPos = (ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).equip_pos;
				
				UnDressMainPlayer(ins.template_id,sex_type.st_girl);
				
				mGirlAvatar.UnDress(ins.template_id,sex_type.st_girl);
				mPlayerData.UnEquip(ins.template_id);
				mDressPack.RemoveDress(ins.instance_id,false);
				EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_CLEAR_GIRL_SLOT_ICON),equipPos);
			}
		}
		
		UI.getUI().OpenMsgbox("", Define.getContent(5096),true);
	} else {
		Debug.LogWarning("wrong packet!!");
	}
}

//logic function for external interface
function Init() {
	var bBoy : boolean = PlayerFriend.GetInstance().IsMainPlayerBoy();
	mDressPack = new DressPack(mPerPackPageNum,bBoy);
	mDressMall = new DressMall(mPerMallPageNum);
	
	DressNet.GetInstance().ReqStartDress();
	
	mDressMall.Init();
	
	if(avatarObj == null) {
		throw "avatar scene obj is null...";
	}
	mAvatarScene = GameObject.Instantiate(avatarObj);
	for (var cam : Camera in mAvatarScene.GetComponentsInChildren(Camera, true))
	{
		cam.renderingPath = Camera.main.renderingPath;
	}
	
	AmbientMgr.getSingleton().setMode(AmbientMode.AM_CHANGE);

	/*
	var cam = GameObject.Find("Main Camera");
    EnableMainCameraComponent(false);        
    cam.AddComponent("Backdrop");  	
    cam.transform.position = Vector3(900, 0, 0);         
    cam.transform.eulerAngles = Vector3(CreateRoleConfig.data["camera_angle_x"], 0, 0);
    */ 
}

function Clear() {
	if(mBoyAvatar) {
		mBoyAvatar.DestroyAvatar();
	}
	if(mGirlAvatar) {
		mGirlAvatar.DestroyAvatar();
	}
	mBoyAvatar = null;
	mGirlAvatar = null;
	mPlayerData = null;
	mLoverData = null;
	mDressPack = null;
	mDressMall = null;
	
	UnityEngine.Object.Destroy(mAvatarScene);
	
	AmbientMgr.getSingleton().setMode(AmbientMode.AM_NORMAL);
	/*
	var cam = GameObject.Find("Main Camera");
	cam.transform.position = Vector3(0, 0, 0); 
	EnableMainCameraComponent(true);
	GameObject.Destroy(cam.GetComponent("Backdrop"));		
	GameObject.Destroy(cam.transform.Find("Backdrop").gameObject);
	*/
}

//TODO: Equip logic so terriable that need to make better
public function Equip(goods : ShopCenterRow) : void {
	if(goods == null) {
		Debug.Log("goods ins is null!!!");
		return ;
	} else {
		var dressID : int = ResManager.LgtMgr.getItemRow(goods.item_id).sub_id;
		if(ResManager.LgtMgr.ItemDressTable[dressID] == null) {
			Debug.Log("invalid dress_id!!" + dressID.ToString());
			return ;
		}
		var dressSex : int = (ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).sex;	// 要装备的性别
		var dress_pos : int = DressAvatar.GetDressPos(goods.item_id);							// 要装备的位置
		var bPreView : boolean = false;
		var bUnEquipPack : boolean = false;
		var bUnEquipMall : boolean = false;
		var bEmpty : boolean = false;
		var slotData : EquipSlotData = new EquipSlotData();
		slotData.goodsID = goods.goods_id;		// 商店表id
		slotData.itemID = goods.item_id;		// 物品表id
		slotData.instanceID = 0;
		
		if(mDressPack.IsExsitDress(dress_pos)) {
			bUnEquipPack = true;
		} else if(mDressMall.IsExsitDressOwner(dress_pos)) {
			bUnEquipMall = true;
		} 
		
		if(!mPlayerData.IsExsitDress(dress_pos)) {
			bEmpty = true;
		}
		
		if(sex_type.st_boy == dressSex) {				// 男性
			if(PlayerFriend.GetInstance().IsMainPlayerBoy()) {
				mPlayerData.Equip(goods.item_id);
				mDressMall.AddOwnerPurchase(goods);
			} else {
				mLoverData.Equip(goods.item_id);
				mDressMall.AddLoverPurchase(goods);
				
				bPreView = true;
			}
			
			mBoyAvatar.showParticle();
			mBoyAvatar.Dress(goods.item_id);
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_BOY_SLOT_ICON),slotData);
		} else if(sex_type.st_girl == dressSex){		// 女性
			if(PlayerFriend.GetInstance().IsMainPlayerBoy()) {
				mLoverData.Equip(goods.item_id);
				mDressMall.AddLoverPurchase(goods);
				
				bPreView = true;
			} else {
				mPlayerData.Equip(goods.item_id);
				mDressMall.AddOwnerPurchase(goods);
			}
			
			mGirlAvatar.showParticle();
			mGirlAvatar.Dress(goods.item_id);
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_GIRL_SLOT_ICON),slotData);
		} else {
			mPlayerData.Equip(goods.item_id);
			mDressMall.AddOwnerPurchase(goods);
			
			if(PlayerFriend.GetInstance().IsMainPlayerBoy()) {
				mBoyAvatar.showParticle();
				mBoyAvatar.Dress(goods.item_id);
				EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_BOY_SLOT_ICON),slotData);
			} else {
				mGirlAvatar.showParticle();
				mGirlAvatar.Dress(goods.item_id);
				EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_GIRL_SLOT_ICON),slotData);
			}
		}
		
		if(bUnEquipPack) {
			mDressPack.RemoveDress(dress_pos,dressSex,bPreView,-1);
			
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_REFRESH_PACK_LIST));
		} else if(bPreView == false && bUnEquipMall) {
			//Do Nothing Now
		} else if(bEmpty) {
			//Do Nothing Now
		} else if(bPreView == false && mPlayerData.IsExsitDress(dress_pos) && mPlayerData.IsExsitBase(dress_pos)) {
			var ins : item = mPlayerData.GetBodyDress(dress_pos);
			var insItem : Item = new Item(ins);
			mDressPack.AddEquipList(insItem,-1);		
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_REFRESH_PACK_LIST));
		}
		// 刷新花费假价钱
		RefreshCostMoney();
	}
}

function Equip(ins : Item) {
	var bUnEquipPack : boolean = false;
	var bUnEquipMall : boolean = false;
	var bEmpty : boolean = false;
	var dress_pos : int = DressAvatar.GetDressPos(ins._itemInfo.id);
	var replace_idx : int = mDressPack.GetItemCurrIdx(ins);
		
	if(mDressPack.IsExsitDress(dress_pos)) {
		bUnEquipPack = true;
	} else if(mDressMall.IsExsitDressOwner(dress_pos)) {
		bUnEquipMall = true;
	}
	
	if(!mPlayerData.IsExsitDress(dress_pos)) {
		bEmpty = true;
	}
	
	var slotData : EquipSlotData = new EquipSlotData();
	slotData.goodsID = 0;
	slotData.itemID = ins._itemInfo.id;
	slotData.instanceID = ins._instanceID; 
		
	if(ins == null) {
		Debug.Log("equip ins is null!!!");
		return ;
	} else {
		var bPreView : boolean = false;
		if(DressPack.DressSort.SORT_MALE == mDressPack.GetCurSort()) {
			if(PlayerFriend.GetInstance().IsMainPlayerBoy()) {
				mPlayerData.Equip(ins._itemInfo.id);
				mDressMall.RemoveOwnerPurchase(dress_pos);
			} else {
				mLoverData.Equip(ins._itemInfo.id);
				mDressMall.RemoveLoverPurchase(dress_pos);
				
				bPreView = true;
			}
			mBoyAvatar.showParticle();
			mBoyAvatar.Dress(ins._itemInfo.id);
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_BOY_SLOT_ICON),slotData);
		} else {
			if(PlayerFriend.GetInstance().IsMainPlayerBoy()) {
				mLoverData.Equip(ins._itemInfo.id);
				mDressMall.RemoveLoverPurchase(dress_pos);
				
				bPreView = true;
			} else {
				mPlayerData.Equip(ins._itemInfo.id);
				mDressMall.RemoveOwnerPurchase(dress_pos);
			}
			mGirlAvatar.showParticle();
			mGirlAvatar.Dress(ins._itemInfo.id);
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_GIRL_SLOT_ICON),slotData);
		}
		
		mDressPack.AddDress(ins,bPreView);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_REFRESH_PACK_LIST));
		
		if(bUnEquipPack) {
			//DO Nothing now
		} else if(bPreView == false && bUnEquipMall) {
			//Do Nothing Now
		} else if(bEmpty) {
			//Do Nothing Now
		} else if(bPreView == false && mPlayerData.IsExsitDress(dress_pos) && mPlayerData.IsExsitBase(dress_pos)) {
			var ins_item : item = mPlayerData.GetBodyDress(dress_pos);
			var insItem : Item = new Item(ins_item);
			mDressPack.AddEquipList(insItem,replace_idx);	
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_REFRESH_PACK_LIST));
		}
		
		RefreshCostMoney();
	}
}

function RefreshCostMoney() {
	var gold : int = 0;
	var rmb : int = 0;
	var credit : int = 0;
	
	var ownerPurchase : ArrayList = mDressMall.GetOwnerPurchaseList();
	var loverPurchase : ArrayList = mDressMall.GetLoverPurchaseList();
	for(var goods : ShopCenterRow in ownerPurchase) {
		if(goods.money_type == money_type.mt_diamond) {
			gold += goods.price;
		} else if(goods.money_type == money_type.mt_love_coin) {
			rmb += goods.price;
		}
		credit += goods.point;
	}
	for(var goods : ShopCenterRow in loverPurchase) {
		if(goods.money_type == money_type.mt_diamond) {
			gold += goods.price;
		} else if(goods.money_type == money_type.mt_love_coin) {
			rmb += goods.price;
		}
		credit += goods.point;
	}
	
	mDressPack.SetCost(gold,rmb,credit);
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_GOLD_UPDATE),gold);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_RMB_UPDATE),rmb);
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_CREDIT_UPDATE),credit);
}

function UnEquipBoy(itemID : int) {
	if(itemID == 0) {
		Debug.LogWarning("invalid itemID!!");
		return ;
	}
	
	var bUnEquipPack : boolean = false;
	var bUnEquipMall : boolean = false;
	var bPreView : boolean = false;
	var dress_pos : int = DressAvatar.GetDressPos(itemID);
		
	if(mDressPack.IsExsitDress(dress_pos)) {
		bUnEquipPack = true;
	} else if(mDressMall.IsExsitDressOwner(dress_pos)) {
		bUnEquipMall = true;
	} 
	
	if(PlayerFriend.GetInstance().IsMainPlayerBoy()) {
		mPlayerData.UnEquip(itemID);
		mDressMall.RemoveOwnerPurchase(dress_pos);
		
		bPreView = false;
	} else {
		mLoverData.UnEquip(itemID);
		mDressMall.RemoveLoverPurchase(dress_pos);
		
		bPreView = true;
	}
	
	mBoyAvatar.UnDress(itemID,sex_type.st_boy);
	
	if(bUnEquipPack) {
		mDressPack.RemoveDress(dress_pos,sex_type.st_boy,bPreView,-1);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_REFRESH_PACK_LIST));
	} else if(bPreView == false && bUnEquipMall) {
			//Do Nothing Now
	} else if(bPreView == false && mPlayerData.IsExsitBase(dress_pos)) {
		var ins_item : item = mPlayerData.GetBodyDress(dress_pos);
		var insItem : Item = new Item(ins_item);
		mDressPack.AddEquipList(insItem,-1);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_REFRESH_PACK_LIST));
	}
			
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_CLEAR_BOY_SLOT_ICON),dress_pos);
			
	RefreshCostMoney();
}

function UnEquipGirl(itemID : int) {
	if(itemID == 0) {
		Debug.LogWarning("invalid itemID!!");
		return ;
	}
	
	var bUnEquipPack : boolean = false;
	var bUnEquipMall : boolean = false;
	var bPreView : boolean = false;
	var dress_pos : int = DressAvatar.GetDressPos(itemID);
		
	if(mDressPack.IsExsitDress(dress_pos)) {
		bUnEquipPack = true;
	} else if(mDressMall.IsExsitDressOwner(dress_pos)) {
		bUnEquipMall = true;
	} 
	
	if(PlayerFriend.GetInstance().IsMainPlayerBoy()) {
		mLoverData.UnEquip(itemID);
		mDressMall.RemoveLoverPurchase(dress_pos);
		bPreView = true;
	} else {
		mPlayerData.UnEquip(itemID);
		mDressMall.RemoveOwnerPurchase(dress_pos);
		bPreView = false;
	}
	
	mGirlAvatar.UnDress(itemID,sex_type.st_girl);
	
	if(bUnEquipPack) {
		mDressPack.RemoveDress(dress_pos,sex_type.st_girl,bPreView,-1);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_REFRESH_PACK_LIST));
	} else if(bPreView == false && bUnEquipMall) {
			//Do Nothing Now
	} else if(bPreView == false && mPlayerData.IsExsitBase(dress_pos)) {
		var ins_item : item = mPlayerData.GetBodyDress(dress_pos);
		var insItem : Item = new Item(ins_item);
		mDressPack.AddEquipList(insItem,-1);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_REFRESH_PACK_LIST));
	}
			
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_CLEAR_GIRL_SLOT_ICON),dress_pos);
			
	RefreshCostMoney();
}

function ChangePackSort(sort : DressPack.DressSort) : ArrayList {
	if(mDressPack == null) return null;
	
	return mDressPack.ChangeSort(sort);
}

function ChangeMallSort(sort : DressMall.GoodsSort) : ArrayList {
	if(mDressMall == null) return null;
	
	return mDressMall.ChangeTopSort(sort);
}

function ChangeMallSubSort(sort : DressMall.GoodsSubSort) {
	if(mDressMall == null) return null;
	
	return mDressMall.ChangeSubSort(sort);
}

function GirlViewLeft() {
	mGirlAvatar.Rotate(Vector3(0,1,0));
}

function GirlViewRight() {
	mGirlAvatar.Rotate(Vector3(0,-1,0));
}

function BoyViewLeft() {
	mBoyAvatar.Rotate(Vector3(0,1,0));
}

function BoyViewRight() {
	mBoyAvatar.Rotate(Vector3(0,-1,0));
}

function ResetGirl() {
	var initEquip : ArrayList = null;
	var initInstanceEquip : ArrayList = null;
	if(mGirlAvatar == null) return;
	
	mDressPack.ResetGirlDress();
	if(PlayerFriend.GetInstance().IsMainPlayerBoy()) {
		mLoverData.Reset();
		mDressMall.ResetLoverPurchase();
		
		initEquip = mLoverData.GetDressInit();
		initInstanceEquip = mLoverData.GetDressInsInit();
	} else {
		mPlayerData.Reset();
		mDressMall.ResetOwnerPurchase();
		
		initEquip = mPlayerData.GetDressInit();
		initInstanceEquip = mPlayerData.GetDressInsInit();
	}
	mGirlAvatar.showParticle();
	mGirlAvatar.Reset(initEquip,sex_type.st_girl);
	
	for(var i=0; i<8; i++) {
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_CLEAR_GIRL_SLOT_ICON),i);
	}
	
	var slotDataList : ArrayList = new ArrayList();
	
	for(i=0; i<initEquip.Count; i++) {
		var slotData : EquipSlotData = new EquipSlotData();
		slotData.goodsID = 0;
		slotData.itemID = initEquip[i];
		slotData.instanceID = (initInstanceEquip[i] as pack_grid).item_data.instance_id; 
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_GIRL_SLOT_ICON),slotData);
	}
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_REFRESH_PACK_LIST));
	RefreshCostMoney();
}

function ResetBoy() {
	var initEquip : ArrayList = null;
	var initInstanceEquip : ArrayList = null;
	if(mBoyAvatar == null) return;
	
	mDressPack.ResetBoyDress();
	if(PlayerFriend.GetInstance().IsMainPlayerBoy()) {
		mPlayerData.Reset();
		mDressMall.ResetOwnerPurchase();
		
		initEquip = mPlayerData.GetDressInit();
		initInstanceEquip = mPlayerData.GetDressInsInit();
	} else {
		mLoverData.Reset();
		mDressMall.ResetLoverPurchase();
		
		initEquip = mLoverData.GetDressInit();
		initInstanceEquip = mLoverData.GetDressInsInit();
	}
	mBoyAvatar.showParticle();
	mBoyAvatar.Reset(initEquip,sex_type.st_boy);
	
	for(var i=0; i<8; i++) {
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_CLEAR_BOY_SLOT_ICON),i);
	}
	for(i=0; i<initEquip.Count; i++) {
		var slotData : EquipSlotData = new EquipSlotData();
		slotData.goodsID = 0;
		slotData.itemID = initEquip[i];
		slotData.instanceID = (initInstanceEquip[i] as pack_grid).item_data.instance_id;
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_BOY_SLOT_ICON),slotData);
	}
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_REFRESH_PACK_LIST));
	RefreshCostMoney();
}

function CheckSave(type : int) : boolean {
	var gold : int = mDressPack.GetCostGold();
	var rmb : int = mDressPack.GetCostRMB();
	var credit : int = mDressPack.GetCostCredit();
	
	if(type == money_type.mt_love_coin) {
		var hRmb : int = DataCenter.GetPlayerDiamond();
		if(hRmb < rmb) {
			Global.GetSysMsgHandler().ShowSysMsg(552);
			return false;
		}
	} else if(type == money_type.mt_point) {
		var hCredit : int = DataCenter.GetPlayerCredit();
		if(hCredit < credit) {
			Global.GetSysMsgHandler().ShowSysMsg(555);
			return false;
		}
	} else if(type == money_type.mt_diamond) {
		var hGold : int = SelfItemLogic.getInstance()._loverDiamond;
		if(hGold < gold) return false;
	} else {
		return false;
	}
	
	return true;
}

function CheckMoneyChoose(type : int) : ArrayList {
	var list : ArrayList = new ArrayList();
	if(type == money_type.mt_love_coin) 
		return list;
	
	var ownerList : ArrayList = mDressMall.GetOwnerPurchaseList();
	var loverList : ArrayList = mDressMall.GetLoverPurchaseList();
	
	var name : String = "";
	for(var owner : ShopCenterRow in ownerList) {
		if(owner.point == 0) {
			name = ResManager.LgtMgr.getItemRow(owner.item_id).name;
			list.Add(name);
		}
	}
	for(var lover : ShopCenterRow in loverList) {
		if(lover.point == 0) {
			name = ResManager.LgtMgr.getItemRow(lover.item_id).name;
			list.Add(name);
		}
	}
		
	return list;
}

function IsSingle() : boolean {
	return mBSingle;
}

function Save(type : int) {
	if(!CheckSave(type)) {
		Debug.Log("save dress failure!!!");
	} else {
		var ownerList : ArrayList = mDressMall.GetOwnerPurchaseList();
		var loverList : ArrayList = mDressMall.GetLoverPurchaseList();
	
		var equipList : ArrayList;
		if(PlayerFriend.GetInstance().IsMainPlayerBoy()) {
			equipList = mDressPack.GetBoyDressList();
		}else {
			equipList = mDressPack.GetGirlDressList();
		}
		
		var purchaseListOwner : ArrayList = new ArrayList();	
		var purchaseListLover : ArrayList = new ArrayList();
		var itemList : ArrayList = new ArrayList();
		var unEquipList : ArrayList = new ArrayList();
		for(var purchaseOwner : ShopCenterRow in ownerList) {
			purchaseListOwner.Add(purchaseOwner.goods_id);
		}
		for(var purchaseLover : ShopCenterRow in loverList) {
			purchaseListLover.Add(purchaseLover.goods_id);
		}
		for(var equip : Item in equipList) {
			if(mPlayerData.IsInitEquip(equip._instanceID) == false) {
				var ins : item = new item();
				ins.instance_id = equip._instanceID;
				ins.template_id = equip._itemInfo.id;
				itemList.Add(ins);
			}
		}
		for(var gird : pack_grid in mPlayerData.GetDressInsInit()) {
			if(gird.item_data.instance_id == 0) continue ;
			
			var dress_pos : int = DressAvatar.GetDressPos(gird.item_data.template_id);
			if(!mPlayerData.IsExsitDress(dress_pos)) {
				unEquipList.Add(gird.item_data.instance_id);
			}
		}
		
		if(unEquipList.Count == 0 && equipList.Count == 0 && purchaseListOwner.Count == 0 && purchaseListLover.Count == 0) {
			Debug.Log("dress nothing!!");
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_DRESS_ENABLE),false);
			Clear();
		} else {
			DressNet.GetInstance().ReqChangeDress(type,purchaseListOwner,purchaseListLover,itemList,unEquipList);
		}
	}
}

function IsLevelValid(item_id : int) : boolean {
	var row : ItemRow = ResManager.LgtMgr.getItemRow(item_id);
	var itemLevel : int = row.use_level;
	var level : int = DataCenter.getMainPlayerCurLv();
	
	return itemLevel<=level ? true : false;
}

//logic function for interal
private function DressMainPlayer(grid_vec : ArrayList) {
	var plr : Player = ScenePlayerMgr.getMainPlayer().GetComponent("Player");
	if(plr) {
		plr.setEquips(grid_vec);
	}
	/*
	if(itemID == 0) return ;
		
		var dress_pos : int = DressAvatar.GetDressPos(itemID);
		var dress_body : String = DressAvatar.GetDressBody(itemID);
		var dress_model : String = DressAvatar.GetDressModel(itemID);
		
		if(dress_pos == -1) return ;
		
		switch(dress_pos) {
			case 0:ScenePlayerMgr.getMainPlayer().GetComponent(Player).addHat(dress_model, dress_body);break;
			case 1:ScenePlayerMgr.getMainPlayer().GetComponent(Player).changeClothes(itemID);break;
			case 2:ScenePlayerMgr.getMainPlayer().GetComponent(Player).addGlasses(dress_model);break;
			case 3:break;
			case 4:break;
			case 5:ScenePlayerMgr.getMainPlayer().GetComponent(Player).addPart("shoes",dress_model);break;
			case 6:break;
			case 7:break;
		}
		*/
}

private function UnDressMainPlayer(itemID : int,sex : int) {
	if(itemID == 0) return ;
		
		var dress_pos : int = DressAvatar.GetDressPos(itemID);
		var dress_body : String = DressAvatar.GetDressBody(itemID);
		var dress_model : String = DressAvatar.GetDressModel(itemID);
		
		if(dress_pos == -1) return ;
		
		switch(dress_pos) {
			case 0:ScenePlayerMgr.getMainPlayer().GetComponent(Player).removeChild("hat");break;
			case 1:ScenePlayerMgr.getMainPlayer().GetComponent(Player).removePart("close",sex);break;
			case 2:ScenePlayerMgr.getMainPlayer().GetComponent(Player).removeChild("glasses");break;
			case 3:break;
			case 4:break;
			case 5:ScenePlayerMgr.getMainPlayer().GetComponent(Player).removePart("shoes",sex);break;
			case 6:break;
			case 7:break;
		}
}

/*
private function EnableMainCameraComponent(enable : boolean) {
	var cam = GameObject.Find("Main Camera");
    for (var script: MonoBehaviour in cam.GetComponents(MonoBehaviour)) 
    {
    	script.enabled = enable;
    }
}
*/

private function ContructBaseData(sex : int) {
	var data : player_basic_data = new player_basic_data();
	data.sex = sex;
	
	return data;
}

public function GetBodyEquip(instance_id : UInt64) : pack_grid {
	var grid : pack_grid = null;
	var initInstanceEquip : ArrayList = mLoverData.GetDressInsInit();
	
	for(grid in initInstanceEquip) {
		if(grid.item_data.instance_id == instance_id) {
			return grid;
		}
	}
	
	initInstanceEquip = mPlayerData.GetDressInsInit();
	
	for(grid in initInstanceEquip) {
		if(grid.item_data.instance_id == instance_id) {
			return grid;
		}
	}
	return null;
} 

//data operate
function GetCurPackPageData(move : int) : ArrayList {
	if(mDressPack == null) return null;
	
	return mDressPack.GetPageData(move);
}

function GetDressPack() : DressPack {
	return mDressPack;
}

function GetMallTotalPage() : int {
	return mDressMall.GetTotalPageNum();
}

function GetMallCurrPage() : int {
	return mDressMall.GetCurrPageNum();
}

function GetMallNextPage() : ArrayList {
	return mDressMall.GetNextPage();
}

function GetMallPrePage() : ArrayList {
	return mDressMall.GetPrePage();
}

function GetCostGold() : int {
	return mDressPack.GetCostGold();
}

function GetCostRMB() : int {
	return mDressPack.GetCostRMB();
}

function GetCostCredit() : int {
	return mDressPack.GetCostCredit();
}