<script lang="ts">
	import { toggleFullscreen } from "$stores/isFullscreen";
	import { onMount } from "svelte";
	import { paused, video } from "./video";

	export let tempShowControls: () => void;

	const keydown = (e: KeyboardEvent) => {
		if (e.key === " " || e.key === "k") {
			e.preventDefault();
			$paused ? $video.play() : $video.pause();
		} else if (e.key === "ArrowRight") {
			e.preventDefault();
			$video.currentTime += 5;
			tempShowControls();
		} else if (e.key === "ArrowLeft") {
			e.preventDefault();
			$video.currentTime -= 5;
			tempShowControls();
		} else if (e.key === "m") {
			$video.muted = !$video.muted;
		} else if (e.key === "f") {
			toggleFullscreen();
		}
	};

	onMount(() => {
		window.addEventListener("keydown", keydown);
		return () => {
			window.removeEventListener("keydown", keydown);
		};
	});
</script>
