<script lang="ts">
  let cls: string = '';
  export { cls as class };
  export let type: string = 'button';
  export let form: string | undefined = undefined;
</script>

<button class="btn {cls}" {type} {form} on:click>
  <slot />
</button>

<style>
  .btn {
    position: inherit;
  }
</style>
