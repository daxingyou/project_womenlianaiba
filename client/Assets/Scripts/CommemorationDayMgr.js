#pragma strict
#pragma downcast
class CommemorationDayMgr
{
	static var singleton : CommemorationDayMgr;
	static function getSingleton() : CommemorationDayMgr
	{
		if(singleton == null)
			singleton = new CommemorationDayMgr();
			
		return singleton;
	}
	
	var mCommemorationDays:Array = new Array();
	var mModifyingDayID:UInt64;
	var mCurPage:int = 0;
	var mMaxPage:int = 0;
	
	function registEvent()
	{
		NetHelper.RegistHandler(new notify_love_time(), handle_notify_love_time);
		NetHelper.RegistHandler(new notify_commemoration(), handle_notify_commemoration);
	}
	
	function reqLoveDay()
	{
		Debug.Log("req_get_love_time");
		var req:req_get_love_time = new req_get_love_time();
		req.house_id = DataCenter.getCurHouseID();
		NetHelper.Send(req);
	}
	
	function getModifyingCommemorationDay() : commemoration_day
	{
		for(var day:commemoration_day in mCommemorationDays)
			if(day.id == mModifyingDayID)
				return day;
		
		return null;
	}

	function handle_notify_love_time(evt:GameEvent, pack:notify_love_time)
	{
		Debug.Log("notify_love_time");
		iGUICode_MainUI.getInstance().setLoveTime(pack.love_time);
	}
	
	function handle_notify_commemoration(evt:GameEvent, pack:notify_commemoration)
	{
		Debug.Log("notify_commemoration");
		mCommemorationDays.clear();
		for(var day:commemoration_day in pack.days)
			mCommemorationDays.Add(day);
		mMaxPage = pack.total;
		refreshCommemorationDayView();
	}
	
	function reqCommemorationDay()
	{
		Debug.Log("req_get_commemoration");
		var req:req_get_commemoration = new req_get_commemoration();
		req.house_id = DataCenter.getCurHouseID();
		req.my_house_id = DataCenter.getSelfHouseID();
		req.page = mCurPage;
		Debug.Log("req_get_commemoration "+req.house_id.ToString()+" "+req.my_house_id.ToString());
		NetHelper.Send(req);
	}
	
	function refreshCommemorationDayView()
	{
		iGUICode_MainUI.getInstance().CommemorationDayView_scrollview.removeAll();
	
		var so:iGUIElement;
		var height:float=0;
		for(var day:commemoration_day in mCommemorationDays)
		{
			so = iGUICode_MainUI.getInstance().CommemorationDayView_scrollview.addSmartObject("CommemorationDay");
			so.setX(0);
			so.setY(height);
			so.userData = day.id;
			so.items[0].items[2].label.text = day.time.year.ToString();
			so.items[0].items[1].label.text = day.time.month.ToString() + "月";
			so.items[0].items[0].label.text = day.time.day.ToString();
			so.items[1].enabled = DataCenter.isInSelfHouse();
			so.items[2].enabled = DataCenter.isInSelfHouse();
			so.items[3].enabled = day.show_other>0?false:true;
			so.items[4].label.text = day.content;
			height += so.positionAndSize.height;
		}
		var h:float = height / iGUICode_MainUI.getInstance().CommemorationDayView_scrollview.positionAndSize.height;
		iGUICode_MainUI.getInstance().CommemorationDayView_scrollview.areaHeight = h;
		iGUICode_MainUI.getInstance().CommemorationDayView_scrollview.refreshRect();
		iGUICode_MainUI.getInstance().CommemorationDayView_scrollview.scrollToTop(0.2);
		
		if(mCurPage > 1)
			iGUICode_MainUI.getInstance().CommemorationDayView_lastpage.passive = false;
		else
			iGUICode_MainUI.getInstance().CommemorationDayView_lastpage.passive = true;
		
		if(mMaxPage > 1 && mCurPage < mMaxPage)
			iGUICode_MainUI.getInstance().CommemorationDayView_nextpage.passive = false;
		else
			iGUICode_MainUI.getInstance().CommemorationDayView_nextpage.passive = true;
			
		if(mMaxPage == 0)
			CommemorationDayMgr.getSingleton().mCurPage = 0;
		iGUICode_MainUI.getInstance().CommemorationDayView_pages.label.text = mCurPage.ToString() + "/" + mMaxPage.ToString();
	}
}