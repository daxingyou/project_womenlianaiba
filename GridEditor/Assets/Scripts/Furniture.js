#pragma strict
private var go : GameObject = null;
public var face : int;
public var Grids : Hashtable = new Hashtable();
function Start()
{
	this.transform.gameObject.AddComponent(Rigidbody);
	this.transform.gameObject.rigidbody.useGravity = false;
	this.transform.gameObject.rigidbody.isKinematic = true;
	var bc : BoxCollider = this.transform.gameObject.AddComponent(BoxCollider);
	this.transform.gameObject.collider.isTrigger = true;
	bc.center = Vector3(0, Mathf.Ceil(bc.size.y)/2.0f, 0);
	bc.size.x = calSize(bc.size.x) - 1;
	bc.size.y = Mathf.Ceil(bc.size.y);
	bc.size.z = calSize(bc.size.z) - 1;
}

function Update()
{
	if(go)
	{
		var pos : Vector3 = Camera.main.ScreenToWorldPoint (Input.mousePosition);
		var grid : GameObject = GetGrid();
		if(grid)
		{
			var angle : int = Mathf.RoundToInt(go.transform.rotation.y * 100);
			Debug.Log(angle);
			var boxCollider : BoxCollider = go.transform.collider;
			var z : float = boxCollider.size.z + 1;
			if(angle == 71 || angle == -71)
			{
				Debug.Log((z / 80) % 2);
				if((z / 80) % 2 == 1)
				{
					Debug.Log("111");
					go.transform.position = Vector3(grid.transform.position.x, 0, grid.transform.position.z + 40); 
				}
				else
					go.transform.position = Vector3(grid.transform.position.x + 40, 0, grid.transform.position.z); 
			}
			else
			{
				if((z / 80) % 2 == 1)
					go.transform.position = Vector3(grid.transform.position.x + 40, 0, grid.transform.position.z); 
				else
					go.transform.position = Vector3(grid.transform.position.x, 0, grid.transform.position.z + 40); 
			}
		}
	}
	
	if(Input.GetButtonDown("Fire2"))
	{
		var ray : Ray = Camera.main.ScreenPointToRay (Input.mousePosition);
		var hit : RaycastHit;
		if (Physics.Raycast (ray, hit, 10000)) {
	    	if(this.transform.name == hit.transform.name)
	    	{	
	    		this.transform.Rotate(Vector3(0, 90, 0));
	    	}
		}
	}
}

function OnTriggerEnter( other : Collider ) 
{
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

function calSize(size : float) : int
{
	var n : int = size / 40;
	var c : int = size % 40;
	if (Mathf.Abs(n - 40) > 30)
	{
		n += 1;
	}
	return n * 40;
}
