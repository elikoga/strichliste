import { userRepositoryPromise } from '$lib/db';
import type { RequestHandler } from './index.d';

export const get: RequestHandler = async ({}) => {
  const userRepository = await userRepositoryPromise;
  const users = await userRepository.getAll();
  return {
    body: {
      users
    }
  };
};

export const post: RequestHandler = async ({ request }) => {
  const userRepository = await userRepositoryPromise;
  const username = (await request.json()).username;
  // check if user exists
  const user = await userRepository.getByName(username);
  if (user) {
    return {
      status: 400, // bad request
      body: {
        error: 'user already exists'
      }
    };
  }
  // create user
  const uid = await userRepository.create(username);
  return {
    body: {
      uid
    }
  };
};
