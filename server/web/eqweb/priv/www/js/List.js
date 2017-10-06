function List()
{
	this.data=new Array();
}
List.prototype.count=function()
{
	return this.data.length;
}

List.prototype.indexOf=function(item)
{
	var index=-1;
	for(var i=this.count();i>=0;)
	{
		if(this.data[--i]==item)
		{
			index=i;
			break;
		}
	}
	return index;
}
List.prototype.contain=function(item)
{
	return this.indexOf(item)==-1?false:true;
}
List.prototype.add=function(item)
{
	if(this.contain(item))
	{
		return;
	}
	this.data.push(item);
}
List.prototype.removeAt=function(index)
{
	for(var i=index;i<this.count()-1;i++)
	{
		this[i]=this[i+1];
	}
	return this.data.pop();
}
List.prototype.item=function(index)
{
	if(index>=0 && index<=this.count()-1)
	{
		return this.data[index]
	}
}
List.prototype.remove=function(item)
{
	var index=this.indexOf(item);
	if(index!=-1)
	{
		return this.removeAt(index);
	}
	return null;
}