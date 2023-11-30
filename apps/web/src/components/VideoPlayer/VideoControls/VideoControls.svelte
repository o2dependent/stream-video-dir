<script lang="ts">
	import { fly } from "svelte/transition";
	import { padNum } from "$lib/padTime";
	import NextVideoButton from "./Controls/NextVideoButton.svelte";
	import PlayPauseButton from "./Controls/PlayPauseButton.svelte";
	import VideoProgress from "./VideoProgress/VideoProgress.svelte";
	import FullscreenButton from "./Controls/FullscreenButton.svelte";
	import VolumeController from "./Controls/Volume/VolumeController.svelte";
	import AutoplayToggle from "./Controls/AutoplayToggle.svelte";
	import { formatTime } from "$lib/formatTime";
	import type { RecordModel } from "pocketbase";

	export let video: HTMLVideoElement;
	export let isHovered: boolean;
	export let episode: RecordModel;
	export let nextEpisode: RecordModel | undefined;
	export let duration: number | undefined;
	export let currentTime: number;
	export let autoplayNext: boolean;

	let controlsContainer: HTMLDivElement;

	$: curTime = formatTime(currentTime);
	$: durationTime = formatTime(duration ?? 0);
</script>

<div
	aria-label="Video controls"
	id="controls"
	class="peer grid grid-cols-1 grid-rows-[1rem_3rem] px-3 absolute bottom-0 left-0 w-full z-40 h-16 bg-gradient-to-t from-black via-black/25 to-black/0 hover:opacity-100 hover:translate-y-0 peer-hover:opacity-100 peer-hover:translate-y-0 opacity-0 transition-all duration-300 cursor-default"
	class:opacity-100={video?.paused || isHovered}
	class:translate-y-full={!(video?.paused || isHovered)}
>
	<VideoProgress
		id={episode?.id}
		{durationTime}
		{duration}
		{video}
		bind:currentTime
	/>
	<div
		bind:this={controlsContainer}
		class="flex flex-col w-full flex-grow h-full relative"
	>
		<div class="flex justify-betweens h-full w-full">
			<div class="h-full w-full flex gap-2 items-center">
				<PlayPauseButton {video} containEl={controlsContainer} />

				<VolumeController {video} containEl={controlsContainer} />

				<p
					class="flex justify-center items-center h-full w-fit whitespace-nowrap"
				>
					{durationTime?.hours > 0
						? `${curTime?.hours}:`
						: ""}{durationTime?.hours > 0
						? padNum(curTime?.minutes)
						: curTime?.minutes}:{padNum(curTime?.seconds)} / {durationTime?.hours >
					0
						? `${durationTime?.hours}:`
						: ""}
					{durationTime?.hours > 0
						? padNum(durationTime?.minutes ?? 0)
						: durationTime?.minutes}:{padNum(durationTime?.seconds ?? 0)}
				</p>
				<p
					class="hidden sm:block text-base font-bold w-full text-ellipsis whitespace-nowrap overflow-hidden"
				>
					{episode?.name ?? "No title found"}
				</p>
			</div>
			<div class="flex justify-end gap-2">
				<NextVideoButton containEl={controlsContainer} episode={nextEpisode} />
				<AutoplayToggle bind:autoplayNext containEl={controlsContainer} />
				<FullscreenButton containEl={controlsContainer} />
			</div>
		</div>
	</div>
</div>
{#if nextEpisode && nextEpisode?.id && (currentTime / video?.duration) * 100 >= 99.5}
	<div
		in:fly={{ y: 16, duration: 300 }}
		out:fly={{ y: -16, duration: 300 }}
		class:-translate-y-16={video?.paused || isHovered}
		class:translate-y-0={!(video?.paused || isHovered)}
		class="absolute peer-hover:-translate-y-16 h-8 right-4 bottom-4 transition-all duration-300"
	>
		<a
			href={`/episode/${nextEpisode?.id}`}
			class="rounded-md px-2 py-1 lg:text-lg bg-black/20 backdrop-blur-md text-white/80 border border-white/10 hover:border-white/25 hover:text-white transition-colors duration-300"
			type="button"
		>
			Play Next
		</a>
	</div>
{/if}
