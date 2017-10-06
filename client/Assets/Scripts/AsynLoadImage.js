#pragma strict
public var imgName : String;
private var asynIcon : AsynIcon;

function Start () {
	asynIcon = new AsynIcon(function (tex){
								if(this.gameObject != null)
								{
								 	this.gameObject.renderer.material.mainTexture = tex as Texture; 
								 }
							}, null);	
	asynIcon.load(imgName);
}

function OnDestroy () {
    asynIcon.cancel();
}