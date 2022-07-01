<?php

// SQLITE database class that is used throughout this program.
class sqlite3_DB_PDO{
	//
	private $user = ""; //
	private $pass = ""; //
	public $dbh       ; //
	public $statement ; //
	public $dbFile    ; //

	// Connection details (DSN) and configuration.
	public function __construct($file_db_loc){
		$this->dbFile = $file_db_loc;

		// Timezone.
		date_default_timezone_set('America/Detroit');

		// Options
		$options = array(
			PDO::ATTR_TIMEOUT => 10,                       // timeout in seconds
			// PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION // Show all exception errors.
			// PDO::ATTR_PERSISTENT => true                // Connect is persistant.
		);

		// Create a new PDO instance
		try{
			// Connect to the database.
			$this->dbh = new PDO("sqlite:" . $file_db_loc, $this->user, $this->pass, $options);
		}

		// Catch any PDOException errors
		catch(PDOException $e){
			echo "<pre>";
			echo "ERROR: ";
			print_r($e);
			echo "BACKTRACE: ";
			print_r( debug_backtrace() );
			echo "</pre>";
			exit();
		}
	}

	// Prepare a parameterized query.
	public function prepare($query){
		try{
			$result = $this->dbh->prepare($query);
			$this->statement = $result;
			return $result;
		}
		catch(PDOException $e){
			echo "<pre>";
			echo "ERROR: ";
			print_r($e);
			echo "BACKTRACE: ";
			print_r( debug_backtrace() );
			echo "</pre>";
		}
	}

	// Bind params to a parameterized query.
	public function bind($param, $value, $type = null){
		//Example: $db_pdo->bind(':fname', 'Nick');
		if (is_null($type)) {
			switch ( gettype($value) ) {
				case "boolean"  : { $type = PDO::PARAM_BOOL; break; }
				case "integer"  : { $type = PDO::PARAM_INT ; break; }
				case "string"   : { $type = PDO::PARAM_STR ; break; }
				case "NULL"     : { $type = PDO::PARAM_NULL; break; }
				// case "double"   : { $type = ""; break; }
				// case "array"    : { $type = ""; break; }
				// case "object"   : { $type = ""; break; }
				// case "resource" : { $type = ""; break; }
				default         : { $type = PDO::PARAM_STR; }
			}
		}

		$this->statement->bindValue($param, $value, $type);
	}

	// Run the query.
	public function execute() {
		try{ 
			$result = $this->statement->execute();
			return $result;
		}
		catch(PDOException $e){
			echo "<pre>";
			echo "ERROR: ";
			print_r($e);
			echo "BACKTRACE: ";
			print_r( debug_backtrace() );
			echo "</pre>";
		}
	}

	// Utility functions. 
	public function lastInsertId()      { return $this->dbh      -> lastInsertId();     }
	public function rowCount()          { return $this->statement-> rowCount();         }
	public function beginTransaction()  { return $this->dbh      -> beginTransaction(); }
	public function endTransaction()    { return $this->dbh      -> commit();           }
	public function cancelTransaction() { return $this->dbh      -> rollBack();         }
	public function errorInfo()         { return $this->statement-> errorInfo();        }
	public function vacuum($dbFile)            { 
		$dbHandle = new sqlite3_DB_PDO( $dbFile ) or exit("cannot open the database");

		// SQL.
		$sql = "VACUUM;";

		// Prepare.
		$prep = $dbHandle->prepare($sql);

		// Execute.
		$exec = $dbHandle->execute();

		// Get data.

		// Return.
	}
	static public function db_init($dbFile) { 
		// Bring in DB object
		$dbHandle = new sqlite3_DB_PDO($dbFile) or exit("cannot open the database");

		// Get the SQL.
		$sql = file_get_contents( "backend/db_init/init.sql" ) ;

		// Get the personal SQL (if it exists.)
		if(file_exists("backend/db_init/personal.sql")){ 
			$sql .= file_get_contents( "backend/db_init/personal.sql" ) ;
		}

		// String split on pattern and then remove any blank lines.
		$sqlArray = explode("-- **END*QUERY**", $sql);
		for($i=0; $i<count($sqlArray); $i+=1){
			$sqlArray[$i] = trim($sqlArray[$i]);
			if( !$sqlArray[$i] || empty($sqlArray[$i]) ){ unset($sqlArray[$i]); };
		}

		// Reindex the array.
		$sqlArray = array_values($sqlArray);

		// echo "*********************";
		// echo json_encode($sqlArray, JSON_PRETTY_PRINT);
		// exit();

		// Run each sql query.
		for($i=0; $i<count($sqlArray); $i+=1){
			// Prepare.
			$prep = $dbHandle->prepare( $sqlArray[$i] );
			
			// Execute.
			$exec = $dbHandle->execute();
		}

		// Won't work from the tests_php.php file since logs_addOne doesn't exist there. 
		if(function_exists("logs_addOne")){
			// Make the first tattle.
			$_message = [
				"origin" => [ "FILE" =>  __FILE__ , "LINE" =>  __LINE__ , "FUNCTION" => __FUNCTION__ ],
				"data"   => [ 
					'db_init' => "The database was created just now." ,
				]
			];
			logs_addOne($_message, true);
		}
	}
}