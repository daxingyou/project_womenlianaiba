#pragma strict

var icon:Texture2D;
var IconBase64:String = "";

private var IconWidth:int = 32;
private var IconHeight:int = 32;
function OnGUI(){
	if (icon == null){
		if (IconBase64 == null)
			return;
		else{
			var bytes:byte[] = Convert.FromBase64String(IconBase64);
			icon = new Texture2D(IconWidth, IconHeight);
			icon.anisoLevel = 9;
			icon.LoadImage(bytes);
		}
	}
		
	var p:Vector3 = new Vector3(transform.position.x - 30, transform.position.y + 230.0, transform.position.z);
	if (Camera.main){
 		var screenPos : Vector3 = Camera.main.WorldToScreenPoint(p);
		GUI.DrawTexture(new Rect(screenPos.x, Camera.main.pixelHeight - screenPos.y, IconWidth, IconHeight), icon);
	}
}