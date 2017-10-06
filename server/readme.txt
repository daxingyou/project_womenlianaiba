1. 如何编译服务器程序: 执行src目录下的make.bat即可
2. 如何运行服务器程序: 执行ebin目录下的run.bat即可, 退出服务器,请在控制台里执行q(). 注意要输入"."
3. 问题: 如果出现版本不匹配, 请更新服务端的代码, 然后运行src目录下的make.bat即可
4. 设置远程数据库，需把本地数据库清空, 并修改server.app。 例如想连接224数据库，需进行如下修改
   原先 db_connection open localhost
   改为 db_connection open eq@10.35.12.224 

5. 数据库集群维护的模块为database, 目前支持的功能如下:
   backup/1,         %% 备份
   restore/1,        %% 还原
   add_db_node/1,    %% 增加数据库节点
   add_table_frag/2, %% 在某个节点上, 增加表片段
   auto_add_copies/0 %% 自动为所有表增加副本, 最多两个副本