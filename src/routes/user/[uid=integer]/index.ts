import { UserRepository } from '$lib/db';
import type { RequestHandler } from './index.d';

export const get: RequestHandler = async ({ params }) => {
  const uid = parseInt(params.uid, 10);
  const user = UserRepository.getById(uid);
  if (!user) {
    return {
      status: 404, // not found
      body: {
        error: 'user not found'
      }
    };
  }
  // also get the last 10 transactions for the user
  const transferTransactions = UserRepository.getLast10Transactions(uid);
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
      UserRepository.changeBalance(uid, changeBalance.amount);
      return {
        body: {
          success: true
        }
      };
    case 'createTransaction':
      const createTransaction = body.createTransaction;
      try {
        UserRepository.createTransaction(uid, createTransaction.toUserId, createTransaction.amount);
      } catch (e) {
        console.log(e);
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
      return {
        status: 400, // bad request
        body: {
          error: 'invalid request'
        }
      };
  }
};
