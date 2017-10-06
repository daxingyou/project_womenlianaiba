#pragma strict
#pragma downcast

/*--------------------------------------------------
墙来了角色模型(2013/1/5 create by hezhr)
--------------------------------------------------*/


class WallComingAvatar
{
	private var mBasicData : player_basic_data = null;
	private var mAvatar : GameObject = null;
	//--------------------------------------------------
	public function WallComingAvatar(data : player_basic_data, pos : Vector3, eulerAngles : Vector3, scale : float)
	{
		mBasicData = data;
		mAvatar = CreateRole.createPlayer(data, false);
		mAvatar.transform.position = pos;
		mAvatar.transform.Rotate(eulerAngles);
		mAvatar.transform.localScale.y = scale;
		mAvatar.transform.localScale.z = scale;
		for (var pg : pack_grid in data.body)
		{
			if (0 == pg.item_data.template_id || TimeEffect.getInstance().isMature(pg.item_data.del_time))
				continue;
			
			dress(pg.item_data.template_id);
		}
	}
	//--------------------------------------------------
	public function destroy() : void
	{
		CharacterFactory.DestroyPlayer(mAvatar);
	}
	//--------------------------------------------------
	public function playAni(ani : String) : void
	{
		mAvatar.GetComponent(Player).play(ani, WrapMode.Loop);
	}
	//--------------------------------------------------
	private function dress(itemID : int) : void
	{
		if (0 == itemID)
			return;
		
		var dress_pos : int = DressAvatar.GetDressPos(itemID);
		var dress_body : String = DressAvatar.GetDressBody(itemID);
		var dress_model : String = DressAvatar.GetDressModel(itemID);
		var particle : String = DressAvatar.GetDressParticle(itemID);
		var particle_attach : String = DressAvatar.GetDressParticleAttach(itemID);
		
		if (-1 == dress_pos)
			return;
		
		switch (dress_pos)
		{
		case 0: mAvatar.GetComponent(Player).addHat(dress_model, dress_body, particle, particle_attach); break;
		case 1: mAvatar.GetComponent(Player).changeClothes(itemID); break;
		case 2: mAvatar.GetComponent(Player).addGlasses(dress_model, particle, particle_attach); break;
		case 3: mAvatar.GetComponent(Player).addRing(dress_model, particle, particle_attach); break;
		case 4: mAvatar.GetComponent(Player).addCloak(dress_model, particle, particle_attach); break;
		case 5: mAvatar.GetComponent(Player).addPart("shoes", dress_model); break;
		case 6: break;
		case 7: break;
		}
	}
	//--------------------------------------------------
}


