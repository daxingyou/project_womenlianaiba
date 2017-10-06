%%% @author LinZhengJian <linzhj@35info.cn>
%%% @copyright (C) 2012, LinZhengJian
%%% @doc
%%%
%%% @end
%%% Created : 20 Feb 2012 by LinZhengJian <linzhj@35info.cn>

-module(house_guest_book).

-include("packet_def.hrl").
-include("common_def.hrl").
-include("records.hrl").
-include("house_data.hrl").

-export([add_guest_book/3, add_guest_book/4, get_house_guest_books/1]).
-export([notify_guest_book_add/2, notify_guest_book_get/1]).

add_guest_book(Guest, Content, HouseData)->
   add_guest_book(Guest, Content, HouseData, 1).
 
add_guest_book(Guest, RawContent, HouseData, Opened)->
    ID = guid:make(?st_guest_book),
    Content = qq_strategy:word_filter(Guest, RawContent, integer_to_list(ID)),
    GuestBook = #guest_book{id=ID,account=Guest,content=list_to_binary(Content),create_time=datetime:localtime(), opened=Opened},
    %% Ö»±£Áô50¼ÇÂ¼
    #house_data{house_id=HouseId}=HouseData,
    #house_guest_data{guest_books=GuestBooks}=get_house_guest_books(HouseId),
    {OriginalList, DeletedList} = 
	if 
	    length(GuestBooks)>99 ->
		lists:split(99, GuestBooks);
	    true->
		{GuestBooks,[]}
	end,
    NHouseGuestBook=#house_guest_data{house_id=HouseId, guest_books=[GuestBook|OriginalList]},
    db:dirty_write(NHouseGuestBook),
    {GuestBook ,DeletedList}.


get_house_guest_books(HouseId)->
    R=db:dirty_read(house_guest_data, HouseId),
    case R of 
	[]->
	    #house_guest_data{guest_books=[], house_id=HouseId};
	[#house_guest_data{guest_books=GuestBooks}=HouseGuestBook]-> 
	    HouseGuestBook#house_guest_data{guest_books=[guest_book_adjust(GuestBook) || GuestBook<-GuestBooks]}
    end.

notify_guest_book_add({Account, AtHome}, Notify)->
    case {util:is_process_alive(Account), AtHome} of
	{true, true}->
	    net_helper:send2client(Account, Notify);
	_->
	    player_offline_notify:add(Account, ?offline_guest_book)
    end.

notify_guest_book_get(Account)->
    player_offline_notify:get(Account, ?offline_guest_book).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%inner functions
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
guest_book_adjust(#guest_book{}=GuestBook)->
    GuestBook;
guest_book_adjust({guest_book, Id, Account, Content, CreateTime}) ->
    #guest_book{id=Id, account=Account,content=Content,create_time=CreateTime, opened=1}.
