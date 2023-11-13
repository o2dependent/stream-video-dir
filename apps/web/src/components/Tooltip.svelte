<script lang="ts">
	import { fly } from "svelte/transition";

	type Positions = `${"top" | "bottom"} ${"left" | "right" | "center"}`;

	export let className: string = "";
	export let tip: string;
	export let pos: Positions = "top center";

	let hovering = false;
	let hoveringTimeout: NodeJS.Timeout;
	const mouseenter = () => {
		clearTimeout(hoveringTimeout);
		hoveringTimeout = setTimeout(() => {
			hovering = true;
		}, 250);
	};
	const mouseleave = () => {
		clearTimeout(hoveringTimeout);
		hovering = false;
	};
</script>

<div
	on:mouseenter={mouseenter}
	on:mouseleave={mouseleave}
	on:focusin={mouseenter}
	on:focusout={mouseleave}
	class="relative {className}"
	role="group"
>
	{#if hovering}
		<p
			class="tooltip absolute w-fit select-none bg-black/50 shadow-md text-white px-1 py-0.5 rounded whitespace-nowrap {pos}"
			in:fly={{ duration: 150, y: -10, opacity: 0 }}
			out:fly={{ duration: 150, y: -10, opacity: 0 }}
		>
			{tip}
		</p>
	{/if}
	<slot />
</div>

<style lang="postcss">
	.tooltip.top {
		@apply -top-4 -translate-y-full;
	}
	.tooltip.bottom {
		@apply -bottom-4 translate-y-full;
	}
	.tooltip.center {
		@apply left-1/2 -translate-x-1/2;
	}
	.tooltip.left {
		@apply left-0;
	}
	.tooltip.right {
		@apply right-0;
	}
</style>
