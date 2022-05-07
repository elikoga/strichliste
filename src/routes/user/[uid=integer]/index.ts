import {
  changeUserBalance,
  createTransaction,
  deleteUser,
  getLast10UserTransactions,
  getUserById
} from '$lib/db';
import type { RequestHandler } from './index.d';

export const get: RequestHandler = async ({ params }) => {
  const uid = parseInt(params.uid, 10);
  const user = getUserById(uid);
  if (!user) {
    return {
      status: 404, // not found
      body: {
        error: 'user not found'
      }
    };
  }
  // also get the last 10 transactions for the user
  const transferTransactions = getLast10UserTransactions(uid);
  return {
    body: {
      user,
      transferTransactions
    }
  };
};

export type Requests =
  | { type: 'changeBalance'; changeBalance: { amount: number } }
  | {
      type: 'createTransaction';
      createTransaction: { toUserId: number; amount: number };
    };

export const post: RequestHandler = async ({ params, request }) => {
  const uid = parseInt(params.uid, 10);
  // parse request body
  const body = (await request.json()) as Requests;
  switch (body.type) {
    case 'changeBalance':
      const changeBalance = body.changeBalance;
      changeUserBalance(uid, changeBalance.amount);
      return {
        body: {
          success: true
        }
      };
    case 'createTransaction':
      try {
        createTransaction(uid, body.createTransaction.toUserId, body.createTransaction.amount);
      } catch (e) {
        console.error(e);
        return {
          status: 500, // internal server error
          body: {
            error: 'internal server error'
          }
        };
      }
      return {
        body: {
          success: true
        }
      };
    default:
      const exhaustiveCheck: never = body;
      throw new Error(`Unhandled case: ${exhaustiveCheck}`);
  }
};

export const del: RequestHandler = async ({ params }) => {
  const uid = parseInt(params.uid, 10);
  deleteUser(uid);
  return {
    body: {
      success: true
    }
  };
};
