<?php
// Get the app root dir.
$_appdir = getcwd() . '/../..'; // Move back two dirs.
chdir($_appdir);

include "backend/db_conn_p.php";

// Global.
$configFile = json_decode(file_get_contents( "backend/tests/config.json" ), true) ;
$urlHttp = $configFile['urlHttp']; 
$active_apikey = $configFile['apikey']; 
$dbFile = "backend/db/tattle6.db";
unlink($dbFile);
if(!file_exists($dbFile)){ sqlite3_DB_PDO::db_init($dbFile); }
// $dbHandle = new sqlite3_DB_PDO($dbFile) or exit("cannot open the database");

// Test GET: PHP 5.3.3 style.
function php_fgc_get1($key, $value, $apikey, $url){
	// call_user_func(function() { 
		$data = http_build_query(
			array(
				'o'    => 'add', 
				'key'  => $apikey,
				'data' => array(
					"origin" => array( "FILE" =>  __FILE__ , "LINE" =>  __LINE__ , "FUNCTION" => __FUNCTION__ ),
					"data"   => array(
						$key => $value
					)
				)
			)
		);
		
		$payload = $url . "?o=add&key=$apikey&data=" . $data;
		$text = file_get_contents( $payload );
		echo "\n*** "; print_r($text); echo " ***\n";
	// });
	return true;
}
// Test GET: PHP 7+ style.
function php_fgc_get2($key, $value, $apikey, $url){
	// call_user_func(function() { 
		$_message = http_build_query([
			'o'    => 'add', 
			'key'  => $apikey,
			'data' => [
				"origin" => [ "FILE" =>  __FILE__ , "LINE" =>  __LINE__ , "FUNCTION" => __FUNCTION__ ],
				"data"   => [
					"$key" => "$value",
				]
			]
		]);
		$payload = $url . "?o=add&key=$apikey&data=" . $_message;
		$text = file_get_contents( $payload );
		echo "\n*** "; print_r($text); echo " ***\n";
	// });
	return true;
}
// Test POST: PHP 5.3.3 style.
function php_fgc_post1($key, $value, $apikey, $url){
	// call_user_func(function() { 
		$data = http_build_query(
			array(
				'o'    => 'add', 
				'key'  => $apikey,
				'data' => array(
					"origin" => array( "FILE" =>  __FILE__ , "LINE" =>  __LINE__ , "FUNCTION" => __FUNCTION__ ),
					"data"   => array(
						$key => $value
					)
				)
			)
		);
		$opts = array (
			'http' => array(
				'method'  => 'POST',
				'header'  => 'Content-Type: application/x-www-form-urlencoded',
				// 'header'  => 'Content-Type: application/json',
				'content' => $data
			)
		);
		$text = file_get_contents( $url, false, stream_context_create($opts) );
		echo "\n*** "; print_r($text); echo " ***\n";
	// });
	return true;
}
// Test POST: PHP 7+ style.
function php_fgc_post2($key, $value, $apikey, $url){
	// call_user_func(function() { 
		$data = http_build_query(
			[
				'o'    => 'add', 
				'key'  => $apikey,
				'data' => [
					"origin" => [ "FILE" =>  __FILE__ , "LINE" =>  __LINE__ , "FUNCTION" => __FUNCTION__ ],
					"data"   => [
						$key => $value,
					]
				]
			]
		);
		$opts = array (
			'http' => [
				'method'  => 'POST',
				'header'  => 'Content-Type: application/x-www-form-urlencoded',
				// 'header'  => 'Content-Type: application/json',
				'content' => $data
			]
		);
		$text = file_get_contents( $url, false, stream_context_create($opts) );
		echo "\n*** "; print_r($text); echo " ***\n";
	// });
	return true;
}

// TESTER
function tester($tests){
	for($i=0; $i<count($tests); $i+=1){
		$args = [ 
			$tests[$i]['k'], 
			$tests[$i]['v'], 
			$tests[$i]['a'],
			$tests[$i]['u'] 
		];
		$success = call_user_func_array( 
			$tests[$i]['f'], 
			...[ $args ] 
		); 

		if($success){ 
			echo $tests[$i]['f'] . " :   " . json_encode(getLastRecord()) . "\n"; 
		}
		else { 
			echo $tests[$i]['f'] . '  : FAILED'."\n"; 
		}
	}
};
tester([
	[ "f"=> "php_fgc_get1" , "k"=>"php_fgc_get1" , "v"=>"GET : FGC PHP 5.3.3", "a"=>$active_apikey, "u"=>$urlHttp],
	[ "f"=> "php_fgc_get2" , "k"=>"php_fgc_get2" , "v"=>"GET : FGC PHP 7+"   , "a"=>$active_apikey, "u"=>$urlHttp],
	[ "f"=> "php_fgc_post1", "k"=>"php_fgc_post1", "v"=>"POST: FGC PHP 5.3.3", "a"=>$active_apikey, "u"=>$urlHttp],
	[ "f"=> "php_fgc_post2", "k"=>"php_fgc_post2", "v"=>"POST: FGC PHP 7+"   , "a"=>$active_apikey, "u"=>$urlHttp],
]);
echo "\n";


// SQLITE database class that is used throughout this program.
function getLastRecord(){
	global $dbFile;
	$dbHandle = new sqlite3_DB_PDO($dbFile) or exit("cannot open the database");
	$sql = "SELECT * FROM tattles ORDER BY tid DESC LIMIT 1;";
	$prep = $dbHandle->prepare( $sql );
	$exec = $dbHandle->execute();
	$results = $dbHandle->statement->fetchAll(PDO::FETCH_ASSOC);
	return $results;
}
