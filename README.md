# Debug & Tattle v6

![readme_app](/public/imgs/readme_app.png)

# What does it require?
* Server tested with PHP 7.3.31-1.
  * The server uses PHP/Apache, Sqlite and PDO.
* Client test examples support PHP 5.3.3 and above, Curl/Bash, NodeJs, JavaScript.
* Client that can send the correct JSON.

# What does it do?
* This program is designed to be a simple logger for debugging. 
* Each example reports the file, line, and function along with anything that you want to add to the data section. 
* Only the server needs an install. Logs can be sent from any code that can send the correct JSON.
  * (Previous versions required an install for both the server and the client.)

# Why would I use it?
Examples could include: 
* For development, general simple debugging, any message/values that you want to view.
* You have access to the code but are not able to install new software.
* As an  alternative to php_error log or other logging packages if you just need something easy to use.
* The logs are easy to clear all at once since a log shouldn't need to last long. You can "have a clean slate" before each debugging session.
  * Also I good idea if you bring your dev server with you (such as a Raspberry Pi or other server) so that you could easily get the IP address on a new network.
* Add to /etc/rc.local to have the system send a message when it boots. 

# How do I use it?
* You simply need to copy/paste/edit the examples provided in the web client.
* This means that Debug Tattle now is easier to use and with many more languages. 
  * These include PHP, BASH/CURL, NodeJS, JavaScript or anything that can correctly send JSON via POST.
* To make things easier, the examples will auto-populate with your api key and the server url.
  * ![readme_example1](/public/imgs/readme_example1.png)

## Can I have some examples?
* The examples are easily copied/pasted and available when you login to the web client.
* Here are two examples:

### PHP: 
````sh
// Test: GET: PHP 5.3.3 style. This is also compatible with PHP 5.4+.
call_user_func_array(function($__method__, $__url__, $__apikey__, $__function__, $__messages__) {
	$__data__ = http_build_query(array(
		'o'    => 'add', 'key'  => $__apikey__,
		'data' => array(
			"origin" => array( "FILE" =>  __FILE__ , "LINE" =>  __LINE__ , "FUNCTION" => $__function__ ),
			"data"   => $__messages__
		)
	));
	$__opts__ = array( 'http' => array( 'method'=>$__method__, 'header'=>"Content-Type: application/x-www-form-urlencoded\r\n" ) );
	if     ($__method__ == "GET" ){ $payload = $__url__ . "?o=add&key=$__apikey__&data=" . $__data__; }
	else if($__method__ == "POST"){ $payload = $__url__; $__opts__['http']['content'] = $__data__; }
	$text = @file_get_contents( $payload, false, stream_context_create($__opts__) );
	$error = error_get_last();
	if($error){ return false; }
	else      { return $text; }
}, 
	array(
		"POST", "https://<YOUR_URL_HERE>/Debug_Tattle/public/gateway_p.php", "<YOUR_KEY_HERE>", __FUNCTION__, 
		array(
			'NAMED_KEY' => 'DESIRED_VALUE'
		)
	)
);
````

## Can I have another example?
### Bash/Curl: 
````sh
#!/bin/bash
JSON='
{
	"o"   : "add", "key" : "<YOUR_KEY_HERE>",
	"data": {
		"origin": { "FILE": "'"$(basename "$0")"'", "LINE": "'"${LINENO}"'", "FUNCTION": "'"${FUNCNAME[0]}"'" },
		"data"  : {
			"NAMED_KEY": "DESIRED_VALUE" 
		}
	}
}'
RESULTS=$(curl --silent -X POST "https://<YOUR_URL_HERE>/Debug_Tattle/public/gateway_p.php" -H 'Content-Type: application/json' -d "$JSON")
````
