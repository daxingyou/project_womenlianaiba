%% Author: NoteBook
%% Created: 2009-10-26
%% Description: Add description to scene_db
-module(scene_db).

%%
%% Include files
%%
-include("table_info.hrl").
-include_lib("stdlib/include/qlc.hrl").
%%
%% Exported Functions
%%
-export([insert/1, delete/1, select/1, is_exist/1, select_all/0]).
-export([test/0]).

%%
%% 是否存在该场景
%%
-spec is_exist(atom()) -> atom().
is_exist(SceneName) ->
	Scene = select(SceneName),
	has_record(Scene).
	
%%
%% 是否有场景信息
%%
has_record(Record) ->
	case Record of
		[] -> false;
		_ -> true
	end.

%%
%% 获取场景信息
%%
-spec select(atom()) -> list().
select(SceneName) ->
    F = fun() ->
                db:read(scene, SceneName)
        end,
    db:transaction(F).

%%
%% 增加在线场景
%%
-spec insert(atom()) -> any().
insert(SceneName) ->
    F = fun() -> db:write({scene, SceneName, date()}) end,
    db:transaction(F).

select_all() ->
    F = fun() -> 
		Q = qlc:q([Scene#scene.scene_name || Scene <- db:table(scene)]), 
		qlc:e(Q)
	end,

    case db:transaction(F) of
	[] ->
	    [];
	Data ->
	    Data
    end.

%%
%% 删除在线场景 
%%
-spec delete(atom()) -> any().
delete(SceneName) ->
    F = fun() -> db:delete({scene, SceneName}) end,
    db:transaction(F).

test() ->
	insert(demo),
	SceneDemo = select(demo),
    data_helper:format("~p~n", [is_exist(demo)]),
	data_helper:format("~p~n", [SceneDemo]),
	delete(demo),
    data_helper:format("~p~n", [is_exist(demo)]).
