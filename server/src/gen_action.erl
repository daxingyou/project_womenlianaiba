%%% @author  <hjx>
%%% @copyright (C) 2010, 
%%% @doc
%%%   ��Ҷ���
%%% @end
%%% Created :  1 Jun 2010 by  <hjx>

-module(gen_action).

-export([behaviour_info/1]).

%%%===================================================================
%%% API
%%%===================================================================
-spec behaviour_info(atom()) -> 'undefined' | [{atom(), arity()}].

behaviour_info(callbacks) ->
    [{do_start_action, 2},
     {do_stop_action, 2}     
    ];
behaviour_info(_Other) ->
    undefined. 
