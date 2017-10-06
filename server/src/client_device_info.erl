%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%  �ͻ�����Ϣ�ռ�
%%% @end
%%% Created : 12 Mar 2012 by hongjx <hongjx@35info.cn>

-module(client_device_info).

-include("packet_def.hrl").

-export([db_insert/2]).
-export([db_select/1]).


db_insert(AccountStr, #client_device_info{
				    operate_system=OperateSystem, %% ����ϵͳ���� 
				    cpu=Cpu,                      %% ���������� 
				    cpu_count=CpuCount,           %% ���������� 
				    memory=Memory,               %% �ڴ��С 
				    graphics_card=GraphicsCard,	        %% �Կ����� 
				    graphics_card_memory=GraphicsCardMemory, 	%% �Կ��ڴ��С 
				    graphics_card_id=GraphicsCardID, 	        %% �Կ���ʶ�� 
				    graphics_card_verson=GraphicsCardVersion,   %% �Կ��汾 
				    graphics_card_vendor=GraphicsCardVendor,   %% �Կ����� 
				    graphics_card_vendor_id=GraphicsCardVendorID,    %% �Կ����̱�ʶ�� 
				    graphics_card_shader_level=GraphicsCardShaderLevel, 	%% �Կ���ɫ������ 
				    graphics_card_pixel_fillrate=GraphicsCardPixelFillrate, 	%% �Կ���������� 
				    support_shadow=SupportShadow,  		%% �Ƿ�֧��������Ӱ(1.֧��;0.��֧��) 
				    support_render_texture=SupportRenderTexture,  	%% �Ƿ�֧����Ⱦ����(1.֧��;0.��֧��) 
				    support_image_effect=SupportImageEffect, 	%% �Ƿ�֧��ͼ��Ч��(1.֧��;0.��֧��) 
				    device_name=DeviceName,  		%% �豸���� 
				    device_unique_identify=DeviceUniqueIdentify, %% �豸Ψһ��ʾ�� 
				    device_model=DeviceModel, 		%% �豸ģ�� 
				    browser=Browser			%% �����
				   }) when is_list(AccountStr) ->

    Record = {account, AccountStr, 
	      operate_system, OperateSystem, %% ����ϵͳ���� 
	      cpu, Cpu,                      %% ���������� 
	      cpu_count, CpuCount,           %% ���������� 
	      memory, Memory,               %% �ڴ��С 
	      graphics_card, GraphicsCard,	        %% �Կ����� 
	      graphics_card_memory, GraphicsCardMemory, 	%% �Կ��ڴ��С 
	      graphics_card_id, GraphicsCardID, 	        %% �Կ���ʶ�� 
	      graphics_card_verson, GraphicsCardVersion,   %% �Կ��汾 
	      graphics_card_vendor, GraphicsCardVendor,   %% �Կ����� 
	      graphics_card_vendor_id, GraphicsCardVendorID,    %% �Կ����̱�ʶ�� 
	      graphics_card_shader_level, GraphicsCardShaderLevel, 	%% �Կ���ɫ������ 
	      graphics_card_pixel_fillrate, GraphicsCardPixelFillrate, 	%% �Կ���������� 
	      support_shadow, SupportShadow,  		%% �Ƿ�֧��������Ӱ(1.֧��;0.��֧��) 
	      support_render_texture, SupportRenderTexture,  	%% �Ƿ�֧����Ⱦ����(1.֧��;0.��֧��) 
	      support_image_effect, SupportImageEffect, 	%% �Ƿ�֧��ͼ��Ч��(1.֧��;0.��֧��) 
	      device_name, DeviceName,  		%% �豸���� 
	      device_unique_identify, DeviceUniqueIdentify, %% �豸Ψһ��ʾ�� 
	      device_model, DeviceModel, 		%% �豸ģ�� 
	      browser, Browser			%% �����
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


