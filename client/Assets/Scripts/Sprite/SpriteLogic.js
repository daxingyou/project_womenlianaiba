#pragma strict
#pragma downcast
import iGUI;



private var mSpriteModelArr : Hashtable = new Hashtable();
private var mSpriteGrids : Hashtable = new Hashtable();
private var mSpritePareObj : GameObject = null;
private var mClickObj : GameObject = null;	
private var mSrcColor : Color;
public var HightLight : Color = Color(0.4, 0.4 ,0.4, 0);
private var mTotalAppraise : int = 0;	// 总共的评论数
private var mSprites : Array = new Array();	// 精灵列表
private var mReqOpenSummonUI : boolean = false;
//--------------------------------------------------
private static var instance : SpriteLogic = null;
public static function getInstance() : SpriteLogic
{
	return instance;
}
//--------------------------------------------------
function Awake()
{
	instance = this;
	mSpritePareObj = new GameObject("Sprite");
}
//--------------------------------------------------
function Start()
{
	NetHelper.RegistHandler(new notify_sprite_data(), handle_notify_sprite_data);
	NetHelper.RegistHandler(new notify_del_sprite(), handle_notify_del_sprite);
	NetHelper.RegistHandler(new notify_sprite_upgrade(), handle_notify_sprite_upgrade);
	// 普通事件注册
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_MOUSE_IN_MODEL), mouseInSprite);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_MOUSE_OUT_MODEL), mouseOutSprite);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_ENTER_HOUSE_SCENE), enterHouseScene);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LEAVE_SCENE), leaveHouseScene);
}
//--------------------------------------------------
function Update()
{
	clickSprite();
}
//--------------------------------------------------
private function mouseInSprite(evt : GameEvent, obj : System.Object) : void
{
	var sp : SpriteModel = getSprite(obj as GameObject);
	if (null == sp)
		return;
	
	var render : Renderer = CommFunc.getRenderer(obj);
	if (render)
	{
		mSrcColor = render.material.color;
		render.material.color += HightLight;
	}
}
//--------------------------------------------------
private function mouseOutSprite(evt : GameEvent, obj : System.Object) : void
{
	var sp : SpriteModel = getSprite(obj as GameObject);
	if (null == sp)
		return;
	
	var render : Renderer = CommFunc.getRenderer(obj);
	if (render)
	{
		render.material.color = mSrcColor;
	}
}
//--------------------------------------------------
private function clickSprite()
{
	if (UI.getUI().IsMouseOverUI())
		return;
	
	if (Input.GetMouseButtonDown(0))
	{
		leftButtonDown();
	}
	if (Input.GetMouseButtonUp(0))
	{
		leftButtonUp();
	}
}
//--------------------------------------------------
private function leftButtonDown()
{
	mClickObj = PickMgr.getSingleton().getPickObject();
}
//--------------------------------------------------
private function leftButtonUp()
{
	if (mClickObj && mClickObj == PickMgr.getSingleton().getPickObject())
	{
		var sm : SpriteModel = getSprite(mClickObj);
		if (null == sm)
			return;
		
		sm.setCanClicked(false);
		request_click_sprite(sm.getId());
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_SPRITE));
	}
}
//--------------------------------------------------
private function createSprite(spr : sprite) : boolean
{
	if (mSpriteModelArr.ContainsKey(spr.id))
		return false;
	
	// 获取随机位置
	var ignore_grids : Array = new Array();
	for (var kv : DictionaryEntry in mSpriteGrids)
	{
		ignore_grids.Add(kv.Value as HouseSceneGrid);
	}
	var grid : HouseSceneGrid = HouseSceneGrid.getRandomGridInWalkAreaByFloor(ignore_grids, 1);
	if (null == grid)
		throw "SpriteLogic -> createSprite(String, float) -> can't find grid.";
	
	ignore_grids.Clear();
	var pos : Vector3 = grid.GetPosition(Space.World);
	var ly : int = CommFunc.CalcLayerIdx(grid.Creator.FloorNO, grid.Room);
	//
	var row : NormalSpriteRow = ResManager.LgtMgr.getNormalSpriteRow(spr.id);
	mSpriteModelArr.Add(row.id, new SpriteModel(row.id, row.model, row.show, row.dispear, row.halo, pos, spr.remain_time, mSpritePareObj, ly));
	mSpriteGrids.Add(row.id, grid);
	return true;
}
//--------------------------------------------------
public function destroySprite(id : int, direct : boolean) : void
{
	if (mSpriteModelArr.ContainsKey(id))
	{
		(mSpriteModelArr[id] as SpriteModel).destroy(direct);
		mSpriteModelArr.Remove(id);
	}
	if (mSpriteGrids.ContainsKey(id))
	{
		mSpriteGrids.Remove(id);
	}
}
//--------------------------------------------------
private function clearSprites() : void
{
	for (var kv : DictionaryEntry in mSpriteModelArr)
	{
		(kv.Value as SpriteModel).destroy(true);
	}
	mSpriteModelArr.Clear();
	mSpriteGrids.Clear();
	mSprites.Clear();
}
//--------------------------------------------------
private function getSprite(id : int) : SpriteModel
{
	if (mSpriteModelArr.ContainsKey(id))
		return mSpriteModelArr[id];
	
	return null;
}
//--------------------------------------------------
private function getSprite(obj : GameObject) : SpriteModel
{
	for (var kv : DictionaryEntry in mSpriteModelArr)
	{
		if ((kv.Value as SpriteModel).isEqual(obj))
			return kv.Value;
	}
	return null;
}
//--------------------------------------------------
public function isSprite(obj : GameObject) : boolean
{
	return null != getSprite(obj);
}
//--------------------------------------------------
// 获取总评论数
public function getTotalAppraise() : int
{
	return mTotalAppraise;
}
//--------------------------------------------------
// 获取精灵数据列表
public function getSprites() : Array
{
	return mSprites;
}
//--------------------------------------------------
// 请求获取精灵
public static function request_get_sprites() : void
{
	var req : req_get_sprites = new req_get_sprites();
	NetHelper.Send(req);
}
//--------------------------------------------------
// 请求点击精灵
public static function request_click_sprite(id : int) : void
{
	var req : req_click_sprite = new req_click_sprite();
	req.id = id;
	NetHelper.Send(req);
}
//--------------------------------------------------
// 处理通知精灵数据
private function handle_notify_sprite_data(evt:GameEvent, pack:notify_sprite_data):void
{
	if (false == DataCenter.isInSelfHouse())
		return;
	
	mTotalAppraise = pack.appraise;
	mSprites.Clear();
	var summonSprite : sprite = null;
	var summonRow : NormalSpriteRow = null;
	var maxAppraiseSprite : sprite = null;
	var maxAppraiseRow : NormalSpriteRow = null;
	var existSprite : boolean = false;
	for (var spr : sprite in pack.sprites)
	{
		// 添加到精灵列表
		mSprites.Add(spr);
		// 该精灵没被召唤
		if (0 == spr.remain_time)	
		{
			destroySprite(spr.id, true);
		}
		else	// 召唤精灵
		{
			if (createSprite(spr))
			{
				existSprite = true;
			}
		}
		// 获取正在召唤的精灵
		var row : NormalSpriteRow = ResManager.LgtMgr.getNormalSpriteRow(spr.id);
		if (row.appraise > pack.appraise)	// 该精灵所需评价数大于当前总评价数
		{
			// 取得所有符合条件中所需评价数最少的那个
			if (null == summonSprite || row.appraise < summonRow.appraise)
			{
				summonSprite = spr;
				summonRow = row;
			}
		}
		// 获取所需评价数最多的精灵
		if (null == maxAppraiseRow || row.appraise > maxAppraiseRow.appraise)
		{
			maxAppraiseSprite = spr;
			maxAppraiseRow = row;
		}
	}
	// 打开召唤界面时主动请求小精灵
	if (mReqOpenSummonUI)
	{
		mReqOpenSummonUI = false;
		openSummonUI(0);
		return;
	}
	// 召唤出精灵,打开提示界面
	if (existSprite)
	{
		openSummonUI(1);
	}
	showSummonPanel(null == summonSprite ? maxAppraiseSprite : summonSprite);
}
//--------------------------------------------------
// 处理通知处理删除精灵
private function handle_notify_del_sprite(evt:GameEvent, pack:notify_del_sprite):void
{
	// 1--删除, 0--不用删除
	if (1 == pack.del)
	{
		destroySprite(pack.id, false);
	}
	else
	{
		var sm : SpriteModel = getSprite(pack.id);
		if (sm)	// 没删除成功,重新设置为可点击
		{
			sm.setCanClicked(true);
		}
	}
}
//--------------------------------------------------
// 处理通知小精灵升级
private function handle_notify_sprite_upgrade(evt:GameEvent, pack:notify_sprite_upgrade):void
{
	openSummonUI(2);
}
//--------------------------------------------------
// 进入房屋场景
private function enterHouseScene(evt:GameEvent, obj:System.Object) : void
{
	if (false == DataCenter.isInSelfHouse())
		return;
	
	request_get_sprites();
}
//--------------------------------------------------
// 离开房屋场景
private function leaveHouseScene(evt:GameEvent, obj:System.Object) : void
{
	clearSprites();
	var gui : iGUICode_MainUI = iGUICode_MainUI.getInstance();
	if (null == gui)
		return;
	
	gui.SummonPanel.setEnabled(false);
}
//--------------------------------------------------
// 主界面显示召唤面板
private function showSummonPanel(spr : sprite) : void
{
	var row : NormalSpriteRow = ResManager.LgtMgr.getNormalSpriteRow(spr.id);
	var info : String[] = getSpriteInfo(spr.id);
	// 
	var gui : iGUICode_MainUI = iGUICode_MainUI.getInstance();
	if (null == gui)
		return;
	
	gui.SummonPanel.setEnabled(true);
	gui.SPSpriteName.label.text = info[1];
	gui.SPSpriteIcon.image = Resources.Load(info[0]);
	gui.SPSpriteIcon.clickCallback = CallbackClick_spriteIcon;
	setProgress(gui.SPProgress, gui.SPProgressLabel, mTotalAppraise, row.appraise);
}
//--------------------------------------------------
private function CallbackClick_spriteIcon(caller : iGUIElement) : void
{
	mReqOpenSummonUI = true;
	request_get_sprites();
}
//--------------------------------------------------
public static function openSummonUI(frameFlag : int) : void
{
	// 0:召唤主界面,1:有精灵召唤时弹出的界面,2:小精灵升级时弹出的界面
	iGUICode_SummonUI.frameFlag = frameFlag;
	UI.getUI().OpenUIRoot("SummonUI");
	UI.getUI().SetModal("SummonUI", true);
}
//--------------------------------------------------
// 设置进度条
public static function setProgress(progress : iGUILabel, label : iGUILabel, cur : float, total : float) : void
{
	// 进度条最大宽度为73
	var maxWidth : float = 73;
	var minWidth : float = 5;
	var width : float = (maxWidth*cur)/total;
	if (width > 0 && width < minWidth)
	{
		width = minWidth;
	}
	width = width > maxWidth ? maxWidth : width;
	progress.setWidth(width);
	progress.setEnabled(0 != width);
	cur = cur > total ? total : cur;
	label.label.text = cur.ToString() + "/" + total.ToString();
}
//--------------------------------------------------
// 获取精灵图片资源和名字
public static function getSpriteInfo(id : int) : String[]
{
	var dir : String = "UISkins/Textures/Summon/";
	if (1 == id) return [dir + "sum_tt", "甜甜"];
	if (2 == id) return [dir + "sum_mm", "蜜蜜"];
	if (3 == id) return [dir + "sum_toto", "同同"];
	if (4 == id) return [dir + "sum_hh", "欢欢"];
	// 5 == id
	return [dir + "sum_ll", "乐乐"];
}
//--------------------------------------------------


