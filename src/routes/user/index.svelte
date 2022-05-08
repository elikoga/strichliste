<script lang="ts">
  import UserPreview from '$lib/components/UserPreview.svelte';
  import { openModal } from 'svelte-modals';
  import CreateUser from '$lib/components/modals/CreateUser.svelte';
  import type { User } from '$lib/types';
  import Button from '$lib/components/Button.svelte';
  import PersonAdd16 from 'svelte-octicons/lib/PersonAdd16.svelte';
  import People24 from 'svelte-octicons/lib/People24.svelte';

  import { _ } from 'svelte-i18n';
  import { goto } from '$app/navigation';

  export let users: User[];

  const createUser = () => {
    openModal(CreateUser, {
      next: async (uid) => {
        await goto(`/user/${uid}`);
      }
    });
  };
</script>

<svelte:head>
  <title>{$_('title.users')}</title>
</svelte:head>
{#if users.length !== 0}
  <div class="Subhead">
    <h2 class="Subhead-heading ">{$_('subhead.users')}</h2>
  </div>

  <ul class="list-style-none d-flex flex-wrap">
    {#each users as user}
      <li class="col-6 col-sm-4 p-2" role="button">
        <a class="d-block btn btn-outline" href="/user/{user.id}"><UserPreview {user} /></a>
      </li>
    {/each}
  </ul>

  <div class="Subhead">
    <h2 class="Subhead-heading ">{$_('subhead.createUser')}</h2>
  </div>

  <Button class="ml-2 mt-2 btn-primary" on:click={createUser}>
    <PersonAdd16 />
    <span>{$_('button.createUser')}</span>
  </Button>
{:else}
  <div class="blankslate">
    <People24 class="blankslate-image" />
    <h3 class="blankslate-heading">{$_('users.noUsers')}</h3>
    <p>
      {$_('users.noUsersDescription')}
    </p>
    <div class="blankslate-action">
      <Button class="ml-2 mt-2 btn-primary" on:click={createUser}>
        <PersonAdd16 />
        <span>{$_('button.createUser')}</span>
      </Button>
    </div>
  </div>
{/if}
