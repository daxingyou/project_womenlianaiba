all:compile

compile:
	rm -f *flymake*
	erl -make
	cd task;erl -make
	cd ..
	cd npc;erl -make
	erl -pz ../ebin -pz ../lib/mongodb/deps/bson/ebin -pz ../lib/erlsom/ebin -pz ../lib/mongodb/ebin -pz ../lib/erlcron/ebin -pz ../test/erlymock/ebin -noshell -eval "io:format(\"~p~n\", [xref:d(\"../ebin\")]), c:q()."

test: $(EBIN_FILES)
	mkdir -p $(TEST_DIR);
	@../support/run_tests.escript $(EBIN_DIR) | tee $(TEST_DIR)/test.log

dialyzer:
	dialyzer --src -DNOTEST -DDIALYZER -c ../src

clean:
	rm -f ../ebin/*.beam
