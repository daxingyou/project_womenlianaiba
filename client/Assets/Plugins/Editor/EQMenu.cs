using System.IO;
using UnityEditor;
using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

public class EQMenu
{
	public static readonly string AssetbundleExt = ".u3d";
	public static readonly string ModelExt = ".mesh";
	public static readonly string ModelInfoExt = ".mod";
	public static readonly string AniExt = ".ani";
	
	static string selPath = "";
	
	[MenuItem("Assets/Create Assetbundle")]
	static void OnMICreateDataAssetbundleClickedA()
	{
		OnMICreateAssetbundleClicked();
	}
	
	[MenuItem("EQMenu/Create Assetbundle")]
	static void OnMICreateDataAssetbundleClicked()
	{
		OnMICreateAssetbundleClicked();
	}
	
	static void OnMICreateAssetbundleClicked()
	{
		if(!SelOutputDir())
			return;
		
		foreach (UnityEngine.Object o in Selection.GetFiltered(typeof(UnityEngine.Object), SelectionMode.DeepAssets))
		{
			string fpath = AssetDatabase.GetAssetPath(o);
			
			if(fpath.EndsWith(".xml", StringComparison.OrdinalIgnoreCase))
			{
				CreateAssetbundle(o);
			}
			else if(fpath.EndsWith(".fbx", StringComparison.OrdinalIgnoreCase))
			{
				CreateModelAssetbundle(o);
			}
			else if(fpath.EndsWith(".prefab", StringComparison.OrdinalIgnoreCase))
			{
				CreatePrefabAssetbundle(o);
			}
			else if(o is Material)
			{
				ExportMaterial(o as Material);
			}
			else if(o is Texture)
			{
				ExportTexture(o as Texture);
			}
			else
			{
				Debug.Log("file '" + fpath + "' can not to create asset bundle!");
			}
		}
	}
	
	static void CreateAssetbundle(UnityEngine.Object obj)
	{
		string fpath = selPath + Path.GetFileName(AssetDatabase.GetAssetPath(obj)) + AssetbundleExt;
		CheckFile(fpath);
		BuildAssetBundle2(obj, fpath);
	}
	
	static void CreatePrefabAssetbundle(UnityEngine.Object obj)
	{
		string apath = AssetDatabase.GetAssetPath(obj);
		string fpath = selPath + Path.GetFileName(apath) + AssetbundleExt;
		CheckFile(fpath);
		//BuildAssetBundle3(apath, fpath);
		BuildAssetBundle2(obj, fpath);
	}
	
	static void CreateModelAssetbundle(UnityEngine.Object obj)
	{
		string mfname = obj.name + ModelExt + AssetbundleExt;
		
		//model info
		ModelInfoBundle minfo = ScriptableObject.CreateInstance<ModelInfoBundle>();
		minfo.name = obj.name;
		FillModelInfo(obj as GameObject, minfo, mfname);
		BuildAssetBundle1((UnityEngine.Object)minfo, selPath + obj.name + ModelInfoExt + AssetbundleExt);
		ScriptableObject.DestroyImmediate(minfo);
		
		//Materials, Textures, animation
		ExportModelInfo(obj as GameObject);
		
		//model
		GameObject objClone = (GameObject)GameObject.Instantiate(obj);
		objClone.name = obj.name;
		ClearModelInfo(objClone);
		CheckFile(selPath + mfname);
		BuildAssetBundle(objClone, selPath + mfname);
		UnityEngine.Object.DestroyImmediate(objClone);
	}
	
	static bool SelOutputDir()
	{
		if(selPath == "")
			selPath = Application.dataPath;
		
		string spath = EditorUtility.SaveFolderPanel("Select a save directory", selPath, "");
		
		//click cancel or close button
		if(spath == "")
			return false;
		
		selPath = spath + "/";
		
		return true;
	}
	
	static void CheckFile(string fpath)
	{
		if(File.Exists(fpath))
			Debug.LogWarning("File '" + fpath + "' has exists!");
	}
	
	static void CheckAndCreateDir(string dir)
	{
		if (!Directory.Exists(dir))
            Directory.CreateDirectory(dir);
	}
	
	static void CheckDir(string fpath)
	{
		string fdir = Path.GetDirectoryName(fpath);
		
		CheckAndCreateDir(fdir);
	}
	
	static void FillModelInfos(GameObject obj, ModelInfo minfo)
	{
		List<string> anis = new List<string>();
		
		if(obj.animation)
		{
			foreach(AnimationState ani in obj.animation)
			{
				anis.Add(ani.name + AniExt + AssetbundleExt);
				
				Debug.Log("    Ani:" + anis[anis.Count - 1]);
			}
			if(obj.animation.clip)
				minfo.Ani = obj.animation.clip.name;
			else
				minfo.Ani = "";
		}
		minfo.Anis = anis.ToArray();
		
		Renderer mr = obj.renderer;
		if(mr == null)
			return;
		
		string fpath = "";
		
		List<string> mats = new List<string>();
		List<string> txts = new List<string>();
		
		foreach(Material mat in mr.sharedMaterials)
		{
			if(mat == null)
			{
				Debug.Log("    material missing");
				continue;
			}
			
			fpath = AssetDatabase.GetAssetPath(mat);
			mats.Add(Path.GetFileName(fpath) + AssetbundleExt);
			
			if(mat.mainTexture == null)
				txts.Add("");
			else
			{
				fpath = AssetDatabase.GetAssetPath(mat.mainTexture);
				txts.Add(Path.GetFileName(fpath) + AssetbundleExt);
			}
			
			Debug.Log("    Mat:" + mats[mats.Count - 1] + "; Tex:" + txts[txts.Count - 1]);
		}
		minfo.Mats = mats.ToArray();
		minfo.Texs = txts.ToArray();
		
		if(mr.sharedMaterial)
			minfo.Mat = mr.sharedMaterial.name;
		else
			minfo.Mat = "";
		
	}
	
	static void FillModelInfo(GameObject obj, ModelInfoBundle minfo, string mname)
	{
		Debug.Log("Model '" + mname + "' informations:");
		minfo.Main = new ModelInfo();
		minfo.Main.Model = mname;
		FillModelInfos(obj, minfo.Main);
		
		List<ModelInfo> childs = new List<ModelInfo>();
		foreach(Renderer rd in obj.GetComponentsInChildren(typeof(Renderer), true))
		{
			if(rd.gameObject == obj)
				continue;
			
			Debug.Log("  Child model '" + rd.name + "' informations:");
			ModelInfo mi1 = new ModelInfo();
			mi1.Model = rd.name;
			childs.Add(mi1);
			FillModelInfos(rd.gameObject, mi1);
		}
		minfo.Childs = childs.ToArray();
	}
	
	static void ExportAnimationClip(AnimationClip aniClip)
	{
		string efpath = selPath + aniClip.name + AniExt + AssetbundleExt;
		CheckFile(efpath);
		
		BuildAssetBundle2(aniClip, efpath);
	}
	
	static void ExportMaterial(Material mat)
	{
		string fpath = AssetDatabase.GetAssetPath(mat);
		string efpath = selPath + Path.GetFileName(fpath) + AssetbundleExt;
		CheckFile(efpath);
		
		if(mat.mainTexture != null)
			ExportTexture(mat.mainTexture);
		
		Material mats = (Material)GameObject.Instantiate(mat);
		if(mat.mainTexture != null)//material name . texture name
			mats.name = mat.name + "+" + GetFileName(mat.mainTexture) + AssetbundleExt;
		else
			mats.name = mat.name;
		mats.mainTexture = null;
		BuildAssetBundle1((UnityEngine.Object)mats, efpath);
		UnityEngine.Object.DestroyImmediate(mats);
	}
	
	static void ExportTexture(Texture tex)
	{
		string fpath = AssetDatabase.GetAssetPath(tex);
		string efpath = selPath + Path.GetFileName(fpath) + AssetbundleExt;
		CheckFile(efpath);
		BuildAssetBundle2(tex, efpath);
	}
	
	static void ExportModelInfos(Renderer mr)
	{
		if(mr == null)
			return;
		
		foreach(Material mat in mr.sharedMaterials)
		{
			if(mat)
				ExportMaterial(mat);
		}
	}
	
	static void ExportModelInfo(GameObject obj)
	{
		ExportModelInfos((Renderer)obj.GetComponent(typeof(Renderer)));
		
		foreach(Renderer mr1 in obj.GetComponentsInChildren(typeof(Renderer), true))
		{
			if(mr1.gameObject == obj)
				continue;
			
			ExportModelInfos(mr1);
		}
		
		foreach(AnimationState ani in obj.animation)
		{
			ExportAnimationClip(obj.animation.GetClip(ani.name));
		}
	}
	
	static void ClearModelInfo(Renderer mr)
	{
		if(mr == null)
			return;
		
		//
		//mr.material = null;
		//mr.materials = new Material[mr.materials.Length];
		
		//
		mr.sharedMaterial = null;
		mr.sharedMaterials = new Material[mr.sharedMaterials.Length];
	}
	
	static void ClearModelInfo(GameObject obj)
	{
		ClearModelInfo((Renderer)obj.GetComponent(typeof(Renderer)));
		
		foreach(Renderer mr1 in obj.GetComponentsInChildren(typeof(Renderer), true))
		{
			if(mr1.gameObject == obj)
				continue;
			
			ClearModelInfo(mr1);
		}
		
		foreach(AnimationState ani in obj.animation)
		{
			obj.animation.RemoveClip(ani.name);
		}
		obj.animation.clip = null;
	}
	
	//1.create temp prefab
	//2.fill the temp prefab
	//3.export temp prefab
	//4.delete temp prefab
	public static bool BuildAssetBundle(GameObject mainAsset, string pathName)
	{
		UnityEngine.Object tempPrefab = PrefabUtility.CreateEmptyPrefab("Assets/" + mainAsset.name + ".prefab");
        tempPrefab = PrefabUtility.ReplacePrefab(mainAsset, tempPrefab);
		
		bool rtn = BuildPipeline.BuildAssetBundle(tempPrefab,
		                                          null,
		                                          pathName,
		                                          BuildAssetBundleOptions.CollectDependencies,
		                                          BuildTarget.WebPlayer);
        AssetDatabase.DeleteAsset(AssetDatabase.GetAssetPath(tempPrefab));
		
		return rtn;
	}
	
	//1.create temp asset
	//2.load temp asset
	//3.export temp asset
	//4.delete temp asset
	public static bool BuildAssetBundle1(UnityEngine.Object mainAsset, string pathName)
	{
		string tempAssetName = "Assets/" + mainAsset.name + ".asset";
		AssetDatabase.CreateAsset(mainAsset, tempAssetName);
		UnityEngine.Object tempAsset = AssetDatabase.LoadAssetAtPath(tempAssetName, typeof(UnityEngine.Object));
		
		bool rtn = BuildPipeline.BuildAssetBundle(tempAsset,
		                                          null,
		                                          pathName,
		                                          BuildAssetBundleOptions.CollectDependencies,
		                                          BuildTarget.WebPlayer);
        AssetDatabase.DeleteAsset(tempAssetName);
        
		return rtn;
	}
	
	//export asset object immediately
	public static void BuildAssetBundle2(UnityEngine.Object mainAsset, string pathName)
	{
		BuildPipeline.BuildAssetBundle(mainAsset,
		                               null,
		                               pathName,
		                               BuildAssetBundleOptions.CollectDependencies,
		                               BuildTarget.WebPlayer);
	}
	
	//1.load asset from asset path
	//2.export
	public static void BuildAssetBundle3(string assetPath, string pathName)
	{
		BuildPipeline.BuildAssetBundle(AssetDatabase.LoadAssetAtPath(assetPath, typeof(UnityEngine.Object)),
		                               	null,
		                               	pathName,
	                               		BuildAssetBundleOptions.CollectDependencies,
	                               		BuildTarget.WebPlayer);
	}
	
	public static string GetFileName(UnityEngine.Object obj)
	{
		return Path.GetFileName(AssetDatabase.GetAssetPath(obj));
	}
}
