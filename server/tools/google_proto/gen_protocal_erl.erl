%% Author: NoteBook
%% Created: 2009-9-9
%% Description: TODO: Add description to procotal
-module(gen_protocal_erl).
%%
%% Include files
%%

%%
%% Exported Functions
%%
-export([start/0, start/1]).

start() ->
    start(packet_def).

%%
%% start/function_arity
%%
start(ModAtom) when is_atom(ModAtom) -> 
    Mod = atom_to_list(ModAtom),
    ProtoFile = Mod ++ ".proto",
    %% ����Э���ļ�(.hrl �� .beam)
    protobuffs_compile:scan_file(ProtoFile),    
    
    %% ȡ��Ϣ���Ʊ� 
    A = protobuffs_parser:parse_file(ProtoFile),    
    Structures = A, %%lists:nthtail(3, A),
    NameList = [string:to_lower(element(2, X)) || X <- Structures],

    %% ���ÿ����Ϣ��Ӧ����Ϣ�� 
    append_enum_info(NameList, Mod ++ ".hrl"),
    %% 
    make_protocol_file(NameList, Mod).

append_enum_info(NameList, HeadFile) ->
    KVList = lists:zip(NameList, lists:seq(1, length(NameList))),
    EnumStr = [begin "-define(msg_" ++ StructName ++ ", " ++ integer_to_list(Index) ++ ").\n" 
	       end || {StructName, Index} <- KVList],

    VersionStr = create_version(net_protocal_def:get_version()),
    file:write_file(HeadFile, EnumStr ++ "\n" ++ VersionStr, [append]).

%%
%% Local Functions
%%


create_version(Version) ->
    "-define(proto_ver, " ++ integer_to_list(Version) ++ ").\n".


%%%%%%%%%%%%%%%%%%%%生成文件%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
make_protocol_file([], _Mod) ->
    file:write_file("protocal.erl", "-module(protocal).\n");
make_protocol_file(NameList, Mod) ->
    Include = make_function_include(Mod ++ ".hrl"),
    {A, B} = lists:split(length(NameList) - 1, NameList),
    Encode = [make_function_encode(StructName, Mod) ++ ";\n" || StructName <- A] ++
	[make_function_encode(StructName, Mod) ++ ".\n" || StructName <- B],
    Decode = [make_function_decode(StructName, Mod) ++ ";\n" || StructName <- A] ++
	[make_function_decode(StructName, Mod) ++ ".\n" || StructName <- B],
    file:write_file("protocal.erl", Include ++ "\n\n" ++ 
			Encode ++ "\n\n" ++ Decode).
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%%%%%%%%%%%%%%%%%%%%生成include方法%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
make_function_include(HeadFile) ->
    "-module(protocal).\n" ++ 
	"-include(\"" ++ HeadFile ++ "\").\n" ++ 
%%	"-include(\"net_type.hrl\").\n" ++ 
	"-export([encode/1, decode/2]).\n".


%%%%%%%%%%%%%%%%%%%%生成encode方法%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
make_function_encode(StructName, Mod) ->
    "encode(#" ++ StructName ++ "{}=Msg) ->\n\t" ++
	"{?msg_" ++ StructName ++ ", " ++ Mod ++ ":encode_" ++ StructName ++ "(Msg)}".


%%%%%%%%%%%%%%%%%%%%生成decode方法%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
make_function_decode(StructName, Mod) ->
    "decode(?msg_" ++ StructName ++ ", Binary) ->\n\t" ++
       Mod ++ ":decode_" ++ StructName ++ "(Binary)".






