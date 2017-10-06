#pragma strict
#pragma downcast
/*
//item upgrade net center
//create by fullzhu 2012.12.28
//last edit at 2012.12.28 by fullzhu
*/

private static var instance : ItemUpgradeNet;
function Awake(){
	instance=this;
	
	RegistNetMsg();
}
static function GetInstance(){
	return instance;
}

function Start () {
}

//net event regist
function RegistNetMsg() {
	NetHelper.RegistHandler(new notify_extend_aging_item(), HandleNotifyExtendAging);
	NetHelper.RegistHandler(new notify_item_upgrade(), HandleNotifyUpgrade);
	NetHelper.RegistHandler(new notify_mutli_item_upgrade(), HandleNotifyMutliUpgrade);
}

//handle net event
function HandleNotifyExtendAging(evt:GameEvent, pack:notify_extend_aging_item) {
	//DO NOTHING
}

function HandleNotifyUpgrade(evt:GameEvent, pack:notify_item_upgrade) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ITEM_UPGRADE_SUCCESS), pack);
}

function HandleNotifyMutliUpgrade(evt:GameEvent, pack:notify_mutli_item_upgrade) {
	var house : PlayerHouse = EQGameSceneMgr.getSingleton().getHouse();
	for (var fur : house_furniture in pack.furnitures) {
		house.delFurnitureByInstanceId(fur.instance_id);	// step1:先删除升级前的家具
		house.addOneFurniture(fur);							// step2:然后添加升级后的家具
	}
	Property.getInstance().setDecoration(pack.decoration);
	// 
	if (null != UI.getUI().GetUIRoot("UpgradeFurnitureUI")) {
		ItemUpgradeLogic.GetInstance().oneKeyUpgrageFurs();
	}
}

//client request
function ReqItemDelay(id : UInt64) {
	var packet:req_extend_aging_item = new req_extend_aging_item();
	packet.item_inst_id = id;
	NetHelper.Send(packet);
}

function ReqItemUpgrade(id : UInt64) {
	var packet:req_item_upgrade = new req_item_upgrade();
	packet.instance_id = id;
	NetHelper.Send(packet);
}

function ReqMutliItemUpgrage(instIds : Array) {
	var packet:req_mutli_item_upgrade = new req_mutli_item_upgrade();
	for (var id : UInt64 in instIds) {
		packet.inst_ids.Add(id);
	}
	NetHelper.Send(packet);
}

//logic function for external interface

//logic function for interal

//data operate