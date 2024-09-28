<script lang="ts">
  import 'modern-normalize/modern-normalize.css';
  import '$styles/main.scss';
	import type { LayoutData } from './$types';

  export let data: LayoutData;
  console.log('Data:', data);
</script>

{data?.user?.display_name}
<slot />