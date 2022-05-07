import { getAllUserTransactions, getUserById } from '$lib/db';
import type { RequestHandler } from './transactions.d';

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
  const transferTransactions = getAllUserTransactions(uid);
  return {
    body: {
      user,
      transferTransactions
    }
  };
};
