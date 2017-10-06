#pragma strict
public var moveStep : int = 5;

function Update () {
	if(Input.GetKey ("up"))
		this.transform.position += Vector3(0, 0, -moveStep);
	else if(Input.GetKey("down"))
		this.transform.position += Vector3(0, 0, moveStep);
	else if(Input.GetKey("left"))
		this.transform.position += Vector3(moveStep, 0, 0);
	else if(Input.GetKey("right"))
		this.transform.position += Vector3(-moveStep, 0, 0);
}