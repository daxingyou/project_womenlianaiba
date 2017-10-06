%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%   ��������
%%% @end
%%% Created : 20 Feb 2012 by hongjx <hongjx@35info.cn>

-module(db_update_house).

-export([update_lovers_house_template_id/2,
	 update_furnitures_20120421/0,
	 update_house_data_20120227/0,
	 update_furniture_height_20120606/0,
	 update_house_decoration_20120627/0
	]).


%%%===================================================================
%%% �������µķ���, ����Ĳ�����
%%%===================================================================
%% ����ʱҪ��������Ʒ(��������) 2012-02-20
%% get_drop_items_20120220() -> 
%%     [2100000, 2000000, 2000002].
%% ��ʱ�����ݽṹ

-record(house_data, 
	{house_id=0, 
	 template_id=0, 
	 furniture_permission=0, 
	 furniture_vec=[], 
	 room_tex_vec=[], 
	 welcome_words="", 
	 house_permission=0, 
	 visit_logs=[], 
	 buy_date, 
	 level=0, 
	 house_clean=0, 
	 boy='', 
	 girl='', 
	 name="", 
	 mateup_status=0 
	}).

-record(house_furniture_tplt,{id,furniture_id,item_temp_id,x,z,height,flr,face}).

-record(house_furniture, 
 	{instance_id=0, template_id=0, x=0, z=0, height=0, floor=0, face=0, item_tempid=0, max_use_player=0, position_list=[], function_list=[], use_sex=0, permission=0, use_type=0, status_qty=0}).

-record(house_tplt,{id,name,level,type,model,house_furniture,born_id,max_players,preview_born,struct_info}).


-define(st_furniture, 5). % ���ݼҾ�


%% �������µķ���, ����Ĳ�����
%% ����˵������������ƷDropItems = [ItemTempID]
update_lovers_house_template_id(NewHouseTempID, DropItems) when is_list(DropItems) ->
    Table = house_data,
    Keys = mnesia:dirty_all_keys(Table),
    F = fun(HouseID) ->
		update_lovers_house_template_id(HouseID, NewHouseTempID, DropItems)		
	end,
    lists:foreach(F, Keys),
    {atomic, ok}.


%% �������µķ���, ����Ĳ�����
%% ����˵������������Ʒ DropItems = [ItemTempID]
%% ������ķ�ʽ���޸����ű�
update_lovers_house_template_id(HouseID, NewHouseTempID, DropItems) 
  when is_list(DropItems) ->    
    Table = house_data,
    FCanDo = fun(#house_data{boy=Boy, girl=Girl}) ->
		     %% ����������, ����Ĳ�����
		     (Boy =/= '') and (Girl =/= '')
	     end,

    FModify = fun(#house_data{furniture_vec=FurList}=HouseData) ->
		      Items = convert_furnitures_to_items(FurList, DropItems),
		      do_add_lover_items(Items, HouseID),
		      change_house_template_id(HouseData, NewHouseTempID)
	      end,
    case modify_if(FCanDo, FModify, HouseID, Table) of
	{ok, _NewR, _OldR} -> 
	    %%io:format("update house_id ~p~n", [HouseID]),
	    ok;
	_ -> 
	    %%io:format("skip house_id ~p~n", [HouseID]),
	    ok
    end.


%% �ı䷿������, ��վɼҾߣ�ʹ���¼Ҿ�
change_house_template_id(#house_data{}=OldHouseData, NewHouseTempID) 
  when is_integer(NewHouseTempID) ->
    FurList = init_funitures_by_house_template(NewHouseTempID),
    OldHouseData#house_data{template_id=NewHouseTempID, furniture_vec=FurList}.

init_funitures_by_house_template(HouseTempID) ->
    HTData = tplt:get_data2(house_tplt, HouseTempID),
    File = HTData#house_tplt.house_furniture,
    FileAtom = tplt:transform_filename_atom(File),
    init_furni_vec(FileAtom).

%% ��ʼ�����ݼҾ�����
init_furni_vec([]) ->
    [];
init_furni_vec(FileAtom) ->
    make_house_furniture(tplt:get_all_data(FileAtom)).

%% ���ɷ��ݼҾ�
make_house_furniture([])->
    [];
make_house_furniture([#house_furniture_tplt{furniture_id=TempID,
					    item_temp_id=ItemTempID,
					    x=X,
					    height=Height,
					    z=Z,
					    flr=Floor,
					   face=Face}|Rest])->
    [#house_furniture{instance_id=guid:make(?st_furniture),
		      template_id = TempID,
		      x=X,
		      height=Height,
		      z=Z,
		      floor=Floor,
		      face=Face,
		      item_tempid=ItemTempID
		     } | make_house_furniture(Rest)].


do_add_lover_items(Items, HouseID) ->
    FCanDo = fun(_) -> true end,
    FModify = fun(R) ->
		      {house_lover_package, HouseID, Pack} = R,
		      {NPack, _Msgs} = house_lover_package:add_items(Items, Pack),
		      {house_lover_package, HouseID, NPack}
	      end,

    DefRecord = {house_lover_package, HouseID, pack:new(0)},
    {ok, _NewR, _OldR} = raw_modify_if(FCanDo, FModify, HouseID, DefRecord).

convert_furnitures_to_items(FurList, DropItems) ->
    ItemCount = 1,
    [{ItemID, ItemCount} || #house_furniture{item_tempid=ItemID} <- FurList, 
			    not lists:member(ItemID, DropItems)].


%%%===================================================================
%%% house_lover_diamond �� house_lover_package ���ϵ�house_data��  
%%%===================================================================
update_house_data_20120227() ->
    Table = house_data,
    Keys = mnesia:dirty_all_keys(Table),
    
    F = fun(HouseID) ->
		update_house_data_20120227(HouseID)		
	end,
    lists:foreach(F, Keys),
    {atomic, ok}.

update_house_data_20120227(HouseID) ->
    Pack = 
	case mnesia:dirty_read(house_lover_package, HouseID) of
	    [{house_lover_package, _, LoverPack}] -> LoverPack;
	    [] -> pack:new(0)
	end,

    Diamond =
	case mnesia:dirty_read(house_lover_diamond, HouseID) of
	    [{house_lover_diamond, _, N}] -> 
		N;
	    [] ->
		0
	end,
    
    [HouseData] = mnesia:dirty_read(house_data, HouseID),
    CheckSize = size(#house_data{}) + 3, %% �Ѿ����������ֶ���
    CheckSize = size(HouseData),

    A = erlang:setelement(CheckSize - 2, HouseData, Diamond),
    B = erlang:setelement(CheckSize -1, A, Pack),
    C = erlang:setelement(CheckSize, B, 0),

    mnesia:dirty_write(C),
    ok.

%%%===================================================================
%%% 
%%%===================================================================
%% �Ƴ�һЩ�Ҿ��ֶ�
update_furnitures_20120421() ->
    Table = house_data,
    Keys = mnesia:dirty_all_keys(Table),
    
    F = fun(HouseID) ->
		update_furnitures_20120421(HouseID)		
	end,
    lists:foreach(F, Keys),
    {atomic, ok}.


update_furnitures_20120421(HouseID) ->
    [HouseData] = mnesia:dirty_read(house_data, HouseID),
    FurList = element(5, HouseData),
    
    NewFurList = [begin
		      update_furniture_20120421(X) 
		  end || X <- FurList],
    
    NewHouse = setelement(5, HouseData, NewFurList),
	
    mnesia:dirty_write(NewHouse),
    ok.

update_furniture_20120421(FurnitureR) when size(FurnitureR) =:= 16 ->
    L = tuple_to_list(FurnitureR),
    %% ȥ��������ֶ�
    {A, _B} = lists:split(9, L),
    %% ������״̬�ֶ�(���ص�״̬֮���), 1 ��ʾĬ�Ͽ���
    C = A ++ [1],
    list_to_tuple(C).

%%%===================================================================
%%% �Ҿ߸߶ȳ�100
%%%===================================================================
update_furniture_height_20120606() ->
    Table = house_data,
    Keys = mnesia:dirty_all_keys(Table),
    F = fun(HouseID) ->
		update_house_furniture_height_20120606(HouseID)		
	end,
    lists:foreach(F, Keys),
    {atomic, ok}.

update_house_furniture_height_20120606(HouseID) ->
    [HouseData] = mnesia:dirty_read(house_data, HouseID),
    FurList = element(5, HouseData),
    
    NewFurList = [begin
		      update_furniture_height_20120606(X) 
		  end || X <- FurList],
    
    NewHouse = setelement(5, HouseData, NewFurList),
	
    mnesia:dirty_write(NewHouse),
    ok.

update_furniture_height_20120606(FurR) ->
    Height = element(6, FurR),
    setelement(6, FurR, Height/100).



%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% ���·��ݺ�����
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
update_house_decoration_20120627()->
    FUpdate = fun()->
    		      FirstAccount = mnesia:dirty_first(house_data),
    		      update_house_decoration_20120629(FirstAccount)
    	      end,		      
    %% mnesia:activity(transaction, FUpdate, [], mnesia_frag),
    FUpdate(),
    {atomic, ok}.

update_house_decoration_20120629(HouseId) when is_integer(HouseId)->
    [HouseData] = mnesia:dirty_read({house_data, HouseId}),
    HouseDecoration = get_decoration_20120627(HouseData),
    NewHouse = setelement(22, HouseData, HouseDecoration),
    mnesia:dirty_write(NewHouse),
    NextHouseId = mnesia:dirty_next(house_data, HouseId),
    update_house_decoration_20120629(NextHouseId);

update_house_decoration_20120629(_Other) ->
    ok.

get_decoration_20120627(HouseData)->
    Furnitures = element(5, HouseData),
    TemplateId = element(3, HouseData),
    FurnitureDecoration = 
	lists:foldl(
	  fun(Furniture, AccDecoration)->
		  ItemId = element(3, Furniture),
		  AccDecoration + tplt:get_property_value(tplt:get_data(item_tplt, ItemId))
	  end, 0, Furnitures),
    HouseTemplate = tplt:get_data(house_tplt, TemplateId),
    Internal = element(17, HouseTemplate),
    Max = element(18, HouseTemplate),
    case Max >= (FurnitureDecoration + Internal) of
	true->
	    FurnitureDecoration + Internal;
	false ->
	    Max
      end.


%% �ȶ�ȡ������������, �޸Ĳ�д��
%% ����ֵ: {ok, NewRecord} �� Error(���Զ���)
raw_modify_if(FCanDo, FModify, Key, DefRecord) when is_tuple(DefRecord) ->
    Table = element(1, DefRecord),
    R = case mnesia:read(Table, Key) of			   
	    [Record] -> Record;
	    _ -> DefRecord
	end,
    raw_modify_if_1(FCanDo, FModify, R);
raw_modify_if(FCanDo, FModify, Key, Table) when is_atom(Table) ->
    [R] = mnesia:read(Table, Key), %% ȡ����1����¼�Ļ�������ᱨ��, �����Ƽ���DefRecord
    raw_modify_if_1(FCanDo, FModify, R).

raw_modify_if_1(FCanDo, FModify, R) ->
    case FCanDo(R) of
	true ->
	    NRecord = FModify(R),
	    {mnesia:write(NRecord), NRecord, R};
	Error ->
	    Error
    end.			
    
%% �ȶ�ȡ������������, �޸Ĳ�д��
%% ����ֵ: {ok, NewRecord} �� Error(���Զ���)
modify_if(FCanDo, FModify, Key, TableAtomOrDefRecord) ->
    db:transaction(fun() -> raw_modify_if(FCanDo, FModify, Key, TableAtomOrDefRecord) end).
