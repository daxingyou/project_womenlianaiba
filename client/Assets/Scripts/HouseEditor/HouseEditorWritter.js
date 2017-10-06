/*--------------------------------------------------
房屋编辑器相关写xml文件(2012/5/23 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast
import System.Xml;



class HouseEditorWritter
{
	private var mPath : String = "";			// 文件保存的路径
	private var mDoc : XmlDocument = null;		// xml文档
	private var mRoot : XmlElement = null;		// 根节点
	//--------------------------------------------------
	// 构造函数
	public function HouseEditorWritter(filename : String)
	{
		if (null == filename || "" == filename)
			throw Exception("HouseEditorWritter -> HouseEditorWritter(String) -> filename is null!");
	
		mPath = Application.dataPath + "/" + filename + ".xml";
		
		mDoc = new XmlDocument();
		var xml_dec : XmlDeclaration = mDoc.CreateXmlDeclaration("1.0", "UTF-8", "yes");
		mDoc.AppendChild(xml_dec);
		
		mRoot = mDoc.CreateElement("root");
		mDoc.AppendChild(mRoot);
	}
	//--------------------------------------------------
	// 保存文件,最后调用
	private function save() : void
	{
		mDoc.Save(mPath);
	}
	//--------------------------------------------------
	// 创建家具文件
	public function createFurnitureXml(comp_arr : Array) : void
	{
		for (var i:int=0; i<comp_arr.Count; ++i)
		{
			addFurnitureRow(mDoc, mRoot, comp_arr[i] as HouseSceneComponent, i+1);
		}
		save();
	}
	//--------------------------------------------------
	// 增加家具数据
	private function addFurnitureRow(doc : XmlDocument, pare : XmlNode, comp : HouseSceneComponent, id : int) : XmlElement
	{
		var row : XmlElement = createElement(doc, "house_furniture_tplt", null, null, pare);
		createElement(doc, "id", null, id.ToString(), row);
		createElement(doc, "furniture_id", null, comp.CompId.ToString(), row);
		createElement(doc, "item_id", null, comp.ItemId.ToString(), row);
		createElement(doc, "x", null, comp.X.ToString(), row);
		createElement(doc, "z", null, comp.Z.ToString(), row);
		createElement(doc, "height", null, comp.Height.ToString(), row);
		createElement(doc, "flr", null, comp.FloorNo.ToString(), row);
		createElement(doc, "face", null, comp.Face.ToString(), row);
		return row;
	}
	//--------------------------------------------------
	// 创建灯光文件
	public function createLightXml() : void
	{
		var doc : XmlDocument = mDoc;
		var root : XmlNode = mRoot;
		// 穿透光
		var passLight : XmlElement = createElement(doc, "PassLights", null, null, root);
		var passLightObj : GameObject = GameObject.Find("PassLights");
		if (passLightObj)
		{
			for (var passLigthTrans : Transform in passLightObj.GetComponentsInChildren(Transform))
				addPassLightRow(doc, passLight, passLigthTrans.gameObject);
		}
		// 方向光
		var directLight : XmlElement = createElement(doc, "DirectLights", null, null, root);
		var directLightObj : GameObject = GameObject.Find("DirectLights");
		if (directLightObj)
		{
			for (var directLightTrans : Transform in directLightObj.GetComponentsInChildren(Transform))
				addDirectLightRow(doc, directLight, directLightTrans.gameObject);
		}
		// 聚光
		var spotLight : XmlElement = createElement(doc, "SpotLights", null, null, root);
		var spotLightObj : GameObject = GameObject.Find("SpotLights");
		if (spotLightObj)
		{
			for (var spotLightTrans : Transform in spotLightObj.GetComponentsInChildren(Transform))
				addSpotLightRow(doc, spotLight, spotLightTrans.gameObject);
		}
		save();
	}
	//--------------------------------------------------
	// 添加穿透光数据
	private function addPassLightRow(doc : XmlDocument, pare : XmlNode, lightObj : GameObject) : XmlElement
	{
		var zlp : ZoneLightProperty = lightObj.GetComponent("ZoneLightProperty");
		if (null == zlp || null == lightObj.light)
			return null;
		
		var attributes : Hashtable = new Hashtable();
		attributes.Add("pos", zlp.getPos());
		attributes.Add("dColor", zlp.getDayColor());
		attributes.Add("dInte", zlp.getDayIntensity());
		attributes.Add("dRange", zlp.getDayRange());
		attributes.Add("nColor", zlp.getNightColor());
		attributes.Add("nInte", zlp.getNightIntensity());
		attributes.Add("nRange", zlp.getNightRange());
		attributes.Add("floor", zlp.getFloorNo());
		attributes.Add("room", zlp.getRoomNo());
		return createElement(doc, "PassLight", attributes, null, pare);
    }
	//--------------------------------------------------
	// 添加方向光数据
	private function addDirectLightRow(doc : XmlDocument, pare : XmlNode, lightObj : GameObject) : XmlElement
	{
		var zlp : ZoneLightProperty = lightObj.GetComponent("ZoneLightProperty");
		if (null == zlp || null == lightObj.light)
			return null;
		
		var attributes : Hashtable = new Hashtable();
		attributes.Add("pos", zlp.getPos());
		attributes.Add("dir", zlp.getDir());
		attributes.Add("dColor", zlp.getDayColor());
		attributes.Add("dInte", zlp.getDayIntensity());
		attributes.Add("nColor", zlp.getNightColor());
		attributes.Add("nInte", zlp.getNightIntensity());
		attributes.Add("floor", zlp.getFloorNo());
		attributes.Add("room", zlp.getRoomNo());
		return createElement(doc, "DirectLight", attributes, null, pare);
	}
	//--------------------------------------------------
	// 添加聚光数据
	private function addSpotLightRow(doc : XmlDocument, pare : XmlNode, lightObj : GameObject) : XmlElement
	{
		var zlp : ZoneLightProperty = lightObj.GetComponent("ZoneLightProperty");
		if (null == zlp || null == lightObj.light)
			return null;
		
		var attributes : Hashtable = new Hashtable();
		attributes.Add("pos", zlp.getPos());
		attributes.Add("dir", zlp.getDir());
		attributes.Add("dColor", zlp.getDayColor());
		attributes.Add("dInte", zlp.getDayIntensity());
		attributes.Add("dRange", zlp.getDayRange());
		attributes.Add("dAngle", zlp.getDayAngle());
		attributes.Add("nColor", zlp.getNightColor());
		attributes.Add("nInte", zlp.getNightIntensity());
		attributes.Add("nRange", zlp.getNightRange());
		attributes.Add("nAngle", zlp.getNightAngle());
		attributes.Add("floor", zlp.getFloorNo());
		attributes.Add("room", zlp.getRoomNo());
		return createElement(doc, "SpotLight", attributes, null, pare);
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


