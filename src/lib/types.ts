export type User = {
  id: number;
  userName: string;
  balance: number;
  createdAt: string;
  disabled: boolean;
};
export type TransferTransaction = {
  id: number;
  fromUser: User | null;
  toUser: User | null;
  amount: number;
  createdAt: string;
};
