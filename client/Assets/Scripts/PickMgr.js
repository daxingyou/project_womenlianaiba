#pragma strict

class PickMgr
{
	//////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////
	private static var mSingleton : PickMgr;
	
	public static function getSingleton() : PickMgr
	{
		if (null == mSingleton)
		{
			mSingleton = new PickMgr();
		}
		return mSingleton;
	}
	//////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////
	
	private var mPickObj : GameObject = null;
	private var mLastObj : GameObject = null;
	
	private function _pick(ray : Ray) : boolean
	{
		mLastObj = mPickObj;
		mPickObj = null;
		
		var rtns : RaycastHit[] = Physics.RaycastAll(ray);
		if (0 == rtns.Length)
			return false;
		
		// 取最近的
		mPickObj = rtns[0].transform.gameObject;
		var distance : float = rtns[0].distance;
		for (var i:int=0; i<rtns.Length; ++i)
		{
			if (distance > rtns[i].distance)
			{
				distance = rtns[i].distance;
				mPickObj = rtns[i].transform.gameObject;
			}
		}
		return true;
	}
	
	public function getPickObject() : GameObject
	{
		return mPickObj;
	}
	
	public function getLastPickObject() : GameObject
	{
		return mLastObj;
	}
	
	private function _moveIn() : void
	{
		if (null == mPickObj)
			return;
		
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_MOUSE_IN_MODEL), mPickObj);
	}
	
	private function _moveOut() : void
	{
		if (null == mLastObj)
			return;
		
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_MOUSE_OUT_MODEL), mLastObj);
	}
	
	public function mouseMove(point : Vector3) : void
	{
		var ray : Ray = Camera.main.ScreenPointToRay(point);	
		_pick(ray);
		
		if (mPickObj == mLastObj)
			return;
		
		_moveOut();	// call before _moveIn
		_moveIn();
	}
}


