#pragma strict
private var go : GameObject = null;
public var Grids : Hashtable = new Hashtable();

function Update()
{
	if(go)
	{
		var pos : Vector3 = Camera.main.ScreenToWorldPoint (Input.mousePosition);
		var grid : GameObject = GetGrid();
		if(grid)
		{
			go.transform.position = Vector3(grid.transform.position.x, 0, grid.transform.position.z); 
		}
	}

}

function OnTriggerEnter( other : Collider ) 
{
	Debug.Log(other.transform.name);
	if(other.transform.gameObject.layer == 8 && !Grids.ContainsKey(other.transform.name) && go)
		Grids.Add(other.transform.name, other.transform.gameObject);
}

function OnTriggerExit( other : Collider )
{
	if(Grids.ContainsKey(other.transform.name))
	{
		Grids.Remove(other.transform.name);
	}
}

function OnMouseDown()
{
	go = this.gameObject;

}

function OnMouseUp()
{
	if(go)
	{
		go = null;
	}
	
	Debug.Log(Grids.Count);
}

function GetGrid()
{
	var ray : Ray = Camera.main.ScreenPointToRay (Input.mousePosition);
	var rtns : RaycastHit[] = Physics.RaycastAll (ray);
	for( var i = 0; i < rtns.length; i++ )
	{
		 if(rtns[i].transform.gameObject.layer == 8)
		 {
		 	return rtns[i].transform.gameObject;
 		}
	}
	
	return null;
}