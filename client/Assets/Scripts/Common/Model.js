/*----------------------------------------------------------------------------------------------------
模型(2011/8/18 create by hezhr)
使用说明:
	此类主要用来组合模型的多个部位,并且可以更换和添加部位,可以更换不同部位的材质,可以挂接模型,可以播放动画(如果模型有动画的话)
(1)调用createModel()来创建一个基本模型对象,这个模型可以直接使用;
(2)如果模型有部位,如一个人有身体,头部,头发,衣服,裤子,鞋子,使用findPart(),addPart(),removePart()三个函数进行部位的操作,
当要给一个模型增加/移除多个部位时,就需要调用多次addPart()/removePart(),在所有调用都结束后,必须调用combine(),可以调用
changeMaterial()进行部位材质的更换;
(3)如果模型需要挂接子模型,如一个人可能带帽子,眼镜或拿手持等,使用findChild(),addChild(),removeChild()三个函数进行子模型的操作;
(4)可以使用addClip(),removeClip(),play(),stop()四个函数对模型动画进行相关的操作;
----------------------------------------------------------------------------------------------------*/
#pragma strict
#pragma downcast

class ModelParticle {
	public var part : String;
	public var particle : GameObject;
}

// 模型
class Model extends AsynModel
{
	protected var m_gameObj : GameObject = null;					// 模型对应的GameObject
	protected var m_part : Hashtable = new Hashtable();				// 模型部位哈希表(String, ModelSkinInfo)
	protected var m_partName : Array = new Array();					// 模型部位名称表(String)
	protected var m_children : Hashtable = new Hashtable();			// 模型的子模型哈希表(String, GameObject)
	protected var m_baseName : String = "base";						// 模型的基本部位名称
	public var asynCtrl : AsynModelCtrl = new AsynModelCtrl(this);	// 模型对应的异步控制器
	
	private var mParticleList : ArrayList = new ArrayList();		// model particle list
	
	//--------------------------------------------------
	// 初始化,1.需要模型组合时使用,2.模型有且只有SkinnedMeshRenderer
	public function init(name : String, original : GameObject) : boolean
	{
		if (""==name || null==name || null==original)
		{
			throw "Model -> init(String, GameObject) -> argument is wrong!";
		}
		if (m_gameObj)
		{
			return false;
		}
		m_gameObj = GameObject.Instantiate(original);
		m_gameObj.name = name + m_gameObj.GetHashCode();
		var smrs : Component[] = m_gameObj.GetComponentsInChildren(SkinnedMeshRenderer);
		for (var smr : SkinnedMeshRenderer in smrs)
		{
			if (smr.gameObject == m_gameObj)
			{
				continue;
			}
			GameObject.Destroy(smr.gameObject);
		}
		m_gameObj.AddComponent(SkinnedMeshRenderer);
		addPart(m_baseName, original, true);
		combine();
		return true;
	}
	//--------------------------------------------------
	// 设置GameObject
	public function setGameObj(name : String, original : GameObject) : boolean
	{
		if (""==name || null==name || null==original)
		{
			throw "Model -> setGameObj(String, GameObject) -> argument is wrong!";
		}
		if (m_gameObj)
		{
			return false;
		}
		m_gameObj = original;
		m_gameObj.name = name + m_gameObj.GetHashCode();
		return true;
	}
	//--------------------------------------------------
	// 获取模型对应的GameObject
	public function getGameObj() : GameObject
	{
		return m_gameObj;
	}
	//--------------------------------------------------
	// 销毁模型对应的GameObject,当要销毁模型时,一定要调用此函数
	public function destroyGameObj() : void
	{
		asynCtrl.clearEvent();	// 删除异步模型加载事件
		for (var kv : DictionaryEntry in m_part)
		{
			var part_msi : ModelSkinInfo = kv.Value;
			part_msi.clear();
		}
		m_part.Clear();
		m_partName.Clear();
		m_children.Clear();
		destroy(m_gameObj);		// 最后执行
	}
	//--------------------------------------------------
	// 判断该模型是否为空;true,表示模型只声明为实例化;false,表示模型已经实例化
	public function isNull() : boolean
	{
		if (m_gameObj)
		{
			return false;
		}
		return true;
	}
	//--------------------------------------------------
	// 查找部位,配合
	public function findPart(name : String) : ModelSkinInfo
	{
		if (""==name || null==name)
		{
			return null;
		}
		if (m_part.ContainsKey(name))
		{
			return m_part[name];
		}
		return null;
	}
	//--------------------------------------------------
	// 添加/更换部位
	public function addPart(name : String, part : GameObject, use_old_mat : boolean) : boolean
	{
		if (""==name || null==name || null==part)
		{
			return false;
		}
		var msi : ModelSkinInfo = new ModelSkinInfo();
		if (false == msi.colect(part))
		{
			// 部位必须是已经实例化出来的对象
			var obj : GameObject = GameObject.Instantiate(part);
			obj.GetComponentInChildren(SkinnedMeshRenderer).enabled = false;
			msi.colect(obj);
			GameObject.Destroy(obj);
		}
		if (m_part.ContainsKey(name))	// 部位已经存在
		{
			var part_msi : ModelSkinInfo = m_part[name];
			if (use_old_mat)	// 使用旧的材质
			{
				GameObject.Destroy(msi.materials[0]);
				msi.materials[0] = part_msi.materials[0];
			}
			else
			{
				GameObject.Destroy(part_msi.materials[0]);
			}
			m_part[name] = msi;
		}
		else	// 部位不存在
		{
			m_part.Add(name, msi);
			m_partName.Add(name);
		}
		return true;
	}
	//--------------------------------------------------
	// 移除部位
	public function removePart(name : String) : void
	{
		if (""==name || null==name)
		{
			return;
		}
		if (m_part.ContainsKey(name))
		{
			var part_msi : ModelSkinInfo = m_part[name];
			part_msi.clear();
			m_part.Remove(name);
			m_partName.Remove(name);
		}
	}
	//--------------------------------------------------
	// 查找子模型
	public function findChild(name : String) : GameObject
	{
		if (""==name || null==name)
		{
			return null;
		}
		if (m_children.ContainsKey(name))
		{
			return m_children[name];
		}
		return null;
	}
	//--------------------------------------------------
	// 添加/更换子模型
	public function addChild(name : String, child : GameObject, holdBoneName : String) : void
	{
		if (""==name || null==name || null==child || ""==holdBoneName || null==holdBoneName || null==m_gameObj)
		{
			return;
		}
		if (m_children.ContainsKey(name))	// 子模型存在,替换掉
		{
			removeChild(name);
		}
		for (var trans : Transform in m_gameObj.GetComponentsInChildren(Transform))
		{
			if (holdBoneName == trans.name)
			{
//				Debug.Log("--- Model.js -> AddChild() -> holdBoneName: "+holdBoneName+" ---");
				CommFunc.setGameObjVisible(child, isVisible());
				CommFunc.setParent(trans.gameObject, child);
				child.transform.localPosition = Vector3.zero;
				child.transform.localRotation = Quaternion.identity;
				m_children.Add(name, child);
				return;
			}
		}
	}
	//--------------------------------------------------
	// 移除子模型
	public function removeChild(name : String) : void
	{
		if (""==name || null==name)
		{
			return;
		}
		if (m_children.ContainsKey(name))
		{
			var child : GameObject = m_children[name];
			CommFunc.setParent(null, child);
			m_children.Remove(name);
		}
	}
	//--------------------------------------------------
	// 增加动画剪辑
	public function addClip(clip : AnimationClip, name : String) : void
	{
		if (null==clip || ""==name || null==name || null==m_gameObj || null==m_gameObj.animation)
		{
			return;
		}
//		Debug.Log("--- Model.js -> AddClip() -> clip name: "+name+" ---");
		m_gameObj.animation.AddClip(clip, name);
	}
	//--------------------------------------------------
	// 移除动画剪辑
	public function removeClip(name : String) : void
	{
		if (""==name || null==name || null==m_gameObj || null==m_gameObj.animation)
		{
			return;
		}
//		Debug.Log("--- Model.js -> RemoveClip() -> clip name: "+name+" ---");
		m_gameObj.animation.RemoveClip(name);
	}
	//--------------------------------------------------
	
	//-----------------particle operator----------------
	public function addParticle(part : String, particle : GameObject, holdBone : String) {
		if (""==part || null==part || null==particle || ""==holdBone || null==holdBone || null==m_gameObj) return;
		
		for (var trans : Transform in m_gameObj.GetComponentsInChildren(Transform)) {
			if (holdBone == trans.name) {
				CommFunc.setGameObjVisible(particle, isVisible());
				CommFunc.setParent(trans.gameObject, particle);
				particle.transform.localPosition = Vector3.zero;
				particle.transform.localRotation = Quaternion.identity;
				var mp : ModelParticle = new ModelParticle();
				mp.part = part;
				mp.particle = particle;
				mParticleList.Add(mp);
				return;
			}
		}
	}
	
	public function removeParticle(part : String) {
		if (""==part || null==part) return;
		
		var removeList : ArrayList = new ArrayList();
		for(var mp : ModelParticle in mParticleList) {
			if(mp.part == part) {
				CommFunc.setParent(null, mp.particle);
				GameObject.Destroy(mp.particle);
				removeList.Add(mp);
			}
		}
		for(var mp : ModelParticle in removeList) {
			mParticleList.Remove(mp);
		}
	}
	
	// 播放默认动画
	public function play(mode : WrapMode) : void
	{
		if (null==m_gameObj || null==m_gameObj.animation)
		{
			return;
		}
		if (null == m_gameObj.animation.clip)
		{
			Debug.LogError("Error: Model -> Play() -> default ani is not exist!");
			return;
		}
		m_gameObj.animation.wrapMode = mode;
		m_gameObj.animation.Play();
	}
	//--------------------------------------------------
	// 播放指定动画
	public function play(name : String, mode : WrapMode) : void
	{
		if (""==name || null==name || null==m_gameObj || null==m_gameObj.animation)
		{
			return;
		}
//		Debug.Log("--- Model.js -> Play() -> clip name: "+name+" ---");
		if (null == m_gameObj.animation[name])
		{
			Debug.LogError("Error: Model -> Play(String, WrapMode) -> clip name '"+name+"' isn't exist!");
			return;
		}
		m_gameObj.animation[name].wrapMode = mode;
		m_gameObj.animation.Play(name);
	}
	//--------------------------------------------------
	// 停止指定动画
	public function stop(name : String) : void
	{
		if (""==name || null==name || null==m_gameObj || null==m_gameObj.animation)
		{
			return;
		}
//		Debug.Log("--- Model.js -> Stop() -> clip name: "+name+" ---");
		m_gameObj.animation.Stop(name);
	}
	//--------------------------------------------------
	// 获取动画剪辑
	public function getClip(name : String) : AnimationState
	{
		if (""==name || null==name || null==m_gameObj || null==m_gameObj.animation)
		{
			return null;
		}
		return m_gameObj.animation[name];
	}
	//--------------------------------------------------
	// 改变部位材质
	public function changeMaterial(part : String, mat : Material) : boolean
	{
		if (""==part || null==part || null==m_gameObj || null==m_gameObj.renderer)
		{
			return false;
		}
//		Debug.Log("--- Model.js -> ChangeMaterial() -> part: "+part+", material name: "+mat.name+" ---");
		for (var i:int=0; i<m_partName.length; ++i)
		{
			if (part == m_partName[i])
			{
				var materials : Material[] = m_gameObj.renderer.materials;
				GameObject.Destroy(materials[i]);
				materials[i] = mat;
				m_gameObj.renderer.materials = materials;
				var part_msi : ModelSkinInfo = m_part[part];
				GameObject.Destroy(part_msi.materials[0]);
				part_msi.materials[0] = mat;
				return true;
			}
		}
		return false;
	}
	//--------------------------------------------------
	// 改变部位材质
	public function changeMaterial(mat : Material) : boolean
	{
		if (null==m_gameObj || null==m_gameObj.renderer)
		{
			return false;
		}
		var material : Material = m_gameObj.renderer.material;
		GameObject.Destroy(material);
		material = mat;
		m_gameObj.renderer.material = material;
		return true;
	}
	//--------------------------------------------------
	// 改变部位材质颜色
	public function changeMaterialColor(part : String, col : Color) : boolean
	{
		if (""==part || null==part || null==m_gameObj || null==m_gameObj.renderer)
		{
			return false;
		}
//		Debug.Log("--- Model.js -> changeMaterialColor() -> part: "+part+", col: "+col+" ---");
		for (var i:int=0; i<m_partName.length; ++i)
		{
			if (part == m_partName[i])
			{
				var materials : Material[] = m_gameObj.renderer.materials;
				materials[i].color = col;
				m_gameObj.renderer.materials = materials;
				return true;
			}
		}
		return false;
	}
	//--------------------------------------------------
	// 改变部位材质颜色
	public function changeMaterialColor(col : Color) : boolean
	{
		if (null==m_gameObj || null==m_gameObj.renderer)
		{
			return false;
		}
		var material : Material = m_gameObj.renderer.material;
		material.color = col;
		m_gameObj.renderer.material = material;
		return true;
	}
	//--------------------------------------------------
	// 获取部位材质
	public function getMaterial(part : String) : Material
	{
		if (""==part || null==part || null==m_gameObj || null==m_gameObj.renderer)
		{
			return null;
		}
		if (m_part.ContainsKey(part))
		{
			var part_msi : ModelSkinInfo = m_part[part];
			return part_msi.materials[0];
		}
		return null;
	}
	//--------------------------------------------------
	// 获取部位材质
	public function getMaterial() : Material
	{
		if (null==m_gameObj || null==m_gameObj.renderer)
		{
			return null;
		}
		return m_gameObj.renderer.material;
	}
	//--------------------------------------------------
	// 设置可见性
	public function setVisible(visible : boolean) : void
	{
		if (null == m_gameObj)
		{
			return;
		}
		CommFunc.setGameObjVisible(m_gameObj, visible);
		for (var kv : DictionaryEntry in m_children)
		{
			CommFunc.setGameObjVisible(kv.Value as GameObject, visible);
		}
	}
	//--------------------------------------------------
	// 是否可见
	public function isVisible() : boolean
	{
		if (null == m_gameObj)
		{
			return false;
		}
		var render : Renderer = CommFunc.getRenderer(m_gameObj);
		if (render)
		{
			return render.enabled;
		}
		return false;
	}
	//--------------------------------------------------
	// 组合,在AddPart()后面调用
	public function combine() : void
	{
		if (null==m_gameObj || null==m_gameObj.GetComponent(SkinnedMeshRenderer))
		{
			return;
		}
		var combineInstances : CombineInstance[] = new CombineInstance[m_partName.length];
		var materials : Material[] = new Material[m_partName.length];
		var bones : Array = new Array();
		var transforms : Component[] = m_gameObj.GetComponentsInChildren(Transform);
		for (var i:int=0; i<m_partName.length; ++i)	// 关键技术点,用来收集骨骼
		{
			var msi : ModelSkinInfo = m_part[m_partName[i]];
			materials[i] = msi.materials[0];
			combineInstances[i] = msi.combines[0];
			for (var j:int=0; j<msi.bones.Count; ++j)
			{
				for (var k:int=0; k<transforms.length; ++k)
				{
					if (msi.bones[j] == transforms[k].name)
					{
						bones.Add(transforms[k]);
						break;
					}
				}
			}
		}
		// Debug.Log("--- combineInstances: "+combineInstances.length+", bones: "+bones.length+", materials: "+materials.length+" ---");
		var objSmr : SkinnedMeshRenderer = m_gameObj.GetComponent(SkinnedMeshRenderer);
		GameObject.Destroy(objSmr.sharedMesh);	// 避免网格引起的内存泄露
		objSmr.sharedMesh = new Mesh();
		objSmr.sharedMesh.CombineMeshes(combineInstances, false, false);
		var mats : Material[] = objSmr.materials;
		for (var m : Material in mats)	// 避免材质引起的内存泄露
		{
			GameObject.Destroy(m);
		}
		mats = materials;
		objSmr.materials = mats;
		objSmr.bones = bones;
		CommFunc.setGameObjStatic(m_gameObj, true);
	}
	//--------------------------------------------------
	// 创建模型用此接口来创建一个新的模型;name,模型的名称;original,基本的模型对象
	// original应包含有模型的所有节点的位置信息,和动画信息(有动画的话)
	public static function createModel(name : String, original : GameObject, to_combine : boolean) : Model
	{
		var model : Model = new Model();
		var result : boolean = false;
		if (to_combine)
		{
			result = model.init(name, original);
		}
		else
		{
			result = model.setGameObj(name, original);
		}
		if (result)
		{
			return model;
		}
		return null;
	}
	//--------------------------------------------------
	// 销毁game object,连同销毁网格和材质等相关资源
	public static function destroy(gobj : GameObject) : void
	{
		if (null == gobj)
		{
			return;
		}
		var smr : SkinnedMeshRenderer = gobj.GetComponent(SkinnedMeshRenderer);
		if (smr)
		{
			GameObject.Destroy(smr.sharedMesh);
			GameObject.Destroy(smr.sharedMaterial);
			for (var mat : Material in smr.sharedMaterials)
			{
				GameObject.Destroy(mat);
			}
		}
		GameObject.Destroy(gobj);
	}
	//--------------------------------------------------
	// 动画停止在某个时间点;name,动画剪辑名称;time_pos,剪辑里的某处时间点
	public static function setAnimationPos(ani : Animation, name : String, time_pos: float) : void
	{
		if (null==ani || ""==name || null==name || null==ani[name])
		{
			return;
		}
		ani[name].speed = 0.0f;
		ani[name].normalizedTime = time_pos / ani[name].length;
		ani.Play(name);
	}
	//--------------------------------------------------
}





//--------------------------------------------------
// 模型蒙皮信息
class ModelSkinInfo
{
	public var materials : Array = new Array();		// 材质
	public var combines : Array = new Array();		// 网格
	public var bones : Array = new Array();			// 骨骼
	//--------------------------------------------------
	// 收集GameObject蒙皮信息
	public function colect(obj : GameObject) : boolean
	{
		clear();
		if (null==obj || null==obj.GetComponentInChildren(SkinnedMeshRenderer))
		{
			return false;
		}
		var smr : SkinnedMeshRenderer = obj.GetComponentInChildren(SkinnedMeshRenderer);
		// 收集材质
		for (var i:int=0; i<smr.materials.length; ++i)
		{
			materials.Add(smr.materials[i]);
		}
		// 收集网格
		for (var j:int=0; j<smr.sharedMesh.subMeshCount; ++j)
		{
			var ci : CombineInstance = new CombineInstance();
			ci.mesh = smr.sharedMesh;
			ci.subMeshIndex = j;
			combines.Add(ci);
		}
		// 收集骨骼
		for (var k:int=0; k<smr.bones.length; ++k)
		{
			bones.Add(smr.bones[k].name);
		}
		return true;
	}
	//--------------------------------------------------
	// 清除
	public function clear() : void
	{
		for (var mat : Material in materials)
		{
			GameObject.Destroy(mat);
		}
		materials.Clear();
		combines.Clear();
		bones.Clear();
	}
	//--------------------------------------------------
}


