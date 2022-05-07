import { createUser, getAllUsers, getUserByName } from '$lib/db';
import type { RequestHandler } from './index.d';

export const get: RequestHandler = async ({}) => {
  const users = getAllUsers();
  return {
    body: {
      users
    }
  };
};

export const post: RequestHandler = async ({ request }) => {
  const username = (await request.json()).username;
  // check if user exists
  const user = getUserByName(username);
  if (user) {
    return {
      status: 400, // bad request
      body: {
        error: 'user already exists'
      }
    };
  }
  // create user
  const uid = createUser(username);
  return {
    body: {
      uid
    }
  };
};
