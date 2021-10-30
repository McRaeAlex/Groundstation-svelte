<script context="module">
	export const ssr = false;
</script>

<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import XYZChart from '$lib/components/viz/charts/XYZChart.svelte';
	import { accelConfig, magConfig, gyroConfig } from '$lib/components/viz/charts/chartConfigs';
	import Map from '$lib/components/viz/map.svelte';
	// import Orientation from '$lib/viz/orientation.svelte';

	import Toast from '$lib/components/Toast.svelte';
</script>

<Header />
<div class="mx-5 sm:mx-8">
	<section id="charts" class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
		<XYZChart func={(elem) => elem.acceleration} config={accelConfig} />
		<XYZChart func={(elem) => elem.magnetometer} config={magConfig} />
		<XYZChart func={(elem) => elem.gyro} config={gyroConfig} />
		<Map />
		<!-- <Orientation /> -->
		<div class="chart" />
		<div class="chart" />
		<div class="chart" />
		<div class="chart" />
		<div class="chart" />
		<div class="chart" />
		<div class="chart" />
	</section>
</div>
<Toast />
