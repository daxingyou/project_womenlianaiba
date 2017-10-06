%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2011, LinZhengJian
%%% @doc
%%% 注册相关的业务逻辑
%%% @end
%%% Created : 23 Dec 2011 by LinZhengJian <linzhj@35info.cn>

-module(register).

-include("register.hrl").

-export([add_pair_info/1, add_pair_info/4, get_pair_info/1, get_pair_info/2, delete_pair_info/1]).

%% 通过QQ号进行配对
-spec(add_pair_info(term())->term()).
add_pair_info(PairInfo)->
    db:dirty_write(PairInfo).

-spec(add_pair_info(atom(), list(), list(), list())->term()).
add_pair_info(OpenID, BoyNumber, GirlNumber, Gender)->
    db:dirty_write(#pair_info{openid=OpenID, boy_number=BoyNumber, girl_number=GirlNumber, gender=Gender}).

-spec(get_pair_info(atom())->term()).
get_pair_info(OpenID)->
    PairInfo = db:dirty_read(pair_info, OpenID),
    to_pair_info_tuple(PairInfo).

-spec(get_pair_info(list(), list())->list()).
get_pair_info(BoyNumber, GirlNumber)->
    PairPattern = #pair_info{openid='_', boy_number=BoyNumber, girl_number=GirlNumber, gender='_'},
    PairInfoList = db:match_object(PairPattern),
    [to_pair_info_tuple(PairInfo) || PairInfo <- PairInfoList].

-spec(delete_pair_info(term())->term()).
delete_pair_info(PairInfo) when is_record(PairInfo, pair_info) ->
    db:change([{delete_object, PairInfo}]).

to_pair_info_tuple([#pair_info{openid=OpenId, boy_number=BoyNumber, girl_number=GirlNumber, gender=Gender}])->
    {OpenId, BoyNumber, GirlNumber, Gender};

to_pair_info_tuple(#pair_info{openid=OpenId, boy_number=BoyNumber, girl_number=GirlNumber, gender=Gender})->
    {OpenId, BoyNumber, GirlNumber, Gender};

to_pair_info_tuple([])->
    {};
to_pair_info_tuple(undefined) ->
    {};
to_pair_info_tuple(null) ->
    {}.
