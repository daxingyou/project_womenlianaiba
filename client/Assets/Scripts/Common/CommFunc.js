#pragma strict
#pragma downcast



public static function BitContains(aSet : int, aItem : int) : boolean
{
	return 0 != (aSet & aItem);
}

//房间号为0一定为室外，房间号不为0不一定为室内，即存在属于室外的房间，比如阳台
public static function room2zone(indoor : boolean, floor : int, room : int) : int
{ 
	return (indoor && 0 != room) ? floor*100+room : 0; 
}

//转到u3d的左手坐标系旋转规则
public static function ToU3DFace(face : int) : int
{
	//##LH
//	if(face == 1)
//		return 3;
//	else if(face == 3)
//		return 1;
		
	return face;
}

public static function copyGrids(src : Array, dst : Array) : void
{
	for (var grid : GridInfo in src)
	{
		if (null == grid)
			continue;
		
		dst.Add(new GridInfo(grid.x, grid.z));
	}
}

public static function DegreesToRadians(degree : float) : float
{
	return (degree * Mathf.PI) / 180.0f;
}

public static function CalcLayerIdx(floor : int, room : int) : int
{
	if (0 == room)
		return 0;
		
	return (8 + ((floor * 8 + room) % 24));
	//return (8 + room%24);
}

public static function CalcLayerMask(layer : int) : int
{
	var mask : int = 1 << layer;
	
	return mask;
	//return (1 | mask);
}
//--------------------------------------------------
// 说  明:设置结点的父子关系(2011/12/19 add by hezhr)
// 参  数:parent,父节点,可以为null;child,子节点
public static function setParent(parent : GameObject, child : GameObject) : void
{
	if (null == child)
		return;
	
	// save old transform
	var old_position : Vector3 = child.transform.localPosition;
	var old_rotation : Quaternion = child.transform.localRotation;
	var old_scale : Vector3 = child.transform.localScale;
	// set parent relation
	if (null == parent)	// detach parent
	{
		child.transform.parent = null;
	}
	else				// attach parent
	{
		child.transform.parent = parent.transform;
	}
	// recover old transform
	child.transform.localPosition = old_position;
	child.transform.localRotation = old_rotation;
	child.transform.localScale = old_scale;
}
//--------------------------------------------------
public static function setParent(parent : GameObject, bone : String, child : GameObject) : void
{
	if (null == parent || null == child)
		return;
	
	if (null == bone || "" == bone)
	{
		setParent(parent, child);
		return;
	}
	for (var trans : Transform in parent.GetComponentsInChildren(Transform, true))
	{
		if (bone == trans.gameObject.name)
		{
			setParent(trans.gameObject, child);
			return;
		}
	}
}
//--------------------------------------------------
// 说  明:设置结点位置
public static function setPosition(obj : GameObject, pos : Vector3) : void
{
	if (null == obj)
		return;
	
	obj.transform.localPosition = pos;
}
//--------------------------------------------------
// 说  明:设置结点转向
public static function setRotate(obj : GameObject, rot : Vector3) : void
{
	if (null == obj)
		return;
	
	obj.transform.localRotation = Quaternion.Euler(rot);
}
//--------------------------------------------------
// 说  明:根据鼠标位置获取场景中某个平面上的点(2011/10/10 add by hezhr)
// 参  数:cam,照相机;mousePos,鼠标位置;inNormal,平面法线;inPoint,平面的中心点
public static function getPointByMousePosition(cam : Camera, mousePos : Vector3, inNormal : Vector3, inPoint : Vector3) : Vector3
{
	if (null == cam)
		return Vector3.zero;
	
	var ray : Ray = cam.ScreenPointToRay(mousePos);	// 获取鼠标位置产生的射线
	var plane : Plane = Plane(inNormal, inPoint);	// 构造临时平面
	var distance : float = 0.0;
	plane.Raycast(ray, distance);	// 获取射线到平面的距离
	return ray.GetPoint(distance);	// 获取射线与平面的交点
}
//--------------------------------------------------
// 说  明:根据鼠标位置获取场景中原点为(0,0,0),方向向上的平面上的点(2011/10/13 add by hezhr)
// 参  数:void
public static function getPointByMousePosition(y : float) : Vector3
{
	return getPointByMousePosition(Camera.main, Input.mousePosition, Vector3.up, Vector3(0.0f, y, 0.0f));
}
//--------------------------------------------------
// 说  明:根据速度获取当前位置(2011/10/10 add by hezhr)
// 参  数:begin,开始位置;end,结束位置;cur,当前位置;speed,速度
public static function getPositionBySpeed(begin : Vector3, end : Vector3, cur : Vector3, speed : float) : Vector3
{
	var distance : float = Vector3.Distance(begin, end);
	var dist1 : float = Vector3.Distance(begin, cur);
	var dist2 : float = Vector3.Distance(cur, end);
//	Debug.Log("--- distance: "+distance+" dist1: "+dist1+" dist2: "+dist2+" ---");
	if ((dist1+dist2<=distance+1) && (dist1<distance) && (dist2<=distance))
	{
		var time : float = distance/speed;
		var xV : float = (end.x - begin.x)/time;
		var yV : float = (end.y - begin.y)/time;
		var zV : float = (end.z - begin.z)/time;
		return cur + Vector3(xV, yV, zV);
	}
	return cur;
}
//--------------------------------------------------
// 根据x和z坐标计算点end相对于begin(begin为原点)在第几象限,右上角为第一象限,逆时针叠加(2012/7/12 add by hezhr)
// 参  数:begin,开始位置;end,结束位置
public static function calcQuadrantXZ(begin : Vector3, end : Vector3) : int
{
	// 1-4个象限
	if ((end.x > begin.x) && (end.z > begin.z)) return 1;		// 第1象限
	if ((end.x < begin.x) && (end.z > begin.z)) return 2;		// 第2象限
	if ((end.x < begin.x) && (end.z < begin.z)) return 3;		// 第3象限
	if ((end.x > begin.x) && (end.z < begin.z)) return 4;		// 第4象限
	// 4个方向的坐标轴
	if ((end.x > begin.x) && (end.z == begin.z)) return 5;		// +x轴方向
	if ((end.x == begin.x) && (end.z > begin.z)) return 6;		// +z轴方向
	if ((end.x < begin.x) && (end.z == begin.z)) return 7;		// -x轴方向
	if ((end.x == begin.x) && (end.z < begin.z)) return 8;		// -z轴方向
	return 0;		// 原点
}
//--------------------------------------------------
// 获取从点begin到点end的角度,左手坐标系,逆时针(2012/7/13 add by hezhr)
// 参  数:begin,开始位置;end,结束位置
public static function calcRadiusXZ(begin : Vector3, end : Vector3) : float
{
	var quadrant : int = calcQuadrantXZ(begin, end);
	if (0 == quadrant) return 0.0f;
	if (5 == quadrant) return 0.0f;
	if (6 == quadrant) return 90.0f;
	if (7 == quadrant) return 180.0f;
	if (8 == quadrant) return 270.0f;
	// 构建一个直角三角形,计算直角边
	var temp : Vector3 = Vector3(end.x, begin.y, begin.z);	// 直角点
	var a : float = Vector3.Distance(begin, temp);
	var b : float = Vector3.Distance(temp, end);
	var degree : float = Mathf.Atan2(b, a) * Mathf.Rad2Deg;
	if (1 == quadrant) return degree;
	if (2 == quadrant) return 180.0f - degree;
	if (3 == quadrant) return degree + 180.0f;
	if (4 == quadrant) return 360.0f - degree;
	return 0.0f;
}
//--------------------------------------------------
// 说  明:限制int变量的取值范围
public static function limitIntValue(min : int, max : int, val : int) : int
{
	return (val < min) ? min : (val > max ? max : val);
}
//--------------------------------------------------
// 说  明:限制float变量的取值范围
public static function limitFloatValue(min : float, max : float, val : float) : float
{
	return (val < min) ? min : (val > max ? max : val);
}
//--------------------------------------------------
// 说  明:判断是否含有子节点
public static function existChildGameObj(pare : GameObject, child : GameObject) : boolean
{
	if (null == pare || null == child)
		return false;
	
	for (var trans : Transform in pare.GetComponentsInChildren(Transform, true))
	{
		if (child == trans.gameObject)
			return true;
	}
	return false;
}
//--------------------------------------------------
// 说  明:获取第一个名字为child_name的子节点
public static function getChildGameObj(pare : GameObject, child_name : String) : GameObject
{
	if (null == pare)
		return null;
	
	for (var trans : Transform in pare.GetComponentsInChildren(Transform, true))
	{
		if (child_name == trans.name)
			return trans.gameObject;
	}
	return null;
}
//--------------------------------------------------
// 说  明:获取名字为child_name的所有子节点
public static function getChildGameObjs(pare : GameObject, child_name : String) : Array
{
	var arr : Array = new Array();
	if (null == pare)
		return arr;
	
	for (var trans : Transform in pare.GetComponentsInChildren(Transform, true))
	{
		if (child_name == trans.name)
		{
			arr.Add(trans.gameObject);
		}
	}
	return arr;
}
//--------------------------------------------------
// 说  明:获取数组里元素的索引
public static function indexOfArray(arr : Array, ele : System.Object) : int
{
	if (null == arr)
		throw "CommFunc -> indexOfArray(Array, System.Object) -> array is null.";
	
	for (var i:int = 0; i<arr.Count; ++i)
	{
		if (ele == arr[i])
			return i;
	}
	return -1;
}
//--------------------------------------------------
// 说  明:获取数组里索引处的元素
public static function valueOfArray(arr : Array, index : int) : System.Object
{
	if (null == arr)
		throw "CommFunc -> valueOfArray(Array, index) -> array is null.";
	
	if (index < 0 || index >= arr.Count)
		throw "CommFunc -> valueOfArray(Array, index) -> index ["+index+"] out range [0, "+arr.Count+").";
	
	return arr[index];
}
//--------------------------------------------------
// 说  明:获取数组内的随机元素
public static function randomOfArray(arr : Array) : System.Object
{
	if (null == arr)
		throw "CommFunc -> randomOfArray(Array) -> array is null.";
	
	if (0 == arr.Count)
		throw "CommFunc -> randomOfArray(Array) -> array count is 0.";
	
	var index : int = Random.Range(0, arr.Count);
	return arr[index];
}
//--------------------------------------------------
// 说  明:移除Array里空的元素
public static function removeArrayNull(arr : Array) : void
{
	if (null == arr)
		return;
	
	var count : int = 0;
	for (var ele : System.Object in arr)
	{
		if (null == ele)
		{
			++count;
		}
	}
	for (var i:int = 0; i<count; ++i)
	{
		arr.Remove(null);
	}
}
//--------------------------------------------------
// 说  明:从begin开始获取num个元素,例:[0,1,2,3,4,5,6],begin=3,num=3则获得[3,4,5],num=-3则获得[3,2,1]
public static function getArrayFromBegin(arr : Array, begin : int, num : int) : Array
{
	var temp_arr : Array = new Array();
	if (null == arr || 0 == arr.Count || begin < 0 || begin >= arr.Count)
		return temp_arr;
	
	var end : int = begin + num;
	if (num >= 0)
	{
		if (end >= arr.Count)
			end = arr.Count;
		
		for (var i:int = begin; i<end; ++i)
			temp_arr.Add(arr[i]);
	}
	else
	{
		if (end <= 0)
			end = 0;
		
		for (var j:int = begin; j>end; --j)
			temp_arr.Add(arr[j]);
	}
	return temp_arr;
}
//--------------------------------------------------
// 说  明:添加网格碰撞器(模型不能是组合过的,且所有节点只有一个渲染器)
public static function addMeshCollider(obj : GameObject, node : String) : boolean
{
	if (null == obj)
		return false;
	
	var mr : MeshRenderer = obj.GetComponentInChildren(MeshRenderer);
	var smr : SkinnedMeshRenderer = obj.GetComponentInChildren(SkinnedMeshRenderer);
	if (null == mr && null == smr)
		return false;
	
	if ("" == node)
	{
		if (mr)
		{
			mr.gameObject.AddComponent(MeshCollider);
		}
		else if (smr)
		{
			var ms1 : MeshCollider = smr.gameObject.AddComponent(MeshCollider);
			ms1.sharedMesh = smr.sharedMesh;
		}
		return true;
	}
	for (var trans : Transform in obj.GetComponentsInChildren(Transform, true))
	{
		if (node == trans.gameObject.name)
		{
			var ms2 : MeshCollider = trans.gameObject.AddComponent(MeshCollider);
			if (smr)
			{
				ms2.sharedMesh = smr.sharedMesh;
			}
			return true;
		}
	}
	return false;
}
//--------------------------------------------------
// 说  明:获取渲染器(所有节点只能有一个渲染器)
public static function getRenderer(obj : GameObject) : Renderer
{
	if (null == obj)
		return null;
	
	return obj.GetComponentInChildren(Renderer);
}
//--------------------------------------------------
// 说  明:设置物件是否显示
public static function setGameObjVisible(obj : GameObject, visible : boolean) : void
{
	if (null == obj)
		return;
	
	for (var render : Renderer in obj.GetComponentsInChildren(Renderer))
	{
		render.enabled = visible;
	}
	
	for (var colli : Collider in obj.GetComponentsInChildren(Collider))
	{
		colli.enabled = visible;
	}
}
//--------------------------------------------------
// 说  明:物件是否显示
public static function isGameObjVisible(obj : GameObject) : boolean
{
	if (null == obj)
		return false;
	
	for (var render : Renderer in obj.GetComponentsInChildren(Renderer))
	{
		if (render.enabled)
			return true;
	}
	return false;
}
//--------------------------------------------------
// 说  明:设置节点下所有物件是否可用
public static function setGameObjActive(obj : GameObject, active : boolean) : void
{
	if (null == obj)
		return;
	
	for (var trans : Transform in obj.GetComponentsInChildren(Transform, true))
	{
		trans.gameObject.active = active;
	}
}
//--------------------------------------------------
// 说  明:设置物件可以看作静态的遮挡
public static function setGameObjStatic(obj : GameObject, flag : boolean) : void
{
	if (null == obj)
		return;
	
	for (var trans : Transform in obj.GetComponentsInChildren(Transform, true))
	{
		trans.gameObject.isStatic = flag;
	}
}
//--------------------------------------------------
// 说  明:设置物件的层
public static function setGameObjectLayer(obj : GameObject, layer : int) : boolean
{
	if (null == obj || layer == obj.layer)
		return false;
	
	for (var trans : Transform in obj.GetComponentsInChildren(Transform, true))
	{
		trans.gameObject.layer = layer;
	}
	return true;
}
//--------------------------------------------------
// 说  明:设置物件的层,根据楼层编号和房屋编号
public static function setGameObjectLayer(obj : GameObject, floor : int, room : int) : boolean
{
	if (null == obj)
		return false;
	
	return setGameObjectLayer(obj, CalcLayerIdx(floor, room));
}
//--------------------------------------------------
// 说  明:设置场景里物件的层
public static function setGameObjectLayer(obj : GameObject, scene : HouseScene) : boolean
{
	if (null == obj || null == scene)
		return false;
	
	var grid : HouseSceneGrid = scene.gridByPosition(obj.transform.position);
	if (null == grid || null == grid.Creator)
		return false;
	
	return setGameObjectLayer(obj, CalcLayerIdx(grid.Creator.FloorNO, grid.Room));
}
//--------------------------------------------------
// 说  明:获取两个位置的距离
public static function getPosDistance(x0 : int, z0 : int, x1 : int, z1 : int) : int
{
	var x_dis : int = Mathf.Abs(x0 - x1);
	var z_dis : int = Mathf.Abs(z0 - z1);
	
	return x_dis > z_dis ? x_dis : z_dis;
}
//--------------------------------------------------
// 说  明:保留几位小数
public static function toDecimal(num : float, bit : int) : float
{
	var integer : int = Mathf.FloorToInt(num);	// 整数
	var decimals : float = num - integer;	// 小数
	var base : int = 1;
	for (var i:int = 0; i<bit; ++i)	// 小数乘以10的bit次方
	{
		base *= 10;
	}
	var temp : float = Mathf.Round(decimals*base);
	return integer + temp/base;
}
//--------------------------------------------------
// 说  明:获取指定概率,probability:百分之一到百分之百
public static function getProbability(probability : int) : boolean
{
	if (probability < 0 || probability > 100)
		throw "CommFunc -> getProbability(int) -> probability["+probability+"] is out of range[0, 100].";
	
	var seeds : Array = new Array();
	for (var i:int = 1; i<=100; ++i)
	{
		seeds.Add(i);
	}
	var res : int = CommFunc.randomOfArray(seeds);
	return res <= probability;
}
//--------------------------------------------------


