import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import assert from 'assert';

const dbPromise = (async () => {
  const db = await open({
    filename: './strichliste.db',
    driver: sqlite3.cached.Database
  });
  await db.migrate();
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

class UserRepository {
  db: Unpromise<typeof dbPromise>;
  constructor(db: Unpromise<typeof dbPromise>) {
    this.db = db;
  }
  async create(userName: string): Promise<number> {
    const user = await this.db.run('INSERT INTO User (userName) VALUES (?)', [userName]);
    assert(user.lastID, 'user not created');
    return user.lastID;
  }
  async getByName(userName: string): Promise<User | undefined> {
    const user = await this.db.get<DBUser>('SELECT * FROM User WHERE userName = ?', [userName]);
    return user && fixUser(user);
  }
  async getById(userId: number): Promise<User | undefined> {
    const user = await this.db.get<DBUser>('SELECT * FROM User WHERE id = ?', [userId]);
    return user && fixUser(user);
  }
  async getAll(): Promise<User[]> {
    const users = await this.db.all<DBUser[]>('SELECT * FROM User');
    return users.map((u) => fixUser(u));
  }
  async getLast10Transactions(userId: number | null): Promise<TransferTransaction[]> {
    const transactions = await this.db.all<DBTransferTransaction[]>(
      `
    SELECT * FROM TransferTransaction
    WHERE fromUserId = ? OR toUserId = ?
    ORDER BY createdAt DESC
    LIMIT 10
    `,
      [userId, userId]
    );
    const userIDs = transactions.flatMap((t) => [
      ...(t.fromUserId ? [t.fromUserId] : []),
      ...(t.toUserId ? [t.toUserId] : [])
    ]);
    const placeholders = userIDs.map(() => `?`).join(',');
    const users = await this.db.all<DBUser[]>(
      `SELECT * FROM User WHERE id IN (${placeholders})`,
      userIDs
    );
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
  async createTransaction(
    fromUserId: number | null,
    toUserId: number | null,
    amount: number
  ): Promise<void> {
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
    const queryString = `
      BEGIN;
      INSERT INTO TransferTransaction (fromUserId, toUserId, amount) VALUES (${fromUserId}, ${toUserId}, ${amount});
      ${fromUserId ? `UPDATE User SET balance = balance - ${amount} WHERE id = ${fromUserId};` : ''}
      ${toUserId ? `UPDATE User SET balance = balance + ${amount} WHERE id = ${toUserId};` : ''}
      COMMIT;
      `;

    await this.db.exec(queryString);
  }

  async changeBalance(userId: number, amount: number): Promise<void> {
    // if amount negative, then it is a transfer from user to bank
    // if amount positive, then it is a transfer from bank to user
    if (amount > 0) {
      await this.createTransaction(null, userId, amount);
    } else {
      await this.createTransaction(userId, null, -amount);
    }
  }
  async disable(userId: number): Promise<void> {
    await this.db.run('UPDATE User SET disabled = 1 WHERE id = ?', [userId]);
  }
  async enable(userId: number): Promise<void> {
    await this.db.run('UPDATE User SET disabled = 0 WHERE id = ?', [userId]);
  }
  async rename(userId: number, userName: string): Promise<void> {
    await this.db.run('UPDATE User SET userName = ? WHERE id = ?', [userName, userId]);
  }
  async archive(userId: number): Promise<void> {
    // archive by disabling and renaming to [ARCHIVED] + nonce + userName
    await this.db.run(
      `UPDATE User SET disabled = 1, userName = '[ARCHIVED] ' || datetime('now') || ' ' || userName WHERE id = ?;`,
      [userId]
    );
  }
}

export const userRepositoryPromise = dbPromise.then((db) => new UserRepository(db));
