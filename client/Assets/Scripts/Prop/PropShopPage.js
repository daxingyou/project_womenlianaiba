/*--------------------------------------------------
*** 道具标签页(2012/8/9 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast



class PropShopPage
{
	private var mDataArray : Array = null;		// 数组
	private var mNumPerPage : int = 0;			// 每页几个
	private var mTotalPageNum : int = 1;		// 总页数
	private var mCurPageNum : int = 1;			// 当前页号
	//--------------------------------------------------
	// 初始
	public function init(arr : Array, num : int) : void
	{
		mDataArray = arr;
		mNumPerPage = num;
		mTotalPageNum = Page.getPageCountA(arr.Count, num);
	}
	//--------------------------------------------------
	// 获取总页数
	public function getTotalPageNum() : int
	{
		if (0 == mTotalPageNum)
			return 1;
		
		return mTotalPageNum;
	}
	//--------------------------------------------------
	// 获取当前页号
	public function getCurPageNum() : int
	{
		return mCurPageNum;
	}
	//--------------------------------------------------
	// 获取当前页的内容
	public function getCurPage() : Array
	{
		return Page.getPageA(mDataArray, mNumPerPage, mCurPageNum);
	}
	//--------------------------------------------------
	// 第一页
	public function firstPage() : boolean
	{
		if (1 == mCurPageNum)
			return false;
		
		mCurPageNum = 1;
		return true;
	}
	//--------------------------------------------------
	// 前一页
	public function prePage() : boolean
	{
		if (mCurPageNum <= 1)
			return false;
		
		--mCurPageNum;
		return true;
	}
	//--------------------------------------------------
	// 后一页
	public function nextPage() : boolean
	{
		if (mCurPageNum >= mTotalPageNum)
			return false;
		
		++mCurPageNum;
		return true;
	}
	//--------------------------------------------------
}


