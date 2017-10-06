#pragma strict

import iGUI;

var padding_left : int = 0;
var padding_right : int = 0;
var padding_top : int = 0;
var padding_bottom : int = 0;
var child_h_padding : int = 3;
var show_btn_cul : float = 3;
private var show_btn_row : int = 0;
private var is_auto_close_panel : boolean = true;
private static var instance : iGUICode_SelfAnimationRoot;
function Awake(){
	instance=this;
	//LOAD_SELF_ANI_ARRAY_OK
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.LOAD_FREE_SELF_ANI_ARRAY_OK), HandleLoadFreeSelfAniArray);
}
static function getInstance(){
	return instance;
}
@HideInInspector
var image2 : iGUIImage;
@HideInInspector
var image1 : iGUIImage;

@HideInInspector
var freeAniPanel : iGUIPanel;
@HideInInspector
var selfAniTypeTabPanel : iGUITabPanel;
@HideInInspector
var selfAniPanel : iGUIWindow;
@HideInInspector
var selfAnimationRoot : iGUIRoot;

//
class AniStruct{
	var ani : String;
	var loop_type : WrapMode;
	var tip : String;
	public function AniStruct(ani : String, loop_type : WrapMode, tip : String){
		this.ani = ani;
		this.loop_type = loop_type;
		this.tip = tip;
	}
}
function Start(){

}
//--
function AddAniBtn(row : SelfAnimationRow, w : int, h : int, posx : float, posy : float) : iGUIButton {
	var ani_btn : iGUIButton = freeAniPanel.addElement("iGUIButton") as iGUIButton;
	ani_btn.setWidth(w);
	ani_btn.setHeight(h);
	ani_btn.setX(posx);
	ani_btn.setY(posy);
	ani_btn.style.normal.background = Resources.Load("UISkins/Textures/self_animation/"+ row.btn_n_icon) as Texture2D;
	ani_btn.style.hover.background = Resources.Load("UISkins/Textures/self_animation/"+ row.btn_h_icon) as Texture2D;
	ani_btn.style.active.background = Resources.Load("UISkins/Textures/self_animation/"+ row.btn_p_icon) as Texture2D;
	//ani_btn.label.tooltip = row.tip;
	var ani_name : String = row.ani_name;
	ani_name = ani_name.Trim();
	var loop_type : WrapMode = WrapMode.Once;
	if(row.loop_type == 0){
		loop_type = WrapMode.Once;
	}
	else if(row.loop_type == 1){
		loop_type = WrapMode.Loop;
	}
	var ani_info : AniStruct = new AniStruct(ani_name, loop_type, row.tip);
	ani_btn.userData = ani_info;
	ani_btn.clickCallback = ClickCallback_ani_btn;
	//ani_btn.mouseOverCallback = MouseOverCallback_ani_btn;
	return ani_btn;
}
//--
function MouseOverCallback_ani_btn(caller : iGUIElement){
	var data : AniStruct = caller.userData as AniStruct;
	var tip : String = data.tip;
	_showAniBtnTooltip(caller, tip);
}
//--
function _showAniBtnTooltip(ele : iGUIElement, text : String){
	var style : GUIStyle = new GUIStyle();
	style.normal.textColor = Color.white;
	style.fontStyle = FontStyle.Bold;
	Global.SysTooltip.Begin(ele);
	Global.SysTooltip.Add(GUIContent(text),style); 	
	Global.SysTooltip.Show(true);
}
//--
function ClickCallback_ani_btn(caller : iGUIElement){
	is_auto_close_panel = false;
	selfAniPanel.enabled = false;
	var _ani_struct : AniStruct = caller.userData as AniStruct;
	var mainPlayerObj:GameObject = ScenePlayerMgr.getMainPlayer();
	var main_player_com : MainPlayer = mainPlayerObj.GetComponent("MainPlayer") as MainPlayer;
	var com : Player = mainPlayerObj.GetComponent("Player") as Player;
	var player_move_comp : PlayerMove = mainPlayerObj.GetComponent("PlayerMove") as PlayerMove;
	if(player_move_comp.GetIsMoving()){
		var pos : Vector3 = mainPlayerObj.transform.position;
		MainPlayer.request_stop_walk(pos);
		//CLICK_PLAY_SANI
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_PLAY_SANI), _ani_struct);
		return;
	}
	com.play(_ani_struct.ani, _ani_struct.loop_type);
	//SUBMIT_REQ_START_PLAY_SANI
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.SUBMIT_REQ_START_PLAY_SANI), _ani_struct);
}
//--
function HandleLoadFreeSelfAniArray(evt : GameEvent, obj : Object){
	var free_ani_t : Array = obj as Array;
	var t_cnt : float = free_ani_t.Count;
	//Debug.Log("+++++++++free_ani_t.Count+++++++++++" + t_cnt);
	if(t_cnt == 0){
		Debug.LogWarning("free_ani_t.Count is zero");
		return;
	}
	var _result : float = t_cnt / show_btn_cul;
	show_btn_row = System.Math.Ceiling(_result);
	//for(var _itm : SelfAnimationRow in free_ani_t){
		var _first_itm : SelfAnimationRow = free_ani_t[0] as SelfAnimationRow;
		var btn_img : Texture2D = Resources.Load("UISkins/Textures/self_animation/"+ _first_itm.btn_n_icon) as Texture2D;
		var btn_w : int = 20;
		var btn_h : int = 20;
		if(btn_img){
			btn_w = btn_img.width;
			btn_h = btn_img.height;
		}
		
		for(var _r_cnt:int=0; _r_cnt < show_btn_row; ++ _r_cnt){
			for(var _c_cnt:int=0; _c_cnt < show_btn_cul; ++ _c_cnt){
				var posx : float = _c_cnt * btn_w;
				var posy : float = _r_cnt * btn_h;
				var idx : int = show_btn_cul * _r_cnt + _c_cnt;
				if(idx >= 0 && idx < t_cnt){
					var _ani_itm : SelfAnimationRow = free_ani_t[idx] as SelfAnimationRow;
					AddAniBtn(_ani_itm, btn_w, btn_h, posx, posy);
				}
			}
		}
		ResetPanelSize();
	//}
}
//--
function ResetPanelSize(){
	if(freeAniPanel.itemCount == 0){
		return;
	}
	var _ele : iGUIElement = freeAniPanel.items[0];
	var _ele_w : float = _ele.positionAndSize.width;
	var _ele_h : float = _ele.positionAndSize.height;
	var p_w : float = _ele_w * show_btn_cul + freeAniPanel.padding.left + freeAniPanel.padding.right;
	var p_h : float = _ele_h * show_btn_row + freeAniPanel.padding.top + freeAniPanel.padding.bottom;
	freeAniPanel.setWidth(p_w);
	freeAniPanel.setHeight(p_h);
	image2.setY(p_h + child_h_padding);
	//selfAniTypeTabPanel.setWidth(p_w + );
	//selfAniTypeTabPanel.setHeight(p_h + 25);
	selfAniPanel.setWidth(p_w + selfAniPanel.padding.left + selfAniPanel.padding.right);
	selfAniPanel.setHeight(p_h + child_h_padding + image2.positionAndSize.height + selfAniPanel.padding.top + selfAniPanel.padding.bottom);
}
//--
public static function OpenSelfAnimaitionRoot(x : float, y : float, w : float){
	if(!UI.getUI().GetUIRoot("SelfAnimationRoot"))
		UI.getUI().OpenUIRoot("SelfAnimationRoot");
	var com : SelfAnimationComp = GameObject.Find("Global").GetComponent(SelfAnimationComp) as SelfAnimationComp;
	com.LoadSelfAnimations();
	iGUICode_SelfAnimationRoot.getInstance().OpenSelfAniListPanel(x, y, w);
}
//--
function OpenSelfAniListPanel(x : float, y : float, w : float){
	var p_pos_x : float =(x + w / 2) - selfAniPanel.positionAndSize.width / 2;
	var p_pos_y : float = y - selfAniPanel.positionAndSize.height;
	selfAniPanel.setX(p_pos_x);
	selfAniPanel.setY(p_pos_y);
	is_auto_close_panel = false;
	selfAniPanel.enabled = true;
}
//--
function Update(){
	if(Input.GetMouseButtonUp(0)){
		if(is_auto_close_panel){
			selfAniPanel.enabled = false;
		}
		else{
			is_auto_close_panel = true;
		}
	}
	else{
		is_auto_close_panel = true;
	}
}