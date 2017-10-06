/*--------------------------------------------------
排行榜块(2012/7/4 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast
import iGUI;

class RankListSlotIcon extends PlatResInfoCtrl {
	public var imageElement : iGUILabel;
	public var nameElement : iGUILabel;
	
	//overwrite
	public function Callback() {
		if(URLValid) {
			imageElement.style.normal.background = image;
		} else {
			imageElement.style.normal.background = Resources.Load("UISkins/Textures/Common1/default_avatar");
		}
		nameElement.label.text = Global.GetKeyWordShield().Search(Global.limitTextLength(info.nickname,12,Define.unknow,"..."));
	}
}

class RankListSlot
{
	private var mItemPanel : iGUIPanel = null;
	private var mNumLabel : iGUILabel = null;
	private var mImageLabel : iGUILabel = null;
	private var mNameLabel : iGUILabel = null;
	private var mDescribeLabel : iGUILabel = null;
	private var mVisitBtn : iGUIButton = null;
	private var mAsynInfo : RankListSlotIcon = new RankListSlotIcon();
	private var mResLoader : PlatResLoader = null;
	private var mRankData : ranking_data = null;
	//--------------------------------------------------
	function RankListSlot(item_panel : iGUIPanel, num_label : iGUILabel, image_label : iGUILabel, name_label : iGUILabel, describe_label : iGUILabel, visit_btn : iGUIButton)
	{
		mItemPanel = item_panel;
		mNumLabel = num_label;
		mImageLabel = image_label;
		mNameLabel = name_label;
		mDescribeLabel = describe_label;
		mVisitBtn = visit_btn;
		mAsynInfo.imageElement = image_label;
		mAsynInfo.nameElement = name_label;
		// 事件注册
		visit_btn.clickCallback = System.Delegate.Combine(visit_btn.clickCallback, ClickCallback_visit_btn as iGUIEventCallback);
	}
	//--------------------------------------------------
	// 设置内容
	public function setContent(data : ranking_data, rank : int, rank_type : int) : void
	{
		// 清空
		if (null == data)
		{
			if (mResLoader)
			{
				Global.GetPlatResLoaderMgr().Remove(mResLoader);
				mResLoader = null;
			}
			mRankData = null;
			mNumLabel.label.text = "";
			mImageLabel.style.normal.background = null;
			mNameLabel.label.text = "";
			mDescribeLabel.label.text = "";
			return;
		}
		// 填充
		mRankData = data;
		mNumLabel.label.text = rank.ToString();
		var describe_text : String = data.data.ToString();
		if (1 == rank_type)				// 等级
		{
			describe_text += Define.level;
		}
		mDescribeLabel.label.text = describe_text;
		mResLoader = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(data.account,mAsynInfo);
	}
	//--------------------------------------------------
	// 显示/隐藏
	public function setVisible(visible : boolean) : void
	{
		mItemPanel.setEnabled(visible);
	}
	//--------------------------------------------------
	// 点击访问按钮
	private function ClickCallback_visit_btn(caller : iGUIElement)
	{
		RankListLogic.getInstance().closeRankListUI();
		PlayerFriend.GetInstance().ReqEnterFriendHouse(mRankData.account, enter_house_type.eht_ranking_list);
		EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_RANKLIST_VISIT_BTN));
	}
	//--------------------------------------------------
}


