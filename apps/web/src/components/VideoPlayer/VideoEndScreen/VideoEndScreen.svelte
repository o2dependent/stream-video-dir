<script lang="ts">
	import { fade } from "svelte/transition";
	import type { RecordModel } from "pocketbase";
	import { duration, currentTime } from "../video";
	import VideoThumbnail from "$components/VideoThumbnail.svelte";
	import { navigate } from "astro/transitions/router";
	import EpisodeItem from "$components/EpisodeItem.svelte";

	export let autoplayNext: boolean;
	export let nextEpisode: RecordModel | undefined;

	$: videoEnded = !!($currentTime && $currentTime === $duration);
	let autoplayTimeout: NodeJS.Timeout | undefined;
	let autoplayCountdownInterval: NodeJS.Timeout | undefined;
	let autoplayCountdown = 5;
	let autoplayCancelled = false;
	$: {
		if (videoEnded) {
			autoplayCancelled = false;
		}
	}
	$: {
		if (
			autoplayNext &&
			!autoplayCancelled &&
			videoEnded &&
			nextEpisode &&
			nextEpisode?.id &&
			!autoplayTimeout &&
			!autoplayCountdownInterval
		) {
			autoplayCountdown = 5;
			autoplayCountdownInterval = setInterval(() => {
				autoplayCountdown = autoplayCountdown - 1;
			}, 1000);
			autoplayTimeout = setTimeout(() => {
				// navigate to next video
				navigate(`/episode/${nextEpisode?.id}`);
			}, 5000);
		} else if (!videoEnded || autoplayCancelled || !autoplayNext) {
			clearTimeout(autoplayTimeout);
			clearInterval(autoplayCountdownInterval);
			autoplayTimeout = undefined;
			autoplayCountdownInterval = undefined;
		}
	}
</script>

{#if videoEnded && !autoplayCancelled}
	<div
		in:fade={{ duration: 500 }}
		out:fade={{ duration: 150 }}
		class="absolute z-10 top-0 left-0 w-full h-full flex justify-center items-center bg-black"
	>
		{#if nextEpisode && nextEpisode?.id}
			<div
				class="flex flex-col h-full items-center justify-center w-full -mt-20 max-w-xl"
			>
				<div class="flex flex-col gap-2 items-center justify-center">
					<p
						class:opacity-0={!autoplayNext}
						class:select-none={!autoplayNext}
						class="text-white/90 w-full transition-opacity duration-300"
					>
						Up next in <span class="text-white">{autoplayCountdown}</span>
					</p>
					<EpisodeItem episode={nextEpisode} />
					<div class="w-full flex gap-2">
						<button
							on:click={() => {
								autoplayCancelled = true;
							}}
							class="rounded-full w-full h-fit px-4 py-2 mx-auto bg-white/10 hover:text-white focus:text-white text-white/90 transition-colors"
						>
							Cancel
						</button>
						<a
							href={`/episode/${nextEpisode?.id}`}
							class="text-center rounded-full w-full h-fit px-4 py-2 mx-auto bg-white/25 hover:text-white focus:text-white text-white/90 transition-colors"
						>
							Play Now
						</a>
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}
