<script lang="ts">
  import { goto } from '$app/navigation';

  import TransferTransactionList from '$lib/components/TransferTransactionList.svelte';

  import renderMoney from '$lib/renderMoney';
  import { closeAllModals, openModal } from 'svelte-modals';
  import ChooseUserToTransact from '$lib/components/modals/ChooseUserToTransact.svelte';

  import Error from '$lib/components/modals/Error.svelte';
  import Confirm from '$lib/components/modals/Confirm.svelte';
  import type { TransferTransaction, User } from '$lib/types';
  import { changeUserBalance as changeUserBalanceAPI, deleteUser as deleteUserAPI } from '$lib/api';
  import Button from '$lib/components/Button.svelte';
  import AskForValue from '$lib/components/modals/AskForValue.svelte';

  export let user: User;
  export let transferTransactions: TransferTransaction[];

  const moneyValues = [1, 5, 10, 50, 100, 500];

  const transact = async (amount: number) => {
    await new Promise((resolve) => setTimeout(resolve, 0)); // wait for modal to close
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

  const changeUserBalance = async (amount: number) => {
    try {
      await changeUserBalanceAPI(user.id, amount);
    } catch (e: any) {
      openModal(Error, { message: e.message });
    }
  };
</script>

<svelte:head>
  <title>Strichliste - User - {user.userName}</title>
</svelte:head>

<div class="d-flex">
  <h1 class="col-6">User: "{user.userName}"</h1>
  <span class="col-6 f1 text-right flex-self-end text-emphasized text-underline">
    {renderMoney(user.balance)}
  </span>
</div>
<div class="Layout Layout--sidebarPosition-end">
  <div class="Layout-main">
    <div class="Subhead">
      <h2 class="Subhead-heading ">Charge your wallet</h2>
    </div>
    {#each moneyValues as moneyValue}
      <Button class="btn-primary btn-large mr-2 mb-2" on:click={() => changeUserBalance(moneyValue)}
        ><span>{renderMoney(moneyValue)}</span>
      </Button>{/each}<Button
      class="btn-primary btn-large mr-2 mb-2"
      on:click={() =>
        openModal(AskForValue, {
          message: 'Charge your wallet by what amount?',
          actionMessage: 'Charge',
          next: changeUserBalance
        })}
    >
      <span>? €</span>
    </Button>

    <div class="Subhead">
      <h2 class="Subhead-heading ">What you have to pay</h2>
    </div>
    {#each moneyValues as moneyValue}
      <Button
        class="btn-danger btn-large mr-2 mb-2"
        on:click={() => changeUserBalance(-moneyValue)}
      >
        {renderMoney(moneyValue)}
      </Button>{/each}<Button
      class="btn-danger btn-large mr-2 mb-2"
      on:click={() =>
        openModal(AskForValue, {
          message: 'Pay what amount?',
          actionMessage: 'Pay',
          next: (amount) => changeUserBalance(-amount)
        })}
    >
      <span>? €</span>
    </Button>

    <div class="Subhead">
      <h2 class="Subhead-heading ">Transfer money to someone else</h2>
    </div>
    {#each moneyValues as moneyValue}
      <Button class="btn-large mr-2 mb-2" on:click={() => transact(moneyValue)}>
        {renderMoney(moneyValue)}
      </Button>{/each}<Button
      class="btn-large mr-2 mb-2"
      on:click={() =>
        openModal(AskForValue, {
          message: 'Transfer money to someone else by what amount?',
          actionMessage: 'Transfer',
          next: transact
        })}
    >
      <span>? €</span>
    </Button>
    <div class="Subhead">
      <h2 class="Subhead-heading ">Delete Account</h2>
    </div>
    <Button class="btn-danger" on:click={deleteUser}>Delete account</Button>
  </div>
  <div class="Layout-sidebar">
    <div class="Subhead">
      <h2 class="Subhead-heading ">
        Last 10 transactions (<a href="/user/{user.id}/transactions">show all</a>)
      </h2>
    </div>
    <TransferTransactionList {transferTransactions} />
  </div>
</div>
