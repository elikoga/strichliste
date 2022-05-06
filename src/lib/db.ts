import sqlite from 'better-sqlite3';
import assert from 'assert';
import { migrate } from './dbMigrate';

const db = (() => {
  const db = sqlite(
    './strichliste.db'
    //{ verbose: console.log }
  );
  // migrate
  migrate(db, { reapplyLast: false });
  return db;
})();

type DBUser = {
  id: number;
  userName: string;
  balance: number;
  createdAt: string;
  disabled: boolean;
};

export type User = {
  id: number;
  userName: string;
  balance: number;
  createdAt: string;
  disabled: boolean;
};

const fixUser = (user: DBUser): User => ({
  id: user.id,
  userName: user.userName,
  balance: user.balance,
  createdAt: new Date(user.createdAt + 'Z').toISOString(),
  disabled: user.disabled
});

type DBTransferTransaction = {
  id: number;
  fromUserId: number | null;
  toUserId: number | null;
  amount: number;
  createdAt: string;
};

export type TransferTransaction = {
  id: number;
  fromUser: User | null;
  toUser: User | null;
  amount: number;
  createdAt: string;
};

type Unpromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never;
// from https://stackoverflow.com/questions/53189169/resolve-a-promise-in-a-typescript-type

export class UserRepository {
  static create(userName: string): number {
    const user = db.prepare('INSERT INTO User (userName) VALUES (?)').run([userName]);
    assert(user.lastInsertRowid, 'user not created');
    // also assert that type is number
    assert(typeof user.lastInsertRowid === 'number', 'user id must be number');
    return user.lastInsertRowid;
  }
  static getByName(userName: string): User | undefined {
    const user = db.prepare('SELECT * FROM User WHERE userName = ?').get(userName) as DBUser;
    return user && fixUser(user);
  }
  static getById(userId: number): User | undefined {
    const user = db.prepare('SELECT * FROM User WHERE id = ?').get(userId) as DBUser;
    return user && fixUser(user);
  }
  static getAll(): User[] {
    const users = db.prepare('SELECT * FROM User').all() as DBUser[];
    return users.map((u) => fixUser(u));
  }
  static getLast10Transactions(userId: number | null): TransferTransaction[] {
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
    users.forEach((u) => userMap.set(u.id, fixUser(u)));
    return transactions.map((t) => {
      const fromUser = (t.fromUserId != null && userMap.get(t.fromUserId)) || null;
      const toUser = (t.toUserId != null && userMap.get(t.toUserId)) || null;
      return {
        id: t.id,
        fromUser,
        toUser,
        amount: t.amount,
        createdAt: new Date(t.createdAt + 'Z').toISOString()
      };
    });
  }
  static createTransaction(fromUserId: number | null, toUserId: number | null, amount: number) {
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
  }
  static changeBalance(userId: number, amount: number) {
    // if amount negative, then it is a transfer from user to bank
    // if amount positive, then it is a transfer from bank to user
    if (amount > 0) {
      this.createTransaction(null, userId, amount);
    } else {
      this.createTransaction(userId, null, -amount);
    }
  }
  static delete(userId: number) {
    db.prepare('DELETE FROM User WHERE id = ?').run(userId);
  }
}
