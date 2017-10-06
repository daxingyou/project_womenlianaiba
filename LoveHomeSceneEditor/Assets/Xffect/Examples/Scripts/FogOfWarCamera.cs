using UnityEngine;
using System.Collections;

public class FogOfWarCamera : MonoBehaviour 
{

    public Transform Target;
    public float MoveSpeed = 10;

	void Start () 
    {
        transform.parent = Target.transform;
	}
	
	void Update () 
    {
        transform.LookAt(Target.transform);
        Vector3 directionVector = new Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical"));
        Target.transform.position += directionVector * MoveSpeed * Time.deltaTime;
	}

    void OnGUI()
    {
        GUI.Label(new Rect(150, 0, 350, 25), "NOTICE: currently is not supported with AA.");
        GUI.Label(new Rect(200, 18, 200, 25), "WASD to move the client");
    }
}
