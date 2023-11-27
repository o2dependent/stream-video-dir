<script lang="ts">
	import { fly } from "svelte/transition";

	type ExtractPosition<PositionString extends string> =
		PositionString extends `${infer Side} ${infer Align}`
			? { side: Side; align: Align }
			: { error: "Cannot parse semver string" };
	type Positions =
		| `${"top" | "bottom"} ${"left" | "right" | "center"}`
		| `${"left" | "right"} ${"top" | "bottom" | "center"}`;
	type Sides = ExtractPosition<Positions>["side"];
	type Aligns = ExtractPosition<Positions>["align"];

	export let className: string = "";
	export let tip: string | true;
	export let pos: Positions = "top center";
	export let containEl: HTMLElement | undefined = undefined;

	let tooltipEl: HTMLElement;
	let wrapperEl: HTMLElement;
	$: [side, align] = pos.split(" ");
	// find distance between the beginning of the contain element and the beginning of the tooltip element
	let distance = 0;
	$: {
		if (containEl && wrapperEl && tooltipEl) {
			const isVertical = side === "top" || side === "bottom";
			const isHorizontal = side === "left" || side === "right";
			const tooltipWidth = tooltipEl.clientWidth;
			const tooltipHeight = tooltipEl.clientHeight;
			const rect = wrapperEl.getBoundingClientRect();
			const containRect = containEl.getBoundingClientRect();

			if (isVertical) {
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
			} else if (isHorizontal) {
				const wrapperStart = rect.top;
				const containStart = containRect.top;
				const wrapperEnd = rect.bottom;
				const containEnd = containRect.bottom;
				const startDistance = wrapperStart + containStart;
				const endDistance = containEnd - wrapperEnd;
				if (startDistance < tooltipHeight / 2) {
					distance = -startDistance;
				} else if (endDistance < tooltipHeight / 2) {
					distance = -tooltipHeight + rect.height / 2 + endDistance;
				} else {
					distance = -(tooltipHeight / 2);
				}
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
		const isVertical = side === "top" || side === "bottom";
		const isHorizontal = side === "left" || side === "right";
		const sideDir = side === "top" || side === "left" ? -1 : 1;
		if (align === "center" && isVertical)
			style = `${side}: ${sideDir}rem; left: 50%; transform: translateX(${distance}px) translateY(${
				100 * sideDir
			}%);`;
		else if (align === "center" && isHorizontal)
			style = `${side}: ${sideDir}rem; top: 50%; transform: translateY(calc(-50% + ${distance}px)) translateX(${
				100 * sideDir
			}%);`;
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
				class="tooltip absolute w-fit select-none overflow-hidden rounded whitespace-nowrap z-50 {pos}"
				{style}
				in:fly={{ duration: 300, y: 8, opacity: 0 }}
				out:fly={{ duration: 300, y: 8, opacity: 0 }}
			>
				<slot name="tip">
					<p
						class="bg-black/50 border border-white/10 rounded shadow-md text-white px-1 py-0.5"
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
