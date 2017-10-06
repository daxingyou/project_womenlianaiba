import iGUI;

private static var instance : iGUICode_SummonUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var uf_close_btn : iGUIButton;
@HideInInspector
var upgrade_frame : iGUIPanel;
//
@HideInInspector
var sf_close_btn : iGUIButton;
@HideInInspector
var share_frame : iGUIPanel;
// 
@HideInInspector
var item_exp5 : iGUILabel;
@HideInInspector
var item_exp_icon5 : iGUILabel;
@HideInInspector
var item_exp_tip5 : iGUILabel;
@HideInInspector
var item_crystal5 : iGUILabel;
@HideInInspector
var item_crystal_icon5 : iGUILabel;
@HideInInspector
var item_crystal_tip5 : iGUILabel;
@HideInInspector
var item_progress_label5 : iGUILabel;
@HideInInspector
var item_progress5 : iGUILabel;
@HideInInspector
var item_progress_panel5 : iGUIPanel;
@HideInInspector
var item_level5 : iGUILabel;
@HideInInspector
var item_name5 : iGUILabel;
@HideInInspector
var item_photo5 : iGUILabel;
@HideInInspector
var item_tip5 : iGUILabel;
@HideInInspector
var item_count5 : iGUILabel;
@HideInInspector
var item_star5 : iGUILabel;
@HideInInspector
var item_panel5 : iGUIPanel;
@HideInInspector
var item_exp4 : iGUILabel;
@HideInInspector
var item_exp_icon4 : iGUILabel;
@HideInInspector
var item_exp_tip4 : iGUILabel;
@HideInInspector
var item_crystal4 : iGUILabel;
@HideInInspector
var item_crystal_icon4 : iGUILabel;
@HideInInspector
var item_crystal_tip4 : iGUILabel;
@HideInInspector
var item_progress_label4 : iGUILabel;
@HideInInspector
var item_progress4 : iGUILabel;
@HideInInspector
var item_progress_panel4 : iGUIPanel;
@HideInInspector
var item_level4 : iGUILabel;
@HideInInspector
var item_name4 : iGUILabel;
@HideInInspector
var item_photo4 : iGUILabel;
@HideInInspector
var item_tip4 : iGUILabel;
@HideInInspector
var item_count4 : iGUILabel;
@HideInInspector
var item_star4 : iGUILabel;
@HideInInspector
var item_panel4 : iGUIPanel;
@HideInInspector
var item_exp3 : iGUILabel;
@HideInInspector
var item_exp_icon3 : iGUILabel;
@HideInInspector
var item_exp_tip3 : iGUILabel;
@HideInInspector
var item_crystal3 : iGUILabel;
@HideInInspector
var item_crystal_icon3 : iGUILabel;
@HideInInspector
var item_crystal_tip3 : iGUILabel;
@HideInInspector
var item_progress_label3 : iGUILabel;
@HideInInspector
var item_progress3 : iGUILabel;
@HideInInspector
var item_progress_panel3 : iGUIPanel;
@HideInInspector
var item_level3 : iGUILabel;
@HideInInspector
var item_name3 : iGUILabel;
@HideInInspector
var item_photo3 : iGUILabel;
@HideInInspector
var item_tip3 : iGUILabel;
@HideInInspector
var item_count3 : iGUILabel;
@HideInInspector
var item_star3 : iGUILabel;
@HideInInspector
var item_panel3 : iGUIPanel;
@HideInInspector
var item_exp2 : iGUILabel;
@HideInInspector
var item_exp_icon2 : iGUILabel;
@HideInInspector
var item_exp_tip2 : iGUILabel;
@HideInInspector
var item_crystal2 : iGUILabel;
@HideInInspector
var item_crystal_icon2 : iGUILabel;
@HideInInspector
var item_crystal_tip2 : iGUILabel;
@HideInInspector
var item_progress_label2 : iGUILabel;
@HideInInspector
var item_progress2 : iGUILabel;
@HideInInspector
var item_progress_panel2 : iGUIPanel;
@HideInInspector
var item_level2 : iGUILabel;
@HideInInspector
var item_name2 : iGUILabel;
@HideInInspector
var item_photo2 : iGUILabel;
@HideInInspector
var item_tip2 : iGUILabel;
@HideInInspector
var item_count2 : iGUILabel;
@HideInInspector
var item_star2 : iGUILabel;
@HideInInspector
var item_panel2 : iGUIPanel;
@HideInInspector
var item_exp1 : iGUILabel;
@HideInInspector
var item_exp_icon1 : iGUILabel;
@HideInInspector
var item_exp_tip1 : iGUILabel;
@HideInInspector
var item_crystal1 : iGUILabel;
@HideInInspector
var item_crystal_icon1 : iGUILabel;
@HideInInspector
var item_crystal_tip1 : iGUILabel;
@HideInInspector
var item_progress_label1 : iGUILabel;
@HideInInspector
var item_progress1 : iGUILabel;
@HideInInspector
var item_progress_panel1 : iGUIPanel;
@HideInInspector
var item_level1 : iGUILabel;
@HideInInspector
var item_name1 : iGUILabel;
@HideInInspector
var item_photo1 : iGUILabel;
@HideInInspector
var item_tip1 : iGUILabel;
@HideInInspector
var item_count1 : iGUILabel;
@HideInInspector
var item_star1 : iGUILabel;
@HideInInspector
var item_panel1 : iGUIPanel;
@HideInInspector
var tip_label1 : iGUILabel;
@HideInInspector
var title_label : iGUILabel;
@HideInInspector
var close_btn : iGUIButton;
@HideInInspector
var frame : iGUIPanel;
@HideInInspector
var root : iGUIRoot;



public static var frameFlag : int = 0;	// 0,打开frame;1打开share_frame
//--------------------------------------------------
function Start()
{
	// 界面事件注册
	close_btn.clickCallback = ClickCallback_close_btn;
	sf_close_btn.clickCallback = ClickCallback_close_btn;
	uf_close_btn.clickCallback = ClickCallback_close_btn;
	// 初始
	if (0 == frameFlag)
	{
		frame.setEnabled(true);
		share_frame.setEnabled(false);
		upgrade_frame.setEnabled(false);
		init();
	}
	else if (1 == frameFlag)
	{
		frame.setEnabled(false);
		share_frame.setEnabled(true);
		upgrade_frame.setEnabled(false);
	}
	else if (2 == frameFlag)
	{
		frame.setEnabled(false);
		share_frame.setEnabled(false);
		upgrade_frame.setEnabled(true);
	}
}
//--------------------------------------------------
function ClickCallback_close_btn(caller : iGUIElement)
{
	UI.getUI().SetModal("SummonUI", false);
	UI.getUI().CloseUIRoot("SummonUI");
}
//--------------------------------------------------
private function init() : void
{
	hideControls();
	// 
	var totalAppraise : int = SpriteLogic.getInstance().getTotalAppraise();
	var spriteList : Array = SpriteLogic.getInstance().getSprites();
	for (var i:int = 0; i<spriteList.Count; ++i)
	{
		var spr : sprite = spriteList[i];
		var nsr : NormalSpriteRow = ResManager.LgtMgr.getNormalSpriteRow(spr.id);
		var sur : SpriteUpgradeRow = ResManager.LgtMgr.getSpriteUpgradeRow(spr.id, spr.level);
		var isAppraiseEnough : boolean = totalAppraise >= nsr.appraise;	// 评价分数是否足够
		// 
		var elements : iGUIElement[] = getControls(i);
		elements[0].setEnabled(true);
		elements[1].setEnabled(isAppraiseEnough);
		elements[2].setEnabled(!isAppraiseEnough);
		elements[2].label.text = totalAppraise.ToString() + "/" + nsr.appraise.ToString();	// 评价分数
		elements[3].label.text = spr.level.ToString();	// 等级
		SpriteLogic.setProgress(elements[4], elements[5], spr.curr_exp, sur.show_count);	// 次数进度条
		elements[6].label.text = sur.award_money.ToString();	// 水晶奖励
		elements[7].label.text = sur.award_exp.ToString();	// 经验奖励
		elements[8].style.normal.background = Resources.Load(SpriteLogic.getSpriteInfo(spr.id)[0]);	// 精灵图标
	}
}
//--------------------------------------------------
private function hideControls() : void
{
	for (var i:int = 0; i<5; ++i)
	{
		var elements : iGUIElement[] = getControls(i);
		elements[0].setEnabled(false);
	}
}
//--------------------------------------------------
private function getControls(index : int) : iGUIElement[]
{
	if (0 == index) return [item_panel1, item_tip1, item_count1, item_level1, item_progress1, item_progress_label1, item_crystal1, item_exp1, item_photo1];
	if (1 == index) return [item_panel2, item_tip2, item_count2, item_level2, item_progress2, item_progress_label2, item_crystal2, item_exp2, item_photo2];
	if (2 == index) return [item_panel3, item_tip3, item_count3, item_level3, item_progress3, item_progress_label3, item_crystal3, item_exp3, item_photo3];
	if (3 == index) return [item_panel4, item_tip4, item_count4, item_level4, item_progress4, item_progress_label4, item_crystal4, item_exp4, item_photo4];
	// 4 == index
	return [item_panel5, item_tip5, item_count5, item_level5, item_progress5, item_progress_label5, item_crystal5, item_exp5, item_photo5];
}
//--------------------------------------------------

