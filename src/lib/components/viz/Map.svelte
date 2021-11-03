<!-- 
	TODO:The map function is async because we must lazy load leaflet (SSR) but that means use:map will never destroy it because it is async and that would be racey
	what we want to do is disable SSR when using it and use a static import
 -->
<script lang="ts">
	import { onMount } from 'svelte';
	import 'leaflet/dist/leaflet.css';

	let canvas;

	onMount(async () => {
		const L = await import('leaflet');
		const map = L.map(canvas).setView([49.309862, -123.068316], 13);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors'
		}).addTo(map);

		canvas.onresize = () => {
			map.invalidateSize();
		};

		return {
			destroy: () => {
				map.remove();
			}
		};
	});
</script>

<div class="chart" bind:this={canvas} />
