<script lang="ts">
  import type { TransferTransaction } from '$lib/db';
  import renderMoney from '$lib/renderMoney';
  import assert from 'assert';

  export let transferTransaction: TransferTransaction;

  $: transactionString = (() => {
    const anyNull = transferTransaction.fromUser === null || transferTransaction.toUser === null;
    if (anyNull) {
      const directionString = transferTransaction.fromUser === null ? 'deposited' : 'vaporized';
      // assert one of the users is non-null

      const user = transferTransaction.fromUser ?? transferTransaction.toUser;
      assert(user !== null, `TransferTransaction ${transferTransaction.id} has no user`);
      return `${user.userName} ${directionString} ${renderMoney(transferTransaction.amount)}`;
    } else {
      const fromUser = transferTransaction.fromUser;
      const toUser = transferTransaction.toUser;
      assert(
        fromUser !== null && toUser !== null,
        `TransferTransaction ${transferTransaction.id} has no users`
      );
      return `${fromUser.userName} paid ${toUser.userName} ${renderMoney(
        transferTransaction.amount
      )}`;
    }
  })();
</script>

<p>[{new Date(transferTransaction.createdAt).toISOString()}] {transactionString}</p>
