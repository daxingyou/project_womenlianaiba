#pragma strict

public static var MUSIC_DIR:String = "Music/";

class MusicMgr
{
	public var BgMusic : AudioSource = new AudioSource();
	public var SpriteAudio : AudioSource = new AudioSource();
	private var MusicTable : Hashtable;
	private var currMusic : AudioSource;
	private var status : int;
	
	function MusicMgr()
	{
		MusicTable = new Hashtable();
		MusicTable.Add("main", "Music/love_home.mp3.u3d");
		MusicTable.Add("flower", "Music/love_tree.mp3.u3d");
		MusicTable.Add("sprite", "Music/sprite.mp3.u3d");
		
		EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_HOUSE_CREATED), HandleNotifyEnterHouse);
		EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_COMMON_SCENE), HandleEnterCommonScene);
		EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.CLICK_SPRITE), HandleClickSprite);
	}
	
	function Init(house : int) {
		var phr:PlayerHouseRow = ResManager.LgtMgr.PlayerHouseTable[house] as PlayerHouseRow;
		if(phr != null && phr.bg_music != "") {
			var houseMusic : String = MUSIC_DIR + phr.bg_music;
			MusicTable["main"] = houseMusic;
		}
	}
	
	//hanlde game event
	function HandleNotifyEnterHouse(evt:GameEvent, obj:house_info) {
		if(!obj) return ;
		
		Init(obj.template_id);
		
		var plrSetMgr : PlayerSettingMgr = Camera.main.GetComponent("PlayerSettingMgr") as PlayerSettingMgr;
		if(plrSetMgr.IsMusicOn()) {
			Play("main");
		}
	}
	
	function HandleEnterCommonScene(evt:GameEvent, obj:System.Object) {
		var commonId : int = DataCenter.GetPlayerPubSceneID();
		var row : CommSceneRow = ResManager.LgtMgr.getCommonSceneRow(commonId);
		if(row != null && row.bg_music != "") {
			MusicTable["main"] = MUSIC_DIR + row.bg_music;
		}
		
		var plrSetMgr : PlayerSettingMgr = Camera.main.GetComponent("PlayerSettingMgr") as PlayerSettingMgr;
		if(plrSetMgr.IsMusicOn()) {
			Play("main");
		}
	}
	
	function HandleClickSprite(evt:GameEvent, obj:System.Object) {
		PlaySprite();
	}
	
	function SetStatus(type:int)
	{
		status = type;
	}
	
	function Play(type : String)
	{
		if(status == audio_status_type.ast_open)
		{
			Stop();
			if(MusicTable.ContainsKey(type))
			{
				type = MusicTable[type];
			}
			Global.GetAsynResMgr().asynLoad(type, OnLoadMusicFinished);
		}
	}
	
	function PlaySprite() {
		Global.GetAsynResMgr().asynLoad(MusicTable["sprite"].ToString(), OnLoadSpriteAudioFinished);
	}
	
	function Stop()
	{
		if(currMusic != null)
			currMusic.Stop();
	}
	
	function OnLoadMusicFinished(loader:IURLLoader, deleCount:int):void {
		var clip : AudioClip = loader.getWWW().assetBundle.mainAsset as AudioClip;
		BgMusic.clip = clip;
		currMusic = BgMusic;
		currMusic.Play();
	}
	
	function OnLoadSpriteAudioFinished(loader:IURLLoader, deleCount:int) {
		var clip : AudioClip = loader.getWWW().assetBundle.mainAsset as AudioClip;
		SpriteAudio.clip = clip;
		SpriteAudio.Play();
	}
}



class AudioModule {
	private var mAudioObj : GameObject = null;
	private var mAudio : AudioSource = null;
	
	public function AudioModule(audioObj : GameObject, audioRes : String, loop : boolean) {
		mAudioObj = GameObject.Instantiate(audioObj);
		mAudio = mAudioObj.GetComponent(AudioSource);
		if (null == mAudio) {
			throw "AudioModule -> audioObj isn't exist AudioSource component.";
		}
		mAudio.loop = loop;
		Global.GetAsynResMgr().asynLoad(audioRes, onLoadAudioFinished);
	}
	
	private function onLoadAudioFinished(loader : IURLLoader, deleCount : int) : void {
		if (null == mAudioObj) {
			return;
		}
		mAudio.clip = loader.getWWW().assetBundle.mainAsset as AudioClip;
		mAudio.Play();
	}
	
	public function destroy() : void {
		GameObject.Destroy(mAudioObj);
	}
}