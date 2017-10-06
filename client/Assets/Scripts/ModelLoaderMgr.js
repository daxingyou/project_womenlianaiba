/******************************************************************************
异步加载模型：LoadModelAsyn
	@name：模型名，无需后缀，如Female、00250006
	@OnLoadFinished：完成通知函数，可以是成员函数、静态函数
		格式：function OnLoadFinished(obj : ModelLoader)
		 	 {
		 		//TODO..........
		 	 }
	@autoDel：是否自动删除资源，参考AsynResourceMgr

同步加载模型：LoadModel
	@name：模型名，无需后缀，如Female、00250006
	*注* 该函数在所有资源都已经下载情况下调用同步加载
	
异步加载材质：LoadMaterialAsyn
	@name：材质型名，无需后缀，如Female、00250006
	@OnLoadFinished：完成通知函数，可以是成员函数、静态函数
		格式：function OnLoadFinished(obj : ModelLoader)
		 	 {
		 		//TODO..........
		 	 }
	@autoDel：是否自动删除资源，参考AsynResourceMgr

同步加载材质：LoadMaterial
	@name：材质名，无需后缀，如Female、00250006
	*注* 该函数在所有资源都已经下载情况下调用同步加载
******************************************************************************/
//@remark.	clear old code:	Last edit by fullzhu(2012.3.19)
//@remark.
//@remark.
//@remark.

#pragma strict
#pragma downcast



// Use this for initialization
function Start (){
}

// Update is called once per frame
function Update () {
}

//For Model
function AsynLoadModel(name : String, OnLoadFinished) : ModelLoader
{
	return AsynLoadModel(name, OnLoadFinished, true, true);
}

function AsynLoadModel(name : String, OnLoadFinished, autoDel : boolean, visible : boolean) : ModelLoader
{
	var loader : ModelLoader = new ModelLoader(Global.GetAsynResMgr());
	loader.AsynLoadModel(name, OnLoadFinished, autoDel, visible);
	return loader;
}

function SyncLoadModel(name : String, visible : boolean) : GameObject {
	var loader : ModelLoader = new ModelLoader(Global.GetAsynResMgr());
	return loader.SyncLoadModel(name, visible);
}

//For Material
function AsynLoadMaterial(name : String, OnLoadFinished) : ModelLoader
{
	return AsynLoadMaterial(name,OnLoadFinished,true);
}

function AsynLoadMaterial(name : String, OnLoadFinished, autoDel : boolean) : ModelLoader
{
	var loader : ModelLoader = new ModelLoader(Global.GetAsynResMgr());
	loader.AsynLoadMaterial(name, OnLoadFinished, autoDel);
	return loader;
}

function SyncLoadMaterial(name : String) : Material {
	var loader : ModelLoader = new ModelLoader(Global.GetAsynResMgr());
	return loader.SyncLoadMaterial(name);
}

//For Animation
function AsynLoadAnimation(name : String, OnLoadFinished) : ModelLoader
{
	return AsynLoadAnimation(name,OnLoadFinished,true);
}

function AsynLoadAnimation(name : String, OnLoadFinished, autoDel : boolean) : ModelLoader
{
	var loader : ModelLoader = new ModelLoader(Global.GetAsynResMgr());
	loader.AsynLoadAnimation(name, OnLoadFinished, autoDel);
	return loader;
}

function SyncLoadAnimation(name : String) : AnimationClip[] {
	var loader : ModelLoader = new ModelLoader(Global.GetAsynResMgr());
	return loader.SyncLoadAnimation(name);
}

