set abwd=%cd%
cd ..\..\
set project=%cd%
set log=%USERPROFILE%\Local Settings\Application Data\Unity\Editor\Editor.log
"C:\Program Files\Unity\Editor\Unity.exe" -batchMode -quit -nographics -projectPath %project% -executeMethod AutoBuilder.PerformBuild
type "%log%"

cd %abwd%
cd ..\..\WebPlayer
svn up --username linyb --password 821109
svn commit --username linyb --password 821109 *.* -m "LOVE-0000 自动编译"

cd %abwd%
cd ..\Resources
svn up --username linyb --password 821109
svn commit --username linyb --password 821109 *.* -m "LOVE-0000 自动编译"