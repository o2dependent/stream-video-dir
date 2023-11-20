<script lang="ts">
	import { navigate } from "astro:transitions/client";
	import { fade } from "svelte/transition";
	import VideoThumbnail from "$components/VideoThumbnail.svelte";

	export let autoplayNext: boolean;
	export let video: HTMLVideoElement;
	export let duration: number | undefined;
	export let nextVid:
		| {
				videoPath: string;
				videoTitle: string;
				duration: number | undefined;
				timestamp: number | undefined;
		  }
		| undefined;

	$: videoEnded = video?.currentTime && video?.currentTime === duration;
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
			nextVid &&
			!autoplayTimeout &&
			!autoplayCountdownInterval
		) {
			console.log("autoplaying in 5 seconds");
			autoplayCountdown = 5;
			autoplayCountdownInterval = setInterval(() => {
				autoplayCountdown = autoplayCountdown - 1;
			}, 1000);
			autoplayTimeout = setTimeout(() => {
				// navigate to next video
				navigate(`/directory/${nextVid?.videoPath}/watch`);
			}, 5000);
		} else if (!videoEnded || autoplayCancelled || !autoplayNext) {
			clearTimeout(autoplayTimeout);
			clearInterval(autoplayCountdownInterval);
			autoplayTimeout = undefined;
			autoplayCountdownInterval = undefined;
		}
	}
</script>

{#if autoplayNext && videoEnded && !autoplayCancelled}
	<div
		in:fade={{ duration: 500 }}
		out:fade={{ duration: 150 }}
		class="absolute z-10 top-0 left-0 w-full h-full flex justify-center items-center bg-black"
	>
		{#if nextVid}
			<div
				class="flex flex-col h-full items-center justify-center w-full -mt-20"
			>
				<div class="flex flex-col gap-2 items-center justify-center">
					<p class="text-white/90 w-full">
						Up next in <span class="text-white">{autoplayCountdown}</span>
					</p>
					<VideoThumbnail
						duration={nextVid.duration}
						videoPath={nextVid.videoPath}
						timestamp={nextVid.timestamp}
						videoTitle={nextVid.videoTitle}
					/>
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
							href={`/directory/${nextVid.videoPath}/watch`}
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
