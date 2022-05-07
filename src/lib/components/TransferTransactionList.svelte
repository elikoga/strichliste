<script lang="ts">
  import renderMoney from '$lib/renderMoney';
  import type { TransferTransaction, User } from '$lib/types';
  import assert from 'assert';
  import Grid from 'gridjs-svelte';
  import type { UserConfig } from 'gridjs';
  import { html } from 'gridjs';
  import 'gridjs/dist/theme/mermaid.css';

  export let transferTransactions: TransferTransaction[];

  const columns: UserConfig['columns'] = [
    { id: 'id', name: 'ID' },
    { id: 'amount', name: 'Amount', formatter: renderMoney },
    {
      id: 'fromUser',
      name: 'From',
      formatter: (user) => {
        // if user is string, just return it
        if (typeof user === 'string') {
          return user;
        } else if (user === null) {
          return html('<b>Deposited</b>');
        } else {
          // assert it's a User, so it has a userName
          assert(typeof user === 'object', `User is not an object`);
          const isUser = (user: any): user is User => typeof (user as any).userName === 'string';
          assert(isUser(user), `User is not a User`);
          return user.userName;
        }
      }
    },
    {
      id: 'toUser',
      name: 'To',
      formatter: (user) => {
        // if user is string, just return it
        if (typeof user === 'string') {
          return user;
        } else if (user === null) {
          return html('<b>Paid</b>');
        } else {
          // assert it's a User, so it has a userName
          assert(typeof user === 'object', `User is not an object`);
          const isUser = (user: any): user is User => typeof (user as any).userName === 'string';
          assert(isUser(user), `User is not a User`);
          return user.userName;
        }
      }
    },
    {
      id: 'createdAt',
      name: 'Created At',
      formatter: (createdAt) => {
        assert(typeof createdAt === 'string', `createdAt is not a string`);
        return new Date(createdAt).toLocaleString();
      }
    }
  ];

  let table: HTMLDivElement;
</script>

<Grid sort {columns} data={transferTransactions} />
