/*--------------------------------------------------
灯光(2012/5/25 modify by hezhr)
--------------------------------------------------*/
#pragma strict
#pragma downcast



class ZoneLight extends SceneObject
{
    private var mDayColor : Color;						// 白天灯光颜色
	private var mDayIntensity : float = 0.0f;			// 白天灯光强度
	private var mDayRange : float = 0.0f;				// 白天灯光范围(方向光无用到)
	private var mDayAngle : int = 0;					// 白天灯光角度(聚光有用到)
	private var mNightColor : Color;					// 晚上灯光颜色
	private var mNightIntensity : float = 0.0f;			// 晚上灯光强度
	private var mNightRange : float = 0.0f;				// 晚上灯光范围(方向光无用到)
	private var mNightAngle : int = 0;					// 晚上灯光角度(聚光有用到)
	//
	public var Type : ZoneLightType = ZoneLightType.ZLT_NONE;		// 灯光类型
	//--------------------------------------------------
	// 创建灯光
	private function createLight() : void
	{
		GameObj = new GameObject();
		GameObj.name = "Light_" + GameObj.GetHashCode().ToString("X");
		GameObj.AddComponent(Light);
		GameObj.light.renderMode = LightRenderMode.ForcePixel;
	}
	//--------------------------------------------------
	// 创建主动光
	public function createActiveLight(r : WebLightRow, parent : SceneObject) : void
	{
		createLight();
		
		Type = ZoneLightType.ZLT_ACTIVE;
		//
		SetPosition(r.Pos);
		SetEulerAngles(r.Dir);
		
		switch(r.Type)
		{
		case 0:
			GameObj.light.type = LightType.Point;
			break;
		case 1:
			GameObj.light.type = LightType.Directional;
			break;
		case 2:
			GameObj.light.type = LightType.Spot;
			break;
		}

		GameObj.light.color = r.Colour;
		GameObj.light.intensity = r.Intensity;
		GameObj.light.range = r.Range;
		GameObj.light.spotAngle = r.SpotAngle;
		
		// 同步主动光为白天黑夜
		turn(!AmbientMgr.getSingleton().isDayNight());
		// 这个函数放后面把,发现放前面,居然有时会不重新计算物件的受光情况.日			
		SetParent(parent);
	}
	//--------------------------------------------------
	// 创建穿透光
	public function createPassLight(plr : PassLightRes, parent : GameObject) : void
	{
		createLight();
		GameObj.light.type = LightType.Point;
		Type = ZoneLightType.ZLT_PASS;
		//
		CommFunc.setGameObjectLayer(GameObj, plr.floor, plr.room);
		setCullingMask(CommFunc.CalcLayerMask(GameObj.layer));
		SetPosition(plr.pos);
		// 设置灯光颜色,强度,范围参数
		mDayColor = Color(plr.dColor.x/255.0f, plr.dColor.y/255.0f, plr.dColor.z/255.0f, 1.0f);
		mDayIntensity = plr.dInte;
		mDayRange = plr.dRange;
		mNightColor = Color(plr.nColor.x/255.0f, plr.nColor.y/255.0f, plr.nColor.z/255.0f, 1.0f);
		mNightIntensity = plr.nInte;
		mNightRange = plr.nRange;
		// 处理白天黑夜的颜色
		changeDayNight(AmbientMgr.getSingleton().isDayNight());
		// 这个函数放后面把,发现放前面,居然有时会不重新计算物件的受光情况.日	
		CommFunc.setParent(parent, GameObj);
		// 在编辑器模式下挂接脚本,方便策划编辑灯光
		if (RuntimePlatform.WindowsEditor == Application.platform)
		{
			var zlp : ZoneLightProperty = GameObj.AddComponent("ZoneLightProperty");
			zlp.initPassLight(plr, AmbientMgr.getSingleton().isDayNight());
		}
	}
	//--------------------------------------------------
	// 创建方向光
	public function createDirectLight(dlr : DirectLightRes, parent : GameObject) : void
	{
		createLight();
		GameObj.light.type = LightType.Directional;
		Type = ZoneLightType.ZLT_DIRECT;
		//
		CommFunc.setGameObjectLayer(GameObj, dlr.floor, dlr.room);
		setCullingMask(CommFunc.CalcLayerMask(GameObj.layer));
		SetPosition(dlr.pos);
		SetEulerAngles(dlr.dir);
		// 设置灯光颜色,强度参数
		mDayColor = Color(dlr.dColor.x/255.0f, dlr.dColor.y/255.0f, dlr.dColor.z/255.0f, 1.0f);
		mDayIntensity = dlr.dInte;
		mNightColor = Color(dlr.nColor.x/255.0f, dlr.nColor.y/255.0f, dlr.nColor.z/255.0f, 1.0f);
		mNightIntensity = dlr.nInte;
		// 处理白天黑夜的颜色
		changeDayNight(AmbientMgr.getSingleton().isDayNight());
		// 这个函数放后面把,发现放前面,居然有时会不重新计算物件的受光情况.日	
		CommFunc.setParent(parent, GameObj);
		// 在编辑器模式下挂接脚本,方便策划编辑灯光
		if (RuntimePlatform.WindowsEditor == Application.platform)
		{
			var zlp : ZoneLightProperty = GameObj.AddComponent("ZoneLightProperty");
			zlp.initDirectLight(dlr, AmbientMgr.getSingleton().isDayNight());
		}
	}
	//--------------------------------------------------
	// 创建聚光
	public function createSpotLight(slr : SpotLightRes, parent : GameObject) : void
	{
		createLight();
		GameObj.light.type = LightType.Directional;
		Type = ZoneLightType.ZLT_DIRECT;
		//
		CommFunc.setGameObjectLayer(GameObj, slr.floor, slr.room);
		setCullingMask(CommFunc.CalcLayerMask(GameObj.layer));
		SetPosition(slr.pos);
		SetEulerAngles(slr.dir);
		// 设置灯光颜色,强度参数
		mDayColor = Color(slr.dColor.x/255.0f, slr.dColor.y/255.0f, slr.dColor.z/255.0f, 1.0f);
		mDayIntensity = slr.dInte;
		mDayRange = slr.dRange;
		mDayAngle = slr.dAngle;
		mNightColor = Color(slr.nColor.x/255.0f, slr.nColor.y/255.0f, slr.nColor.z/255.0f, 1.0f);
		mNightIntensity = slr.nInte;
		mNightRange = slr.nRange;
		mNightAngle = slr.nAngle;
		// 处理白天黑夜的颜色
		changeDayNight(AmbientMgr.getSingleton().isDayNight());
		// 这个函数放后面把,发现放前面,居然有时会不重新计算物件的受光情况.日	
		CommFunc.setParent(parent, GameObj);
		// 在编辑器模式下挂接脚本,方便策划编辑灯光
		if (RuntimePlatform.WindowsEditor == Application.platform)
		{
			var zlp : ZoneLightProperty = GameObj.AddComponent("ZoneLightProperty");
			zlp.initSpotLight(slr, AmbientMgr.getSingleton().isDayNight());
		}
	}
	//--------------------------------------------------
	// 切换昼夜
	public function changeDayNight(day : boolean) : void
	{
		GameObj.light.color = day ? mDayColor : mNightColor;
		GameObj.light.intensity = day ? mDayIntensity : mNightIntensity;
		GameObj.light.range = day ? mDayRange : mNightRange;
		GameObj.light.spotAngle = day ? mDayAngle : mNightAngle;
	}
	//--------------------------------------------------
	// 过渡昼夜
	public function smoothDayNight(day : boolean, per : float) : void
	{
		GameObj.light.color = day ? mDayColor-per*(mDayColor-mNightColor) : mNightColor+per*(mDayColor-mNightColor);
		GameObj.light.intensity = day ? mDayIntensity-per*(mDayIntensity-mNightIntensity) : mNightIntensity+per*(mDayIntensity-mNightIntensity);
		GameObj.light.range = day ? mDayRange-per*(mDayRange-mNightRange) : mNightRange+per*(mDayRange-mNightRange);
		GameObj.light.spotAngle = day ? mDayAngle-per*(mDayAngle-mNightAngle) : mNightRange+per*(mDayAngle-mNightAngle);
	}
	//--------------------------------------------------
	// 开/关灯
	public function turn(on : boolean) : void
	{
		GameObj.light.enabled = on;
	}
	//--------------------------------------------------
	// 灯光是否打开
	public function isOn() : boolean
	{
		return GameObj.light.enabled;
	}
	//--------------------------------------------------
	// 设置灯光的消隐遮罩
	public function setCullingMask(mask : int) : void
	{
	    GameObj.light.cullingMask = mask;
	}
	//--------------------------------------------------
}


