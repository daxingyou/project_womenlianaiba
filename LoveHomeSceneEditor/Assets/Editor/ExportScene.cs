using System.IO;
using UnityEditor;
using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;


public class ExportScene : MonoBehaviour {
	public static readonly string AssetbundleExt = ".u3d";
	
	static string selPath = "";

	[MenuItem("Love/Build Love Home Scene File")]
	static void ExportResource () {
		//System.IO.Directory.CreateDirectory("AssetBundles");
		
		//保存对话框--
		string spath = EditorUtility.SaveFolderPanel("Warning:This operation will DELETE other GameObject!\nSelect a Directory", selPath, "");
		if(spath == "")
			return;
		selPath = spath + "/";
		
		//删除无用资源--
		delUseless();
		
		//先保存--
		EditorApplication.SaveScene("");
	
		//export--
		exportCurrScene();
	}
	
	//导出当前场景--
	static void exportCurrScene()
	{
		string[] levels = {EditorApplication.currentScene};
		string opath = selPath + Path.GetFileName(EditorApplication.currentScene) + AssetbundleExt;
		
		BuildPipeline.BuildStreamedSceneAssetBundle(levels, opath, BuildTarget.WebPlayerStreamed);
		
		Debug.LogWarning("Build scene '" + EditorApplication.currentScene + "' OK!");
	}
	
	//导出选中的列--
	static void exportBySelection()
	{
		int numBuild = 0;
		foreach (UnityEngine.Object o in Selection.GetFiltered(typeof(UnityEngine.Object), SelectionMode.TopLevel))
		{
			string fpath = AssetDatabase.GetAssetPath(o);
			if(fpath.EndsWith(".unity", StringComparison.OrdinalIgnoreCase))
			{
				string opath = selPath + Path.GetFileName(fpath) + AssetbundleExt;
				
				string[] levels = {fpath};
				BuildPipeline.BuildStreamedSceneAssetBundle(levels, opath, 
					BuildTarget.WebPlayerStreamed); 
				
				numBuild++;
			}
		}

		Debug.Log("Build " + numBuild.ToString() + " scene ok!");
	}
	
	//删除无用资源--
	static void delUseless()
	{
		delOtherGameObject();
		
		//复位天空盒--
		RenderSettings.skybox = null;
	}
	
	//删除LoveHomeScene之外的节点--
	static void delOtherGameObject()
	{
		while(true)
		{
			bool noOtherNode = true;
			GameObject[] gameObjs = GameObject.FindObjectsOfType(typeof (GameObject)) as GameObject[];
			foreach (GameObject o in gameObjs)
			{
				//如果根节点不是 LoveHomeScene, 就删除这个节点--
				GameObject rootObj = o.transform.root.gameObject;
				if(rootObj.name != "LoveHomeScene")
				{
					UnityEngine.Object.DestroyImmediate(rootObj);
					noOtherNode = false;
					break;
				}
			}
			
			if(noOtherNode)
				break;
		}
		
	}
}
