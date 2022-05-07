import { invalidate } from '$app/navigation';
import assert from 'assert';
import type { Requests } from 'src/routes/user/[uid=integer]';
import type { User } from './types';

export const getAllUsers = async () => {
  const response = await fetch('/user', {
    headers: {
      Accept: 'application/json'
    }
  });
  return (await response.json()).users as User[];
};

export const createTransaction = async (fromUserId: number, toUserId: number, amount: number) => {
  assert(amount > 0, 'Amount must be greater than 0');
  assert(fromUserId !== toUserId, 'You cannot transfer money to yourself');
  assert(fromUserId !== null, 'From user id must be set');
  assert(toUserId !== null, 'To user id must be set');
  const request: Requests = {
    type: 'createTransaction',
    createTransaction: {
      amount,
      toUserId
    }
  };
  const response = await fetch(`/user/${fromUserId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(request)
  });
  if (!response.ok) {
    const error = await response.json();
    console.error(error);
    throw new Error('Something went wrong creating Transaction');
  }
  await invalidate('/user');
  await invalidate(`/user/${fromUserId}`);
  await invalidate(`/user/${toUserId}`);
};

export const createUser = async (username: string) => {
  const response = await fetch('/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      username
    })
  });
  if (!response.ok) {
    const error = await response.json();
    console.error(error);
    throw new Error(error.error);
  }
  return (await response.json()).uid as number;
};

export const changeUserBalance = async (uid: number, amount: number) => {
  const request: Requests = {
    type: 'changeBalance',
    changeBalance: {
      amount
    }
  };
  const response = await fetch(`/user/${uid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(request)
  });
  if (!response.ok) {
    const error = await response.json();
    console.error(error);
    throw new Error(error.error);
  }
  await invalidate('/user');
  await invalidate(`/user/${uid}`);
};

export const deleteUser = async (uid: number) => {
  const response = await fetch(`/user/${uid}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json'
    }
  });
  if (!response.ok) {
    const error = await response.json();
    console.error(error);
    throw new Error(error.error);
  }
  await invalidate('/user');
};
