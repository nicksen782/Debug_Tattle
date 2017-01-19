CREATE TABLE if not exists debug_tattle
    (
      id INTEGER  PRIMARY KEY AUTOINCREMENT,
      shortmsg VARCHAR,
      longmsg text,
      backtrace text,
      post text ,
      get text ,
      request text ,
      session text,
      files text,
      server text,
      thedate datetime NOT NULL,
      user VARCHAR,
      appfilter text
    );
