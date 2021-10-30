<script>
	import { SvelteToast } from '@zerodevx/svelte-toast';
	const options = {
		pausable: true,
		reversed: true,
        duration: 10000,
	};
</script>

<div class="wrap">
	<SvelteToast {options} />
</div>

<style>
	.wrap {
		--toastContainerTop: auto;
		--toastContainerRight: 0.5rem;
		--toastContainerBottom: 0.5rem;
		--toastContainerLeft: 0.5rem;
		--toastWidth: 100%;
		--toastMinHeight: 2rem;
		--toastPadding: 0 0.5rem;
		font-size: 0.875rem;
	}
	@media (min-width: 40rem) {
		.wrap {
			--toastContainerRight: auto;
			--toastContainerLeft: calc(50vw - 20rem);
			--toastWidth: 40rem;
		}
	}
</style>
