/*--------------------------------------------------
信息收集(2012/3/9 create by hezhr)
--------------------------------------------------*/
#pragma strict



//--------------------------------------------------
// 发送设备信息
public static function sendDeviceInfo(account : String) : void
{
	var packet : client_device_info = new client_device_info();
	packet.operate_system = SystemInfo.operatingSystem;							// 操作系统名称
	packet.cpu = SystemInfo.processorType;										// 处理器名称
	packet.cpu_count = SystemInfo.processorCount;								// 处理器数量
	packet.memory = SystemInfo.systemMemorySize;								// 内存大小
	packet.graphics_card = SystemInfo.graphicsDeviceName;						// 显卡名称
	packet.graphics_card_memory = SystemInfo.graphicsMemorySize;				// 显卡内存大小
	packet.graphics_card_id = SystemInfo.graphicsDeviceID;						// 显卡标识符
	packet.graphics_card_verson = SystemInfo.graphicsDeviceVersion;				// 显卡版本
	packet.graphics_card_vendor = SystemInfo.graphicsDeviceVendor;				// 显卡厂商
	packet.graphics_card_vendor_id = SystemInfo.graphicsDeviceVendorID;			// 显卡厂商标识符
	packet.graphics_card_shader_level = SystemInfo.graphicsShaderLevel;			// 显卡着色器级别
	packet.graphics_card_pixel_fillrate = SystemInfo.graphicsPixelFillrate;		// 显卡像素填充率
	packet.support_shadow = SystemInfo.supportsShadows ? 1 : 0;					// 是否支持内置阴影(1.支持;0.不支持)
	packet.support_render_texture = SystemInfo.supportsRenderTextures ? 1 : 0;	// 是否支持渲染纹理(1.支持;0.不支持)
	packet.support_image_effect = SystemInfo.supportsImageEffects ? 1 : 0;		// 是否支持图像效果(1.支持;0.不支持)
	packet.device_name = ""/*SystemInfo.deviceName*/;							// 设备名称
	packet.device_unique_identify = ""/*SystemInfo.deviceUniqueIdentifier*/;	// 设备唯一标示符
	packet.device_model = ""/*SystemInfo.deviceModel*/;							// 设备模型
	packet.browser = "";														// 浏览器
	NetHelper.Send(packet);
}
//--------------------------------------------------
// 发送异常信息
public static function sendExceptionInfo(account : String, exception : String) : void
{
	var browser : String = "";
	var cur_date : DateTime = SysTimer.getCurTime();
	var cur_date_str : String = cur_date.Year + "-" + cur_date.Month + "-" + cur_date.Day + "-" + 
								cur_date.Hour + "-" + cur_date.Minute + "-" + cur_date.Second;
	
	var error_msg : String = "{" +
								"{date: \"" + cur_date_str + "\"}," +								// 当前时间
								"{account: \"" + account + "\"}," +									// 玩家账号
								"{operate_system: \"" + SystemInfo.operatingSystem + "\"}," +		// 操作系统名称
								"{cup: \"" + SystemInfo.processorType + "\"}," +					// 处理器名称
								"{memory: \"" + SystemInfo.systemMemorySize + "\"}," +				// 内存大小
								"{graphics_card: \"" + SystemInfo.graphicsDeviceName + "\"}," +		// 显卡名称
								"{browser: \"" + browser + "\"}," +									// 浏览器
								"{exception: \"" + exception + "\"}" +								// 异常描述
							 "}";
	
//	ExternalFlatform.HttpPost("data=" + error_msg);
}
//--------------------------------------------------

