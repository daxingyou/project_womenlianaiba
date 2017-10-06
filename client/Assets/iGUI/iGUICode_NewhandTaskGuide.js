import iGUI;

private static var instance : iGUICode_NewhandTaskGuide;
function Awake(){
	instance=this;
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.EXTENAL_CLOSE_NEWGUIDEWIN), HandleExtenalCloseWin);
}
static function getInstance(){
	return instance;
}
@HideInInspector
var image1 : iGUIImage;
@HideInInspector
var newhandtaskguide_root : iGUIRoot;

static var cnt:int = 1;
public var mShowPanel:iGUIPanel = null;
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
private var cur_imgSet:String[];
private static var to_post_close_evt : boolean = false;
public var mExtenalClosed : boolean = false;

//--
function HandleExtenalCloseWin(evt : GameEvent, obj : Object){
	if(iGUICode_NewhandTaskGuide.getInstance()){
		iGUICode_NewhandTaskGuide.getInstance().mExtenalClosed = true;
		iGUICode_NewhandTaskGuide.getInstance().CloseNewhandWin(iGUICode_NewhandTaskGuide.getInstance().mShowPanel);
	}
}
//--
public function NewhandTaskGuide_ShowPic(imgSet:String[], need_pos : boolean, pos : Vector2, btn_visible : boolean, need_tex_ania : boolean)
{
	UI.getUI().SetTopDepth("NewhandTaskGuide");
	cur_imgSet = imgSet;
	if(!mShowPanel){
		mShowPanel = _CreateShowPanel(btn_visible, need_tex_ania);
	}
	if(!need_pos){
		mShowPanel.setPositionAndSize(win_pos_size);
	}
	else{
		mShowPanel.setPosition(pos);
	}
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
	else{
		fillContent(cur_imgSet[0],btn_continueImg,TutorialAnniversaryCallback);
		addTextureAnimation(need_tex_ania);
	}
}
//--
function addTextureAnimation(need_tex_anim : boolean){
	if(need_tex_anim){
		var img_frame:iGUIImage = null;
		if(mShowPanel.items[0]){
			if(mShowPanel.items[0].items[0]){
				img_frame = mShowPanel.items[0].items[0];
				_LoadTextureAnimImg(img_frame, cur_imgSet[0]);
				_LoadTextureAnimImg(img_frame, cur_imgSet[1]);
			}
		}
	}
}
//--
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
	if(mShowPanel.items[0]){
		container1 = mShowPanel.items[0];
		if(mShowPanel.items[0].items[0]){
			img_frame = mShowPanel.items[0].items[0];
		}
	}
	if(mShowPanel.itemCount > 1){
		if(mShowPanel.items[1]){
			container2 = mShowPanel.items[1];
		}
	}
	if(img_frame != null){
		if(img_name != ""){
			_LoadItemImg(img_frame, img_name);
			//调整控件位置和大小
			//img_frame.setWidth(img.width);
			//img_frame.setX(container1.positionAndSize.width/2-img.width/2);
			//var panel_height:float = container1.positionAndSize.height + container2.positionAndSize.height+35;
			//mShowPanel.setHeight(panel_height);
		}
		else{
			Debug.LogError("imgSet中不存在对应图片");
		}
	}
	//指定按钮回调
	if(container2){
		var btn:iGUIButton = mShowPanel.items[1].items[0];
		if(btn == null)
		{
			Debug.LogError("按钮不存在");
			return;
		}
		if(okTextrue != null)
			btn.label.image = okTextrue;
		btn.clickCallback = callback;
	}
}
//--
function _LoadItemImg(img_frm : iGUIImage, img_name : String){
	var _asynIcon : AsynIcon = new AsynIcon(function (img : Texture){img_frm.image = img;
																	 img_frm.setHeight(img.height);
																	 img_frm.getTargetContainer().setHeight(img.height);},
											null);
	_asynIcon.load("UI/" + img_name); 	
}
//--
private function _LoadTextureAnimImg(img_frm : iGUIImage, img_name : String){
	var _asynIcon : AsynIcon = new AsynIcon(function (img : Texture){
																	  	var tex_anim : iGUITextureAnimation = 
																	  		img_frm.getTextureAnimation("newHandGuideTex");
																	  	if(tex_anim){
																	  		tex_anim.images.Add(img);
																	  		if(tex_anim.state != iGUITextureAnimationState.Playing){
																	  			tex_anim.play();
																	  		}
																	  	}
																	 },
											null);
	_asynIcon.load("UI/" + img_name); 	
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
		if(to_post_close_evt){
			EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLOSE_NEWHANDTASKGUIDEROOT));
		}
		CloseNewhandWin(caller);
	}
}
//--
function CloseNewhandWin(caller : iGUIElement){
	cnt = 1;
	if(!mExtenalClosed){
		caller.container.container.scaleTo(1f,0f,0f,0.4f,iTweeniGUI.EaseType.spring);
	}
	else{
		if(caller){
			caller.scaleTo(1f,0f,0f,0.4f,iTweeniGUI.EaseType.spring);
		}
		mExtenalClosed = false;
	}
	yield WaitForSeconds(0.4f);
	CloseNewhandTaskGuideRoot();
}
//--
private function _CreateShowPanel(btn_visible : boolean, need_tex_ania : boolean):iGUIPanel
{
	var win:iGUIPanel = newhandtaskguide_root.addElement("iGUIPanel");
	win.setPositionAndSize(win_pos_size);
	//win.type = iGUIPanelType.Box;
	win.padding.top = client_area_padding_top;
	if( title_img )
		win.label.image = title_img;
	win.style = winStyle;
	//信息框容器
	var container1:iGUIContainer = win.addElement("iGUIContainer");
	container1.setPositionAndSize(imgFrame_pos_size);
	//图片框
	var img_frame:iGUIImage = container1.addElement("iGUIImage");
	img_frame.setPositionAndSize(Rect(0,0,1,1));
	img_frame.scaleMode = ScaleMode.ScaleToFit;
	if(need_tex_ania){
		var img_tex_anim : iGUITextureAnimation = img_frame.addTextureAnimation();
		img_tex_anim.name = "newHandGuideTex";
		//img_tex_anim.images.Add(null);
		//img_tex_anim.images.Add(null);
		//img_tex_anim.autoPlay = true;
		img_tex_anim.framesPerSecond = 0.25;
		img_tex_anim.loopType = iGUITextureAnimationLoopType.Loop;
		img_tex_anim.targetField = "image";
	}
	if(btn_visible){
		//按钮容器
		var container2:iGUIContainer = win.addElement("iGUIContainer");
		container2.setPositionAndSize(btnFrame_pos_size);
		//确定按钮
		var btn1:iGUIButton = container2.addElement("iGUIButton");
		btn1.setPositionAndSize(Rect(0.5f,0f,btn_width,1f));
		btn1.style = btnStyle;
		//btn1.label.text = "ok";
		btn1.label.image = btn_confirmImg;
	}

	win.scaleTo(0f,1f,0f,0.4f,iTweeniGUI.EaseType.spring);

	return win;
}
//--
function OnGUI()
{
//	if(mShowPanel)
//		mShowPanel.bringToFrontLate();
}

//--
static function OpenNewhandTaskGuideRoot(f : boolean, m : boolean){
	to_post_close_evt = f;
	if(!UI.getUI().GetUIRoot("NewhandTaskGuide"))
	{
		UI.getUI().OpenUIRoot("NewhandTaskGuide");
		iGUICode_NewhandTaskGuide.getInstance().image1.setEnabled(m);
	} 
	else{
		iGUICode_NewhandTaskGuide.getInstance().image1.setEnabled(m);
	}
	UI.getUI().SetModal("NewhandTaskGuide", m);
}
//--
static function CloseNewhandTaskGuideRoot(){
	to_post_close_evt = false;
	if(UI.getUI().GetUIRoot("NewhandTaskGuide"))
	{
		if(iGUICode_NewhandTaskGuide.getInstance().mShowPanel){
			iGUICode_NewhandTaskGuide.getInstance().mShowPanel = null;
		}
		UI.getUI().SetModal("NewhandTaskGuide", false);
		UI.getUI().CloseUIRoot("NewhandTaskGuide");
	}
}