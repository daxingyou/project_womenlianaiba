using System;
using UnityEngine;

[Serializable]

public enum AssetBundleType {
	Bundle_TotalExport = 0,					//fbx file export total(files:??.mod)
	Bundle_AnisExport = 1,					//fbx file export anis(files:??.anis)
}

public class ModelInfo
{
	public string Model;
	public string Mat;//main material
	public string Ani;//default animation
	public string [] Mats;
	public string [] Texs;
	public string [] Anis;
}

public class ModelInfoBundle : ScriptableObject
{
	public AssetBundleType type;
	public ModelInfo Main;
	public ModelInfo []Childs;
}
