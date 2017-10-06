#pragma strict
public var m : Material;
public var m0 : Material;
public var m1 : Material;
public var m2 : Material;
public var m3 : Material;
public var m4 : Material;
public var m5 : Material;
public var m6 : Material;
public var m7 : Material;
public var m8 : Material;
public var m9 : Material;
public var m10 : Material;
public var m11 : Material;
public var m12 : Material;
public var m13 : Material;
public var m14 : Material;
public var m15 : Material;
public var m16 : Material;
public var m17 : Material;
public var m18 : Material;
public var m19 : Material;
public var m20 : Material;
function render (index : int) {
	switch(index)
	{
		case 0 : 
			setMaterial(m);
			break;
		case 1:
			setMaterial(m1);
			break;
		case 2:
			setMaterial(m2);
			break;
		case 3:
			setMaterial(m3);
			break;
		case 4:
			setMaterial(m4);
			break;
		case 5:
			setMaterial(m5);
			break;
		case 6:
			setMaterial(m6);
			break;
		case 7:
			setMaterial(m7);
			break;
		case 8:
			setMaterial(m8);
			break;
		case 9:
			setMaterial(m9);
			break;
		case 10:
			setMaterial(m10);
			break;
		case 11:
			setMaterial(m11);
			break;
		case 12:
			setMaterial(m12);
			break;
		case 13:
			setMaterial(m13);
			break;
		case 14:
			setMaterial(m14);
			break;
		case 15:
			setMaterial(m15);
			break;
		case 16:
			setMaterial(m16);
			break;
		case 17:
			setMaterial(m17);
			break;
		case 18:
			setMaterial(m18);
			break;
		case 19:
			setMaterial(m19);
			break;
		case 20:
			setMaterial(m20);
			break;
	}
}

function reset()
{
	this.transform.renderer.materials[1].mainTexture = m0.mainTexture;
}

function setMaterial(material:Material)
{
	this.transform.renderer.materials[1].mainTexture = material.mainTexture;
}