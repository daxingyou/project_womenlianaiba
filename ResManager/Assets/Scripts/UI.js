
private var typeWidth:int = 80;
private var buttonWidth:int = 20 + 50;

//var target : Transform;
var wall : GameObject;
var xSpeed = 250.0;
var ySpeed = 120.0;

var yMinLimit = -20;
var yMaxLimit = 80;

var initDis = 20;
var minDis = 3.0;
var maxDis = 50.0;

var wheelSpeed = 5;


static var x = 0.0;
static var y = 0.0;

static var distance;

private var position;
private var rotation;

private var s : HouseWallShow = new HouseWallShow();

function Start()
{
	CheckHouseCompsName(wall);
}

function OnGUI()
{
    GUILayout.BeginArea(new Rect(350, 10, typeWidth + 2 * buttonWidth + 8, 500));
    GUILayout.BeginHorizontal();
    
    if (GUILayout.Button("显示墙体", GUILayout.Height(50)))
    {
		ChangeMode();
    }
    
    GUILayout.EndHorizontal();
    GUILayout.EndArea();
}

function Update()
{
     if (Input.GetKeyDown("f1"))
     	ChangeMode();
     	
     s.calcWatchMode(wall.transform);
}

function ChangeMode()
{
	//var script:UnityScript = wall.GetComponent("aaa");
	var mode:int = s.watchMode;
	mode = mode + 1;
	if (mode > 3)
		mode = 1;
	s.watchMode = mode;
	s.calcWatchMode(wall.transform);
}

function CheckName(frame_name : String):boolean
{
	var name_str : String[] = frame_name.Split(["_"], StringSplitOptions.RemoveEmptyEntries);
	if (5 != name_str.Length){
		Debug.Log("house frame name '" + frame_name + "' is wrong!");
		return false;
	}
	if (name_str[0] != "house")	{
		Debug.Log("house frame name '" + frame_name + "' is wrong!");
		return false;
	}
	var type_str : String = name_str[2];
	switch(type_str)
	{
		case "groundbase":
		case "static":
		case "innerwall":
		case "inneredge":
		case "outwall":
		case "outedge":
		case "floor":
		case "roof":
		case "tcx":
		case "edgetcx":
			break;
		default:
			Debug.Log("house frame name '" + frame_name + "' is wrong!");
			return false;
	}
	return true;
}

public function CheckHouseCompsName(house_obj : GameObject) : void
{
	for (var trans_obj : System.Object in house_obj.GetComponentsInChildren(Transform))
	{
		var trans : Transform = trans_obj as Transform;
		if (house_obj == trans.gameObject)
			continue;
		
		CheckName(trans.gameObject.name);
	}
}
