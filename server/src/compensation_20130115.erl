%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2013, hongjx
%%% @doc
%%%   Íæ¼Ò²¹³¥
%%% @end
%%% Created : 15 Jan 2013 by hongjx <hongjx@35info.cn>

-module(compensation_20130115).

-include("house_data.hrl").
-include("tplt_def.hrl").
-include("packet_def.hrl").


-export([run/0, notify/1]).

notify(Account) when is_atom(Account) ->
    case db:dirty_read(compensation_log, Account) of
	[] ->
	    ok;
	[{_Tab, _Player, Level}] ->
	    net_helper:send2client(Account, #notify_make_up_info{level=Level})	    
    end.


run() ->
    case os:getenv("template") of
	"yy" -> %% yy ²»Éý¼¶
	    ok;
	_ ->
	    Tab = house_data,
	    F = fun(R, Acc) ->			
			Level = house_level_exp:get_level(R),
			Items = get_add_items(Level),
			case Items of
			    [] ->
				ok;
			    _ ->
				{NewHouse, _} = house_pack:add_items(Items, R),
				do_write(NewHouse, Level)
			end,
			Acc
		end,

	    db:sync_dirty(fun() -> db:foldl(F, [], Tab) end),
	    ok
    end,
 
    {atomic, ok}.


do_write(#house_data{boy=Boy, girl=Girl}=NewHouse, Level) ->
    FWrite = fun() ->
		     case can_write(Boy, Girl) of
			 false ->			     
			     ok;
			 _ -> 
			     case Boy of
				 '' -> ok;
				 _ ->
				     mnesia:write({compensation_log, Boy, Level})
			     end,

			     case Girl of
				 '' -> ok;
				 _ ->
				     mnesia:write({compensation_log, Girl, Level})
			     end,

			     mnesia:write(NewHouse)
		     end
	     end,

    db:sync_dirty(FWrite).

can_write(Boy, '') ->
    case mnesia:read(compensation_log, Boy) of
	[_R] -> 
	    false;
	_ -> 
	    true
    end;
can_write('', Girl) ->
    case mnesia:read(compensation_log, Girl) of
	[_R] -> 
	    false;
	_ -> 
	    true
    end;
can_write(Boy, Girl) ->
    case mnesia:read(compensation_log, Boy) of
	[_R] -> false;
	_ -> 
	    case mnesia:read(compensation_log, Girl) of
		[_R] -> false;
		_ -> true
	    end
    end.



get_add_items(Level) when Level > 60 ->
    get_add_items(60);
get_add_items(Level) ->
    #make_up_tplt{items=SItems} = tplt:get_data(make_up_tplt, Level),
    Ret = util:eval(binary_to_list(SItems) ++ "."),
    %%io:format("items: ~p~n", [{Level, Ret}]),
    Ret.



