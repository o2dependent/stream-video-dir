<script lang="ts">
	import { fly } from "svelte/transition";

	type Positions = `${"top" | "bottom"} ${"left" | "right" | "center"}`;

	export let className: string = "";
	export let tip: string | true;
	export let pos: Positions = "top center";
	export let containEl: HTMLElement | undefined = undefined;

	let tooltipEl: HTMLElement;
	let wrapperEl: HTMLElement;

	// find distance between the beginning of the contain element and the beginning of the tooltip element
	let distance = 0;
	$: {
		if (containEl && wrapperEl && tooltipEl) {
			const tooltipWidth = tooltipEl.clientWidth;
			const rect = wrapperEl.getBoundingClientRect();
			const containRect = containEl.getBoundingClientRect();
			const wrapperStart = rect.left;
			const containStart = containRect.left;
			const wrapperEnd = rect.right;
			const containEnd = containRect.right;
			const startDistance = wrapperStart + containStart;
			const endDistance = containEnd - wrapperEnd;
			if (startDistance < tooltipWidth / 2) {
				distance = -startDistance;
			} else if (endDistance < tooltipWidth / 2) {
				distance = -tooltipWidth + rect.width / 2 + endDistance;
			} else {
				distance = -(tooltipWidth / 2);
			}
		}
	}

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
	let style = "";
	$: {
		style =
			pos.split(" ")[1] === "center"
				? `left: 50%; transform: translateX(${distance}px) translateY(var(--tw-translate-y));`
				: // `left: 50%; transform: translateX(max(-50%, -${
				  // 		distance || 0
				  //   }px)) translateY(var(--tw-translate-y));`
				  "";
	}
</script>

<div
	bind:this={wrapperEl}
	on:mouseenter={mouseenter}
	on:mouseleave={mouseleave}
	on:focusin={mouseenter}
	on:focusout={mouseleave}
	class="relative {className}"
	role="group"
>
	{#key tip}
		{#if hovering}
			<div
				bind:this={tooltipEl}
				class="tooltip absolute w-fit select-none overflow-hidden rounded whitespace-nowrap {pos}"
				{style}
				in:fly={{ duration: 150, y: 8, opacity: 0 }}
				out:fly={{ duration: 150, y: 8, opacity: 0 }}
			>
				<slot name="tip">
					<p
						class="bg-black/50 ring-1 ring-white shadow-md text-white px-1 py-0.5"
					>
						{tip}
					</p>
				</slot>
			</div>
		{/if}
	{/key}
	<slot />
</div>

<style lang="postcss">
	.tooltip.top {
		@apply -top-4 -translate-y-full;
	}
	.tooltip.bottom {
		@apply -bottom-4 translate-y-full;
	}
	.tooltip.left {
		@apply left-0;
	}
	.tooltip.right {
		@apply right-0;
	}
</style>
