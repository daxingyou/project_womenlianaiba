#pragma strict
private var y = 0.0;
var horizontalSpeed = 5.0;



function Start()
{

}

function Update () {
	
	var dt = Time.deltaTime;
	y -= horizontalSpeed * dt;
	
	var rotation = Quaternion.Euler(0, y, 0); 
	transform.rotation = rotation;
}