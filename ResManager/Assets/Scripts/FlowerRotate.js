#pragma strict
function Update () {
	 transform.RotateAround (Vector3.zero, Vector3.up, 20 * Time.deltaTime);
}