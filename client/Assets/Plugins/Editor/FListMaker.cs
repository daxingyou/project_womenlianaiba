using UnityEngine;
using UnityEditor;
using System;
using System.IO;
using System.Xml;
using System.Text;
using System.Collections;
using System.Collections.Generic;
using System.Security.Cryptography;

/*
 * 更新列表制作方式
 * 从某个目录中遍历所有符合文件并获取md5值，加载现有文件列表 FullFilelist.xml文件并判断md5码，最终输出已打包好的文件列表u3d包到某个目录。
 * 流程
 * 1.根据弹出对话框，选择要搜索文件的目录，有需要可以手动修改搜索表达式，语法参考MSDN .Net；
 * 2.点ok后将输出结果：Filelist.xml和FullFilelist.xml到Assets目录；Filelist.xml.u3d到第一步选择的目录；
 *   Filelist.xml.u3d即为最终结果，FullFilelist.xml为备份文件，下次生成时将会以这个文件的版本值进行累加（不能丢）。
 * 3.若有钩选"Update 'FLSummary' file"选项，则会更新”FLSummary.xml“文件。
 */

public class FListMaker
{
	[MenuItem("Assets/Build FileList")]
	static void OnMIBuildFListClickedA()
	{
		BuildFileList();
	}
	
	[MenuItem("EQMenu/Build FileList")]
	static void OnMIBuildFListClicked()
	{
		BuildFileList();
	}
	
	public	static void BuildFileList()
	{
		FListMaker fm = new FListMaker();
		selPath = "./";
		fm.DoBuildFileList();
	}
	
	//AssetBundles and WebPlayer's parent dir
	public static string selPath = "";
	public static string selPattern = "*.u3d";
	public static string saveFName = "Filelist.xml";
	public static string saveFile = "Assets/Resources/" + saveFName;
	public static string publichDir = "/WebPlayer";
    public static string saveFullFile = publichDir + "/FullFilelist.xml";
    public static string saveU3dFile = publichDir + "/" + saveFName + EQMenu.AssetbundleExt;
	public static string saveFLSFile = publichDir + "/FLSummary.xml";
	public static string assertBundleDir = "/AssetBundles";
	public static string assertBundleVerDir = "/AssetBundles_ver";
	
	bool updateFLSummary = true;
	bool hasUpdate = false;
	//use no bom utf8 encoding to read write
	Encoding utf8NoBom = new UTF8Encoding(false);
	int updateCnt = 0;
	int addCnt = 0;
	int delCnt = 0;
	
	class FileItemInfo
	{
		public string file = "";
		public string md5 = "";
		public int ver = 1;
	};
	Dictionary<string, FileItemInfo> findFiles = new Dictionary<string, FileItemInfo>();
	Dictionary<string, FileItemInfo> loadFiles = new Dictionary<string, FileItemInfo>();
	
	void DoBuildFileList()
	{
		//get file infos in AssetBundles
		SearchFiles(selPath + assertBundleDir, findFiles, selPattern);
		//load source file FullFileList
		LoadFileList(selPath + saveFullFile, loadFiles);
		//update Filelist and FullFilelist
		UpdateFileList();
		
		//refresh update
		AssetDatabase.Refresh();
		//if updated, export to u3d pack file Filelist
//		if(hasUpdate)
//			EQMenu.BuildAssetBundle3(saveFile, selPath + saveU3dFile);
		
		//update FLSummary file
		//UpdateFLSummaryFile();
		
		//delete FileList
		//AssetDatabase.DeleteAsset(saveFile);
		
		//show message
		if(hasUpdate)
			Debug.LogWarning("Build file list ok. Add files:" + addCnt.ToString() +
			                 ", Update files:" + updateCnt.ToString() +
			                 ", Delete files:" + delCnt.ToString());
		else
			Debug.LogWarning("Update file list not changed!");
	}
	
	//search all files and calc md5 code
	void SearchFiles(string path, Dictionary<string, FileItemInfo> flist, string spattern)
	{
		string [] files = Directory.GetFiles(path, spattern, SearchOption.AllDirectories);
		
		MD5 md5 = new MD5CryptoServiceProvider();
		foreach(string f in files)
		{
			using(FileStream fs = File.OpenRead(f))
			{
				FileItemInfo fi = new FileItemInfo();
				fi.file = f.Remove(0, path.Length + 1).Replace("\\", "/");
				fi.md5 = ToHexString(md5.ComputeHash(fs));
				
				flist.Add(fi.file, fi);
			}
		}
	}
	
	void LoadFileList(string file, Dictionary<string, FileItemInfo> flist)
	{
		if(!File.Exists(file))
			return;
		
		XmlDocument xd = new XmlDocument();
		xd.Load(file);
		
		if(!xd.HasChildNodes)
			return;
		
		foreach(XmlElement r in xd.DocumentElement.ChildNodes)
		{
			FileItemInfo fi = new FileItemInfo();
			fi.file = r.SelectSingleNode("Path").InnerText;
			fi.md5 = r.SelectSingleNode("Md5").InnerText;
			fi.ver = int.Parse(r.SelectSingleNode("Ver").InnerText);
			
			flist.Add(fi.file, fi);
		}
	}
	
	Stream OpenAFile(string file)
	{
		if(!File.Exists(file))
			return File.Create(file);
		
		return File.Open(file, FileMode.Truncate);
	}
	
	//update and export file list
	void UpdateFileList()
	{
		//del first
		if(Directory.Exists(selPath + assertBundleVerDir))
			Directory.Delete(selPath + assertBundleVerDir, true);
		
		//
		StreamWriter file = new StreamWriter(OpenAFile(saveFile), utf8NoBom);
		StreamWriter prjFile = new StreamWriter(OpenAFile(selPath + saveFullFile), utf8NoBom);
		
		//check remove files
		foreach(FileItemInfo fi in loadFiles.Values)
		{
			if(!findFiles.ContainsKey(fi.file))
			{
				delCnt ++;
				hasUpdate = true;
				
				Debug.Log("delete:" + fi.file);
			}
		}
		
		prjFile.WriteLine("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>");
		prjFile.WriteLine("<List>");
		file.WriteLine("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>");
		file.WriteLine("<L>");
		
		foreach(FileItemInfo fi in findFiles.Values)
		{
			if(loadFiles.ContainsKey(fi.file))
			{
				fi.ver = loadFiles[fi.file].ver;
				
				//check update
				if(loadFiles[fi.file].md5 != fi.md5)
				{
					fi.ver ++;
					updateCnt ++;
					hasUpdate = true;
					
					Debug.Log("update " + fi.file + " to ver:" + fi.ver.ToString());
				}
			}//add file
			else
			{
				addCnt ++;
				hasUpdate = true;
				
				Debug.Log("add:" + fi.file);
			}
			
			prjFile.WriteLine("  <File>");
			prjFile.WriteLine("    <Path>{0}</Path>", fi.file);
			prjFile.WriteLine("    <Md5>{0}</Md5>", fi.md5);
			prjFile.WriteLine("    <Ver>{0}</Ver>", fi.ver);
			prjFile.WriteLine("  </File>");
	
			file.WriteLine("  <F>");
			file.WriteLine("    <P>{0}</P>", fi.file);
			file.WriteLine("    <V>{0}</V>", fi.ver);
			file.WriteLine("  </F>");
			
			//copy to new file with file ver
			string oldFile = selPath + assertBundleDir + "/" + fi.file;
			string newFile = selPath + assertBundleVerDir + "/" + fi.file + "." + fi.ver.ToString();
			string newPath = newFile.Substring(0, newFile.LastIndexOf("/"));
			if(!Directory.Exists(newPath))
				Directory.CreateDirectory(newPath);
			File.Copy(oldFile, newFile, true);
		}
		
		prjFile.WriteLine("</List>");
		file.WriteLine("</L>");
		
		file.Close();
		file.Dispose();
		prjFile.Close();
		prjFile.Dispose();
	}
	
	void UpdateFLSummaryFile()
	{
		if(!updateFLSummary)
			return;
		
		Dictionary<string, FileItemInfo> flist = new Dictionary<string, FileItemInfo>();
		LoadFileList(selPath + saveFLSFile, flist);
		
		Dictionary<string, FileItemInfo> slist = new Dictionary<string, FileItemInfo>();
		SearchFiles(selPath + publichDir, slist, "*.u3d");
		//SearchFiles(selPath + publichDir, slist, "*.unity3d"); 
		
		StreamWriter file = new StreamWriter(OpenAFile(selPath + saveFLSFile), utf8NoBom);
		
		file.WriteLine("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>");
		file.WriteLine("<List>");
		
		foreach(FileItemInfo fi in slist.Values)
		{
			if(flist.ContainsKey(fi.file))
			{
				fi.ver = flist[fi.file].ver;
				if(flist[fi.file].md5 != fi.md5)
					fi.ver ++;
			}
			
			file.WriteLine("  <File>");
			file.WriteLine("    <Path>{0}</Path>", fi.file);
			file.WriteLine("    <Md5>{0}</Md5>", fi.md5);
			file.WriteLine("    <Ver>{0}</Ver>", fi.ver);
			file.WriteLine("  </File>");
		}
		
		file.WriteLine("</List>");
		
		file.Close();
		file.Dispose();
	}
	
	//-----------------------------------------------------------------------
	static char[] hexDigits = {
        '0', '1', '2', '3', '4', '5', '6', '7',
        '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};
    public static string ToHexString(byte[] bytes) {
        char[] chars = new char[bytes.Length * 2];
        for (int i = 0; i < bytes.Length; i++) {
            int b = bytes[i];
            chars[i * 2] = hexDigits[b >> 4];
            chars[i * 2 + 1] = hexDigits[b & 0xF];
        }
        return new string(chars);
    }
	//-----------------------------------------------------------------------
}

