<script lang="ts">
	import { onMount } from "svelte";

	export let video: HTMLVideoElement;
	export let tempShowControls: () => void;

	const keydown = (e: KeyboardEvent) => {
		if (e.key === " ") {
			e.preventDefault();
			video?.paused ? video.play() : video.pause();
		} else if (e.key === "ArrowRight") {
			e.preventDefault();
			video.currentTime += 5;
			tempShowControls();
		} else if (e.key === "ArrowLeft") {
			e.preventDefault();
			video.currentTime -= 5;
			tempShowControls();
		}
	};

	onMount(() => {
		window.addEventListener("keydown", keydown);
	});
</script>
