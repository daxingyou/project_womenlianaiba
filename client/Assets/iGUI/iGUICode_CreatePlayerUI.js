#pragma strict
#pragma downcast


import iGUI;



private static var instance : iGUICode_CreatePlayerUI;
function Awake(){
	instance=this;
}
static function getInstance(){
	return instance;
}
@HideInInspector
var woman_btn : iGUIButton;
@HideInInspector
var man_btn : iGUIButton;
@HideInInspector
var sex_img : iGUILabel;
@HideInInspector
var rotate_right_btn : iGUIButton;
@HideInInspector
var rotate_left_btn : iGUIButton;
@HideInInspector
var ok_btn : iGUIButton;
@HideInInspector
var shoes_image3 : iGUIImage;
@HideInInspector
var shoes_image2 : iGUIImage;
@HideInInspector
var shoes_image1 : iGUIImage;
@HideInInspector
var clothes_image3 : iGUIImage;
@HideInInspector
var clothes_image2 : iGUIImage;
@HideInInspector
var clothes_image1 : iGUIImage;
@HideInInspector
var dress : iGUIContainer;
@HideInInspector
var skin_image4 : iGUIImage;
@HideInInspector
var skin_image3 : iGUIImage;
@HideInInspector
var skin_image2 : iGUIImage;
@HideInInspector
var skin_image1 : iGUIImage;
@HideInInspector
var beard_right_btn : iGUIButton;
@HideInInspector
var beard_left_btn : iGUIButton;
@HideInInspector
var face_right_btn : iGUIButton;
@HideInInspector
var face_left_btn : iGUIButton;
@HideInInspector
var hair_color_right_btn : iGUIButton;
@HideInInspector
var hair_color_left_btn : iGUIButton;
@HideInInspector
var hair_right_btn : iGUIButton;
@HideInInspector
var hair_left_btn : iGUIButton;
@HideInInspector
var feature : iGUIContainer;
@HideInInspector
var introduce : iGUIImage;
@HideInInspector
var root1 : iGUIRoot;

private var m_createRoleLogic: CreateRole;
private var m_asynList: Array = new Array();

private var m_bLeftRotate: boolean;
private var m_bRightRotate: boolean;
private var m_bLock: boolean = false;


//--------------------------------------------------
class frame_selecter
{   
    var select_frame : iGUILabel;		// 
    var old_select_item : iGUIElement;	// 

    // 
    function frame_selecter(myRoot: iGUIRoot, iWidth: int, iHeight: int)
    {       
	    select_frame = myRoot.addElement("iGUILabel");
	    select_frame.setWidth(iWidth);
	    select_frame.setHeight(iHeight);
	    select_frame.setLayer(5);
	    select_frame.setEnabled(false);
    }
    
    function use_image(frameStr: String)
    {   
        if (select_frame)
	        select_frame.style.normal.background = Resources.Load(frameStr);
    }

    // 
    private function _show_select_frame(element:iGUIElement):void
    {
	    if (element)
	    {
		    old_select_item = element;
		    //old_select_item.passive = true;
		    select_frame.setX(element.rect.x);
		    select_frame.setY(element.rect.y);
		    select_frame.setEnabled(true);
		    select_frame.passive = false;  		
	    }
    }

    // 
    private function _hide_select_frame():void
    {
	    if (old_select_item)
	    {
		    //old_select_item.passive = false;
		    old_select_item = null;
	    }
	    select_frame.setEnabled(false);
    }

    // /
    function show_select_frame(element:iGUIElement):void
    {
	    _hide_select_frame();
	    _show_select_frame(element);
    }
};

private var shoesFrame: frame_selecter;
private var clothesFrame: frame_selecter;
private var skinFrame: frame_selecter;


function clear_asynList()
{
	for (var obj in m_asynList)
	    (obj as AsynIcon).cancel();
	m_asynList.Clear();
}

function doLoadImage(obj: Backdrop, imgName: String)
{    
    var asynIcon = new AsynIcon(function (tex){ obj.image = tex; }, null);
    asynIcon.load(imgName);
    m_asynList.Push(asynIcon);
}

function doLoadImage(obj: iGUIImage, imgName: String)
{    
    var asynIcon = new AsynIcon(function (tex){ obj.image = tex; }, null);
    asynIcon.load(imgName);
    m_asynList.Push(asynIcon);
}

function calcPngName(itemID: int)
{
    var sPng: String = ResManager.LgtMgr.getItemRow(itemID).icon;
    return "Icon/" + sPng;
}

function loadDynamicImages()
{
    var res: Boo.Lang.Hash;
    if (getSex() == sex_type.st_boy) 
        res = (CreateRoleConfig.data["boy"] as Boo.Lang.Hash);
    else 
        res = (CreateRoleConfig.data["girl"] as Boo.Lang.Hash);
    
    var shoesList = res["shoes_list"] as int[];
    var clothesList = res["clothes_list"] as int[];

    doLoadImage(shoes_image1, calcPngName(shoesList[0]));
    doLoadImage(shoes_image2, calcPngName(shoesList[1]));
    doLoadImage(shoes_image3, calcPngName(shoesList[2]));
    
    doLoadImage(clothes_image1, calcPngName(clothesList[0]));
    doLoadImage(clothes_image2, calcPngName(clothesList[1]));
    doLoadImage(clothes_image3, calcPngName(clothesList[2]));    
}

function Lock(bLock: boolean)
{
    //Debug.LogWarning("lock " + bLock);
//    beard_right_btn.passive = bLock;
//    beard_left_btn.passive = bLock;
//    face_right_btn.passive = bLock;
//    face_left_btn.passive = bLock;
//    hair_color_right_btn.passive = bLock;
//    hair_color_left_btn.passive = bLock;
//    hair_right_btn.passive = bLock;
//    hair_left_btn.passive = bLock;
//    
//    skin_image4.passive = bLock;
//    skin_image3.passive = bLock;
//    skin_image2.passive = bLock;
//    skin_image1.passive = bLock;
    
    m_bLock = bLock;
}

function Start()
{
 	RegisterCallbacks();	
    
	m_createRoleLogic = new CreateRole(function (){ Lock(false); });	  
	m_createRoleLogic.init();
	
	setSex(Login.getSex());
}

function RegisterCallbacks()
{
    man_btn.clickCallback = ClickCallback_man_btn;
    woman_btn.clickCallback = ClickCallback_woman_btn;
	hair_left_btn.clickCallback = ClickCallback_hair_left_btn;
	hair_right_btn.clickCallback = ClickCallback_hair_right_btn;
	hair_color_left_btn.clickCallback = ClickCallback_hair_color_left_btn;
	hair_color_right_btn.clickCallback = ClickCallback_hair_color_right_btn;
	face_left_btn.clickCallback = ClickCallback_face_left_btn;
	face_right_btn.clickCallback = ClickCallback_face_right_btn;
	beard_left_btn.clickCallback = ClickCallback_beard_left_btn;
	beard_right_btn.clickCallback = ClickCallback_beard_right_btn;
	skin_image1.clickCallback = ClickCallback_skin_image1;
	skin_image2.clickCallback = ClickCallback_skin_image2;
	skin_image3.clickCallback = ClickCallback_skin_image3;
	skin_image4.clickCallback = ClickCallback_skin_image4;
	clothes_image1.clickCallback = ClickCallback_clothes_image1;
	clothes_image2.clickCallback = ClickCallback_clothes_image2;
	clothes_image3.clickCallback = ClickCallback_clothes_image3;
	shoes_image1.clickCallback = ClickCallback_shoes_image1;
	shoes_image2.clickCallback = ClickCallback_shoes_image2;
	shoes_image3.clickCallback = ClickCallback_shoes_image3;
	ok_btn.clickCallback = ClickCallback_ok_btn;
	rotate_left_btn.clickDownCallback  = ClickDown_rotate_left_btn;
	rotate_right_btn.clickDownCallback = ClickDown_rotate_right_btn;
	rotate_left_btn.clickUpCallback  = ClickUp_rotate_left_btn;
	rotate_right_btn.clickUpCallback = ClickUp_rotate_right_btn;
}

function ClickCallback_man_btn(caller : iGUIElement)
{
    if (getSex() != sex_type.st_boy)
        setSex(sex_type.st_boy);    
}

function ClickCallback_woman_btn(caller : iGUIElement)
{
    if (getSex() != sex_type.st_girl)
        setSex(sex_type.st_girl);        
}

function ClickCallback_hair_left_btn(caller : iGUIElement)
{
    if (m_bLock)
        return;
	Debug.Log("--- click hair_left_btn");
    Lock(true);   
	m_createRoleLogic.prevHair();
}

function ClickCallback_hair_right_btn(caller : iGUIElement)
{
    if (m_bLock)
        return;
	Debug.Log("--- click hair_right_btn");
    Lock(true);   
	m_createRoleLogic.nextHair();	
}

function ClickCallback_hair_color_left_btn(caller : iGUIElement)
{
    if (m_bLock)
        return;
	Debug.Log("--- click hair_color_left_btn");
    Lock(true);   
	m_createRoleLogic.prevHairColor();
}

function ClickCallback_hair_color_right_btn(caller : iGUIElement)
{
    if (m_bLock)
        return;
	Debug.Log("--- click hair_color_right_btn");
    Lock(true);   
	m_createRoleLogic.nextHairColor();
}

function ClickCallback_face_left_btn(caller : iGUIElement)
{
    if (m_bLock)
        return;
	Debug.Log("--- click face_left_btn");
    Lock(true);   
	m_createRoleLogic.prevFace();
}

function ClickCallback_face_right_btn(caller : iGUIElement)
{
    if (m_bLock)
        return;
	Debug.Log("--- click face_right_btn");
    Lock(true);   
	m_createRoleLogic.nextFace();	
}

function ClickCallback_beard_left_btn(caller : iGUIElement)
{
    if (m_bLock)
        return;
	Debug.Log("--- click beard_left_btn");
    Lock(true);   
	m_createRoleLogic.prevBeard();	
}

function ClickCallback_beard_right_btn(caller : iGUIElement)
{
    if (m_bLock)
        return;
	Debug.Log("--- click beard_right_btn");
    Lock(true);   
	m_createRoleLogic.nextBeard();	
}

function ClickCallback_skin_image1(caller : iGUIElement)
{
    if (m_bLock)
        return;
	Debug.Log("--- click skin_image1");	
	Lock(true);
	m_createRoleLogic.setPlayerSkin(0);
	skinFrame.show_select_frame(caller);
}

function ClickCallback_skin_image2(caller : iGUIElement)
{
    if (m_bLock)
        return;
	Debug.Log("--- click skin_image2");
	Lock(true);
	m_createRoleLogic.setPlayerSkin(1);
	skinFrame.show_select_frame(caller);
}

function ClickCallback_skin_image3(caller : iGUIElement)
{
    if (m_bLock)
        return;
	Debug.Log("--- click skin_image3");
	Lock(true);
	m_createRoleLogic.setPlayerSkin(2);
	skinFrame.show_select_frame(caller);
}

function ClickCallback_skin_image4(caller : iGUIElement)
{
    if (m_bLock)
        return;
	Debug.Log("--- click skin_image4");
	Lock(true);
	m_createRoleLogic.setPlayerSkin(3);
	skinFrame.show_select_frame(caller);
}

function ClickCallback_clothes_image1(caller : iGUIElement)
{
    if (m_bLock)
        return;
	Debug.Log("--- click clothes_image1");
	Lock(true);
	m_createRoleLogic.setPlayerClothes(0);
	clothesFrame.show_select_frame(caller);
}

function ClickCallback_clothes_image2(caller : iGUIElement)
{
    if (m_bLock)
        return;
	Debug.Log("--- click clothes_image2");
	Lock(true);
	m_createRoleLogic.setPlayerClothes(1);
	clothesFrame.show_select_frame(caller);
}

function ClickCallback_clothes_image3(caller : iGUIElement)
{
    if (m_bLock)
        return;
	Debug.Log("--- click clothes_image3");
	Lock(true);
	m_createRoleLogic.setPlayerClothes(2);
	clothesFrame.show_select_frame(caller);
}

function ClickCallback_shoes_image1(caller : iGUIElement)
{
    if (m_bLock)
        return;
	Debug.Log("--- click shoes_image1");
	Lock(true);
	m_createRoleLogic.setPlayerShoes(0);
	shoesFrame.show_select_frame(caller);
}

function ClickCallback_shoes_image2(caller : iGUIElement)
{
    if (m_bLock)
        return;
	Debug.Log("--- click shoes_image2");
	Lock(true);
	m_createRoleLogic.setPlayerShoes(1);
	shoesFrame.show_select_frame(caller);
}

function ClickCallback_shoes_image3(caller : iGUIElement)
{
    if (m_bLock)
        return;
	Debug.Log("--- click shoes_image3");
	Lock(true);
	m_createRoleLogic.setPlayerShoes(2);
	shoesFrame.show_select_frame(caller);
}


function ClickCallback_ok_btn(caller : iGUIElement)
{
	Debug.Log("--- click ok_btn");
	HandleAfterLogin.FirstLogin = true;
    m_createRoleLogic.reqCreateRole();
    clear_asynList();
}

function ClickDown_rotate_left_btn(caller : iGUIElement)
{
	Debug.Log("--- click down rotate_left_btn");
	m_bLeftRotate = true;
    //m_createRoleLogic.rotatePlayer(false);
}

function ClickDown_rotate_right_btn(caller : iGUIElement)
{
	Debug.Log("--- click down rotate_right_btn");
	m_bRightRotate = true;
	//m_createRoleLogic.rotatePlayer(true);
}

function ClickUp_rotate_left_btn(caller : iGUIElement)
{
	Debug.Log("--- click up rotate_left_btn");
	m_bLeftRotate = false;
    //m_createRoleLogic.rotatePlayer(false);
}

function ClickUp_rotate_right_btn(caller : iGUIElement)
{
	Debug.Log("--- click up rotate_right_btn");
	m_bRightRotate = false;
	//m_createRoleLogic.rotatePlayer(true);
}


function changeUIBySex(sex: int)
{ 
    if (!shoesFrame)
        shoesFrame = new frame_selecter(root1, 62, 62);
    if (!clothesFrame)
        clothesFrame = new frame_selecter(root1, 62, 62);
    if (!skinFrame)
        skinFrame = new frame_selecter(root1, 22, 22);    
        
    if (sex == sex_type.st_boy) // 
    {
        shoesFrame.use_image("UISkins/Textures/CreatePlayer/square_blue");
        shoesFrame.show_select_frame(shoes_image1);
        
        clothesFrame.use_image("UISkins/Textures/CreatePlayer/square_blue");
        clothesFrame.show_select_frame(clothes_image1);
        
        skinFrame.use_image("UISkins/Textures/CreatePlayer/cycl_blue");
        skinFrame.show_select_frame(skin_image1);
        
        beard_left_btn.setEnabled(true);
        beard_right_btn.setEnabled(true);
        // 
 		//GameObject.Find("Main Camera").GetComponent("Backdrop").image = Resources.Load("UISkins/Textures/CreatePlayer/male_ui");
        doLoadImage(Camera.main.GetComponent("Backdrop") as Backdrop, "UI/male_ui.png.u3d");
        doLoadImage(introduce, "UI/preboy.png.u3d");

        setSkin(ok_btn, "UISkins/Textures/Common1/yes_btn_blue");
        setSkin(rotate_right_btn, "UISkins/Textures/Common1/turn_right_btn_blue");
        setSkin(rotate_left_btn, "UISkins/Textures/Common1/turn_left_btn_blue");
        

        setSkin(face_right_btn, "UISkins/Textures/Common1/right_one_btn_blue");
        setSkin(face_left_btn, "UISkins/Textures/Common1/left_one_btn1");
        setSkin(hair_right_btn, "UISkins/Textures/Common1/right_one_btn_blue");
        setSkin(hair_left_btn, "UISkins/Textures/Common1/left_one_btn1");
        setSkin(hair_color_right_btn, "UISkins/Textures/Common1/right_one_btn_blue");
        setSkin(hair_color_left_btn, "UISkins/Textures/Common1/left_one_btn1");
        setSkin(beard_right_btn, "UISkins/Textures/Common1/right_one_btn_blue");
        setSkin(beard_left_btn, "UISkins/Textures/Common1/left_one_btn1");
    }
    else if (sex == sex_type.st_girl) // 
    {
        shoesFrame.use_image("UISkins/Textures/CreatePlayer/square_red");    
        shoesFrame.show_select_frame(shoes_image1);
            
        clothesFrame.use_image("UISkins/Textures/CreatePlayer/square_red");    
        clothesFrame.show_select_frame(clothes_image1);

        skinFrame.use_image("UISkins/Textures/CreatePlayer/cycl_red");    
        skinFrame.show_select_frame(skin_image1);

        beard_left_btn.setEnabled(false);
        beard_right_btn.setEnabled(false);    
        // 
 		//GameObject.Find("Main Camera").GetComponent("Backdrop").image = Resources.Load("UISkins/Textures/CreatePlayer/female_ui");
        doLoadImage(Camera.main.GetComponent("Backdrop") as Backdrop, "UI/female_ui.png.u3d");

        doLoadImage(introduce, "UI/pregirl.png.u3d");
        
        setSkin(ok_btn, "UISkins/Textures/Common1/yes_btn_red");
        setSkin(rotate_right_btn, "UISkins/Textures/Common1/turn_right_btn_red");
        setSkin(rotate_left_btn, "UISkins/Textures/Common1/turn_left_btn_red");

        setSkin(face_right_btn, "UISkins/Textures/Common1/right_one_btn1");
        setSkin(face_left_btn, "UISkins/Textures/Common1/left_one_btn_red");
        setSkin(hair_right_btn, "UISkins/Textures/Common1/right_one_btn1");
        setSkin(hair_left_btn, "UISkins/Textures/Common1/left_one_btn_red");
        setSkin(hair_color_right_btn, "UISkins/Textures/Common1/right_one_btn1");
        setSkin(hair_color_left_btn, "UISkins/Textures/Common1/left_one_btn_red");
//        setSkin(beard_right_btn, "UISkins/Textures/Common1/right_one_btn1");
//        setSkin(beard_left_btn, "UISkins/Textures/Common1/left_one_btn_red");
    }
    
    // 
    sex_img.setEnabled(Login().needSelectSex());
    woman_btn.setEnabled(Login().needSelectSex());
    man_btn.setEnabled(Login().needSelectSex());
}




function setSkin(guiObj: iGUIButton, skin: String)
{	
    guiObj.style.normal.background = Resources.Load(skin);
    guiObj.style.hover.background = Resources.Load(skin + "_hover");
}

function Update()
{  
    if (Input.GetMouseButtonUp(0)) // fixed bug
    {
        m_bLeftRotate = false;
        m_bRightRotate = false;
    }
  
    if (m_bLeftRotate)
    {
        m_createRoleLogic.rotatePlayer(false);
    }
    else if (m_bRightRotate)
    {
        m_createRoleLogic.rotatePlayer(true);
    }    
}

private function getSex(): int
{
    return m_createRoleLogic.getSex();
}

private function setSex(sex: int)
{
    clear_asynList();
    m_createRoleLogic.setSex(sex);
	changeUIBySex(sex);	
	loadDynamicImages();	
}
