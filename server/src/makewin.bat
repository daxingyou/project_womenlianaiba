cd ..\gen_protocal
call makewin.bat

cd ..\src
del *flymake*
erl -noshell -pz ..\smart_exceptions\ebin -pz ..\ebin -make
cd task
erl -noshell -pz ..\..\ebin -make
cd ..
cd npc
erl -noshell -pz ..\..\ebin -make


pause