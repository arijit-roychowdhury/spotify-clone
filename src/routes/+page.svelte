<script lang="ts">
  import type { PageData } from '$lib/types';

  export let data: PageData;
  $: console.log("Data", data);
</script>
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<style lang="scss">
  h1 {
    font-size: functions.toRem(36);
  }

</style>