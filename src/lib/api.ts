import { invalidate } from '$app/navigation';
import assert from 'assert';
import type { Requests } from 'src/routes/user/[uid=integer]';
import type { User } from './types';
import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';

export const getAllUsers = async () => {
  const response = await fetch('/user', {
    headers: {
      Accept: 'application/json'
    }
  });
  return (await response.json()).users as User[];
};

export const getUserById = async (uid: number) => {
  const response = await fetch(`/user/${uid}`, {
    headers: {
      Accept: 'application/json'
    }
  });

  return (await response.json()).user as User;
};

export const createTransaction = async (fromUserId: number, toUserId: number, amount: number) => {
  const $_ = get(_);
  assert(amount > 0, $_('error.amountHasToBePositive'));
  assert(fromUserId !== toUserId, $_('error.cannotTransferToSelf'));
  assert(fromUserId !== null, $_('error.userCannotBeNull'));
  assert(toUserId !== null, $_('error.userCannotBeNull'));
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
    throw new Error($_('error.transactionFailed'));
  }
  await invalidate('/user');
  await invalidate(`/user/${fromUserId}`);
  await invalidate(`/user/${toUserId}`);
};

export const createUser = async (username: string) => {
  const $_ = get(_);
  assert(username, $_('error.usernameIsRequired'));
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
  const uid = (await response.json()).uid as number;
  await invalidate('/user');
  await invalidate(`/user/${uid}`);
  return uid;
};

export const changeUserBalance = async (uid: number, amount: number) => {
  const $_ = get(_);
  assert(amount !== 0, $_('error.amountCannotBeZero'));
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
