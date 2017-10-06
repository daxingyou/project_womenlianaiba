// ÕÊº“‘§¿¿
#pragma strict
#pragma downcast


class CircleListEnumer
{
	var mList: Array = new Array();
	var index: int = 0;
	
	function setIndex(idx: int)
	{
		index = idx;
	}
	
	function next()
	{
		if (index < mList.length - 1)
		{
			++index;
		}
		else
		{
			index = 0; 			
		}		
	}
	
	function prev()
	{
		if (index > 0)
		{
			--index;
		}
		else
		{
			index = mList.length - 1;
		}		
	}
	
	function current()
	{
	    if (0 <= index && index < mList.length)
	        return mList[index];
        return null;    
	}
	function end(){
		if(mList.length == 0)
			return null;
		return mList[mList.length - 1];
	}
}


class PlayerPreview
{
    function PlayerPreview(cfg: Boo.Lang.Hash, sex: int)
    { 
        mSex = sex;       
        if (sex_type.st_boy == sex)
        {
            mRes = (cfg["boy"] as Boo.Lang.Hash);    
        }
        else if (sex_type.st_girl == sex)
        {
            mRes = (cfg["girl"] as Boo.Lang.Hash);                
        }
        else
        {
            Debug.LogError("bad sex");
        }       	
       	
        convertModelMats((mRes["hair_list"] as Boo.Lang.Hash[]), hairList, hairMatList);
        convertModelMats((mRes["beard_list"] as Boo.Lang.Hash[]), beardList, beardMatList);
        convertModelMats((mRes["body_list"] as Boo.Lang.Hash[]), bodyList, bodyMatList);
        convertModelMats((mRes["eyelid_list"] as Boo.Lang.Hash[]), eyelidList, eyelidMatList);
        convertModelMats((mRes["face_list"] as Boo.Lang.Hash[]), faceList, faceMatList); 
        clothesList.mList = mRes["clothes_list"];  
        shoesList.mList = mRes["shoes_list"];   
    }

    private function convertModelMats(modelMats: Boo.Lang.Hash[], modList: CircleListEnumer, 
                                matList: CircleListEnumer)
    {
        for (var v in modelMats)
        {
        	modList.mList.Add(v["model"]);
        }
        
        if (modelMats.Length > modList.index)
        {
            matList.mList = modelMats[modList.index]["mats"];
        }        
    }

    
    function nextHairColor()
    {        
        hairMatList.next();
        if (sex_type.st_boy == mSex)
            beardMatList.next();
    }
    
    function prevHairColor()
    {
        hairMatList.prev();
        if (sex_type.st_boy == mSex)
            beardMatList.prev();
    }
    
    function setHairColor(idx: int)
    {
        hairMatList.setIndex(idx);
        if (sex_type.st_boy == mSex)
            beardMatList.setIndex(idx);
    }
    
    function setSkinColor(idx: int)
    {
        bodyMatList.setIndex(idx);
        faceMatList.setIndex(idx);
        eyelidMatList.setIndex(idx);
    }

    function nextSkinColor()
    {        
        bodyMatList.next();
        faceMatList.next();
    }
    
    function prevSkinColor()
    {        
        bodyMatList.prev();
        faceMatList.prev();
    }
    
    function setHairIndex(idx: int)
    {
        hairList.setIndex(idx);

        var arr: Boo.Lang.Hash[] = (mRes["hair_list"] as Boo.Lang.Hash[]);
        var dic: Boo.Lang.Hash = arr[hairList.index];
        var strs: String[] = (dic["mats"] as String[]);
        
        hairMatList.mList = strs;
    }

    function nextHair()
    {        
        hairList.next();

        var arr: Boo.Lang.Hash[] = (mRes["hair_list"] as Boo.Lang.Hash[]);
        var dic: Boo.Lang.Hash = arr[hairList.index];
        var strs: String[] = (dic["mats"] as String[]);
        
        hairMatList.mList = strs;
    }
    
    function prevHair()
    {
        hairList.prev();        
        var arr: Boo.Lang.Hash[] = (mRes["hair_list"] as Boo.Lang.Hash[]);
        var dic: Boo.Lang.Hash = arr[hairList.index];
        var strs: String[] = (dic["mats"] as String[]);
        
        hairMatList.mList = strs;
    }
    
    function setBeardIndex(idx: int)
    {
        if (sex_type.st_boy == mSex)
        {
            beardList.setIndex(idx);      

            var arr: Boo.Lang.Hash[] = (mRes["beard_list"] as Boo.Lang.Hash[]);
            var dic: Boo.Lang.Hash = arr[beardList.index];
            var strs: String[] = (dic["mats"] as String[]);
            beardMatList.mList = strs;      
         }
    }
    
    function nextBeard()
    {  
        if (sex_type.st_boy == mSex)
        {
            beardList.next();      
            var arr: Boo.Lang.Hash[] = (mRes["beard_list"] as Boo.Lang.Hash[]);
            var dic: Boo.Lang.Hash = arr[beardList.index];
            var strs: String[] = (dic["mats"] as String[]);
            beardMatList.mList = strs;      
         }
    }
    
    function prevBeard()
    {        
        if (sex_type.st_boy == mSex)
        {
            beardList.prev();
            var arr: Boo.Lang.Hash[] = (mRes["beard_list"] as Boo.Lang.Hash[]);
            var dic: Boo.Lang.Hash = arr[beardList.index];
            var strs: String[] = (dic["mats"] as String[]);
            beardMatList.mList = strs;      
         }
    }    
    
    function setFaceIndex(idx: int)
    {
        faceList.setIndex(idx);      
        var arr: Boo.Lang.Hash[] = (mRes["face_list"] as Boo.Lang.Hash[]);
        var dic: Boo.Lang.Hash = arr[faceList.index];
        var strs: String[] = (dic["mats"] as String[]);
        faceMatList.mList = strs;      
    }
    
    function nextFace()
    {  
        faceList.next();      
        var arr: Boo.Lang.Hash[] = (mRes["face_list"] as Boo.Lang.Hash[]);
        var dic: Boo.Lang.Hash = arr[faceList.index];
        var strs: String[] = (dic["mats"] as String[]);
        faceMatList.mList = strs;      
    }
    
    function prevFace()
    {        
        faceList.prev();
        var arr: Boo.Lang.Hash[] = (mRes["face_list"] as Boo.Lang.Hash[]);
        var dic: Boo.Lang.Hash = arr[faceList.index];
        var strs: String[] = (dic["mats"] as String[]);
        faceMatList.mList = strs;      
    }
    
    function getHairColorIndex()
    {
        return hairMatList.index;
    }
    
    function getSkinColorIndex()
    {
        return bodyMatList.index;
    }
    
    function getSex()
    {
        return mSex;
    }
        
    var hairList: CircleListEnumer = new CircleListEnumer();
    var faceList: CircleListEnumer = new CircleListEnumer();
    var eyelidList: CircleListEnumer = new CircleListEnumer();
    var bodyList: CircleListEnumer = new CircleListEnumer();
    var beardList: CircleListEnumer = new CircleListEnumer();
    var hairMatList: CircleListEnumer = new CircleListEnumer();
    var faceMatList: CircleListEnumer = new CircleListEnumer();
    var eyelidMatList: CircleListEnumer = new CircleListEnumer();
    var bodyMatList: CircleListEnumer = new CircleListEnumer();
    var beardMatList: CircleListEnumer = new CircleListEnumer(); 
    var clothesList: CircleListEnumer = new CircleListEnumer(); 
    var shoesList: CircleListEnumer = new CircleListEnumer();   
    private var mRes: Boo.Lang.Hash;  
    private var mSex: int;
    
}
