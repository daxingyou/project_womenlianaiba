#pragma strict
/* 异步模型控制事件
 * ModelCtrlEvent MainLoadModelCtrlEvent ChaseMainLoadModelCtrlEvent ReplaceChaseMainLoadModelCtrlEvent 
 * 这4个类是所有异步事件的基类. 根据需求可能还会有新的基类产生. 
 * 使用AsynModelCtrl.addOrProcessEvent(eve:ModelCtrlEvent):boolean方法来处理事件.
 *
 * ModelCtrlEvent
 * 最普通的事件类型. 控制器会根据事件的先后循序逐个执行.
 * 成员和方法:
 * exce()		控制器在执行事件的时候会调用这个方法. 用户必须重载这个方法, 且务必在这个方法里面清除资源.
 * cancel()  	在这个事件被取消的时候调用这个方法. 调用情况:1. AsynModelCtrl.clearEvent调用的时候; 
 *				2. ReplaceChaseMainLoadModelCtrlEvent事件替换掉相同事件的时候.  
 *				用户根据需求重载这个方法. 主要是在这里清除资源. exce()和cancel()只会有一个被执行.
 * getUid()		事件的唯一id. 如果用户也需要管理事件, 可能会用到.
 * isReady()	事件是否已经准备好. 只有事件准备好了, 控制器才会执行他调用exce(). 否则控制器事件队列会被
 *				阻塞. 默认值是true.
 * clearReady()	没准备好. 对于异步处理事件, 务必在加入控制器前调用这个指令.
 * setReady()	准备好了. 对于异步处理事件, 务必在资源准备好之后调用这个指令.
 * setDelegate(dele)
 *				回调事件.格式:function callback(ModelCtrlEvent eve, ModelCtrlDelegateType type):void 
 *				用户在使用封装好的事件时, 可能对一些事件点感兴趣. 所以有回调事件. 比如我要确保衣服加载完成前锁定装备栏.
 * 				参数eve是自身. 参数type是回调类型.
 *				回调的时机. BeginExce, 在exce()执行前调用. EndExce, 在exce()执行后调用. Cancel, 
 *   			在cancel()执行后调用.
 * innerExce()	内部函数.
 * innerCancel()内部函数.
 * mAsynModelCtrl事件所属的控制器实例. 调用addOrProcessEvent会自动给这个变量赋值. 如果用户有需求也可以想赋值.
 * 				不过请确保调用addOrProcessEvent时, 是同一实例.
 *
 * MainLoadModelCtrlEvent      	继承ModelCtrlEvent
 * 这事件执行完后, 会设置_amc._mainLoaded为true
 * 
 * ChaseMainLoadModelCtrlEvent	继承ModelCtrlEvent
 * 如果_amc._mainLoaded为true. 调用addOrProcessEvent这个函数, 则立即执行. 否则,这个事件会插入到
 * MainLoadModelCtrlEvent事件后或者最后一个ChaseMainLoadModelCtrlEvent后面.
 * 
 * ReplaceChaseMainLoadModelCtrlEvent 继承ChaseMainLoadModelCtrlEvent
 * 如果_amc._mainLoaded为true. 调用addOrProcessEvent这个函数, 则立即执行. 否则, 这个事件回去搜索事件队列有木有和自己
 * 同个类的事件. 如果有替换掉, 如果没有事件会插入到MainLoadModelCtrlEvent事件后或者最后一个ChaseMainLoadModelCtrlEvent后面.
 * 这个事件主要是多了替换功能, 对于SetVisibleEvent这样的事件可能会每帧调用的需要替换掉, 而不至于事件列表的事件太多.
 * 从设计上来说, 绝大部分的追踪事件都是可以替换的, 所以, 少用ChaseMainLoadModelCtrlEvent
 *
 * 这4个事件的使用:
 * 对于普通的顺序事件只要从ModelCtrlEvent继承即可. 但是并非所以的事件都可以按顺序执行. 比如我加载一个角色, 
 * 然后又要换装, 接着我需要对这个角色高亮. 如果按顺序处理事件, 则高亮效果得换装结束才能执行. 这是不合理的.
 * 我们必须在角色加载完成后, 直接高亮显示. 然后才是换装. 所以加载角色应该是MainLoadModelCtrlEvent事件,
 * 换装是ModelCtrlEvent事件, 高亮是ReplaceChaseMainLoadModelCtrlEvent事件. 
 * 
 * 主体加载:
 * 这里涉及到一个很重要的概念主体加载(MainLoad). 主体加载完成, 说明模型的主要部分已经齐全, (包括一个完整的
 * GameObject, 对应的模型渲染, 对应的transform等) 可以使ReplaceChaseMainLoadModelCtrlEvent事件立即执行.同时
 * 还包括了获取重要信息的前提条件, 比如你要获取模型的transform, 你可以先判断_amc._mainLoaded的标志位.
 *
 * SimpleMainModel为异步模型AsynModelCtrl的主模型事件的参考例子, 未测试.
 * SetVisibleEvent,SetParentEvent和SetPositionEvent为异步模型AsynModelCtrl的公用事件,也是追踪主模型事件的参考例子.
 */

enum ModelCtrlDelegateType
{
	BeginExce,
	EndExce,
	Cancel,
}

//
class ModelCtrlEvent
{
	//-------------------------------------------------------------
	protected function exce() : void
	{
	}
	//
	protected function cancel() : void
	{
	}
	//-------------------------------------------------------------
	public function setAsynModelCtrl(amc : AsynModelCtrl) : void
	{
		mAsynModelCtrl = amc;
		mAsynModel = amc.getAsynModel();
	}
	//
	public function getUid() : int
	{
		return mUid;
	}
	//
	public function isReady() : boolean
	{
		return mReady;
	}
	//
	public function clearReady() : void
	{
		mReady = false;
	}
	//
	public function setReady() : void
	{
		mReady = true;
		if (null != mAsynModelCtrl)
		{
			mAsynModelCtrl.notifyOneEventReady();
		}
	}
	//
	public function setDelegate(dele : Function) : void
	{
		mDelegate = dele;
	}
	//-------------------------------------------------------------
	public function innerExce() : void
	{
		if (null != mDelegate)
		{
			mDelegate(this, ModelCtrlDelegateType.BeginExce);
		}
		exce();
		if (null != mDelegate)
		{
			mDelegate(this, ModelCtrlDelegateType.EndExce);
		}
		mDelegate = null;			//clear delegate
		mAsynModelCtrl = null;		//clear amc
	}
	//
	public function innerCancel() : void
	{
		cancel();
		if (null != mDelegate)
		{
			mDelegate(this, ModelCtrlDelegateType.Cancel);
		}
		mDelegate = null;			//clear delegate
		mAsynModelCtrl = null;		//clear amc
	}
	//-------------------------------------------------------------
	private static var AutoId : int = 0;
	private var mReady : boolean = true;					// 是否准备好了
	private var mUid : int = ++AutoId;
	protected var mAsynModelCtrl : AsynModelCtrl = null;	// 异步模型控制器
	protected var mAsynModel : AsynModel = null;			// 异步模型
	protected var mDelegate : Function = null;      		// 回调
	//-------------------------------------------------------------
}
//
class MainLoadModelCtrlEvent extends ModelCtrlEvent
{
	public function innerExce() : void
	{
		if (null != mDelegate)
		{
			mDelegate(this, ModelCtrlDelegateType.BeginExce);
		}
		exce();
		mAsynModelCtrl.setMainLoaded(true);		//!--
		if (null != mDelegate)
		{
			mDelegate(this, ModelCtrlDelegateType.EndExce);
		}
		mDelegate = null;						//clear delegate
		mAsynModelCtrl = null;					//clear amc
	}
}
//
class ChaseMainLoadModelCtrlEvent extends ModelCtrlEvent
{
}
//
class ReplaceChaseMainLoadModelCtrlEvent extends ChaseMainLoadModelCtrlEvent
{
}
//



//---------------------------------------------------
//---------------------------------------------------
//---------------------------------------------------
// SimpleMainModel ----------------------------------
//class SimpleMainModel extends MainLoadModelCtrlEvent
//{
//	var _mainObj:GameObject = null;
//
//	function SimpleMainModel(name:String)
//	{
//		// !!!
//		clearReady();
//		
//		Global.GetModelLoaderMgr().AsynLoadModel(name, OnLoadFinished, true);
//	}
//	
//	function OnLoadFinished(obj : ModelLoader):void
//	{
//		_mainObj = obj.mModelObj;
//	
//		// !!!
//		setReady();
//	}
//	
//	function destroyRes():void
//	{
//		if(_mainObj!=null)
//			GameObject.Destroy(_mainObj);
//	}
//
//	// override -------------------------------
//	function exce():void
//	{
//		mAsynModel.init("body", _mainObj);
//		
//		destroyRes();
//	}
//	
//	function cancel():void
//	{
//		destroyRes();
//	}
//}


// SetVisibleEvent ------------------
class SetVisibleEvent extends ReplaceChaseMainLoadModelCtrlEvent
{
	private var _visible : boolean = false;
	
	public function SetVisibleEvent(v : boolean)
	{
		_visible = v;
	}
	
	protected function exce() : void
	{
		mAsynModel.setVisible(_visible);
	}
}
// SetParentEvent ------------------
class SetParentEvent extends ReplaceChaseMainLoadModelCtrlEvent
{
	private var _parent : GameObject = null;
	
	public function SetParentEvent(parent : GameObject)
	{
		_parent = parent;
	}
	
	protected function exce() : void
	{
		mAsynModel.setParent(_parent);
	}
}
// SetPositionEvent ------------------
class SetPositionEvent extends ReplaceChaseMainLoadModelCtrlEvent
{
	private var _position : Vector3 = Vector3.zero;
	
	public function SetPositionEvent(pos : Vector3)
	{
		_position = pos;
	}
	
	protected function exce() : void
	{
		mAsynModel.setPosition(_position);
	}
}
//


