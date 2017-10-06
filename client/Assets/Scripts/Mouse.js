#pragma strict

var target : Transform;

var xSpeed = 250.0;
var ySpeed = 120.0;

var yMinLimit = -20;
var yMaxLimit = 80;

var initDis = -500;
var minDis = -5000.0;
var maxDis = 5000.0;

var wheelSpeed = 500;

static var x = 0.0;
static var y = 0.0;

static var distance : float;

var firstCameraPt : Vector3 = Vector3.zero;

function Start () {
	
	x = 130;
	y = 30;
	
	if(target)
	{
		transform.rotation = Quaternion.Euler(y, x, 0);;
		transform.position = Quaternion.Euler(y, x, 0) * Vector3(0.0, 0.0, -initDis) + target.position;
	}
	
	// Make the rigid body not change rotation
	if (rigidbody)
		rigidbody.freezeRotation = true;
}

function Update () {
	if(target)
	{
		distance = Vector3.Distance(target.position,transform.position);
		if(Input.GetMouseButton(0)){
			x += Input.GetAxis("Mouse X") * xSpeed * 0.02;
			y -= Input.GetAxis("Mouse Y") * ySpeed * 0.02;
			
			y = ClampAngle(y, yMinLimit, yMaxLimit);
		} 
		distance -= Input.GetAxis("Mouse ScrollWheel")*wheelSpeed;//获取鼠标中建响应
		//distance = Mathf.Clamp(distance,minDis,maxDis);//距离取最大值和最小值
		
		var rotation : Quaternion = Quaternion.Euler(y, x, 0);
		var position : Vector3 = rotation * Vector3(0.0, 0.0, -distance) + target.position;
		
		transform.rotation = rotation;
		transform.position = position;
	}
}

function Control1()
{
	var dx : float;
	var dy : float;
	
	if(Input.GetKey(KeyCode.A))
	{
		transform.Translate(0.1f,0.0f,0.0f);
	}
	else if(Input.GetKey(KeyCode.D))
	{
		transform.Translate(-0.1f,0.0f,0.0f);
	}
	else if(Input.GetKey(KeyCode.W))
	{
		transform.Translate(0.0f,0.0f,0.1f);
	}
	else if(Input.GetKey(KeyCode.S))
	{
		transform.Translate(0.0f,0.0f,-0.1f);
	}

    if(Input.GetMouseButton(0))
    {
    	dx = Input.GetAxis("Mouse X");
    	dy = Input.GetAxis("Mouse Y");
    	
    	transform.rotation *= Quaternion.Euler(dy, -dx, 0);
    	//transform.Rotate(dy * 0.5, dx * 0.5, 0.0);
    }
    else if(Input.GetMouseButton(1))
	{
		dx = Input.GetAxis("Mouse X");
		dy = Input.GetAxis("Mouse Y");
		
		transform.Translate(0.0 - dx * 0.1, 0.0 - dy * 0.1, 0.0);
	}
	
	transform.Translate(0.0f,0.0f,0-Input.GetAxis("Mouse ScrollWheel"));
}

function ZoomIn()
{
	if (target) {
		distance = Vector3.Distance(target.position,transform.position);

		distance-= wheelSpeed;//获取鼠标中建响应
		//distance = Mathf.Clamp(distance,minDis,maxDis);//距离取最大值和最小值
		
		var rotation : Quaternion = Quaternion.Euler(y, x, 0);
		var position : Vector3 = rotation * Vector3(0.0, 0.0, -distance) + target.position;
		
		transform.rotation = rotation;
		transform.position = position;
	}
}

function ZoomOut()
{
	if (target) {
		distance = Vector3.Distance(target.position,transform.position);

		distance+= wheelSpeed;//获取鼠标中建响应
		//distance = Mathf.Clamp(distance,minDis,maxDis);//距离取最大值和最小值
		
		var rotation : Quaternion = Quaternion.Euler(y, x, 0);
		var position : Vector3 = rotation * Vector3(0.0, 0.0, -distance) + target.position;
		
		transform.rotation = rotation;
		transform.position = position;
	}
}

static function ClampAngle (angle : float, min : float, max : float) {
	if (angle < -360)
	   angle += 360;
	if (angle > 360)
	   angle -= 360;
	return Mathf.Clamp (angle, min, max);
}