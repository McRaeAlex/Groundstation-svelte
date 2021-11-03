<script lang="ts">
	import { convertRange } from '$lib/utils/math';
	import { data } from '$lib/stores/data';
	import { onMount } from 'svelte';

	let mappedChannels = [];

	onMount(() => {
		data.subscribe((value) => {
			mappedChannels = value[value.length - 1].channels.map((elem) =>
				convertRange(elem, -3600, 3600, 0, 100)
			);
		});
	});
</script>

<!-- TODO: Make the component scroll -->
<div class="chart text-center">
	<h3>Controller Channels</h3>
	<div class="flex flex-col space-y-3">
		{#each mappedChannels as channel, i}
			<div>
				<h4>CH{i}</h4>
				<svg width="100%">
					<rect width="100%" height="10" stroke="grey" fill-opacity="0" />
					<!-- Animate the x2 -->
					<line x1="50%" x2="{channel}%" y1="5" y2="5" stroke="black" />
				</svg>
			</div>
		{/each}
	</div>
</div>

<style>
	svg {
		height: 10px;
	}
</style>
