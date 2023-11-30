<script lang="ts">
	import { navigate } from "astro/transitions/router";
	import type { RecordModel } from "pocketbase";

	export let video: HTMLVideoElement;
	export let autoplayNext: boolean;
	export let nextEpisode: RecordModel | undefined;
	export let duration: number | undefined;

	$: videoEnded = !!(video?.currentTime && video?.currentTime === duration);
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
			console.log("autoplaying in 5 seconds");
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

<slot {videoEnded} {autoplayCancelled} {autoplayCountdown} />
