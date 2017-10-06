all:compile

compile:
	rm -f *flymake*
	erl -noshell -pz ../../smart_exceptions/ebin -make
	erl -pz ../../ebin -pz ../../ebin/erlsom -noshell -eval "io:format(\"~p~n\", [xref:d(\"../../ebin\")]), c:q()."

test: $(EBIN_FILES)
	mkdir -p $(TEST_DIR);
	@../../support/run_tests.escript $(EBIN_DIR) | tee $(TEST_DIR)/test.log

dialyzer:
	dialyzer --src -DNOTEST -DDIALYZER -c ../../src

clean:
	rm -f ../../ebin/*.beam