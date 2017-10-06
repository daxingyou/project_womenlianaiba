%%%-------------------------------------------------------------------
%%% @author linyibin <linyb@35info.cn>
%%% @copyright (C) 2013, linyibin
%%% @doc
%%% ʳ��ϵͳ
%%% @end
%%% Created : 21 Jun 2013 by linyibin <linyb@35info.cn>
%%%-------------------------------------------------------------------
-module(player_food).

-record(player_food, {account,              %% ����ʺ�
		      unlocks=[],           %% ��������ʳ��
		      upgrades=[],          %% ����ʳ��
		      stocks=[],            %% ʳ����
		      produce_area=[],      %% ��������
		      products=[]           %% ��Ʒ
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
%% @��ȡ���ݿ�����
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
%% @��ȡ�ʺ���Ϣ
%% @end
%%--------------------------------------------------------------------
get_account(PlayerFood) ->
    PlayerFood#player_food.account.

%%--------------------------------------------------------------------
%% @doc
%% @��ȡ��������ʳ��
%% @end
%%--------------------------------------------------------------------
get_unlocks(PlayerFood) ->
    PlayerFood#player_food.unlocks.

%%--------------------------------------------------------------------
%% @doc
%% @���ý�������ʳ��
%% @end
%%--------------------------------------------------------------------
set_unlocks(PlayerFood, Unlocks) ->
    PlayerFood#player_food{unlocks=Unlocks}.

%%--------------------------------------------------------------------
%% @doc
%% @��ȡ������Ϣ
%% @end
%%--------------------------------------------------------------------
get_upgrades(PlayerFood) ->
    PlayerFood#player_food.upgrades.

%%--------------------------------------------------------------------
%% @doc
%% @����������Ϣ
%% @end
%%--------------------------------------------------------------------
set_upgrades(PlayerFood, Upgrades) ->
    PlayerFood#player_food{upgrades=Upgrades}.

%%--------------------------------------------------------------------
%% @doc
%% @��ȡ���
%% @end
%%--------------------------------------------------------------------
get_stocks(PlayerFood) ->
    PlayerFood#player_food.stocks.

%%--------------------------------------------------------------------
%% @doc
%% @���ÿ��
%% @end
%%--------------------------------------------------------------------
set_stocks(PlayerFood, Stocks) ->
    PlayerFood#player_food{stocks=Stocks}.

%%--------------------------------------------------------------------
%% @doc
%% @��ȡ��������
%% @end
%%--------------------------------------------------------------------
get_produce_area(PlayerFood) ->
    PlayerFood#player_food.produce_area.

%%--------------------------------------------------------------------
%% @doc
%% @��ȡ��������
%% @end
%%--------------------------------------------------------------------
set_produce_area(PlayerFood, ProduceArea) ->
    PlayerFood#player_food{produce_area=ProduceArea}.

%%--------------------------------------------------------------------
%% @doc
%% @��ȡ��Ʒ
%% @end
%%--------------------------------------------------------------------
get_products(PlayerFood) ->
    PlayerFood#player_food.products.

%%--------------------------------------------------------------------
%% @doc
%% @���ò�Ʒ
%% @end
%%--------------------------------------------------------------------
set_products(PlayerFood, Products) ->
    PlayerFood#player_food{products=Products}.

%%%===================================================================
%%% Internal functions
%%%===================================================================
