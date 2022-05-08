<script lang="ts">
  import { closeModal } from 'svelte-modals';
  import Button from '../Button.svelte';
  import BaseModal from './BaseModal.svelte';

  import { _ } from 'svelte-i18n';

  // provided by <Modals />
  export let isOpen: boolean;

  export let message: string;
  export let actionMessage: string = 'Ok';

  export let error: string | undefined = undefined;

  export let next: (amount: number) => void;
  let amount: number;
  const onSubmit = () => {
    try {
      next(amount * 100);
      closeModal();
    } catch (e: any) {
      error = e.message;
    }
  };
</script>

<BaseModal {isOpen} title={message}>
  <form on:submit|preventDefault={onSubmit} id="amountForm" action="/user">
    <div class="form-group pb-6" class:errored={!!error}>
      <div class="form-group-header">
        <label for="amount">{$_('transaction.amount')}</label>
      </div>
      <div class="form-group-body">
        <input
          type="number"
          placeholder={$_('transaction.amount')}
          id="amount"
          min="0"
          step="0.01"
          bind:value={amount}
          aria-describedby="amount-input-validation"
        />
      </div>
      {#if error}
        <p class="note error" id="amount-input-validation">
          {error}
        </p>
      {/if}
    </div>

    <div class="form-actions">
      <Button class="btn-primary" type="submit" form="amountForm">{actionMessage}</Button>
      <Button on:click={closeModal}>{$_('button.cancel')}</Button>
    </div>
  </form>
</BaseModal>

<style>
  p {
    text-align: center;
    margin-top: 16px;
  }
</style>
