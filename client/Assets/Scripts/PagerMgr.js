#pragma strict

class PagerMgr
{
	private var DataTable : Hashtable = new Hashtable();
	private var PageNum : float;
	private var currPageIndex : int = 1;
	function PagerMgr(data : ArrayList, pageNum : int)
	{
		PageNum = parseFloat(pageNum);
		for(var i = 0; i < data.Count; i++)
		{
			DataTable.Add(i, data[i]);
		}
	}
	
	function ResetData(data : ArrayList) {
		DataTable.Clear();
		for(var i = 0; i < data.Count; i++)
		{
			DataTable.Add(i, data[i]);
		}
	}
	
	function GetTotalPage()
	{
		return System.Math.Ceiling(DataTable.Count / PageNum);
	}
	
	function GetPageIndex()
	{
		return currPageIndex;
	}
	
	function GetPage(pageIndex : int)
	{
		currPageIndex = pageIndex;
		return GetData(currPageIndex);
	}
	
	function NextPage()
	{
		currPageIndex++;
		return GetData(currPageIndex);
	}
	
	function PrevPage()
	{
		currPageIndex--;
		return GetData(currPageIndex);
	}
	
	function CurrPage()
	{
		return GetData(currPageIndex);
	}
	
	private function GetData(pageIndex : int)
	{
		if(pageIndex > GetTotalPage())
		{
			currPageIndex = pageIndex - 1;
			return Get(currPageIndex);
		}
		else if(pageIndex <= 0)
		{
			currPageIndex = 1;
			return Get(currPageIndex);
		}
		else
		{
			return Get(pageIndex);
		}
	}
	
	private function Get(pageIndex : int) 
	{
		var startPageIndex : int = pageIndex - 1;
		var data : ArrayList = new ArrayList();
		var startIndex : int = startPageIndex * PageNum;
		var endIndex : int = GetEndIndex(pageIndex);
		for(var i = startIndex; i < endIndex; i++)
		{
			data.Add(DataTable[i]);
		}
		
		return data;
	}
	
	private function GetEndIndex(startIndex : int)
	{
		if(startIndex * PageNum > DataTable.Count)
			return DataTable.Count;	
		else
			return startIndex * PageNum;
	}
}