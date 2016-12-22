<?php
date_default_timezone_set('America/Detroit');
ini_set('error_log', 'HELP_php-error.txt');

$mypath=dirname(__FILE__)."/dt5.db";
$GLOBALS['dt5_db'] = "sqlite:".$mypath;

// Make sure the database file is there. If it is not, then recreate it from the template.
if( ! file_exists( substr($GLOBALS['dt5_db'], 7) )){
	// Create the file. By trying to open the file it will be created!
	$tattle5_db = $GLOBALS['dt5_db'];
	$dbhandle  = new sqlite3_DB_PDO_tattle($tattle5_db) or die("cannot open the database");
	$s_SQL = file_get_contents( "sql.sql" ) ;
	$prp = $dbhandle->prepare($s_SQL);
	$retval = $dbhandle->execute();
	tattle5("New database created!", $retval);
}

// This function is the function that is called OUTSIDE of this program.
function tattle5($smsg, $lmsg){
	$tattle5_db = $GLOBALS['dt5_db'];
	$dbhandle  = new sqlite3_DB_PDO_tattle($tattle5_db) or die("cannot open the database");

	// SQL query to insert this data as a new record.
	$s_SQL = "
		INSERT INTO debug_tattle
		(
			  shortmsg
			, longmsg
			, backtrace
			, post
			, get
			, request
			, session
			, files
			, server
			, thedate
			, user
		)
		VALUES
		(
			  :shortmsg
			, :longmsg
			, :backtrace
			, :post
			, :get
			, :request
			, :session
			, :files
			, :server
			, :thedate
			, :user
		);
    ";
	// Prepare the query.
	$dbhandle->prepare($s_SQL);

	// Bind the data then execute.
	$dbhandle->bind(':shortmsg',  $smsg);
	$dbhandle->bind(':longmsg',   json_encode($lmsg));
	$dbhandle->bind(':backtrace', json_encode(debug_backtrace()));
	$dbhandle->bind(':post',      json_encode($_POST));
	$dbhandle->bind(':get',       json_encode($_GET));
	$dbhandle->bind(':request',   json_encode($_REQUEST));
	$dbhandle->bind(':session',   json_encode($_SESSION));
	$dbhandle->bind(':files',     json_encode($_FILES));
	$dbhandle->bind(':server',    json_encode($_SERVER));
	$dbhandle->bind(':thedate',   time());
	$dbhandle->bind(':user',      "");

	// Execute the query.
	$retval = $dbhandle->execute();

}

if(isset($_POST['o'])){
	if($_POST['o'] == 'getTattleList') 				{ getTattleList();			exit(); }
	if($_POST['o'] == 'openTattle') 				{ openTattle();				exit(); }
	if($_POST['o'] == 'deleteTattle')				{ deleteTattle();			exit(); }
	if($_POST['o'] == 'deleteStaleTattles') 		{ deleteStaleTattles();		exit(); }
	if($_POST['o'] == 'deleteAllTattles') 			{ deleteAllTattles();		exit(); }
}

function getTattleList(){
	// Prepares this query.
	$tattle5_db = $GLOBALS['dt5_db'];
	$dbhandle  = new sqlite3_DB_PDO_tattle($tattle5_db) or die("cannot open the database");

	// Query to retrieve records. Order by newer records at the top.
	$query1="
		SELECT id, shortmsg, thedate, user
		FROM debug_tattle
		ORDER BY id DESC
	;";

	// Prepares this query.
	$dbhandle->prepare($query1);

	// Execute the query.
	$retval_execute1 = $dbhandle->statement->execute();

	// Retrieve rows.
	$result['rows'] = $dbhandle->statement->fetchAll(PDO::FETCH_ASSOC) ;

	// Count number of rows returned. (SQLITE doesn't have a rowCount() function.)
	$result['tattleRowCount'] = sizeof($result['rows']);

	// Now go through all of the records and determine which of them are stale (older than 5 minutes).
	$nowdatetime = strtotime('300 seconds ago');

	for($i=0; $i<sizeof($result['rows']); $i++){
		// Add in the new key, stale
		// $result['rows'][$i]['stale']="";

		// Add in the new key, secondsago.
		// $result['rows'][$i]['secondsago']= ( (strtotime('now') - ($result['rows'][$i]['date']))) ;

		// Set key to 'STALE' if record is stale.
		// if(strtotime($result['rows'][$i]['date'])<$nowdatetime){
		// 	$result['rows'][$i]['stale']="STALE";
		// }

		// Give a nice date.
		$result['rows'][$i]['thedate'] = date("Y-m-d H:i:s", ( $result['rows'][$i]['thedate'] ));
	}

	// Return all the data.
	echo json_encode($result);

	// echo $dbhandle->print_r_2_string($result);
}

function openTattle(){
	// Prepares this query.
	$tattle5_db = $GLOBALS['dt5_db'];
	$dbhandle  = new sqlite3_DB_PDO_tattle($tattle5_db) or die("cannot open the database");

	// Query to retrieve records. Order by newer records at the top.
	$query1="
		SELECT *
		FROM debug_tattle
		WHERE id = :id
		LIMIT 1
	;";

	// Prepares this query.
	$dbhandle->prepare($query1);

	// Bind values.
	$dbhandle->bind(':id', $_POST['id']);

	// Execute the query.
	$retval_execute1 = $dbhandle->statement->execute();

	// Fetch the records.
	$result = $dbhandle->statement->fetchAll(PDO::FETCH_ASSOC) ;

	// Make the date look nice.
	$result[0]['thedate'] = date("Y-m-d H:i:s", ( $result[0]['thedate'] ));

	// Return all the data.
	echo json_encode($result);
}

function deleteTattle(){
	// Prepares this query.
	$tattle5_db = $GLOBALS['dt5_db'];
	$dbhandle  = new sqlite3_DB_PDO_tattle($tattle5_db) or die("cannot open the database");

	// SQL delete query.
	$statement_SQL = "
		DELETE
		FROM debug_tattle
		WHERE id = :id
	;";

	// Prepare, bind placeholders, then execute the SQL query.
	$dbhandle->prepare($statement_SQL);
		$dbhandle->bind(':id', $_POST['id']);
	$retval_execute1 = $dbhandle->execute();

	// Output the data.
	echo json_encode(
		array(
			"retval_execute1" => $retval_execute1,
		)
	);
}

function deleteAllTattles(){
	// Prepares this query.
	$tattle5_db = $GLOBALS['dt5_db'];
	$dbhandle  = new sqlite3_DB_PDO_tattle($tattle5_db) or die("cannot open the database");

	// SQL delete query.
	$statement_SQL = "
		DELETE
		FROM debug_tattle
	;";

	// Prepare, bind placeholders, then execute the SQL query.
	$dbhandle->prepare($statement_SQL);
	$retval_execute1 = $dbhandle->execute();

	// The database is clear. This is a good time to do a vacuum !
	VACUUMdb();

	// Output the data.
	echo json_encode(
		array(
			"retval_execute1" => $retval_execute1,
		)
	);

}

function VACUUMdb(){
	// Bring in DB object
	$tattle5_db = $GLOBALS['dt5_db'];
	$dbhandle  = new sqlite3_DB_PDO_tattle($tattle5_db) or die("cannot open the database");

	// This query is very simple.
	$statement_SQL="VACUUM;";

	// Prepare then execute the SQL query.
	$prp = $dbhandle->prepare($statement_SQL);
	$retval_execute1 = $dbhandle->execute();
	$result = $dbhandle->statement->fetchAll(PDO::FETCH_ASSOC) ;

	// // Output the data.
	// echo json_encode(
	// 	array(
	// 		"retval_execute1" => $retval_execute1,
	// 		"result"          => $result
	// 	)
	// );
}

// DONE - SQLITE database class that is used throughout this program.
class sqlite3_DB_PDO_tattle{
	// http://www.if-not-true-then-false.com/2012/php-pdo-sqlite3-example/
	// http://stackoverflow.com/a/16728310

	private $user = "";				//
	private $pass = "";				//
	public $dbh;					// The DB handle.
	public $statement;				// The prepared statement handle.
	public $error;					// Errors can go here.
	// private $host = '127.0.0.1' ;	// HOSTNAME
	// private $host = 'localhost' ;	// HOSTNAME
	// private $dbname;					// Database name.

	public function __construct($file_db_loc){
		// echo "eat it!";
		// Connection details (DSN) and configuration.
		// Timezone.
		date_default_timezone_set('America/Detroit');

		// Options
			$options = array(
				PDO::ATTR_TIMEOUT => 10, 						// timeout in seconds
				// PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION	// Show all exception errors.
				// PDO::ATTR_PERSISTENT => true					// Connect is persistant.
			);

		// Create a new PDO instance
		try{
			// Connect to the database.
			$this->dbh = new PDO($file_db_loc, $this->user, $this->pass, $options);
		}

		// Catch any PDOException errors
		catch(PDOException $e){
			echo "<pre>! $file_db_loc (((((((((((((())))))))))))))";
			print_r($e);
			echo "</pre>";
			// If we cannot connect to the DB then we shouldn't create a tattle.
			// BUG: We should indicate the error somehow though...

			// These lines could be uncommented for debug reasons:
			// echo $this->print_r_2_string($e);
			// echo $file_db_loc."<br><hr><br>";
			// echo $GLOBALS['dt4_db']."<br><hr><br>";

			// echo "<pre>XXX ";print_r($GLOBALS['dt4_db']);echo " XXX</pre>";
			// echo $this->print_r_2_string($e);
			// $GLOBALS['dt4_db']
			exit();
		}
	}

	public function prepare($query){
		try{ $this->statement = $this->dbh->prepare($query);}
		catch(PDOException $e){
			// BUG: We should indicate the error somehow though...
			// echo "bad prepare!";
			// tattle4('Error during prepare.', json_encode(array("<br><hr><br>",'e:'=>$e_values, "<br><hr><br>", 'pdo_debug_StrParams:'=>$pdo_debug_StrParams, "<br><hr><br>",)), false);
			// tattle4('Error during prepare.', json_encode(array("<br><hr><br>",'e:'=>$e_values, "<br><hr><br>", 'pdo_debug_StrParams:'=>$pdo_debug_StrParams, "<br><hr><br>",)), true);
		}
	}

	public function bind($param, $value, $type = null){
		//Example: $db_pdo->bind(':fname', 'Jenny');
		if (is_null($type)) {
			switch (true) {
				case is_int($value):
					$type = PDO::PARAM_INT;
					break;
				case is_bool($value):
					$type = PDO::PARAM_BOOL;
					break;
				case is_null($value):
					$type = PDO::PARAM_NULL;
					break;
				default:
					$type = PDO::PARAM_STR;
			}
		}
		// echo "<pre>";
		// print_r(debug_backtrace());
		// echo "</pre>";
		$this->statement->bindValue($param, $value, $type);
	}

	public function execute()			{
		try{ return $this->statement->execute(); }
		catch(PDOException $e){
			// BUG: We should indicate the error somehow though...
			echo "crap!!!";
			exit();
			// $pdo_debug_StrParams = $this->pdo_debugStrParams();
			// $e_values = $this->print_r_2_string($e);

			// echo json_encode($e_values, JSON_PRETTY_PRINT);
			// tattle4('globals: =>$GLOBALS', $GLOBALS, true);
			// tattle4('Error during execute.', json_encode(array("<br><hr><br>",'e:'=>$e_values, "<br><hr><br>", 'pdo_debug_StrParams:'=>$pdo_debug_StrParams, "<br><hr><br>",)), false);
			// tattle4('Error during execute.', json_encode(array("<br><hr><br>",'e:'=>$e_values, "<br><hr><br>", 'pdo_debug_StrParams:'=>$pdo_debug_StrParams, "<br><hr><br>",)), true);
		}
	}
	public function lastInsertId()		{ return $this->dbh->lastInsertId(); }
	public function rowCount()			{ return $this->statement->rowCount(); }
	public function beginTransaction()	{ return $this->dbh->beginTransaction(); }
	public function endTransaction()	{ return $this->dbh->commit(); }
	public function cancelTransaction()	{ return $this->dbh->rollBack(); }

	public function debugDumpParams()	{ return pdo_debugStrParams(); }

	public function print_r_2_string($value){
		ob_start();
		// Get the value which will be put into the buffer.
		print_r($value);
		// Get the contents of that buffer.
		$r = ob_get_contents();
		// Clear the buffer.
		ob_end_clean();

		// Clean up the value.
		$r = str_replace("\t","   ", $r) ;
		$r = nl2br($r);
		$r = str_replace("\n","", $r) ;
		$r='\n'.$r;

		// Return the value.
		return $r;
	}

	private function pdo_debugStrParams() {
		// Turn on the output buffer.
		ob_start();
		// Get the value which will be put into the buffer.
		$this->statement->debugDumpParams();
		// Get the contents of that buffer.
		$r = ob_get_contents();
		// Clear the buffer.
		ob_end_clean();

		// Clean up the value.
		$r = str_replace("\t","   ", $r) ;
		$r = nl2br($r);
		$r = str_replace("\n"," ", $r) ;
		$r = str_replace("Key: Name: ","<br>Key: Name: ", $r) ;
		$r='\n'.$r;

		// Return the value.
		return $r;
	}
}
?>