#pragma strict
/*--------------------------------------------------
公共场景(2012/6/18 create by Y3)
--------------------------------------------------*/

enum CommSceneUIPage {
	SelectPage = 0,			//选择页面
	CopyPage = 1,			//分线页面
}

private var _uiPage : CommSceneUIPage;
//分线列表
private var _sceneCopyList : notify_scene_copy_list = null;
//选择界面的模板id
private var _sceneTplltId : int = -1;
//当前场景的服务器信息
public var _currCommSceneInfo : notify_enter_common_scene = null;

//--------------------------------------------------
private static var instance : CommSceneLogic;
function Awake()
{
	instance = this;
	registerEvents();
}
static function getInstance()
{
	return instance;
}

//注册事件
public function registerEvents()
{
	NetHelper.RegistHandler(new notify_scene_copy_list(), notifySceneCopyList);
	NetHelper.RegistHandler(new notify_enter_common_scene(), notifyEnterCommonScene);
	
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LEAVE_SCENE), notifyLeaveScene);
}

//gui
function gui():iGUICode_CommSceneUI
{
	return iGUICode_CommSceneUI.getInstance();
}


//-------------逻辑----------------------------------
//清除分线数据
function clearSceneCopyData()
{
	_sceneCopyList = null;
}


//-------------UI事件--------------------------------
//打开ui
function openUI()
{
	//如果没有UI就创建他
	if(UI.getUI().GetUIRoot("CommSceneUI") == null)
    {
        UI.getUI().OpenUIRoot("CommSceneUI");
        UI.getUI().EnableUIRoot("CommSceneUI",false);
        
        //这个是硬编码, 说明第场景对应的模板id. 以后场景多的时候再来重构这部分代码. 
        //硬编码真爽, 简单又快捷.
        gui().ssScene1_Image.userData = 1;
	}

	//打开界面, 设置模态
	UI.getUI().EnableUIRoot("CommSceneUI",true);
	UI.getUI().SetModal("CommSceneUI", true);
	
	//清空数据
	clearSceneCopyData();
	
	//设置初始化状态
	_uiPage = CommSceneUIPage.SelectPage;
	
	//更新界面	
	updateUI();
	
	//
	//TODO: 请求列表.这是临时行为
	//reqSceneCopyList(1);
}

//关闭UI
function closeUI()
{
	//如果界面不存在, 则返回
	if(UI.getUI().GetUIRoot("CommSceneUI") == null)
		return;
	
	UI.getUI().SetModal("CommSceneUI", false);
	UI.getUI().EnableUIRoot("CommSceneUI",false);
}

//点击关闭选择场景的按钮
function clickSceneSelectUIClose()
{
	closeUI();
}

//点击关闭分线的按钮
function clickSceneCopyUIClose()
{
	closeUI();
}

//点击选择场景的图片
function clickSelectSceneImage(caller : iGUIElement)
{
	var tpltId : int = Convert.ToInt32(caller.userData);
	_sceneTplltId = tpltId;
	
	reqSceneCopyList(_sceneTplltId);
	
	clearSceneCopyData();
	_uiPage = CommSceneUIPage.CopyPage;
	
	updateUI();
}

function clickRefreshSceneButton()
{
	if(_sceneTplltId == -1)
		return;
		
	reqSceneCopyList(_sceneTplltId);
}

//同步界面UI
function updateUI()
{
	updateSceneSelectUI();
	updateSceneCopyUI();
}

function updateSceneSelectUI()
{
	if(_uiPage != CommSceneUIPage.SelectPage)
	{
		gui().SceneSelectPanel.setEnabled(false);
		return;
	}
	
	gui().SceneSelectPanel.setEnabled(true);
	
}

//更新分线面板
private static var SceneCopyListItemHeight : int = 29;
function updateSceneCopyUI()
{
	//如果不属于你的状态, 则隐藏
	if(_uiPage != CommSceneUIPage.CopyPage)
	{
		gui().SceneCopyPanel.setEnabled(false);
		return;
	}

	gui().SceneCopyPanel.setEnabled(true);
	
	var sceneListUI : iGUIListBox = gui().scSceneList;
	sceneListUI.removeAll();
	gui().SceneCopyPanel.label.text = "";
	
	if(_sceneCopyList == null)
	{
		return;
	}

	//
	var tpltId : int = _sceneCopyList.template_id;

	//快速进入
	var quick : iGUIButton = sceneListUI.addElement("iGUIButton") as iGUIButton;
	quick.userData = -1;
	quick.clickCallback = Click_SceneCopyButton;
	quick.label.text = Define.quicklyenter;
	setSceneCopyItemButtonStyle(quick, -2);
		
	//各个分线
	for(var i:int = 0; i < _sceneCopyList.state_list.Count; i++)
	{
		//var state : int = _sceneCopyList.state_list[i] as int;		//不能用
		//var state : int = int.Parse(_sceneCopyList.state_list[i]);	//不能用
		var state : int = Convert.ToInt32(_sceneCopyList.state_list[i]);
		var stateStr = getStateStr(state);
		var n : int = i + 1;
		var title = Define.getContent(5114, [n.ToString(), stateStr]);
		
		//
		var notice : iGUIButton = sceneListUI.addElement("iGUIButton") as iGUIButton;
		notice.userData = i;
		notice.clickCallback = Click_SceneCopyButton;
		notice.label.text = title;
		setSceneCopyItemButtonStyle(notice, state);
	}
}

//设置分线按钮的样式
function setSceneCopyItemButtonStyle(btn : iGUIButton, colorState : int)
{
	btn.labelColor = getStateColor(colorState);
	btn.setWidth(1.0f);
	btn.setHeight(SceneCopyListItemHeight);
	btn.style = gui().SceneCopyItemStyle;
}

function getStateColor(state:int):Color
{
	var co : Color = Color.white;
	switch(state)
	{
	case -1:
		co = Color.red;
		break;
	case 0:
		co = new Color(0/255.0f, 255.0f/255.0f, 36.0f/255.0f);
		break;
	case 1:
		co = new Color(239.0f/255.0f, 136.0f/255.0f, 5.0f/255.0f);
		break;
	case 2:
		co = Color.red;
		break;
	}
	
	return co;
	
}

//获取状态对应的名字
function getStateStr(state:int):String
{
	var retStr:String;

	switch(state)
	{
	case -1:
		retStr = Define.bug;
		break;
	case 0:
		retStr = Define.fluency;
		break;
	case 1:
		retStr = Define.crowd;
		break;
	case 2:
		retStr = Define.full;
		break;
	default:
		retStr = Define.errorcode;
		break;
	}
	
	return retStr;
}

function Click_SceneCopyButton(caller : iGUIElement){
	var copyId : int = Convert.ToInt32(caller.userData);
	Debug.Log(copyId);
	
	reqEnterCommonScene(_sceneTplltId, copyId);
}

//-------------网络,消息事件-------------------------------
function reqSceneCopyList(id:int)
{
	var packet:req_scene_copy_list = new req_scene_copy_list();
	packet.template_id = id;
	NetHelper.Send(packet);
}

function reqEnterCommonScene(tpltId:int, copyId:int)
{
	var packet:req_enter_common_scene = new req_enter_common_scene();
	packet.template_id = tpltId;
	packet.copy_id = copyId;
	NetHelper.Send(packet);
}

function notifySceneCopyList(vt:GameEvent, pack:notify_scene_copy_list)
{
	_sceneCopyList = pack;
	updateUI();
}

function notifyEnterCommonScene(vt:GameEvent, pack:notify_enter_common_scene)
{
	closeUI();
	
	//离开场景
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_LEAVE_SCENE));
	
	_currCommSceneInfo = pack;
	
	//
	var enterPos:Vector3 = Vector3(pack.enter_pos.x, pack.enter_pos.y, pack.enter_pos.z);
	ScenePlayerMgr.getMainPlayer().transform.position = enterPos;
	ScenePlayerMgr.clearPlayer();
	
	Debug.Log("love scene id: " + pack.template_id + "  copy id: " + pack.copy_id);
	
	//切换场景
	EQGameSceneMgr.getSingleton().enterCommScene(pack.template_id);
}

//收到离开场景时候的消息处理
function notifyLeaveScene(evt:GameEvent, obj:System.Object)
{
	clearSceneCopyData();
	_currCommSceneInfo = null;
}
