%%
%% Mnesia database API
%%
%% Author: Krzysztof Kliś <krzysztof.klis@gmail.com>
%%
%% This program is free software: you can redistribute it and/or modify
%% it under the terms of the GNU Lesser General Public License as published by
%% the Free Software Foundation, either version 3 of the License, or
%% (at your option) any later version.
%%
%% This program is distributed in the hope that it will be useful,
%% but WITHOUT ANY WARRANTY; without even the implied warranty of
%% MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
%% GNU Lesser General Public License for more details.
%%
%% You should have received a copy of the GNU Lesser General Public License
%% along with this program.  If not, see <http://www.gnu.org/licenses/>.
%%

-module(mnapi).

-compile({parse_transform,qlc}).

-export([
    start/0,
    stop/0,
    loop/0,
    spawn_create/4,
    spawn_drop/2,
    spawn_insert/3,
    spawn_update/4,
    spawn_delete/3,
    spawn_fetch_row/3,
    spawn_fetch_rows/5,
    spawn_fetch_all/4,
    spawn_size/2
        ]).

-define(TIMEOUT, 15000).

%%
%% Start the API module.
%%
start() ->
catch(tcerl:start()),
    mnesia:start(),
    mnesia:change_table_copy_type(schema, node(), disc_copies),
    % Select auxiliary tables
    Tabs = mnesia_lib:val({schema, tables}),
    F = fun(X) ->
                case re:run(atom_to_list(X), ".+_seq$") of
                    {match, _, _} ->
                        true;
                    _ -> false
                end
        end,
    L = [X || X <- Tabs, F(X)],
    % Create ram copies of the auxiliary tables
    F1 = fun(Tab) ->
                 case mnesia:transaction(fun() -> mnesia:dirty_read(Tab, cols) end) of
                     {atomic,[{_, cols, Cols}]} ->
                         TmpTab = list_to_atom(atom_to_list(Tab) ++ "_tmp"),
                         mnesia:create_table(TmpTab, [{attributes, [key,value]}, {ram_copies, [node()]}]),
                         mnesia:transaction(fun() -> mnesia:write({TmpTab, cols, Cols}) end);
                     _Other ->
                         skip
                 end
         end,
    lists:map(F1, L),
    register(mnapi, spawn(mnapi, loop, [])).

%%
%% Stop the API module.
%%
stop() ->
    F = fun(T) ->
                case catch mnesia_lib:val({T, tcbdb_port}) of
                    {'EXIT', _} ->
                        skip;
                    Port ->
                        tcbdbets:sync(Port)
                end
        end,
    Tabs = mnesia_lib:val({schema, tables}),
    lists:foreach(F, Tabs),
    mnapi ! quit.

%%
%% Main loop.
%%
loop() ->
    receive
        {Pid, create, Type, Tab, Cols} when is_pid(Pid), is_atom(Type), is_atom(Tab), is_list(Cols) ->
            spawn(mnapi, spawn_create, [Pid, Type, Tab, Cols]),
            loop();
        {Pid, drop, Tab} when is_pid(Pid), is_atom(Tab) ->
            spawn(mnapi, spawn_drop, [Pid, Tab]),
            loop();
        {Pid, insert, Tab, Data} when is_pid(Pid), is_atom(Tab), is_list(Data) ->
            spawn(mnapi, spawn_insert, [Pid, Tab, dict:from_list(Data)]),
            loop();
        {Pid, update, Tab, Index, Data} when is_pid(Pid), is_atom(Tab), is_list(Data) ->
            spawn(mnapi, spawn_update, [Pid, Tab, Index, dict:from_list(Data)]),
            loop();
        {Pid, delete, Tab, Index} when is_pid(Pid), is_atom(Tab) ->
            spawn(mnapi, spawn_delete, [Pid, Tab, Index]),
            loop();
        {Pid, fetch_row, Tab, Index} when is_pid(Pid), is_atom(Tab) ->
            spawn(mnapi, spawn_fetch_row, [Pid, Tab, Index]),
            loop();
        {Pid, fetch_rows, Tab, Data, Sort, Reverse} when is_pid(Pid), is_atom(Tab), is_list(Data), is_atom(Reverse) ->
            spawn(mnapi, spawn_fetch_rows, [Pid, Tab, dict:from_list(Data), Sort, Reverse]),
            loop();
        {Pid, fetch_all, Tab, Sort, Reverse} when is_pid(Pid), is_atom(Tab), is_atom(Reverse) ->
            spawn(mnapi, spawn_fetch_all, [Pid, Tab, Sort, Reverse]),
            loop();
        {Pid, size, Tab} when is_pid(Pid), is_atom(Tab) ->
            spawn(mnapi, spawn_size, [Pid, Tab]),
            loop();
        %%
        %% Hot swap running module code.
        %%
        reload ->
            mnapi:loop();
        %%
        %% Quit the loop.
        %%
        quit ->
            ok;
        %%
        %% Default behaviour for any other message.
        %%
        _ ->
            loop()
    end.

%%
%% Create new table in database
%%
spawn_create(Pid, Type, Tab, Cols) ->
    case Type of
        ram ->
            Res = mnesia:create_table(Tab, [{attributes, Cols}, {type, set}, {ram_copies, [node()]}]);
        disc ->
            Res = mnesia:create_table(Tab, [{attributes, Cols}, {type, set}, {disc_copies, [node()]}]);
        disc_only ->
            Res = mnesia:create_table(Tab, [{attributes, Cols}, {type, set}, {disc_only_copies, [node()]}]);
        tokyo ->
            Res = mnesia:create_table(Tab, [{attributes, Cols}, {type, {external, ordered_set, tcbdbtab}}, {external_copies, [node()]}]);
        _ ->
            Res = {error, wrong_type}
    end,
    case Res of
        {atomic, ok} ->
            SeqTab = list_to_atom(atom_to_list(Tab) ++ "_seq"),
            case Type of
                ram ->
                    ResSeq = mnesia:create_table(SeqTab, [{attributes, [key,value]}, {ram_copies, [node()]}]);
                disc ->
                    ResSeq = mnesia:create_table(SeqTab, [{attributes, [key,value]}, {disc_copies, [node()]}]);
                disc_only ->
                    ResSeq = mnesia:create_table(SeqTab, [{attributes, [key,value]}, {disc_only_copies, [node()]}]);
                tokyo ->
                    ResSeq = mnesia:create_table(SeqTab, [{attributes, [key,value]}, {type, {external, ordered_set, tcbdbtab}}, {external_copies, [node()]}]);
                _ ->
                    ResSeq = {error, wrong_type}
            end,
            case ResSeq of
                {atomic, ok} ->
                    TmpTab = list_to_atom(atom_to_list(Tab) ++ "_seq_tmp"),
                    ResTmp = mnesia:create_table(TmpTab, [{attributes, [key,value]}, {ram_copies, [node()]}]),
                    case ResTmp of
                        {atomic, ok} ->
                            F = fun() ->
                                        mnesia:write({SeqTab, seq, 0}),
                                        mnesia:write({SeqTab, cols, Cols}),
                                        mnesia:write({TmpTab, cols, Cols})
                                end,
                            Pid ! mnesia:transaction(F);
                        Other ->
                            Pid ! Other
                    end;
                Other ->
                    Pid ! Other
            end;
        Other ->
            Pid ! Other
    end.

%%
%% Drop table
%%
spawn_drop(Pid, Tab) ->
    mnesia:delete_table(list_to_atom(atom_to_list(Tab) ++ "_seq")),
    mnesia:delete_table(list_to_atom(atom_to_list(Tab) ++ "_seq_tmp")),
    Pid ! mnesia:delete_table(Tab).

%%
%% Insert new record to table Tab
%%
spawn_insert(Pid, Tab, Data) ->
    SeqTab = list_to_atom(atom_to_list(Tab) ++ "_seq"),
    % Read column order
    FOrd = fun() ->
                   mnesia:dirty_read({list_to_atom(atom_to_list(Tab) ++ "_seq_tmp"), cols})
           end,
    case mnesia:transaction(FOrd) of
        {atomic, [{_, cols, Order}]} ->
            % Arrange Data according Cols order
            FCol = fun(X, L) ->
                           case catch(dict:fetch(X, Data)) of
                               {'EXIT', _} ->
                                   [""|L];
                               N ->
                                   [N|L]
                           end
                   end,
            [H|T] = lists:foldr(FCol, [], Order),
            % Check for record index
            case H of
                [] ->
                    % Record index empty - generate index from sequencer
                    FSeq = fun() ->
                                   [{_, seq, OldSeq}] = mnesia:wread({SeqTab, seq}),
                                   NewSeq = OldSeq + 1,
                                   mnesia:write({SeqTab, seq, NewSeq}),
                                   NewSeq
                           end,
                    case catch mnesia:sync_transaction(FSeq) of
                        {atomic, Seq} ->
                            Id = integer_to_list(Seq);
                        Else ->
                            Id = "",
                            Pid ! Else,
                            exit(-1)
                    end,
                    Record = [Id|T];
                _ ->
                    Id = H,
                    Record = [H|T]
            end,
            case mnesia:transaction(fun() -> mnesia:write(list_to_tuple([Tab|Record])) end) of
                {atomic, ok} ->
                    Pid ! {index, Id};
                Other ->
                    Pid ! Other
            end;
        Other ->
            Pid ! Other
    end.

%%
%% Update record in table Tab
%%
spawn_update(Pid, Tab, Index, Data) ->
    % Read column order
    FOrd = fun() ->
                   mnesia:dirty_read({list_to_atom(atom_to_list(Tab) ++ "_seq_tmp"), cols})
           end,
    case mnesia:transaction(FOrd) of
        {atomic, [{_, cols, [H|T]}]} ->
            % Read current record value
            F = fun() ->
                        mnesia:read({Tab, Index})
                end,
            case mnesia:transaction(F) of
                {atomic, [Row]} ->
                    [_|Record] = tuple_to_list(Row),
                    D = dict:from_list(lists:zip([H|T], Record)),
                    % Add Index to Data
                    D1 = dict:store(Index, H, D),
                    % Merge old and new data
                    D2 = dict:merge(fun(_K, _V1, V2) -> V2 end, D1, Data),
                    % Insert updated record
                    spawn_insert(Pid, Tab, D2);
                Other ->
                    Pid ! Other
            end;
        Other ->
            Pid ! Other
    end.

%%
%% Delete record from table Tab
%%
spawn_delete(Pid, Tab, Index) ->
    F = fun() ->
                mnesia:delete({Tab, Index})
        end,
    Pid ! mnesia:transaction(F).

%%
%% Get single record from table Tab
%%
spawn_fetch_row(Pid, Tab, Index) ->
    % Read column order
    FOrd = fun() ->
                   mnesia:dirty_read({list_to_atom(atom_to_list(Tab) ++ "_seq_tmp"), cols})
           end,
    case mnesia:transaction(FOrd) of
        {atomic, [{_, cols, Order}]} ->
            F = fun() ->
                        mnesia:read({Tab, Index})
                end,
            case mnesia:transaction(F) of
                {atomic, [Row]} ->
                    Pid ! {atomic, list_to_tuple([order|Order]), Row};
                Other ->
                    Pid ! Other
            end;
        Other ->
            Pid ! Other
    end.

%%
%% Get a list of records from table Tab matching Data
%%
spawn_fetch_rows(Pid, Tab, Data, Sort, Reverse) ->
    % Read column order
    FOrd = fun() ->
                   mnesia:dirty_read({list_to_atom(atom_to_list(Tab) ++ "_seq_tmp"), cols})
           end,
    case mnesia:transaction(FOrd) of
        {atomic, [{_, cols, Order}]} ->
            % Arrange Data according Cols order
            FCol = fun(X, L) ->
                           case catch(dict:fetch(X, Data)) of
                               {'EXIT', _} ->
                                   [""|L];
                               N ->
                                   [N|L]
                           end
                   end,
            L = lists:foldr(FCol, [], Order),
            % Pattern to match all records against
            Pat = list_to_tuple([Tab|L]),
            F = fun() ->
                        qlc:eval(qlc:q([ X || X <- mnesia:table(Tab), tcompare(X,Pat)]))
                end,
            case mnesia:transaction(F) of
                {atomic, Rows} ->
                    case Sort of
                        [] ->
                            Rows1 = Rows;
                        Field ->
                            % Sort Rows according to field
                            case elemsearch(Field, [Tab|Order]) of
                                {pos, N} ->
                                    Rows2 = lists:keysort(N, Rows),
                                    case Reverse of
                                        true ->
                                            Rows1 = lists:reverse(Rows2);
                                        false ->
                                            Rows1 = Rows
                                    end;
                                false ->
                                    Rows1 = Rows
                            end
                    end,
                    Pid ! {atomic, list_to_tuple([order|Order]), Rows1};
                Other ->
                    Pid ! Other
            end;
        Other ->
            Pid ! Other
    end.

%%
%% Get all records from table Tab
%%
spawn_fetch_all(Pid, Tab, Sort, Reverse) ->
    % Read column order
    FOrd = fun() ->
                   mnesia:dirty_read({list_to_atom(atom_to_list(Tab) ++ "_seq_tmp"), cols})
           end,
    case mnesia:transaction(FOrd) of
        {atomic, [{_, cols, Order}]} ->
            F = fun() ->
                        qlc:eval(qlc:q([ X || X <- mnesia:table(Tab)]))
                end,
            case mnesia:transaction(F) of
                {atomic, Rows} ->
                    case Sort of
                        [] ->
                            Rows1 = Rows;
                        Field ->
                            % Sort Rows according to field
                            case elemsearch(Field, [Tab|Order]) of
                                {pos, N} ->
                                    Rows2 = lists:keysort(N, Rows),
                                    case Reverse of
                                        true ->
                                            Rows1 = lists:reverse(Rows2);
                                        false ->
                                            Rows1 = Rows
                                    end;
                                false ->
                                    Rows1 = Rows
                            end
                    end,
                    Pid ! {atomic, list_to_tuple([order|Order]), Rows1};
                Other ->
                    Pid ! Other
            end;
        Other ->
            Pid ! Other
    end.

%%
%% Get number of records in table Tab.
%%
spawn_size(Pid, Tab) ->
    N = mnesia:table_info(Tab, size),
    Pid ! {size, N}.

%%
%% Find position of element E on the list L
%%
elemsearch(E, L) ->
    elemsearch3(E, 1, L).

elemsearch3(E, N, [H|_T]) when E == H ->
    {pos, N};
elemsearch3(E, N, [_H|T]) ->
    elemsearch3(E, N + 1, T);
elemsearch3(_E, _N, []) ->
    false.

%%
%% Compare tuples Tup with pattern Pat. Returns true if tuple matches, otherwise returns false.
%%
tcompare(Tup, Pat) ->
    tcompare3(Tup, Pat, size(Pat)).

tcompare3(_Tup, _Pat, 0) ->
    true;
tcompare3(Tup, Pat, N) ->
    E = element(N, Tup),
    P = element(N, Pat),
    case P of
        [] ->
            tcompare3(Tup, Pat, N - 1);
        X ->
            case E == X of
                true ->
                    tcompare3(Tup, Pat, N - 1);
                false ->
                    false
            end
    end.
