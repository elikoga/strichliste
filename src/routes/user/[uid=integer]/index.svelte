<script lang="ts">
  import { goto } from '$app/navigation';

  import TransferTransactionList from '$lib/components/TransferTransactionList.svelte';

  import renderMoney, { unknownMoney } from '$lib/renderMoney';
  import { closeAllModals, openModal } from 'svelte-modals';
  import ChooseUserToTransact from '$lib/components/modals/ChooseUserToTransact.svelte';

  import Error from '$lib/components/modals/Error.svelte';
  import Confirm from '$lib/components/modals/Confirm.svelte';
  import type { TransferTransaction, User } from '$lib/types';
  import { changeUserBalance as changeUserBalanceAPI, deleteUser as deleteUserAPI } from '$lib/api';
  import Button from '$lib/components/Button.svelte';
  import AskForValue from '$lib/components/modals/AskForValue.svelte';
  import { currencyDenominations } from '$lib/config';

  import { _ } from 'svelte-i18n';

  export let user: User;
  export let transferTransactions: TransferTransaction[];

  const transact = async (amount: number) => {
    await new Promise((resolve) => setTimeout(resolve, 0)); // wait for modal to close
    if (amount <= 0) {
      openModal(Error, { message: $_('error.amountHasToBePositive') });
    } else {
      openModal(ChooseUserToTransact, { amount: amount, fromUser: user });
    }
  };

  const deleteUser = () => {
    openModal(Confirm, {
      message: $_('user.delete.confirm1', { values: { username: user.userName } }),
      labels: {
        confirm: $_('yes'),
        cancel: $_('no')
      },
      onConfirm: async () => {
        openModal(Confirm, {
          message: $_('user.delete.confirm2', { values: { username: user.userName } }),
          labels: {
            confirm: $_('yes'),
            cancel: $_('no')
          },
          onConfirm: async () => {
            openModal(Confirm, {
              message: $_('user.delete.confirm3', { values: { username: user.userName } }),
              labels: {
                confirm: $_('yes'),
                cancel: $_('no')
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
  <!-- <title>Strichliste - User - {user.userName}</title> -->
  <title>{$_('title.user', { values: { username: user.userName } })}</title>
</svelte:head>

<div class="d-flex">
  <!-- <h1 class="col-6">User: "{user.userName}"</h1> -->
  <h1 class="col-6">{$_('user.header', { values: { username: user.userName } })}</h1>
  <span class="col-6 f1 text-right flex-self-end text-emphasized text-underline">
    {renderMoney(user.balance)}
  </span>
</div>
<div class="Layout Layout--sidebarPosition-end">
  <div class="Layout-main">
    <div class="Subhead">
      <h2 class="Subhead-heading ">{$_('subhead.charge')}</h2>
    </div>
    {#each currencyDenominations as denomination}
      <Button
        class="btn-primary btn-large mr-2 mb-2"
        on:click={() => changeUserBalance(denomination)}
        ><span>{renderMoney(denomination)}</span>
      </Button>{/each}<Button
      class="btn-primary btn-large mr-2 mb-2"
      on:click={() =>
        openModal(AskForValue, {
          message: $_('user.charge.askForValue'),
          actionMessage: $_('user.charge.actionMessage'),
          next: changeUserBalance
        })}
    >
      <span>{unknownMoney}</span>
    </Button>

    <div class="Subhead">
      <h2 class="Subhead-heading ">{$_('subhead.pay')}</h2>
    </div>
    {#each currencyDenominations as denomination}
      <Button
        class="btn-danger btn-large mr-2 mb-2"
        on:click={() => changeUserBalance(-denomination)}
      >
        {renderMoney(denomination)}
      </Button>{/each}<Button
      class="btn-danger btn-large mr-2 mb-2"
      on:click={() =>
        openModal(AskForValue, {
          message: $_('user.pay.askForValue'),
          actionMessage: $_('user.pay.actionMessage'),
          next: (amount) => changeUserBalance(-amount)
        })}
    >
      <span>{unknownMoney}</span>
    </Button>

    <div class="Subhead">
      <h2 class="Subhead-heading ">{$_('subhead.transfer')}</h2>
    </div>
    {#each currencyDenominations as denomination}
      <Button class="btn-large mr-2 mb-2" on:click={() => transact(denomination)}>
        {renderMoney(denomination)}
      </Button>{/each}<Button
      class="btn-large mr-2 mb-2"
      on:click={() =>
        openModal(AskForValue, {
          message: $_('user.transfer.askForValue'),
          actionMessage: $_('user.transfer.actionMessage'),
          next: transact
        })}
    >
      <span>{unknownMoney}</span>
    </Button>
    <div class="Subhead">
      <h2 class="Subhead-heading ">{$_('subhead.delete')}</h2>
    </div>
    <Button class="btn-danger" on:click={deleteUser}>{$_('user.delete.button')}</Button>
    <div class="d-block d-sm-none Layout-sidebar">
      <div class="Subhead">
        <h2 class="Subhead-heading ">
          {$_('subhead.last5Transactions')} (<a href="/user/{user.id}/transactions"
            >{$_('showAllTransactions')}</a
          >)
        </h2>
      </div>
      <TransferTransactionList {transferTransactions} />
    </div>
  </div>
  <div class="d-none d-sm-block Layout-sidebar">
    <div class="Subhead">
      <h2 class="Subhead-heading ">
        {$_('subhead.last5Transactions')} (<a href="/user/{user.id}/transactions"
          >{$_('showAllTransactions')}</a
        >)
      </h2>
    </div>
    <TransferTransactionList {transferTransactions} />
  </div>
</div>
