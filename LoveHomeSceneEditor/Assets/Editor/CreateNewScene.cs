using UnityEngine;
using System.Collections;
using UnityEditor;

public class CreateNewScene : MonoBehaviour {
	
	//创建场景节点--  
	[MenuItem("Love/create love home scene GameObject")]
	static void createScene()
	{
		GameObject sceneNode = GameObject.Find("LoveHomeScene");
		if(sceneNode!=null)
		{
			Debug.LogWarning("Fail: GameObject 'LoveHomeScene' is existed!");
			return;
		}
		
		//创建主节点--
		sceneNode = new GameObject ("LoveHomeScene");
		sceneNode.AddComponent("LoveHomeSceneConfig");
		
			//创建房屋节点--
			GameObject houseNode = new GameObject ("House");
			houseNode.transform.parent = sceneNode.transform;
		
		//
		Debug.Log("Create love home scene GameObject OK!");
	}
	

}
