<script lang="ts" context="module">
  import { waitLocale } from 'svelte-i18n';
  import '$lib/i18n';

  export const load: Load = async ({}) => {
    await waitLocale();
    return {};
  };
</script>

<script lang="ts">
  import '@primer/css/index.scss';

  import '$lib/i18n';

  import { Modals, closeModal } from 'svelte-modals';

  import { _ } from 'svelte-i18n';

  import MarkGithub16 from 'svelte-octicons/lib/MarkGithub16.svelte';
  import type { Load } from '@sveltejs/kit';
</script>

<Modals>
  <div slot="backdrop" class="backdrop" on:click={closeModal} />
</Modals>

<header class="Header">
  <div class="Header-item Header-item--full">
    <a class="Header-link f4 d-flex flex-items-center" href="/">
      <img style="height:24px" src="/tally-white.svg" alt="Strichliste" />
      <span>Strichliste</span>
    </a>
  </div>
  <div class="Header-item">
    <a class="Header-link" href="/">Strichliste</a>
  </div>
  <div class="Header-item">
    <a class="Header-link" href="/user">{$_('users')}</a>
  </div>
  <div class="Header-item">
    <a class="Header-link" href="https://github.com/elikoga/strichliste"><MarkGithub16 /> </a>
  </div>
</header>

<div class="container-lg mt-4">
  <slot />
</div>

<style>
  .backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }
</style>
