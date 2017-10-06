#pragma strict
#pragma downcast
import iGUI;


class YYChannelGuestSlot
{
	private var mGuestPanel : iGUIPanel = null;
	private var mPhotoLabel : iGUILabel = null;
	private var mNameLabel : iGUILabel = null;
	private var mLevelLabel : iGUILabel = null;
	private var mFollowBtn : iGUIButton = null;
	private var mKickBtn : iGUIButton = null;
	private var mGuestAsynInfo : PartySlotIcon = new PartySlotIcon();
	private var mGuestResLoader : PlatResLoader = null;
	private var mGuestInfo : pub_account_info = null;
	public static var Ctrl : Controller = new Controller();
	//--------------------------------------------------
	public function YYChannelGuestSlot(panel : iGUIPanel, click : iGUIImage, photo : iGUILabel, name : iGUILabel, 
									   visit : iGUIButton, follow : iGUIButton, info : iGUIButton, kick : iGUIButton, 
									   level : iGUILabel)
	{
		mGuestPanel = panel;
		mPhotoLabel = photo;
		mNameLabel = name;
		mLevelLabel = level;
		mFollowBtn = follow;
		mKickBtn = kick;
		mGuestAsynInfo.ImageElement = photo;
		click.clickCallback = ClickCallback_click;
		visit.clickCallback = ClickCallback_visit;
		follow.clickCallback = ClickCallback_follow;
		info.clickCallback = ClickCallback_info;
		kick.clickCallback = ClickCallback_kick;
	}
	//--------------------------------------------------
	public function setContent(info : pub_account_info) : void
	{
		mGuestInfo = info;
		if (null == info)
		{
			setVisible(false);
			if (mGuestResLoader)
			{
				Global.GetPlatResLoaderMgr().Remove(mGuestResLoader);
				mGuestResLoader = null;
			}
			mPhotoLabel.style.normal.background = null;
			mNameLabel.label.text = "";
			mLevelLabel.label.text = "";
			return;
		}
		mGuestResLoader = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(info.account, mGuestAsynInfo);
		mNameLabel.label.text = Global.limitTextLength(info.name, 6, Define.unknow, "...");
		mLevelLabel.label.text = "LV-" + info.level.ToString();
		mFollowBtn.setEnabled(false == ScenePlayerMgr.isMainPlayer(info.account));
		// 当前玩家是管理员
		if (YYChannelListLogic.getInstance().isAdmin())
		{
			mKickBtn.setEnabled(false == YYChannelListLogic.getInstance().isAdmin(info.account));
		}
		else
		{
			mKickBtn.setEnabled(false);
		}
		setVisible(true);
	}
	//--------------------------------------------------
	private function setVisible(visible : boolean) : void
	{
		mGuestPanel.setEnabled(visible);
	}
	//--------------------------------------------------
	private function ClickCallback_click(caller : iGUIElement) : void
	{
		Ctrl.Excute("CLICK_GUEST_SLOT", mGuestInfo);
	}
	//--------------------------------------------------
	private function ClickCallback_visit(caller : iGUIElement) : void
	{
		PlayerFriend.GetInstance().ReqEnterFriendHouse(mGuestInfo.account, enter_house_type.eht_yy_audio);
	}
	//--------------------------------------------------
	private function ClickCallback_follow(caller : iGUIElement) : void
	{
		FollowLogic.GetInstance().AddAttention(mGuestInfo.account);
	}
	//--------------------------------------------------
	private function ClickCallback_info(caller : iGUIElement) : void
	{
		PersonalInfo.getInstance().openUIByAccount(mGuestInfo.account);
	}
	//--------------------------------------------------
	private function ClickCallback_kick(caller : iGUIElement) : void
	{
		YYChannelListLogic.getInstance().reqKickChannelPlayer(mGuestInfo.account);
	}
	//--------------------------------------------------
}


