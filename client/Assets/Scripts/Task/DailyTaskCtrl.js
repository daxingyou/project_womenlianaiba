#pragma strict
#pragma downcast



//日常任务控件
class DailyTaskCtrl
{
	var basePanel : iGUIPanel;
	var taskImg : iGUILabel;
	var taskImgMark : iGUILabel;
	var taskTitle : iGUILabel;
	var tsakContent : iGUILabel;
	var taskPrizeDiamond : iGUILabel;
	var taskPrizeExp : iGUILabel;
	var taskGetPrize : iGUIButton;
	var taskChange : iGUIButton;
	var taskCompleteImm : iGUIButton;
	var taskStep : iGUILabel;
	var background : iGUILabel;
	
	var icon : AsynIcon = new AsynIcon(iconCallback, Resources.Load("UISkins/Textures/Common1/box2"));
	var lastChangeTime : float = 0;
	var lastCompleteTime : float = 0;
	
	function iconCallback(tex:Texture) {
		taskImg.style.normal.background = tex;
	}
	
	function clear() {
		icon.cancel();
	}
	
	//temp
	var tempicon : iGUILabel;
	var tempx : iGUILabel;
	var tempPrize : iGUILabel;
}

