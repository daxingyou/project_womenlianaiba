%%% @author  linzhengjian
%%% @copyright (C) 2010, 3
%%% @doc
%%%  操作mongodb数据库
%%% @end
%%% Created : 24 Mar 2010 by  linzhengjian

-module(mongodb_services).

-behaviour(gen_server).
-export([init/1, handle_call/3, handle_cast/2, handle_info/2, terminate/2, code_change/3]).

-include_lib("../lib/mongodb/include/mongo_protocol.hrl").
-record(mongodb_services_state,{connection_pool}).

-export([start/0, start/1, stop/0, get_connections/0, get_connection/0, get_connection/1]).

-export([insert/3, update/4, delete/3, select/3, select/4, select_one/3, select_one/4, do_command/2]).

-export([string_to_objectid/1,objectid_to_string/1, get_min_objectid/1, get_min_objectid/0]).
-export([today/0, to_mongo_datetime/1]).
%% 操作默认数据库
start()->
    Host =
    case application:get_env(server, mongodb_host) of
	{ok, MongodbHOST} ->
	    MongodbHOST;
	undefined  ->
	    "127.0.0.1"
    end,
    Port = 
    case application:get_env(server, mongodb_port) of
	{ok, MongodbPort} ->
	    MongodbPort;
	undefined  ->
	    27017
    end,
    PoolSize =
	case application:get_env(server, mongodb_poolsize) of
	    {ok, MongodbPoolSize} ->
		MongodbPoolSize;
	undefined  ->
		10
    end,
    start({Host, Port, PoolSize}).

%% 操作指定的数据库
start({Host, Port, PoolSize})->
    gen_server:start_link({local, ?MODULE}, ?MODULE, [{Host, Port, PoolSize}],[]).

%% 停止服务
stop()->
    gen_server:call(?MODULE, stop),
    ok.

%% 获取一个数据库连接
get_connection()->
    Pool = get_connections(),
    get_connection(Pool).

get_connection(Pool)->
    {ok, Conn} = resource_pool:get(Pool),
    Conn.

%% 连接转换
convert_connection(Conn)->
    {lovehome, Conn}.

%% 插入
insert(Conn, CollectionName, BsonList)
  when is_list(BsonList)->
    F = fun(Bson, {IDBsonListAcc, IDListAcc})-> 
		case bson:lookup('_id', Bson) of
		    {Value}->
			{[Bson|IDBsonListAcc],[Value|IDListAcc]};
		    {}->
			ID = mongodb_app:gen_objectid(),
			{[bson:append(Bson, {'_id', ID})|IDBsonListAcc],[ID|IDListAcc]} 
		end
	end,
    {IDBsonList, IDList} = lists:foldl(F, {[],[]}, BsonList),    
    Result = mongo_query:write(convert_connection(Conn), 
			       #insert{collection = CollectionName, documents = IDBsonList}, {}),
    {null} = bson:lookup (err, Result),
    IDList;

insert(Conn, CollectionName, Bson)
  when is_tuple(Bson)->
    [ID|_] = insert(Conn, CollectionName, [Bson]),
    ID.

%% 更新
update(Conn, CollectionName, Selector, Updater) when is_tuple(Selector)->
    mongo_query:write(convert_connection(Conn), #update {collection = CollectionName, selector = Selector, updater = {'$set', Updater}}).

%% 删除
delete(Conn, CollectionName, Selector) when is_tuple(Selector)->
    Result = mongo_query:write(convert_connection(Conn), 
				#delete{collection = CollectionName, selector = Selector}, {}),
    {null} == bson:lookup (err, Result);
delete(Conn, CollectionName, ID)->
    delete(Conn, CollectionName, {'_id', ID}).

%% 查询
create_cursor(Conn, CollectionName, Selector)->
    mongo_query:find(convert_connection(Conn), #'query'{collection = CollectionName, selector = Selector}).

close_cursor(Cursor)->
    mongo_cursor:close(Cursor).

select(Conn, CollectionName, Selector)->
    Cursor = create_cursor(Conn, CollectionName, Selector),
    Return = mongo_cursor:rest(Cursor),
    close_cursor(Cursor),    
    Return.

select(Conn, CollectionName, Selector, CursorOptions)->
    Sort = bson:lookup(sort, CursorOptions),
    OrderBy = case Sort of 
		  {}->
		      {};
		  _->
		      {TSort}=Sort,
		      TSort
	      end,
    {ok, Return} =
	mongo:do(safe, master, Conn, lovehome, 
	      fun() ->
		      Cursor = mongo:find(CollectionName, {'$query', Selector, '$orderby', OrderBy}),
		      mongo_cursor:rest(Cursor)
	      end),
    %% Cursor = create_cursor(Conn, CollectionName, Selector),
    %% close_cursor(Cursor),    
    Return.

select_one(Conn, CollectionName, Selector)
  when is_tuple(Selector)->
    Return = select(Conn, CollectionName, Selector),
    case Return of 
	[]->{};
	[Item|_Other]->
	    Item
    end;

select_one(Conn, CollectionName, ID) ->
    Cursor = create_cursor(Conn, CollectionName, {'_id', ID}),
    Return = mongo_cursor:next(Cursor),
    close_cursor(Cursor),    
    Return.

select_one(Conn, CollectionName, Selector, CursorOptions)->
    Return = select(Conn, CollectionName, Selector, CursorOptions),    
    case Return of 
	[]->{};
	[Item|_Other]->
	    Item
    end.

do_command(Conn, Command)->
    mongo:do(safe, master, Conn, lovehome, fun()-> mongo:command(Command) end).

%% 获取数据库连接池
get_connections()->
    Pool = gen_server:call(?MODULE, get_connections),
    Pool.

%% 初始化当前进程
init([{Host, Port, PoolSize}])->
%%    application:start(mongodb),
    Pool = resource_pool:new(mongo:connect_factory({Host, Port}), PoolSize),
    {ok, #mongodb_services_state{connection_pool=Pool}}.

%% 获取进程池
handle_call(get_connections, _From, #mongodb_services_state{connection_pool=Pool}=State)->
    {reply, Pool, State};

%% 停止线程
handle_call(stop, _From, State)->
    {stop, normal, ok, State};

handle_call(_Request, _From, State)->
    {reply, ok, State}.

handle_cast(_Request, State)->
    {noreply, State}.

handle_info(_Info, State)->
    {noreply, State}.

terminate(_Reason, #mongodb_services_state{connection_pool=Pool})->
    resource_pool:close(Pool),
    %%true = resource_pool:is_close(Pool),
    application:stop(mongodb),
    ok.

code_change(_OldVsn, State, _Extra)->
    {ok, State}.

string_to_objectid(SObjectID)->
    {<<(list_to_integer(SObjectID,16)):96>>}.

objectid_to_string({<<BObjectID:96>>})->
    integer_to_list(BObjectID, 16).

get_min_objectid(string)->
    "000000000000000000000000".

get_min_objectid()->
    {<<0:96>>}.

today()->
    {Today, _Time} = calendar:local_time(),
    bson:secs_to_unixtime(datetime_to_timestamp({Today, {0,0,0}})).

datetime_to_timestamp({Date, Time}) ->
    Seconds1 = calendar:datetime_to_gregorian_seconds({Date, Time}),
    Seconds2 = calendar:datetime_to_gregorian_seconds({{1970,1,1}, {0,0,0}}),
    Seconds1 - Seconds2.

to_mongo_datetime(DateTime)->
    bson:secs_to_unixtime(datetime_to_timestamp(DateTime)).
