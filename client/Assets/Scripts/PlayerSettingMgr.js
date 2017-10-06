#pragma strict

public var musicMgr : MusicMgr = new MusicMgr();
private var mBMusicOn : boolean = false;
// 根据名称获取设定的值
function getSetting(type : String, pack:notify_player_setting) : int
{
	var playerSetting : player_setting = pack.setting;
	var infoList : ArrayList = playerSetting.info;
	for(var i = 0; i < infoList.Count; i++)
	{
		var settingInfo : setting_info = infoList[i] as setting_info;
		if(settingInfo.name == type)
			return settingInfo.value;
	}
	
	return -1;
}

function setSetting(name:String, value:int)
{
	var packet:req_player_setting = new req_player_setting();
	var settingInfo : setting_info = new setting_info();
	settingInfo.name = name;
	settingInfo.value = value;
	packet.setting = settingInfo;
	NetHelper.Send(packet);
}

function setMusicStatus(type:int)
{
	musicMgr.SetStatus(type);
}

function playMusic(type:String)
{
	musicMgr.Play(type);
}

function stopMusic()
{
	musicMgr.Stop();
}

function SetMusicCtrl(open : boolean) : void {
	mBMusicOn = open;
}

function IsMusicOn() : boolean {
	return mBMusicOn;
}

//	function setMusic(value : int)
//	{
//		if(value == audio_status_type.ast_open)
//			BgMusic.Play();
//		else
//			BgMusic.Stop();
//	}
