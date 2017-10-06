#pragma strict
#pragma downcast
/******************************************************************************
add tencent platform resource loader manager
******************************************************************************/
//@remark.	design yourself pram custom but must include account,image,nickName and imageType
//@remark.	Last edit by fullzhu(2012.3.19)
//@remark.
//@remark.
private var mLoaderList : ArrayList = new ArrayList();
private var mRecoveryList : ArrayList = new ArrayList();

// Use this for initialization
function Start (){
}

// Update is called once per frame
function Update () {
	Recovery();
	
	for(var loader:PlatResLoader in mLoaderList) {
		loader.Update();
	}
}

//For Image
function NetLoadImageUrl(url : String, ctrl : PlatResInfoCtrl) {
	var loader : PlatResLoader = new PlatResLoader(PlatformMgr.GetPlatType());
	loader.NetLoadImageUrl(url, ctrl);
	mLoaderList.Add(loader);
	return loader;
}

function NetLoadImageOpenIDNew(openID : String, ctrl : PlatResInfoCtrl) : PlatResLoader {
	var loader : PlatResLoader = new PlatResLoader(PlatformMgr.GetPlatType());
	loader.NetLoadImageOpenIDNew(openID, ctrl);
	mLoaderList.Add(loader);
	return loader;
}

function Remove(loader : PlatResLoader) {
	loader.Cancel();
	mLoaderList.Remove(loader);
	loader = null;
}

function Recovery() {
	if(mLoaderList.Count == 0) return ;
	
	mRecoveryList.Clear();
	for(var loader:PlatResLoader in mLoaderList) {
		if(!loader.IsFinish()) {
			mRecoveryList.Add(loader);
		} else {
			loader.Cancel();
			loader = null;
		}
	}
	
	mLoaderList.Clear();
	mLoaderList = mRecoveryList.Clone();
}

static function ImageURLReplace(url : String,image_type : IMAGE_TYPE) : String {
	var str : String = "";
	var size : String = "/60";
	if(PlatformMgr.IsPlatQZone()) {
		size = "/50";
	} else if(PlatformMgr.IsPlatQTwiter()) {
		size = "/40";
	}
	
	if(image_type == IMAGE_TYPE.IMGTYPE_MINI) {
		str = url.Replace(size,"/30");
	} else if(image_type == IMAGE_TYPE.IMGTYPE_SMALL) {
		str = url.Replace(size,"/45");
	} else if(image_type == IMAGE_TYPE.IMGTYPE_BIG) {
		str = url.Replace(size,"/100");
	} else {
		str = url;
	}
	
	return str;
}

