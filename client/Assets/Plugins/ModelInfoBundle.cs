using System;
using UnityEngine;

[Serializable]
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
	public ModelInfo Main;
	public ModelInfo []Childs;
}
