/*--------------------------------------------------
摄像机(2012/5/25 modify by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast



class EQCamera extends MonoBehaviour
{
	private var mLookAt : Vector3;			// 镜头看点
	private var mPitch : float;				// 上下旋转
	private var mYaw : float;				// 左右旋转
	private var mDistance : float;			// 当前缩放距离
	private var mNextDistance : float;		// 即将缩放距离
	private var mPosOffset : Vector3;		// 相机位置偏移
	// 相机移动相关
	private var mNextLookAt : Vector3;
	private var mMoveDirection : Vector3;
	private var mMove : boolean;
	private var mZooming : boolean;
	// -1:none, 0:left, 1:right, 2:middle
	private var mMouseDownType : int = -1;
	// 0:旋转镜头, 1:平移镜头
	private var mMouseMoveType : int = 0;
	// 旋转镜头事件相关
	private var mStartRotateCamera : boolean = false;
	private var mStartRotatePos : Vector3;
	// 相机配置参数相关(可在属性面板由策划设置)
	public var FollowMe : boolean = true;										// 镜头跟随角色
	public var PitchMin : float = -5.0f;										// 上下旋转角度,最小角度
	public var PitchMax : float = 85.0f;										// 上下旋转角度,最大角度
	public var YawMin : float = -360.0f;										// 左右旋转角度,最小角度
	public var YawMax : float = 360.0f;											// 左右旋转角度,最大角度
	public var ZoomMin : float = 0.5f;											// 缩放尺度,最小尺度
	public var ZoomMax : float = 7.0f;											// 缩放尺度,最大尺度
	public var LookAtMin : Vector3 = Vector3(-50.0f, 0.0f, -50.0f);				// 镜头位置,最近位置
	public var LookAtMax : Vector3 = Vector3(50.0f, 0.0f, 50.0f);				// 镜头位置,最远位置
	public var MoveSpeed : float = 0.4f;										// 镜头移动速度
	public var RotateSpeed : float = 10.0f;										// 镜头旋转速度
	public var ZoomSpeed : float = 5.0f;										// 缩放速度
	public var ZoomStep : float = 0.8f;											// 缩放的增量
	public var OffsetHeight : float = 1.4f;										// 镜头的偏移高度(可以调整镜头焦点在角色的高度)
	public var RotateEventLength : float = 1.0f;								// 镜头旋转事件中的旋转便宜
	// 查看当前的相机参数(没其他作用,主要是为了让策划可以在编辑器实时看下当前的相关信息)
	public var CurrentPitch : float;
	public var CurrentYaw : float;
	public var CurrentZoom : float;
	public var CurrentLookAt : Vector3;
	//--------------------------------------------------
	private static var instance : EQCamera = null;
	public static function getInstance() : EQCamera
	{
		return instance;
	}
	function Awake()
	{
		instance = this;
		EventCenter.RegistHandler(GameEvent.MakeEvent(GameEventDef.START_REQ_ROTATE_CAMERA), handleStartRotateCamera);
	}
	//--------------------------------------------------
	public function setMouseMoveType(type : int) : void
	{
		mMouseMoveType = type;
	}
	//--------------------------------------------------
	public function getPosOffset() : Vector3
	{
		return mPosOffset;
	}
	public function getLookAt() : Vector3
	{
		return mLookAt;
	}
	public function getPitch() : float
	{
		return mPitch;
	}
	public function getYaw() : float
	{
		return mYaw;
	}
	public function getZoom() : float
	{
		return mDistance;
	}
	public function getMouseMoveType() : int
	{
		return mMouseMoveType;
	}
	//--------------------------------------------------
	// 设置照相机偏移
	public function setPosOffset(offset : Vector3) : void
	{
		transform.position += - mPosOffset + offset;
		mPosOffset = offset;
	}
	// 设置摄像机的远裁剪平面
	public function farClip(distance : float) : void
	{
		if (distance <= camera.nearClipPlane)
			throw Exception("EQCamera -> farClip(float) -> far clip [" + distance + "] <= near clip [" + camera.nearClipPlane + "].");
		
		camera.farClipPlane = distance;
	}
	// 设置摄像机的视角角度
	public function viewField(degree : float) : void
	{
		if (degree < 1.0f || degree > 179.0f)
			throw Exception("EQCamera -> viewField(float) -> degree [" + degree + "] is out of range[1.0f, 179.0f].");
		
		camera.fieldOfView = degree;
	}
	// 镜头看点
	public function lookAt(pos : Vector3) : void
	{
		mLookAt = pos;
		reCalculate();
	}
	//--------------------------------------------------
	// 上下旋转
	public function pitch(degree : float) : void
	{
		while (degree >= 360.0f)
		{
			degree -= 360.0f;
		}
		mPitch = degree;
		reCalculate();
	}
	//--------------------------------------------------
	// 左右旋转
	public function yaw(degree : float) : void
	{
		while (degree >= 360.0f)
		{
			degree -= 360.0f;
		}
		while (degree < 0 )
		{
			degree += 360.0f;
		}
		mYaw = degree;
		reCalculate();
	}
	//--------------------------------------------------
	// 镜头缩放
	public function zoom(distance : float) : void
	{
		if (distance <= 0)
		{
			distance = 1;
		}
		
		mDistance = distance;
		reCalculate();
	}
	//--------------------------------------------------
	// 缩小
	public function ZoomIn() : void
	{
		zoom(getZoom() - ZoomStep);
	}
	//--------------------------------------------------
	// 放大
	public function ZoomOut() : void
	{
		zoom(getZoom() + ZoomStep);
	}
	//--------------------------------------------------
	// 镜头平移
	public public function moveLookAt(screenDeltaX : float, screenDeltaY : float) : void
	{
		if (Mathf.Abs(screenDeltaX) > Mathf.Abs(screenDeltaY))
			screenDeltaY = 0;
		else
			screenDeltaX = 0;
		
		var deltax : float = 0;
		var deltaz : float = 0;
		
		var y : float = Mathf.Sin(CommFunc.DegreesToRadians(mPitch));
		var r_xy : float = Mathf.Cos(CommFunc.DegreesToRadians(mPitch));
		var x : float = -r_xy * Mathf.Sin(CommFunc.DegreesToRadians(mYaw));
		var z : float = -r_xy * Mathf.Cos(CommFunc.DegreesToRadians(mYaw));
		
		var MOVE_SPEED_FACTOR : float = 15;
		mLookAt.x += screenDeltaY * MoveSpeed * x / MOVE_SPEED_FACTOR;
		mLookAt.z += screenDeltaY * MoveSpeed * z / MOVE_SPEED_FACTOR;
		
		var RADIAN_90 : float = Mathf.PI / 2;
		x = -r_xy * Mathf.Sin(CommFunc.DegreesToRadians(mYaw) + RADIAN_90);
		z = -r_xy * Mathf.Cos(CommFunc.DegreesToRadians(mYaw) + RADIAN_90);
		
		mLookAt.x += screenDeltaX * MoveSpeed * x / MOVE_SPEED_FACTOR;
		mLookAt.z += screenDeltaX * MoveSpeed * z / MOVE_SPEED_FACTOR;
		
		reCalculate();
	}
	//--------------------------------------------------
	// 镜头平移
	public function move(deltaX : float, deltaY : float) : void
	{
		var speed : float = RotateSpeed;
		moveLookAt(deltaX * speed, deltaY * speed);
	}
	//--------------------------------------------------
	// Update is called once per frame
	public function Update () : void
	{
		var point : Vector3 = Input.mousePosition;
		
		// mouse operate
		mouseWheel(ZoomStep);
		mouseDown(point);
		mouseMove(mMouseDownType, RotateSpeed);
		mouseUp(point);
		
        // follow me
		if (FollowMe && EQSceneManager.getSingleton().getState() == SceneState.SS_NORMAL)
		{
			followMe();
		}
		
		// update
		updateLookAt(Time.deltaTime);
		firstPersonView();
		
		//----
		CurrentPitch = mPitch;
		CurrentYaw = mYaw;
		CurrentZoom = mDistance;
		CurrentLookAt = mLookAt;
		//----
	}
	//--------------------------------------------------
	// 鼠标滚动
	private function mouseWheel(zStep : float) : void
	{
		var zDelta : float = Input.GetAxis("Mouse ScrollWheel");
		if (zDelta > 0.0001 || zDelta < -0.0001)
		{
			// 鼠标在界面上(放在这里效率比较高)
			if (UI.getUI().IsMouseOverUI())
				return;
			
			if (zDelta > 0.0f)
			{
				linearZoom(getZoom() - zStep);
			}
			else
			{
				linearZoom(getZoom() + zStep);
			}
		}
	}
	//--------------------------------------------------
	// 鼠标按下
	private function mouseDown(point : Vector3) : void
	{
		var mouseDownType : int = -1;
		
		if (Input.GetMouseButtonDown(0))			// left mouse button
		{
			// 鼠标不在界面上
			if (false == UI.getUI().IsMouseOverUI())
			{
				mouseDownType = 0;
			}
		}
//		else if(Input.GetMouseButtonDown(1))	// right mouse button
//		{
//			// 家装模型下右键定位
//			if(EQSceneManager.getSingleton().getState() == SceneState.SS_DECORATE)
//			{
//				mouseDownType = 1;
//			}
//		}
//		else if(Input.GetMouseButtonDown(2))	// middle mouse button
//		{
//			mouseDownType = 2;
//		}
		
		if (-1 != mouseDownType)
		{
			mMouseDownType = mouseDownType;
		}
	}
	//--------------------------------------------------
	// 鼠标移动
	private function mouseMove(mouseDownType : int, rotateSpeed : float) : void
	{
		var deltaX : float = Input.GetAxis("Mouse X");
		var deltaY : float = Input.GetAxis("Mouse Y");
		
		switch(mouseDownType)
		{
		case 0:		// left mouse button
			if (0 == mMouseMoveType)	// 旋转镜头
			{
				var delta : float = 0.0f;
				if (Mathf.Abs(deltaX) > Mathf.Abs(deltaY))
				{
					delta = deltaX * rotateSpeed;
					yaw(getYaw() + delta);
				}
				else
				{
					delta = deltaY * rotateSpeed;
					pitch(getPitch() - delta);
				}
			}
			else						// 平移镜头
			{
				moveLookAt(deltaX * rotateSpeed, deltaY * rotateSpeed);
			}
			break;
//		case 1:		// right mouse button
//			break;
//		case 2:		// middle mouse button
//			moveLookAt(deltaX * rotateSpeed, deltaY * rotateSpeed);
//			break;
		}
	}
	//--------------------------------------------------
	// 鼠标弹起
	private function mouseUp(point : Vector3) : void
	{
		var mosueDownType : int = -2;	// 鼠标未弹起
		
		if (Input.GetMouseButtonUp(0))		// left mouse button
		{
			mosueDownType = -1;
		}
//		else if(Input.GetMouseButtonUp(1))	// right mouse button
//		{
//			// 家装模型下右键定位
//			if(EQSceneManager.getSingleton().getState() == SceneState.SS_DECORATE)
//			{
//	        	mosueDownType = -1;
//	        	var rtn = intersects(point);
//				if(rtn[0])
//					setNextLookAt(rtn[1]);
//			}
//		}
//    	else if(Input.GetMouseButtonUp(2))	// middle mouse button
//    	{
//        	mosueDownType = -1;
//		}
        
        if (-2 != mosueDownType)
        {
        	mMouseDownType = mosueDownType;
        }
	}
	//--------------------------------------------------
	// 镜头跟随角色
	private function followMe() : void
	{
		var mplayer : GameObject = ScenePlayerMgr.getMainPlayer();
		if (null == mplayer)
			return;
		
		lookAt(mplayer.transform.position);
	}
	//--------------------------------------------------
	// 更新
	private function updateLookAt(elapsedTime : float) : void
	{
		if (mZooming)
		{
			if (mNextDistance < mDistance)
			{
				mDistance = mDistance - elapsedTime * ZoomSpeed;
				if (mDistance <= mNextDistance)
				{
					mZooming = false;
				}
				else
				{
					reCalculate();
				}
			}
			else
			{
				mDistance = mDistance + elapsedTime * ZoomSpeed;
				if (mDistance >= mNextDistance)
				{
					mZooming = false;
				}
				else
				{
					reCalculate();
				}
			}
		}
		
		if (!mMove)
			return;
		
		var dis : float = Vector3.Distance(mLookAt, mNextLookAt);
		var moveSpeedFactor : float = dis / 500;
		moveSpeedFactor *= moveSpeedFactor;
		
		var MIN_FACTOR : float = 1.2;
		moveSpeedFactor = moveSpeedFactor < MIN_FACTOR ? MIN_FACTOR : moveSpeedFactor;
		
		var moveLen : float = MoveSpeed * elapsedTime * moveSpeedFactor;
		
		if (dis <= moveLen)
		{
			mLookAt = mNextLookAt;
			mMove = false;
		}
		else
		{
			mLookAt = mLookAt + mMoveDirection * elapsedTime * moveSpeedFactor;
		}
		
		reCalculate();
	}
	//--------------------------------------------------
	// 缩放镜头
	private function linearZoom(tardistance : float) : void
	{
		mNextDistance = tardistance;
		mZooming = true;
	}
	//--------------------------------------------------
	// 设置下一个镜头看点
//	private function setNextLookAt(lk : Vector3) : void
//	{
//		mNextLookAt = lk;
//		
//		var lookatmin : Vector3 = LookAtMin;
//		var lookatmax : Vector3 = LookAtMax;
//		mNextLookAt.x = CommFunc.limitFloatValue(lookatmin.x, lookatmax.x, mNextLookAt.x);
//		mNextLookAt.z = CommFunc.limitFloatValue(lookatmin.z, lookatmax.z, mNextLookAt.z);
//		
//		mMoveDirection = mNextLookAt - mLookAt;
//		mMoveDirection.Normalize();
//		mMoveDirection = mMoveDirection * MoveSpeed;
//		
//		mMove = true;
//	}
	//--------------------------------------------------
	// 重新计算
	private function reCalculate() : void
	{
		viewLimit();
		// 计算位置()
		var y : float = mDistance * Mathf.Sin(CommFunc.DegreesToRadians(mPitch));
		var r_xy : float = mDistance * Mathf.Cos(CommFunc.DegreesToRadians(mPitch));
		var x : float = -r_xy * Mathf.Sin(CommFunc.DegreesToRadians(mYaw));
		var z : float = -r_xy * Mathf.Cos(CommFunc.DegreesToRadians(mYaw));
		var vEyePos : Vector3 = mLookAt + Vector3(x, y, z);
		transform.position = vEyePos + Vector3(0, OffsetHeight, 0) + mPosOffset;
		transform.LookAt(mLookAt + Vector3(0, OffsetHeight, 0));
		// 旋转事件
		if (mStartRotateCamera)
		{
			var distance : float = Vector3.Distance(mStartRotatePos, Vector3(x, y, z));
			if (distance >= RotateEventLength)
			{
				EventCenter.PostEvent(GameEvent.MakeEvent(GameEventDef.REACH_ROTATE_LEN));
				EventCenter.UnregistHandler(GameEvent.MakeEvent(GameEventDef.START_REQ_ROTATE_CAMERA), handleStartRotateCamera);
				mStartRotateCamera = false;
			}
		}
	}
	//--------------------------------------------------
	// 限制相机视角,这里根据配置来控制
	private function viewLimit() : void
	{
		mPitch = CommFunc.limitFloatValue(PitchMin, PitchMax, mPitch);
		mYaw = CommFunc.limitFloatValue(YawMin, YawMax, mYaw);
		mDistance = CommFunc.limitFloatValue(ZoomMin, ZoomMax, mDistance);
		
		var lookatmin : Vector3 = LookAtMin;
		var lookatmax : Vector3 = LookAtMax;
		mLookAt.x = CommFunc.limitFloatValue(lookatmin.x, lookatmax.x, mLookAt.x);
		mLookAt.z = CommFunc.limitFloatValue(lookatmin.z, lookatmax.z, mLookAt.z);
	}
	//--------------------------------------------------
	// 获取鼠标产生的射线与平面的交叉点,return:[boolean, Vecotr3]
//	private function intersects(mouse : Vector3) : System.Object[]
//	{
//		var result : System.Object[] = new System.Object[2];
//		result[0] = false;
//		result[1] = Vector3.zero;
//		
//		var ray : Ray = Camera.main.ViewportPointToRay(Vector3(mouse.x/Screen.width, mouse.y/Screen.height, 0));
//		var plane : Plane = new Plane(Vector3.up, 0);
//		var dis : float = 0.0f;
//		var rtn : boolean = plane.Raycast(ray, dis);
//		
//		if( false == rtn)
//			return result;
//		
//		result[0] = true;
//		result[1] = ray.GetPoint(dis);
//		return result;
//	}
	//--------------------------------------------------
	// 处理第一人称视角
	private function firstPersonView() : void
	{
		UpDownStair.setMainPlayerVisible(mDistance <= ZoomMin);
	}
	//--------------------------------------------------
	// 开始旋转镜头事件
	private function handleStartRotateCamera(evt : GameEvent, obj : Object) : void
	{
		mStartRotateCamera = true;
		var y : float = mDistance * Mathf.Sin(CommFunc.DegreesToRadians(mPitch));
		var r_xy : float = mDistance * Mathf.Cos(CommFunc.DegreesToRadians(mPitch));
		var x : float = -r_xy * Mathf.Sin(CommFunc.DegreesToRadians(mYaw));
		var z : float = -r_xy * Mathf.Cos(CommFunc.DegreesToRadians(mYaw));
		mStartRotatePos = Vector3(x, y, z);
	}
	//--------------------------------------------------
}


