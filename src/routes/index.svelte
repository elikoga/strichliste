<script lang="ts">
  import { _ } from 'svelte-i18n';
</script>

<svelte:head>
  <title>Strichliste</title>
</svelte:head>

<h1>Strichliste</h1>
<div class="Subhead">
  <h2 class="Subhead-heading Subhead--spacious">{$_('fluff.whatIsThis.title')}</h2>
</div>
{@html $_('fluff.whatIsThis.text')}
<div class="Subhead">
  <h2 class="Subhead-heading Subhead--spacious">{$_('fluff.iWantAFeature.title')}</h2>
</div>
{@html $_('fluff.iWantAFeature.text')}
