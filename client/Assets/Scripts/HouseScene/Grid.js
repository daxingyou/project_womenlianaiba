//--------------------------------------------------
// 创建格子(2011/8/10 create by hezhr)
// 说明:格子的宽度,width=2*(thick+halfW);格子的高度height=2*(thick+halfH)
//--------------------------------------------------
#pragma strict



//--------------------------------------------------
// 创建中空格子;pos,格子中心坐标;thick,格子边的厚度;halfW,格子的半宽;halfH,格子的半高;mat,格子的材料
public static function CreateGrid(pos : Vector3, thick : float, halfW : float, halfH : float, mat : Material) : GameObject
{
	if (null==pos || null==thick || null==halfW || null==halfH)
	{
		throw "Grid -> CreateGrid(Vector3, float, float, float, Material) -> parameter is wrong!";
	}
	var vertex : Vector3[] = new Vector3[8];
	var uv : Vector2[] = new Vector2[8];
	var vertexs : Vector3[];
	var uvs : Vector2[];
	var triangles : int[];
	vertex[0] = Vector3(-halfW-thick, 0, halfH+thick);
	vertex[1] = Vector3(halfW+thick, 0, halfH+thick);
	vertex[2] = Vector3(-halfW-thick, 0, -halfH-thick);
	vertex[3] = Vector3(halfW+thick, 0, -halfH-thick);
	vertex[4] = Vector3(-halfW, 0, halfH);
	vertex[5] = Vector3(halfW, 0, halfH);
	vertex[6] = Vector3(-halfW, 0, -halfH);
	vertex[7] = Vector3(halfW, 0, -halfH);
	uv[0] = Vector2(vertex[0].x, vertex[0].z);
	uv[1] = Vector2(vertex[1].x, vertex[1].z);
	uv[2] = Vector2(vertex[2].x, vertex[2].z);
	uv[3] = Vector2(vertex[3].x, vertex[3].z);
	uv[4] = Vector2(vertex[4].x, vertex[4].z);
	uv[5] = Vector2(vertex[5].x, vertex[5].z);
	uv[6] = Vector2(vertex[6].x, vertex[6].z);
	uv[7] = Vector2(vertex[7].x, vertex[7].z);
	vertexs = [vertex[0], vertex[1], vertex[2], vertex[3], vertex[4], vertex[5], vertex[6], vertex[7]];
	uvs = [uv[0], uv[1], uv[2], uv[3], uv[4], uv[5], uv[6], uv[7]];
	triangles = [0, 1, 5, 5, 4, 0, 1, 3, 7, 7, 5, 1, 3, 2, 6, 6, 7, 3, 2, 0, 4, 4, 6, 2];
	var obj : GameObject = new GameObject();
	obj.AddComponent(MeshFilter);
	obj.AddComponent(MeshRenderer);
	obj.GetComponent(MeshFilter).mesh.vertices = vertexs;
	obj.GetComponent(MeshFilter).mesh.uv = uvs;
	obj.GetComponent(MeshFilter).mesh.triangles = triangles;
	obj.GetComponent(MeshFilter).mesh.RecalculateNormals();
	obj.transform.position = pos;
	var mats : Material[] = obj.renderer.materials;
	mats[0] = mat;
	obj.renderer.materials = mats;
	return obj;
}
//--------------------------------------------------
// 创建中空格子;pos,格子中心坐标;thick,格子边的厚度;halfW,格子的半宽;halfH,格子的半高;col,格子的颜色
public static function CreateGrid(pos : Vector3, thick : float, halfW : float, halfH : float, col : Color) : GameObject
{
	var grid : GameObject = CreateGrid(pos, thick, halfW, halfH, null);
	grid.renderer.material.color = col;
	return grid;
}
//--------------------------------------------------
//创建非中空格子;pos,格子中心坐标;thick,格子边的厚度;halfW,格子的半宽;halfH,格子的半高;side,格子边框的颜色;core,格子内部的材料
public static function CreateGrid(pos : Vector3, thick : float, halfW : float, halfH : float, side : Material, core : Material) : GameObject
{
	if (null==pos || null==thick || null==halfW || null==halfH)
	{
		throw "Grid -> CreateGrid(Vector3, float, float, float, Material, Material) -> parameter is wrong!";
	}
	var vertex : Vector3[] = new Vector3[8];
	var uv : Vector2[] = new Vector2[8];
	var vertexs_side : Vector3[];
	var uvs_side : Vector2[];
	var triangles_side : int[];
	var vertexs_core : Vector3[];
	var uvs_core : Vector2[];
	var triangles_core : int[];
	vertex[0] = Vector3(-halfW-thick, 0, halfH+thick);
	vertex[1] = Vector3(halfW+thick, 0, halfH+thick);
	vertex[2] = Vector3(-halfW-thick, 0, -halfH-thick);
	vertex[3] = Vector3(halfW+thick, 0, -halfH-thick);
	vertex[4] = Vector3(-halfW, 0, halfH);
	vertex[5] = Vector3(halfW, 0, halfH);
	vertex[6] = Vector3(-halfW, 0, -halfH);
	vertex[7] = Vector3(halfW, 0, -halfH);
	uv[0] = Vector2(vertex[0].x, vertex[0].z);
	uv[1] = Vector2(vertex[1].x, vertex[1].z);
	uv[2] = Vector2(vertex[2].x, vertex[2].z);
	uv[3] = Vector2(vertex[3].x, vertex[3].z);
	uv[4] = Vector2(vertex[4].x, vertex[4].z);
	uv[5] = Vector2(vertex[5].x, vertex[5].z);
	uv[6] = Vector2(vertex[6].x, vertex[6].z);
	uv[7] = Vector2(vertex[7].x, vertex[7].z);
	vertexs_side = [vertex[0], vertex[1], vertex[2], vertex[3], vertex[4], vertex[5], vertex[6], vertex[7]];
	uvs_side = [uv[0], uv[1], uv[2], uv[3], uv[4], uv[5], uv[6], uv[7]];
	triangles_side = [0, 1, 5, 5, 4, 0, 1, 3, 7, 7, 5, 1, 3, 2, 6, 6, 7, 3, 2, 0, 4, 4, 6, 2];
	vertexs_core = [vertex[4], vertex[5], vertex[6], vertex[7]];
	uvs_core = [uv[4], uv[5], uv[6], uv[7]];
	triangles_core = [0, 1, 3, 3, 2, 0];
	var obj_side : GameObject = new GameObject();
	obj_side.AddComponent(MeshFilter);
	obj_side.AddComponent(MeshRenderer);
	obj_side.GetComponent(MeshFilter).mesh.vertices = vertexs_side;
	obj_side.GetComponent(MeshFilter).mesh.uv = uvs_side;
	obj_side.GetComponent(MeshFilter).mesh.triangles = triangles_side;
	obj_side.GetComponent(MeshFilter).mesh.RecalculateNormals();
	obj_side.transform.position = pos;
	var mats_side : Material[] = obj_side.renderer.materials;
	mats_side[0] = side;
	obj_side.renderer.materials = mats_side;
	var obj_core : GameObject = new GameObject();
	obj_core.AddComponent(MeshFilter);
	obj_core.AddComponent(MeshRenderer);
	obj_core.GetComponent(MeshFilter).mesh.vertices = vertexs_core;
	obj_core.GetComponent(MeshFilter).mesh.uv = uvs_core;
	obj_core.GetComponent(MeshFilter).mesh.triangles = triangles_core;
	obj_core.GetComponent(MeshFilter).mesh.RecalculateNormals();
	obj_core.transform.position = pos;
	var mats_core : Material[] = obj_core.renderer.materials;
	mats_core[0] = core;
	obj_core.renderer.materials = mats_core;
	var c_side : CombineInstance = new CombineInstance();
	c_side.mesh = obj_side.GetComponent(MeshFilter).sharedMesh;
	c_side.transform = obj_side.transform.localToWorldMatrix;
	var c_core : CombineInstance = new CombineInstance();
	c_core.mesh = obj_core.GetComponent(MeshFilter).sharedMesh;
	c_core.transform = obj_core.transform.localToWorldMatrix;
	var combine : CombineInstance[] = new CombineInstance[2];
	combine[0] = c_side;
	combine[1] = c_core;
	GameObject.Destroy(obj_side);
	GameObject.Destroy(obj_core);
	var obj : GameObject = new GameObject();
	obj.AddComponent(MeshFilter);
	obj.AddComponent(MeshRenderer);
	obj.GetComponent(MeshFilter).mesh = new Mesh();
	obj.GetComponent(MeshFilter).mesh.CombineMeshes(combine, false, false);
	obj.transform.position = pos;
	var mats_temp : Material[] = new Material[2];
	mats_temp[0] = side;
	mats_temp[1] = core;
	var mats : Material[] = obj.renderer.materials;
	mats = mats_temp;
	obj.renderer.materials = mats;
	return obj;
}
//--------------------------------------------------
// 创建非中空格子;pos,格子中心坐标;thick,格子边的厚度;halfW,格子的半宽;halfH,格子的半高;side,格子边框的颜色;core,格子内部的颜色
public static function CreateGrid(pos : Vector3, thick : float, halfW : float, halfH : float, side : Color, core : Color) : GameObject
{
	var grid : GameObject = CreateGrid(pos, thick, halfW, halfH, null, null);
	grid.renderer.materials[0].color = side;
	grid.renderer.materials[1].color = core;
	return grid;
}
//--------------------------------------------------
// 创建非中空格子;pos,格子中心坐标;thick,格子边的厚度;halfW,格子的半宽;halfH,格子的半高;side,格子边框的颜色;core,格子内部的材料
public static function CreateGrid(pos : Vector3, thick : float, halfW : float, halfH : float, side : Color, core : Material) : GameObject
{
	var grid : GameObject = CreateGrid(pos, thick, halfW, halfH, null, core);
	grid.renderer.materials[0].color = side;
	return grid;
}
//--------------------------------------------------
// 创建有方向中空格子,默认方向指向Z轴负方向;pos,格子中心坐标;thick,格子边的厚度;halfW,格子的半宽;halfH,格子的半高;mat,格子的材料
public static function CreateDirectionGrid(pos : Vector3, thick : float, halfW : float, halfH : float, mat : Material) : GameObject
{
	if (null==pos || null==thick || null==halfW || null==halfH)
	{
		throw "Grid -> CreateDirectionGrid(Vector3, float, float, float, Material) -> parameter is wrong!";
	}
	var vertex : Vector3[] = new Vector3[9];
	var uv : Vector2[] = new Vector2[9];
	var vertexs : Vector3[];
	var uvs : Vector2[];
	var triangles : int[];
	vertex[0] = Vector3(-halfW-thick, 0, halfH+thick);
	vertex[1] = Vector3(halfW+thick, 0, halfH+thick);
	vertex[2] = Vector3(-halfW-thick, 0, -halfH-thick);
	vertex[3] = Vector3(halfW+thick, 0, -halfH-thick);
	vertex[4] = Vector3(-halfW, 0, halfH);
	vertex[5] = Vector3(halfW, 0, halfH);
	vertex[6] = Vector3(-halfW, 0, -halfH/2);
	vertex[7] = Vector3(0, 0, -halfH-thick);
	vertex[8] = Vector3(halfW, 0, -halfH/2);
	uv[0] = Vector2(vertex[0].x, vertex[0].z);
	uv[1] = Vector2(vertex[1].x, vertex[1].z);
	uv[2] = Vector2(vertex[2].x, vertex[2].z);
	uv[3] = Vector2(vertex[3].x, vertex[3].z);
	uv[4] = Vector2(vertex[4].x, vertex[4].z);
	uv[5] = Vector2(vertex[5].x, vertex[5].z);
	uv[6] = Vector2(vertex[6].x, vertex[6].z);
	uv[7] = Vector2(vertex[7].x, vertex[7].z);
	uv[8] = Vector2(vertex[8].x, vertex[8].z);
	vertexs = [vertex[0], vertex[1], vertex[2], vertex[3], vertex[4], vertex[5], vertex[6], vertex[7], vertex[8]];
	uvs = [uv[0], uv[1], uv[2], uv[3], uv[4], uv[5], uv[6], uv[7], uv[7]];
	triangles = [0, 1, 5, 5, 4, 0, 1, 3, 8, 8, 5, 1, 3, 7, 8, 7, 2, 6, 2, 4, 6, 2, 0, 4];
	var obj : GameObject = new GameObject();
	obj.AddComponent(MeshFilter);
	obj.AddComponent(MeshRenderer);
	obj.GetComponent(MeshFilter).mesh.vertices = vertexs;
	obj.GetComponent(MeshFilter).mesh.uv = uvs;
	obj.GetComponent(MeshFilter).mesh.triangles = triangles;
	obj.GetComponent(MeshFilter).mesh.RecalculateNormals();
	obj.transform.position = pos;
	var mats : Material[] = obj.renderer.materials;
	mats[0] = mat;
	obj.renderer.materials = mats;
	return obj;
}
//--------------------------------------------------
// 创建有方向中空格子,默认方向指向Z轴负方向;pos,格子中心坐标;thick,格子边的厚度;halfW,格子的半宽;halfH,格子的半高;col,格子的颜色
public static function CreateDirectionGrid(pos : Vector3, thick : float, halfW : float, halfH : float, col : Color) : GameObject
{
	var grid : GameObject = CreateDirectionGrid(pos, thick, halfW, halfH, null);
	grid.renderer.material.shader = Shader.Find("Self-Illumin/Diffuse");	// 自发光材质
	grid.renderer.material.color = col;
	return grid;
}
//--------------------------------------------------


