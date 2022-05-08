<script lang="ts">
  import { closeModal } from 'svelte-modals';
  import BaseModal from './BaseModal.svelte';

  import { createUser as createUserAPI } from '$lib/api';

  import Button from '../Button.svelte';
  import { _ } from 'svelte-i18n';

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

<BaseModal {isOpen} title={$_('user.create')}>
  <form on:submit|preventDefault={createUser} id="createUserForm" action="/user">
    <div class="form-group pb-6" class:errored={!!error}>
      <div class="form-group-header">
        <label for="username">{$_('user.username')}</label>
      </div>
      <div class="form-group-body">
        <input
          class="form-control"
          type="text"
          placeholder={$_('user.username')}
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
      <Button class="btn-primary" type="submit" form="createUserForm">{$_('user.create')}</Button>
      <Button on:click={closeModal}>{$_('button.cancel')}</Button>
    </div>
  </form>
</BaseModal>
