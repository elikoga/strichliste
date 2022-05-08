<script lang="ts">
  import { goto, invalidate } from '$app/navigation';

  import { closeModal, openModal } from 'svelte-modals';
  import BaseModal from './BaseModal.svelte';

  import { createUser as createUserAPI } from '$lib/api';

  import Button from '../Button.svelte';

  // provided by <Modals />
  export let isOpen: boolean;

  let username: string;
  export let next: (uid: number) => void;
  const createUser: svelte.JSX.EventHandler<SubmitEvent, HTMLFormElement> = async (_event) => {
    console.log('Hi');
    try {
      const uid = await createUserAPI(username);
      closeModal();
      next(uid);
    } catch (e: any) {
      error = e.message;
    }
  };

  let error: string | undefined;
</script>

<BaseModal {isOpen} title="Create a user">
  <form on:submit|preventDefault={createUser} id="createUserForm" action="/user">
    <div class="form-group pb-6" class:errored={!!error}>
      <div class="form-group-header">
        <label for="username">Username</label>
      </div>
      <div class="form-group-body">
        <input
          type="text"
          placeholder="Username"
          id="username"
          bind:value={username}
          aria-describedby="username-input-validation"
        />
      </div>
      {#if error}
        <p class="note error" id="username-input-validation">
          {error}
        </p>
      {/if}
    </div>

    <div class="form-actions">
      <Button class="btn-primary" type="submit" form="createUserForm">Create</Button>
      <Button on:click={closeModal}>Cancel</Button>
    </div>
  </form>
</BaseModal>

<style>
  h2 {
    text-align: center;
    font-size: 24px;
  }

  .actions {
    margin-top: 32px;
    display: flex;
    justify-content: flex-end;
  }
</style>
