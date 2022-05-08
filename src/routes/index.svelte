<script lang="ts" context="module">
  import type { Load } from './index.d';
  export const load: Load = async ({ fetch }) => {
    try {
      const users = await getAllUsers(fetch);
      return {
        props: { users }
      };
    } catch (e: any) {
      return {
        error: e
      };
    }
  };
</script>

<script lang="ts">
  import UserPreview from '$lib/components/UserPreview.svelte';
  import type { User } from '$lib/types';

  export let users: User[];

  import { _ } from 'svelte-i18n';
  import { getAllUsers } from '$lib/api';
</script>

<svelte:head>
  <title>Strichliste</title>
</svelte:head>

<h1>Strichliste</h1>
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
{/if}
<div class="Subhead">
  <h2 class="Subhead-heading Subhead--spacious">{$_('fluff.whatIsThis.title')}</h2>
</div>
{@html $_('fluff.whatIsThis.text')}
<div class="Subhead">
  <h2 class="Subhead-heading Subhead--spacious">{$_('fluff.iWantAFeature.title')}</h2>
</div>
{@html $_('fluff.iWantAFeature.text')}
