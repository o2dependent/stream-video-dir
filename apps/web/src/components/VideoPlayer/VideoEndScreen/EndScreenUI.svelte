<script lang="ts">
	import { fade } from "svelte/transition";
	import VideoThumbnail from "$components/VideoThumbnail.svelte";
	import type { RecordModel } from "pocketbase";

	export let autoplayNext: boolean;
	export let nextEpisode: RecordModel | undefined;
	export let videoEnded: boolean;
	export let autoplayCancelled: boolean;
	export let autoplayCountdown: number;
</script>

{#if videoEnded && !autoplayCancelled}
	<div
		in:fade={{ duration: 500 }}
		out:fade={{ duration: 150 }}
		class="absolute z-10 top-0 left-0 w-full h-full flex justify-center items-center bg-black"
	>
		{#if nextEpisode && nextEpisode?.id}
			<div
				class="flex flex-col h-full items-center justify-center w-full -mt-20"
			>
				<div class="flex flex-col gap-2 items-center justify-center">
					<p
						class:opacity-0={!autoplayNext}
						class:select-none={!autoplayNext}
						class="text-white/90 w-full transition-opacity duration-300"
					>
						Up next in <span class="text-white">{autoplayCountdown}</span>
					</p>
					<VideoThumbnail episode={nextEpisode} isCurrentVideo={false} />
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
