<?php
// Get the app root dir.
chdir(__DIR__ );

// Global.
$configFile = json_decode(file_get_contents( "config.json" ), true) ;
$urlHttp  = "http://"  . $configFile['hostname'] . $configFile['path']; 
$urlHttps = "https://" . $configFile['hostname'] . $configFile['path']; 
$apikey = $configFile['apikey']; 

// Test: GET: PHP 5.3.3 style. This is also compatible with PHP 5.4+.
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

	$text = file_get_contents( $payload, false, stream_context_create($__opts__) );
	return $text;

	// }, array($__method__, $__url__, $__apikey__, $__key__, $__value__) );
}

// TESTER
function tester($tests){
	for($i=0; $i<count($tests); $i+=1){
		$args = [ 
			$tests[$i]['m'], 
			$tests[$i]['u'],
			$tests[$i]['a'],
			$tests[$i]['k'], 
			$tests[$i]['v'] 
		];
		$success = call_user_func_array( 
			$tests[$i]['f'], 
			...[ $args ] 
		); 
		// $success=false;
		if($success){ 
			echo "TEST: " . $tests[$i]['k'] . " : " ; echo json_encode( $success ) . "\n"; 
		}
		else { 
			echo $tests[$i]['k'] . '  : FAILED'."\n"; 
		}
	}
};
tester([
	// [ "m"=> "POST", "u"=>$urlHttps, "f"=>"php_fgc", "a"=>$apikey, "k"=>"PHP_POST_HTTPS_FGC" , "v"=>"PHP_POST_HTTPS_FGC" ],
	[ "m"=> "POST", "u"=>$urlHttp , "f"=>"php_fgc", "a"=>$apikey, "k"=>"PHP_POST_HTTP_FGC " , "v"=>"PHP_POST_HTTP_FGC"  ],
	// [ "m"=> "GET" , "u"=>$urlHttps, "f"=>"php_fgc", "a"=>$apikey, "k"=>"PHP_GET_HTTPS_FGC " , "v"=>"PHP_GET_HTTPS_FGC"  ],
	// [ "m"=> "GET" , "u"=>$urlHttp , "f"=>"php_fgc", "a"=>$apikey, "k"=>"PHP_GET_HTTP_FGC  " , "v"=>"PHP_GET_HTTP_FGC"   ],
]);
echo "\n";
