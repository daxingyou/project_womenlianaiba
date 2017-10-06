#pragma strict
#pragma downcast

/*
//Npc system instance
//creat by fullzhu 2012.9.4
//last edit at 2012.9.4 by fullzhu
*/

public var mNpcID : int = 0;
public var mColliderCenter : Vector3 = Vector3(0, 0.8, 0);
public var mColliderRadius : float = 0.18;
public var mColliderHeight : float = 1.65;
public var mHightLight : Color = Color(0.4, 0.4 ,0.4, 0);

private var mModel : GameObject;
private var mSrcColor : Hashtable = new Hashtable();
private var mData : NpcRow = null;
private var mNameLab : iGUILabel = null;
private var mLayerSetted : boolean = false;

function Start () {
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_MOUSE_IN_MODEL), CallbackMouseIn);
	EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.MSG_MOUSE_OUT_MODEL), CallbackMouseOut);
	
	var col:CapsuleCollider = this.gameObject.AddComponent("CapsuleCollider") as CapsuleCollider;
	col.center = mColliderCenter;
	col.radius = mColliderRadius;
	col.height = mColliderHeight;
	
	mData = ResManager.LgtMgr.NpcTable[mNpcID];
	if(mData == null) return ;
	
	var trans : Transform = this.gameObject.transform.Find("Model");
	if(trans != null) {
		mModel = trans.gameObject;
		
		//add animations
		var clips:AnimationClip[];
		if(mModel.animation.GetClipCount() == 0) { 
			if(mData.sex == sex_type.st_boy) {
				clips = Global.GetModelLoaderMgr().SyncLoadAnimation(CharacterFactory.ROLE_DIR + "male_action.anis.u3d");
			} else {
				clips = Global.GetModelLoaderMgr().SyncLoadAnimation(CharacterFactory.ROLE_DIR + "female_action.anis.u3d");
			}
			for (var clip:AnimationClip in clips)
			{
				mModel.animation.AddClip(clip,clip.name);
				
				if (clip.name.Equals("stand"))
				{
					mModel.animation.clip = clip;
				}
			}
		}
		
		mModel.animation.wrapMode = WrapMode.Loop;
		mModel.animation.Play();
	}
	
	EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.MSG_NOTIFY_NPC_ADD),this.gameObject);
}

function Update() {
	ShowName();
	if (false == mLayerSetted)
	{
		mLayerSetted = CommFunc.setGameObjectLayer(this.gameObject, EQSceneManager.getSingleton().HouseSceneObj);
	}
}

function Destroy() {
	var headup_root:iGUIRoot = UI.getUI().OpenUIRoot("PlayerHeadupRoot");
	if(headup_root && mNameLab) {
		headup_root.removeElement(mNameLab);
	}
	
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MSG_MOUSE_IN_MODEL), CallbackMouseIn);
	EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.MSG_MOUSE_OUT_MODEL), CallbackMouseOut);
}

//logic funciton 
function DoAnim(anim:String, mode:WrapMode) {
	if(!mModel || anim == "") return ;
	
	mModel.animation.wrapMode = mode;
	mModel.animation.Play(anim);
}

function ShowName() {
	if(!mNameLab) {
		var headup_root:iGUIRoot = UI.getUI().OpenUIRoot("PlayerHeadupRoot");
		mNameLab = headup_root.addElement("iGUILabel", Rect(0,0,100,20));
		mNameLab.style.alignment = TextAnchor.MiddleCenter;
		mNameLab.labelColor = Color(0,255,0);
		mNameLab.style.wordWrap  = false;
		mNameLab.style.fontSize = 15;
		mNameLab.style.fontStyle = FontStyle.Bold;
		UI.getUI().SetIgnoreMouseOver(mNameLab, true);
	} else {
		var c:Vector3 = Camera.main.WorldToScreenPoint(this.gameObject.transform.position + Vector3(0,1.8f,0));
		if(c.z > 0){
			var x = c.x - mNameLab.positionAndSize.width/2;
			if(x<2 && x>0) x=2;
			else if(x>-2 && x<0) x=-2;
			mNameLab.setX(x);
			var y = Camera.main.pixelHeight - c.y - mNameLab.positionAndSize.height;
			if(y<2 && y>0) y=2;
			else if(y>-2 && y<0) y=-2;
			mNameLab.setY(y);
			
			mNameLab.label.text = mData.name;
			var size : Vector2 = mNameLab.style.CalcSize(mNameLab.label);
			mNameLab.setWidth(size.x);
			mNameLab.setHeight(size.y);
			mNameLab.enabled = true;
		} else {
			mNameLab.enabled = false;
		}
	}
}

//callback
private function CallbackMouseIn(evt:GameEvent, obj:Object) {
	if (null == obj || null == this || null == this.gameObject || null == mModel) return;
	if ((obj as GameObject).GetInstanceID() != this.gameObject.GetInstanceID()) return ;
	
	for (var render : Renderer in mModel.GetComponentsInChildren(Renderer)) {
		var mat : Material = render.material;
		mSrcColor.Add(mat.GetInstanceID(), mat.color);
		mat.color += mHightLight;
	}
}

private function CallbackMouseOut(evt:GameEvent, obj:Object) {
	if (null == obj || null == this || null == this.gameObject || null == mModel) return;
	if ((obj as GameObject).GetInstanceID() != this.gameObject.GetInstanceID()) return ;
	
	for (var render : Renderer in mModel.GetComponentsInChildren(Renderer)) {
		var mat : Material = render.material;
		if (mSrcColor.Contains(mat.GetInstanceID())) {
			mat.color = mSrcColor[mat.GetInstanceID()];
		}
	}
	mSrcColor.Clear();
}

function GetNpcID() : int {
	return mNpcID;
}