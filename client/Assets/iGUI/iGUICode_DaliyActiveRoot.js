#pragma strict
import iGUI;

class ImmediatePriceInfo{
	var delta_score : int = 0;
	var idx : int = 0;
}

var reward_score_imgs : Texture2D[];
var has_get_reward_btn_img : Texture2D;
var can_get_reward_btn_n_img : Texture2D;
var can_get_reward_btn_h_img : Texture2D;
var underway_btn_img : Texture2D;
var active_item_bg : Texture2D;
var active_item__btn_state_img : Texture2D;
var active_item_btn_state_img1 : Texture2D;

private var has_create_itms : boolean = false;
private var has_create_scores_list : boolean = false;
private var item_order : int = 1;
private var total_daily_point : int = 0;
private var can_get_reward_btn_num : int = 0;
private var has_get_reward_btn_num : int = 0;
private var has_reward_list : ArrayList = null;
private static var instance : iGUICode_DaliyActiveRoot;
function Awake(){
	instance=this;
	RegistEvt();
}
static function getInstance(){
	return instance;
}
@HideInInspector
var label1 : iGUILabel;
@HideInInspector
var rewards_listbox : iGUIListBox;
@HideInInspector
var items_container : iGUIListBox;
@HideInInspector
var close_btn : iGUIButton;
@HideInInspector
var points : iGUILabel;
@HideInInspector
var tip2 : iGUIImage;
@HideInInspector
var tip1 : iGUIImage;
@HideInInspector
var title_img : iGUIImage;
@HideInInspector
var daliyActivePanel : iGUIPanel;
@HideInInspector
var daliyActiveRoot : iGUIRoot;

function Start(){
	close_btn.clickCallback = ClickCallback_close_btn;
}

function RegistEvt(){
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.UPDATE_HAS_REWARD_LIST), HandleUpdateHasRewareList);	
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_HAS_REWARD_LIST), HandleNotifyHasRewareList);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_ACTIVE_SCORES), HandleNotifyActiveScores);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.NOTIFY_ACTIVE_ITEMS_DATA), HandleNotifyActiveItemsData);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.UPDATE_DAILY_TOTAL_POINT), UpdateDailyTotalPoint);
}

function HandleUpdateHasRewareList(evt : GameEvent, obj : Object){
	if(has_reward_list == null){
		return;
	}
	has_get_reward_btn_num = has_reward_list.Count;
	var list : ArrayList = obj as ArrayList;
	var list_cnt : int = list.Count;
	for(var i:int=0; i < list_cnt; ++ i){
		var get_reward_btn : iGUIButton = rewards_listbox.items[i].items[2] as iGUIButton;
		var match_score : int = Convert.ToInt32(get_reward_btn.userData);
		if(has_reward_list.Contains(match_score)){  //已领奖
			UpdateGetRewardBtnState(get_reward_btn, has_get_reward_btn_img, null, null);
		}
	}
}

function HandleNotifyHasRewareList(evt : GameEvent, obj : Object){
	var list : ArrayList = obj as ArrayList;
	has_reward_list = list;
}

function HandleNotifyActiveScores(evt : GameEvent, obj : Object){
	var reward_scores_list : ArrayList = obj as ArrayList;
	if(!has_create_scores_list){
		CreateRewardScoresList(reward_scores_list);
		UpdateRewardBtnState(reward_scores_list);
		has_create_scores_list = true;
	}
	else{
		UpdateRewardBtnState(reward_scores_list);
	}
}

function UpdateRewardBtnState(scores_list : ArrayList){
	var list_cnt : int = scores_list.Count;
	can_get_reward_btn_num = 0;
	for(var i:int=0; i < list_cnt; ++ i){
		var score : int = Convert.ToInt32(scores_list[i]);
		var get_reward_btn : iGUIButton = rewards_listbox.items[i].items[2] as iGUIButton;
		
		//比较大积分是否到了某个可领奖的分数，改变相应的状态为可领奖
		if(total_daily_point >= score){			//可领奖
			//todo 更换按钮状态图
			//todo 指定请求领奖回调函数
			++ can_get_reward_btn_num;
			UpdateGetRewardBtnState(get_reward_btn, can_get_reward_btn_n_img, can_get_reward_btn_h_img, Callback_get_reward_btn);
		}
		else{									//还在进行中
			//todo 更换按钮状态图
			//清空按钮回调
			UpdateGetRewardBtnState(get_reward_btn, underway_btn_img, null, null);
		}
	}
	UpdateHasRewardList(scores_list);
}

function UpdateGetRewardBtnState(btn : iGUIButton, n_bg : Texture2D, h_bg : Texture2D, callback : iGUIEventCallback){
	var tex_w : float = 50;
	var tex_h : float = 25;
	if(n_bg){
		tex_w = n_bg.width;
		tex_h = n_bg.height;
	}
	btn.setWidth(tex_w);
	btn.setHeight(tex_h);
	btn.style.normal.background = n_bg;
	btn.style.hover.background = h_bg;
	btn.style.active.background = h_bg;
	btn.clickCallback = callback;
}

function UpdateHasRewardList(list : ArrayList){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.UPDATE_HAS_REWARD_LIST), list);
}

function Callback_get_reward_btn(caller : iGUIElement){
	var score : int = Convert.ToInt32(caller.userData);
	ReqGetReward(score);
	++ has_get_reward_btn_num;
	var num : int = can_get_reward_btn_num - has_get_reward_btn_num;
	if(num <= 0)
		StopBtnFlash();
}

function StopBtnFlash(){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CANT_REWARD));
}

function ReqGetReward(score : int){
	var req : req_daily_reward = new req_daily_reward();
	req.score = score;
	NetHelper.Send(req);
}

function CreateRewardScoresList(scores_list : ArrayList){
	var list_cnt : int = scores_list.Count;
	for(var i:int=0; i < list_cnt; ++ i){
		var score : int = Convert.ToInt32(scores_list[i]);
		CreateRewardScoreItem(i, score);
	}
}

function CreateRewardScoreItem(idx : int, score : int){
	var score_item : iGUIPanel = rewards_listbox.addSmartObject("reward_score_item") as iGUIPanel;
	score_item.setOrder(item_order);
	var reward_img : iGUIImage = score_item.items[0] as iGUIImage;
	reward_img.userData = score;
	reward_img.mouseOverCallback = MouseOverCallback_RewardImg;
	score_item.items[2].userData = score;
	++ item_order;
	if(reward_score_imgs.Length == 0){
		return;
	}
	if(idx >= reward_score_imgs.Length){
		return;
	}
	//todo 下载图片，换上图片
	var img : Texture2D = reward_score_imgs[idx];
	var score_imgfrm : iGUIImage = score_item.items[1] as iGUIImage;
	score_imgfrm.image = img;
	score_imgfrm.setWidth(img.width);
	score_imgfrm.setHeight(img.height);
}

function MouseOverCallback_RewardImg(caller : iGUIElement){
	var items_desc : String = "";
	var diamond_desc : String = Define.crystal;
	var exp_desc : String = Define.exp;
	var point_desc : String = Define.score;
	var total_reward_desc : String = "";
	var score : int = Convert.ToInt32(caller.userData);
	var row : DailyActiveRewardRow = DailyActiveAwardComp.GetInstance().GetRewardRow(score);
	if(row.items.Count > 0){
		for(var i:int=0; i < row.items.Count; ++ i){
			var item_id : int = Convert.ToInt32(row.items[i]);
			if(item_id != 0){
				var num : int = Convert.ToInt32(row.item_counts[i]);
				var name : String = ResManager.LgtMgr.getItemRow(item_id).name;
				items_desc += num.ToString() + "个" + name + "\n";
				total_reward_desc += items_desc;
			}
		}
	}
	if(row.diamond > 0){
		diamond_desc += row.diamond;
		total_reward_desc += (diamond_desc + "\n");
	}
	if(row.exp > 0){
		exp_desc += row.exp;
		total_reward_desc += (exp_desc + "\n");
	}
	if(row.point > 0){
		point_desc += row.point;
		total_reward_desc += (point_desc);
	}
	
	var style : GUIStyle = new GUIStyle();
	style.normal.textColor = Color.white;
	style.fontStyle = FontStyle.Bold;
	style.alignment = TextAnchor.UpperCenter;
	Global.GetSysTooltip().Begin(caller);
	Global.GetSysTooltip().Add(GUIContent(total_reward_desc), style);
	Global.GetSysTooltip().Show(true);
	var x : float = caller.rect.x + caller.rect.width;
	var y : float = caller.positionAndSize.y + caller.getTargetContainer().positionAndSize.y + rewards_listbox.positionAndSize.y
					+ daliyActivePanel.positionAndSize.y;
	Global.GetSysTooltip().Show(x, y);
}

function HandleNotifyActiveItemsData(evt : GameEvent, obj : Object){
	var item_progress_list : ArrayList = obj as ArrayList;
	if(!has_create_itms){	//第一次打开界面用创建
		CreateProgressItems(item_progress_list);
		UpdateProgressDatas(item_progress_list);
		has_create_itms= true;
	}
	else{	//只创建一次，创建好后用更新数据
		UpdateProgressDatas(item_progress_list);
	}
}

function UpdateProgressDatas(list : ArrayList){
	var item_cnt : int = list.Count;
	var tmp_total_daily_point : int = 0;
	for(var i:int=0; i < item_cnt; ++ i){
		var idx : int = i + 1;
		var row : DailyRewardRow = GetDailyRewardRow(idx);
		var cur_score : int = Convert.ToInt32(list[i]);
		tmp_total_daily_point += cur_score;
		var max_score : int = row.max_score;
		var point_desc : String = cur_score.ToString() + "/" + max_score.ToString();
		var item : iGUIPanel = items_container.items[i] as iGUIPanel;
		//(item.items[0] as iGUILabel).label.text = Define.getContent(5135);
		//(item.items[0] as iGUILabel).setX(325);
		//(item.items[0] as iGUILabel).setWidth(80);
		var item_desc : iGUILabel = item.items[1] as iGUILabel;
		var desc_lbl : iGUILabel = item.items[2] as iGUILabel;
		var item_state_btn : iGUIButton = item.items[3] as iGUIButton;
		var immediateCompleteBtn : iGUIButton = item.items[4] as iGUIButton;
		item_desc.label.text = row.desc;
		desc_lbl.label.text = point_desc;
		if(cur_score == max_score){		//此条任务积分已完成
			ClearCallback(item_state_btn);
			immediateCompleteBtn.userData = null;
			immediateCompleteBtn.clickCallback = null;
			immediateCompleteBtn.setEnabled(false);
		}
		else{
			//todo 指定每个按钮样式、指定按钮回调
			AssignCallback(idx, item_state_btn);
			var priceInfo : ImmediatePriceInfo = new ImmediatePriceInfo();
			priceInfo.delta_score =  max_score - cur_score;
			priceInfo.idx = idx;
			immediateCompleteBtn.userData = priceInfo;
			immediateCompleteBtn.setEnabled(true);
			immediateCompleteBtn.clickCallback = Callback_immediateCompleteBtn;
		}
	}
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.UPDATE_DAILY_TOTAL_POINT), tmp_total_daily_point);
}

function Callback_immediateCompleteBtn(caller : iGUIElement){
	if(!caller.userData)
		return;
	
	var priceInfo : ImmediatePriceInfo = caller.userData as ImmediatePriceInfo;
	var price : int = priceInfo.delta_score;
	var idx : int = priceInfo.idx;
	Global.GetSysMsgHandler().RegistCallbackUserData(533, idx);
	var params : ArrayList = new ArrayList();
	params.Add(price);
	Global.GetSysMsgHandler().ShowSysMsg(533,params);
	
}

static function confirmCallback(caller : iGUIElement){
	var idx : int = Convert.ToInt32(caller.userData);
	iGUICode_DaliyActiveRoot.getInstance().reqImmediateComplete(idx);
}

static function cancelCallback(caller : iGUIElement){
	
}

function reqImmediateComplete(idx : int){
	var req : req_immediate_complete_daily_reward = new req_immediate_complete_daily_reward();
	req.index = idx;
	NetHelper.Send(req);
}

function CreateProgressItems(list : ArrayList){
	var itm_cnt : int = list.Count;
	for(var i:int=0; i < itm_cnt; ++ i){
		var idx : float = i + 1;
		CreateItem(idx);
	}
}

function UpdateDailyTotalPoint(evt : GameEvent, obj : Object){
	var point : int = Convert.ToInt32(obj);
	total_daily_point = point;
	points.label.text = total_daily_point.ToString();
}

function CreateItem(idx : float){
	var item_p : iGUIPanel = items_container.addSmartObject("active_item") as iGUIPanel;
	if(idx%2f == 0){	//偶数项
		item_p.style.normal.background = active_item_bg;
	}
	item_p.setOrder(item_order);
	++ item_order;
}

function ClearCallback(btn : iGUIButton){
	UpdateActiveItemBtnState(btn, active_item__btn_state_img, null, null);
}

function AssignCallback(idx : int, btn : iGUIButton){
	switch(idx){
		case 1:
			UpdateActiveItemBtnState(btn, active_item_btn_state_img1, null, GotoTaskCallback1);
			break;
		case 2:
			UpdateActiveItemBtnState(btn, active_item_btn_state_img1, null, GotoTaskCallback2);
			break;
		case 3:
			UpdateActiveItemBtnState(btn, active_item_btn_state_img1, null, GotoTaskCallback3);			
			break;
		case 4:
			UpdateActiveItemBtnState(btn, active_item_btn_state_img1, null, GotoTaskCallback4);			
			break;
		case 5:
			UpdateActiveItemBtnState(btn, active_item_btn_state_img1, null, GotoTaskCallback5);			
			break;
		case 6:
			UpdateActiveItemBtnState(btn, active_item_btn_state_img1, null, GotoTaskCallback6);			
			break;
		case 7:
			UpdateActiveItemBtnState(btn, active_item_btn_state_img1, null, GotoTaskCallback7);			
			break;
		case 8:
			UpdateActiveItemBtnState(btn, active_item_btn_state_img1, null, GotoTaskCallback8);			
			break;
		case 9:
			UpdateActiveItemBtnState(btn, active_item_btn_state_img1, null, GotoTaskCallback9);			
			break;
		case 10:
			UpdateActiveItemBtnState(btn, active_item_btn_state_img1, null, GotoTaskCallback10);			
			break;
		default:
			UpdateActiveItemBtnState(btn, active_item_btn_state_img1, null, null);	
	}
}

function UpdateActiveItemBtnState(btn : iGUIButton, n_bg : Texture2D, h_bg : Texture2D, callback : iGUIEventCallback){
		btn.style.normal.background = n_bg;
		btn.style.hover.background = h_bg;
		btn.style.active.background = h_bg;
		btn.clickCallback = callback;	
}

function GetDailyRewardRow(idx : int) : DailyRewardRow{
	var _t : Hashtable = ResManager.LgtMgr.DailyRewardTable;
	var row : DailyRewardRow = _t[idx] as DailyRewardRow;
	if(row == null){
		throw "DailyRewardTable Row: " + idx + " is not exist~";
	}
	
	return row;
}

function ClickCallback_close_btn(caller : iGUIElement){
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_DAILY_ACTIVE));
	daliyActivePanel.setEnabled(false);
	UI.getUI().SetModal("DaliyActiveRoot", false);
	//CloseRoot();
}

function GotoTaskCallback1(caller : iGUIElement){

}

function GotoTaskCallback2(caller : iGUIElement){

}

function GotoTaskCallback3(caller : iGUIElement){

}

function GotoTaskCallback4(caller : iGUIElement){

}

function GotoTaskCallback5(caller : iGUIElement){

}

function GotoTaskCallback6(caller : iGUIElement){

}

function GotoTaskCallback7(caller : iGUIElement){

}

function GotoTaskCallback8(caller : iGUIElement){

}

function GotoTaskCallback9(caller : iGUIElement){

}

function GotoTaskCallback10(caller : iGUIElement){

}

static function OpenRoot(){
	return;
	if(!UI.getUI().GetUIRoot("DaliyActiveRoot"))
		UI.getUI().OpenUIRoot("DaliyActiveRoot");
	iGUICode_DaliyActiveRoot.getInstance().daliyActivePanel.setEnabled(true);
	UI.getUI().SetModal("DaliyActiveRoot", true);
	/*if (10005 == NewPlayGuideModule.CurNewHandSuffix)
	{
		UI.getUI().SetTopDepth("StepLeadRoot");
	}*/
}

static function CloseRoot(){
	if(UI.getUI().GetUIRoot("DaliyActiveRoot"))
		UI.getUI().CloseUIRoot("DaliyActiveRoot");

}
