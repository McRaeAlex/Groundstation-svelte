<script lang="ts">
	import DataConnect from './DataConnect.svelte';
	import drone from './undraw_drone_surveillance.svg';
</script>

<header class="mx-0 sm:mx-6 px-4">
	<div class="flex items-center">
		<div class="px-2 py-4 sm:py-5">
			<img src={drone} alt="drone" height="70" width="70" class="inline-block " />
		</div>
		<h1
			class="inline-block px-2 py-4 sm:py-5 sm:text-xl text-base"
			style="text-rendering: optimizeLegibility"
		>
			<strong>NimbleFlight GroundStation</strong>
		</h1>
		<DataConnect />
	</div>
</header>
