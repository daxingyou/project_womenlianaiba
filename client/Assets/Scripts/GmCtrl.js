#pragma strict

import System.Text.RegularExpressions;
/*
	GM指令脚本
	2012-05-23
	@huangdj
*/
static var gm_tag : String = "-c";
static var gm_addmoney_tag : String = "addmoney";
static var gm_additem_tag : String = "additem";
static var gm_broadcast : String = "broadcast";
static var gm_unbroadcast : String = "unbroadcast";
static var has_gm_addmoney_permission : boolean = false;
static var has_gm_additem_permission : boolean = false;
static var gm_enable = false;
static var gm_account : String = "";
static var params_separators : String[] = [','];

class GMCommand
{
	private var cmd : String;
	private var parameter : String;
	
	function parse(input:String)
	{
		var endPosOfCommand = input.IndexOf(' ');
		if(endPosOfCommand<0)
		{
			cmd = input.ToLower();
			parameter = String.Empty;
		}
		else
		{
			cmd = input.Substring(0, endPosOfCommand).ToLower();
			parameter = input.Substring(endPosOfCommand + 1);
		}		
	}
	
	function GetCommand()
	{
		return cmd;
	}
	
	function GetParameter()
	{
		return parameter;
	}
}

//--
function Awake(){

}
//--
function Start () {
	RegistEvt();
}
//--
function RegistEvt(){
	NetHelper.RegistHandler(new notify_gm_permission(), Handle_notify_gm_permission);
}
//--
function Handle_notify_gm_permission(evt : GameEvent, pack : notify_gm_permission){
	gm_account = pack.account;
	if(pack.enable == 0){
			gm_enable = false;
	}
	else{
			gm_enable = true;
	}
	if(pack.money == 0){
		has_gm_addmoney_permission = false;
	}
	else{
		has_gm_addmoney_permission = true;
	}
	if(pack.item == 0){
		has_gm_additem_permission = false;
	}
	else{
		has_gm_additem_permission = true;
	}
}
//--
static function CheckAddMoneyPermission() : boolean{
	return has_gm_addmoney_permission;
}
//--
static function CheckAddItemPermission() : boolean{
	return has_gm_additem_permission;
}

static function CheckGMEnable() : Boolean{
	return gm_enable;
}
//--
static function AnalysisCommand(input : String){
	if(!CheckGMEnable()){
		return;
	}

	input = input.Trim();
	if(String.IsNullOrEmpty(input) || input.Length < 3){
		return;
	}
	
	var cmd : String = input.Substring(3);
	Debug.Log(cmd);
	var gmCommand : GMCommand = new GMCommand();
	gmCommand.parse(cmd);
	var params_arr : String[];
	//转化成ArrayList
	var params : ArrayList;
	if(gmCommand.GetCommand().Equals(gm_addmoney_tag) && CheckAddMoneyPermission()){
		//提取参数列表
		var value : int = 0;
		var ValueRegex : Regex = new Regex("\\d+");
		var ValueMatch:Match = ValueRegex.Match(gmCommand.GetParameter());		
		if(ValueMatch.Success)
		{
			value = int.Parse(ValueMatch.Value);
		}
		params  = new ArrayList();	
		params.Add(value.ToString());
		ReqGmCommand(gmCommand.GetCommand(), params);
	}
	else if(gmCommand.GetCommand().Equals(gm_additem_tag) && CheckAddItemPermission()){
		//提取参数列表
		params_arr = gmCommand.GetParameter().Split(params_separators, StringSplitOptions.RemoveEmptyEntries);
		params  = new ArrayList(params_arr);	
		ReqGmCommand(gmCommand.GetCommand(), params);
	}
	else if(gmCommand.GetCommand().Equals(gm_broadcast)){
		//提取参数列表
		params  = new ArrayList();	
		params.Add(gmCommand.GetParameter());
		ReqGmCommand(gmCommand.GetCommand(), params);
	}
	else if(gmCommand.GetCommand().Equals(gm_unbroadcast)){
		params  = new ArrayList();	
		ReqGmCommand(gmCommand.GetCommand(), params);
	}
}
//--
static function ReqGmCommand(command : String, params : ArrayList){
	var req : req_gm_command = new req_gm_command();
	req.command = command;
	req.Params = params;
	NetHelper.Send(req);
}