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

function curl_http() {
	B_LINENO=${LINENO}
	B_FUNC=${FUNCNAME[0]}

	JSON='
	{
		"o"   : "add",
		"key" : "'"$B_apikey"'",
		"data": {
			"origin": { "FILE": "'"$B_SCRIPT"'", "LINE": "'"$B_LINENO"'", "FUNCTION": "'"$B_FUNC"'" },
			"data"  : {"curl_bash_http_post": "Working correctly." }
		}
	}'

	RESULTS=$(curl --silent -d "$JSON" -H 'Content-Type: application/json' -X POST "$B_urlHttp")
	echo $RESULTS
}
function curl_https() {
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

	RESULTS=$(curl --silent -d "$JSON" -H 'Content-Type: application/json' -X POST "$B_urlHttps")
	echo $RESULTS
}

echo $(curl_http)
echo
echo $(curl_https)
echo

