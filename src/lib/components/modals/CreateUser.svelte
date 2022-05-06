<script lang="ts">
  import { goto } from '$app/navigation';

  import { closeModal, openModal } from 'svelte-modals';

  import Error from './Error.svelte';

  // provided by <Modals />
  export let isOpen: boolean;

  let username: string;
  const createUser: svelte.JSX.EventHandler<SubmitEvent, HTMLFormElement> = async (_event) => {
    // send to /user
    const response = await fetch('/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        username
      })
    });
    // if success, close modal
    if (response.status === 200) {
      closeModal();
      // and navigate
      const user = await response.json();
      goto(`/user/${user.uid}`);
    }
    // if error, show error message
    else {
      const error = await response.json();
      openModal(Error, { message: error.error });
      console.log('error', error);
    }
  };
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <h2>Create a user</h2>
      <form on:submit|preventDefault={createUser} action="/user">
        <input type="text" placeholder="Username" bind:value={username} />

        <div class="actions">
          <button type="submit">Create</button>
          <button on:click={closeModal}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .modal {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    /* allow click-through to backdrop */
    pointer-events: none;
  }

  .contents {
    min-width: 240px;
    border-radius: 6px;
    padding: 16px;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: auto;
  }

  h2 {
    text-align: center;
    font-size: 24px;
  }

  /* p {
    text-align: center;
    margin-top: 16px;
  } */

  .actions {
    margin-top: 32px;
    display: flex;
    justify-content: flex-end;
  }
</style>
