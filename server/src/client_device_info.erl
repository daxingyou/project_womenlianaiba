%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%  客户端信息收集
%%% @end
%%% Created : 12 Mar 2012 by hongjx <hongjx@35info.cn>

-module(client_device_info).

-include("packet_def.hrl").

-export([db_insert/2]).
-export([db_select/1]).


db_insert(AccountStr, #client_device_info{
				    operate_system=OperateSystem, %% 操作系统名称 
				    cpu=Cpu,                      %% 处理器名称 
				    cpu_count=CpuCount,           %% 处理器数量 
				    memory=Memory,               %% 内存大小 
				    graphics_card=GraphicsCard,	        %% 显卡名称 
				    graphics_card_memory=GraphicsCardMemory, 	%% 显卡内存大小 
				    graphics_card_id=GraphicsCardID, 	        %% 显卡标识符 
				    graphics_card_verson=GraphicsCardVersion,   %% 显卡版本 
				    graphics_card_vendor=GraphicsCardVendor,   %% 显卡厂商 
				    graphics_card_vendor_id=GraphicsCardVendorID,    %% 显卡厂商标识符 
				    graphics_card_shader_level=GraphicsCardShaderLevel, 	%% 显卡着色器级别 
				    graphics_card_pixel_fillrate=GraphicsCardPixelFillrate, 	%% 显卡像素填充率 
				    support_shadow=SupportShadow,  		%% 是否支持内置阴影(1.支持;0.不支持) 
				    support_render_texture=SupportRenderTexture,  	%% 是否支持渲染纹理(1.支持;0.不支持) 
				    support_image_effect=SupportImageEffect, 	%% 是否支持图像效果(1.支持;0.不支持) 
				    device_name=DeviceName,  		%% 设备名称 
				    device_unique_identify=DeviceUniqueIdentify, %% 设备唯一标示符 
				    device_model=DeviceModel, 		%% 设备模型 
				    browser=Browser			%% 浏览器
				   }) when is_list(AccountStr) ->

    Record = {account, AccountStr, 
	      operate_system, OperateSystem, %% 操作系统名称 
	      cpu, Cpu,                      %% 处理器名称 
	      cpu_count, CpuCount,           %% 处理器数量 
	      memory, Memory,               %% 内存大小 
	      graphics_card, GraphicsCard,	        %% 显卡名称 
	      graphics_card_memory, GraphicsCardMemory, 	%% 显卡内存大小 
	      graphics_card_id, GraphicsCardID, 	        %% 显卡标识符 
	      graphics_card_verson, GraphicsCardVersion,   %% 显卡版本 
	      graphics_card_vendor, GraphicsCardVendor,   %% 显卡厂商 
	      graphics_card_vendor_id, GraphicsCardVendorID,    %% 显卡厂商标识符 
	      graphics_card_shader_level, GraphicsCardShaderLevel, 	%% 显卡着色器级别 
	      graphics_card_pixel_fillrate, GraphicsCardPixelFillrate, 	%% 显卡像素填充率 
	      support_shadow, SupportShadow,  		%% 是否支持内置阴影(1.支持;0.不支持) 
	      support_render_texture, SupportRenderTexture,  	%% 是否支持渲染纹理(1.支持;0.不支持) 
	      support_image_effect, SupportImageEffect, 	%% 是否支持图像效果(1.支持;0.不支持) 
	      device_name, DeviceName,  		%% 设备名称 
	      device_unique_identify, DeviceUniqueIdentify, %% 设备唯一标示符 
	      device_model, DeviceModel, 		%% 设备模型 
	      browser, Browser			%% 浏览器
	     },
    mongodb_services:insert(get_connection(), client_device_info, Record).


get_connection()->
    Conns = get(?MODULE),
    NConns = case Conns of 
    		 undefined->
    		     Conns1 = mongodb_services:get_connections(),
    		     put(?MODULE, Conns1),
    		     Conns1;
    		 _->
    		     Conns
    	     end,
    mongodb_services:get_connection(NConns).



db_select(Account) when is_list(Account) ->
    Options = {sort, {'_id', -1}},
    mongodb_services:select_one(get_connection(), 
				client_device_info, 
				{account, Account}, 
				Options).


