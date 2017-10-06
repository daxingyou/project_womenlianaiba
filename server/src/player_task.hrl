-record(player_task, {
	  account,                    %% 玩家帐号
	  give_tasks,                 %% 已经接的任务, [#task{}, ...]
	  flags,                      %% 任务标记，用于保存各个系统的状态,结构[{key, value}, ...]
	  events,
	  complete_chain_tasks = []
	 }).

-record(task, {
	  inst_id,                    %% 任务实例Id
	  id,                         %% 对应的任务类型的Id，如该任务是日常任务，此位置则保存日常任务表的Id，如果是链式任务，则保存链式任务的Id
	  task_id,                    %% 任务Id
	  type,                       %% 任务类型, 如(日常任务，链式任务，节日任务)
	  give_date,                  %% 任务接受的日期
	  complete_date,              %% 任务完成的日期
	  reward_date,                %% 奖励的日期
	  flag_info,
	  complete_task_ids = []      %% 完成的任务Id
	 }).

-record(daily_task, {
	  account,
	  complete_tasks
	 }).
