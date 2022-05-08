<script lang="ts">
  import { closeModal } from 'svelte-modals';
  import Button from '../Button.svelte';
  import BaseModal from './BaseModal.svelte';
  export let isOpen: boolean;
  export let message: string;
  export let onConfirm: () => void;
  export let labels = { cancel: 'Cancel', confirm: 'OK' };
</script>

<BaseModal {isOpen} title="Confirm">
  <p>
    {message}
  </p>
  <svelte:fragment slot="actions">
    <Button class="btn-invisible" on:click={closeModal}>{labels?.cancel}</Button>
    <Button class="btn-danger" on:click={onConfirm}>{labels?.confirm}</Button>
  </svelte:fragment>
</BaseModal>
