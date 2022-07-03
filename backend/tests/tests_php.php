<?php
// Change to the dir of this script.
chdir(__DIR__ );
if(empty($argv[1])){ echo "ERROR: You did not specify the config file.\n"; exit(); }
if(empty($argv[2])){ echo "ERROR: You did not specify protocol (http or https.)\n"; exit(); }

// Global.
$configFile = json_decode(file_get_contents( $argv[1] ), true) ;
$urlHttp  = "http://"  . $configFile['hostname'] . $configFile['path']; 
$urlHttps = "https://" . $configFile['hostname'] . $configFile['path']; 
$apikey = $configFile['apikey']; 

// Test: POST/GET: PHP 5.3.3 style. This is also compatible with PHP 5.4+.
function php_fgc ( $__method__, $__url__, $__apikey__, $__key__, $__value__ ){
	// return call_user_func_array(function($__method__, $__url__, $__apikey__, $__key__, $__value__) {
	$__data__ = http_build_query(array(
		'o'    => 'add', 'key'  => $__apikey__,
		'data' => array(
			"origin" => array( "FILE" =>  __FILE__ , "LINE" =>  __LINE__ , "FUNCTION" => __FUNCTION__ ),
			"data"   => array(
				"$__key__" => "$__value__",
			)
		)
	));
	$__opts__ = array( 'http' => array( 'method'=>$__method__, 'header'=>"Content-Type: application/x-www-form-urlencoded\r\n" ) );
	if     ($__method__ == "GET" ){ $payload = $__url__ . "?o=add&key=$__apikey__&data=" . $__data__; }
	else if($__method__ == "POST"){ $payload = $__url__; $__opts__['http']['content'] = $__data__; }
	$text = @file_get_contents( $payload, false, stream_context_create($__opts__) );
	$error = error_get_last();
	if($error){ return false; }
	else      { return $text; }
	// }, array($__method__, $__url__, $__apikey__, $__key__, $__value__) );
}

// TESTER
function tester($tests){
	for($i=0; $i<count($tests); $i+=1){
		$test = $tests[$i];
		$args = [ $test['m'], $test['u'], $test['a'], $test['k'], $test['v'] ];
		$success = call_user_func_array( $tests[$i]['f'], ...[ $args ] ); 
		if($success){  echo str_pad($tests[$i]['k'], 20, " ", STR_PAD_RIGHT) . ": " ; echo ( $success ) . "\n"; }
		else { echo str_pad($tests[$i]['k'], 20, " ", STR_PAD_RIGHT) . ': ERROR'."\n"; }
	}
};

// Tests: HTTP
$tests_http = [
	[ "m"=> "POST", "u"=>$urlHttp , "f"=>"php_fgc", "a"=>$apikey, "k"=>"PHP_POST_HTTP_T1" , "v"=>"PHP_POST_HTTP_T1"  ],
];
// Tests: HTTPS
$tests_https = [
	[ "m"=> "POST", "u"=>$urlHttps, "f"=>"php_fgc", "a"=>$apikey, "k"=>"PHP_POST_HTTPS_T1", "v"=>"PHP_POST_HTTPS_T1" ],
];

// Determine which tests to run.
$tests = [];
if($argv[2] == "https") { $tests = $tests_https; }
else { $tests = $tests_http; }

// Run the tests.
tester($tests);
