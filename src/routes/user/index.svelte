<script lang="ts">
  import UserPreview from '$lib/components/UserPreview.svelte';
  import { openModal } from 'svelte-modals';
  import CreateUser from '$lib/components/modals/CreateUser.svelte';
  import type { User } from '$lib/types';

  export let users: User[];
  // sort by user.balance
  users = users.sort((a, b) => b.balance - a.balance);

  const createUser = () => {
    openModal(CreateUser);
  };
</script>

{#each users as user}
  <a href="/user/{user.id}">
    <UserPreview {user} />
  </a>
{/each}
<div class="createUser">
  <button on:click={() => createUser()}>Create User</button>
</div>
