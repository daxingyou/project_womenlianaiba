svn up --username linyb --password 821109
svn delete priv/www/WebPlayer/WebPlayer*.unity3d
svn add priv/www/WebPlayer/WebPlayer*.unity3d
svn commit priv/www/js/ -m "LOVE-00 自动发布版本,版本号:%datetime%"
svn commit priv/www/WebPlayer/ -m "LOVE-00 自动发布版本,版本号:%datetime%"