%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2011, linyibin
%%% @doc
%%%
%%% @end
%%% Created :  4 Mar 2011 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(house_data).

-include("house_data.hrl").
-include("player_buff.hrl").

%% API
-compile(export_all).



%%%===================================================================
%%% API
%%%===================================================================
get_house_id(#house_data{house_id=HouseId}) ->
    HouseId.

get_template_id(#house_data{template_id=TempId}) ->
    TempId.

set_template_id(HouseData, TempId) ->
    HouseData#house_data{template_id=TempId}.

get_furniture_permission(#house_data{furniture_permission=FurniPermission}) ->
    FurniPermission.

set_furniture_permission(HouseData, FurniPermission) ->
    HouseData#house_data{furniture_permission=FurniPermission}.

get_furniture_vec(#house_data{furniture_vec=FurniVec}) ->
    FurniVec.

set_furniture_vec(HouseData, FurniVec) ->
    HouseData#house_data{furniture_vec=FurniVec}.

get_room_tex_vec(#house_data{room_tex_vec=RoomTexVec}) ->
    RoomTexVec.

set_room_tex_vec(HouseData, RoomTexVec) ->
    HouseData#house_data{room_tex_vec=RoomTexVec}.

get_welcome_words(#house_data{welcome_words=WelWords}) ->
    WelWords.

set_welcome_words(HouseData, WelWords) ->
    HouseData#house_data{welcome_words=WelWords}.

get_house_permission(#house_data{house_permission=HousePermission}) ->
    HousePermission.

set_house_permission(HouseData, HousePermission) ->
    HouseData#house_data{house_permission=HousePermission}.

get_visit_log(#house_data{visit_logs=VisitLog}) ->
    VisitLog.

set_visit_log(HouseData, VisitLog) ->
    HouseData#house_data{visit_logs=VisitLog}.

get_buy_date(#house_data{buy_date=BuyDate}) ->
    BuyDate.

set_buy_date(HouseData, BuyDate) ->
    HouseData#house_data{buy_date=BuyDate}.

get_boy(#house_data{boy=Boy}) ->
    Boy.

get_girl(#house_data{girl=Girl}) ->
    Girl.

%% 获取豪华度
get_decoration(#house_data{decoration=D, boy=Boy, girl=Girl} ) ->
    D + get_buff_add_decoration(Boy) + get_buff_add_decoration(Girl).
 

get_exp(#house_data{exp=Exp}) ->
    Exp.

set_exp(HouseData, Exp) ->
    HouseData#house_data{exp=Exp}.

get_lover_diamond(#house_data{lover_diamond=LoverDiamond}) ->
    LoverDiamond.
%%%===================================================================
%%% Internal functions
%%%===================================================================


get_buff_add_decoration(Account) when is_atom(Account) ->
    Buff_add_decoration = 
    	[begin
    	     case player_buff:is_buff_expired(Account, BuffID) of
    		 true -> 0;
    		 false -> 
    		     Buff = player_buff:get_buff(Account, BuffID),
		     Decoration = player_buff:get_params(Buff),
		     util:binary_to_integer(Decoration)
	     end
    	 end || BuffID <- player_buff:get_Player_buff_id_By_type(Account, ?hb_increase_decoration)
    	],
    
    lists:foldl(fun(X, Sum) -> X + Sum end, 0, Buff_add_decoration).

  

