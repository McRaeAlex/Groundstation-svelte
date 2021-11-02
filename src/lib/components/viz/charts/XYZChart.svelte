<script lang="ts">
	import { data } from '$lib/stores/data';
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import defaultConfig from './defaultConfig';
	import deepMerge from '$lib/utils/deepMerge';

	export let config = {};
	export let func: (DataPacket) => Vec3;

	let canvas;

	onMount(() => {
		const mergedConfig = deepMerge({}, defaultConfig, config);
		// TODO: remove this ignore
		// @ts-ignore
		const chart = new Chart(canvas, mergedConfig);

		const subscription = data.subscribe((serialdata) => {
			chart.data.labels = serialdata.map((elem) => elem.time);
			chart.data.datasets[0].data = serialdata.map((elem) => func(elem).x);
			chart.data.datasets[1].data = serialdata.map((elem) => func(elem).y);
			chart.data.datasets[2].data = serialdata.map((elem) => func(elem).z);
			chart.update('none');
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<div class="chart">
	<canvas bind:this={canvas} width="300" height="200" />
</div>
