%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created : 25 Jun 2012 by LinZhengJian <linzhj@35info.cn>

-module(produce_manual).

-include("records.hrl").
-include("tplt_def.hrl").
-include("packet_def.hrl").
-include("common_def.hrl").

-export([get/1]).

-spec get(integer())-> #produce_manual{}.
get(ProduceManualId)->
    convert(tplt:get_data(produce_manual_tplt, ProduceManualId)).

-spec convert(#produce_manual_tplt{})-> #produce_manual{}.
convert(#produce_manual_tplt{item_id=ItemId, experience=Experience,
		    produce_level=ProduceLevel, consume_diamond=Diamond, material_item=MaterialItems, 
		    finished_item=FinishedItem, success_rate=SuccessRate})->
   #produce_manual{item_id=ItemId, experience=Experience,
		   produce_level=ProduceLevel, consume_diamond=Diamond, 
		   material_item=util:eval(binary_to_list(MaterialItems) ++ "."), 
		   finished_item=util:eval(binary_to_list(FinishedItem) ++ "."), success_rate=SuccessRate}.

