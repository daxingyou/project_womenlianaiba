#pragma strict
#pragma downcast
import System.Xml;

/*
*指定格式xml数据表解析类
*Xml数据格式
*<table>
*	<row>
*		<field1></field1>
*		<fieldn></fieldn>
*	</row>
*</table>
*
*/
class XmlDataTable
{
	var Table : Array = new Array();
	
	//获取行数
	function Count()
	{
		return Table.Count;
	}
	
	//获取某一行
	function Row(row : int) : Hashtable
	{
		if (row < 0 && row >= Table.Count)
			throw new Exception("ERROR 'XmlDataTable.Row': index '" + row + "' out of range.");
			
		return Table[row] as Hashtable;
	}
	
	//获取某行某列
	function Field(row : int, field : String) : Hashtable
	{
		var r : Hashtable = Row(row);
		
		if (false == r.ContainsKey(field))
			throw new Exception("ERROR 'XmlDataTable.Field': field" + field + "' not exists in row '" + row + "'.");
			
		return r[field] as Hashtable;
	}
	
	//清空表
	function Clear()
	{
		Table.Clear();
	}
	
	//根据XmlDOM从字符串xml中加载表
	function LoadFromString(xmlStr : String)
	{
		var newXmlStr = xmlStr;
		if( xmlStr.Length >= 1 && xmlStr[0] == 0xFEFF )
		{
			newXmlStr = xmlStr.Substring(1);
		}
		
		var xd : XmlDocument = new XmlDocument();
		xd.LoadXml(newXmlStr);
		
		if (!xd.HasChildNodes)
			return;
			
		for (var r :  XmlElement in xd.DocumentElement.ChildNodes)
		{
			var row : Hashtable = new Hashtable();
			for (var f : XmlElement in r.ChildNodes)
			{
				row.Add(f.Name, f.InnerText);
			}
			Table.Add(row);
		}
	}
	
	//根据XMLParser从字符串xml中加载表
	function LoadFromString1(xmlStr : String)
	{
		var parser : XMLParser = new XMLParser();
		var doc : XMLNode = parser.Parse(xmlStr);
		
		for(var v in doc.Values)//root node key-values
		{
			if(v instanceof XMLNodeList)//table node
			{
				for(var rs : XMLNode in v)
				{
					for(var r in rs.Values)//table node key-values
					{
						if(r instanceof XMLNodeList)//row node
						{
							for(var l : XMLNode in r)
							{
								var row : Hashtable = new Hashtable();
								
								for(var k in l.Values)//row node key-values
								{
									if(k instanceof XMLNodeList)//field
									{
										for(var f : XMLNode in k)
										{
											row.Add(f["_name"], f["_text"]);
										}
									}
								}
								
								Table.Add(row);
							}
						}
					}
				}
				break;
			}
		}
	}
}