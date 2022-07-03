#!/bin/bash

BASEDIR=$(dirname $0)
cd $BASEDIR

B_hostname=$(node -e "let pkg=require('./config.json'); process.stdout.write(pkg.hostname);")
B_path=$(node -e "let pkg=require('./config.json'); process.stdout.write(pkg.path);")
B_apikey=$(node -e "let pkg=require('./config.json'); process.stdout.write(pkg.apikey);")
B_urlHttp="http://$B_hostname$B_path"
B_urlHttps="https://$B_hostname$B_path"
B_SCRIPT=$(realpath -s "$0")

# echo "B_hostname: $B_hostname"
# echo "B_path    : $B_path"
# echo "B_apikey  : $B_apikey"
# echo "B_urlHttp : $B_urlHttp"
# echo "B_urlHttps: $B_urlHttps"
# echo "B_SCRIPT  : $B_SCRIPT"

function curl_test() {
	B_LINENO=${LINENO}
	B_FUNC=${FUNCNAME[0]}

	JSON='
	{
		"o"   : "add",
		"key" : "'"$B_apikey"'",
		"data": {
			"origin": { "FILE": "'"$B_SCRIPT"'", "LINE": "'"$B_LINENO"'", "FUNCTION": "'"$B_FUNC"'" },
			"data"  : {"curl_bash_https_post": "Working correctly." }
		}
	}'

	RESULTS=$(curl --silent -d "$JSON" -H 'Content-Type: application/json' -X POST "$1")
	RES1=$?
	if test "$RES1" != "0"; then
		echo "ERROR"
	else
		echo $RESULTS
	fi
}
TEST_HTTP=$(curl_test $B_urlHttp)
TEST_HTTPS=$(curl_test $B_urlHttps)
echo "CURL_POST_HTTP_T1   : $TEST_HTTP"
echo "CURL_POST_HTTPS_T1  : $TEST_HTTPS"

