using UnityEngine;
using UnityEditor;
using System.Collections;

public class ChangeMaterialSettings : ScriptableWizard
{
	// ----------------------------------------------------------------------------
	// Change Texture Type
	[MenuItem ("EQMenu/Material Setting/Change Shader Type/Diffuse")]
    static void ChangeShaderType_Diffuse()
	{
        ChangeShaderType("Diffuse");
    }
	
	[MenuItem ("EQMenu/Material Setting/Change Shader Type/Specular")]
    static void ChangeShaderType_Specular()
	{
        ChangeShaderType("Specular");
    }
	
	[MenuItem ("EQMenu/Material Setting/Change Shader Type/Transparent/Cutout/Diffuse")]
    static void ChangeShaderType_Transparent_Diffuse()
	{
        ChangeShaderType("Transparent/Cutout/Diffuse");
    }
	
	// ----------------------------------------------------------------------------
	// Change Main Color
	public Color MainColor;
	[MenuItem ("EQMenu/Material Setting/Change Main Color")]
    static void ChangeMainColor()
	{
		ScriptableWizard.DisplayWizard("Change Material Main Color", typeof(ChangeMaterialSettings), "Excute");
    }
	
	void OnWizardCreate()
	{
		ChangeShaderType(MainColor);
	}
	
	// ----------------------------------------------------------------------------
	// Implement Methods
	// ----------------------------------------------------------------------------
	static void ChangeShaderType(string type)
	{
		Shader sha = Shader.Find(type);
		if (null == sha)
		{
			Debug.LogError("Can't find shader '"+type+"' ...");
			return;
		}
		Object[] materials = GetSelectedMaterials();
		foreach (Material mat in materials)
		{
			mat.shader = sha;
		}
	}
	
	static void ChangeShaderType(Color col)
	{
		Object[] materials = GetSelectedMaterials();
		foreach (Material mat in materials)
		{
			mat.color = col;
		}
	}
	
	static Object[] GetSelectedMaterials()
	{
		Object[] materials = Selection.GetFiltered(typeof(Material), SelectionMode.DeepAssets);
		if (0 == materials.Length)
		{
			Debug.LogWarning("Please select one material at least...");
		}
		return materials;
	}
}

