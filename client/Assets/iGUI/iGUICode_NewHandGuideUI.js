import iGUI;

private static var instance : iGUICode_NewHandGuideUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}

@HideInInspector
var func_btn : iGUIButton;
@HideInInspector
var arrow_image : iGUIImage;
@HideInInspector
var arrow_panel : iGUIPanel;
@HideInInspector
var describe_label : iGUILabel;
@HideInInspector
var background_window : iGUIWindow;
@HideInInspector
var background_image : iGUIImage;
@HideInInspector
var root : iGUIRoot;



private var mAsynIcon : AsynIcon = null;
private var mCurModalUI : String = "";
//--------------------------------------------------
function Start() {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_UI_MODAL_STATE), handleUIModalState);
}
//--------------------------------------------------
function OnDestroy() {
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MSG_UI_MODAL_STATE), handleUIModalState);
	if (mAsynIcon) {
		mAsynIcon.cancel();
		mAsynIcon = null;
	}
}
//--------------------------------------------------
// 处理界面模态事件
private function handleUIModalState(evt : GameEvent, obj : System.Object) : void {
	if (UI.getUI().IsModal()) {
		if (UI.getUI().GetModalName() == mCurModalUI) {
			setWindowState();
		} else {
			background_window.setEnabled(false);
		}
	} else {
		setWindowState();
	}
}
//--------------------------------------------------
// 设置window控件状态
private function setWindowState() : void {
	var userData : boolean = background_window.userData;
	if (true == userData) {
		background_window.setEnabled(true);
		UI.getUI().SetTopDepth("NewHandGuideUI");
	}
	UI.getUI().SetPassive("NewHandGuideUI", false);
}
//--------------------------------------------------
// 设置新手引导界面是否为模态
public function setModalState(modal : boolean) : void {
	background_image.setEnabled(modal);
	background_window.setEnabled(modal);
	background_window.userData = modal;
	if (UI.getUI().IsModal()) {
		mCurModalUI = UI.getUI().GetModalName();
	}
	UI.getUI().SetIgnoreMouseOver(describe_label, !modal);
}
//--------------------------------------------------
// 显示提示图片
public function showTip(tipSrc : String, pos : Vector2) : void {
	if (null == tipSrc || "" == tipSrc || null == pos) {
		describe_label.setEnabled(false);
		return;
	}
	if (tipSrc.EndsWith(".u3d")) {	// 需要异步加载
		mAsynIcon = new AsynIcon(function (tex : Texture) {
			describe_label.style.normal.background = tex;
			describe_label.setWidth(tex.width);
			describe_label.setHeight(tex.height);
			describe_label.setX(pos.x);
			describe_label.setY(pos.y);
			describe_label.setEnabled(true);
		},
		null);
		mAsynIcon.load("UI/" + tipSrc);
	} else {	// 直接读取
		var tipTex : Texture = Resources.Load("UISkins/Textures/" + tipSrc);
		describe_label.style.normal.background = tipTex;
		describe_label.setWidth(tipTex.width);
		describe_label.setHeight(tipTex.height);
		describe_label.setX(pos.x);
		describe_label.setY(pos.y);
		describe_label.setEnabled(true);
	}
}
//--------------------------------------------------
// 显示箭头
public function showArrow(direction : String, pos : Vector2) : void {
	// 这里先隐藏
	arrow_image.setEnabled(false);
	arrow_panel.setEnabled(false);
	if (null == direction || "" == direction || null == pos) {
		return;
	}
	// step1: 一定要先设置父窗体的位置,否则图片位置会偏离
	arrow_panel.setX(pos.x);
	arrow_panel.setY(pos.y);
	arrow_panel.setEnabled(true);
	// step2:
	switch (direction) {
		case "toleft":
			arrow_image.setRotation(90);
			break;
		case "toright":
			arrow_image.setRotation(270);
			break;
		case "totop":
			arrow_image.setRotation(180);
			break;
		case "tobottom":
			arrow_image.setRotation(0);
			break;
	}
	arrow_image.setEnabled(true);
}
//--------------------------------------------------
// 显示按钮
public function showBtn(normal : String, hover : String, pos : Vector2) : iGUIButton {
	if (null == normal || "" == normal || null == hover || "" == hover ||  null == pos) {
		func_btn.setEnabled(false);
		return null;
	}
	var normalTex : Texture = Resources.Load("UISkins/Textures/" + normal);
	var hoverTex : Texture = Resources.Load("UISkins/Textures/" + hover);
	func_btn.style.normal.background = normalTex;
	func_btn.style.hover.background = hoverTex;
	func_btn.style.active.background = normalTex;
	func_btn.setWidth(normalTex.width);
	func_btn.setHeight(normalTex.height);
	func_btn.setX(pos.x);
	func_btn.setY(pos.y);
	func_btn.setEnabled(true);
	return func_btn;
}
//--------------------------------------------------


