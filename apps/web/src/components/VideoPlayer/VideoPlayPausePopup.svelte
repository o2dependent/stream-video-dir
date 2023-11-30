<script lang="ts">
	import { fade } from "svelte/transition";
	import { scale } from "svelte/transition";
	import PlayPauseIcon from "./PlayPauseIcon.svelte";
	import { paused } from "./video";

	let showIcon = false;
	let showIconTimeout: NodeJS.Timeout;
	$: {
		if (typeof $paused === "boolean") {
			showIcon = false;
			clearTimeout(showIconTimeout);
			showIcon = true;
			showIconTimeout = setTimeout(() => {
				showIcon = false;
			}, 350);
		}
	}
</script>

{#if showIcon}
	<div
		in:scale={{ duration: 200, delay: 0, opacity: 0 }}
		out:fade={{ duration: 200, delay: 0 }}
		class="select-none absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center justify-center bg-black/25 p-4 rounded-full w-44 h-44 opacity-50"
	/>
	<div
		in:scale={{ duration: 150, delay: 50, opacity: 0 }}
		out:fade={{ duration: 150, delay: 50 }}
		class="select-none absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center justify-center bg-black/25 p-4 rounded-full w-44 h-44 opacity-50"
	/>
	<div
		in:scale={{ duration: 100, delay: 100, opacity: 0 }}
		out:fade={{ duration: 100, delay: 100 }}
		class="flex flex-col justify-center items-center absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
		class:paused={!$paused}
	>
		<PlayPauseIcon className="rounded-full !w-32 !h-32 flex" />
	</div>
{/if}
