rem ���ģ��֮��ĵ�������, �����������ģ��֮��ĺ��������Ƿ����
erl -pz ../ebin -pz ../.eunit -pz ../lib/exmpp/ebin/ -pz ../lib/erlsom/ebin -pz ../lib/mongodb/ebin -pz ../lib/mongodb/deps/bson/ebin -pz ../lib/erlcron/ebin -pz ../test/erlymock/ebin  -noshell -eval "io:format(\"~p~n\", [xref:d(\"../ebin\")]), c:q().
pause
