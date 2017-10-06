#pragma strict
/* AsynModelCtrl
 * 异步模型控制器. 辅助实现模型异步加载的方案.
 * 成员和方法:
 * addOrProcessEvent(eve:ModelCtrlEvent):void
 * 						添加或者立即执行事件. 事件说明看AsynModelCtrlEvent.js.
 * clearEvent():void	清除所有事件. 一般是在删除时候调用. 比如这个模型要删除, 接下去的事件自然没用.
 *						而且也必须清除, 需要清除资源和防止错误阿. 执行这函数会调用ModelCtrlEvent.cancel()
 *						的方法. 没有提供删除单个事件的方法.
 * isMainLoaded():boolean 说明MainLoadModelCtrlEvent事件已经执行过. 或者你已经明确的设置主体模型已经完整.
 * notifyOneEventReady() 内部函数.
 * mMainLoaded			模型主体是否已经加载. 不要手动设置他, 除非你明确知道知道你模型已经完整. 关于主体加载
 *						的更多说明看AsynModelCtrlEvent.js.
 *
 * AsynModel
 * 异步模型设置的抽象类. 为异步模型事件的实现提供调用的接口. 用户继承这个抽象类, 根据需求重载对应的方法.
 * 类的方法的特点:
 * 1. 所有的返回值都是void. 因为异步模型事件没有处理返回值的必要.
 * 2. 抽象类只提供异步模型事件需要的方法. 所以呢, 也就不会出现获取数据的方法.
 * 3. 目前这些方法是我临时加上去的, 没用的就删除把. 这些方法根据用户需求增减.
 * 4. 具体可参考Model.js,其中setVisible,setParent和setPosition事件已实现,见于AsynModelEvent.js
*/
import System;

class AsynModel
{
	public function setVisible(visible : boolean) : void {}
	public function setParent(parent : GameObject) : void{}
	public function setPosition(pos : Vector3) : void{}
}

//
class AsynModelCtrl
{
	//-------------------------------------------------------------
	public function AsynModelCtrl(am : AsynModel)
	{
		mAsynModel = am;
	}
	//-------------------------------------------------------------
	public function addOrProcessEvent(eve : ModelCtrlEvent) : void
	{
		eve.setAsynModelCtrl(this);
		// 追踪主模型事件
		if (eve instanceof ChaseMainLoadModelCtrlEvent)
		{
			var ix : int = -1;
			var findMain : boolean = false;		// 发现主模型事件标识
			var replace : boolean = false;		// 发现可替换追踪主模型事件标识
			for (var i:int = 0; i < mEventList.Count; ++i)
			{
				var check : boolean[] = checkEventType(mEventList[i] as ModelCtrlEvent, eve);
				if (!findMain)
				{
					findMain = check[0];
				}
				replace = check[1];
				ix = i;
				// 遇到可替换事件,退出查找
				if (replace)
					break;
			}
			
			// 在追踪主模型事件前一定要有主模型事件
			if (!mMainLoaded && !findMain)
				throw Exception("AsynModelCtrl -> addOrProcessEvent() -> Can't find main load event, current event '" + eve.GetType().Name + "'!");
			
			if (replace)	// 发现可替换追踪主模型事件,替换
			{
				var mce : ModelCtrlEvent = mEventList[ix] as ModelCtrlEvent;
				mce.innerCancel();					// cancel
				mEventList[ix] = eve;				// replace
			}
			else			// 插入
			{
				mEventList.Insert(mMainLoaded ? 0 : ix + 1, eve);		// insert event
			}
		}
		else	// 普通模型事件,主模型事件
		{
			mEventList.Add(eve);
		}
		// 分布事件
		distribute();
		// 
		if (mEventList.Count > 40)
			throw Exception("AsynModelCtrl -> addOrProcessEvent() -> had too more event!" );
	}
	//-------------------------------------------------------------
	public function clearEvent() : void
	{
		// notify event.cancel is reverse
		while (0 != mEventList.Count)
		{
			removeTailEvent();
		}
	}
	//-------------------------------------------------------------
	public function setMainLoaded(loaded : boolean) : void
	{
		mMainLoaded = loaded;
	}
	//-------------------------------------------------------------
	public function isMainLoaded() : boolean
	{
		return mMainLoaded;
	}
	//-------------------------------------------------------------
	public function notifyOneEventReady() : void
	{
		distribute();
	}
	//-------------------------------------------------------------
	public function getAsynModel() : AsynModel
	{
		return mAsynModel;
	}
	//-------------------------------------------------------------
	private function distribute() : void
	{
		while (0 != mEventList.Count)
		{
			var mce : ModelCtrlEvent = mEventList[0] as ModelCtrlEvent;
			if (!mce.isReady())
				break;
			
			// step1:remove event first	
			mEventList.RemoveAt(0);
			// step2:
			mce.innerExce();
		}
	}
	//-------------------------------------------------------------
	private function removeTailEvent() : void
	{
		var ix : int = mEventList.Count - 1;
		var mce : ModelCtrlEvent = mEventList[ix] as ModelCtrlEvent;
		// step1:remove event first
		mEventList.RemoveAt(ix);
		// step2:
		mce.innerCancel();
	}
	//-------------------------------------------------------------
	private function checkEventType(evt : ModelCtrlEvent, e : ModelCtrlEvent) : boolean[]
	{
		var isMain : boolean = false;		// 主模型事件标识
		var isReplace : boolean = false;	// 可替换追踪主模型事件标识
		var isChase : boolean = false;		// 普通追踪主模型事件标识
		var isNoraml : boolean = false;		// 普通事件标识
		if (evt instanceof MainLoadModelCtrlEvent)						// 主模型事件
		{
			isMain = true;
		}
		else if (evt instanceof ReplaceChaseMainLoadModelCtrlEvent)		// 可替换追踪主模型事件
		{
			if (null == e || evt.GetType().Name == e.GetType().Name)
			{
				isReplace = true;
			}
		}
		else if (evt instanceof ChaseMainLoadModelCtrlEvent)			// 追踪主模型事件
		{
			isChase = true;
		}
		else	// ModelCtrlEvent
		{
			isNoraml = true;
		}
		return [isMain, isReplace, isChase, isNoraml];
	}
	//-------------------------------------------------------------
	private var mEventList : ArrayList = new ArrayList();	// 事件列表
	private var mMainLoaded : boolean = false;				// 主事件是否已加载
	private var mAsynModel : AsynModel = null;				// 异步模型
	//-------------------------------------------------------------
}


