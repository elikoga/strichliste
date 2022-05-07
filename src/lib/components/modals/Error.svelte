<script lang="ts">
  import { closeModal } from 'svelte-modals';
  import BaseModal from './BaseModal.svelte';

  // provided by <Modals />
  export let isOpen: boolean;

  export let message: string;
</script>

<BaseModal {isOpen}>
  <h2>Error:</h2>
  <p>{message}</p>
  <svelte:fragment slot="actions">
    <button on:click={closeModal}>Ok</button>
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
