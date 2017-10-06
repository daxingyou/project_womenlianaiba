%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2011, hongjx
%%% @doc
%%%   �Զ���hashģ��,  
%%% @end
%%% Created : 10 Feb 2011 by hongjx <hongjx@35info.cn>

-module(eq_frag_hash).

%% Fragmented Table Hashing callback functions
-export([
	 init_state/2,
	 add_frag/1,
	 del_frag/1,
	 key_to_frag_number/2,
	 match_spec_to_frag_numbers/2
	]).

%header_doc_include
%%-behaviour(mnesia_frag_hash).

%impl_doc_include
-record(hash_state,
	{n_fragments,
	 next_n_to_split,
	 n_doubles,
	 function}).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

init_state(_Tab, State) when State == undefined ->
    #hash_state{n_fragments     = 1,
		next_n_to_split = 1,
		n_doubles       = 0,
		function        = phash2}.

convert_old_state({hash_state, N, P, L}) ->
    #hash_state{n_fragments     = N,
		next_n_to_split = P,
		n_doubles       = L,
		function        = phash}.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

add_frag(#hash_state{next_n_to_split = SplitN, n_doubles = L, n_fragments = N} = State) ->
    P = SplitN + 1,
    NewN = N + 1,
    State2 = case power2(L) + 1 of
		 P2 when P2 == P ->
		     State#hash_state{n_fragments      = NewN,
				      n_doubles        = L + 1,
				      next_n_to_split = 1};
		 _ ->
		     State#hash_state{n_fragments     = NewN,
				      next_n_to_split = P}
	     end,
    {State2, [SplitN], [NewN]};
add_frag(OldState) ->
    State = convert_old_state(OldState),
    add_frag(State).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

del_frag(#hash_state{next_n_to_split = SplitN, n_doubles = L, n_fragments = N} = State) ->
    P = SplitN - 1,
    if
	P < 1 ->
	    L2 = L - 1,
	    MergeN = power2(L2),
	    State2 = State#hash_state{n_fragments     = N - 1,
				      next_n_to_split = MergeN,
				      n_doubles       = L2},
	    {State2, [N], [MergeN]};
	true ->
	    MergeN = P,
	    State2 = State#hash_state{n_fragments     = N - 1,
				      next_n_to_split = MergeN},
	    {State2, [N], [MergeN]}
	end;
del_frag(OldState) ->
    State = convert_old_state(OldState),
    del_frag(State).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
key_to_frag_number(State, Key) when is_atom(Key) ->
    key_to_frag_number(State, atom_to_list(Key));
key_to_frag_number(#hash_state{function = phash, next_n_to_split = SplitN, n_doubles = L}, Key) ->
    P = SplitN,
    A = erlang:phash(Key, power2(L)),
    if
	A < P ->
	    erlang:phash(Key, power2(L + 1));
	true ->
	    A
    end;
key_to_frag_number(#hash_state{function = phash2, next_n_to_split = SplitN, n_doubles = L}, Key) ->
    P = SplitN,
    A = erlang:phash2(Key, power2(L)) + 1,
    if
	A < P ->
	    erlang:phash2(Key, power2(L + 1)) + 1;
	true ->
	    A
    end;
key_to_frag_number(OldState, Key) ->
    State = convert_old_state(OldState),
    key_to_frag_number(State, Key).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

match_spec_to_frag_numbers(#hash_state{n_fragments = N} = State, MatchSpec) ->
    case MatchSpec of
	[{HeadPat, _, _}] when is_tuple(HeadPat), tuple_size(HeadPat) > 2 ->
	    KeyPat = element(2, HeadPat),
	    case has_var(KeyPat) of
		false ->
		    [key_to_frag_number(State, KeyPat)];
		true ->
		    lists:seq(1, N)
	    end;
	_ -> 
	    lists:seq(1, N)
    end;
match_spec_to_frag_numbers(OldState, MatchSpec) ->
    State = convert_old_state(OldState),
    match_spec_to_frag_numbers(State, MatchSpec).

power2(Y) ->
    1 bsl Y. % trunc(math:pow(2, Y)).

%impl_doc_include

has_var(Pat) ->
    mnesia:has_var(Pat).
