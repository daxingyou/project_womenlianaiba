-module(trade_context).

-include("records.hrl").
-include("common_def.hrl").

-export([make_order/2]).

make_order_id()->
    guid:make(?st_order).

make_order(ShoppingList, GoodsMeta)->
    OrderId=make_order_id(),
    OrderItems = 
	lists:foldl(
	  fun({GoodsId, Number, Price}, Items)->
		  [#order_item{goods_id=GoodsId, number=Number, price=Price}|Items]
	  end, [], ShoppingList),
    #order{order_id=OrderId, items=OrderItems, status=?order_new, goods_meta=GoodsMeta}.


