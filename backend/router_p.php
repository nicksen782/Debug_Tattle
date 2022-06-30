<?php

// Configure error reporting
error_reporting(E_ALL & ~E_NOTICE & ~E_STRICT & ~E_WARNING);
ini_set('error_log', getcwd() . '/tattle6-error.txt');
ini_set("log_errors", 1);
ini_set("display_errors", 1);

// Configure timezone.
define('TIMEZONE', 'America/Detroit');
date_default_timezone_set(TIMEZONE);

// Get the app root dir.
$_appdir = getcwd() . '/..';
chdir($_appdir);

// Global.
$dbFile = "backend/db/tattle6.db";
$active_apikey = "";

// POST data may be in either $_POST or php://input. 
inputJsonToPost();

// Check for an 'o' value.
$reqMethod = "UNKNOWN";

// DATABASE 
include "backend/db_conn_p.php";
if(!file_exists($dbFile)){ sqlite3_DB_PDO::db_init($dbFile); }

if(!$doNotRun_API_REQUEST){
	// Was a request received? Process it.
	if     ( $_POST['o'] ) { $reqMethod = "POST"; API_REQUEST( $_POST['o'], $_POST ); }
	else if( $_GET ['o'] ) { $reqMethod = "GET" ; API_REQUEST( $_GET['o'] , $_GET  ); }

	// No 'o' value was provided.
	else{
		// $error_debug = [];
		// $i=0;
		// array_push($error_debug, [ (str_pad($i++, 2, "0", STR_PAD_LEFT)) . '*_$test1' => $test1                  ] );	
		// $stats['error_debug'] = $error_debug;

		$_message = [
			"origin" => [ "FILE" =>  __FILE__ , "LINE" =>  __LINE__ , "FUNCTION" => __FUNCTION__ ],
			"data"   => [ 
				'main' => "No 'o' value was provided." ,
			]
		];
		logs_addOne($_message, true);

		$stats['error']=true;
		$stats['error_text']="No 'o' value was provided."  ;
		echo json_encode( $stats );
		exit();
	}
}

// *****

// Handles "routes".
function API_REQUEST($o, $data){
	// Globals.
	global $reqMethod;
	global $active_apikey;
	$active_apikey = $data['key'];

	// Hold the $stats for this call (used for errors.)
	$stats = [];
	$stats['error'] = false;
	$stats['errors'] = [];

	// Make sure that the key is valid. 
	if( !check_apikey($active_apikey, false) || !$active_apikey ){ 
		$stats['error'] = true;
		$stats["error_key"] = "ERROR_LOGIN_BAD_KEY";
		array_push($stats['errors'], "Unauthorized key.");

		$_message = [
			"origin" => [ "FILE" =>  __FILE__ , "LINE" =>  __LINE__ , "FUNCTION" => __FUNCTION__ ],
			"data"   => [ 
				'API_REQUEST' => "Unauthorized key." ,
			]
		];
		logs_addOne($_message, true);
		 
		echo json_encode( $stats);
		exit();
	}

	// Get the user's rights. 
	$userRights = get_rights($data['key']);

	// Make sure that this is not a disabled user.
	if(in_array("DISABLED", $userRights)){ 
		$stats['error'] = true;
		$stats["error_key"] = "ERROR_LOGIN_DISABLED";
		array_push($stats['errors'], "THIS USER IS DISABLED.");

		// Remove the cookie.
		$cookie_name = "debug_tattleV6_apikey";
		$cookie_value = "";
		setcookie($cookie_name, $cookie_value, time() - (86400 * 1));

		$_message = [
			"origin" => [ "FILE" =>  __FILE__ , "LINE" =>  __LINE__ , "FUNCTION" => __FUNCTION__ ],
			"data"   => [ 'API_REQUEST' => "THIS USER IS DISABLED." ] 
		];
		logs_addOne($_message, true);

		echo json_encode( $stats);
		exit();
	}

	// Read the routes from the file. ( Each 'o' value has a "f"unction, "m"ethod, "r"ights, and "a"rguments. )
	$o_values = file_get_contents("backend/routes.json");
	$o_values = json_decode($o_values, true);

	// Tests:
	$hasRequiredRights = check_rights($userRights, $o_values[$o]['r']);
	$knownApi          = (isset( $o_values[$o] ) || array_key_exists( $o_values, $o ));
	$allowed           = $hasRequiredRights;
	$validMethod       = in_array($reqMethod, $o_values[ $o ]['m'], false) ? true : false;

	// Is the API 'o' value known? 
	if( ! $knownApi ){
		$stats['error'] = true;
		// $stats["error_key"] = "ERROR_UNKNOWN_API";
		array_push($stats['errors'], "Unknown API: '$o'.");
	}
	
	// Determine if the user has the rights required.
	if( ! $allowed){
		$stats['error'] = true;
		// $stats["error_key"] = "ERROR_UNAUTHORIZED";
		array_push($stats['errors'], "Unauthorized request to: '$o'.");
	}

	// Can the function be called with the method. (GET/POST?)
	if( ! $validMethod ){
		$stats['error'] = true;
		// $stats["error_key"] = "ERROR_INVALID_METHOD";
		array_push($stats['errors'], "'$o' cannot be used with this method: '$reqMethod'.");
	}

	// If no errors then we can continue. 
	if( ! $stats['error'] ){
		$args = [];
		for($i=0; $i<count($o_values[$o]['a']); $i+=1){
			// Get the key and the variable's datatype.
			$arg = $o_values[$o]['a'][$i];
			$type = gettype($arg);

			// Strings are the key in data that need to be sent. 
			if($type == "string"){
				array_push($args, $data[ $arg ] );
			}

			// If not a string then it should be some other constant like true/false, 0, 1, etc.
			else{
				array_push($args, $arg);
			}
			
		}
		call_user_func_array( $o_values[$o]['f'], ...[$args] ); 
	}

	// If errors were found then report this and end the script.
	else{
		// $error_debug = [];
		// $i=0;
		// $error_debug[ (str_pad($i++, 2, "0", STR_PAD_LEFT)) . '_$stats["errors"]'   ] = $stats['errors'];
		// $stats['error_debug'] = $error_debug;

		echo json_encode( $stats);
		exit();
	}
}

// *****

// Converts POST data from within php://input to $_POST (requires a 'o' key.)
function inputJsonToPost(){
	// Get the data from php://input and try to use json_decode.
	$jsonData = json_decode(file_get_contents('php://input'), true);

	// Test that the JSON is valid. 
	$test1 = $jsonData !== null;
	$test2 = json_last_error();
	$test3 = $test2 === JSON_ERROR_NONE;
	$test4 = isset($jsonData['o']);
	$inputJsonIsValid = $test1 && $test3 && $test4;

	// If the $_POST is empty and the JSON is valid then replace $_POST with the JSON.
	if(empty($_POST) && $inputJsonIsValid){
		$_POST = $jsonData;
	}
}
// Used at the login page.
function login($apikey){
	$stats = [];
	$stats['error'] = false;
	$stats['canLogin'] = true;
	$stats['errors'] = [];
	
	// Check if the apikey is valid. 
	$valid_apikey = check_apikey($apikey, false);
	if(!$valid_apikey){
		$stats['error'] = true;
		$stats["error_key"] = "ERROR_LOGIN_BAD_KEY";
		$stats['canLogin'] = false;
		return $stats;
	}
	else{
		// Check if the apikey is not disabled.
		$userRights = get_rights($apikey);
		if(in_array("DISABLED", $userRights)){ 
			$stats['error'] = true;
			$stats["error_key"] = "ERROR_LOGIN_DISABLED";
			$stats['canLogin'] = false;
			
			// Remove the cookie.
			$cookie_name = "debug_tattleV6_apikey";
			$cookie_value = "";
			setcookie($cookie_name, $cookie_value, time() - (86400 * 1));
	
			return $stats;
		}
	}

	return $stats;
}
// Used when the client page loads.
function validateClient(){
	// Check for the cookie. 
	$url = $_SERVER['REQUEST_SCHEME'] . "://" . $_SERVER['SERVER_ADDR'] . str_replace("app.php", "login.php", $_SERVER['REQUEST_URI']);
	// echo $url;

	// Check for the cookie apikey.
	$apikey = $_COOKIE['debug_tattleV6_apikey'];
	if(!$apikey){
		// Redirect to the login screen with message if the cookie is not present.
		header("Location: $url?msg=ERROR_LOGIN_NO_AUTH", true, 302); // 302 Found
		exit();
	}
	// Check if the apikey is valid and the apikey is not disabled.
	else{
		$results = check_apikey($apikey, false);
		
		// Check if the apikey is valid. 
		if(!$results){
			// Redirect to the login screen with message if the api key is not valid.
			header("Location: $url?msg=ERROR_LOGIN_BAD_KEY", true, 302); // 302 Found
			exit();
		}
		// Check if the apikey is not disabled.
		else{
			$userRights = get_rights($apikey);
			if(in_array("DISABLED", $userRights)){ 
				// Remove the cookie.
				$cookie_name = "debug_tattleV6_apikey";
				$cookie_value = "";
				setcookie($cookie_name, $cookie_value, time() - (86400 * 1));

				// Redirect to the login screen with message if the api is disabled.
				header("Location: $url?msg=ERROR_LOGIN_DISABLED", true, 302); // 302 Found
				exit();
			}
		}
	}
}
// Returns the rights held by the specified apikey.
function get_rights($apikey){
	// Query the database to get the user's rights.

	// If a key was not specified or is blank immediately just return an empty array.
	if(!$apikey) { return []; }

	// Bring in DB object
	global $dbFile;
	$dbHandle = new sqlite3_DB_PDO($dbFile) or exit("cannot open the database");

	// Set the sql.
	$sql = "SELECT * FROM rights;";
	
	// Prepare.
	$prep = $dbHandle->prepare( $sql );
	
	// Execute.
	$exec = $dbHandle->execute();
	
	// Retrieve the rights data in the system.
	$allRights = $dbHandle->statement->fetchAll(PDO::FETCH_ASSOC);
	
	// Compare the system rights against what the user ACTUALLY has.
	$sql2 = "SELECT rights FROM users WHERE apikey = :apikey LIMIT 1;";
	$prep2 = $dbHandle->prepare( $sql2 );
	$dbHandle->bind(':apikey', $apikey);
	$exec2 = $dbHandle->execute();
	$rows2 = $dbHandle->statement->fetch(PDO::FETCH_COLUMN);
	$rows2 = (int) $rows2;

	// Break out the individual right's names into an array.
	$actualRights = [];
	for($i=0; $i<count($allRights); $i+=1){
		$binValue = decbin($allRights[$i]['bitvalue']);
		// $allRights[$i]['mask'] = str_pad($binValue, 8, "0", STR_PAD_LEFT);
		if($binValue & $rows2) { array_push($actualRights, $allRights[$i]['name']); }
	}

	// If the user is DISABLED then reduce the rights down to only "DISABLED".
	if(in_array("DISABLED", $actualRights)){ return ["DISABLED"]; }

	// Return the rights that the user has.
	return $actualRights;
}
// Check required rights against the user's rights. 
function check_rights($actualRights, $requiredRights){
	// Compare the user's $actualRights against the $requiredRights. 

	// How many rights must be matched.
	$rightCountNeeded = count($requiredRights, COUNT_NORMAL);

	// How many rights have been matched.
	$rightCountFound = 0;

	// Count the matched rights.
	foreach ($requiredRights as $r){
		if( in_array($r, $actualRights) ){ $rightCountFound +=1 ; }
	}

	// Does the user have the required rights? (based on count.) 
	if($rightCountFound >= $rightCountNeeded ) { return true; }

	// Nope.
	return false;
}
// Queries the database to determine if the key used is a valid key.
function check_apikey($apikey, $outputAsJson){
	// Bring in DB object
	global $dbFile;
	$dbHandle = new sqlite3_DB_PDO($dbFile) or exit("cannot open the database");

	// Get the SQL.
	$sql = "SELECT apikey FROM users WHERE apikey = :apikey LIMIT 1;";
	
	// Prepare.
	$prep = $dbHandle->prepare( $sql );
	$dbHandle->bind(':apikey', $apikey);
	
	// Execute.
	$exec = $dbHandle->execute();

	$results = $dbHandle->statement->fetch(PDO::FETCH_COLUMN);
	$valid = $results && count($results) ? true : false;

	// Set the cookie if the check is valid.
	if($valid){
		$cookie_name = "debug_tattleV6_apikey";
		$cookie_value = $apikey;
		setcookie($cookie_name, $cookie_value, time() + (86400 * 1));
	}
	// Remove the cookie if the check is invalid.
	else{
		$cookie_name = "debug_tattleV6_apikey";
		$cookie_value = "";
		setcookie($cookie_name, $cookie_value, time() - (86400 * 1));
	}

	// If outputAsJson then send the value back as json (used by the login page.)
	if($outputAsJson){
		echo json_encode([
			"error"   => !$valid, 
			"valid"   => $valid, 
			"error_key"   => "ERROR_LOGIN_BAD_KEY", 
		]);
	}

	// Otherwise send a true/false flag.
	else{
		return $valid; 
	}
}

// *****

function logs_getAll(){
	// Bring in DB object
	global $dbFile;
	$dbHandle = new sqlite3_DB_PDO($dbFile) or exit("cannot open the database");

	$sql = "SELECT * FROM tattles;";
	$prep = $dbHandle->prepare( $sql );
	$exec = $dbHandle->execute();

	// Retrieve.
	$results = $dbHandle->statement->fetchAll(PDO::FETCH_ASSOC);

	echo json_encode($results);
}
function logs_removeAll(){
	// Bring in DB object
	global $dbFile;
	$dbHandle = new sqlite3_DB_PDO($dbFile) or exit("cannot open the database");

	$sql = "DELETE FROM tattles;";
	$prep = $dbHandle->prepare( $sql );
	$exec = $dbHandle->execute();

	echo json_encode("Removed all");
}

// *****

function logs_getSome($filterName, $filterValue){
	// Bring in DB object
	global $dbFile;
	$dbHandle = new sqlite3_DB_PDO($dbFile) or exit("cannot open the database");

	switch($filterName){
		case "ownApikey"       : { 
			global $active_apikey;
			$sql = "SELECT * FROM tattles WHERE apikey = :apikey;";
			$prep = $dbHandle->prepare( $sql );
			$dbHandle->bind(':active_apikey'     , $active_apikey );
			$exec = $dbHandle->execute();
			break; 
		}
		case "otherUserApikey" : { 
			$sql = "SELECT * FROM tattles WHERE apikey = :apikey;";
			$prep = $dbHandle->prepare( $sql );
			$dbHandle->bind(':apikey'     , $filterValue );
			$exec = $dbHandle->execute();
			break; 
		}
		case "unknownUser"     : { 
			$sql = "SELECT * FROM tattles WHERE user = 'UNKNOWN';";
			$prep = $dbHandle->prepare( $sql );
			$dbHandle->bind(':filterValue'     , $filterValue );
			$exec = $dbHandle->execute();
			break; 
		}
		default : { break; }
	}

	// Retrieve.
	$results = $dbHandle->statement->fetchAll(PDO::FETCH_ASSOC);

	echo json_encode($results);
}
function logs_addOne($message, $silent){
	global $reqMethod;
	global $active_apikey;

	// Bring in DB object
	global $dbFile;
	$dbHandle = new sqlite3_DB_PDO($dbFile) or exit("cannot open the database");

	// Handle potential data issues. (ex: GET via NODE http module.)
	$errors = null;
	$parentKeys = count(array_keys($message));
	$dataKeys   = count(array_keys($message['data']));
	$dataIsSet  = isset($message['data']);
	if(!$parentKeys || !$dataKeys || !$dataIsSet){
		$decoded   = json_decode($message, true);
		$jsonError = json_last_error();
		if($jsonError === JSON_ERROR_NONE){ 
			$errors = [
				"!_M1_!"=>"JSON REPAIRED",
				"!_M2_!"=>$reqMethod
			];
			$message = $decoded; 
		}
	}

	// Get the username of the apikey owner. 
	$name = getUserNameByApiKey($active_apikey);

	$sql  = "
		INSERT INTO tattles (  tid,  date,  file,  line,  function,  method,  ip,  user,  apikey,  data,  errors )
		VALUES              ( :tid, :date, :file, :line, :function, :method, :ip, :user, :apikey, :data, :errors );
	";
	$prep = $dbHandle->prepare( $sql );

	$dbHandle->bind(':tid'     , null );
	$dbHandle->bind(':date'    , date('Y-m-d H:i:s') );
	$dbHandle->bind(':file'    , $message['origin']["FILE"]     );
	$dbHandle->bind(':line'    , $message['origin']["LINE"]     );
	$dbHandle->bind(':function', $message['origin']["FUNCTION"] );
	$dbHandle->bind(':method'  , $reqMethod              );
	$dbHandle->bind(':ip'      , $_SERVER['REMOTE_ADDR'] );
	$dbHandle->bind(':user'    , $name                   );
	$dbHandle->bind(':apikey'  , $active_apikey          );
	$dbHandle->bind(':data'    , json_encode($message["data"]) );
	$dbHandle->bind(':errors'  , json_encode($errors) );

	$exec = $dbHandle->execute();

	if(!$silent){
		echo json_encode( "Added tid: " . $dbHandle->lastInsertId() );
	}
}
function logs_removeOne($tid){
	// Bring in DB object
	global $dbFile;
	$dbHandle = new sqlite3_DB_PDO($dbFile) or exit("cannot open the database");

	$sql = "DELETE FROM tattles WHERE tid = :tid;";
	$prep = $dbHandle->prepare( $sql );
	$dbHandle->bind(':tid'     , $tid );
	$exec = $dbHandle->execute();

	echo json_encode("Removed one");
}

// *****

function getUserNameByApiKey($apikey){
	// Make sure that the apikey has a value.
	$apikey = $apikey ? $apikey : "UNKNOWN";

	// Bring in DB object
	global $dbFile;
	$dbHandle = new sqlite3_DB_PDO($dbFile) or exit("cannot open the database");

	// Get the username of the apikey owner. 
	$sql  = "SELECT name FROM users WHERE apikey = :apikey LIMIT 1;";
	$prep = $dbHandle->prepare( $sql );
	$dbHandle->bind(':apikey'    , $apikey);
	$exec = $dbHandle->execute();
	$name = $dbHandle->statement->fetch(PDO::FETCH_COLUMN) ;
	
	// Make sure that a value of some sort is returned. 
	$name = $name ? $name : "UNKNOWN";
	return $name;
}

// *****

