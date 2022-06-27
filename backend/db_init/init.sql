CREATE TABLE if not exists tattles (
	"tid"       INTEGER PRIMARY KEY AUTOINCREMENT
	,"date"     datetime NOT NULL
	,"file"     VARCHAR
	,"line"     VARCHAR
	,"function" VARCHAR
	,"ip"       VARCHAR
	,"user"     VARCHAR
	,"data"     text
);

CREATE TABLE if not exists users (
	"uid"      INTEGER PRIMARY KEY AUTOINCREMENT
	,"name"    VARCHAR
	,"apikey"  VARCHAR
	,"db_pass" VARCHAR
	,"salt"    VARCHAR
	,"notes"   text
);