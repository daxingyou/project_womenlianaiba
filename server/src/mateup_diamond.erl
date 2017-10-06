%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created :  5 Dec 2012 by LinZhengJian <linzhj@35info.cn>

-module(mateup_diamond).

-include("tplt_def.hrl").

-export([get/1, get/2, has_enough_diamond/2]).

get(Level)->
    #mateup_diamond{diamond=Diamond} = tplt:get_data(mateup_diamond, Level),
    Diamond.

get(Level1, Level2)->
    erlang:abs(?MODULE:get(Level1) - ?MODULE:get(Level2)) + 100.

has_enough_diamond(Account1, Account2)->
    HouseData1 = db_house:select(db_pair_player:get_house_id(Account1)),
    HouseData2 = db_house:select(db_pair_player:get_house_id(Account2)),
    Level1 = house_level_exp:get_level(HouseData1),
    Level2 = house_level_exp:get_level(HouseData2),
    Diamond1 = house_diamond:get_lover_diamond(HouseData1),
    Diamond2 = house_diamond:get_lover_diamond(HouseData2),
    MateupDiamond = ?MODULE:get(Level1, Level2),
    MateupDiamond < (Diamond1 + Diamond2).

