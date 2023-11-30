<script lang="ts">
	import { volume } from "./VideoControls/Controls/Volume/volume.ts";
	import VideoPlayPausePopup from "./VideoPlayPausePopup.svelte";
	import VideoEndScreen from "./VideoEndScreen/VideoEndScreen.svelte";
	import KeyboardControls from "./KeyboardControls.svelte";
	import { toggleFullscreen } from "$stores/isFullscreen";
	import PocketBase, { type RecordModel } from "pocketbase";
	import { onMount } from "svelte";
	import VideoControls from "./VideoControls/VideoControls.svelte";
	import VideoTop from "./VideoTop/VideoTop.svelte";
	import { currentTime, duration, paused, video } from "./video";

	export let watchedTimestamp: RecordModel | undefined;
	export let nextEpisode: RecordModel | undefined;
	export let episode: RecordModel;

	let pb: PocketBase;
	let isEnded = false;
	$: $currentTime = watchedTimestamp?.timestamp ?? 0;
	let isHovered = false;
	let lastTime = $currentTime;
	$: $duration = watchedTimestamp?.duration ?? 0;

	$: fullyWatched =
		watchedTimestamp?.timestamp &&
		watchedTimestamp?.timestamp === watchedTimestamp?.duration;
	$: startTime = fullyWatched ? 0 : watchedTimestamp?.timestamp ?? 0;

	$: autoplayNext =
		typeof window !== "undefined" &&
		window.localStorage.getItem("autoplay") === "true";

	$: {
		if (typeof window !== "undefined") {
			window.localStorage.setItem("autoplay", autoplayNext.toString());
		}
	}

	onMount(() => {
		pb = new PocketBase("http://127.0.0.1:8090");
	});

	const updateTimestamp = async (time: number) => {
		if (watchedTimestamp && Math.floor(time) != lastTime) {
			lastTime = Math.floor(time);
			await pb.collection("watched_timestamps").update(watchedTimestamp?.id, {
				timestamp: lastTime,
				duration: $video?.duration ?? 0,
			});
		}
	};

	const timeupdate = async (e: Event) => {
		const target = e.currentTarget as HTMLVideoElement;
		if (isEnded && target.currentTime !== target.duration) {
			isEnded = false;
			return;
		}
		if (pb) {
			updateTimestamp(target?.currentTime);
		}
	};

	const ended = (e: Event) => {};

	let hoverTimeout: NodeJS.Timeout;
	const tempShowControls = () => {
		clearTimeout(hoverTimeout);
		isHovered = true;
		hoverTimeout = setTimeout(() => {
			isHovered = false;
		}, 2000);
	};

	const mousemove = (e: MouseEvent) => {
		tempShowControls();
	};

	let dblClickTimeout: NodeJS.Timeout;
	const togglePause = () => {
		clearTimeout(dblClickTimeout);
		dblClickTimeout = setTimeout(() => {
			if ($paused) {
				$video?.play?.();
			} else {
				$video?.pause?.();
			}
		}, 300);
	};

	const dblclickFullscreen = () => {
		clearTimeout(dblClickTimeout);
		toggleFullscreen();
	};
</script>

<div
	class="relative h-full w-full flex flex-col justify-center items-center overflow-hidden"
	class:cursor-none={!($paused || isHovered)}
>
	<KeyboardControls {tempShowControls} />

	<video
		bind:this={$video}
		bind:paused={$paused}
		bind:duration={$duration}
		bind:currentTime={$currentTime}
		bind:volume={$volume}
		class="object-contain h-screen w-full"
		on:dblclick={dblclickFullscreen}
		on:mousemove={mousemove}
		on:timeupdate={timeupdate}
		on:ended={ended}
		on:click={togglePause}
		on:loadedmetadata={() => document?.hasFocus() && $video?.play?.()}
	>
		<source
			src={`/video/stream/episode/${episode?.id}${
				startTime ? `#t=${startTime}` : ""
			}`}
			type="video/mp4"
		/>
		<track kind="captions" />
		Your browser does not support the video tag.
	</video>
	<VideoPlayPausePopup />

	<VideoTop bind:isHovered {episode} />

	<VideoControls bind:autoplayNext bind:isHovered {episode} {nextEpisode} />

	<VideoEndScreen {nextEpisode} {autoplayNext} />
</div>
