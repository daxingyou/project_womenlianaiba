%%% @author linyijie
%%% @copyright (C) 2010, 
%%% @doc
%%% ������ͨ�õ����Ͷ���
%%% @end
%%% Created : 19 Mar 2010 by  <>

%%----ϵͳ���Ͷ���, ���ֻ����64�ֶ���, ��Ҫ����guid��type�ܵ�����----------------------
-define(st_player, 1).
-define(st_item, 2). % ��Ʒϵͳ
-define(st_pack, 3). % ����ϵͳ
-define(st_house, 4).  % ����
-define(st_furniture, 5). % ���ݼҾ�
-define(st_friend, 6). % ���ݼҾ�
-define(st_npc, 7).    % npc
-define(st_invitation, 8). % ����ϵͳ
-define(st_action, 9).     % ����ϵͳ 
-define(st_shop, 10).  % �̳�, �̵�
-define(st_task, 11).  % ����
-define(st_trade, 12). % ����
-define(st_farm, 13).  % ũ��
-define(st_mail, 14).  % �ʼ�
-define(st_house_transaction, 15).  %% ���ݽ���
-define(st_depot, 16). %% ��Ҳֿ�
-define(st_farm_ui, 17).  % ũ��������ز���
-define(st_gift, 18). % �����
-define(st_gift_express, 19).  % ������
-define(st_sys_boardcast, 20). % ϵͳ����
-define(st_house_plot, 21).    % ���ݵؿ�
-define(st_magic_box, 22).     % ����
-define(st_garbage, 23).       % ����
-define(st_float_bottle, 24).  % Ʈ��ƿ
-define(st_item_money_log, 25).  % ��Ʒ��Ǯ��¼
-define(st_guest_book, 26).    % ���Բ�
-define(st_checkin, 27).       % ǩ��
-define(st_commemoration, 28).     % ������
-define(st_register_invitation, 29).     % ������
-define(st_wish, 30). % ��Ը��
-define(st_order, 31). % ����
-define(st_pack_task, 32). %% �Զ����ɵ�����
-define(st_channel, 33). %% Ƶ��
-define(st_sprite, 34). %% ����
-define(st_food, 35). %% ʳ��

%%----�Ա���-----------------------------
-define(ps_male, 1).   %% ����
-define(ps_female, 2). %% Ů��

-define(init_pack_grid_count, 30). %% ��ʼ�������ӵ�����
-define(init_gift_grid_count, 1).  %% ����������ӵ�����

%%----�������͵Ķ���-----------------------
-define(GAMECOIN, 1).  %% ��Ϸ��
-define(EQCOIN, 2).    %% EQ��, �㿨

-define(MAX_GAMECOIN, 1000000000). %% �����Ϸ�� 
-define(MAX_EQCOIN, 1000000000).   %% ���EQ��

%%----�������״̬����--------------------
-define(ACTIVE, 1).    %% ���ڽ��е�����
-define(COMPLETE, 2).  %% �Ѿ���ɵ�����
-define(GIVEUP, 3).    %% �Ѿ�����������

%%----����--------------------------
%% -define(MAX_FRIENDS, 200).    %% ����������
%% -define(PAGE_FRIEND_COUNT, 10).    %% ÿҳ��������

%%----�������--------------------------
%% -define(MAX_TRADE_DISTANCE, 5 * 80). %% ����������5��
%% -define(MAX_TRADE_DISTANCE2, ?MAX_TRADE_DISTANCE * ?MAX_TRADE_DISTANCE). %% �����������ƽ��
%% -define(TRADE_GRID_COUNT, 9).       %% ���������Ӹ���
%% -define(POST_TRADE_SECOND, 3). %% ˫����ȷ�����ף��ȴ�3����Ч

-define(GRID_SIZE, 80).        %% ÿ���ʾ80����

-define(ITEM_CAN_TRADE, 3).    %% ��Ʒ�ɽ���

%%----ʱ�����-------------------------
-define(dt_onlinetime, 1).  %% ��������ʱ������
-define(dt_datetime, 2).    %% ���ݹ̶�ʱ�䶩��
-define(dt_interval, 3).    %% ���ݼ��ʱ�䶩��

%%----��ƷʱЧ-------------------------
%% -define(ITEM_UPDATE_INTERVAL, 3600). %% ��Ʒ���¼��(��)
%% -define(ITEM_MIN_TRADE_SECOND, 10 * 24 * 3600). %% ��Ʒ��С����ʱ��

%%----�ʼ����-------------------------
%% -define(MAX_MAIL_ITEM_COUNT, 6). %% �ʼ���Ʒ������
%% -define(MAX_MAIL_TITLE_LENGTH, 24). %% ��������ַ���������re:
%% -define(MAX_MAIL_CONTENT_LENGTH, 1024). %% �ʼ���������ַ���
%%-define(MAX_MAIL_DAY, 30).              %% �ʼ������������

%%----��������-------------------------
-define(PLAYERCLEAN, 1).
-define(PLAYERHEALTH, 2).
-define(PLAYERCHARM, 3).
-define(ACTIVEVALUE, 4).
-define(HOUSECLEAN, 5).


-define(FALSE, 0).
-define(TRUE, 1).

%%---------------------����״̬----------------%%
-define(order_new,1).
-define(order_paying,2).
-define(order_payed,3).
-define(order_cancel,4).
-define(order_refuse,5).

%%---------------------֧���ص�״̬----------------%%
-define(pay_shipped, 0).  % �ɹ�����
-define(pay_error, 1).    % ϵͳ�쳣
-define(pay_token_error, 2). % token������
-define(pay_timeout, 3).  % token��ʱ
-define(pay_parameter_error, 4). % ��������


%%--------------------����֪ͨ--------------------%%
-define(offline_guest_book,1).

%%--------------------�Ҿ�ʹ������--------------------%%
-define(FurnitureNormalStatus, 1). %% �Ҿ߲��ñ���״̬
-define(FurnitureKeepStatus, 2).   %% �Ҿ�Ҫ����״̬

%%--------------------��������--------------------%%
-define(rate_task, 1).
