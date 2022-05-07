<script lang="ts">
  import { closeModal } from 'svelte-modals';
  import BaseModal from './BaseModal.svelte';
  export let isOpen: boolean;
  export let message: string;
  export let onConfirm: () => void;
  export let labels = { cancel: 'Cancel', confirm: 'OK' };
</script>

<BaseModal {isOpen}>
  <h2>Confirm</h2>
  <p>
    {message}
  </p>
  <svelte:fragment slot="actions">
    <button type="button" on:click={closeModal}> {labels?.cancel} </button>
    <button type="button" on:click={onConfirm}> {labels?.confirm} </button>
  </svelte:fragment>
</BaseModal>

<style>
  h2 {
    text-align: center;
    font-size: 24px;
  }

  p {
    text-align: center;
    margin-top: 16px;
  }
</style>
