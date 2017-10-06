#pragma strict



class XmlDataParser
{
	var objMgr : ObjectManager;
	var ltbMgr : LogicTableManager;
	var rcolors : Color[] = [Color.red,Color.green,Color.blue,Color.white,Color.yellow,Color.cyan,Color.magenta,Color.grey];
	
	function XmlDataParser(objmgr : ObjectManager, ltbmgr : LogicTableManager)
	{
		objMgr = objmgr;
		ltbMgr = ltbmgr;
	}
	
	//"XXX_editor.house"
//	function ParseHouseData(houseObjName : String, strXml : String) : HouseScene
//	{
//		var hScene : HouseScene = new HouseScene(objMgr, ltbMgr);
//		hScene.GameObj = objMgr.InstanceObject(houseObjName);
//		if(null == hScene.GameObj)
//			throw new Exception("ERROR 'XmlDataParser.ParseHouseData': House object '" + houseObjName + "' not exists!");
//		hScene.Template = houseObjName;
//		
//		var parser : XMLParser = new XMLParser();
//		var nroot : XMLNode = parser.Parse(strXml);
//		
//		var nfloors : XMLNodeList = nroot.GetNodeList("House>0>Floors>0>Floor");
//		var fp : int = 1;
//		
//		//floors
//		for(var n : XMLNode in nfloors)
//		{
//			var hFloor : HouseSceneFloor = new HouseSceneFloor();
//			hFloor.FloorNO = parseInt(n["@NO"]);
//			hFloor.FloorHeight = parseInt(n["@height"]);
//			if(n["@upFloorNO"])
//				hFloor.UpFloorNo = parseInt(n["@upFloorNO"]);
//			hScene.Floors.Add(hFloor.FloorNO, hFloor);
//			
//			hFloor.GameObj = new GameObject();
//			hFloor.GameObj.name = "Floor" + fp.ToString();
//			hFloor.SetParent(hScene);
//			
//			fp ++;
//			
//			var gp : int = 1;
//			
//			//grids
//			for(var gn : XMLNode in n.GetNodeList("Grids>0>Grid"))
//			{
//				var hgrid : HouseSceneGrid = new HouseSceneGrid();
//				hgrid.Type = parseInt(gn["@type"]);
//				hgrid.Room = parseInt(gn["@room"]);
//				hgrid.X = parseInt(gn["@x"]);
//				hgrid.Z = parseInt(gn["@z"]);
//				hFloor.Grids.Add(hgrid);
//				
//				hgrid.GameObj = new GameObject();
//				//hgrid.GameObj.name = "Grid" + gp.ToString();
//				hgrid.GameObj.name = "Grid(" + hgrid.X.ToString() + "," + hgrid.Z.ToString() + ")";
//				hgrid.SetParent(hFloor);
//				hgrid.SetPosition(
//					0.0 - (HouseSceneDef.HOUSE_GRID_SIZE * hgrid.X + HouseSceneDef.HOUSE_GRID_HALF_SIZE),
//					hFloor.FloorHeight,
//					(HouseSceneDef.HOUSE_GRID_SIZE * hgrid.Z + HouseSceneDef.HOUSE_GRID_HALF_SIZE),
//					Space.World);
//				
//				//======= Temp create grid ================================================
//				var gpt : Vector3 = hgrid.GetPosition();
//				gpt.y += 4;
//				gpt.x = 0;
//				gpt.z = 0;
//				var mesh : Mesh = new Mesh();
//				mesh.vertices =
//					[
//					Vector3(gpt.x - HouseSceneDef.HOUSE_GRID_HALF_SIZE, gpt.y + 4, gpt.z + HouseSceneDef.HOUSE_GRID_HALF_SIZE),
//					Vector3(gpt.x - HouseSceneDef.HOUSE_GRID_HALF_SIZE, gpt.y + 4, gpt.z - HouseSceneDef.HOUSE_GRID_HALF_SIZE),
//					Vector3(gpt.x + HouseSceneDef.HOUSE_GRID_HALF_SIZE, gpt.y + 4, gpt.z - HouseSceneDef.HOUSE_GRID_HALF_SIZE),
//					Vector3(gpt.x + HouseSceneDef.HOUSE_GRID_HALF_SIZE, gpt.y + 4, gpt.z + HouseSceneDef.HOUSE_GRID_HALF_SIZE)
//					];
//				mesh.triangles = [0,2,1,0,3,2,0,1,2,2,3,0];
//				mesh.uv =
//					[
//					Vector2(0,1),
//					Vector2(0,0),
//					Vector2(1,0),
//					Vector2(1,1)
//					];
//				mesh.normals =
//					[
//					Vector3.up,
//					Vector3.up,
//					Vector3.up,
//					Vector3.up
//					];
//				hgrid.GameObj.AddComponent("MeshFilter");
//        		hgrid.GameObj.AddComponent("MeshRenderer");
//        		var meshFilter : MeshFilter = hgrid.GameObj.GetComponent(typeof(MeshFilter));
//       			var meshRenderer : MeshRenderer = hgrid.GameObj.GetComponent(typeof(MeshRenderer));
//       			meshFilter.mesh = mesh;
//       			meshRenderer.material = new Material(Shader.Find("Particles/Alpha Blended"));//Diffuse
//       			meshRenderer.material.color = Color.white;//rcolors[gp % 8];
//       			meshRenderer.material.mainTexture = GameObject.Find("Main Camera").GetComponent("Main").gridTexture;
//				//========================================================================
//				
//				gp ++;
//			}
//			
//			//walls
//			for(var wn : XMLNode in n.GetNodeList("Walls>0>Wall"))
//			{
//				var hwall : HouseSceneWall = new HouseSceneWall();
//				hwall.X0 = parseInt(wn["@x0"]);
//				hwall.Z0 = parseInt(wn["@z0"]);
//				hwall.X1 = parseInt(wn["@x1"]);
//				hwall.Z1 = parseInt(wn["@z1"]);
//				hFloor.Walls.Add(hwall);
//			}
//		}
//		
//		//components
//		var ncomps : XMLNodeList = nroot.GetNodeList("House>0>Components>0>Comp");
//		
//		var tbHouseComp : XmlDataTable = ltbMgr.GetTable("house_comp");
//		var tbHouseCompProp : XmlDataTable = ltbMgr.GetTable("house_comp_prop");
//		var tbModelDisp : XmlDataTable = ltbMgr.GetTable("ModelDisplay");
//		
//		for(var c : XMLNode in ncomps)
//		{
//			var comp : HouseSceneComponent = new HouseSceneComponent();
//			
//			comp.IsFrame = false;
//			comp.FloorNo = parseInt(c["@flr"]);
//			comp.RoomNo = parseInt(c["@room"]);
//			if(c["@compId"])
//				comp.CompId = int.Parse(c["@compId"]);
//			if(c["@face"])
//				comp.Face = parseInt(c["@face"]);
//			if(c["@x"])
//				comp.X = parseInt(c["@x"]);
//			if(c["@z"])
//				comp.Z = parseInt(c["@z"]);
//			if(c["@height"])
//				comp.Height = parseInt(c["@height"]);
//			if(c["@frame"])
//				comp.IsFrame = boolean.Parse(c["@frame"]);
//				
//			if(comp.Face == 1)
//				comp.Face = 3;
//			else if(comp.Face == 3)
//				comp.Face = 1;
//				
//			if(comp.IsFrame)
//			{
//				comp.GameObj = GameObject.Find(c["@name"]);
//			}
//			else
//			{
//				var rwHouseComp : Hashtable = tbHouseComp.Row(comp.CompId.ToString());
//				var rwHouseCompProp : Hashtable = tbHouseCompProp.Row(rwHouseComp["prop_id"]);
//				var rwModelDisp : Hashtable = tbModelDisp.Row(rwHouseComp["dis_id"]);
//				//======= Temp ============================================================
//				// temp get GameObject template name
//				var tplName : String = rwModelDisp["Mesh"].Replace(".mesh", "");
//				var p : int = tplName.LastIndexOf("/");
//				if(-1 != p)
//					tplName = tplName.Remove(0, p + 1);
//				//========================================================================
//				
//				comp.GameObj = objMgr.InstanceObject(tplName);
//				if(null == comp.GameObj)
//					Debug.Log("ERROR 'XmlDataParser.ParseHouseData': Component object '" + comp.CompId + ":" + tplName + "' not exists!");
//				comp.Template = tplName;
//				
//				if(comp.GameObj)
//				{
//					var tf : HouseSceneFloor = hScene.GetFloor(comp.FloorNo);
//					if(tf)
//					{
//						tg = tf.GetGrid(comp.X, comp.Z);
//						if(tg)
//						{
//							comp.SetParent(tg);
//							
//							//get transform data from 'house_comp.xml'
//							var pts : String[] = rwHouseComp["pos"].Split(","[0]);
//							var rts : String[] = rwHouseComp["rot"].Split(","[0]);
//							var scs : String[] = rwHouseComp["scale"].Split(" "[0]);
//							
//							var mpt : Vector3 = Vector3.zero;
//							if(0 == parseInt(rwHouseCompProp["OffsetHeight"]))
//								mpt.y = comp.Height;
//							
//							var houseCompPt : Vector3 = Vector3(0 - float.Parse(pts[0]), float.Parse(pts[1]), float.Parse(pts[2]));
//							var houseCompRt : Quaternion = Quaternion(float.Parse(rts[0]), float.Parse(rts[1]), float.Parse(rts[2]), float.Parse(rts[3]));
//							var houseCompSc : Vector3 = Vector3(float.Parse(scs[0]), float.Parse(scs[1]), float.Parse(scs[2]));
//							var compFaceRt : Quaternion = Quaternion.Euler(0,90.0*comp.Face,0);
//							
//							//translate
//							comp.SetPosition(mpt + compFaceRt * houseCompPt);
//							//rotate
//							comp.SetRotation(compFaceRt * houseCompRt, Space.World);
//							//scale
//							comp.SetScale(houseCompSc);
//						}
//					}
//				}
//			}
//			
//			hScene.HouseComps.Add(comp);
//		}
//		
//		return hScene;
//	}
}