#pragma strict
#pragma downcast

//-----------------game tooltip----------------------
//-----------------game system toolip call-----------
//-----------------call:first call function Begin(),then add content with function Add() and Show() on the end-----------
//---------------------------------------------------

import iGUI;

class TipContent {
	public var content : GUIContent;
	public var object : iGUILabel;
}

class TooltipBuild
{
	private var mContentList : ArrayList;								//Struct TipContent
	private var mCurHeight : float;
	private var mPanel : iGUIPanel;
	private var mRoot : iGUIRoot;
	private var mElement : iGUIElement;
	
	function TooltipBuild() {
		mContentList = new ArrayList();
		
		mRoot = UI.getUI().OpenUIRoot("TooltipUI");
		mPanel = mRoot.items[0];
		mRoot.enabled = false;
		mElement = null;
		
		mCurHeight = 0;
	}
	
	public function Begin(element : iGUIElement) {
		if(mElement != element) {
			Clear();
			mElement = element;
		}
	}
	
	public function Add(content : GUIContent, style : GUIStyle) {
		var item : TipContent = new TipContent();
		item.content = content;
		item.object = mPanel.addElement("iGUILabel");
		item.object.label = content;
		item.object.style = style;
		item.object.setX(0);
		item.object.setY(mCurHeight);
		item.object.setWidth(mPanel.rect.width);
		item.object.setHeight(item.object.style.CalcHeight(content,item.object.rect.width));
		item.object.refreshStyle();
		item.object.refreshRect();
		mContentList.Add(item);
		
		mCurHeight += item.object.rect.height;
		Refresh();
	}
	public function Show(autoClose : boolean) {
		var x : float = mElement.rect.x + mElement.rect.width;
		var y : float = mElement.rect.y;
		if( x + mPanel.rect.width > Screen.width) {
			x = mElement.rect.x - mPanel.rect.width;
		}
		if( y + mPanel.rect.height > Screen.height) {
			y = mElement.rect.y - mPanel.rect.height;
		}
		
		if(autoClose) {
			mElement.mouseOutCallback = CallbackMouseOut;
		}
		
		Show(x,y);
	}
	
	public function Show(autoClose : boolean, dx : float, dy : float){
		var x : float = mElement.rect.x + mElement.rect.width + dx;
		var y : float = mElement.rect.y + dy;
		if( x + mPanel.rect.width > Screen.width) {
			x = mElement.rect.x - mPanel.rect.width;
		}
		if( y + mPanel.rect.height > Screen.height) {
			y = mElement.rect.y - mPanel.rect.height;
		}
		
		if(autoClose) {
			mElement.mouseOutCallback = System.Delegate.Combine(CallbackMouseOut as iGUIEventCallback,mElement.mouseOutCallback);
		}
		
		Show(x,y);	
	}
	
	public function Show(posX : float, posY : float) {
		if( posX + mPanel.rect.width > Screen.width) {
			posX = 1;
		}
		if( posY + mPanel.rect.height > Screen.height) {
			posY = mElement.rect.y - mPanel.rect.height;
		}
		
		mPanel.setX(posX);
		mPanel.setY(posY+5);
		mRoot.enabled = true;
		mRoot.passive = false;
		UI.getUI().SetTopDepth("TooltipUI");
	}
	public function Hide(element : iGUIElement) {
		if(element == mElement) {
			mRoot.enabled = false;
			Clear();
		}
	}
	public function Hide() {							//Hide tooltip whatever(use becareful)
		mRoot.enabled = false;
		Clear();
	}
	
	//callback
	function CallbackMouseOut(callback : iGUIElement) {
		if(callback == mElement) {
			Hide(callback);
		}
	}
	
	//interal function 
	private function Refresh() {
		mPanel.setHeight(mCurHeight);
	}
	
	
	//data operate
	public function GetContent() : ArrayList {
		return mContentList;
	}
	
	private function Clear() {
		mContentList.Clear();
		mCurHeight = 0;
		mPanel.removeAll();
	}
}