@echo off
echo "starting..."

del *flymake*
erl -noshell -make
cd ebin
erl -noshell -s gen_protocal start -s gen_enum_def start -s gen_protocal_csharp start -s init stop

copy  protocal.erl ..\..\src
copy  packet_def.hrl ..\..\include
copy  enum_def.hrl ..\..\include
copy  EnumDef.cs ..\..\..\client\Assets\Plugins\network
copy  NetMsgType.cs ..\..\..\client\Assets\Plugins\network
copy  NetPacket.cs ..\..\..\client\Assets\Plugins\network


cd ..\

echo "finish"
pause