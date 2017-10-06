/*--------------------------------------------------
家具部件(2012/4/25 create by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast



class FurnitureComponent
{
	public static var FurniCompTable : Hashtable = new Hashtable();
	public var Comp : HouseSceneComponent = null;						// 家具部件
	public var InteractRow : FurniInteractRow = null;					// 家具互动信息
	public var AnimationRow : FurniAnimationRow = null;					// 家具动画信息
	private var mPosInteractInfo : Array = new Array();					// 家具位置交互信息
	
	
	
	//--------------------------------------------------
	// 播放骨骼动画
	public function playSkeletonAnimation(pos_index : int, use : boolean) : void
	{
		// 添加/移除粒子效果
		if (use)
		{
			FurnitureParticle.addFurnitureParticle(Comp.GameObj, AnimationRow.particle, AnimationRow.particle_pos);
		}
		else
		{
			FurnitureParticle.removeFurnitureParticle(Comp.GameObj);
		}
		
		// 没有骨骼动画
		if (0 == InteractRow.menu_info.Count)
			return;
		
		var offset : int = _getFrameOffset(pos_index, InteractRow.menu_info, use);
		var frame : int = AnimationRow.animation[offset];
		_setAnimationPos(3, frame);		// 4帧,由于从0开始算,所以要除以3
	}
	//--------------------------------------------------
	// 播放家具动画
	public function playAnimation(state : int) : void
	{
		if (0 == state)		// 0表示不不播放动画
		{
			FurnitureParticle.removeFurnitureParticle(Comp.GameObj);
			_stopAnimation();
			return;
		}
		if (AnimationRow.loop)	// 循环播放
		{
			_playAnimation(WrapMode.Loop);
		}
		else	// 只播放一次
		{
			_playAnimation(WrapMode.Once);
		}
		FurnitureParticle.addFurnitureParticle(Comp.GameObj, AnimationRow.particle, AnimationRow.particle_pos);
	}
	//--------------------------------------------------
	// 开/关灯
	public function turnOnOff(state : int) : void
	{
		if (4 != AnimationRow.type)	// 不是开关灯
			return;
		
		Comp.turn((0 == state) ? false : true);
	}
	//--------------------------------------------------
	// 获取播放的动画帧的偏移
	private function _getFrameOffset(pos_index : int, menu : Array, use : boolean) : int
	{
		var flag : int = 0;
		if (use)
		{
			flag = menu[0];
		}
		var flag_arr : Array = _calPosInteractInfo(pos_index, flag);
		var offset : int = 0;
		for (var i:int=0; i<flag_arr.Count; ++i)
		{
			var f : int = flag_arr[i];
			var m : int = menu[1];
			offset += f * Mathf.Pow(m + 1, i);
		}
		return offset;
	}
	//--------------------------------------------------
	// 计算家具位置交互信息,pos_index:从0开始
	private function _calPosInteractInfo(pos_index : int, flag : int) : Array
	{
		var count : int = mPosInteractInfo.Count;
		if (count <= pos_index)
		{
			for (var i:int=count; i<=pos_index; ++i)
			{
				mPosInteractInfo.Add(0);
			}
		}
		mPosInteractInfo[pos_index] = flag;
		return mPosInteractInfo;
	}
	//--------------------------------------------------
	// 设置动画位置
	private function _setAnimationPos(total_frame : int, frame : int) : void
	{
		if (null == Comp)
			return;
		
		Comp.AsynCtrl.addOrProcessEvent(new FurnitureCompSetAnimationPosEvent(total_frame, frame));
	}
	//--------------------------------------------------
	// 播放动画
	private function _playAnimation(mode : WrapMode) : void
	{
		if (null == Comp)
			return;
		
		Comp.AsynCtrl.addOrProcessEvent(new FurnitureCompPlayAnimationEvent(mode));
	}
	//--------------------------------------------------
	// 停止动画
	private function _stopAnimation() : void
	{
		if (null == Comp)
			return;
		
		Comp.AsynCtrl.addOrProcessEvent(new FurnitureCompStopAnimationEvent());
	}
	//--------------------------------------------------
	// 设置家具动画位置,frame:从1开始
	public static function setFurniAniPos(furni_obj : GameObject, total_frame : int, frame : int) : void
	{
		if (null==furni_obj || null==furni_obj.animation || null==furni_obj.animation.clip)
			return;
		
		var name : String = furni_obj.animation.clip.name;
		var length : float = furni_obj.animation[name].length;
		var pos : float = (frame * length) / total_frame;
		Model.setAnimationPos(furni_obj.animation, name, pos);
	}
	//--------------------------------------------------
	// 播放家具动画
	public static function playFurniAni(furni_obj : GameObject, mode : WrapMode) : void
	{
		if (null==furni_obj || null==furni_obj.animation || null==furni_obj.animation.clip)
			return;
		
		furni_obj.animation.wrapMode = mode;
		furni_obj.animation[furni_obj.animation.clip.name].speed = 1.0f;
		furni_obj.animation.Play();
	}
	//--------------------------------------------------
	// 停止家具动画
	public static function stopFurniAni(furni_obj : GameObject) : void
	{
		setFurniAniPos(furni_obj, 1, 0);	// 定在第一帧
	}
	//--------------------------------------------------
	// 获取家具部件
	public static function getFurnitureComp(comp : HouseSceneComponent) : FurnitureComponent
	{
		var fc : FurnitureComponent = null;
		if (FurniCompTable.ContainsKey(comp.InstId))
		{
			fc = FurniCompTable[comp.InstId];
			fc.Comp = comp;
			return FurniCompTable[comp.InstId];
		}
		fc = new FurnitureComponent();
		fc.Comp = comp;
		FurniCompTable.Add(comp.InstId, fc);
		return fc;
	}
	//--------------------------------------------------
	// 开始使用家具
	public static function startUseFurniture(comp : HouseSceneComponent, pos : int, row : FurniInteractRow) : void
	{
		var fc : FurnitureComponent = getFurnitureComp(comp);
		fc.InteractRow = row;
		fc.AnimationRow = FurnitureDataHandler.getFurniAnimationRow(row.furni_ani);
		fc.playSkeletonAnimation(pos, true);
	}
	//--------------------------------------------------
	// 停止使用家具
	public static function stopUseFurniture(comp : HouseSceneComponent, pos : int) : void
	{
		var fc : FurnitureComponent = getFurnitureComp(comp);
		fc.playSkeletonAnimation(pos, false);
	}
	//--------------------------------------------------
	// 改变家具状态
	public static function changeFurnitureState(comp : HouseSceneComponent, row : FurniInteractRow, state : int) : void
	{
		var fc : FurnitureComponent = getFurnitureComp(comp);
		fc.InteractRow = row;
		fc.AnimationRow = FurnitureDataHandler.getFurniAnimationRow(row.furni_ani);
		fc.playAnimation(state);
		fc.turnOnOff(state);
		// 保存状态
		var fur : house_furniture = EQGameSceneMgr.getSingleton().getHouse().getFurnitureByInstanceID(comp.InstId);
		if (fur)
		{
			fur.status = state;
		}
	}
	//--------------------------------------------------
}


