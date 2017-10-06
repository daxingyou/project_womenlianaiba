/*--------------------------------------------------
派对块(2012/7/9 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast
import iGUI;



class PartySlotIcon extends PlatResInfoCtrl
{
	private var mNameLength : int = 6;
	private var mNameDefault : String = Define.unknow;
	private var mNameSuffix : String = "...";
	
	public var ImageElement : iGUILabel = null;
	public var NameElement : iGUILabel = null;
	
	public function PartySlotIcon() {}
	
	public function PartySlotIcon(length : int, def : String, suffix : String)
	{
		mNameLength = length;
		mNameDefault = def;
		mNameSuffix = suffix;
	}
	
	//overwrite
	public function Callback()
	{
		if (ImageElement)
		{
			if (URLValid)
			{
				ImageElement.style.normal.background = image;
			}
			else
			{
				ImageElement.style.normal.background = Resources.Load("UISkins/Textures/Common1/default_avatar");
			}
		}
		if (NameElement)
		{
			NameElement.label.text = Global.limitTextLength(info.nickname, mNameLength, mNameDefault, mNameSuffix);
		}
	}
}



class PartySlot
{
	private var mItemPanel : iGUIPanel = null;
	private var mPhotoLabel : iGUILabel = null;
	private var mCreaterLabel : iGUILabel = null;
	private var mTitleLabel : iGUILabel = null;
	private var mDescribeLabel : iGUILabel = null;
	private var mPeopleLabel : iGUILabel = null;
	private var mJoinBtn : iGUIButton = null;
	private var mExpLabel : iGUILabel = null;
	private var mTimeLabel : iGUILabel = null;
	private var mAsynInfo : PartySlotIcon = new PartySlotIcon();
	private var mResLoader : PlatResLoader = null;
	private var mPartyData : party_data = null;
	//--------------------------------------------------
	function PartySlot(item_panel : iGUIPanel, photo_label : iGUILabel, creater_label : iGUILabel, title_label : iGUILabel, describe_label : iGUILabel, people_label : iGUILabel, join_btn : iGUIButton, exp_label : iGUILabel, time_label : iGUILabel)
	{
		mItemPanel = item_panel;
		mPhotoLabel = photo_label;
		mCreaterLabel = creater_label;
		mTitleLabel = title_label;
		mDescribeLabel = describe_label;
		mPeopleLabel = people_label;
		mJoinBtn = join_btn;
		mExpLabel = exp_label;
		mTimeLabel = time_label;
		describe_label.mouseOverCallback = System.Delegate.Combine(describe_label.mouseOverCallback, MouseOverCallback_describe_label as iGUIEventCallback);
		describe_label.mouseOutCallback = System.Delegate.Combine(describe_label.mouseOutCallback, MouseOutCallback_describe_label as iGUIEventCallback);
		join_btn.clickCallback = System.Delegate.Combine(join_btn.clickCallback, ClickCallback_join_btn as iGUIEventCallback);
		mAsynInfo.ImageElement = photo_label;
		mAsynInfo.NameElement = creater_label;
	}
	//--------------------------------------------------
	// 设置内容
	public function setContent(data : party_data) : void
	{
		// 清空
		if (null == data)
		{
			if (mResLoader)
			{
				Global.GetPlatResLoaderMgr().Remove(mResLoader);
				mResLoader = null;
			}
			mPartyData = null;
			mPhotoLabel.style.normal.background = null;
			mCreaterLabel.label.text = "";
			mTitleLabel.label.text = "";
			mDescribeLabel.label.text = "";
			mPeopleLabel.label.text = "";
			mExpLabel.label.text = "";
			mTimeLabel.label.text = "";
			return;
		}
		// 填充
		mPartyData = data;
		mResLoader = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(data.account,mAsynInfo);
		var title_text : String = Global.limitTextLength(data.title, 10, Define.unknow, "...");
		mTitleLabel.label.text = Global.GetKeyWordShield().Search(title_text);
		var describe_text : String = Global.limitTextLength(data.desc, 10, Define.unknow, "...");
		mDescribeLabel.label.text = Global.GetKeyWordShield().Search(describe_text);
		mPeopleLabel.label.text = Define.jionperson + "： " + data.cur_person.ToString() + "/" + data.max_person.ToString() + Define.person;
		mExpLabel.label.text = Define.scoregain + "： " + data.exp.ToString() + "/" + Define.times;
		mTimeLabel.label.text = Define.remaintime + "： " + Mathf.CeilToInt(data.rest_time / 60).ToString() + Define.minute;
		// 根据派对类型设置派对底框,1.普通派对,2.私人派对
		var bg : String = 1 == data.type ? "Common1/backgroud_blue" : "party/party_p";
		mItemPanel.style.normal.background = Resources.Load("UISkins/Textures/" + bg);
	}
	//--------------------------------------------------
	// 显示/隐藏
	public function setVisible(visible : boolean) : void
	{
		mItemPanel.setEnabled(visible);
	}
	//--------------------------------------------------
	// 鼠标移进派对描述控件上
	private function MouseOverCallback_describe_label(caller : iGUIElement)
	{
		if (null == mPartyData)
			return;
		
		var describe_text : String = Global.limitTextLength(mPartyData.desc, 10, Define.unknow, "...");
		var style : GUIStyle = new GUIStyle(); 	
		style.alignment = TextAnchor.MiddleLeft;
		style.normal.textColor = Color(1.0f, 1.0f, 1.0f);
		style.fontStyle = FontStyle.Bold;
		style.wordWrap = true;
		Global.SysTooltip.Begin(caller);
		Global.SysTooltip.Add(GUIContent(Global.GetKeyWordShield().Search(describe_text)), style);
		var x : float = caller.getAbsoluteRect().x;
		var y : float = caller.getAbsoluteRect().y + caller.getAbsoluteRect().height + 2.0f;
		Global.SysTooltip.Show(x, y);
		Party.Ctrl.Set("tooltip_element", caller);
	}
	//--------------------------------------------------
	// 鼠标移出派对描述控件上
	private function MouseOutCallback_describe_label(caller : iGUIElement)
	{
		Global.SysTooltip.Hide(caller);
		Party.Ctrl.Set("tooltip_element", null);
	}
	//--------------------------------------------------
	// 点击访问按钮
	private function ClickCallback_join_btn(caller : iGUIElement)
	{
		if (null == mPartyData)
			return;
		
		PlayerFriend.GetInstance().ReqEnterFriendHouse(mPartyData.account, enter_house_type.eht_party);
	}
	//--------------------------------------------------
}


