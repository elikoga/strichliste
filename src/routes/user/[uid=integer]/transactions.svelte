<script lang="ts">
  import TransferTransactionList from '$lib/components/TransferTransactionList.svelte';

  import type { TransferTransaction, User } from '$lib/types';

  import { _ } from 'svelte-i18n';

  export let user: User;
  export let transferTransactions: TransferTransaction[];
</script>

<div class="Subhead">
  <h2 class="Subhead-heading ">
    {$_('user.transactions', { values: { username: user.userName } })}
  </h2>
</div>
<TransferTransactionList {transferTransactions} />
