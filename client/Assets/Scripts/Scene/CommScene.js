#pragma strict

/*
	公共场景实例
*/
class CommScene extends EQGameScene
{
	var _scene : LoveHomeScene;
	
	//--------------------------------------------------
	// 构造函数
	function CommScene(sce:LoveHomeScene)
	{
		_scene = sce;
	}
	//--------------------------------------------------
	// 销毁
	function Destroy()
	{
		super.Destroy();
	}
	
	//--------------------------------------------------
	function getComponentByInstanceID(instance_id : UInt64) : HouseSceneComponent
	{
		if( _scene._houseComponentLogicMappingTable == null )
			return null;
			
		if(!_scene._houseComponentLogicMappingTable.ContainsKey(instance_id))
			return null;
		
		var hclm : HouseComponentLogicMapping = _scene._houseComponentLogicMappingTable[instance_id] as HouseComponentLogicMapping;
	
		return HSCManager.getSingleton().getHouseSceneComponent(hclm.CompUid);
	}

	//--------------------------------------------------
	// 开关所有灯光
	function turnAllLights(daynight : boolean) : void
	{
		if( _scene._house == null )
			return;
		
		_scene._house.turnPassLights(daynight);
		_scene._house.turnDirectLights(daynight);
		_scene._house.turnSpotLights(daynight);
		_scene._house.turnLights(!daynight);
	}
}
