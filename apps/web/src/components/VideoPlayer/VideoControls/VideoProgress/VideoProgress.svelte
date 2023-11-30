<script lang="ts">
	import { formatTime } from "$lib/formatTime";
	import { padNum } from "$lib/padTime";
	import ScrubImages from "./ScrubImages.svelte";
	import { currentTime, duration, video } from "$components/VideoPlayer/video";

	export let id: string;
	export let durationTime: {
		hours: number;
		minutes: number;
		seconds: number;
	};

	let container: HTMLDivElement;

	let isChanging = false;
	let isChangingPaused = false;
	let changingCurrentTime = $currentTime;
	$: {
		if (!isChanging) {
			changingCurrentTime = $currentTime;
		}
	}

	const progressbarMousemove = (e: MouseEvent) => {
		const rect = container?.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const width = container.clientWidth;
		const percent = x / width;
		changingCurrentTime = percent * ($duration ?? 1);
	};
	const progressbarMousedown = (e: MouseEvent) => {
		isChanging = true;
		isChangingPaused = $video.paused;
		if (!isChangingPaused) {
			$video.pause();
		}
		const rect = container?.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const width = container.clientWidth;
		const percent = x / width;
		changingCurrentTime = percent * ($duration ?? 1);
		window.addEventListener("mousemove", progressbarMousemove);
		window.addEventListener("mouseup", progressbarMouseup);
	};

	const progressbarMouseup = (e: MouseEvent) => {
		isChanging = false;
		if (!isChangingPaused) {
			$video.play();
			isChangingPaused = false;
		}
		$currentTime = changingCurrentTime;
		$video.currentTime = changingCurrentTime;
		window.removeEventListener("mousemove", progressbarMousemove);
		window.removeEventListener("mouseup", progressbarMouseup);
	};

	let hoverTimestamp: HTMLParagraphElement;
	let isHovered = false;
	let hoverTime = formatTime($currentTime);
	let hoverPercent =
		((isChanging ? changingCurrentTime : $currentTime) / ($duration ?? 1)) *
		100;
	$: {
		if (!isHovered) {
			hoverPercent =
				((isChanging ? changingCurrentTime : $currentTime) / ($duration ?? 1)) *
				100;
			hoverTime = formatTime($currentTime);
		}
	}
	const hoverThumbMousemove = (e: MouseEvent) => {
		const rect = container?.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const width = container.clientWidth;
		const percent = x / width;
		hoverPercent = percent * 100;
		hoverTime = formatTime(($duration ?? 0) * percent);
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
		aria-valuemax={$duration ?? 1}
		aria-valuenow={isChanging ? changingCurrentTime : $currentTime}
	>
		<div
			class="h-full bg-red-500 origin-bottom"
			class:duration-0={isChanging}
			style={`width: ${
				((isChanging ? changingCurrentTime : $currentTime) / ($duration ?? 1)) *
				100
			}%; transition-property: height; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;`}
			aria-hidden="true"
		/>
		<div
			class="flex -ml-2 w-0 h-0 group-hover:w-4 group-hover:h-4 rounded-full bg-red-500 transition-all"
			class:w-4={isChanging}
			class:h-4={isChanging}
			class:duration-0={isChanging}
			aria-hidden="true"
		/>
		<div
			bind:this={hoverTimestamp}
			class:invisible={!(isChanging || isHovered)}
			class:opacity-100={isChanging || isHovered}
			class:opacity-0={!(isChanging || isHovered)}
			class="absolute -top-full -translate-y-full transition-opacity flex flex-col max-w-xs w-full items-center justify-center gap-1 hover:invisible"
			style="left: min(calc(100% - {hoverTimestamp?.clientWidth ??
				0}px),max(calc({hoverPercent}% - {(hoverTimestamp?.clientWidth ?? 0) /
				2}px), 0%)); transition: opacity 300ms ease-in-out, transform 300ms ease-in-out;"
		>
			<ScrubImages {id} currentTime={(hoverPercent / 100) * ($duration ?? 1)} />
			<p
				class="w-fit select-none bg-black/50 text-white px-1 py-0.5 rounded whitespace-nowrap shadow-md"
			>
				{durationTime?.hours > 0
					? `${hoverTime?.hours}:`
					: ""}{durationTime?.hours > 0
					? padNum(hoverTime?.minutes)
					: hoverTime?.minutes}:{padNum(hoverTime?.seconds)}
			</p>
		</div>
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
