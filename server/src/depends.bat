rem 检查模块之间的调用依赖, 编译器不检查模块之间的函数调用是否存在
erl -pz ../ebin -pz ../.eunit -pz ../lib/exmpp/ebin/ -pz ../lib/erlsom/ebin -pz ../lib/mongodb/ebin -pz ../lib/mongodb/deps/bson/ebin -pz ../lib/erlcron/ebin -pz ../test/erlymock/ebin  -noshell -eval "io:format(\"~p~n\", [xref:d(\"../ebin\")]), c:q().
pause
