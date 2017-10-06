#pragma strict
class FlowerFactory
{
	private var FlowerInst : FlowerModelLoadEvent = null;

	function Create(path:String)
	{
		Destroy();
	
		var model:Model = new Model();
		FlowerInst = new FlowerModelLoadEvent(path);
		model.asynCtrl.addOrProcessEvent(FlowerInst);
	}
	
	function Destroy()
	{
		if(FlowerInst != null)
			FlowerInst.Destroy();
	}
}
/*--------------------------------------------------
*** 下面为flower模型异步加载事件
--------------------------------------------------*/
class FlowerModelLoadEvent extends MainLoadModelCtrlEvent
{
	public var _flowerObj:GameObject = null;
	public var _flowerBaseObj:GameObject = null;
	private var _flowerLoader:ModelLoader = null;
	private var _flowerBaseLoader:ModelLoader = null;
	private var hasLoadFlower : boolean = false;
	private var hasLoadFlowerBase : boolean = false;
	
	public function FlowerModelLoadEvent(flowerRes:String)
	{
		clearReady();
		var fullDir:String = "Model/FlowerVine/" + flowerRes;	// 花藤的完整路径
		var baseDir:String = "Model/FlowerVine/base_1500000.mod.u3d";
		_flowerLoader = Global.GetModelLoaderMgr().AsynLoadModel(fullDir, OnLoadFlowerFinished);
		_flowerBaseLoader = Global.GetModelLoaderMgr().AsynLoadModel(baseDir, OnLoadFlowerBaseFinished);
	}
	
	function OnLoadFlowerFinished(obj : ModelLoader):void
	{
		_flowerObj = obj.mModelObj;
		hasLoadFlower = true;
		complete();
	}
	
	function OnLoadFlowerBaseFinished(obj : ModelLoader):void
	{
		_flowerBaseObj = obj.mModelObj;
		hasLoadFlowerBase = true;
		complete();
	}
	
	function complete()
	{
		if(hasLoadFlower && hasLoadFlowerBase)
			setReady();
	}
	
	function Destroy()
	{
		if (_flowerObj)
		{
			GameObject.Destroy(_flowerObj);
		}
		
		if(_flowerBaseObj)
		{
			GameObject.Destroy(_flowerBaseObj);
		}
			
		_flowerLoader.Destroy();
		_flowerBaseLoader.Destroy();
	}

	// override
	function exce():void
	{
		_flowerObj.transform.position = Vector3(50000, 50005, 50000); //设置花藤的位置
		_flowerObj.name = "FlowerModel";
		_flowerObj.AddComponent("FlowerRotate");
		_flowerObj.animation.wrapMode = WrapMode.Loop;
		_flowerObj.animation.Play();
		
		_flowerBaseObj.transform.parent = _flowerObj.transform;
		_flowerBaseObj.transform.position = Vector3(50000,50004, 50000); //设置花藤底座的位置
	}
	

	function cancel():void
	{
		Destroy();
	}
}