-module(packet_crypto).
-on_load(init/0).

-export([init/0, encode/1, decode/1]).
   
init() ->
  ok = erlang:load_nif("./packet_crypto", 0).
  
encode(_X) ->
  "NIF library not loaded". 

decode(_X) ->
  "NIF library not loaded". 
