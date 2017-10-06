#pragma strict
#pragma downcast
/*
//dress avatar
//actor avatar opertor (example:dress,rotate)
//create by fullzhu 2012.2.18
//last edit at 2012.2.18 by fullzhu
*/

class DressAvatar {

	enum DressPart {
		DS_HEAD = 1,
		DS_CLOSE = 2,
		DS_SHOES = 3,
		DS_HAND = 4,
		DS_GLASS = 5
	}
	
	private var mAvatar : GameObject = null;
	private var mBasicData : player_basic_data = null;
	private var mParticleLoader : ModelLoader = null;
	
	function DressAvatar(data:player_basic_data) {
		mAvatar = CreateRole.createPlayer(data,false);
		mBasicData = data;
		if(mAvatar == null) {
			Debug.LogWarning("create avatar failed!!");
		}
	}
	
	public static function GetDressBody(itemID : int) : String {
		if(itemID == 0) {
			Debug.Log("item id invalid");
			return "";
		}
		
		var dressID: int = ResManager.LgtMgr.getItemRow(itemID).sub_id;
    	return (ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).model_body;
	}
	
	public static function GetDressPos(itemID : int) : int {
		if(itemID == 0) {
			Debug.Log("item id invalid");
			return -1;
		}
		
		var dressID: int = ResManager.LgtMgr.getItemRow(itemID).sub_id;
        return (ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).equip_pos;
	}
	
	public static function GetDressModel(itemID : int) : String {
		if(itemID == 0) {
			Debug.Log("item id invalid");
			return "";
		}
		
		var dressID: int = ResManager.LgtMgr.getItemRow(itemID).sub_id;
        return (ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).model;
	}
	
	public static function GetDressParticle(itemID : int) {
		if(itemID == 0) {
			Debug.Log("item id invalid");
			return "";
		}
		
		var dressID: int = ResManager.LgtMgr.getItemRow(itemID).sub_id;
        return (ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).particle;
	}
	
	public static function GetDressParticleAttach(itemID : int) {
		if(itemID == 0) {
			Debug.Log("item id invalid");
			return "";
		}
		
		var dressID: int = ResManager.LgtMgr.getItemRow(itemID).sub_id;
        return (ResManager.LgtMgr.ItemDressTable[dressID] as ItemDressRow).attach_pos;
	}
	
	public function Init(dressList : ArrayList,pos : Vector3,eulerAngles : Vector3) {
		for (var pg : pack_grid in mBasicData.body)
		{
			if (0 == pg.item_data.template_id ||
				TimeEffect.getInstance().isMature(pg.item_data.del_time))
			{
				continue;
			}
			Dress(pg.item_data.template_id);
		}
		mAvatar.transform.position = pos;
		mAvatar.transform.Rotate(eulerAngles);
	}
	
	public function Rotate(dir : Vector3) {
		var angleY: Single = (CreateRoleConfig.data["rotate_setting"] as Boo.Lang.Hash)["angle"]; 
        var time: Single = (CreateRoleConfig.data["rotate_setting"] as Boo.Lang.Hash)["time"];
        
        mAvatar.transform.Rotate(dir.x, dir.y * Time.deltaTime * angleY/time, dir.z, Space.World);
	}
	
	public function Dress(itemID : int) {
		if(itemID == 0) return ;
		
		var dress_pos : int = GetDressPos(itemID);
		var dress_body : String = GetDressBody(itemID);
		var dress_model : String = GetDressModel(itemID);
		var particle : String = GetDressParticle(itemID);
		var particle_attach : String = GetDressParticleAttach(itemID);
		
		if(dress_pos == -1) return ;
		
		switch(dress_pos) {
			case 0:mAvatar.GetComponent(Player).addHat(dress_model, dress_body,particle,particle_attach);break;
			case 1:mAvatar.GetComponent(Player).changeClothes(itemID);break;
			case 2:mAvatar.GetComponent(Player).addGlasses(dress_model,particle,particle_attach);break;
			case 3:mAvatar.GetComponent(Player).addRing(dress_model,particle,particle_attach);break;
			case 4:mAvatar.GetComponent(Player).addCloak(dress_model,particle,particle_attach);break;
			case 5:mAvatar.GetComponent(Player).addPart("shoes",dress_model);break;
			case 6:break;
			case 7:break;
		}
	}
	
	public function UnDress(itemID : int,sex : int) {
		if(itemID == 0) return ;
		
		var dress_pos : int = GetDressPos(itemID);
		var dress_body : String = GetDressBody(itemID);
		var dress_model : String = GetDressModel(itemID);
		
		if(dress_pos == -1) return ;
		
		switch(dress_pos) {
			case 0:mAvatar.GetComponent(Player).removeChild("hat");break;
			case 1:mAvatar.GetComponent(Player).removePart("clothes",sex);break;
			case 2:mAvatar.GetComponent(Player).removeChild("glasses");break;
			case 3:mAvatar.GetComponent(Player).removePart("ring",sex);break;
			case 4:mAvatar.GetComponent(Player).removeChild("cloak");break;
			case 5:mAvatar.GetComponent(Player).removePart("shoes",sex);break;
			case 6:break;
			case 7:break;
		}
	}
	
	public function Reset(dressList : ArrayList,sex : int) {
		mAvatar.GetComponent(Player).removeChild("hat");
		mAvatar.GetComponent(Player).removePart("clothes",sex);
		mAvatar.GetComponent(Player).removeChild("glasses");
		mAvatar.GetComponent(Player).removePart("ring",sex);
		mAvatar.GetComponent(Player).removeChild("cloak");
		mAvatar.GetComponent(Player).removePart("shoes",sex);
		
		for (var pg : pack_grid in mBasicData.body)
		{
			if (0 == pg.item_data.template_id ||
				TimeEffect.getInstance().isMature(pg.item_data.del_time))
			{
				continue;
			}
			Dress(pg.item_data.template_id);
		}
	}
	
	public function DestroyAvatar() {
		CharacterFactory.DestroyPlayer(mAvatar);
	} 
	
	public function showParticle() {
		if (mParticleLoader) {
			mParticleLoader.Destroy();
			mParticleLoader = null;
		}
		var dir : String = "Model/Particle/Bianshen.prefab.u3d";
		mParticleLoader = Global.GetModelLoaderMgr().AsynLoadModel(dir, onLoadParticleFinished, false, true);
	}
	
	private function onLoadParticleFinished(obj : ModelLoader) {
		var parObj : GameObject = obj.mModelObj;
		CommFunc.setParent(mAvatar, parObj);
		parObj.AddComponent(ParticleDestroy);
	}
}