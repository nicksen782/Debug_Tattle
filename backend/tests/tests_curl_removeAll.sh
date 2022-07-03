#!/bin/bash

BASEDIR=$(dirname $0)
cd $BASEDIR

if [ -z "$1" ]; then
	echo "ERROR: You did not specify the config file.";
	exit;
fi
if [ -z "$2" ]; then
	echo "ERROR: You did not specify protocol (http or https.)";
	exit;
fi

B_hostname=$(node -e "let pkg=require(process.argv[1]); process.stdout.write(pkg.hostname);" ./$1)
B_path=$(node -e "let pkg=require(process.argv[1]); process.stdout.write(pkg.path);" ./$1)
B_apikey=$(node -e "let pkg=require(process.argv[1]); process.stdout.write(pkg.apikey);" ./$1)
B_urlHttp="http://$B_hostname$B_path"
B_urlHttps="https://$B_hostname$B_path"
B_SCRIPT=$(realpath -s "$0")

# echo "B_hostname: $B_hostname"
# echo "B_path    : $B_path"
# echo "B_apikey  : $B_apikey"
# echo "B_urlHttp : $B_urlHttp"
# echo "B_urlHttps: $B_urlHttps"
# echo "B_SCRIPT  : $B_SCRIPT"
# exit

function curl_test() {
	B_LINENO=${LINENO}
	B_FUNC=${FUNCNAME[0]}

	JSON='{ "o": "removeAll", "key" : "'"$B_apikey"'" }'

	RESULTS=$(curl --silent -d "$JSON" -H 'Content-Type: application/json' -X POST "$1")
	RES1=$?
	if test "$RES1" != "0"; then
		echo "ERROR"
	else
		echo $RESULTS
	fi
}

HTTP=$([ "$2" == "https" ] && echo "HTTPS" || echo "$HTTP")
USETHISURL=$([ "$2" == "https" ] && echo "$B_urlHttps" || echo "$B_urlHttp")
TEST=$(curl_test $USETHISURL)
if test "$HTTP" == "HTTPS"; then
	echo "CURL_HTTPS_REMOVEALL: $TEST"
else
	echo "CURL_HTTP_REMOVEALL : $TEST"
fi