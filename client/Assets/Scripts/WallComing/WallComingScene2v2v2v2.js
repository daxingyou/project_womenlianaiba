#pragma strict
#pragma downcast

/*--------------------------------------------------
墙来了2v2v2v2的挂接脚本(2013/1/5 create by hezhr)
--------------------------------------------------*/
// 主区域可调参数
public var MainLeftPos : Vector3 = Vector3(999.3159, 998.2719, 986.9989);
public var MainRightPos : Vector3 = Vector3(1000.715, 998.2719, 986.9989);
public var MainWallBeginPos : Vector3 = Vector3(1000.642, 998.2719, 999.8748);
public var MainWallEndPos : float = 988.2022;
// 顶部区域可调参数
public var TopLeftPos : Vector3 = Vector3(1029.259, 1017.217, 993.901);
public var TopRightPos : Vector3 = Vector3(1030.479, 1017.217, 993.901);
public var TopWallBeginPos : Vector3 = Vector3(1030.171, 1017.787, 997.8925);
public var TopWallEndPos : float = 995.2195;
// 中部区域可调参数
public var CenterLeftPos : Vector3 = Vector3(1029.266, 997.2238, 993.901);
public var CenterRightPos : Vector3 = Vector3(1030.787, 997.2238, 993.901);
public var CenterWallBeginPos : Vector3 = Vector3(1030.171, 997.6166, 1000.555);
public var CenterWallEndPos : float = 994.7592;
// 底部区域可调参数
public var BottomLeftPos : Vector3 = Vector3(1029.136, 977.5424, 993.901);
public var BottomRightPos : Vector3 = Vector3(1030.784, 977.5424, 993.901);
public var BottomWallBeginPos : Vector3 = Vector3(1030.171, 977.9041, 1000.777);
public var BottomWallEndPos : float = 995.0018;
// 旋转,缩放,速度
public var Rotation : Vector3 = Vector3(0, 270, 0);
public var Scale : float = 1.3f;
public var WallLifeTime : float = 0.0f;
// 角色
private var mMainLeftAvatar : WallComingAvatar = null;
private var mMainRightAvatar : WallComingAvatar = null;
private var mTopLeftAvatar : WallComingAvatar = null;
private var mTopRightAvatar : WallComingAvatar = null;
private var mCenterLeftAvatar : WallComingAvatar = null;
private var mCenterRightAvatar : WallComingAvatar = null;
private var mBottomLeftAvatar : WallComingAvatar = null;
private var mBottomRightAvatar : WallComingAvatar = null;
// 墙体
private var mMainWall : WallComingWall = null;
private var mTopWall : WallComingWall = null;
private var mCenterWall : WallComingWall = null;
private var mBottomWall : WallComingWall = null;



//--------------------------------------------------
function Start()
{
	registerEvents();
	mMainLeftAvatar = new WallComingAvatar(ScenePlayerMgr.getMainPlayerData(), MainLeftPos, Rotation, Scale);
	mMainRightAvatar = new WallComingAvatar(ScenePlayerMgr.getMainPlayerData(), MainRightPos, Rotation, Scale);
	mTopLeftAvatar = new WallComingAvatar(ScenePlayerMgr.getMainPlayerData(), TopLeftPos, Rotation, Scale);
	mTopRightAvatar = new WallComingAvatar(ScenePlayerMgr.getMainPlayerData(), TopRightPos, Rotation, Scale);
	mCenterLeftAvatar = new WallComingAvatar(ScenePlayerMgr.getMainPlayerData(), CenterLeftPos, Rotation, Scale);
	mCenterRightAvatar = new WallComingAvatar(ScenePlayerMgr.getMainPlayerData(), CenterRightPos, Rotation, Scale);
	mBottomLeftAvatar = new WallComingAvatar(ScenePlayerMgr.getMainPlayerData(), BottomLeftPos, Rotation, Scale);
	mBottomRightAvatar = new WallComingAvatar(ScenePlayerMgr.getMainPlayerData(), BottomRightPos, Rotation, Scale);
	// 
	mMainWall = new WallComingWall("wall01.mod.u3d", MainWallBeginPos, MainWallEndPos, WallLifeTime);
	mTopWall = new WallComingWall("wall01.mod.u3d", TopWallBeginPos, TopWallEndPos, WallLifeTime);
	mCenterWall = new WallComingWall("wall02.mod.u3d", CenterWallBeginPos, CenterWallEndPos, WallLifeTime);
	mBottomWall = new WallComingWall("wall02.mod.u3d", BottomWallBeginPos, BottomWallEndPos, WallLifeTime);
}
//--------------------------------------------------
function OnDestroy()
{
	unregisterEvents();
	destroyAvatars();
	destroyWalls();
}
//--------------------------------------------------
private function registerEvents() : void
{
	WallComingLogic.Ctrl.Register("MATCH_ALL_OVER", matchAllOver);
	WallComingLogic.Ctrl.Register("WALL_DESTROY", wallDestroy);
}
//--------------------------------------------------
private function unregisterEvents() : void
{
	WallComingLogic.Ctrl.Unregister("MATCH_ALL_OVER", matchAllOver);
	WallComingLogic.Ctrl.Unregister("WALL_DESTROY", wallDestroy);
}
//--------------------------------------------------
public function destroyAvatars() : void
{
	if (mMainLeftAvatar) mMainLeftAvatar.destroy();
	if (mMainRightAvatar) mMainRightAvatar.destroy();
	if (mTopLeftAvatar) mTopLeftAvatar.destroy();
	if (mTopRightAvatar) mTopRightAvatar.destroy();
	if (mCenterLeftAvatar) mCenterLeftAvatar.destroy();
	if (mCenterRightAvatar) mCenterRightAvatar.destroy();
	if (mBottomLeftAvatar) mBottomLeftAvatar.destroy();
	if (mBottomRightAvatar) mBottomRightAvatar.destroy();
}
//--------------------------------------------------
public function destroyWalls() : void
{
	if (mMainWall) mMainWall.destroy();
	if (mTopWall) mTopWall.destroy();
	if (mCenterWall) mCenterWall.destroy();
	if (mBottomWall) mBottomWall.destroy();
}
//--------------------------------------------------
private function matchAllOver(param : System.Object) : void
{
	WallComingLogic.getInstance().playAvatarAni(mMainLeftAvatar, "action_1");
	WallComingLogic.getInstance().playAvatarAni(mMainRightAvatar, "action_2");
	WallComingLogic.getInstance().playAvatarAni(mTopLeftAvatar, "action_1");
	WallComingLogic.getInstance().playAvatarAni(mTopRightAvatar, "action_2");
	WallComingLogic.getInstance().playAvatarAni(mCenterLeftAvatar, "action_3");
	WallComingLogic.getInstance().playAvatarAni(mCenterRightAvatar, "action_4");
	WallComingLogic.getInstance().playAvatarAni(mBottomLeftAvatar, "action_3");
	WallComingLogic.getInstance().playAvatarAni(mBottomRightAvatar, "action_4");
}
//--------------------------------------------------
private function wallDestroy(param : System.Object) : void
{
	WallComingLogic.getInstance().playAvatarAni(mMainLeftAvatar, "stand");
	WallComingLogic.getInstance().playAvatarAni(mMainRightAvatar, "stand");
	WallComingLogic.getInstance().playAvatarAni(mTopLeftAvatar, "stand");
	WallComingLogic.getInstance().playAvatarAni(mTopRightAvatar, "stand");
	WallComingLogic.getInstance().playAvatarAni(mCenterLeftAvatar, "stand");
	WallComingLogic.getInstance().playAvatarAni(mCenterRightAvatar, "stand");
	WallComingLogic.getInstance().playAvatarAni(mBottomLeftAvatar, "stand");
	WallComingLogic.getInstance().playAvatarAni(mBottomRightAvatar, "stand");
}
//--------------------------------------------------


