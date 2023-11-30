<script lang="ts">
	import { scale } from "svelte/transition";
	import Tooltip from "$components/Tooltip.svelte";
	import { cubicOut } from "svelte/easing";

	export let containEl: HTMLElement;
	export let muted: boolean;
	export let volume: number;
</script>

<Tooltip
	tip="Volume"
	pos="top center"
	{containEl}
	className="group/controls h-full"
>
	<div
		class="overflow-hidden w-0 group-hover:w-24 group-focus-within:w-24 px-0 group-hover:px-2 group-focus-within:px-2 h-full flex items-center transition-all"
	>
		<div
			class="w-20 relative h-full flex items-center group-hover/controls:drop-shadow-sm group-hover/controls:-translate-y-0.5 transition-all drop-shadow-none duration-300"
		>
			<input
				class="w-20 h-full accent-white appearance-none opacity-0 bg-transparent peer"
				min="0"
				max="1"
				step="0.01"
				type="range"
				on:keydown={(e) => {
					e.stopPropagation();
				}}
				on:change={(e) => {
					if (muted && parseInt(e.currentTarget.value) > 0) {
						muted = false;
					}
				}}
				bind:value={volume}
			/>
			<!-- <div
						class="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-white rounded-full pointer-events-none"
					/> -->
			{#if !muted}
				<div
					class="absolute top-1/2 -translate-y-1/2 left-0 w-full px-0.5 pointer-events-none origin-left"
					in:scale={{ duration: 300, start: 0, opacity: 1, easing: cubicOut }}
					out:scale={{
						duration: 300,
						start: 0,
						opacity: 1,
						easing: cubicOut,
					}}
				>
					<div
						class="w-full h-1 bg-white rounded-full"
						style="width: {muted ? 0 : volume * 100}%;"
					/>
				</div>
			{/if}

			<div
				class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-0 w-0 peer-hover:h-2 peer-hover:w-2 peer-focus:h-2
							peer-focus:w-2 bg-white rounded-full pointer-events-none"
				style="left: {volume *
					100}%; transition: height 300ms ease-in-out, width 300ms ease-in-out;"
			/>
			<div
				class="absolute top-1/2 -translate-y-1/2 left-0 w-full px-0.5 pointer-events-none"
			>
				<div class="w-full h-1 bg-white/50 rounded-full" />
			</div>
		</div>
	</div>
</Tooltip>
