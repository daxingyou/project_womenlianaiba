/*
--	说明：2012-1-9，把mShowPanel的类型由iGUIPanel改为iGUIWindow，原因是：在设置本Root的Depth时，当存在其他除MainUI之外的Root时，
不起作用，尽管Depth值比其他Root小，但是总是绘制在其他Root后面，虽然把Depth值设置成0能绘制在前面，但是设置本Root的自定义鼠标时
却不起作用，鼠标总是显示不出来。
	至于以后还会出现什么问题未知。
*/
#pragma strict
import iGUI;

//指向新手任务按钮
var arrow_direct : String = "toleft";
var img_name : String = "task-tip.png.u3d";
var arrow_pos : Vector2 = Vector2(54, 170);
var img_pos : Vector2 = Vector2(120, 85);
var lbl_pos_size : Rect = Rect(-3, 168, 51, 59);

var client_area_padding_top:float = 29f;
var win_pos_size:Rect = new Rect(0.5f,100f,318f,235f);
var imgFrame_pos_size:Rect = new Rect(19f,0f,260f,170f);
var btnFrame_pos_size:Rect = new Rect(0f,171f,1f,24f);
var btn_width:float = 76f;
var title_img:Texture2D;
var winStyle:GUIStyle;
var btnStyle:GUIStyle;
var btn_confirmImg:Texture2D;
var btn_continueImg:Texture2D;
var imgSet1:String[];
var imgSet2:String[];
var imgSet3:String[];
var imgSet4:String[];
var imgSet5:String[];
var imgSet6:String[];
var imgSet9:String[];
var imgSet10:String[];
private var btn_match_imgset_table:Hashtable = new Hashtable();
private var cur_imgSet:String[];
static var cur_guide_btnName:String = "";
private var mShowPanel:iGUIPanel = null;
static var cnt:int = 1;
private static var instance : iGUICode_NewGuideModalRoot;

function Awake(){
	instance=this;
	btn_match_imgset_table.Add("first_start_game",imgSet1);
	btn_match_imgset_table.Add("new_anniversary",imgSet2);
	btn_match_imgset_table.Add("old_anniversary_btn",imgSet3);
	btn_match_imgset_table.Add("love_btn",imgSet4);
	btn_match_imgset_table.Add("goods_btn",imgSet5);
	btn_match_imgset_table.Add("record_btn",imgSet6);
}
static function getInstance(){
	return instance;
}
@HideInInspector
var newGuideModalRoot : iGUIRoot;

//--打开第二阶段方式1
public function Tutorial_ShowPic(name:String)
{
	UI.getUI().SetTopDepth("NewGuideModalRoot");
	mShowPanel = _CreateShowPanel();
	cur_guide_btnName = name;
	cur_imgSet = btn_match_imgset_table.Item[name] as String[];
	if(cur_imgSet == null)
	{
		Debug.LogWarning("**********cur_imgSet is null ***********");
		return;
	}
	if(cur_imgSet.Length == 0)
	{
		Debug.LogWarning("*********************cur_imgSet Length is zero****************");
		return;
	}
	if(cur_imgSet.Length == 1)
		fillContent(cur_imgSet[0],btn_confirmImg,TutorialAnniversaryCallback);
	else
		fillContent(cur_imgSet[0],btn_continueImg,TutorialAnniversaryCallback);
}
//--
function TutorialAnniversaryCallback(caller:iGUIElement)
{
	if(cnt < cur_imgSet.Length)
	{
		if(cnt == cur_imgSet.Length-1)
			fillContent(cur_imgSet[cnt],btn_confirmImg,TutorialAnniversaryCallback);
		else
			fillContent(cur_imgSet[cnt],btn_continueImg,TutorialAnniversaryCallback);
		cnt++;
	}
	else
	{
		if(cur_guide_btnName != null && cur_guide_btnName != ""){
			switch(NewPlayGuideModule.btn_match_type_table.Item[cur_guide_btnName])
			{
				case NewPlayGuideModule.LEADTYPE:
					Tutorial_LeadStart();
					break;
				case NewPlayGuideModule.TUTORIALTYPE:
					_EndNewGuideSecondTutorialCallback(caller);
					break;
			}
		}
	}
}
//--开始第二阶段方式2
function Tutorial_LeadStart()
{
	if(DataCenter.isInSelfHouse()){
		var idx : int = 6;
		if(idx < HandleAfterLogin.playerGuideFlags.Count){
			if(HandleAfterLogin.playerGuideFlags[idx] == 0){
				UI.getUI().CloseNewGuideModalRoot();
				UI.getUI().OpenNewGuideLeadRoot();
				iGUICode_StepLeadRoot.getInstance().StartLead(arrow_pos, img_pos, lbl_pos_size, arrow_direct, img_name, 97);
				if(NewPlayGuideModule.cur_newhand_task_id > 0)
					EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.START_NEWHAND_TASK), NewPlayGuideModule.cur_newhand_task_id);
			}
		}
	}
}
//--创建新手窗口
private function _CreateShowPanel():iGUIPanel
{
	var win:iGUIPanel = newGuideModalRoot.addElement("iGUIPanel") as iGUIPanel;
	win.setPositionAndSize(win_pos_size);
	//win.type = iGUIPanelType.Box;
	win.padding.top = client_area_padding_top;
	if( title_img )
		win.label.image = title_img;
	win.style = winStyle;
	//信息框容器
	var container1:iGUIContainer = win.addElement("iGUIContainer") as iGUIContainer;
	container1.setPositionAndSize(imgFrame_pos_size);
	//图片框
	var img_frame:iGUIImage = container1.addElement("iGUIImage") as iGUIImage;
	img_frame.setPositionAndSize(Rect(0,0,1,1));
	img_frame.scaleMode = ScaleMode.ScaleToFit;
	//按钮容器
	var container2:iGUIContainer = win.addElement("iGUIContainer") as iGUIContainer;
	container2.setPositionAndSize(btnFrame_pos_size);
	//确定按钮
	var btn1:iGUIButton = container2.addElement("iGUIButton") as iGUIButton;
	btn1.setPositionAndSize(Rect(0.5f,0f,btn_width,1f));
	btn1.style = btnStyle;
	//btn1.label.text = "ok";
	btn1.label.image = btn_confirmImg;
	win.scaleTo(0f,1f,0f,0.4f,iTweeniGUI.EaseType.spring);

	return win;
}

function OnGUI()
{
//	if(mShowPanel)
//		mShowPanel.bringToFrontLate();
}
//--结束新手引导第二阶段显示图片
private function _EndNewGuideSecondTutorialCallback(caller:iGUIElement)
{
	caller.container.container.scaleTo(1f,0f,0f,0.4f,iTweeniGUI.EaseType.spring);
	yield WaitForSeconds(0.4f);
	newGuideModalRoot.removeElement(caller.container.container);
	Global.GetNewPlayGuideMgr().EndNewGuideSecondTutorial(cur_guide_btnName);
	if(cur_guide_btnName == "first_start_game"){
		Tutorial_LeadStart();
	}
	cur_imgSet = null;
	cur_guide_btnName = "";
	cnt = 1;
}
//--
public function EndNewGuideSecondLeadCallback()
{
	Global.GetNewPlayGuideMgr().EndNewGuideSecondLead(cur_guide_btnName);
	cur_imgSet = null;
	cur_guide_btnName = "";
	cnt = 1;
}
//--填写窗口显示内容
function fillContent(img_name:String,okTextrue:Texture2D,callback:iGUIEventCallback)
{
	if(mShowPanel == null)
	{
		Debug.LogError("创建新手引导窗口失败");
		return;
	}
	//显示第一步的图片
	var container1:iGUIContainer = null;
	var container2:iGUIContainer = null;
	var img_frame:iGUIImage = null;
	if(mShowPanel.items[0])
		container1 = mShowPanel.items[0] as iGUIContainer;
		container2 = mShowPanel.items[1] as iGUIContainer;
		if(mShowPanel.items[0].items[0])
		{
			img_frame = mShowPanel.items[0].items[0] as iGUIImage;
		}
	if(img_frame != null)
		if(img_name != "")
		{
			_LoadItemImg(img_frame, mShowPanel.items[0] as iGUIContainer, img_name);
		}
		else
			Debug.LogError("imgSet中不存在对应图片");
	//指定按钮回调
	var btn:iGUIButton = mShowPanel.items[1].items[0] as iGUIButton;
	if(btn == null)
	{
		Debug.LogError("按钮不存在");
		return;
	}
	if(okTextrue != null)
		btn.label.image = okTextrue;
	btn.clickCallback = callback;
	
}
//--
function _LoadItemImg(img_frm : iGUIImage, container : iGUIContainer, img_name : String){
	var _asynIcon : AsynIcon = new AsynIcon(function (img : Texture){if(img_frm){
																	 	img_frm.image = img;
																	 	img_frm.setHeight(img.height);}
																	 if(container)
																	 	container.setHeight(img.height);},
											null);
	_asynIcon.load("UI/" + img_name); 	
}