using System;
using UnityEditor;

	public class AutoBuilder
	{
		public AutoBuilder ()
		{
		}
		
		public static void PerformBuild ()
		{	
			FListMaker.BuildFileList();
        	string[] scenes = {"Assets/Scenes/Main.unity", "Assets/Scenes/Error.unity"};
       		//BuildPipeline.BuildPlayer(scenes,"win.exe",BuildTarget.StandaloneWindows,BuildOptions.None);
       		//BuildPipeline.BuildPlayer(scenes,"osx.app",BuildTarget.StandaloneOSXUniversal,BuildOptions.None);
        	BuildPipeline.BuildPlayer(scenes,"WebPlayer", BuildTarget.WebPlayerStreamed,BuildOptions.None);
       		scenes = null;
		}
	}
