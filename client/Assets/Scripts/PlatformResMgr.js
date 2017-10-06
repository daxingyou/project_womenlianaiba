#pragma strict
// 平台资源管理器
// 用于缓存平台的资源，如果缓存中有该用户的资源，此时不请求服务端从平台中获取数据,否则则请求服务端获取数据
// 回调函数格式为
//function HandlePlatFormUserInfo(pack:Hashtable)
//{
//  Hashtable的key为玩家的OpenId
//  value为player_basic_information的类型
//}

class PlatformResMgr
{
	private var Users : Hashtable = new Hashtable();
	private var Senders : Hashtable = new Hashtable();
	private var token : int = 0;
	private var ReqList : Hashtable = new Hashtable();
	private var CancelTokens : Array = new Array();
	
	function PlatformResMgr() 
	{
		NetHelper.RegistHandler(new notify_platform_info(), handle_notify_platform_info);
	}
	
	function IsExist(openId : String)
	{
		if(Users.ContainsKey(openId))
			return true;
		else
			return false;
	}
	
	function GetUserInfo(openId : String)
	{
		return Users[openId];
	}
	
	//获取平台的用户信息，如果本地没有用户数据，则请求服务端获取用户数据
	function GetUserInfo(handlerCallBack : Function, reqList:Array) : int
	{
		token = getToken();
		Senders.Add(token, handlerCallBack);
		ReqList.Add(token, reqList);
		var Data : ArrayList = new ArrayList();
		for(var i = 0; i < reqList.Count; i++)
		{
			var key : String = reqList[i] as String;
			
			if(!Users.ContainsKey(key))
			{
				Data.Add(key);
			}
		}
		
		if(Data.Count > 0)
			ReqMultiUserInfo(Data, token);
		else
			PostMessage(token);
		
		return token;
	}
	
	//通知服务端获取用户信息
	function ReqMultiUserInfo(info:ArrayList, token : int)
	{
		var packet:req_platform_info = new req_platform_info();
		packet.open_ids = info;
		packet.token = token;
		NetHelper.Send(packet);
	}
	
	//服务端放回的用户信息
	function handle_notify_platform_info(evt:GameEvent, pack:notify_platform_info)
	{
		var Infomations : ArrayList = pack.player_informations;
		if(Infomations.Count == 0)
		{
			handle_empty_data(Infomations, pack);
		}
		else
		{
			for(var i = 0; i < Infomations.Count; i++)
			{
				var info : player_basic_information = Infomations[i] as player_basic_information;
				if(!Users.ContainsKey(info.account))
				{
					Users.Add(info.account, info);
				}
			}
		}
	
		PostMessage(pack.token);
	}
	
	function handle_empty_data(Infomations : ArrayList, pack:notify_platform_info)
	{
		var arr : Array = ReqList[pack.token] as Array;
		for(var i = 0; i < arr.Count; i++)
		{
			var info : player_basic_information = new player_basic_information();
			info.account = arr[i] as String;
			if(!Users.ContainsKey(info.account))
			{
				Users.Add(info.account, info);
			}
		}	
	}
	
	function SetCancelToken(token : int) : void
	{
		if (false == Senders.ContainsKey(token))
			return;
		
		if (IsCancelToken(token))
			return;
		
		CancelTokens.Add(token);
	}
	
	function IsCancelToken(token : int) : boolean
	{
		for (var _tk : Object in CancelTokens)
		{
			var tk : int = Convert.ToInt32(_tk);
			if (token == tk)
				return true;
		}
		return false;
	}
	
	function PostMessage(index:int)
	{
		if (IsCancelToken(token))
		{
			CancelTokens.Remove(token);
		}
		else
		{
			var sender : Function = Senders[index] as Function;
			sender(CreateUserInfo(index));
		}
		Senders.Remove(index);
		ReqList.Remove(index);
	}
	
	//创建需要的用户信息
	//TODO:目前是信息返回后全部到缓存里面取一次，改进方法
	//如果用户请求的数据在缓存中有的话，可以先保存起来，到这边就不需要在重新取一次
	function CreateUserInfo(index : int)
	{
		var data : Hashtable = new Hashtable();
		var arr : Array = ReqList[index] as Array;
		for(var i = 0; i < arr.Count; i++)
		{
			var info : player_basic_information = Users[arr[i]] as player_basic_information;
			if(info != null)
				data.Add(info.account, info);
		}
		
		return data;
	}
	
	function getToken()
	{
		if(token >= 1000000)
		{
			token = 0;
			return token;
		}
		else
		{
			token += 1;
			return token;
		}
	}
}