%%% @author hongjx <hongjx@35info.cn>
%%% @copyright (C) 2012, hongjx
%%% @doc
%%%
%%% @end
%%% Created : 17 Dec 2012 by hongjx <hongjx@35info.cn>

-module(item_add_exp).


-export([can_use_item/6, use_item/2]).

can_use_item(_Owner, _Targets, _HouseData, _Item, _ItemTplt, _PlayerData) ->
    true.

%% ģ�����ֻҪ��ģ�����Ͳ��������м��ɣ� ����ֻҪ��д����һ��Ԫ������Ĳ���
%% ����Ҫʹ�������Ʒ�� ֻҪ��дitem_add_hp �� 10 �Ϳ�����
%% ��������
use_item({Account,_, HouseData,_,_,_}, AddExp) ->
    {NHouseData, MFA} = do_add_exp(AddExp, Account, HouseData),
    {ok, NHouseData, [MFA]}.


do_add_exp(Exp, Account, HouseData) when is_atom(Account),
					 is_integer(Exp) ->    
    [BasicData] = db:read(player_basic_data, Account),

    %% �Ӿ���
    {_NBasicData, NHouseData, ExpMsgs} = 
	house_level_exp:add_exp(Exp, BasicData, HouseData),

    MFA = {house_level_exp, send_msgs, [ExpMsgs, HouseData]},
    {NHouseData, MFA}.

