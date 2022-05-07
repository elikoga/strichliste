<script lang="ts">
  import BaseModal from './BaseModal.svelte';

  import { closeModal, openModal } from 'svelte-modals';
  import { onMount } from 'svelte';
  import UserPreview from '../UserPreview.svelte';
  import renderMoney from '$lib/renderMoney';
  import assert from 'assert';
  import ErrorModal from './Error.svelte';
  import { createTransaction, getAllUsers } from '$lib/api';
  import type { User } from '$lib/types';

  // provided by <Modals />
  export let isOpen: boolean;

  export let amount: number;
  export let fromUser: User;
  assert(amount > 0, 'Amount must be positive');

  let allUsers: User[] = [];

  onMount(async () => {
    allUsers = (await getAllUsers()).filter((user) => user.id !== fromUser.id);
  });

  const send = async (toUser: User) => {
    try {
      await createTransaction(fromUser.id, toUser.id, amount);
      closeModal();
    } catch (e: any) {
      openModal(ErrorModal, { message: e.message });
    }
  };
</script>

<BaseModal {isOpen}>
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
  <svelte:fragment slot="actions">
    <button on:click={closeModal}>Cancel</button>
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
