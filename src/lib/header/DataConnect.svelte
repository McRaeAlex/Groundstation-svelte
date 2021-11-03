<!-- TODO: Make the button look pretty -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { setupDataPipeline } from '$lib/serial';
	import { toast } from '@zerodevx/svelte-toast';
	import { createFakeSerialStream } from '$lib/mock/serial';

	const serialAvailable: boolean = 'serial' in navigator;

	enum State {
		NotConnected,
		Loading,
		Connected
	}

	// state
	let state: State = State.NotConnected;
	let source: string = '';
	let dropDownVisable = false;

	// bindings
	let component: HTMLDivElement;
	let disconnectAction: () => Promise<void>;

	onMount(() => {
		const handleClickOutside = (e) => {
			if (dropDownVisable && !component.contains(e.target)) {
				dropDownVisable = false;
			}
		};
		window.addEventListener('click', handleClickOutside, false);
		return () => {
			window.removeEventListener('click', handleClickOutside, false);
		};
	});

	onDestroy(() => {
		disconnectCurrentDevice();
	})

	function toggleDropDown() {
		dropDownVisable = !dropDownVisable;
	}

	async function disconnectCurrentDevice() {
		if (disconnectAction) {
			await disconnectAction();
			disconnectAction = undefined;
		}
	}

	async function handleConnect(readStream: ReadableStream<Uint8Array>, name: string) {
		await disconnectCurrentDevice();
		dropDownVisable = false;
		try {
			state = State.Loading;

			disconnectAction = setupDataPipeline(readStream);
			source = name;
			state = State.Connected;
			toast.push('Connected!')
		} catch (error) {
			state = State.NotConnected;
			disconnectCurrentDevice();
			toast.push('Failed to connect. Please see console');
		}
	}

	async function handleSerialConnect() {
		state = State.Loading;
		// @ts-ignore
		const port = await navigator.serial.requestPort();
		await port.open({ baudRate: 9600 });

		handleConnect(port.readable, 'Serial');
	}

	async function handleFileConnect() {
		// TODO: implement the file api
		await handleConnect(null, '');
	}

	async function handleFakeConnect() {
		await handleConnect(createFakeSerialStream(), 'Fake Serial Port');
	}

	async function handleDisconnect() {
		await disconnectCurrentDevice();
		state = State.NotConnected;
		source = '';
	}
</script>

<div bind:this={component} class="ml-auto text-white relative">
	<button
		on:click={toggleDropDown}
		class="py-2 px-3 rounded shadow bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
		class:bg-blue-600={state == State.NotConnected}
		class:bg-yellow-600={state == State.Loading}
		class:bg-green-600={state == State.Connected}
	>
		{#if state == State.NotConnected}
			Connect
			<svg
				class="h-5 w-5 inline-block"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/>
			</svg>
		{:else if state == State.Loading}
			Loading <div
				style="border-right-color:transparent"
				class="inline-block h-4 w-4 border-2 rounded-full animate-spin"
			/>
		{:else if state == State.Connected}
			{source}
			<svg
				class="h-5 w-5 inline-block"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/>
			</svg>
		{/if}
	</button>
	{#if dropDownVisable}
		<div class="flex flex-col bg-blue-600 shadow-xl rounded mt-1 right-0 absolute">
			{#if state == State.NotConnected}
				<button on:click={handleSerialConnect} class="hover:bg-blue-700 px-6 py-1">Serial</button>
				<button on:click={handleFileConnect} class="hover:bg-blue-700 px-6 py-1">File</button>
				<button on:click={handleFakeConnect} class="hover:bg-blue-700 px-6 py-1">Fake Data</button>
			{:else if state == State.Connected}
				<button on:click={handleDisconnect} class="hover:bg-blue-700 px-6 py-1">Disconnect</button>
			{/if}
		</div>
	{/if}
</div>
