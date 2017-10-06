/*--------------------------------------------------
数据获取中心,用来做数据中转(2011/12/19 create by hezhr)
--------------------------------------------------*/
#pragma strict



//--------------------------------------------------
static function getHouseID(account:String):UInt64
{
	return PlayerFriend.GetInstance().GetFriendHouseID(account);
}
//--------------------------------------------------
static function getCurHouseID():UInt64
{
	return EQGameSceneMgr.getSingleton().GetSceneHouseID();
}
//--------------------------------------------------
static function getCurPlayerName():String
{
	return getPlayerName(ScenePlayerMgr.getMainPlayerAccount());
}
//--------------------------------------------------
static function getPlayerName(account:String):String
{
	return PlayerFriend.GetInstance().GetFriendName(account);
}
//--------------------------------------------------
static function getPlayerImage(account:String):Texture
{
	return PlayerFriend.GetInstance().GetFriendImage(account);
}
//--------------------------------------------------
static function getSelfHouseID():UInt64
{
	return PlayerFriend.GetInstance().GetFriendHouseID( ScenePlayerMgr.getMainPlayerAccount() );
}
//--------------------------------------------------
static function getSelfHouseData():house_info
{
	return ScenePlayerMgr.getMainPlayerHouseData();
}
//--------------------------------------------------
static function isInSelfHouse():boolean
{
	return getSelfHouseID() == getCurHouseID();
}
//--------------------------------------------------
static function isHostSingle():boolean
{
	return PlayerFriend.GetInstance().IsSingle();
}
//--------------------------------------------------
static function isMainPlayerSingle():boolean
{
	return ScenePlayerMgr.isMainPlayerSingle();
}
//--------------------------------------------------
static function getMaleHostAccount():String
{
	return PlayerFriend.GetInstance().GetHostAccount();
}
//--------------------------------------------------
static function getFemaleHostAccount():String
{
	return PlayerFriend.GetInstance().GetHostLoverAccount();
}
//--------------------------------------------------
static function getMainPlayerAccount():String
{
	return ScenePlayerMgr.getMainPlayerAccount();
}
//--------------------------------------------------
static function getMainPlayerCurLv():int
{
	return LvExpMgr.GetInstance().GetCurLevel();
}
//--------------------------------------------------
static function getMainPlayerCurPhyPower():int{
	return PhyPowerMgr.getInstance().GetCurPhyPowerVal();
}
//--------------------------------------------------
static function isPlayerInHouse():boolean
{
	return  SceneType.PLAYER_HOUSE == EQGameSceneMgr.getSingleton().gameSceneType();
}
//--------------------------------------------------
static function isPlayerInCommonScene():boolean
{
	return  SceneType.COMM_SCENE == EQGameSceneMgr.getSingleton().gameSceneType();
}
//--------------------------------------------------
static function isPlayerInPubScene():boolean
{
	return  SceneType.PUB_SCENE == EQGameSceneMgr.getSingleton().gameSceneType();
}
//
static function GetPlayerPubSceneID() : int {
	return EQGameSceneMgr.getSingleton().GetCommonSceneID();
}
//--------------------------------------------------
static function getCostByPlatform(cost : int) : int
{
	if (PlatformMgr.IsPlatQZone() || PlatformMgr.IsPlatPY() || PlatformMgr.IsPlatQTwiter())		// qzone,朋友网,微博
		return cost;
	else if (PlatformMgr.IsPlatYY())	// YY
		return cost;
	
	return cost;
}
//--------------------------------------------------


//edit by fullzhu 2012.9.14
//for platform adjust

//--------------------------------------------------
static function getPlayerBasicInfo(account : String, func : Function) : int
{
	var platResMgr : PlatformResMgr = ResManager.platformResMgr;
	var idArray : Array = new Array();
	idArray.Add(account);
	return platResMgr.GetUserInfo(func, idArray);
}
//--------------------------------------------------
static function cancelGetPlayerBasicInfo(token : int) : void
{
	ResManager.platformResMgr.SetCancelToken(token);
}
//--------------------------------------------------
static function GetPlayerDiamond() : int
{
	return DiamondLogic.GetInstance().GetPlayerDiamond();
}
//--------------------------------------------------
static function GetPlayerCredit() : int
{
	return CreditLogic.GetInstance().GetPlayerCredit();
}
//--------------------------------------------------


