//Start Popup
function Popup(param)
{
	this.targetWindow=param["targetWindow"]||window;
	this.elementKey=new Array();
	this.config=new Object();
	this.element=new Object();
	this.callBack=new Object();
	this.cssClass=new Object();
	this.style=new Object();
	this.size=new Object();
	this.position=new Object();
	this.action=new Object();
	this.actionData=new Object();
	
	if(param.showMask)
	{
		this.config["showMask"]=param.showMask;
		this.mask=new MaskPopup({targetWindow:this.targetWindow});
	}
	this.config["title"]=param.title;
	this.config["content"]=param.content;
	this.config["language"]=param["language"]||"en-us";
	this.config["autoSize"]=false;
	this.config["moveable"]=!!param["moveable"];
	this.callBack["closeCallBack"]=param.closeCallBack;
	
	this.size["width"]=param.width||300;
	this.size["height"]=param.height||180;
	
	this.position["top"]=param.top;
	this.position["left"]=param.left;
	this.init();
}

Popup.language=new Object();

Popup.language["en-us"]=new Object();
Popup.language["en-us"]["ok"]="OK";
Popup.language["en-us"]["cancel"]="Cancel";
Popup.language["en-us"]["close"]="Close";

Popup.language["zh-cn"]=new Object();
Popup.language["zh-cn"]["ok"]="";
Popup.language["zh-cn"]["cancel"]="";
Popup.language["zh-cn"]["close"]="关闭";

Popup.prototype.init=function()
{
	this.action["hasShow"]=false;
	this.action["isMoving"]=false;
	
	this.actionData["moveStart"]=null;
	this.actionData["moveEnd"]=null;
	
	this.elementKey.push("popupSpan");
	this.elementKey.push("popupDiv");
	this.elementKey.push("popupTable");
	this.elementKey.push("headerTr");
	this.elementKey.push("headerTd");
	this.elementKey.push("innerTable");
	this.elementKey.push("innerTr");
	this.elementKey.push("titleDiv");
	this.elementKey.push("titleTd");
	this.elementKey.push("closeA");
	this.elementKey.push("closeTd");
	this.elementKey.push("contentTr");
	this.elementKey.push("contentTd");
	this.elementKey.push("contentDiv");
	
	this.elementKey.push("bgTable");
	this.elementKey.push("bgHeaderTr");
	this.elementKey.push("bgContentTr");
	this.elementKey.push("bgFooterTr");
	this.elementKey.push("bgLTTd");
	this.elementKey.push("bgLCTd");
	this.elementKey.push("bgLRTd");
	this.elementKey.push("bgCLTd");
	this.elementKey.push("bgCCTd");
	this.elementKey.push("bgCRTd");
	this.elementKey.push("bgFLTd");
	this.elementKey.push("bgFCTd");
	this.elementKey.push("bgFRTd");
	
	this.element["popupSpan"]=this.targetWindow.document.createElement("span");
	this.element["popupDiv"]=this.targetWindow.document.createElement("div");
	this.element["popupTable"]=this.targetWindow.document.createElement("table");
	this.element["headerTr"]=this.element["popupTable"].insertRow(0);
	this.element["headerTd"]=this.element["headerTr"].insertCell(0);
	this.element["innerTable"]=this.targetWindow.document.createElement("table");
	this.element["innerTr"]=this.element["innerTable"].insertRow(0);
	this.element["titleDiv"]=this.targetWindow.document.createElement("div");
	this.element["titleTd"]=this.element["innerTr"].insertCell(0);
	this.element["closeA"]=this.targetWindow.document.createElement("a");
	this.element["closeTd"]=this.element["innerTr"].insertCell(1);
	this.element["contentTr"]=this.element["popupTable"].insertRow(1);
	this.element["contentTd"]=this.element["contentTr"].insertCell(0);
	this.element["contentDiv"]=this.targetWindow.document.createElement("div");
	
	this.element["bgTable"]=this.targetWindow.document.createElement("table");
	this.element["bgHeaderTr"]=this.element["bgTable"].insertRow(0);
	this.element["bgContentTr"]=this.element["bgTable"].insertRow(1);
	this.element["bgFooterTr"]=this.element["bgTable"].insertRow(2);
	this.element["bgLTTd"]=this.element["bgHeaderTr"].insertCell(0);
	this.element["bgLCTd"]=this.element["bgHeaderTr"].insertCell(1);
	this.element["bgLRTd"]=this.element["bgHeaderTr"].insertCell(2);
	this.element["bgCLTd"]=this.element["bgContentTr"].insertCell(0);
	this.element["bgCCTd"]=this.element["bgContentTr"].insertCell(1);
	this.element["bgCRTd"]=this.element["bgContentTr"].insertCell(2);
	this.element["bgFLTd"]=this.element["bgFooterTr"].insertCell(0);
	this.element["bgFCTd"]=this.element["bgFooterTr"].insertCell(1);
	this.element["bgFRTd"]=this.element["bgFooterTr"].insertCell(2);
		
	this.style["popupDiv"]={position:"absolute", backgroundColor:"White"}
	this.style["popupDiv"]["zIndex"]=Suryani.maxZIndex(this.targetWindow.document)+3;
	this.style["innerTable"]={height:"17px"};
	this.style["closeT"]={width:"9px", lineHeight:"24px"};
	this.style["closeA"]={backgroundPosition :"cneter center",backgroundRepeat:"no-repeat",backgroundImage:"url(../images/popup/close.png)",width:"9px", height:"9px", display:"block", textAlign:"center", margin:"0 auto"};
	this.style["headerTd"]={backgroundColor:"whiteSmoke",padding:"5px 10px", borderBottom:"1px solid #E0E0E0"};
	this.style["titleDiv"]={fontWeight:"blod",fontSize:"14px",lineHeight:"24px"};
	this.style["contentDiv"]={borderCollapse:"collapse","borderSpacing":0,backgroundColor:"#FFF"};	
	this.style["bgTable"]={borderCollapse: "collapse", borderSpacing: 0, width:"100%", backgroundColor:"White"};
	
	this.cssClass["bgLTTd"]="bgTableTd bglt";              
	this.cssClass["bgLCTd"]="bgTableTd bglc";
	this.cssClass["bgLRTd"]="bgTableTd bglr";
	
	this.cssClass["bgCLTd"]="bgTableTd bgcl";                         
	this.cssClass["bgCRTd"]="bgTableTd bgcr"; 
	             
	this.cssClass["bgFLTd"]="bgTableTd bgfl";              
	this.cssClass["bgFCTd"]="bgTableTd bgfc";              
	this.cssClass["bgFRTd"]="bgTableTd bgfr";         
	               
	this.element["popupSpan"].id="KL_popupSpan";
	this.element["popupDiv"].id="KL_popupDiv";
	this.element["popupTable"].id="KL_popupTable";
	this.element["headerTr"].id="KL_headerTr";
	this.element["headerTd"].id="KL_headerTd";
	this.element["innerTable"].id="KL_innerTable";
	this.element["innerTr"].id="KL_innerTr";
	this.element["titleDiv"].id="KL_titleDiv";
	this.element["titleTd"].id="KL_popupTable";
	this.element["closeTd"].id="KL_closeTd";
	this.element["contentTr"].id="KL_contentTr";
	this.element["contentTd"].id="KL_contentTd";
	this.element["contentDiv"].id="KL_contentDiv";
}

//initBackground
Popup.prototype.initBackground=function(){}
//initContent
Popup.prototype.initContent=function(){}
//setStyle
Popup.prototype.setStyle=function()
{
	for(var i=this.elementKey.length-1;i>0;i--)
	{
		var key=this.elementKey[i];
		if(!this.style[key])
		{
			continue;
		}
		for(var styleItem in this.style[key])
		{
			try
			{
				this.element[key].style[styleItem]=this.style[key][styleItem];
			}
			catch(e)
			{}
		}
	}
}
Popup.prototype.setClass=function()
{
	for(var i=this.elementKey.length-1;i>0;i--)
	{
		var key=this.elementKey[i];
		if(!this.cssClass[key])
		{
			continue;
		}
		try
		{
			this.element[key].className=this.cssClass[key];
		}
		catch(e)
		{}
	}
}
//setSize
Popup.prototype.setSize=function()
{
	this.element.popupDiv.style["width"]=this.size.width+"px";
	this.element.popupDiv.style["height"]=this.size.height+"px";
}
//setPosition
Popup.prototype.setPosition=function()
{
        if(this.position.top)
        {
            this.element.popupDiv.style["top"]=this.position.top+"px";
        }
        else
        {
			var availHeight=Suryani.getWindowHeight(this.targetWindow);
			var availTop=0;
			if(availHeight-this.size.height>0)
			{
				availTop=(availHeight-this.size.height)/2+Suryani.getDocumentScrollTop(this.targetWindow.document);
			}
            this.element.popupDiv.style["top"]=availTop+"px";
        }
        if(this.position.left)
        {
            this.element.popupDiv.style["left"]=this.position.left+"px";
        }
        else
        {
			var availWidth=Suryani.getWindowWidth(this.targetWindow);
			var availLeft=0;
			if(availWidth-this.size.width>0)
			{
				availLeft=(availWidth-this.size.width)/2+Suryani.getDocumentScrollLeft(this.targetWindow.document);
			}
            this.element.popupDiv.style["left"]=availLeft+"px";
        }
}
//build
Popup.prototype.build=function()
{
	this.element["contentTd"].appendChild(this.element["contentDiv"]);
	this.element["titleDiv"].innerHTML=this.config["title"];
	this.element["titleTd"].appendChild(this.element["titleDiv"]);
	this.element["closeTd"].appendChild(this.element["closeA"]);
	this.element["innerTable"].setAttribute("cellpadding","0");
	this.element["innerTable"].setAttribute("cellspacing","0");
	this.element["innerTable"].setAttribute("border","0");
	this.element["innerTable"].setAttribute("width","100%");
	this.element["headerTd"].appendChild(this.element["innerTable"]);
	this.element["popupTable"].setAttribute("cellpadding","0");
	this.element["popupTable"].setAttribute("cellspacing","0");
	this.element["popupTable"].setAttribute("border","0");
	this.element["popupTable"].setAttribute("width","100%");
	//IE6SelectHack
	if(Suryani.browser.msie && parseInt(Suryani.browser.version)<=6)
	{
		var html="<iframe src=\"\" style=\";position:'absolute';top:0;left:0;z-index:-1;filter:mask();width:100%;height:100%\"></iframe>";
		this.element["popupDiv"].insertAdjacentHTML("beforeEnd",html);
	}
	
	this.element["bgCCTd"].appendChild(this.element["popupTable"]);
	this.element["popupDiv"].appendChild(this.element["bgTable"]);
	this.element["popupSpan"].appendChild(this.element["popupDiv"]);
	
	try{
		this.targetWindow.document.body.appendChild(this.element["popupSpan"]);
	}
	catch(ex){
		//alert(this.targetWindow.document.body.innerHTML);
		//alert(ex.message);
	}
} 
//buildContent
Popup.prototype.buildContent=function(){}
//bindEvents
Popup.prototype.bindEvents=function()
{
	var me=this;
	Suryani.BindEvent(this.element["closeTd"],"click",function(){
			me.close();
			if(me.callBack.closeCallBack)
			{
				me.callBack.closeCallBack();
			}
	});
    if(me.config["moveable"])
    {
        Suryani.BindEvent(this.element["titleTd"],"mousedown",function(event){
                me.action["isMoving"]=true;                
                me.actionData["moveStart"]={left:event.clientX,top:event.clientY};
                me.element["titleTd"].style["cursor"]='move';
        });
        Suryani.BindEvent(this.targetWindow.document,"mousemove",function(event){
                if(me.action["isMoving"])
                {
                    var srcelement = event.srcelement || event.target;
                    me.actionData["moveEnd"]={left:event.clientX,top:event.clientY};
                    var targetLeft=parseInt(me.element.popupDiv.style["left"])+event.clientX-me.actionData["moveStart"].left;                    
                    var targetTop=parseInt(me.element.popupDiv.style["top"])+event.clientY-me.actionData["moveStart"].top;
                    if(targetLeft>=0 && targetLeft<=Suryani.getDocumentWidth(me.targetWindow.document)-me.element.popupDiv.clientWidth)
                    {
                        me.element.popupDiv.style["left"]=targetLeft+"px";
                    }
                    else
                    {
                        me.action["isMoving"]=false;
                        me.element["titleTd"].style["cursor"]='auto';
                    }
                    if(targetTop>=0 && targetTop<=Suryani.getDocumentHeight(me.targetWindow.document)-me.element.popupDiv.clientHeight)
                    {
                        me.element.popupDiv.style["top"]=targetTop+"px";
                    }
                    else
                    {
                        me.action["isMoving"]=false;
                        me.element["titleTd"].style["cursor"]='auto';
                    }
                    me.actionData["moveStart"]=me.actionData["moveEnd"];
                }
        });
        Suryani.BindEvent(this.targetWindow.document,"mouseup",function(){
            me.action["isMoving"]=false;
            me.element["titleTd"].style["cursor"]='auto';
        });
    }
}
Popup.prototype.bindContentEvents=function(){}
//show
Popup.prototype.show=function()
{
	this.initBackground();
//	this.init();
//	this.initContent();
	this.setStyle();
	this.setClass();
	this.setSize();
	this.setPosition();
	this.bindEvents();
	this.bindContentEvents();
	this.build();
	this.buildContent();
	if(this.config.showMask)
	{
		this.mask.show();
	}
}
Popup.prototype.showModalDialog=function()
{
    this.show();
    this.mask.show();
}
//close
Popup.prototype.close=function()
{
	this.targetWindow.document.body.removeChild(this.element.popupSpan);
	if(this.config["showMask"])
	{
		this.mask.close();
	}
}
//addCallBack
Popup.prototype.addCallBack=function(elementKey,listener)
{
	elementKey=elementKey.toLowerCase();
	if(this.element[elementKey])
	{
		this.callBack[elementKey].add(listener);
	}
}
//removeCallBack
Popup.prototype.removeCallBack=function(elementKey,listener)
{
	elementKey=elementKey.toLowerCase();
	if(this.element[elementKey])
	{
		this.callBack[elementKey].remove(listener);
	}
}
//End Popup

//Start TipPopup
function TipPopup(param)
{
	this.base = new Popup(param);
	Suryani.extend(this,this.base);
    this.config["autoClose"]=param["autoClose"]||0;
	this.initContent();
}
TipPopup.prototype.initContent=function()
{
	this.elementKey.push("tipDiv");
	this.element["tipDiv"]=this.targetWindow.document.createElement("div");
	this.element["tipDiv"].innerHTML=this.config["content"];
	this.style["tipDiv"]={color:"#DDD",margin:"20px"}
}
TipPopup.prototype.bindContentEvents=function(){
    var me=this;
    if(me.config["autoClose"])
    {
        setTimeout(function(){try{me.close()}catch(ex){}},me.config["autoClose"]);
    }
}
TipPopup.prototype.buildContent=function()
{
	this.element["contentDiv"].appendChild(this.element["tipDiv"]);
}

//End TipPopup

//Start CancelPopup
function CancelPopup(param)
{
	this.base = new Popup(param);
	Suryani.extend(this,this.base);
	this.initContent();
}
CancelPopup.prototype.initContent=function()
{
	this.elementKey.push("tipDiv");
	this.elementKey.push("cancel");
	this.elementKey.push("innerContentTable");
	this.elementKey.push("innerContentTr");
	this.elementKey.push("innerContentTd");
	this.elementKey.push("innerButtonTr");
	this.elementKey.push("innerButtonTd");
	this.element["tipDiv"]=this.targetWindow.document.createElement("div");
	this.element["cancel"]=this.targetWindow.document.createElement("input");
	this.element["cancel"].setAttribute("type","button");	
	this.element["cancel"].setAttribute("value",Popup.language[this.config["language"]]["cancel"]);
	this.element["tipDiv"].innerHTML=this.config["content"];
	this.element["innerContentTable"]=this.targetWindow.document.createElement("table");
	this.element["innerContentTr"]=this.element["innerContentTable"].insertRow(0);
	this.element["innerContentTd"]=this.element["innerContentTr"].insertCell(0);
	this.element["innerButtonTr"]=this.element["innerContentTable"].insertRow(1);
	this.element["innerButtonTd"]=this.element["innerButtonTr"].insertCell(0);
	this.style["innerContentTable"]={width:"100%"};
	this.style["tipDiv"]={color:"#FFF", color:"#000", margin:"20px",borderCollapse:"collapse", borderSpacing:0, border:"0px"};
	this.style["innerButtonTd"]={textAlign:"right",backgroundColor:"#EFEFEF", borderTop:"1px solid #E0E0E0"};
	
	this.element["tipDiv"].id="KL_tipDiv";
	
	this.cssClass["cancel"]="popupCancelButton";
		
	this.callBack["cancel"]=new List();
	
	this.element["tipDiv"].id="KL_tipDiv";
}
CancelPopup.prototype.bindContentEvents=function()
{
	var me=this;
	Suryani.BindEvent(me.element["cancel"],"click",function(){
		for(var i=0;i<me.callBack["cancel"].count();i++)
		{
			if(me.callBack["cancel"].item(i) && typeof me.callBack["cancel"].item(i) == "function")
			{
				me.callBack["cancel"].item(i)();
			}
		}
		me.close();
	});
}
CancelPopup.prototype.buildContent=function()
{
	this.element["innerContentTd"].appendChild(this.element["tipDiv"]);
	this.element["innerButtonTd"].appendChild(this.element["cancel"]);
	this.element["contentDiv"].appendChild(this.element["innerContentTable"]);
}

//Start AlertPopup
function AlertPopup(param)
{
	this.base = new Popup(param);
	Suryani.extend(this,this.base);
	this.initContent();
}
AlertPopup.prototype.initContent=function()
{
	this.elementKey.push("tipDiv");
	this.elementKey.push("ok");
	this.elementKey.push("innerContentTable");
	this.elementKey.push("innerContentTr");
	this.elementKey.push("innerContentTd");
	this.elementKey.push("innerButtonTr");
	this.elementKey.push("innerButtonTd");
	this.element["tipDiv"]=this.targetWindow.document.createElement("div");
	this.element["ok"]=this.targetWindow.document.createElement("input");
	this.element["ok"].setAttribute("type","button");
	this.element["ok"].setAttribute("value",Popup.language[this.config["language"]]["ok"]);
	this.element["tipDiv"].innerHTML=this.config["content"];
	this.element["innerContentTable"]=this.targetWindow.document.createElement("table");
	this.element["innerContentTr"]=this.element["innerContentTable"].insertRow(0);
	this.element["innerContentTd"]=this.element["innerContentTr"].insertCell(0);
	this.element["innerButtonTr"]=this.element["innerContentTable"].insertRow(1);
	this.element["innerButtonTd"]=this.element["innerButtonTr"].insertCell(0);
	this.style["tipDiv"]={color:"#DDD",margin:"20px"};
	this.style["innerButtonTd"]={textAlign:"right",backgroundColor:"#EFEFEF", borderTop:"1px solid #E0E0E0"};
	this.style["innerContentTable"]={width:"100%"};
	this.style["ok"]={marginRight:"10px"};
	this.cssClass["ok"] = "alterok pupopOKButton";
	this.callBack["ok"]=new List();
	
	this.element["tipDiv"].id="KL_tipDiv";
}
AlertPopup.prototype.bindContentEvents=function()
{
	var me=this;
	Suryani.BindEvent(me.element["ok"],"click",function(){
		for(var i=0;i<me.callBack["ok"].count();i++)
		{
			if(me.callBack["ok"].item(i) && typeof me.callBack["ok"].item(i) == "function")
			{
				me.callBack["ok"].item(i)();
			}
		}
		me.close();
	});
}
AlertPopup.prototype.buildContent=function()
{
	this.element["innerContentTd"].appendChild(this.element["tipDiv"]);
	this.element["innerButtonTd"].appendChild(this.element["ok"]);
	this.element["contentDiv"].appendChild(this.element["innerContentTable"]);
}

//End AlertPopup

//Start ConfirmPopup
function ConfirmPopup(param)
{
	this.base = new Popup(param);
	Suryani.extend(this,this.base);
	this.initContent();
}
ConfirmPopup.prototype.initContent=function()
{
	this.elementKey.push("tipDiv");
	this.elementKey.push("ok");
	this.elementKey.push("cancel");
	this.elementKey.push("innerContentTable");
	this.elementKey.push("innerContentTr");
	this.elementKey.push("innerContentTd");
	this.elementKey.push("innerButtonTr");
	this.elementKey.push("innerButtonTd");
	this.element["tipDiv"]=this.targetWindow.document.createElement("div");
	this.element["ok"]=this.targetWindow.document.createElement("input");
	this.element["ok"].setAttribute("type","button");
	this.element["ok"].setAttribute("value",Popup.language[this.config["language"]]["ok"]);
	this.element["cancel"]=this.targetWindow.document.createElement("input");
	this.element["cancel"].setAttribute("type","button");	
	this.element["cancel"].setAttribute("value",Popup.language[this.config["language"]]["cancel"]);
	this.element["tipDiv"].innerHTML=this.config["content"];
	this.element["innerContentTable"]=this.targetWindow.document.createElement("table");
	this.element["innerContentTr"]=this.element["innerContentTable"].insertRow(0);
	this.element["innerContentTd"]=this.element["innerContentTr"].insertCell(0);
	this.element["innerButtonTr"]=this.element["innerContentTable"].insertRow(1);
	this.element["innerButtonTd"]=this.element["innerButtonTr"].insertCell(0);
	
	this.style["innerContentTable"]={width:"100%"};
	this.style["tipDiv"]={color:"#FFF", color:"#000", margin:"20px",borderCollapse:"collapse", borderSpacing:0, border:"0px"};
	this.style["innerButtonTd"]={textAlign:"right",backgroundColor:"#EFEFEF", borderTop:"1px solid #E0E0E0"};
	
	this.element["tipDiv"].id="KL_tipDiv";
	
	this.cssClass["ok"]="pupopOKButton";
	this.cssClass["cancel"]="popupCancelButton";
		
	this.callBack["ok"]=new List();
	this.callBack["cancel"]=new List();
}
ConfirmPopup.prototype.bindContentEvents=function()
{
	var me=this;
	Suryani.BindEvent(me.element["ok"],"click",function(){
		for(var i=0;i<me.callBack["ok"].count();i++)
		{
			me.callBack["ok"].item(i)();
		}
		me.close();
	});
	Suryani.BindEvent(me.element["cancel"],"click",function(){
		for(var i=0;i<me.callBack["cancel"].count();i++)
		{
			me.callBack["cancel"].item(i)();
		}
		me.close();
	});
}
ConfirmPopup.prototype.buildContent=function()
{
	this.element["innerContentTd"].appendChild(this.element["tipDiv"]);
	this.element["innerButtonTd"].appendChild(this.element["ok"]);
	this.element["innerButtonTd"].appendChild(this.element["cancel"]);
	this.element["contentDiv"].appendChild(this.element["innerContentTable"]);
}
//End ConfirmPopup

//Start PromptPopup
function PromptPopup(param)
{
	this.base = new Popup(param);
	Suryani.extend(this,this.base);
	this.initContent();
}
PromptPopup.prototype.initContent=function()
{
	this.elementKey.push("tipDiv");
	this.elementKey.push("ok");
	this.elementKey.push("text");
	this.elementKey.push("innerContentTable");
	this.elementKey.push("innerContentTr");
	this.elementKey.push("innerContentTd");
	this.elementKey.push("innerButtonTr");
	this.elementKey.push("innerButtonTd");
	this.element["tipDiv"]=this.targetWindow.document.createElement("div");
	this.element["ok"]=this.targetWindow.document.createElement("input");
	this.element["ok"].setAttribute("type","button");
	this.element["ok"].setAttribute("value",Popup.language[this.config["language"]]["ok"]);
	this.element["text"]=this.targetWindow.document.createElement("input");
	this.element["text"].setAttribute("type","text");	
	this.element["tipDiv"].innerHTML=this.config["content"];
	this.element["innerContentTable"]=this.targetWindow.document.createElement("table");
	this.element["innerContentTr"]=this.element["innerContentTable"].insertRow(0);
	this.element["innerContentTd"]=this.element["innerContentTr"].insertCell(0);
	this.element["innerButtonTr"]=this.element["innerContentTable"].insertRow(1);
	this.element["innerButtonTd"]=this.element["innerButtonTr"].insertCell(0);
	this.callBack["ok"]=new List();
	this.callBack["text"]=new List();
	this.input="";
}
PromptPopup.prototype.bindContentEvents=function()
{
	var me=this;
	Suryani.BindEvent(me.element["ok"],"click",function(){
		for(var i=0;i<me.callBack["ok"].count();i++)
		{
			me.callBack["ok"].item(i)();
		}
		me.close();
	});
	Suryani.BindEvent(me.element["text"],"keyup",function(){
		me.input=me.element["text"].value;
	});
}
PromptPopup.prototype.buildContent=function()
{
	this.element["innerContentTd"].appendChild(this.element["tipDiv"]);
	this.element["innerContentTd"].appendChild(this.element["text"]);
	this.element["innerButtonTd"].appendChild(this.element["ok"]);
	this.element["contentDiv"].appendChild(this.element["innerContentTable"]);
}
//End PromptPopup

//Start HtmlPopup
function HtmlPopup(param)
{
	this.base = new Popup(param);
	Suryani.extend(this,this.base);
	this.initContent();
}
HtmlPopup.prototype.initContent=function()
{
	this.element["contentDiv"].innerHTML=this.config["content"];
}
HtmlPopup.prototype.bindContentEvents=function(){}
HtmlPopup.prototype.buildContent=function(){}
//End HtmlPopup

//Start UrlPopup
function UrlPopup(param)
{
	this.base = new Popup(param);
	Suryani.extend(this,this.base);
	this.config["autoSize"]=true;
	this.initContent();
}
UrlPopup.prototype.initContent=function()
{
	this.elementKey.push("url");
	this.element["url"]=this.targetWindow.document.createElement("iframe");
	this.element["url"].setAttribute("border","0");
	this.element["url"].setAttribute("frameBorder","0");
	this.element["url"].setAttribute("scrolling","no");
	this.element["url"].setAttribute("src",this.config["content"]);
}
UrlPopup.prototype.bindContentEvents=function(){
	var me=this;
	if(this.config["autoSize"])
	{
		Suryani.BindEvent(me.element["url"],"load",function(){
			try{
				var obj=me.element["url"];	
				if (obj.contentDocument && obj.contentDocument.body.offsetHeight)
				{
					obj.height = obj.contentDocument.body.scrollHeight;
					obj.width = obj.contentDocument.body.scrollWidth;
				}
				else
				{
					obj.height = obj.Document.body.scrollHeight;
					obj.width = obj.Document.body.scrollWidth;
				}
				me.size.height=obj.height;
				me.size.width=obj.width;
				me.setSize();
				me.setPosition();
			}catch(e){
			}
		});
	}
}
UrlPopup.prototype.buildContent=function()
{
	this.element["contentDiv"].appendChild(this.element["url"]);
}
//End UrlPopup