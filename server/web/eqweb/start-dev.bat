erl -pa ebin deps/mochiweb/ebin -pz ebin deps/gen_smtp/ebin -boot start_sasl -s eqweb -name loveweb@10.35.16.73 -setcookie efg -config ebin/elog.config
pause