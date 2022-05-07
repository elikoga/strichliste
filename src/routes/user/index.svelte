<script lang="ts">
  import UserPreview from '$lib/components/UserPreview.svelte';
  import { openModal } from 'svelte-modals';
  import CreateUser from '$lib/components/modals/CreateUser.svelte';
  import type { User } from '$lib/types';
  import Button from '$lib/components/Button.svelte';
  import PersonAdd16 from 'svelte-octicons/lib/PersonAdd16.svelte';

  export let users: User[];
  // sort by user.balance
  users = users.sort((a, b) => b.balance - a.balance);

  const createUser = () => {
    openModal(CreateUser);
  };
</script>

<svelte:head>
  <title>Strichliste - User</title>
</svelte:head>

<div class="Subhead">
  <h2 class="Subhead-heading ">User</h2>
</div>

<ul class="list-style-none d-flex flex-wrap">
  {#each users as user}
    <li class="col-6 col-sm-4 p-2" role="button">
      <a class="d-block btn btn-outline" href="/user/{user.id}"><UserPreview {user} /></a>
    </li>
  {/each}
</ul>

<div class="Subhead">
  <h2 class="Subhead-heading ">User erstellen</h2>
</div>

<Button class="ml-2 mt-2 btn-primary" on:click={() => createUser()}>
  <PersonAdd16 />
  <span>Create User</span>
</Button>
