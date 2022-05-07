import sqlite from 'better-sqlite3';
import assert from 'assert';
import { migrate } from './dbMigrate';
import type { TransferTransaction, User } from './types';

const db = (() => {
  const db = sqlite('./strichliste.db', { verbose: console.log });
  // migrate
  migrate(db, { reapplyLast: false });
  return db;
})();

const normalizeDateString = (dateString: string): string =>
  new Date(dateString + 'Z').toISOString();

const fixCreatedAt = <T extends { createdAt: string }>(entry: T): T => ({
  ...entry,
  createdAt: normalizeDateString(entry.createdAt)
});

export const createUser = (userName: string): number => {
  const user = db.prepare('INSERT INTO User (userName) VALUES (?)').run([userName]);
  assert(user.lastInsertRowid, 'user not created');
  // also assert that type is number
  assert(typeof user.lastInsertRowid === 'number', 'user id must be number');
  return user.lastInsertRowid;
};

export const getUserByName = (userName: string): User | undefined => {
  const user = db.prepare('SELECT * FROM User WHERE userName = ?').get(userName) as User;
  return user && fixCreatedAt(user);
};

export const getUserById = (userId: number): User | undefined => {
  const user = db.prepare('SELECT * FROM User WHERE id = ?').get(userId) as User;
  return user && fixCreatedAt(user);
};

export const getAllUsers = (): User[] => {
  const users = db.prepare('SELECT * FROM User').all() as User[];
  return users.map((u) => fixCreatedAt(u));
};

export const getLast10UserTransactions = (userId: number | null): TransferTransaction[] => {
  const transactions = db
    .prepare(
      `
    SELECT * FROM TransferTransaction
    WHERE fromUserId = ? OR toUserId = ?
    ORDER BY createdAt DESC
    LIMIT 10
    `
    )
    .all([userId, userId]);
  const userIDs = [
    ...new Set(
      transactions.flatMap((t) => [
        ...(t.fromUserId ? [t.fromUserId] : []),
        ...(t.toUserId ? [t.toUserId] : [])
      ])
    )
  ];
  const placeholders = userIDs.map(() => `?`).join(',');
  const users = db.prepare(`SELECT * FROM User WHERE id IN (${placeholders})`).all(userIDs);
  const userMap = new Map<number, User>();
  users.forEach((u) => userMap.set(u.id, u));
  return transactions.map((t) => {
    const fromUser = (t.fromUserId != null && userMap.get(t.fromUserId)) || null;
    const toUser = (t.toUserId != null && userMap.get(t.toUserId)) || null;
    return fixCreatedAt({
      ...t,
      fromUser,
      toUser
    });
  });
};

export const getAllUserTransactions = (userId: number): TransferTransaction[] => {
  const transactions = db
    .prepare(
      `
    SELECT * FROM TransferTransaction
    WHERE fromUserId = ? OR toUserId = ?
    ORDER BY createdAt DESC
    `
    )
    .all([userId, userId]);
  const userIDs = [
    ...new Set(
      transactions.flatMap((t) => [
        ...(t.fromUserId ? [t.fromUserId] : []),
        ...(t.toUserId ? [t.toUserId] : [])
      ])
    )
  ];
  const placeholders = userIDs.map(() => `?`).join(',');
  const users = db.prepare(`SELECT * FROM User WHERE id IN (${placeholders})`).all(userIDs);
  const userMap = new Map<number, User>();
  users.forEach((u) => userMap.set(u.id, u));
  return transactions.map((t) => {
    const fromUser = (t.fromUserId != null && userMap.get(t.fromUserId)) || null;
    const toUser = (t.toUserId != null && userMap.get(t.toUserId)) || null;
    return fixCreatedAt({
      ...t,
      fromUser,
      toUser
    });
  });
};

export const createTransaction = (
  fromUserId: number | null,
  toUserId: number | null,
  amount: number
) => {
  // make sure the types are actually correct
  assert(
    fromUserId == null || typeof fromUserId === 'number',
    'SQL INJECTION! fromUserId must be null or number'
  );
  assert(
    toUserId == null || typeof toUserId === 'number',
    'SQL INJECTION! toUserId must be null or number'
  );
  assert(typeof amount === 'number', 'SQL INJECTION! amount must be number');
  // also assert > 0
  assert(amount > 0, 'amount must be > 0');
  db.transaction(() => {
    db.prepare(
      'INSERT INTO TransferTransaction (fromUserId, toUserId, amount) VALUES (?, ?, ?)'
    ).run(fromUserId, toUserId, amount);
    if (fromUserId) {
      db.prepare('UPDATE User SET balance = CAST((balance - (?)) AS INTEGER) WHERE id = ?').run(
        amount,
        fromUserId
      );
    }
    if (toUserId) {
      db.prepare('UPDATE User SET balance = CAST((balance + (?)) AS INTEGER) WHERE id = ?').run(
        amount,
        toUserId
      );
    }
  })();
};

export const changeUserBalance = (userId: number, amount: number) => {
  // if amount negative, then it is a transfer from user to bank
  // if amount positive, then it is a transfer from bank to user
  if (amount > 0) {
    createTransaction(null, userId, amount);
  } else {
    createTransaction(userId, null, -amount);
  }
};

export const deleteUser = (userId: number) => {
  db.transaction(() => {
    db.prepare('DELETE FROM User WHERE id = ?').run(userId);
    // delete transactions where from and to is null
    db.prepare(
      'DELETE FROM TransferTransaction WHERE fromUserId IS NULL AND toUserId IS NULL'
    ).run();
  })();
};
