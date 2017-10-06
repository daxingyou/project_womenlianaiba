-module(love_house).

-export([get_house_id/1, get_register/1, get_register/2, get_register/3, create_love_house/3, delete_register/1]).
-export([register/3]).

-export([add_register_invitation/2, 
	 delete_register_invitation/1,
	 find_register_inviting/1, 
	 find_register_invited/1,
	 find_invitation/2,
	 get_failure_invitation/1]).

-export([cancel_invitation/1,refuse_invitation/1]).

-export([add_pair_info/1, add_pair_info/4, get_pair_info/1, get_pair_info/2, delete_pair_info/1, mateup/3]).

register(Account, BoyNumber, GirlNumber)->
        rpc:call(config:get_database_server(), db_register, insert, [Account, BoyNumber, GirlNumber]).

get_register(Account)-> 
     rpc:call(config:get_database_server(), db_register, get_register_tuple, [Account]).

get_register(BoyNumber, GirlNumber, ExcludeAccount)->
    List = rpc:call(config:get_database_server(), db_register_queue, get_register_tuple, [BoyNumber, GirlNumber]),
    lists:delete({ExcludeAccount, BoyNumber, GirlNumber}, List).
get_register(BoyNumber, GirlNumber)->
     rpc:call(config:get_database_server(), db_register, get_register_tuple, [BoyNumber, GirlNumber]).

delete_register(Account)->
    rpc:call(config:get_database_server(), db_register, delete, [Account]).    

create_love_house(Boy, Girl, HouseName)->
    Ret = rpc:call(config:get_database_server(), player_init, init_love_house, [list_to_atom(Boy), list_to_atom(Girl), HouseName]),
    io:format("create love house:~p~n", [Ret]).

get_house_id(Account) when is_atom(Account) ->
    rpc:call(config:get_database_server(),db_pair_player, get_house_id, [Account]);
get_house_id(Account) when is_list(Account) ->
    rpc:call(config:get_database_server(),db_pair_player, get_house_id, [list_to_atom(Account)]).

find_register_inviting(Account)->
    rpc:call(config:get_database_server(), db_register, find_register_inviting, [Account]).

find_register_invited(Account)->
    rpc:call(config:get_database_server(), db_register, find_register_invited, [Account]).

add_register_invitation(Inviting, Invited)->
    rpc:call(config:get_database_server(), db_register, add_register_invitation, [Inviting, Invited]).

delete_register_invitation(ID)->
    rpc:call(config:get_database_server(), db_register, delete_register_invitation, [ID]).

find_invitation(Inviting, Invited)->
    rpc:call(config:get_database_server(), db_register, find_invitation, [Inviting, Invited]).

cancel_invitation(ID)->
    rpc:call(config:get_database_server(), register, cancel_invitation, [ID]).

refuse_invitation(ID)->
    rpc:call(config:get_database_server(), register, refuse_invitation, [list_to_integer(ID)]).
get_failure_invitation(Account)->
    io:format("Account:~p~n",[Account]),
    R = rpc:call(config:get_database_server(), register, get_failure_invitation, [Account]),
    io:format("R:~p~n",[R]),
    R.

%% 通过QQ号进行配对
add_pair_info(PairInfo)->
    rpc:call(config:get_database_server(), register, add_pair_info, [PairInfo]).

add_pair_info(OpenID, BoyNumber, GirlNumber, Gender)->
rpc:call(config:get_database_server(), register, add_pair_info, [OpenID, BoyNumber, GirlNumber, Gender]).

get_pair_info(OpenID)->
    rpc:call(config:get_database_server(), register, get_pair_info, [OpenID]).

get_pair_info(BoyNumber, GirlNumber)->
rpc:call(config:get_database_server(), register, get_pair_info, [BoyNumber, GirlNumber]).    

delete_pair_info(PairInfo) ->
    rpc:call(config:get_database_server(), register, delete_pair_info, [PairInfo]).

mateup(Boy, Girl, HouseName)->
    Ret = rpc:call(config:get_database_server(), player_init, init_pair_house, [list_to_atom(Boy), list_to_atom(Girl), HouseName]),
    Ret.
