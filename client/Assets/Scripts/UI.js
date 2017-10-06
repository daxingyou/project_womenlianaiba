/*--------------------------------------------------
界面相关(2011/9/13 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast
import iGUI;



private static var mRootArray : Array = new Array();
private var m_exsitElement_and_parents_table : Array = new Array();
//--------------------------------------------------
// 获取UI
private static var mInstance : UI = null;
function Awake()
{
	mInstance = this;
}
public static function getUI() : UI
{
	if (null == mInstance)
		throw Exception("UI -> getUI() -> instance is null!");
	
	return mInstance;
}
//--------------------------------------------------
// 获取iGUIRoot,root_name指的是iGUIRoot所挂载的GameObject的名称
public static function GetUIRoot(root_name : String) : iGUIRoot
{
	for (var root : iGUIRoot in mRootArray)
	{
		if (root && root_name == root.gameObject.name)
		{
			root.instance = root;	// 注: 这里要手动设置instance为自身,不然可能出现instance为空的情况(这应该是iGUI的bug)
			return root;
		}
	}
	return null;
}
//--------------------------------------------------
// 创建iGUIRoot
private static function CreateUIRoot(root_name : String) : iGUIRoot
{
	var root : iGUIRoot = GetUIRoot(root_name);
	if (root)
		return root;
	
	var root_prefab : GameObject = Resources.Load("UIPrefabs/" + root_name);
	if (null == root_prefab)
		throw Exception("UI -> CreateUIRoot(String) -> root prefab: " + root_name + " isn't exist!");
	
	var root_obj : GameObject = GameObject.Instantiate(root_prefab);
	root_obj.name = root_name;
	root = root_obj.GetComponent("iGUIRoot");
	if (null == root)
		throw Exception("UI -> CreateUIRoot(String) -> root: " + root_name + " lose iGUIRoot!");
	
	mRootArray.Add(root);
	return root;
}
//--------------------------------------------------
// 销毁iGUIRoot
private static function DestroyUIRoot(root_name : String) : void
{
	var temp_root : iGUIRoot = null;
	for (var root : iGUIRoot in mRootArray)
	{
		if (root && root_name == root.gameObject.name)
		{
			temp_root = root;
			break;
		}
	}
	if (temp_root)
	{
		mRootArray.Remove(temp_root);
		GameObject.Destroy(temp_root.gameObject);
	}
}
//--------------------------------------------------
// 界面是否打开
public static function isUIRootOpen(root_name : String) : boolean
{
	var root : iGUIRoot = GetUIRoot(root_name);
	if (root && root.enabled)
		return true;
	
	return false;
}
//--------------------------------------------------
// 打开iGUIRoot,iGUIRoot未实例则先实例化
public static function OpenUIRoot(open_root : String) : iGUIRoot
{
	var root : iGUIRoot = CreateUIRoot(open_root);
	if (root)
	{
		root.enabled = true;
		MouseStateManager.getInstance().addRoot(root);
	}
	return root;
}
public static function OpenUIRootAndHideOther(open_root : String) : Array
{
	OpenUIRoot(open_root);
	var ignore_list : Array = new Array();
	ignore_list.Add(open_root);
	ignore_list.Add("NoModalTipRoot");
	ignore_list.Add("ChatPaoPaoRoot");
	ignore_list.Add("StepLeadRoot");
	return EnableUIRootIgnore(ignore_list, false);
}
//--------------------------------------------------
// 关闭iGUIRoot,销毁iGUIRoot实例
public static function CloseUIRoot(close_root : String) : void
{
	MouseStateManager.getInstance().removeRoot(close_root);
	DestroyUIRoot(close_root);
}
//--------------------------------------------------
// 显示/隐藏iGUIRoot
public static function EnableUIRoot(root_name : String, enable : boolean) : void
{
	var root : iGUIRoot = GetUIRoot(root_name);
	if (root)	// 对于iGUIRoot,直接对enabled设值,不要用setEnabled
	{
		root.enabled = enable;
	}
}
public static function EnableUIRoot(root_names : Array, enable : boolean) : void
{
	for (var name : String in root_names)
	{
		EnableUIRoot(name, enable);
	}
}
public static function EnableUIRootIgnore(ignore_list : Array, enable : boolean) : Array
{
	var enableRoot : Array = new Array();
	for (var root : iGUIRoot in mRootArray)
	{
		var is_ignore : boolean = false;
		for (var ignore : String in ignore_list)
		{
		 	if (ignore == root.gameObject.name) 
		 	{
				is_ignore = true; 
				break;
		 	}
		}
		// 被忽略;状态和设置状态一样
		if (is_ignore || enable==root.enabled)
			continue;
		
		root.enabled = enable;
		enableRoot.Add(root.gameObject.name);
	}
	return enableRoot;
}
//--------------------------------------------------
// 显示/隐藏界面元素下的子元素
public static function EnableElementIgnore(element : iGUIElement, ignore_list : Array, enable : boolean) : Array
{
	var enableElement : Array = new Array();
	if (null == element)
		return enableElement;
	
	for (var ele : iGUIElement in element.items)
	{
		var is_ignore : boolean = false;
		for (var ignore : String in ignore_list)
		{
			if (ignore==ele.gameObject.name || ignore==ele.variableName)
			{
				is_ignore = true;
				break;
			}
		}
		// 被忽略;状态和设置状态一样
		if (is_ignore || enable==ele.enabled)
			continue;
		
		ele.setEnabled(enable);
		enableElement.Add(ele);
	}
	return enableElement;
}
//--------------------------------------------------
// 判断鼠标是否在界面上,遍历判断子界面
private function IsMosueOverElement(element : iGUIElement) : boolean
{
	if (null == element || false == element.enabled)
		return false;
	
	if (element.isMouseOver)
		return true;
	
	for (var child : iGUIElement in element.items)
	{
		if (IsMosueOverElement(child))	// 递归遍历
			return true;
	}
	return false;
}
// 判断root数组
private function IsMouseOverUI(roots : Array) : boolean
{
	for (var root : iGUIRoot in roots)	// iGUI Root
	{
		if (null == root || false == root.enabled)
			continue;
		
		for (var element : iGUIElement in root.items)	// iGUI Element
		{
			if (IsMosueOverElement(element))	// 深度遍历所有元素
				return true;
		}
	}
	return false;
}
// 设置为忽略鼠标进入界面
public function SetIgnoreMouseOver(ele : iGUIElement, ignore : boolean) : void
{
	if (null == ele)
		return;
	
	ele.ignoreMouseOver = ignore;
}
// 鼠标是否在界面上
public function IsMouseOverUI() : boolean
{
	if (IsModal() || IsMouseOverUI(mRootArray))			// 有模态,强制屏蔽鼠标穿透
		return true;
	
	return false;
}
//--------------------------------------------------
private var mPassiveRootArray : Hashtable = new Hashtable();	// 保存非模态root的名称 
private var mModalRootArray : Array = new Array();				// 保存模态root的名称
private var mModalState : int = 0;								// 模态状态(累加)
public var ModalIgnoreRoots : String[];							// 忽略的数组,在编辑面板里编辑
public var TopModalRoot : String;								// 最顶级的界面,当存在此界面时,其他模态都靠后
// 模态计算
private function modalState(modal : boolean) : void
{
	if (modal)
	{
		++mModalState;
	}
	else
	{
		if (0 != mModalState)
		{
			--mModalState;
		}
	}
}
// 判断是否为模态
private function isModalRoot(name : String) : boolean
{
	for (var modal : String in mModalRootArray)
	{
		if (name == modal)
			return true;
	}
	return false;
}
// 是否忽略
private function isIgnoreRoot(name : String) : boolean
{
	for (var ignore : String in ModalIgnoreRoots)
	{
		if (name == ignore)
			return true;
	}
	return false;
}
// 添加到模态数组
private function addModalRootArray(root : iGUIRoot) : void
{
	// 一定要做非空判断
	if (null == root)
		return;
	
	var root_name : String = root.gameObject.name;
	if (false == isModalRoot(root_name))
	{
		mModalRootArray.Add(root_name);
	}
	root.passive = false;
	// 设置模态窗口最最顶层
	SetTopDepth(root_name);
}
// 添加到非模态数组
private function addPassiveRootArray(root : iGUIRoot) : void
{
	// 一定要做非空判断
	if (null == root)
		return;
	
	var root_name : String = root.gameObject.name;
	if (false == mPassiveRootArray.Contains(root_name))
	{
		mPassiveRootArray.Add(root_name, root.passive);
	}
	root.passive = true;
}
// 还原非模态数组
private function clearPassiveRootArray(roots : Array) : void
{
	for (var root : iGUIRoot in roots)
	{
		// 一定要做非空判断
		if (null == root)
			continue;
		
		for (var kv : DictionaryEntry in mPassiveRootArray)
		{
			if (kv.Key == root.gameObject.name)		// 还原非模态root
			{
				root.passive = kv.Value;
				break;
			}
		}
	}
	mPassiveRootArray.Clear();
}
// 推送上一个模态窗口
private function popPreModalRoot(name : String, roots : Array) : boolean
{
	// 移除当前模态窗口
	mModalRootArray.Remove(name);
	// 获取可推送的模态窗口索引
	var index : int = mModalRootArray.Count - 1;
	// 没有其他模态窗口
	if (-1 == index)
		return false;
	
	// 还有至少一个模态窗口,推送
	var pop_name : String = mModalRootArray[index];
	for (var root : iGUIRoot in roots)
	{
		// 一定要做非空判断
		if (null == root)
			continue;
		
		if (pop_name == root.gameObject.name)
		{
			root.passive = false;
			// 设置模态窗口最最顶层
			SetTopDepth(pop_name);
			return true;
		}
	}
	return false;
}
// 设置为模态
private function modal(name : String) : void
{
	for (var root : iGUIRoot in mRootArray)
	{
		// 一定要做非空判断
		if (null == root)
			continue;
		
		var root_name : String = root.gameObject.name;
		// step1:添加模态root
		if (name == root_name)
		{
			addModalRootArray(root);
			// 可以保证最顶级窗口总是在最上面
			if ("" != TopModalRoot && isModalRoot(TopModalRoot) && TopModalRoot != root_name)
			{
				addPassiveRootArray(root);
			}
			continue;
		}
		// step2:忽略,跳过
		if (isIgnoreRoot(root_name))
			continue;
		
		// step3:添加并设置其他root(最顶级除外)
		if (TopModalRoot != root_name)
		{
			addPassiveRootArray(root);
		}
	}
}
// 设置为非模态
private function nonModal(name : String) : void
{
	// 非模态,返回
	if (false == isModalRoot(name))
		return;
	
	// 推送上一个模态窗口
	if (popPreModalRoot(name, mRootArray))
		return;
	
	// 没有可推送的模态窗口,还原非模态窗口
	clearPassiveRootArray(mRootArray);
}
// 设置root为模态,name:root名称;modal:模态标识
public function SetModal(name : String, modal : boolean) : void
{
	if (modal == isModalRoot(name))
		return;
	
	// 设置标识
	modalState(modal);
	// 模态设置
	if (modal)
	{
		modal(name);
	}
	else
	{
		nonModal(name);
	}
	// 事件分布
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_UI_MODAL_STATE), modal);
}
// 判断root是否为模态
public function IsModal(name : String) : boolean
{
	return isModalRoot(name);
}
// 判断当前是否有模态
public function IsModal() : boolean
{
	return mModalState > 0;
}
// 获取当前模态窗口名称
public function GetModalName() : String
{
	// 获取当前的模态窗口索引
	var index : int = mModalRootArray.Count - 1;
	// 没有模态窗口
	if (-1 == index)
		return "";
	
	return mModalRootArray[index];
}
//--------------------------------------------------
private final var MOST_TOP_DEPTH : int = 1;				// 最顶层的深度值为1;若<1,则鼠标会显示在界面下
public var TopDepthRoots : String[];					// 最顶层的界面
// 在顶层界面列表里
private function InTopDepthRoots(name : String) : boolean
{
	for (var top : Object in TopDepthRoots)
	{
		var _top : String = top.ToString();
		if (name == _top)
			return true;
	}
	return false;
}
// 获取UI的最顶层深度值
private function GetTopDepth(name : String, flag : boolean) : int
{
	var top_depth : int = 100;
	for (var root : iGUIRoot in mRootArray)
	{
		// name不为""时,筛选除了自身以外的最顶层值
		if (root && top_depth > root.depth && name != root.gameObject.name)
		{
			// flag为false时,表示要排除最顶层界面列表
			if (false == flag && InTopDepthRoots(root.gameObject.name))
				continue;
			
			top_depth = root.depth;
		}
	}
	return top_depth;
}
// 设置最顶层界面
private function SetTopDepthRoots(top_depth : int) : void
{
	var top_roots : Array = new Array();
	for (var top : String in TopDepthRoots)
	{
		for (var root : iGUIRoot in mRootArray)
		{
			// 这里不做enabled判断
			if (root && top == root.gameObject.name)
			{
				top_roots.Add(root);
			}
		}
	}
	for (var i:int = 1; i<=top_roots.Count; ++i)
	{
		var temp : iGUIRoot = top_roots[top_roots.Count - i];
		temp.depth = top_depth - i;
	}
}
// 限制最顶层界面深度值
private function LimitRootTopDepth() : void
{
	var diff_depth : int = MOST_TOP_DEPTH - GetTopDepth("", true);
	if (diff_depth <= 0)
		return;
	
	// 深度超过界限
	var top_depth : int = GetTopDepth("", false) + diff_depth;
	for (var root : iGUIRoot in mRootArray)
	{
		// 为了使被下放底层的界面不被其底层覆盖,这里对<=top_depth + diff_depth层的界面进行深度重设
		if (root && root.depth <= top_depth + diff_depth)
		{
			root.depth += diff_depth;
		}
	}
}
// 设置最顶层
public function SetTopDepth(name : String) : void
{
	var root : iGUIRoot = GetUIRoot(name);
	if (null == root)
		return;
	
	var top_depth : int = GetTopDepth(name, false) - 1;
	if (false == InTopDepthRoots(name))
	{
		root.depth = top_depth;
	}
	// step1:
	SetTopDepthRoots(top_depth);
	// step2:
	LimitRootTopDepth();
}
//--------------------------------------------------
// 设置界面激活状态
public function SetPassive(name : String, passive : boolean) : void
{
	var root : iGUIRoot = GetUIRoot(name);
	if (null == root)
		return;
	
	root.passive = passive;
}
//--------------------------------------------------
// 设置按钮状态
public static function SetButtonState(btn : iGUIButton, normal : String, hover : String, active : String) : void
{
	btn.style.normal.background = Resources.Load("UISkins/Textures/" + normal);
	btn.style.hover.background = Resources.Load("UISkins/Textures/" + hover);
	btn.style.active.background = Resources.Load("UISkins/Textures/" + active);
}
//--------------------------------------------------



/*************************************************************************************************
**************************************************************************************************
*************************************************************************************************/


//--------------------------------------------------
//--打开模态Root，，当模态Root打开时，要通过SetRootPassive函数设置其他Root的Passive属性为true
public function OpenModalRoot() : void
{
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_OPEN_MODAL_ROOT), null);
	if (null == GetUIRoot("ModalRoot"))
	{
		OpenUIRoot("ModalRoot");
	    SetModal("ModalRoot", true);
	}
}
//--关闭模态Root，当模态Root关闭时，要通过SetRootPassive函数设置其他Root的Passive属性为false，激活其他Root
public function CloseModalRoot() : void
{
	if (GetUIRoot("ModalRoot"))
	{
		SetModal("ModalRoot", false);
		CloseUIRoot("ModalRoot");
	}
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_CLOSE_MODAL_ROOT), null);
}
//------------------------------------------------------------
//--以下是创建打开创建模态消息提示窗口的三个重载函数，依据参数创建，可以创建
//--显示文本、带0~2个回调函数的消息提示窗口
//--
//--
//------------------------------------------------------------
//--创建打开消息提示窗口，不带回调
public function OpenMsgbox(title:String,msg:String,is_showBtn:boolean):void
{
	OpenModalRoot();
	iGUICode_ModalRoot.getInstance().showMsgboxInterface(msg,null,null,"",title,null,null,null,null,is_showBtn);
}
//--创建打开消息提示窗口，带一个回调，并可自定义按钮文字
public function OpenMsgbox(title:String,msg:String,okTxt:String,okCallback:iGUIEventCallback):void
{
	OpenModalRoot();
	iGUICode_ModalRoot.getInstance().showMsgboxInterface(msg,okTxt,null,"",title,okCallback,null,null,null,true);
}
//--创建打开消息提示窗口，带2个回调，可自定义按钮文字
public function OpenMsgbox(title:String,msg:String,okTxt:String,okCallback:iGUIEventCallback,cancelTxt:String,cancelCallback:iGUIEventCallback):void
{
	OpenModalRoot();
	iGUICode_ModalRoot.getInstance().showMsgboxInterface(msg,okTxt,cancelTxt,"",title,okCallback,cancelCallback,null,null,true);
}
//--创建打开消息提示窗口，带2个回调，可自定义按钮文字,外加userData参数
public function OpenMsgbox(title:String,msg:String,okTxt:String,okCallback:iGUIEventCallback,cancelTxt:String,cancelCallback:iGUIEventCallback, userdata : Object):void
{
	OpenModalRoot();
	iGUICode_ModalRoot.getInstance().showMsgboxInterface(msg,okTxt,cancelTxt,"",title,okCallback,cancelCallback,userdata,null,true);
}
//--创建打开消息提示窗口，带3个回调，可自定义按钮文字
public function OpenMsgbox(title:String,msg:String,okTxt:String,okCallback:iGUIEventCallback,cancelTxt:String,cancelCallback:iGUIEventCallback,extendTxt:String,extendCallback:iGUIEventCallback):void
{
	OpenModalRoot();
	iGUICode_ModalRoot.getInstance().showMsgboxInterface(msg,okTxt,cancelTxt,extendTxt,title,okCallback,cancelCallback,null,extendCallback,true);
}
//--
/*
	创建非模态信息提示
*/
public function OpenNoModalMsgbox(msg:String)
{
	OpenUIRoot("NoModalTipRoot");
	SetTopDepth("NoModalTipRoot");
	iGUICode_NoModalTipRoot.getInstance().CreateMsgLabel(msg);
}
//---------------------------------------------------------------
//--创建loading模态框
public function OpenLoadingModalRoot()
{
	if(!GetUIRoot("LoadingModalRoot")) 
	{
		OpenUIRoot("LoadingModalRoot");
		SetModal("LoadingModalRoot", true);
	}
}
//--
public function CloseLoadingModalRoot()
{
	if(GetUIRoot("LoadingModalRoot"))
	{
		CloseUIRoot("LoadingModalRoot"); 
		SetModal("LoadingModalRoot", false);
	}
}
//--
public function StartLoading()
{
	OpenLoadingModalRoot();
	iGUICode_LoadingModalRoot.getInstance().CreateLoadingWin();
}
//--
public function EndLoading()
{
	var instance : iGUICode_LoadingModalRoot = iGUICode_LoadingModalRoot.getInstance();
	if (instance)
	{
		instance.CloseLoadingWin();
	}
	CloseLoadingModalRoot();
}
//--打开新手引导第一阶段模态Root
public function OpenNewGuideModalRoot()
{
	if(!GetUIRoot("NewGuideModalRoot"))
	{
		OpenUIRoot("NewGuideModalRoot");	
		SetModal("NewGuideModalRoot", true);
	} 
}
//--关闭新手引导第一阶段模态Root
public function CloseNewGuideModalRoot()
{ 
	if(GetUIRoot("NewGuideModalRoot"))
	{
		CloseUIRoot("NewGuideModalRoot");
		SetModal("NewGuideModalRoot", false);
	}
}
//--打开新手引导第二阶段引导式Root
public function OpenNewGuideLeadRoot()
{
	if(!GetUIRoot("StepLeadRoot"))
	{
		OpenUIRoot("StepLeadRoot");
	}
}
//--关闭新手引导第二阶段引导式Root
public function CloseNewGuideLeadRoot()
{
	if(GetUIRoot("StepLeadRoot"))
	{
		CloseUIRoot("StepLeadRoot"); 
	}
}
//--设置root_name的Root下除了except子窗体之外的子窗体为passive
public function SetElementPassive(flag:boolean,except:String,root_name:String,is_root_direct_child:boolean)
{
	var root:iGUIRoot = GetUIRoot(root_name);
	for(var element:iGUIElement in root.items)
	{
		if(is_root_direct_child)
		{
			var is_equal:boolean = IsEqualElement(element.gameObject.name,except);
			if(!is_equal)
				element.passive = flag;
		}
		else
		{		
			Debug.Log("************element***************"+element.gameObject.name);
			var ret:boolean = isChildRecursive(element,except);
			if(!ret)
				element.passive = flag;
		}
	}
	Debug.Log("---m_exsitElement_and_parents_table----"+m_exsitElement_and_parents_table.Count);
	for(var i:int=1; i<m_exsitElement_and_parents_table.Count; ++i)
	{
		var ele1 : iGUIElement = m_exsitElement_and_parents_table[i] as iGUIElement;
		for (var j:int=0; j<ele1.itemCount; ++j)
		{
			if (!IsEqualElement(ele1.items[j], m_exsitElement_and_parents_table[i-1] as iGUIElement))
				ele1.items[j].passive = flag;
		}  	
	}
	
	if (m_exsitElement_and_parents_table.Count == 0)
		return;
	
	var ele2 : iGUIElement = m_exsitElement_and_parents_table[m_exsitElement_and_parents_table.Count-1] as iGUIElement;
	for(var k:int=0; k<ele2.container.itemCount; ++k)
	{
		if (!IsEqualElement(ele2.container.items[k], ele2)) 
			ele2.container.items[k].passive = flag;
	}
}
//--
function IsEqualElement(ele_name:String,search_name:String):boolean{
	if(search_name == ele_name)
		return true;
	
	return false;
}
//-- 两个iGUIElement是否相等
function IsEqualElement(ele1:iGUIElement,ele2:iGUIElement):boolean
{
	 if(ele1.gameObject.name == ele2.gameObject.name)
	 	return true;
	 
	 return false;
}
//--递归查找search_name是否是element的孩子、孙子、重孙子元素,并存储关系族谱到表中
function isChildRecursive(element:iGUIElement,search_name:String):boolean
{
	var sz:int = element.itemCount;
	for(var i:int=0; i<sz; ++i)
	{
		Debug.Log("-------------********"+element.items[i].gameObject.name);
		if(element.items[i].gameObject.name == search_name || isChildRecursive(element.items[i],search_name))
		{
			Debug.Log("------------"+element.items[i].gameObject.name);
			Debug.Log("_____"+element.items[i].container.gameObject.name);
			m_exsitElement_and_parents_table.Add(element.items[i]);
			return true;
		}
	}
	return false;
}
//-- 查找child_name是否element的直接孩子
function isChild(element:iGUIElement,child_name:String):boolean
{
	 var sz:int = element.itemCount;
	 for(var i:int=0; i<sz; ++i)
	 	if(element.items[i].gameObject.name == child_name)
	 		return true;
	 
	 return false;
}
//--
function OpenWishListUI(root_name : String){
	if(!GetUIRoot(root_name))
		OpenUIRoot(root_name);
	
	//1.判断是否在自己家，
	//2.判断是否单身
	//3.打开许愿单界面
	//4.默认请求自己的愿望列表
	if(DataCenter.isInSelfHouse()){
		var house : PlayerHouse = EQGameSceneMgr.getSingleton().getHouse();
		if(!house.hasTwoOwner())
			iGUICode_WishListRoot.getInstance().OpenSingleSelfWishUI();
		else
			iGUICode_WishListRoot.getInstance().OpenLoversSelfWishUI();
	}
	else{
		iGUICode_WishListRoot.getInstance().OpenOtherWishUI("");
	}
}