<script lang="ts">
  import { goto } from '$app/navigation';

  import TransferTransactionComponent from '$lib/components/TransferTransaction.svelte';

  import renderMoney from '$lib/renderMoney';
  import { closeAllModals, openModal } from 'svelte-modals';
  import ChooseUserToTransact from '$lib/components/modals/ChooseUserToTransact.svelte';

  import type { Requests } from './index';
  import Error from '$lib/components/modals/Error.svelte';
  import Confirm from '$lib/components/modals/Confirm.svelte';
  import type { TransferTransaction, User } from '$lib/types';
  import { changeUserBalance, deleteUser as deleteUserAPI } from '$lib/api';

  export let user: User;
  export let transferTransactions: TransferTransaction[];

  const moneyValues = [1, 5, 10, 50, 100, 500];

  const transact = (amount: number) => {
    if (amount <= 0) {
      openModal(Error, { message: 'Amount must be positive' });
    } else {
      openModal(ChooseUserToTransact, { amount: amount, fromUser: user });
    }
  };

  const deleteUser = () => {
    openModal(Confirm, {
      message: `Are you sure you want to delete ${user.userName}?`,
      labels: {
        confirm: 'Yes',
        cancel: 'No'
      },
      onConfirm: async () => {
        openModal(Confirm, {
          message: `Are you really sure you want to delete ${user.userName}?`,
          labels: {
            confirm: 'Yes',
            cancel: 'No'
          },
          onConfirm: async () => {
            openModal(Confirm, {
              message: `Are you really really sure you want to delete ${user.userName}?`,
              labels: {
                confirm: 'Yes',
                cancel: 'No'
              },
              onConfirm: async () => {
                closeAllModals();
                try {
                  await deleteUserAPI(user.id);
                  goto('/user');
                } catch (e: any) {
                  openModal(Error, { message: e.message });
                }
              }
            });
          }
        });
      }
    });
  };
</script>

<h1>{user.userName}</h1>
<p>{renderMoney(user.balance)}</p>
<div class="moneyButtons">
  <p>Modify your account</p>
  <div class="negative">
    {#each [...moneyValues].reverse() as moneyValue}
      <button on:click={() => changeUserBalance(user.id, -moneyValue)}
        >{renderMoney(-moneyValue)}</button
      >
    {/each}
  </div>
  <div class="customBalance">
    <form
      on:submit|preventDefault={(event) =>
        changeUserBalance(user.id, Number(event.currentTarget?.delta.value) * 100)}
    >
      <input name="delta" type="number" step="0.01" />
      <span>€</span>
      <button type="submit">Do it</button>
    </form>
  </div>
  <div class="positive">
    {#each moneyValues as moneyValue}
      <button on:click={() => changeUserBalance(user.id, moneyValue)}
        >{renderMoney(moneyValue)}</button
      >
    {/each}
  </div>
  <p>Or pay money to someone else:</p>
  <div class="transfer">
    {#each moneyValues as moneyValue}
      <button on:click={() => transact(moneyValue)}>{renderMoney(moneyValue)}</button>
    {/each}
  </div>
  <div class="customTransfer">
    <form
      on:submit|preventDefault={(event) => transact(Number(event.currentTarget?.delta.value) * 100)}
    >
      <input name="delta" type="number" step="0.01" min="0" />
      <span>€</span>
      <button type="submit">Do it</button>
    </form>
  </div>
</div>
<div class="deleteUser">
  <button on:click={deleteUser}>Delete account</button>
</div>

{#each transferTransactions as transferTransaction}
  <TransferTransactionComponent {transferTransaction} />
{/each}
