%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created : 25 Jun 2012 by LinZhengJian <linzhj@35info.cn>

-module(produce_level).
-export([get/1, get_horizontal/1, add_experience/2]).

-export([set_experience/3]).

-include("tplt_def.hrl").
-include("packet_def.hrl").

-spec get(integer())->#produce_level_tplt{}.
get(Level)->
    tplt:get_data(produce_level_tplt,Level).

-spec get_horizontal(integer())->integer().
get_horizontal(Level) when is_integer(Level)->
    case ?MODULE:get(Level) of
	#produce_level_tplt{horizontal=Horizontal}->
	    Horizontal;
	_ ->
	    0
    end.    
    
-spec add_experience({integer(), integer()}, integer())-> {integer(), integer()}.
add_experience({CurrentLevel, CurrentExperience}, Experience)->
    MaxLevel = common_def:get_val(max_produce_level),
    case CurrentLevel >= MaxLevel of
	true->
	    {CurrentLevel, CurrentExperience};
	false ->
	    TotalExperience = CurrentExperience + Experience,
	    NextLevel = CurrentLevel + 1,
	    NextHorizontal = ?MODULE:get_horizontal(NextLevel),
	    case TotalExperience >= NextHorizontal of
		true->
		    add_experience({NextLevel, NextHorizontal}, TotalExperience - NextHorizontal);
		false ->
		    {CurrentLevel, TotalExperience}
	    end
    end.

%% 设置合成的经验等级，目前只给测试用
set_experience(Account, Level, Experience)->
    [PlayerBasicData] = db:dirty_read(player_basic_data, Account),
    NewPlayerBasicData = PlayerBasicData#player_basic_data{produce_experience=Experience, produce_level=Level},
    db:dirty_write(NewPlayerBasicData).
