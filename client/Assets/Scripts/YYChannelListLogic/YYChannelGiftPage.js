#pragma strict
#pragma downcast
import iGUI;


class YYChannelGiftPage
{
	private var NUM : int = 6;							// 每页个数
	private var mHotGifts : Page = new Page();			// 热门
	private var mNormalGifts : Page = new Page();		// 普通,1
	private var mAdvancedGifts : Page = new Page();		// 高级,2
	private var mLuxuryGifts : Page = new Page();		// 豪华,3
	private var mPropGifts : Page = new Page();			// 道具,4
	private var mCurTab : Page = null;					// 当前标签页
	private var mCurPage : Array = null;				// 当前页内容
	private var mCurSelectCount : int = 1;				// 当前选中的礼物数量
	private var mCurSelectGift : int = 0;				// 当前选中的礼物id
	private var mCurSelectIndex : int = 0;				// 当前选中的礼物选项索引
	//--------------------------------------------------
	public function init() : void
	{
		mHotGifts.reset(getHotsGifts(), NUM, 0);
		mNormalGifts.reset(getGiftsByType(1), NUM, 0);
		mAdvancedGifts.reset(getGiftsByType(2), NUM, 0);
		mLuxuryGifts.reset(getGiftsByType(3), NUM, 0);
		mPropGifts.reset(getGiftsByType(4), NUM, 0);
	}
	//--------------------------------------------------
	private function getGiftsByType(type : int) : Array
	{
		var gifts : Array = new Array();
		for (var row : YYGiftRow in ResManager.LgtMgr.getYYGiftTable())
		{
			if (type == row.type)
				gifts.Add(row);
		}
		return gifts;
	}
	//--------------------------------------------------
	private function getHotsGifts() : Array
	{
		var gifts : Array = new Array();
		for (var row : YYGiftRow in ResManager.LgtMgr.getYYGiftTable())
		{
			if (row.hot)
				gifts.Add(row);
		}
		return gifts;
	}
	//--------------------------------------------------
	private function initSelectGift() : void
	{
		mCurSelectIndex = 0 == mCurPage.Count ? -1 : 0;
		mCurSelectGift = 0 == mCurPage.Count ? 0 : (mCurPage[0] as YYGiftRow).id;
	}
	//--------------------------------------------------
	public function changeTab(type : int) : void
	{
		if (1 == type)
			mCurTab = mNormalGifts;
		else if (2 == type)
			mCurTab = mAdvancedGifts;
		else if (3 == type)
			mCurTab = mLuxuryGifts;
		else if (4 == type)
			mCurTab = mPropGifts;
		else	// 0 == type
			mCurTab = mHotGifts;
		
		mCurPage = mCurTab.moveFirstPage();
		initSelectGift();
	}
	//--------------------------------------------------
	public function canMoveLeft() : boolean
	{
		if (mCurTab.canPreMove())
		{
			mCurPage = mCurTab.movePrePage();
			initSelectGift();
			return true;
		}
		return false;
	}
	//--------------------------------------------------
	public function canMoveRight() : boolean
	{
		if (mCurTab.canNextMove())
		{
			mCurPage = mCurTab.moveNextPage();
			initSelectGift();
			return true;
		}
		return false;
	}
	//--------------------------------------------------
	public function getCurPage() : Array
	{
		return mCurPage;
	}
	//--------------------------------------------------
	public function setSelectGift(giftId : int, index : int) : void
	{
		mCurSelectGift = giftId;
		mCurSelectIndex = index;
	}
	//--------------------------------------------------
	public function isGiftSelected(index : int) : boolean
	{
		return index == mCurSelectIndex;
	}
	//--------------------------------------------------
	public function setSelectCount(index : int) : void
	{
		var count : int = 1;
		switch (index)
		{
		case 0: count = 1; break;
		case 1: count = 11; break;
		case 2: count = 50; break;
		case 3: count = 88; break;
		case 4: count = 101; break;
		}
		mCurSelectCount = count;
	}
	//--------------------------------------------------
	public function sendGift(account : String) : void
	{
		if ("" == account || null == account)
		{
			Global.GetSysMsgHandler().ShowSysMsg(530);
			return;
		}
		if (0 == mCurSelectGift)
			return;
		
		YYChannelListLogic.getInstance().reqSendYYGift(account, mCurSelectGift, mCurSelectCount);
	}
	//--------------------------------------------------
}


