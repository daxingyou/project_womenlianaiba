/*--------------------------------------------------
背包物品格子(2012/7/2 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast



class BackpackPage
{
	private var mDataArray : Array = new Array();		// 数组
	private var mTypeArray : Array = null;				// 类型数组
	private var mNumPerPage : int = 0;					// 每页几个
	private var mCurPageNum : int = 1;					// 当前页号
	//--------------------------------------------------
	// 初始
	public function init(ip : ItemPack, type_arr : Array, num_per_page : int) : void
	{
		mDataArray.Clear();
		//
		for (var type : int in type_arr)
		{
			for (var i:int=0; i<ip.count(); ++i)
			{
				var pg : PackGrid = ip.getPackGrid(i);
				if (type == pg._item._itemInfo.type)
				{
					mDataArray.Add(pg);
				}
			}
		}
		mTypeArray = type_arr;
		mNumPerPage = num_per_page;
	}
	//--------------------------------------------------
	// 是否空
	public function isEmpty() : boolean
	{
		return (0 == mDataArray.Count ? true : false);
	}
	//--------------------------------------------------
	// 是否归属
	public function isBelong(pg : PackGrid) : boolean
	{
		for (var type : int in mTypeArray)
		{
			if (type == pg._item._itemInfo.type)
			{
				return true;
			}
		}
		return false;
	}
	//--------------------------------------------------
	// 添加
	public function addPackGrid(pg : PackGrid) : void
	{
		if (false == isBelong(pg))
			return;
		
		mDataArray.Add(pg);
	}
	//--------------------------------------------------
	// 删除
	public function delPackGrid(pg : PackGrid) : void
	{
		if (false == isBelong(pg))
			return;
		
		var temp : PackGrid = null;
		for (var data : PackGrid in mDataArray)
		{
			if (data._item._instanceID == pg._item._instanceID)
			{
				temp = data;
				break;
			}
		}
		mDataArray.Remove(temp);
	}
	//--------------------------------------------------
	// 更新数量
	public function updatePackGrid(pg : PackGrid) : void
	{
		if (false == isBelong(pg))
			return;
		
		for (var data : PackGrid in mDataArray)
		{
			if (data._item._instanceID == pg._item._instanceID)
			{
				data._count = pg._count;
				return;
			}
		}
	}
	//--------------------------------------------------
	// 获取总页数
	public function getTotalPageNum() : int
	{
		var total_page : int = Page.getPageCountA(mDataArray.Count, mNumPerPage);
		return (0 == total_page ? 1 : total_page);
	}
	//--------------------------------------------------
	// 获取当前页号
	public function getCurPageNum() : int
	{
		var total_page : int = getTotalPageNum();
		if (mCurPageNum > total_page)
		{
			mCurPageNum = total_page;
		}
		return mCurPageNum;
	}
	//--------------------------------------------------
	// 获取当前页的内容
	public function getCurPage() : Array
	{
		return Page.getPageA(mDataArray, mNumPerPage, getCurPageNum());
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
		if (mCurPageNum >= getTotalPageNum())
			return false;
		
		++mCurPageNum;
		return true;
	}
	//--------------------------------------------------
}



