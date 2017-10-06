%% Author: linyijie
%% Created: 2010-03-16
%% Description: 该模块是对house_data表的操作
-module(db_house).

%%
%% Include files
%%
-include("table_info.hrl").
-include("packet_def.hrl").
-include("house_data.hrl").
-include_lib("stdlib/include/qlc.hrl").
%%
%% Exported Functions
%%
-export([
	 delete/1, 
	 select/1, 
	 create_love_house/3]).

%% 获取指定玩家的数据
-spec select(integer()) -> tuple().
select(HouseID) when is_integer(HouseID) ->
    case db:dirty_read(house_data, HouseID) of
	[] -> [];
	[Data] -> Data
    end.

create_love_house(Boy, Girl, HouseData)->
    F = fun()->
		db:delete({register_queue, atom_to_list(Boy)}) ,
		db:delete({register_queue, atom_to_list(Girl)}) ,
		db:write(HouseData) 
	end,
    db:transaction(F).

%% 删除在线场景 
-spec delete(atom()) -> any().
delete(PlayerName) when is_atom(PlayerName) ->
    db:dirty_delete(house_data, PlayerName).

%% test() ->
%%     ok = write(#house_data{owner=lyj}),
%%     HouseData = #house_data{owner=lyj, instance_id = 1},
%%     ok = write(HouseData),
%%     HouseData = select(lyj),
%%     delete(lyj),
%%     [] = select(lyj).
