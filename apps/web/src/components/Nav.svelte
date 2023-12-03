<script lang="ts">
	// import { io } from "socket.io-client";
	import { onMount } from "svelte";
	import NavProgress from "./NavProgress.svelte";
	export let hostname: string;
	export let pathname: string;
	export let profile: string | undefined;
	export let showNav: boolean = true;

	// let socket: ReturnType<typeof io>;

	let isModalOpen = false;
	let isPassToDeviceModalOpen = false;
	let deviceName = "";
	onMount(() => {
		deviceName = localStorage.getItem("deviceName") || "";
	});
	$: newDeviceName = deviceName;

	let devices: Record<string, any> = {};
	// if (typeof window !== "undefined") {
	// 	socket = io(`${hostname}:5432`, {
	// 		withCredentials: true,
	// 	});
	// 	socket.connect();
	// 	socket.emit("join", deviceName);
	// 	socket.on("joined", (data) => {
	// 		devices = data.devices;
	// 	});
	// 	socket.on("passToDevice", (pathname) => {
	// 		// navigate to pathname
	// 		window.location.pathname = pathname;
	// 	});
	// }

	const openModal = () => {
		isModalOpen = true;
	};
	const openPassToDeviceModal = () => {
		isPassToDeviceModalOpen = true;
	};
	const saveDeviceName = () => {
		// socket.emit("saveDeviceName", {
		// 	oldDeviceName: deviceName,
		// 	newDeviceName,
		// });
		deviceName = newDeviceName;
		localStorage.setItem("deviceName", deviceName);
	};
	const passToDevice = (targetDeviceName: string) => {
		// socket.emit("passToDevice", {
		// 	targetDeviceName,
		// 	pathname,
		// });
	};
</script>

<div class:hidden={!showNav} class="z-20 w-full h-12 sticky top-0 bg-black">
	<div
		class="w-full border-b border-neutral-950 h-12 overflow-hidden flex items-center origin-top duration-300"
	>
		<div class="container h-full w-full mx-auto">
			<nav class="mx-auto flex w-full h-full justify-between">
				<div>
					<a
						class="px-2 h-full grid place-items-center text-white bg-white/0 hover:bg-white/10 transition-opacity"
						href="/series"
					>
						<p>Series</p>
					</a>
				</div>
				<div class="flex gap-2">
					<button
						class="px-2 h-full grid place-items-center text-white bg-white/0 hover:bg-white/10 transition-opacity"
						type="button"
						on:click={openPassToDeviceModal}
					>
						Pass to device
					</button>
					{#if profile}
						<a
							class="px-2 h-full grid place-items-center text-white bg-white/0 hover:bg-white/10 transition-opacity"
							href="/profile">{profile}</a
						>
					{:else}
						<a
							class="px-2 h-full grid place-items-center text-white bg-white/0 hover:bg-white/10 transition-opacity"
							href="/">Login</a
						>
					{/if}
					<button
						class="px-2 h-full grid place-items-center text-white bg-white/0 hover:bg-white/10 transition-opacity"
						type="button"
						on:click={openModal}
					>
						Edit device name
					</button>
				</div>
			</nav>
		</div>
	</div>
	<NavProgress />
</div>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
	class:hidden={!isModalOpen}
	class="z-50 fixed flex items-center justify-center top-0 left-0 w-full h-full bg-black/25 backdrop-blur-md transition-all"
	on:click={(e) => {
		if (e.target === e.currentTarget) {
			isModalOpen = false;
		}
	}}
	on:keydown={(e) => {
		if (e.key === "Escape") {
			isModalOpen = false;
		}
	}}
	role="dialog"
>
	<div class="w-full p-4 rounded bg-slate-800 max-w-sm flex flex-col gap-2">
		<input type="text" bind:value={newDeviceName} />
		<div>
			<button
				class="px-2 py-1 rounded bg-rose-500 text-white"
				type="button"
				on:click={() => {
					newDeviceName = "";
					isModalOpen = false;
				}}>Cancel</button
			>

			<button
				class="px-2 py-1 rounded bg-green-500 text-white"
				type="button"
				on:click={() => {
					saveDeviceName();
					isModalOpen = false;
				}}>Save</button
			>
		</div>
	</div>
</div>
<div
	class:hidden={!isPassToDeviceModalOpen}
	class="z-50 fixed flex items-center justify-center top-0 left-0 w-full h-full bg-black/25 backdrop-blur-md transition-all"
	on:click={(e) => {
		if (e.target === e.currentTarget) {
			isPassToDeviceModalOpen = false;
		}
	}}
>
	<div
		class="w-full p-4 rounded border border-slate-500/50 bg-slate-800 max-w-sm flex flex-col gap-2"
	>
		<div class="flex flex-col gap-2 w-full">
			{#each Object.keys(devices) as key}
				<button
					class="px-2 py-1 rounded bg-green-500 text-white w-full"
					type="button"
					on:click={() => {
						passToDevice(key);
						isPassToDeviceModalOpen = false;
					}}>{key}</button
				>
			{/each}
		</div>
	</div>
</div>

<style lang="postcss">
	:global(html.fullscreen nav) {
		@apply transition-transform;
	}

	:global(html:not(.fullscreen) nav) {
		@apply transition-none;
	}

	:global(html.fullscreen.scroll-top nav) {
		@apply -translate-y-full;
	}
	:global(html.fullscreen:not(.scroll-top) nav) {
		@apply delay-200 translate-y-0;
	}

	:global(html.fullscreen ::-webkit-scrollbar) {
		display: none;
	}

	/* Hide scrollbar for Firefox */
	:global(html.fullscreen) {
		scrollbar-width: none;
	}

	/* Hide scrollbar for IE and Edge */
	:global(html.fullscreen body) {
		-ms-overflow-style: none;
	}
</style>
