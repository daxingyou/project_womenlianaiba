erl -name gate -setcookie abcd -pz log -pz erlsom  -boot start_sasl -config elog -run db_connection open 'db@wxp-linyj.CHINA-CHANNEL.COM' -run gate start "./error_logs/EQ.log" tcp_server 