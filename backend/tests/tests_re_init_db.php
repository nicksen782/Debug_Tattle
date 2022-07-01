<?php
// Get the app root dir and switch to it.
$_appdir = getcwd() . '/../..'; // Move back two dirs.
chdir($_appdir);

include "backend/db_conn_p.php";
$dbFile = "backend/db/tattle6.db";

echo "** Removing the database file **\n";
unlink($dbFile);

echo "** Re-init the database **\n";
if(!file_exists($dbFile)){ sqlite3_DB_PDO::db_init($dbFile); }

?>