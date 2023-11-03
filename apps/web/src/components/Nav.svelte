<script lang="ts">
	import { io } from "socket.io-client";
	export let hostname: string;
	export let pathname: string;
	export let profile: string | undefined;

	let socket: ReturnType<typeof io>;

	let isModalOpen = false;
	let isPassToDeviceModalOpen = false;
	let deviceName = localStorage.getItem("deviceName") || "";
	// let deviceName = "";
	$: newDeviceName = deviceName;

	let devices: Record<string, any> = {};
	if (typeof window !== "undefined") {
		socket = io(`${hostname}:5432`, {
			withCredentials: true,
		});
		socket.connect();
		socket.emit("join", deviceName);
		socket.on("joined", (data) => {
			devices = data.devices;
		});
		socket.on("passToDevice", (pathname) => {
			// navigate to pathname
			window.location.pathname = pathname;
		});
	}

	const openModal = () => {
		isModalOpen = true;
	};
	const openPassToDeviceModal = () => {
		isPassToDeviceModalOpen = true;
	};
	const saveDeviceName = () => {
		socket.emit("saveDeviceName", {
			oldDeviceName: deviceName,
			newDeviceName,
		});
		deviceName = newDeviceName;
		localStorage.setItem("deviceName", deviceName);
	};
	const passToDevice = (targetDeviceName: string) => {
		socket.emit("passToDevice", {
			targetDeviceName,
			pathname,
		});
	};
</script>

<div class="py-2 bg-purple-500/10">
	<div class="max-w-screen-3xl w-full mx-auto">
		<nav class="mx-auto flex w-full justify-between">
			<div>
				<a
					class="px-2 block py-1 rounded bg-slate-50/10 text-white"
					href="/directory">Home Directory</a
				>
			</div>
			<div class="flex gap-2">
				<button
					class="px-2 py-1 rounded bg-slate-50/10 text-white"
					type="button"
					on:click={openPassToDeviceModal}
				>
					Pass to device
				</button>
				{#if profile}
					<a
						class="px-2 block py-1 rounded bg-slate-50/10 text-white"
						href="/profile">{profile}</a
					>
				{:else}
					<a class="px-2 block py-1 rounded bg-slate-50/10 text-white" href="/"
						>Login</a
					>
				{/if}
				<button
					class="px-2 py-1 rounded bg-slate-50/10 text-white"
					type="button"
					on:click={openModal}
				>
					Edit device name
				</button>
			</div>
		</nav>
	</div>
</div>

<div
	class:hidden={!isModalOpen}
	class="z-50 fixed flex items-center justify-center top-0 left-0 w-full h-full bg-black/25 backdrop-blur-md transition-all"
	on:click={(e) => {
		if (e.target === e.currentTarget) {
			isModalOpen = false;
		}
	}}
>
	<div
		class="w-full p-4 rounded border border-slate-500/50 bg-slate-800 max-w-sm flex flex-col gap-2"
	>
		<input type="text" bind:value={newDeviceName} />
		<div>
			<button
				class="px-2 py-1 rounded bg-red-500 text-white"
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
