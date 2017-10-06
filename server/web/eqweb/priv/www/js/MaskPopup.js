//Start MaskPopup
function MaskPopup(param)
{
	this.targetWindow=param["targetWindow"]||window;
	this.elementKey=new Array();
	this.element=new Object();
	this.style=new Object();
	this.cssClass=new Object();
	
	this.elementKey.push("maskSpan");
	this.elementKey.push("maskDiv");
	this.element["maskSpan"]=this.targetWindow.document.createElement("span");
	this.element["maskDiv"]=this.targetWindow.document.createElement("div");
  this.style["maskDiv"]={opacity:0.4, zIndex:Suryani.maxZIndex(this.targetWindow.document)+1, backgroundColor:'#FFF',position:'absolute',overflow:'hidden'};
}
MaskPopup.prototype.setStyle=function()
{
	this.element.maskDiv.style.zIndex=this.style["maskDiv"]["zIndex"];
	this.element.maskDiv.style.position=this.style["maskDiv"]["position"];
	this.element.maskDiv.style.backgroundColor=this.style["maskDiv"]["backgroundColor"];
	this.element.maskDiv.style.overflow=this.style["maskDiv"]["overflow"];
	if(typeof(this.element.maskDiv.style.opacity)=="undefined")
	{
		this.element.maskDiv.style.filter="alpha(opacity="+this.style["maskDiv"]["opacity"]*100+")";
	}
	else
	{
		this.element.maskDiv.style.opacity=this.style["maskDiv"]["opacity"];
	}
}

MaskPopup.prototype.setSize=function()
{
	this.element.maskDiv.style.width="100%";
	this.element.maskDiv.style.height=Math.max(Suryani.getWindowHeight(this.targetWindow),Suryani.getDocumentHeight(this.targetWindow.document))+"px";
}

MaskPopup.prototype.setPosition=function()
{
	this.element.maskDiv.style.left="0px";
	this.element.maskDiv.style.top="0px";
}
MaskPopup.prototype.build=function()
{
	//IE6SelectHack
	if(Suryani.browser.msie && parseInt(Suryani.browser.version)<=6)
	{
		var html="<iframe src=\"\" style=\"z-index:-1;background-color:transparent;width:100%;height:100%\"></iframe>";
		this.element.maskDiv.insertAdjacentHTML("beforeEnd",html);
	}
	this.element.maskSpan.appendChild(this.element.maskDiv);
	this.targetWindow.document.body.appendChild(this.element.maskSpan);
}
MaskPopup.prototype.bindEvent=function()
{
	var me=this;
	Suryani.BindEvent(this.targetWindow,"resize",function(){ me.setSize();});
}
MaskPopup.prototype.show=function()
{
	this.setSize();
	this.setStyle();
	this.build();
	this.setPosition();
	this.bindEvent();
}
MaskPopup.prototype.close=function()
{
	this.targetWindow.document.body.removeChild(this.element.maskSpan);
}