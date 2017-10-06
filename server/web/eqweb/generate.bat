@echo off
setlocal enabledelayedexpansion
for /f "tokens=1,2,3 delims=- " %%A in ('date /t') do set sDate=%%A%%B%%C
for /f "tokens=1,2 delims=- " %%A in ('time /t') do set myTime=%%A%%B
set myTime1=%myTime:~0,2%%myTime:~3,2%
set myTime2=%time:~6,2%
set sTime=%myTime1%%myTime2%
set datetime=%sDate%%sTime%

set app_id=33734
set app_key=3e9b8b603e8149afa6ca0f35a2132f51
set app_name=app33734
set SANDBOX=true

set PENGYOU=pengyou
set QZONE=qzone
set TAPP=tapp

set game_host=218.5.81.155
set game_port=8001

set CDNHOST="..\\\/"

set ExceptionURL="\\\/report\\\/bug"

for /f "delims=" %%i in ('dir /s/b ..\..\..\publish\template\server\cdn\Config.txt') do (
        sed "s/@@game_host@@/%game_host%/g;s/@@game_port@@/%game_port%/g" "%%i" > "%%i_"
        move "%%i_" "priv\www\WebPlayer\Config.txt"
)

for /f "delims=" %%i in ('dir /s/b ..\..\..\publish\template\WebPlayer.html') do (
        sed "s/@@WEBPLAYER@@/WebPlayer%datetime%.unity3d/g;s/@@APPID@@/%app_id%/g;s/@@PLATFORM@@/%PENGYOU%/g;" "%%i" > "%%i_"
        move "%%i_" "priv\www\WebPlayer\WebPlayer.html"
)

for /f "delims=" %%i in ('dir /s/b ..\..\..\publish\template\WebPlayer.html') do (
        sed "s/@@WEBPLAYER@@/WebPlayer%datetime%.unity3d/g;s/@@APPID@@/%app_id%/g;s/@@PLATFORM@@/%QZONE%/g;" "%%i" > "%%i_"
        move "%%i_" "priv\www\WebPlayer\qzone.html"
)

for /f "delims=" %%i in ('dir /s/b ..\..\..\publish\template\WebPlayer.html') do (
        sed "s/@@WEBPLAYER@@/WebPlayer%datetime%.unity3d/g;s/@@APPID@@/%app_id%/g;s/@@PLATFORM@@/%TAPP%/g;" "%%i" > "%%i_"
        move "%%i_" "priv\www\WebPlayer\tapp.html"
)

for /f "delims=" %%i in ('dir /s/b ..\..\..\publish\template\server\cdn\yy.html') do (
        sed "s/@@WEBPLAYER@@/WebPlayer%datetime%.unity3d/g;" "%%i" > "%%i_"
        move "%%i_" "priv\www\WebPlayer\yy.html"
)

for /f "delims=" %%i in ('dir /s/b ..\..\..\publish\template\error.html') do (
        sed "s/@@APPID@@/%app_id%/g" "%%i" > "%%i_"
        move "%%i_" "priv\www\WebPlayer\error.html"
)

rem for /f "delims=" %%i in ('dir /s/b template\pengyou.html') do (
rem        sed "s/@@APPID@@/%app_id%/g" "%%i" > "%%i_"
rem        move "%%i_" "priv\www\WebPlayer\pengyou.html"
rem )

rem for /f "delims=" %%i in ('dir /s/b template\pengyou.js') do (
rem 		sed "s/@@APPID@@/%app_id%/g" "%%i" > "%%i_"
rem        move "%%i_" "priv\www\js\pengyou.js"
rem )

for /f "delims=" %%i in ('dir /s/b ..\..\..\publish\template\PYConfig.js') do (
      sed "s/@@APPID@@/%app_id%/g;s/@@CDNHOST@@/%CDNHOST%/g;s/@@reportBugUrl@@/%ExceptionURL%/g;s/@@SANDBOX@@/%SANDBOX%/g" "%%i" > "%%i_"
       move "%%i_" "priv\www\js\PYConfig.js"
)

copy /y ..\..\..\client\WebPlayer\WebPlayer.unity3d priv\www\WebPlayer\WebPlayer%datetime%.unity3d

rd /s /q priv\www\AssetBundles_ver
md priv\www\AssetBundles_ver

xcopy /y /e /s /h ..\..\..\client\AssetBundles_ver priv\www\AssetBundles_ver