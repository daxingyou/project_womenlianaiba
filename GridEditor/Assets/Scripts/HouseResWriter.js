import System.Xml;


class HouseResWriter
{
	//--------------------------------------------------
	// 创建xml文件
    public function createXml(file : String, rootNO : int, radius : int) : void
    {
    	var doc : XmlDocument = new XmlDocument();
		var dec : XmlDeclaration = doc.CreateXmlDeclaration("1.0", "UTF-8", null);
        doc.AppendChild(dec);
		
		var house : XmlElement = doc.CreateElement("House");
        doc.AppendChild(house);
		
		// 创建楼层节点
		var floors : XmlElement = createFloors(doc, house, rootNO, radius);
		// 添加楼层
        var floor : XmlElement = addFloor(doc, floors, new HouseFloorRes());
		// 创建格子节点
		var grids : XmlElement = createGrids(doc, floor);
		// 创建墙壁节点
		var walls : XmlElement = createWalls(doc, floor);
		// 保存文件
        doc.Save(file);
    }
    //--------------------------------------------------
    // 写xml文件
    public function write(file : String, hr : HouseRes) : void
    {
    	var doc : XmlDocument = new XmlDocument();
        doc.Load(file);
        
        var house : XmlNode = doc.SelectSingleNode("House");
        house.RemoveChild(doc.SelectSingleNode("House/Floors"));
        
        var floors : XmlElement = createFloors(doc, house, hr.FloorRootNO, hr.FloorRadius);
        for (var kv in hr.FloorTable)
        {
        	// 添加楼层
        	var hfr : HouseFloorRes = kv.Value;
        	var floor : XmlElement = addFloor(doc, floors, hfr);
        	// 添加格子
        	var grids : XmlElement = createGrids(doc, floor);
	        for (var hgr : HouseGridRes in hfr.Grids)
	        {
	        	addGrid(doc, grids, hgr);
	        }
			// 添加墙壁
			var walls : XmlElement = createWalls(doc, floor);
	        for (var hwr : HouseWallRes in hfr.Walls)
	        {
	        	addWall(doc, walls, hwr);
	        }
        }
        // 保存文件
        doc.Save(file);
    }
	//--------------------------------------------------
	// 创建楼层结点
	private function createFloors(doc : XmlDocument, house : XmlNode, rootNo : int, radius : int) : XmlElement
	{
		var attributes : Hashtable = new Hashtable(); 
		attributes.Add("rootNO", rootNo.ToString());
		attributes.Add("radius", radius.ToString());
		return createElement(doc, "Floors", attributes, "", house);
	}
	//--------------------------------------------------
	// 添加楼层
    private function addFloor(doc : XmlDocument, floors : XmlNode, hfr : HouseFloorRes) : XmlElement
    {
		var attributes : Hashtable = new Hashtable(); 
		attributes.Add("NO", hfr.No.ToString());
		attributes.Add("height", hfr.Height.ToString());
		return createElement(doc, "Floor", attributes, "", floors);
    }
	//--------------------------------------------------
	// 创建格子结点
	private function createGrids(doc : XmlDocument, floor : XmlNode) : XmlElement
	{
		return createElement(doc, "Grids", null, "", floor);
	}
	//--------------------------------------------------
	// 添加格子
	private function addGrid(doc : XmlDocument, grids : XmlNode, hgr : HouseGridRes) : XmlElement
	{
		var attributes : Hashtable = new Hashtable();
		attributes.Add("type", hgr.Type.ToString());
		attributes.Add("x", hgr.X.ToString());
		attributes.Add("z", hgr.Z.ToString());
		attributes.Add("room", hgr.Room.ToString());
		attributes.Add("param1", hgr.Param1);
		return createElement(doc, "Grid", attributes, "", grids);
	}
	//--------------------------------------------------
	// 创建墙壁结点
	private function createWalls(doc : XmlDocument, floor : XmlNode) : XmlElement
	{
		return createElement(doc, "Walls", null, "", floor);
	}
	//--------------------------------------------------
	// 添加墙壁
    private function addWall(doc : XmlDocument, walls : XmlNode, hwr : HouseWallRes) : XmlElement
    {
        var attributes : Hashtable = new Hashtable();
        attributes.Add("x0", hwr.X0.ToString());
        attributes.Add("z0", hwr.Z0.ToString());
        attributes.Add("x1", hwr.X1.ToString());
        attributes.Add("z1", hwr.Z1.ToString());
        return createElement(doc, "Wall", attributes, "", walls);
    }
	//--------------------------------------------------
	// 创建元素
	public static function createElement(doc : XmlDocument, element : String, atts : Hashtable, val : String, pare_node : XmlNode) : XmlElement
	{
		var xml_ele : XmlElement = doc.CreateElement(element);
		// 设置属性
		if (atts && atts.Count>0)
		{
			for (var kv : DictionaryEntry in atts)
			{
				if (null == kv.Value)
					xml_ele.SetAttribute(kv.Key.ToString(), "");
				else
					xml_ele.SetAttribute(kv.Key.ToString(), kv.Value.ToString());
    		}
    	}
		// 设置值
		if (null != val)
		{
			xml_ele.InnerText = val;
		}
		// 设置父节点
		if (pare_node)
		{
			pare_node.AppendChild(xml_ele);
		}
		return xml_ele;
	}
	//--------------------------------------------------
}


