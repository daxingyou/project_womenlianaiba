#pragma strict
public var colorRender : ColorRender;
public var gridproperty : GridProperty;
public var materialRender : MaterialRender;

private var operateMgr : OperateMgr;
private var dataCenter : DataCenter;

function Start()
{
	operateMgr = Camera.main.gameObject.GetComponent(OperateMgr);
	dataCenter = Camera.main.gameObject.GetComponent(DataCenter);
}

function OnMouseOver()
{
	if(Input.GetMouseButton(0))
	{
		switch(operateMgr.operate)
		{
			case OperateType.Clean:
				colorRender.reset();
				materialRender.reset();
				gridproperty.clean();
				break;
			case OperateType.Room:
				SetRoom(operateMgr.room);
				break;
			case OperateType.Grid:
				var gridType : GridType = dataCenter.GetGridTypeByIndex(operateMgr.gridTypeIndex);
				SetType(gridType);
				break;
		}
	}
}

public function SetGrid(gridType : GridType, room:int)
{
	SetType(gridType);
	SetRoom(room);
}

private function SetType(gridType : GridType)
{
	// 设置格子颜色
	colorRender.render(gridType.color);
	gridproperty.setType(gridType.typeId);
}

private function SetRoom(room:int)
{
	gridproperty.setRoomType(room);
	materialRender.render(room);
}