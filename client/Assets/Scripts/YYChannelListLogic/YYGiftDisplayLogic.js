#pragma strict
#pragma downcast
import iGUI;


public var MaxGift2DCount : int = 10;					// 2d礼物最多显示个数
public var MaxGift3DCount : int = 10;					// 3d礼物最多显示个数
public var Gift3DStartPos : Vector3;					// 3d礼物在界面上的随机开始位置
public var Gift3DEndPos : Vector3;						// 3d礼物在界面上的随机结束位置
private var mCurGift2DCount : int = 0;
private var mGift2DTempArray : Array = new Array();
private var mCurGift3DCount : int = 0;
private var mGift3DTempArray : Array = new Array();
private var mRoot : iGUIRoot = null;
private var mGift3DPareObj : GameObject = null;
//--------------------------------------------------
private static var instance : YYGiftDisplayLogic = null;
function Awake()
{
	instance = this;
}
//--------------------------------------------------
function Start()
{
	iGUIAnimation.AniCtrl.Register("DESTROY_ANIMATION", destroyGift2D);
	YYGift3D.Gift3DCtrl.Register("DESTROY_3D_GIFT", destroyGift3D);
}
//--------------------------------------------------
public static function getInstance() : YYGiftDisplayLogic
{
	return instance;
}
//--------------------------------------------------
public function init(root : iGUIRoot) : void
{
	mRoot = root;
	if (null == mGift3DPareObj)
	{
		mGift3DPareObj = new GameObject("3DGift");
	}
}
//--------------------------------------------------
public function displayGift(id : int, count : int) : void
{
	var row : YYGiftRow = ResManager.LgtMgr.getYYGiftRow(id);
	var displayRow : YYGiftDisplayRow = ResManager.LgtMgr.getYYGiftDisplayRow(row.display_id, count);
	if (1 == row.display_type || 2 == row.display_type)
	{
		display2D(displayRow);
	}
	else	// 3 == row.display_type
	{
		display3D(displayRow);
	}
}
//--------------------------------------------------
public function clearGift2D() : void
{
	mGift2DTempArray.Clear();
	mCurGift2DCount = 0;
	mRoot = null;
	GameObject.Destroy(mGift3DPareObj);
}
//--------------------------------------------------
public function clearGift3D() : void
{
	mGift3DTempArray.Clear();
	mCurGift3DCount = 0;
	GameObject.Destroy(mGift3DPareObj);
}
//--------------------------------------------------
private function display2D(row : YYGiftDisplayRow) : void
{
	if (null == mRoot)
		return;
	
	if (mCurGift2DCount >= MaxGift2DCount)
	{
		mGift2DTempArray.Add(row);
	}
	else
	{
		YYGift2D.createYYGift2D(mRoot, row);
		++mCurGift2DCount;
	}
}
//--------------------------------------------------
private function destroyGift2D(param : String) : void
{
	if (null == mRoot || "yygift2d" != param)
		return;
	
	if (mGift2DTempArray.Count > 0)
	{
		YYGift2D.createYYGift2D(mRoot, mGift2DTempArray[0]);
		mGift2DTempArray.RemoveAt(0);
	}
	else
	{
		--mCurGift2DCount;
	}
}
//--------------------------------------------------
private function display3D(row : YYGiftDisplayRow) : void
{
	if (null == mRoot)
		return;
	
	if (mCurGift3DCount >= MaxGift3DCount)
	{
		mGift3DTempArray.Add(row);
	}
	else
	{
		if ("VoiceChannelUI" == mRoot.gameObject.name)
		{
			row.start_pos = Gift3DStartPos;
			row.end_pos = Gift3DEndPos;
		}
		YYGift3D.createYYGift3D(row, mGift3DPareObj);
		++mCurGift3DCount;
	}
}
//--------------------------------------------------
private function destroyGift3D(param : String) : void
{
	if (null == mRoot)
		return;
	
	if (mGift3DTempArray.Count > 0)
	{
		var row : YYGiftDisplayRow = mGift3DTempArray[0];
		mGift3DTempArray.RemoveAt(0);
		if ("VoiceChannelUI" == mRoot.gameObject.name)
		{
			row.start_pos = Gift3DStartPos;
			row.end_pos = Gift3DEndPos;
		}
		YYGift3D.createYYGift3D(row, mGift3DPareObj);
	}
	else
	{
		--mCurGift3DCount;
	}
}
//--------------------------------------------------


