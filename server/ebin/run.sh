#!/bin/sh
ERL=/usr/local/bin/erl
cd `dirname $0`
exec $ERL -name 'love@127.0.0.1' -setcookie efg -mnesia dump_log_write_threshold 50000 -mnesia dc_dump_limit 40 +P 100000 +K true -env ERL_MAX_PORTS 10000 -pz ../lib/mongodb/deps/bson/ebin -pz ../lib/tcp_server/ebin -pz ../lib/mongodb/ebin -pz ../lib/db_manager/ebin -pz ../lib/erlsom/ebin -boot start_sasl -config elog -s inets -s logger  -s gamesvr -s security start -detached
