<script lang="ts">
  import { goto } from '$app/navigation';

  import { closeModal, openModal } from 'svelte-modals';
  import BaseModal from './BaseModal.svelte';

  import { createUser as createUserAPI } from '$lib/api';

  import Error from './Error.svelte';

  // provided by <Modals />
  export let isOpen: boolean;

  let username: string;
  const createUser: svelte.JSX.EventHandler<SubmitEvent, HTMLFormElement> = async (_event) => {
    try {
      const uid = await createUserAPI(username);
      closeModal();
      await goto(`/user/${uid}`);
    } catch (e: any) {
      openModal(Error, { message: e });
    }
  };
</script>

<BaseModal {isOpen}>
  <h2>Create a user</h2>
  <form on:submit|preventDefault={createUser} action="/user">
    <input type="text" placeholder="Username" bind:value={username} />

    <div class="actions">
      <button type="submit">Create</button>
      <button on:click={closeModal}>Cancel</button>
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
