#pragma strict
public var colorRender : ColorRender;
public var isUse : boolean = false;
public var floor : int;
public var x0 : int;
public var z0 : int;
public var x1 : int;
public var z1 : int;

private var operateMgr : OperateMgr;

function Start()
{
	operateMgr = Camera.main.gameObject.GetComponent(OperateMgr);
}

function OnMouseEnter()
{
	if((operateMgr.operate == OperateType.Wall) && Input.GetMouseButton(0))
	{
		SetWall(isUse);
		isUse = !isUse;
	}
}

private function SetWall(isShow : boolean)
{
	if(isShow)
		colorRender.render(Color.red);
	else
		colorRender.render(Color.black);
	
	
}
