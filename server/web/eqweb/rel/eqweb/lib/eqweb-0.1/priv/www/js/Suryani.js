var Suryani={};
Suryani.extend=function(destination, source) 
{
	for (var property in source)
  	{
  		if(destination[property])
		{
			continue;
		}
    	destination[property] = source[property];
	}
  	return destination;
};
Suryani.clone=function(matrix)
{
	if(typeof(matrix)=="function")
	{
		return new matrix();
	}
	else if(typeof(matrix)=="object")
	{
		var cloning=new Object();
		for(var member in matrix)
		{
			switch(typeof(matrix[member]))
			{
				case "object":
					cloning[member]=clone(matrix[member]);
					break;
				default:
					cloning[member]=matrix[member];
			}
		}
		return cloning;
	}
	else
	{
		var cloning = matrix;
		return cloning;
	}
}
Suryani.getWindowWidth=function(objWindow)
{
	if(objWindow.innerWidth)
	{
		return Math.min(objWindow.innerWidth,objWindow.document.documentElement.clientWidth);
	}
	else
	{
		return objWindow.document.documentElement.clientWidth;
	}
}

Suryani.getWindowHeight=function(objWindow)
{
	if(objWindow.innerHeight)
	{
		return Math.min(objWindow.innerHeight,objWindow.document.documentElement.clientHeight);
	}
	else
	{
		return objWindow.document.documentElement.clientHeight;
	}
}

Suryani.getDocumentScrollTop=function(objDocument)
{
	return Math.max(objDocument.documentElement.scrollTop,objDocument.body.scrollTop);
}

Suryani.getDocumentScrollLeft=function(objDocument)
{
	return Math.max(objDocument.documentElement.scrollLeft,objDocument.body.scrollLeft);
}

Suryani.getDocumentWidth=function(objDocument)
{
	return objDocument.documentElement.scrollWidth;
}

Suryani.getDocumentHeight=function(objDocument)
{
	return objDocument.documentElement.clientHeight;
}

Suryani.maxZIndex=function(objDocument)
{
	var zIndex=0;
	var elments=objDocument.getElementsByTagName("*");
	for(var i=0;i<elments.length;i++){
		if(elments[i].style.zIndex)
		{
			if(zIndex<parseInt(elments[i].style.zIndex))
			{
				zIndex=elments[i].style.zIndex;
			}
		} 
	}
	var lastIndex = parseInt(zIndex);
	return (lastIndex>1000)?lastIndex:lastIndex+1000;
}

Suryani.BindEvent=function(element,type,listener)
{
	if (window.addEventListener) 
	{
   		element.addEventListener(type, listener, false);
	} 
	else if (window.attachEvent) 
	{
		element.attachEvent('on'+type, listener);
	}
}
Suryani.userAgent = navigator.userAgent.toLowerCase();
Suryani.browser = {
    version: (Suryani.userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
    safari: /webkit/.test(Suryani.userAgent),
    opera: /opera/.test(Suryani.userAgent),
    msie: /msie/.test(Suryani.userAgent) && !/opera/.test(Suryani.userAgent),
    mozilla: /mozilla/.test(Suryani.userAgent)&&!/(compatible|webkit)/.test(Suryani.userAgent)
};

var logger = function(cid){
	this.containerId = cid;
};
logger.prototype.log = function(message)
{
	$(this.containerId).append("<div>"+message+"</div>");
}


if(!window.console)
{
	window.console = new logger("#consoleinfo");
}

if(!window.debug)
{
	window.debug = new logger("#debuginfo");
}
