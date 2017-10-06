%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2013, linyibin
%%% @doc
%%% 食物系统
%%% @end
%%% Created : 21 Jun 2013 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(player_food).

-record(player_food, {account,              %% 玩家帐号
		      unlocks=[],           %% 解锁过的食物
		      upgrades=[],          %% 升级食物
		      stocks=[],            %% 食物库存
		      produce_area=[],      %% 制造区域
		      products=[]           %% 产品
		     }).

%% API
-export([start/1, settlement/1, get/1]).
-export([get_account/1]).
-export([get_unlocks/1, set_unlocks/2]).
-export([get_upgrades/1, set_upgrades/2]).
-export([get_stocks/1, set_stocks/2]).
-export([get_produce_area/1, set_produce_area/2]).
-export([get_products/1, set_products/2]).

%%%===================================================================
%%% API
%%%===================================================================
start(Account) ->
    player_food_unlock:start(Account) ++
    player_food_produce:start(Account) ++
    player_food_stock:start(Account) ++
    player_food_product:start(Account) ++
    player_food_upgrade:start(Account).

settlement(Account) ->
    player_food_product:settlement(Account),
    player_food_stock:settlement(Account),
    player_food_sale:sale(Account),
    player_food_sale:interval_sale(Account).

%%--------------------------------------------------------------------
%% @doc
%% @获取数据库内容
%% @end
%%--------------------------------------------------------------------
get(Account) ->
    case db:read(player_food, Account) of
	[] ->
	    #player_food{account=Account, 
			 unlocks=[], 
			 upgrades=[], 
			 stocks=[], 
			 produce_area=[], 
			 products=[]};
	[PlayerFood] ->
	    PlayerFood
    end.

%%--------------------------------------------------------------------
%% @doc
%% @获取帐号信息
%% @end
%%--------------------------------------------------------------------
get_account(PlayerFood) ->
    PlayerFood#player_food.account.

%%--------------------------------------------------------------------
%% @doc
%% @获取解锁过的食物
%% @end
%%--------------------------------------------------------------------
get_unlocks(PlayerFood) ->
    PlayerFood#player_food.unlocks.

%%--------------------------------------------------------------------
%% @doc
%% @设置解锁过的食物
%% @end
%%--------------------------------------------------------------------
set_unlocks(PlayerFood, Unlocks) ->
    PlayerFood#player_food{unlocks=Unlocks}.

%%--------------------------------------------------------------------
%% @doc
%% @获取升级信息
%% @end
%%--------------------------------------------------------------------
get_upgrades(PlayerFood) ->
    PlayerFood#player_food.upgrades.

%%--------------------------------------------------------------------
%% @doc
%% @设置升级信息
%% @end
%%--------------------------------------------------------------------
set_upgrades(PlayerFood, Upgrades) ->
    PlayerFood#player_food{upgrades=Upgrades}.

%%--------------------------------------------------------------------
%% @doc
%% @获取库存
%% @end
%%--------------------------------------------------------------------
get_stocks(PlayerFood) ->
    PlayerFood#player_food.stocks.

%%--------------------------------------------------------------------
%% @doc
%% @设置库存
%% @end
%%--------------------------------------------------------------------
set_stocks(PlayerFood, Stocks) ->
    PlayerFood#player_food{stocks=Stocks}.

%%--------------------------------------------------------------------
%% @doc
%% @获取制作区域
%% @end
%%--------------------------------------------------------------------
get_produce_area(PlayerFood) ->
    PlayerFood#player_food.produce_area.

%%--------------------------------------------------------------------
%% @doc
%% @获取制作区域
%% @end
%%--------------------------------------------------------------------
set_produce_area(PlayerFood, ProduceArea) ->
    PlayerFood#player_food{produce_area=ProduceArea}.

%%--------------------------------------------------------------------
%% @doc
%% @获取产品
%% @end
%%--------------------------------------------------------------------
get_products(PlayerFood) ->
    PlayerFood#player_food.products.

%%--------------------------------------------------------------------
%% @doc
%% @设置产品
%% @end
%%--------------------------------------------------------------------
set_products(PlayerFood, Products) ->
    PlayerFood#player_food{products=Products}.

%%%===================================================================
%%% Internal functions
%%%===================================================================
