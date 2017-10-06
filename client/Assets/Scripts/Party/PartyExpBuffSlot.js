/*--------------------------------------------------
派对经验buff(2013/1/9 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast
import iGUI;


class PartyExpBuffSlot
{
	private var mIconLabel : iGUILabel = null;
	private var mCoverLabel : iGUILabel = null;
	private var mBuffId : int = 0;
	private var mExp : int = 0;
	private var mCur : int = 0;
	//--------------------------------------------------
	public function PartyExpBuffSlot(icon : iGUILabel, cover : iGUILabel)
	{
		mIconLabel = icon;
		mCoverLabel = cover;
		icon.mouseOverCallback = MouseOverCallback_icon;
		setVisible(false);
	}
	//--------------------------------------------------
	public function setContent(buff_id : int, exp : int, cur : int) : void
	{
		mBuffId = buff_id;
		mExp = exp;
		mCur = cur;
		setVisible(0 != buff_id);
		if (0 == buff_id)
		{
			mIconLabel.style.normal.background = null;
			return;
		}
		var row : EffectAvatarRow = ResManager.LgtMgr.getEffectAvatarRow(buff_id);
		mIconLabel.style.normal.background = Resources.Load("UISkins/Textures/MainUI/" + row.icon);
	}
	//--------------------------------------------------
	public function isBelong(buff_id : int) : boolean
	{
		return buff_id == mBuffId;
	}
	//--------------------------------------------------
	public function setActive(active : boolean) : void
	{
		if (mIconLabel.enabled)
		{
			mCoverLabel.setEnabled(!active);
		}
	}
	//--------------------------------------------------
	private function setVisible(visible : boolean) : void
	{
		mIconLabel.setEnabled(visible);
		mCoverLabel.setEnabled(visible);
	}
	//--------------------------------------------------
	private function MouseOverCallback_icon(caller : iGUIElement) : void
	{
		var content : String =  Define.getContent(5113, [mExp.ToString()]);
		//mCur.ToString()
		var style : GUIStyle = new GUIStyle(); 	
		style.alignment = TextAnchor.MiddleCenter;
		style.wordWrap = true;
		style.normal.textColor = Color(1.0f, 1.0f, 1.0f);
		style.fontStyle = FontStyle.Bold;
		Global.SysTooltip.Begin(caller);
		Global.SysTooltip.Add(GUIContent(content), style);
		Global.SysTooltip.Show(true);
	}
	//--------------------------------------------------
}


