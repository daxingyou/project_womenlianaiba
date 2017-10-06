using UnityEngine;
using UnityEditor;
using System.Collections;

public class ChangeTextureImportSettings : ScriptableObject
{
	// ----------------------------------------------------------------------------
	// Change Texture Type
	[MenuItem ("EQMenu/Texture Improt Setting/Change Texture Type/Image")]
    static void ChangeTextureType_Image()
	{
        ChangeTextureType(TextureImporterType.Image);
    }
	
	[MenuItem ("EQMenu/Texture Improt Setting/Change Texture Type/Bump")]
    static void ChangeTextureType_Bump()
	{
        ChangeTextureType(TextureImporterType.Bump);
    }
	
	[MenuItem ("EQMenu/Texture Improt Setting/Change Texture Type/GUI")]
    static void ChangeTextureType_GUI()
	{
        ChangeTextureType(TextureImporterType.GUI);
    }
	
	[MenuItem ("EQMenu/Texture Improt Setting/Change Texture Type/Reflection")]
    static void ChangeTextureType_Reflection()
	{
        ChangeTextureType(TextureImporterType.Reflection);
    }
	
	[MenuItem ("EQMenu/Texture Improt Setting/Change Texture Type/Cookie")]
    static void ChangeTextureType_Cookie()
	{
        ChangeTextureType(TextureImporterType.Cookie);
    }
	
	[MenuItem ("EQMenu/Texture Improt Setting/Change Texture Type/Lightmap")]
    static void ChangeTextureType_Lightmap()
	{
        ChangeTextureType(TextureImporterType.Lightmap);
    }
	
	[MenuItem ("EQMenu/Texture Improt Setting/Change Texture Type/Advanced")]
    static void ChangeTextureType_Advanced()
	{
        ChangeTextureType(TextureImporterType.Advanced);
    }
	
	// ----------------------------------------------------------------------------
	// Change Texture Format
	[MenuItem ("EQMenu/Texture Improt Setting/Change Texture Format/Compressed")]
    static void ChangeTextureFormat_Auto()
	{
        ChangeTextureFormat(TextureImporterFormat.AutomaticCompressed);
    }
	
	[MenuItem ("EQMenu/Texture Improt Setting/Change Texture Format/16bit")]
    static void ChangeTextureFormat_16bit()
	{
        ChangeTextureFormat(TextureImporterFormat.Automatic16bit);
    }
	
	[MenuItem ("EQMenu/Texture Improt Setting/Change Texture Format/Truecolor")]
    static void ChangeTextureFormat_Truecolor()
	{
        ChangeTextureFormat(TextureImporterFormat.AutomaticTruecolor);
    }

    // ----------------------------------------------------------------------------
	// Change Max Texture Size
    [MenuItem ("EQMenu/Texture Improt Setting/Change Max Texture Size/32")]
    static void ChangeTextureSize_32()
	{
        ChangeTextureMaxSize(32);
    }
   
    [MenuItem ("EQMenu/Texture Improt Setting/Change Max Texture Size/64")]
    static void ChangeTextureSize_64()
	{
        ChangeTextureMaxSize(64);
    }
   
    [MenuItem ("EQMenu/Texture Improt Setting/Change Max Texture Size/128")]
    static void ChangeTextureSize_128()
	{
        ChangeTextureMaxSize(128);
    }
   
    [MenuItem ("EQMenu/Texture Improt Setting/Change Max Texture Size/256")]
    static void ChangeTextureSize_256()
	{
        ChangeTextureMaxSize(256);
    }
   
    [MenuItem ("EQMenu/Texture Improt Setting/Change Max Texture Size/512")]
    static void ChangeTextureSize_512()
	{
        ChangeTextureMaxSize(512);
    }
   
    [MenuItem ("EQMenu/Texture Improt Setting/Change Max Texture Size/1024")]
    static void ChangeTextureSize_1024()
	{
        ChangeTextureMaxSize(1024);
    }
   
    [MenuItem ("EQMenu/Texture Improt Setting/Change Max Texture Size/2048")]
    static void ChangeTextureSize_2048()
	{
        ChangeTextureMaxSize(2048);
    }
	
    [MenuItem ("EQMenu/Texture Improt Setting/Change Max Texture Size/4096")]
    static void ChangeTextureSize_4096()
	{
        ChangeTextureMaxSize(4096);
    }
   
	// ----------------------------------------------------------------------------
	// Implement Methods
	// ----------------------------------------------------------------------------
	static void ChangeTextureType(TextureImporterType type)
	{
		Object[] textures = GetSelectedTextures();
		Selection.objects = new Object[0];
		foreach (Texture2D texture in textures)
		{
			string path = AssetDatabase.GetAssetPath(texture);
			TextureImporter textureImporter = AssetImporter.GetAtPath(path) as TextureImporter;
			if (null == textureImporter)
			{
				Debug.LogWarning("file '"+path+"' can't change texture type...");
				continue;
			}
			TextureImporterSettings setting = new TextureImporterSettings();
			textureImporter.ReadTextureSettings(setting);
			setting.ApplyTextureType(type, true);
			textureImporter.SetTextureSettings(setting);
			AssetDatabase.ImportAsset(path);
		}
	}
	
	static void ChangeTextureMaxSize(int size)
	{
		Object[] textures = GetSelectedTextures();
		Selection.objects = new Object[0];
		foreach (Texture2D texture in textures)
		{
			string path = AssetDatabase.GetAssetPath(texture);
			TextureImporter textureImporter = AssetImporter.GetAtPath(path) as TextureImporter;
			if (null == textureImporter)
			{
				Debug.LogWarning("file '"+path+"' can't change texture max size...");
				continue;
			}
			textureImporter.maxTextureSize = size;
			AssetDatabase.ImportAsset(path);
		}
	}
	
	static void ChangeTextureFormat(TextureImporterFormat format)
	{
		Object[] textures = GetSelectedTextures();
		Selection.objects = new Object[0];
        foreach (Texture2D texture in textures)
		{
			string path = AssetDatabase.GetAssetPath(texture);
			TextureImporter textureImporter = AssetImporter.GetAtPath(path) as TextureImporter;
			if (null == textureImporter)
			{
				Debug.LogWarning("file '"+path+"' can't change texture format...");
				continue;
			}
			textureImporter.textureFormat = format;
			AssetDatabase.ImportAsset(path);
		}
	}
	
	static Object[] GetSelectedTextures()
	{
		Object[] textures = Selection.GetFiltered(typeof(Texture2D), SelectionMode.DeepAssets);
		if (0 == textures.Length)
		{
			Debug.LogWarning("Please select one texture at least...");
		}
		return textures;
	}
}

