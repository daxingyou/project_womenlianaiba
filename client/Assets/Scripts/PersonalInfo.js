/*--------------------------------------------------
个人信息(2012/4/10 create by Y3)
--------------------------------------------------*/
#pragma strict
#pragma downcast


class PersonalInfoHeadSlot extends PlatResInfoCtrl
{
	private var mAccount : String = "";
	private var mImageLoader : PlatResLoader = null;
	public var defaultHead : Texture = null;
	public var head : iGUILabel = null;
	
	//请求头像
	public function reqHead(acc : String) : void
	{
		mAccount = acc;
		mImageLoader = Global.GetPlatResLoaderMgr().NetLoadImageOpenIDNew(acc, this);
	}
	//更新头像
	public function updateHead() : void
	{
	 	if (null == head || "" == mAccount)
	 		return;
	 	
	 	clear();
	 	reqHead(mAccount);
	}
	// 清除事件
	public function clear() : void
	{
		if (mImageLoader)
		{
			mImageLoader.Cancel();
		}
	}
	//overwrite
	public function Callback() : void
	{
		if (null == head)
			return;
		
		if (URLValid)
			head.style.normal.background = image;
		else
			head.style.normal.background = defaultHead;
	} 
}





//--------------------------------------------------
private var malePersonInfo : person_info = null;
private var femalePersonInfo : person_info = null;
private var mOldPersonInfo : base_person_info = null;		// 保存未修改之前的玩家信息
//头像
private var maleHeadSlot : PersonalInfoHeadSlot = new PersonalInfoHeadSlot();
private var femaleHeadSlot : PersonalInfoHeadSlot = new PersonalInfoHeadSlot();
//是否是男性面板
private var isMalePanel : boolean = true;
//是否是请求2个人的信息
private var isReqTwoInfo : boolean = true;

private static var paddingChar : String = "－";

//--------------------------------------------------
private static var instance : PersonalInfo;
function Awake()
{
	instance = this;
	registerEvents();
	loadPersonalInfoData();
}
static function getInstance()
{
	return instance;
}
function gui():iGUICode_PersonalInfoUI
{
	return iGUICode_PersonalInfoUI.getInstance();
}

function registerEvents()
{
	NetHelper.RegistHandler(new notify_person_info(), notifyPersonInfo);
}




//-------------凌乱的逻辑---------------
//加载资源
function loadUI()
{
	if(UI.getUI().GetUIRoot("PersonalInfoUI") != null)
		return;
    
	//创建资源
    UI.getUI().OpenUIRoot("PersonalInfoUI");
    UI.getUI().EnableUIRoot("PersonalInfoUI",false);
	
	//初始化永久数据
	//
	loadDropDownListData();
	
	//
	maleHeadSlot.defaultHead = Resources.Load("UISkins/Textures/photofriend/default_man");
	femaleHeadSlot.defaultHead = Resources.Load("UISkins/Textures/photofriend/default_woman");
	if(isMalePanel)
		maleHeadSlot.head = gui().headImage;
	else
		femaleHeadSlot.head = gui().headImage;
}


//打开界面
function openUI()
{
	loadUI();
	
	//打开界面, 设置模态
	UI.getUI().EnableUIRoot("PersonalInfoUI",true);
	UI.getUI().SetModal("PersonalInfoUI", true);	
	
	//打开信息页面
	gui().InfoPanel.passive = false;
	gui().InfoPanel.setEnabled(true);
	gui().modifyPanel.setEnabled(false);
		
	//更新页面
	updateInfoPanel();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.OPEN_PERSONALINFO_UI));
}

function openUIByHouse()
{
	//请求2个人的消息
	isReqTwoInfo = true;
	
	openUI();
	
	var house : PlayerHouse = EQGameSceneMgr.getSingleton().getHouse();
	reqPernalInfo(house.getHouseInfo().girl);
	reqPernalInfo(house.getHouseInfo().boy);
}

function openUIByAccount(account:String)
{
	//请求1个人的消息
	isReqTwoInfo = false;
	
	openUI();
	
	reqPernalInfo(account);
}


//关闭UI
function closeUI()
{
	if(UI.getUI().GetUIRoot("PersonalInfoUI") == null)
		return;
		
	UI.getUI().EnableUIRoot("PersonalInfoUI",false);
	UI.getUI().SetModal("PersonalInfoUI", false);
	
	//清除数据
	malePersonInfo = null;
	femalePersonInfo = null;
	maleHeadSlot.clear();
	femaleHeadSlot.clear();
}

//界面是否开着
function isOpen()
{
	if(UI.getUI().GetUIRoot("PersonalInfoUI") == null)
		return false;
	
	var root:iGUIRoot = UI.getUI().GetUIRoot("PersonalInfoUI");
	return root.enabled;
}

//更新信息面板
function updateInfoPanel()
{
	updateInfoButton();
	updateMaleTag();
	maleHeadSlot.updateHead();
	femaleHeadSlot.updateHead();

	var info:person_info;
	if(isMalePanel)
		info = malePersonInfo;
	else
		info = femalePersonInfo;

	if(info == null)
	{
		//
		gui().headName.label.text = Define.unknow;
		gui().infoSex.label.text = paddingChar;
		gui().infoShengxiao.label.text = paddingChar;
		gui().infoBirthday.label.text = paddingChar;
		gui().infoXingzuo.label.text = paddingChar;
		gui().infoBloodType.label.text = paddingChar;
		gui().infoHeigt.label.text = paddingChar;
		gui().infoWeight.label.text = paddingChar;
		gui().infoDegree.label.text = paddingChar;
		gui().infoJob.label.text = "";
		gui().infoSalary.label.text = paddingChar;
		gui().infoPosition.label.text = paddingChar;
		gui().infoContact.label.text = "";
		gui().infoHobby.label.text = "";
		gui().infoSignature.label.text = "";
		
//		if(isMalePanel)
//			gui().headImage.style.normal.background = Resources.Load("UISkins/Textures/photofriend/default_man");
//		else
//			gui().headImage.style.normal.background = Resources.Load("UISkins/Textures/photofriend/default_woman");
	}
	else
	{
		var inf:base_person_info = info.info;
		//
		gui().headName.label.text = Global.GetKeyWordShield().Search(info.username);
		gui().infoSex.label.text = findInfoDataValueByID(InfoSex, info.sex);
		gui().infoShengxiao.label.text = findInfoDataValueByID(InfoShengxiao, inf.animal_type);
		gui().infoBirthday.label.text = stimeToString(inf.birthday);
		gui().infoXingzuo.label.text = findInfoDataValueByID(InfoXingzuo, inf.star);
		gui().infoBloodType.label.text = findInfoDataValueByID(InfoBloodType, inf.blood_type);
		gui().infoHeigt.label.text = findInfoDataValueByID(InfoHeight, inf.height);
		gui().infoWeight.label.text = findInfoDataValueByID(InfoWeight, inf.weight);
		gui().infoDegree.label.text = findInfoDataValueByID(InfoDegree, inf.education);
		gui().infoJob.label.text = inf.career;
		gui().infoSalary.label.text = findInfoDataValueByID(InfoSalary, inf.salary);
		gui().infoPosition.label.text = findPostionByID(inf.province, inf.city);
		gui().infoContact.label.text = inf.contact;
		gui().infoHobby.label.text = inf.interest;
		gui().infoSignature.label.text = inf.signature;
		
//		if(isMalePanel)
//			gui().headImage.style.normal.background = Resources.Load("UISkins/Textures/photofriend/default_man");
//		else
//			gui().headImage.style.normal.background = Resources.Load("UISkins/Textures/photofriend/default_woman");

		//TODO:头像
	}
	
}

function updateInfoButton()
{
	var info:person_info;
	if(isMalePanel)
		info = malePersonInfo;
	else
		info = femalePersonInfo;

	if(info == null)
	{
		gui().focusHer.setEnabled(false);
		gui().giftHer.setEnabled(false);
		gui().visitHer.setEnabled(false);
		gui().modifyInfo.setEnabled(false);
	}
	else
	{
		if(isMe(info))
		{
			gui().focusHer.setEnabled(false);
			gui().giftHer.setEnabled(false);
			gui().visitHer.setEnabled(false);
			gui().modifyInfo.setEnabled(true);
		}
		else
		{
			gui().focusHer.setEnabled(true);
			gui().giftHer.setEnabled(true);
			gui().visitHer.setEnabled(true);
			gui().modifyInfo.setEnabled(false);
		}
	}
}

function isMe(info:person_info) : boolean
{
	if(ScenePlayerMgr.getMainPlayerAccount() == info.account)
		return true;
	else
		return false;
}

//如果没数据, 返回false
function isMe() : boolean
{
	var info:person_info;
	if(isMalePanel)
		info = malePersonInfo;
	else
		info = femalePersonInfo;

	if(info == null)
		return false;

	return isMe(info);
}

function updateMaleTag()
{
	if(isMalePanel)
	{
		gui().maleInfo.setEnabled(true);
		gui().maleInfo.style.normal.background = Resources.Load("UISkins/Textures/PersonalInfo/male_info");
		
		if(isReqTwoInfo)
		{
			gui().femaleInfo.setEnabled(true);
			gui().femaleInfo.style.normal.background = Resources.Load("UISkins/Textures/PersonalInfo/female_info_nosel");
		}
		else
			gui().femaleInfo.setEnabled(false);
	}
	else
	{
		if(isReqTwoInfo)
		{
			gui().maleInfo.setEnabled(true);
			gui().maleInfo.style.normal.background = Resources.Load("UISkins/Textures/PersonalInfo/male_info_nosel");
		}
		else
			gui().maleInfo.setEnabled(false);
			
		gui().femaleInfo.setEnabled(true);
		gui().femaleInfo.style.normal.background = Resources.Load("UISkins/Textures/PersonalInfo/female_info");
	}
}

function updateModifyPanel()
{
	var info:person_info;
	if(isMalePanel)
		info = malePersonInfo;
	else
		info = femalePersonInfo;

	if(info == null)
	{
		throw Exception("PersonalInfo -> updateModifyPanel() -> info is null!");
	}

	var inf:base_person_info = info.info;
	
	setDropDownIndex(gui().moShengxiao, InfoShengxiao, inf.animal_type);
	setBirthdayDropDown(inf.birthday);
	setDropDownIndex(gui().moXingzuo, InfoXingzuo, inf.star);
	setDropDownIndex(gui().moBloodType, InfoBloodType, inf.blood_type);
	setDropDownIndex(gui().moHeight, InfoHeight, inf.height);
	setDropDownIndex(gui().moWeight, InfoWeight, inf.weight);
	setDropDownIndex(gui().moDegree, InfoDegree, inf.education);
	gui().moJob.value = inf.career;
	setDropDownIndex(gui().moSalary, InfoSalary, inf.salary);
	setPostionDropDown(inf.province, inf.city);
	gui().moContact.value = inf.contact;
	gui().moHobby.value = inf.interest;
	gui().moSignature.value = inf.signature;
	gui().moName.value = inf.name;
	
	mOldPersonInfo = inf;
}

function setDropDownIndex(dd : iGUIDropDownList, ar:Array, id:int)
{
	var n : int = 0;
	for(var a:InfoData in ar)
	{
		if(a.id == id)
		{
			dd.selectedIndex = n;
			return;
		}
		
		n++;
	}
	
	dd.selectedIndex = -1;
}

function setBirthdayDropDown(t:stime)
{
	gui().moBirthdayYear.selectedIndex = -1;
	gui().moBirthdayMonth.selectedIndex = -1;
	gui().moBirthdayDay.selectedIndex = -1;

	if(t.year == 0 || t.month == 0 || t.day == 0)
		return;
	
	gui().moBirthdayYear.selectedIndex = t.year - 1970;
	gui().moBirthdayMonth.selectedIndex = t.month - 1;
	calcYearMonthDay();
	gui().moBirthdayDay.selectedIndex = t.day - 1;
}

function setPostionDropDown(pr:int, re:int)
{
	gui().moPositionProvince.selectedIndex = -1;
	gui().moPositionRegion.selectedIndex = -1;

	if(pr == 0 || re == 0)
		return;
		
	var n : int = 0;
	var prData : ProvinceData = null;
	for(var a:ProvinceData in InfoProvince)
	{
		if(a.id == pr)
		{
			gui().moPositionProvince.selectedIndex = n;
			prData = a;
			break;
		}
		n++;
	}
	
	if(prData == null)
		return;
		
	fillDropDownList(gui().moPositionRegion, prData.InfoRegion);
	setDropDownIndex(gui().moPositionRegion, prData.InfoRegion, re);
}

//-------------UI事件------------------
//点击主界面按钮
function clickPersonalInfo(){
	openUIByHouse();
}

function clickClose()
{
	closeUI();
}

function clickCloseModify()
{
	gui().InfoPanel.passive = false;
	gui().modifyPanel.setEnabled(false);
}

function clickModifyInfoButton()
{
	if(!isMe())
		return;

	gui().InfoPanel.passive = true;
	gui().modifyPanel.setEnabled(true);
	
	updateModifyPanel();
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_MODIFY_PERSONALINFO));
}

function clickFocus()
{
	var info:person_info;
	if(isMalePanel)
		info = malePersonInfo;
	else
		info = femalePersonInfo;
	if(info == null)
		return;

	FollowLogic.GetInstance().AddAttention(info.account);
}
function clickGift()
{
	var info:person_info;
	if(isMalePanel)
		info = malePersonInfo;
	else
		info = femalePersonInfo;
	if(info == null)
		return;
	var account:String = info.account;
	
	//先关闭界面
	closeUI();
	
	GiftLogic.Ctrl.Set("receive_account", account);
	GiftLogic.Ctrl.Excute("open_gift_make_ui", true);
}
function clickVisit()
{
	var info:person_info;
	if(isMalePanel)
		info = malePersonInfo;
	else
		info = femalePersonInfo;
	if(info == null)
		return;
	var account:String = info.account;
	
	//先关闭界面
	closeUI();

	PlayerFriend.GetInstance().ReqEnterFriendHouse(account,enter_house_type.eht_person_info);
}

function clickOKModifyButton()
{
	// 名字有需要屏蔽的字或玩家名字为空
	if ("" == gui().moName.value.Trim() || Global.GetKeyWordShield().HasKeyWordShield(gui().moName.value.Trim()))
	{
		Global.GetSysMsgHandler().ShowSysMsg(489);
		return;
	}
	//生日
	var year:int = 0;
	var month:int = 0;
	var day:int = 0;
	var birthday:stime = new stime();
	
	if(gui().moBirthdayYear.selectedIndex != -1)
		year = Convert.ToInt32(gui().moBirthdayYear.options[gui().moBirthdayYear.selectedIndex].text);
	if(gui().moBirthdayMonth.selectedIndex != -1)
		month = Convert.ToInt32(gui().moBirthdayMonth.options[gui().moBirthdayMonth.selectedIndex].text);
	if(gui().moBirthdayDay.selectedIndex != -1)
		day = Convert.ToInt32(gui().moBirthdayDay.options[gui().moBirthdayDay.selectedIndex].text);
	
	if(year != 0 || month != 0 || day != 0)			//生日, 如果有填写了
	{
		if(!(year != 0 && month != 0 && day != 0))	//且没填写全
		{
			UI.getUI().OpenMsgbox("", Define.getContent(5123), true);
			return;
		}
	}
	//转换时间
	birthday.year = year;
	birthday.month = month;
	birthday.day = day;
	
	//地区
	var province:int = 0;
	var region:int = 0;
	
	if(gui().moPositionProvince.selectedIndex != -1)
		province = (InfoProvince[gui().moPositionProvince.selectedIndex] as ProvinceData).id;
	if(gui().moPositionRegion.selectedIndex != -1)
		region = ((InfoProvince[gui().moPositionProvince.selectedIndex] as ProvinceData).InfoRegion[gui().moPositionRegion.selectedIndex] as InfoData).id;
		
	if(province != 0 || region != 0)		//地区, 如果有填写
	{
		if(!(province != 0 && region != 0))	//且没写全
		{
			UI.getUI().OpenMsgbox("", Define.getContent(5124), true);
			return;
		}
	}
	
	//发送请求修改的网络消息
	var packet:req_change_person_info = new req_change_person_info();
	var inf:base_person_info = packet.info;
	
	inf.animal_type = getValidIdByIndex(gui().moShengxiao.selectedIndex, InfoShengxiao);
	inf.birthday = birthday;
	inf.star = getValidIdByIndex(gui().moXingzuo.selectedIndex, InfoXingzuo);
	inf.blood_type = getValidIdByIndex(gui().moBloodType.selectedIndex, InfoBloodType);
	inf.height = getValidIdByIndex(gui().moHeight.selectedIndex, InfoHeight);
	inf.weight = getValidIdByIndex(gui().moWeight.selectedIndex, InfoWeight);
	inf.education = getValidIdByIndex(gui().moDegree.selectedIndex, InfoDegree);
	inf.career = gui().moJob.value.Trim();
	inf.salary = getValidIdByIndex(gui().moSalary.selectedIndex, InfoSalary);
	inf.province = province;
	inf.city = region;
	inf.contact = gui().moContact.value.Trim();
	inf.interest = gui().moHobby.value.Trim();
	inf.signature = gui().moSignature.value.Trim();
	inf.name = gui().moName.value.Trim();
	
	if (isPersonModified(inf))
	{
		NetHelper.Send(packet);
		//请求新的角色消息
		reqPernalInfo(ScenePlayerMgr.getMainPlayerAccount());
		UI.getUI().OpenMsgbox("", Define.getContent(5125), Define.refresh, CallbackConfirmOKModifyButton as iGUIEventCallback);
	}
	else
	{
		clickCloseModify();
	}
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.CLICK_CLOSE_PERSONAL_INFO_UI));
}

private function isPersonModified(info : base_person_info) : boolean
{
	var old_info : base_person_info = mOldPersonInfo;
	if (old_info.animal_type == info.animal_type &&
		old_info.birthday == info.birthday &&
		old_info.star == info.star &&
		old_info.blood_type == info.blood_type &&
		old_info.height == info.height &&
		old_info.weight == info.weight &&
		old_info.education == info.education &&
		old_info.career == info.career &&
		old_info.salary == info.salary &&
		old_info.province == info.province &&
		old_info.city == info.city &&
		old_info.contact == info.contact &&
		old_info.interest == info.interest &&
		old_info.signature == info.signature &&
		old_info.name == info.name)
	{
		return false;
	}
	return true;
}

function getValidIdByIndex(ix:int, ar:Array)
{
	if(ix == -1)
		return 0;
	return (ar[ix] as InfoData).id;
}

private function CallbackConfirmOKModifyButton(callback : iGUIElement) {
//	clickCloseModify();
	ExternalFlatform.ReloadPage();
}

function changeSexPanel(male:boolean)
{
	if(isMalePanel == male)
		return;
		
	if(male && malePersonInfo == null)	//如果找不到对应的信息, 则不能改变面板
		return;
	if(!male && femalePersonInfo == null)
		return;
		
	isMalePanel = male;
	
	if(isMalePanel)
	{
		maleHeadSlot.head = gui().headImage;
		femaleHeadSlot.head = null;
	}
	else
	{
		maleHeadSlot.head = null;
		femaleHeadSlot.head = gui().headImage;
	}
	
	updateInfoPanel();
}


//-------------列表数据-----------------
//初始化下拉框数据
function loadDropDownListData()
{
	fillDropDownList(gui().moShengxiao, InfoShengxiao);
	fillDropDownList(gui().moXingzuo, InfoXingzuo);
	fillDropDownList(gui().moBloodType, InfoBloodType);
	fillDropDownList(gui().moHeight, InfoHeight);
	fillDropDownList(gui().moWeight, InfoWeight);
	fillDropDownList(gui().moDegree, InfoDegree);
	fillDropDownList(gui().moSalary, InfoSalary);
	fillProvince();
	fillYearMonth();
}

function fillDropDownList(dr:iGUIDropDownList, ar:Array)
{
	dr.removeAll();
	for(var a : InfoData in ar)
		dr.addOption(a.v);
}

function fillProvince()
{
	gui().moPositionProvince.removeAll();
	for(var a : ProvinceData in InfoProvince)
		gui().moPositionProvince.addOption(a.v);
}

function fillYearMonth()
{
	gui().moBirthdayYear.removeAll();
	gui().moBirthdayMonth.removeAll();
	
	for(var i:int=1970; i<=SysTimer.getCurTime().Year; i++)
		gui().moBirthdayYear.addOption(i.ToString());
	
	for(var ii:int=1; ii<=12; ii++)
		gui().moBirthdayMonth.addOption(ii.ToString());
}

//省份改变
function provinceChange(ix:int)
{
	gui().moPositionRegion.selectedIndex = -1;
	
	if(ix<0)
	{
		gui().moPositionRegion.removeAll();
		return;
	}
	
	var pr:ProvinceData = InfoProvince[ix];
	fillDropDownList(gui().moPositionRegion, pr.InfoRegion);
}

//生日的年月改变
function calcYearMonthDay()
{
	if(gui().moBirthdayYear.selectedIndex<0 || gui().moBirthdayMonth.selectedIndex<0)
		return;
		
	//计算本月有多少日
	var year = Convert.ToInt32(gui().moBirthdayYear.options[gui().moBirthdayYear.selectedIndex].text);
	var month = Convert.ToInt32(gui().moBirthdayMonth.options[gui().moBirthdayMonth.selectedIndex].text);
	var days = System.DateTime.DaysInMonth(year, month);
	
	if(gui().moBirthdayDay.selectedIndex >= 0)
	{
		if(gui().moBirthdayDay.selectedIndex >= days)
			gui().moBirthdayDay.selectedIndex = -1;
	}
	
	//
	gui().moBirthdayDay.removeAll();
	for(var i:int=1; i<=days; i++)
		gui().moBirthdayDay.addOption(i.ToString());	
}

//-------------资料数据-----------------
var PersonalInfoFile : TextAsset;

class InfoData {
	var id : int;
	var v : String;
}
@HideInInspector
var InfoSex : Array = new Array();
@HideInInspector
var InfoXingzuo : Array = new Array();
@HideInInspector
var InfoShengxiao : Array = new Array();
@HideInInspector
var InfoBloodType : Array = new Array();
@HideInInspector
var InfoHeight : Array = new Array();
@HideInInspector
var InfoWeight : Array = new Array();
@HideInInspector
var InfoSalary : Array = new Array();
@HideInInspector
var InfoDegree : Array = new Array();
class ProvinceData {
	var id : int;
	var v : String;
	var InfoRegion : Array = new Array();
}
@HideInInspector
var InfoProvince : Array = new Array();

function findInfoDataValueByID(arr:Array, id:int) : String
{
	if(id == 0)
		return paddingChar;
		
	for(var a : InfoData in arr)
	{
		if(a.id == id)
			return a.v;
	}
	return "ERR";
}

function findInfoProvinceValueByID(id:int) : String
{
	for(var a : ProvinceData in InfoProvince)
	{
		if(a.id == id)
			return a.v;
	}
	return "ERR";
}

function findRegionValueByID(pr:int, re:int) : String
{
	for(var a : ProvinceData in InfoProvince)
	{
		if(a.id == pr)
		{
			//找到省
			for(var b : InfoData in a.InfoRegion)
			{
				if(b.id == re)
					return b.v;		//找到市
			}
			break;
		}
	}
	return "ERR";
}

function findPostionByID(pr:int, re:int) : String
{
	if(pr == 0 || re == 0)
		return paddingChar;

	var sheng:String = findInfoProvinceValueByID(pr);
	var shi:String = findRegionValueByID(pr, re);
	
	return (sheng + " " + shi);
}

//加载资料数据
function loadPersonalInfoData()
{
	loadXMLData();
}

function loadXMLData()
{
	var xd : XmlDocument = new XmlDocument();
	xd.LoadXml(PersonalInfoFile.text);
	
	for(var a :  XmlElement in xd.DocumentElement.ChildNodes)
	{

		//Debug.Log(a.Name);

		if(a.Name == "Sex")
		{
			for(var b : XmlElement in a.ChildNodes)
				extractInfo(b, InfoSex);
		}
		else if (a.Name == "Xingzuo")
		{
			for(var b : XmlElement in a.ChildNodes)
				extractInfo(b, InfoXingzuo);
		}
		else if (a.Name == "Shengxiao")
		{
			for(var b : XmlElement in a.ChildNodes)
				extractInfo(b, InfoShengxiao);
		}
		else if (a.Name == "BloodType")
		{
			for(var b : XmlElement in a.ChildNodes)
				extractInfo(b, InfoBloodType);
		}
		else if (a.Name == "Height")
		{
			for(var b : XmlElement in a.ChildNodes)
				extractInfo(b, InfoHeight);
		}
		else if (a.Name == "Weight")
		{
			for(var b : XmlElement in a.ChildNodes)
				extractInfo(b, InfoWeight);
		}
		else if (a.Name == "Salary")
		{
			for(var b : XmlElement in a.ChildNodes)
				extractInfo(b, InfoSalary);
		}
		else if (a.Name == "Degree")
		{
			for(var b : XmlElement in a.ChildNodes)
				extractInfo(b, InfoDegree);
		}
		else if (a.Name == "Position")
		{
			for(var b : XmlElement in a.ChildNodes)
			{
				if(b.Name != "Pr")
					continue;
				var pr : ProvinceData = new ProvinceData();
				pr.id = Convert.ToInt32(b.Attributes[0].Value);
				pr.v = b.Attributes[1].Value;
				InfoProvince.Add(pr);
				for(var c : XmlElement in b.ChildNodes)
					extractInfo(c, pr.InfoRegion);
			}
		}
	}
	
}

function extractInfo(e:XmlElement, t:Array)
{
	if(e.Name != "Info" && e.Name != "Pr" && e.Name != "Re")
		return;
	
	var d : InfoData = new InfoData();
	d.id = Convert.ToInt32(e.Attributes[0].Value);
	d.v = e.Attributes[1].Value;
	
	t.Add(d);
	//Debug.Log(e.Attributes[0].Value + "   "  +e.Attributes[1].Value);
}

function stimeToString(t:stime) : String
{
	if(t.year == 0)
		return paddingChar;
		
	return (t.year.ToString() + Define.year + t.month.ToString() + Define.month + t.day.ToString());
}


//-------------网络消息处理-----------------
//请求个人消息
function reqPernalInfo(account:String)
{
	if( account == "" )
		return;
		
	var packet:req_person_info = new req_person_info();
	packet.account = account;
	NetHelper.Send(packet);
}

function notifyPersonInfo(evt:GameEvent, pack:notify_person_info)
{
	if(!isOpen())
		return;
	
	var male:boolean = true;
	if(pack.info.sex == 2)	//写死, 女的
		male = false;
		
	if(male)
	{
		malePersonInfo = pack.info;
		maleHeadSlot.reqHead(malePersonInfo.account);
	}
	else
	{
		femalePersonInfo = pack.info;
		femaleHeadSlot.reqHead(femalePersonInfo.account);
	}
	
	
//	//如果是请求一人, 则需要改变面板
//	if(!isReqTwoInfo)
//		changeSexPanel(male);
//	//是我自己, 设置为自己的面板
//	if(isMe(pack.info))
//	{
//		changeSexPanel(male);
//	}

	//直接改变为对应的面板
	changeSexPanel(male);
		
	//如果是自己, 关闭修改页面
	if(isMe())
		clickCloseModify();
		
	//更新界面
	updateInfoPanel();
}