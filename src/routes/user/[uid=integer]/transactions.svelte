<script lang="ts">
  import TransferTransactionList from '$lib/components/TransferTransactionList.svelte';

  import type { TransferTransaction, User } from '$lib/types';

  export let user: User;
  export let transferTransactions: TransferTransaction[];
</script>

<div class="Subhead">
  <h2 class="Subhead-heading ">Transactions</h2>
</div>
<TransferTransactionList {transferTransactions} />
