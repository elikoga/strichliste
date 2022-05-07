<script lang="ts">
  import { closeModal } from 'svelte-modals';
  import Button from '../Button.svelte';
  import BaseModal from './BaseModal.svelte';

  // provided by <Modals />
  export let isOpen: boolean;

  export let message: string;
</script>

<BaseModal {isOpen} title="Error">
  <p>{message}</p>
  <svelte:fragment slot="actions">
    <Button on:click={closeModal}>Ok</Button>
  </svelte:fragment>
</BaseModal>

<style>
  p {
    text-align: center;
    margin-top: 16px;
  }
</style>
