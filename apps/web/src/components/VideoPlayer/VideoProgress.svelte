<script lang="ts">
	import { fly } from "svelte/transition";
	import { formatTime } from "$lib/formatTime";
	import { padNum } from "$lib/padTime";

	export let duration: number | undefined;
	export let video: HTMLVideoElement;
	export let currentTime = 0;
	export let durationTime: {
		hours: number;
		minutes: number;
		seconds: number;
	};

	let container: HTMLDivElement;

	let isChanging = false;
	let isChangingPaused = false;
	let changingCurrentTime = currentTime;
	$: {
		if (!isChanging) {
			changingCurrentTime = currentTime;
		}
	}
	let curTime = formatTime(currentTime);
	$: {
		if (isChanging) curTime = formatTime(changingCurrentTime);
		else curTime = formatTime(currentTime);
	}

	const progressbarMousemove = (e: MouseEvent) => {
		const rect = container?.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const width = container.clientWidth;
		const percent = x / width;
		changingCurrentTime = percent * (duration ?? 1);
	};
	const progressbarMousedown = (e: MouseEvent) => {
		isChanging = true;
		isChangingPaused = video.paused;
		if (!isChangingPaused) {
			video.pause();
		}
		const rect = container?.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const width = container.clientWidth;
		const percent = x / width;
		changingCurrentTime = percent * (duration ?? 1);
		window.addEventListener("mousemove", progressbarMousemove);
		window.addEventListener("mouseup", progressbarMouseup);
	};

	const progressbarMouseup = (e: MouseEvent) => {
		isChanging = false;
		if (!isChangingPaused) {
			video.play();
			isChangingPaused = false;
		}
		currentTime = changingCurrentTime;
		video.currentTime = changingCurrentTime;
		window.removeEventListener("mousemove", progressbarMousemove);
		window.removeEventListener("mouseup", progressbarMouseup);
	};

	let hoverTimestamp: HTMLParagraphElement;
	let isHovered = false;
	let hoverTime = formatTime(currentTime);
	let hoverPercent =
		((isChanging ? changingCurrentTime : currentTime) / (duration ?? 1)) * 100;
	$: {
		if (!isHovered) {
			hoverPercent =
				((isChanging ? changingCurrentTime : currentTime) / (duration ?? 1)) *
				100;
			hoverTime = formatTime(currentTime);
		}
	}
	const hoverThumbMousemove = (e: MouseEvent) => {
		const rect = container?.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const width = container.clientWidth;
		const percent = x / width;
		hoverPercent = percent * 100;
		hoverTime = formatTime((duration ?? 0) * percent);
	};
	const progressbarMouseenter = () => {
		isHovered = true;
		container.addEventListener("mouseleave", progressbarMouseleave);
		window.addEventListener("mousemove", hoverThumbMousemove);
	};
	const progressbarMouseleave = () => {
		isHovered = false;
		container.removeEventListener("mouseleave", progressbarMouseleave);
		window.removeEventListener("mousemove", hoverThumbMousemove);
	};
</script>

<div
	bind:this={container}
	class="group relative w-full"
	on:mouseenter={progressbarMouseenter}
	on:mousedown={progressbarMousedown}
	role="button"
	tabindex="0"
	on:keydown={(e) => {
		if (e.key === "Enter" || e.key === " ") {
			// progressbarClick(e);
		}
	}}
>
	<div
		class="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 group-hover:h-1.5 bg-slate-400/50 flex items-center transition-all origin-bottom"
		class:h-1.5={isChanging}
		class:duration-0={isChanging}
		role="progressbar"
		aria-valuemin={0}
		aria-valuemax={duration ?? 1}
		aria-valuenow={isChanging ? changingCurrentTime : currentTime}
	>
		<div
			class="h-full bg-red-500 transition-all origin-bottom"
			class:duration-0={isChanging}
			style={`width: ${
				((isChanging ? changingCurrentTime : currentTime) / (duration ?? 1)) *
				100
			}%`}
			aria-hidden="true"
		/>
		<div
			class="flex -ml-2 w-0 h-0 group-hover:w-4 group-hover:h-4 rounded-full bg-red-500 transition-all"
			class:w-4={isChanging}
			class:h-4={isChanging}
			class:duration-0={isChanging}
			aria-hidden="true"
		/>
		{#if isChanging || isHovered}
			<p
				in:fly={{ y: -4, duration: 150 }}
				out:fly={{ y: 4, duration: 150 }}
				bind:this={hoverTimestamp}
				class="absolute -top-full -translate-y-full w-fit select-none bg-black/50 text-white px-1 py-0.5 rounded whitespace-nowrap"
				style="left: min(calc(100% - {hoverTimestamp?.clientWidth ??
					0}px),max(calc({hoverPercent}% - {(hoverTimestamp?.clientWidth ?? 0) /
					2}px), 0%));"
			>
				{durationTime?.hours > 0
					? `${hoverTime?.hours}:`
					: ""}{durationTime?.hours > 0
					? padNum(hoverTime?.minutes)
					: hoverTime?.minutes}:{padNum(hoverTime?.seconds)}
			</p>
		{/if}
	</div>
	<!-- <input
		min="0"
		max={duration ?? 0}
		on:change={(e) => {
			video.currentTime = Number(e.currentTarget?.value);
			currentTime = Number(e.currentTarget?.value);
		}}
		value={currentTime}
		type="range"
	/> -->
</div>

<style lang="postcss">
	input {
		/* --c: rgb(168 85 247 / var(--tw-text-opacity)); active color */
		--c: rgb(168 85 247); /* active color */
		--g: 0.25rem; /* the gap */
		--l: 0.25rem; /* line thickness*/
		--s: 1rem; /* thumb size*/

		width: 100%;
		height: var(--s); /* needed for Firefox*/
		--_c: color-mix(in srgb, var(--c), #000 var(--p, 0%));
		@apply w-full appearance-none bg-none bg-transparent cursor-pointer overflow-hidden transition-all origin-center;
	}
	input:focus-visible,
	input:hover {
		--p: 25%;
	}
	input:active,
	input:focus-visible {
		--_b: var(--s);
	}
	/* chromium */
	input[type="range" i]::-webkit-slider-thumb {
		height: var(--s);
		aspect-ratio: 1;
		border-radius: 50%;
		box-shadow: 0 0 0 var(--_b, var(--l)) inset var(--_c);
		border-image: linear-gradient(90deg, var(--c) 50%, #ababab 0) 1/0 100vw/0
			calc(100vw + var(--g));
		clip-path: polygon(
			0 calc(50% + var(--l) / 2),
			-100vw calc(50% + var(--l) / 2),
			-100vw calc(50% - var(--l) / 2),
			0 calc(50% - var(--l) / 2),
			0 0,
			100% 0,
			100% calc(50% - var(--l) / 2),
			100vw calc(50% - var(--l) / 2),
			100vw calc(50% + var(--l) / 2),
			100% calc(50% + var(--l) / 2),
			100% 100%,
			0 100%
		);
		-webkit-appearance: none;
		appearance: none;
		transition: 0.3s;
	}
	/* Firefox */
	input[type="range"]::-moz-range-thumb {
		height: var(--s);
		width: var(--s);
		background: none;
		border-radius: 50%;
		box-shadow: 0 0 0 var(--_b, var(--l)) inset var(--_c);
		border-image: linear-gradient(90deg, var(--_c) 50%, #ababab 0) 1/0 100vw/0
			calc(100vw + var(--g));
		clip-path: polygon(
			0 calc(50% + var(--l) / 2),
			-100vw calc(50% + var(--l) / 2),
			-100vw calc(50% - var(--l) / 2),
			0 calc(50% - var(--l) / 2),
			0 0,
			100% 0,
			100% calc(50% - var(--l) / 2),
			100vw calc(50% - var(--l) / 2),
			100vw calc(50% + var(--l) / 2),
			100% calc(50% + var(--l) / 2),
			100% 100%,
			0 100%
		);
		-moz-appearance: none;
		appearance: none;
		transition: 0.3s;
	}
	@supports not (color: color-mix(in srgb, red, red)) {
		input {
			--_c: var(--c);
		}
	}
</style>
