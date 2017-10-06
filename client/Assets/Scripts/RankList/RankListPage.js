/*--------------------------------------------------
排行榜分页(2012/7/4 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast



class RankListPage
{
	private var mDataArray : Array = new Array();		// 数组
	private var mNumPerPage : int = 0;					// 每页几个
	private var mCurPageNum : int = 1;					// 当前页号
	private var mTotalPage : int = 1;					// 总页数
	private var mPageType : int = 1;					// 标签页类型:1.等级,2.装饰度,3.魅力值
	//--------------------------------------------------
	// 初始
	public function init(data_arr : ArrayList, num_per_page : int, type : int) : void
	{
		mDataArray.Clear();
		for (var data : ranking_data in data_arr)
		{
			mDataArray.Add(data);
		}
		mNumPerPage = num_per_page;
		mTotalPage = Page.getPageCountA(data_arr.Count, num_per_page);
		mPageType = type;
	}
	//--------------------------------------------------
	// 获取总页数
	public function getTotalPageNum() : int
	{
		return (0 == mTotalPage ? 1 : mTotalPage);
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
		if (mCurPageNum >= mTotalPage)
			return false;
		
		++mCurPageNum;
		return true;
	}
	//--------------------------------------------------
	// 获取标签页类型
	public function getPageType() : int
	{
		return mPageType;
	}
	//--------------------------------------------------
}



