<script lang="ts">
  import { closeModal } from 'svelte-modals';
  import type { User } from '$lib/db';
  import { onMount } from 'svelte';
  import UserPreview from '../UserPreview.svelte';
  import type { Requests } from 'src/routes/user/[uid=integer]';
  import renderMoney from '$lib/renderMoney';
  import { invalidate } from '$app/navigation';
  import assert from 'assert';

  // provided by <Modals />
  export let isOpen: boolean;

  export let amount: number;
  export let fromUser: User;
  assert(amount > 0, 'Amount must be positive');

  let allUsers: User[] = [];

  onMount(async () => {
    const response = await fetch('/user', {
      headers: {
        Accept: 'application/json'
      }
    });
    allUsers = ((await response.json()) as { users: User[] }).users.filter(
      (user) => user.id !== fromUser.id
    );
  });

  const send = async (toUser: User) => {
    const request: Requests = {
      type: 'createTransaction',
      createTransaction: {
        amount,
        toUserId: toUser.id
      }
    };
    const response = await fetch(`/user/${fromUser.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(request)
    });
    if (response.status === 200) {
      closeModal();
      invalidate('');
    } else {
      const error = await response.json();
      console.log('error', error);
    }
  };
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <h2>{fromUser.userName} wants to sned {renderMoney(amount)} to whom?</h2>
      <div class="users">
        {#each allUsers as user}
          <button
            on:click={() => {
              closeModal();
              send(user);
            }}
          >
            <UserPreview {user} />
          </button>
        {:else}
          <p>No other users to send to I cri evertiem</p>
        {/each}
      </div>
      <div class="actions">
        <button on:click={closeModal}>Cancel</button>
      </div>
    </div>
  </div>
{/if}

Hello I'm amongus

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

  p {
    text-align: center;
    margin-top: 16px;
  }

  .actions {
    margin-top: 32px;
    display: flex;
    justify-content: flex-end;
  }
</style>
