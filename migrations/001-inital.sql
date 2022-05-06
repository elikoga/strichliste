--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE User (
  id INTEGER PRIMARY KEY,
  userName STRING NOT NULL UNIQUE,
  balance INTEGER DEFAULT 0 NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE TransferTransaction (
  id INTEGER PRIMARY KEY,
  fromUserId INTEGER,
  toUserId INTEGER,
  amount INTEGER NOT NULL CHECK (amount > 0),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (fromUserId) REFERENCES User (id) ON DELETE SET NULL,
  FOREIGN KEY (toUserId) REFERENCES User (id) ON DELETE SET NULL
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE TransferTransaction;
DROP TABLE User;