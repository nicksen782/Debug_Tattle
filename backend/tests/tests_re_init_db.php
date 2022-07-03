<?php
// Change to the dir of this script.
chdir(__DIR__ );

include "../db_conn_p.php";
$dbFile = "../db/tattle6.db";

echo "** Removing the database file **\n";
unlink($dbFile);

echo "** Re-init the database **\n";
if(!file_exists($dbFile)){ sqlite3_DB_PDO::db_init($dbFile); }

?>