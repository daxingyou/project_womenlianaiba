#pragma strict
#pragma downcast

/*
//plant net center
//create by fullzhu 2012.7.9
//last edit at 2012.7.9 by fullzhu
*/

private static var instance : PlantNet;
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
	NetHelper.RegistHandler(new notify_farm_data(), HandleNotifyPlantList);
	NetHelper.RegistHandler(new notify_crop_data(), HandleNotifyPlantRefresh);
	NetHelper.RegistHandler(new notify_pick_crop_fruit(), HandleNotifyPickFruitResult);
	NetHelper.RegistHandler(new notify_delete_crop(), HandleNotifyPlantDelete);
	NetHelper.RegistHandler(new notify_house_max_flowerpot(), HandleNotifyPlantLimitCount);
}

//handle net event
function HandleNotifyPlantList(evt:GameEvent, pack:notify_farm_data) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_LIST),pack);
}

function HandleNotifyPlantRefresh(evt:GameEvent, pack:notify_crop_data) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_REFRESH),pack);
}

function HandleNotifyPickFruitResult(evt:GameEvent, pack:notify_pick_crop_fruit) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_PICK_FRUIT_RESULT),pack);
}

function HandleNotifyPlantDelete(evt:GameEvent, pack:notify_delete_crop) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_DELETE),pack);
}

function HandleNotifyPlantLimitCount(evt:GameEvent, pack:notify_house_max_flowerpot) {
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_PLANT_LIMIT_COUNT),pack);
}

//client request
function ReqCropGrow(pot : UInt64, seed : UInt64) {
	var packet : req_plant_crop = new req_plant_crop();
	packet.flowerpot_id = pot;
	packet.seed_id = seed;
	NetHelper.Send(packet);
}

function ReqCropEvent(houseID : UInt64, plantID : UInt64, eventID : int, eventType : int) {
	var packet:req_crop_event = new req_crop_event();
	packet.house_id = houseID;
	packet.inst_id = plantID;
	packet.event_id = eventID;
	packet.event_type = eventType;
	NetHelper.Send(packet);
}

function ReqPickFruit(plantID : UInt64) {
	var packet:req_pick_crop_fruit = new req_pick_crop_fruit();
	packet.crop_id = plantID;
	NetHelper.Send(packet);
}

function ReqDelCrop(plantID : UInt64) {
	var packet:req_delete_crop = new req_delete_crop();
	packet.crop_id = plantID;
	NetHelper.Send(packet);
}

function ReqLimitCount() {
	var packet:req_house_max_flowerpot = new req_house_max_flowerpot();
	NetHelper.Send(packet);
}

function ReqUnlock() {
	var packet:req_add_flowerpot_number = new req_add_flowerpot_number();
	NetHelper.Send(packet);
}

//logic function for external interface

//logic function for interal

//data operate