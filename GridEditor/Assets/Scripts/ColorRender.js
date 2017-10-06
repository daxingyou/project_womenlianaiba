#pragma strict
public var material : Material;
function render (color : Color) {
	this.transform.renderer.materials[0].color = Color(color.r, color.g, color.b);
}

function reset()
{
	this.transform.renderer.material = material;
}