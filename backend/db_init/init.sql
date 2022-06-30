CREATE TABLE tattles (
	"tid"       INTEGER PRIMARY KEY AUTOINCREMENT
	,"date"     datetime NOT NULL
	,"method"   VARCHAR
	,"file"     VARCHAR
	,"function" VARCHAR
	,"line"     VARCHAR
	,"ip"       VARCHAR
	,"user"     VARCHAR
	,"apikey"   VARCHAR
	,"data"     text
	,"errors"   text
);
-- **END*QUERY**

CREATE TABLE users (
	"uid"      INTEGER PRIMARY KEY AUTOINCREMENT
	,"name"    VARCHAR
	,"apikey"  VARCHAR
	,"rights"  INTEGER
	,"db_pass" VARCHAR
	,"salt"    VARCHAR
	,"notes"   text
);
-- **END*QUERY**

CREATE TABLE rights (
	"rid"       INTEGER PRIMARY KEY AUTOINCREMENT
	,"name"     VARCHAR
	,"bitvalue" INTEGER
);
-- **END*QUERY**

INSERT INTO rights(rid, name, bitvalue) VALUES
(null, "logs_getAll"   , 1),
(null, "logs_getSome"  , 2),
(null, "logs_addOne"   , 4),
(null, "logs_removeOne", 8),
(null, "logs_removeAll", 16),
(null, "RESERVED_32"   , 32),
(null, "DISABLED"      , 64),
(null, "ADMIN"         , 128);
-- **END*QUERY**
