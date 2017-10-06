#pragma strict
#pragma downcast

/*
//platform data center
//creat by fullzhu 2012.9.17
//last edit at 2012.9.17 by fullzhu
*/

class PlatData {
	public var account : String;
	public var url : String;
	public var name : String;
	public var bVip : boolean;
	public var bYearVip : boolean;
	public var vipLevel : int;
}

class PlatInfo {
	public var data : PlatData;
	public var headIcon : Texture;
	
	public var callback : Function;
}

class PlatInfoList {
	public var dataList : ArrayList;		//struct PlatData
	
	public var callback : Function;
}


class PlatformData {
	private var mInfo : Hashtable = new Hashtable();				//key : account struct : PlatInfo
	
	function PlatformData() {
	}
	
	public function Clear() {
	}
	
	public function Add() {
	}
	
	public function Remove() {
	}
	
	public function IsExsit() {
	}
	
	public function GetInfo(account : String) {
	}
}