using UnityEditor;
using UnityEngine;

class EQAssetPostprocessor : AssetPostprocessor
{
	// This method is called just before importing an FBX.
	void OnPreprocessModel()
	{
		//ModelImporter mi = (ModelImporter)assetImporter;
	}

	// This method is called immediately after importing an FBX.
	void OnPostprocessModel(GameObject go)
	{
		
	}
}
