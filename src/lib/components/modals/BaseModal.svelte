<script lang="ts">
  import { closeModal } from 'svelte-modals';
  import X16 from 'svelte-octicons/lib/X16.svelte';
  import Button from '../Button.svelte';

  // provided by <Modals />
  export let isOpen: boolean;
  export let title: string | undefined = undefined;
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="Box container-md color-shadow-small">
      <div class="Box-header">
        <Button class="Box-btn-octicon btn-octicon float-right" on:click={closeModal}>
          <X16 />
        </Button>
        {#if title}
          <div class="Box-title">{title}</div>
        {/if}
      </div>
      <div class="contents Box-body">
        <slot />
      </div>
      {#if $$slots.actions}
        <div class="actions Box-footer">
          <slot name="actions" />
        </div>
      {/if}
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

    z-index: 1;

    /* allow click-through to backdrop */
    pointer-events: none;
  }

  .Box {
    pointer-events: auto;
  }

  /* .contents {
    min-width: 240px;
    border-radius: 6px;
    padding: 16px;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: auto;
  } */

  /* .actions {
    margin-top: 32px;
    display: flex;
    justify-content: flex-end;
  } */
</style>
