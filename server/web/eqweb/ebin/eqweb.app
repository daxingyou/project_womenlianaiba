{application, eqweb,
 [{description, "eqweb"},
  {vsn, "0.01"},
  {modules, [
    eqweb,
    eqweb_app,
    eqweb_sup,
    eqweb_web,
    eqweb_deps
  ]},
  {registered, []},
  {mod, {eqweb_app, []}},
  {env, [
		    {databasesvr, "love@10.182.14.60"},
		    {port, 80},
		    {app_id, "35398"},
		    {app_key, "9142f12312c0ba142b526ce3ef477637"},
		    {app_name, "app35398"},
		    {open_api_host, "http://113.108.20.23"},         %%²âÊÔ·þÎñÆ÷
		    {gamepage, [{pengyou, "http://app35398.imgcache.qzoneapp.com/app35398/WebPlayer/WebPlayer.html"}, {qzone, "http://app35398.imgcache.qzoneapp.com/app35398/WebPlayer/qzone.html"}, {tapp, "http://app35398.imgcache.qzoneapp.com/app35398/WebPlayer/tapp.html"}]},
		    {errorpage, "http://app35398.imgcache.qzoneapp.com/app35398/WebPlayer/error.html"},
		    {password, "Xx(159)"},
		    {filepath, "/data"},
		    {recipient, ["hezhr@35info.cn"]},
		    {smtp, [{relay, "183.60.55.48"},{username, "2586004468@qq.com"},{password, "Aa!2#4123"}]}
		]},

  {applications, [kernel, stdlib, crypto]}]}.
