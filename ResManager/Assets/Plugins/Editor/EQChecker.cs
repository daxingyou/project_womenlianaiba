using UnityEngine;
using UnityEditor;
using System.IO;
using System.Collections;

public class EQChecker
{
	[MenuItem("Assets/Check/Model dirty check")]
	static void OnMIModelDirtyCheckClicked()
	{
		StreamWriter sw = File.CreateText("ModelDirtyCheckResult.txt");
		foreach (UnityEngine.Object o in Selection.GetFiltered(typeof(UnityEngine.Object), SelectionMode.DeepAssets))
		{
			GameObject gobj = o as GameObject;
			
			if(null == gobj)
				continue;
			
			int cnt = gobj.GetComponentsInChildren(typeof(Transform), true).Length;
			string msg = "";
			
			if(cnt > 1)
			{
				Debug.Log("'" + o.name + "' childs:" + cnt.ToString());
				msg  = o.name + " childs:" + cnt.ToString();
			}
			else
			{
				if(gobj.renderer.sharedMaterial == null ||
				   gobj.renderer.sharedMaterials.Length == 0)
				{
					Debug.Log("'" + o.name + "' material is empty.");
					msg = o.name + " material is empty";
				}
				else
				{
					foreach(Material mat in gobj.renderer.sharedMaterials)
					{
						if(null == mat.mainTexture)
						{
							Debug.Log("'" + o.name + "' texture is empty.");
							msg = o.name + " texture is empty";
							break;
						}
					}
				}
			}
			
			if(msg != "")
				sw.WriteLine(msg);
		}
		sw.Close();
	}
	
	[MenuItem("Assets/Check/Model texture check")]
	static void OnMIModelTextureCheckClicked()
	{
		StreamWriter sw = File.CreateText("ModelTextureCheckResult.txt");
		foreach (UnityEngine.Object o in Selection.GetFiltered(typeof(UnityEngine.Object), SelectionMode.DeepAssets))
		{
			GameObject gobj = o as GameObject;
			
			if(null == gobj)
				continue;
			
			foreach(Renderer rd in gobj.GetComponentsInChildren(typeof(Renderer), true))
			{
				foreach(Material mat in rd.sharedMaterials)
				{
					if(null == mat.mainTexture)
					{
						string msg = "GameObject '" + rd.gameObject.name + "' material '" + mat.name + " missing texture.";
						Debug.Log(msg);
						sw.WriteLine(msg);
					}
				}
			}
		}
		sw.Close();
	}
}
