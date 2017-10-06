curl http://10.35.16.79:8080/job/server79/build?delay=0sec
erl -name restart@10.35.16.105 -setcookie efg -s restart start love@10.35.16.105