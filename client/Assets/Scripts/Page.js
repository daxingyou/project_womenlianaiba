#pragma strict

/*--------------------------------------------------
专门用来管理页相关(2011/11/8 create by hezhr)
--------------------------------------------------*/
class Page
{
	enum MoveType	// 移动类型
	{
		MT_NONE = 0,		// 无
		MT_PRE_ONE,			// 向前移动一个
		MT_NEXT_ONE,		// 向后移动一个
		MT_PRE_PAGE,		// 向前移动一页
		MT_NEXT_PAGE,		// 向后移动一页
		MT_FIRST_PAGE,		// 移动到第一页
		MT_LAST_PAGE,		// 移动到最后页
	}
	//--------------------------------------------------
	private var m_data:Array = null;						// 数据表
	private var m_numPerPage:int = 0;						// 每页显示几条
	private var m_beginIndex:int = 0;						// 开始索引
	//--------------------------------------------------
	// 设置页相关:num,数据内容;num,每页显示几条;begin_index,页的开始索引值,[0, data.Count]
	public function reset(data:Array, num:int, begin_index:int):Array
	{
		m_data = null;
		m_numPerPage = 0;
		if (null==data || num<=1)
		{
			throw new Exception("Error: Page -> reset(Array, int, int) -> parameter is wrong!");
		}
		m_data = data;
		m_numPerPage = num;
		m_beginIndex = begin_index;
		return checkMove(MoveType.MT_NONE);
	}
	//--------------------------------------------------
	// 获取索引值
	public function getBeginIndex():int
	{
		return m_beginIndex;
	}
	//--------------------------------------------------
	// 是否可以前移
	public function canPreMove():boolean
	{
		if (null==m_data || 0==m_data.Count || 0==m_beginIndex)
			return false;
		
		return true;
	}
	//--------------------------------------------------
	// 是否可以后移
	public function canNextMove():boolean
	{
		if (null==m_data || 0==m_data.Count || m_data.Count==m_numPerPage || m_beginIndex>m_data.Count-m_numPerPage)
			return false;
		
		return true;
	}
	//--------------------------------------------------
	// 向前移一个
	public function movePreOne():Array
	{
		return checkMove(MoveType.MT_PRE_ONE);
	}
	//--------------------------------------------------
	// 向后移一个
	public function moveNextOne():Array
	{
		return checkMove(MoveType.MT_NEXT_ONE);
	}
	//--------------------------------------------------
	// 向前移一页
	public function movePrePage():Array
	{
		return checkMove(MoveType.MT_PRE_PAGE);
	}
	//--------------------------------------------------
	// 向后移一页
	public function moveNextPage():Array
	{
		return checkMove(MoveType.MT_NEXT_PAGE);
	}
	//--------------------------------------------------
	// 移动到第一页
	public function moveFirstPage():Array
	{
		return checkMove(MoveType.MT_FIRST_PAGE);
	}
	//--------------------------------------------------
	// 移动到最后页
	public function moveLastPage():Array
	{
		return checkMove(MoveType.MT_LAST_PAGE);
	}
	//--------------------------------------------------
	// 检查移动
	private function checkMove(move_type:MoveType):Array
	{
		if (null==m_data || 0==m_data.Count)	// 数据为空
		{
			return new Array();
		}
		if (m_data.Count < m_numPerPage)	// 数据不足一页
		{
			m_beginIndex = 0;
			return getPageC(m_data, m_numPerPage, m_beginIndex);
		}
		if (m_beginIndex > m_data.Count - m_numPerPage)	// 开始索引>最后页的开始索引
		{
			m_beginIndex = m_data.Count - m_numPerPage;
			return getPageC(m_data, m_numPerPage, m_beginIndex);
		}
		////////
		switch (move_type)
		{
		case MoveType.MT_PRE_ONE:		// 向前移动一个
			if (0 != m_beginIndex)
			{
				--m_beginIndex;
			}
			break;
		case MoveType.MT_NEXT_ONE:		// 向后移动一个
			if (m_data.Count != m_beginIndex + m_numPerPage)
			{
				++m_beginIndex;
			}
			break;
		case MoveType.MT_PRE_PAGE:		// 向前移动一页(这里前一页的最后个是后一页的第一个)
			if (m_beginIndex - m_numPerPage > 0)
			{
				m_beginIndex -= m_numPerPage - 1;
			}
			else
			{
				m_beginIndex = 0;
			}
			break;
		case MoveType.MT_NEXT_PAGE:		// 向后移动一页(这里前一页的最后个是后一页的第一个)
			if (m_beginIndex + 2*m_numPerPage < m_data.Count)
			{
				m_beginIndex += m_numPerPage - 1;
			}
			else
			{
				m_beginIndex = m_data.Count - m_numPerPage;
			}
			break;
		case MoveType.MT_FIRST_PAGE:	// 移动到第一页
			m_beginIndex = 0;
			break;
		case MoveType.MT_LAST_PAGE:		// 移动到最一页
			m_beginIndex = m_data.Count - m_numPerPage;
			break;
		}
		return getPageC(m_data, m_numPerPage, m_beginIndex);
	}
	//--------------------------------------------------
	
	
	/***************************************************
	*** 以下为核心函数
	***************************************************/
	
	//--------------------------------------------------
	// 说  明:获取总页数,比如:[1,2,3],[4,5,6],[7,8,9] = 3页
	// 参  数:total_count,数据量;num_per_page,每页的个数
	public static function getPageCountA(total_count:int, num_per_page:int):int
	{
		if (total_count<=0 || num_per_page<=0)
		{
			return 0;
		}
		var div : int = total_count / num_per_page;
		var rem : int = total_count % num_per_page;
		if (0 == rem)
		{
			return div;
		}
		return div + 1;
	}
	//--------------------------------------------------
	// 说  明:获取指定页数据,比如:[1,2,3],[4,5,6],[7,8,9],第2页=[4,5,6]
	// 参  数:data,数据;num_per_page,每页的个数;cur_page,第几页,从1开始
	public static function getPageA(data:Array, num_per_page:int, cur_page:int):Array
	{
		var temp:Array = new Array();
		var page_count:int = getPageCountA(data.Count, num_per_page);
		if (0==page_count || cur_page<=0 || cur_page>page_count)
		{
			return temp;
		}
		var begin_index:int = num_per_page * (cur_page - 1);	// 开始索引号
		if (data.Count < num_per_page)	// 不足一页
		{
			begin_index = 0;
		}
		var end_index:int = begin_index + num_per_page;			// 结束索引号
		if (end_index > data.Count)		// 结束索引号 > 总个数
		{
			end_index = data.Count;
		}
		for (var i:int=begin_index; i<end_index; ++i)
		{
			temp.Add(data[i]);
		}
		return temp;
	}
	//--------------------------------------------------
	// 说  明:获取总页数,比如:[1,2,3],[3,4,5],[5,6,7] = 3页
	// 参  数:total_count,数据量;num_per_page,每页的个数
	public static function getPageCountB(total_count:int, num_per_page:int):int
	{
		if (total_count<=0 || num_per_page<=0)
		{
			return 0;
		}
		
		var div : int = total_count / (num_per_page - 1);
		var rem : int = total_count % (num_per_page - 1);
		
		if (1 >= rem)
		{
			return div;
		}
		return div + 1;
	}
	//--------------------------------------------------
	// 说  明:获取指定页数据,比如:[1,2,3],[3,4,5],[5,6,7],第2页=[3,4,5]
	// 参  数:data,数据;num_per_page,每页的个数;cur_page,第几页,从1开始
	public static function getPageB(data:Array, num_per_page:int, cur_page:int):Array
	{
		var temp:Array = new Array();
		var page_count:int = getPageCountB(data.Count, num_per_page);
		if (0==page_count || cur_page<=0 || cur_page>page_count)
		{
			return temp;
		}
		var begin_index:int = (num_per_page - 1) * (cur_page - 1);	// 开始索引号
		if (data.Count < num_per_page)	// 不足一页
		{
			begin_index = 0;
		}
		var end_index:int = begin_index + num_per_page;				// 结束索引号
		if (end_index > data.Count)		// 结束索引号 > 总个数
		{
			end_index = data.Count;
		}
		for (var i:int=begin_index; i<end_index; ++i)
		{
			temp.Add(data[i]);
		}
		return temp;
	}
	//--------------------------------------------------
	// 说  明:获取指定数据(数据范围从begin_index -> begin_index + num_per_page)
	// 参  数:data,数据;num_per_page,每页的个数;begin_index,data里面的下标位置
	public static function getPageC(data:Array, num_per_page:int, begin_index:int):Array
	{
		var temp:Array = new Array();
		if (null==data || 0==data.Count || begin_index<0 || begin_index>=data.Count)
		{
			return temp;
		}
		if (data.Count < num_per_page)	// 不足一页
		{
			begin_index = 0;
		}
		var end_index:int = begin_index + num_per_page;	// 结束索引号
		if (end_index > data.Count)		// 结束索引号 > 总个数
		{
			end_index = data.Count;
		}
		for (var i:int=begin_index; i<end_index; ++i)
		{
			temp.Add(data[i]);
		}
		return temp;
	}
	//--------------------------------------------------
}
