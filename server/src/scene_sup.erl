%% 场景的监控树
%% 用于监控场景
%%
-module(scene_sup).  
  
-behaviour(supervisor).  
  
-export([init/1]).  
  

%% ��ʼ��ʱ�����������ӽ��̣����峡����̬����ȥ
init([]) ->
    {ok,
        {  {one_for_one, 10, 100},
            [ 
            ]
        }
    }.
