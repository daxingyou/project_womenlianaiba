%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2011, hongjx
%%% @doc
%%%  玩家配对表
%%% @end
%%% Created : 12 Nov 2011 by hongjx <hongjx@35info.cn>

-module(db_pair_player).

-export([get_sex/1,
	 get_house_id/1, add/4, create/4,
	 get_lover/1,
	 get/1
	 ]).


-include("packet_def.hrl").
-include("enum_def.hrl").
-include("register.hrl").

get(Account)->
    case db:dirty_read(pair_player, Account) of
	[] -> [];
	[R] -> R    
    end.	   


get_sex(Account) when is_atom(Account) ->
    case db:dirty_read(pair_player, Account) of
	[] -> ?st_boy; %% 默认为男生
	[#pair_player{sex=Sex}] -> Sex    
    end.	   

get_house_id(Account) when is_atom(Account) -> 
    case db:dirty_read(pair_player, Account) of
	[] -> 0; %% 默认为0
	[#pair_player{house_id=HouseID}] -> HouseID    
    end.	   
    
get_lover(Account) when is_atom(Account) ->
    case db:dirty_read(pair_player, Account) of
	[] -> ''; 
	[#pair_player{lover_account=Lover}] -> Lover    
    end.	   
    
create(HouseID, Account, Sex, LoverAccount)->
    #pair_player{house_id=HouseID, account=Account, sex=Sex, lover_account=LoverAccount}.

add(HouseID, Account, Sex, LoverAccount)->
    db:dirty_write(create(HouseID, Account, Sex, LoverAccount)).

   
%%%===================================================================
%%% 数据库
%%%===================================================================





