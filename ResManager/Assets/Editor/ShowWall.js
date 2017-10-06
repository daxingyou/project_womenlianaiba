#pragma strict

static var s : HouseWallShow = new HouseWallShow();//wall.GetComponent(HouseWallShow);
@MenuItem ("EQMenu/Show Wall")
static function Show(){
	var wall:GameObject = Selection.activeObject as GameObject;
	//var wall:GameObject = GameObject.Find("house_0120200");

	var mode:int = s.watchMode;
	mode = mode + 1;
	if (mode > 3)
		mode = 1;
	s.watchMode = mode;
	s.calcWatchMode(wall.transform);
}