--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE User (
  id INTEGER PRIMARY KEY,
  userName STRING NOT NULL UNIQUE,
  balance INTEGER DEFAULT 0 NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  disabled BOOL DEFAULT FALSE NOT NULL
);

CREATE TABLE TransferTransaction (
  id INTEGER PRIMARY KEY,
  fromUserId INTEGER,
  toUserId INTEGER,
  amount INTEGER NOT NULL CHECK (amount > 0),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (fromUserId) REFERENCES User (id),
  FOREIGN KEY (toUserId) REFERENCES User (id)
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE TransferTransaction;
DROP TABLE User;