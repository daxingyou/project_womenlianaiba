using UnityEditor;
using UnityEngine;
using System.Collections;

public class ShowObjRotation : MonoBehaviour {

	[MenuItem("EQMenu/Show GameObject Rotation")]
	static void OnShowGameObjectRotation()
	{
		if(Selection.activeGameObject != null)
		{
			Quaternion q = Selection.activeGameObject.transform.localRotation;
			Debug.Log("(" + q.x.ToString() + ", " + q.y.ToString() + ", " + q.z.ToString() + ", " + q.w.ToString() + ")");
		}
		else
			Debug.Log("select null!");
	}
}
