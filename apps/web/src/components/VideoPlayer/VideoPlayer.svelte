<script lang="ts">
	import VideoPlayPausePopup from "./VideoPlayPausePopup.svelte";
	import VideoEndScreen from "./VideoEndScreen/VideoEndScreen.svelte";
	import KeyboardControls from "./KeyboardControls.svelte";
	import { curVideoPercent } from "$stores/watch/curVideoPercent";
	import { toggleFullscreen } from "$stores/isFullscreen";
	import PocketBase, { type RecordModel } from "pocketbase";
	import { onMount } from "svelte";
	import VideoControls from "./VideoControls/VideoControls.svelte";
	import VideoTop from "./VideoTop/VideoTop.svelte";

	export let duration: number | undefined = undefined;
	export let watchedTimestamp: RecordModel | undefined;
	export let nextEpisode: RecordModel | undefined;
	export let episode: RecordModel;

	let video: HTMLVideoElement;
	let videoTopContainer: HTMLDivElement;
	let isEnded = false;
	let paused = true;
	$: fullyWatched =
		watchedTimestamp?.timestamp &&
		watchedTimestamp?.timestamp === watchedTimestamp?.duration;
	$: startTime = fullyWatched ? 0 : watchedTimestamp?.timestamp ?? 0;

	let currentTime: number = watchedTimestamp?.timestamp ?? 0;
	$: {
		const isVideoLoaded = video?.readyState === 4;
		if (isVideoLoaded) {
			currentTime = video?.currentTime ?? 0;
			duration = video?.duration ?? 0;
		}
	}
	$: autoplayNext =
		typeof window !== "undefined" &&
		window.localStorage.getItem("autoplay") === "true";
	$: {
		if (typeof window !== "undefined") {
			window.localStorage.setItem("autoplay", autoplayNext.toString());
		}
	}
	let isHovered = false;

	let pb: PocketBase;

	onMount(() => {
		pb = new PocketBase("http://127.0.0.1:8090");
	});

	let lastTime = currentTime;
	const updateTimestamp = async (time: number) => {
		if (watchedTimestamp && Math.floor(time) != lastTime) {
			lastTime = Math.floor(time);
			await pb.collection("watched_timestamps").update(watchedTimestamp?.id, {
				timestamp: lastTime,
				duration: video?.duration ?? 0,
			});
		}
	};

	const timeupdate = async (e: Event) => {
		const target = e.currentTarget as HTMLVideoElement;
		if (isEnded && target.currentTime !== target.duration) {
			isEnded = false;
			return;
		}
		curVideoPercent.set(
			((target?.currentTime ?? 0) / (target?.duration ?? 1)) * 100,
		);
		if (pb) {
			updateTimestamp(target?.currentTime);
		}
	};
	const ended = (e: Event) => {};

	const tempShowControls = () => {
		clearTimeout(hoverTimeout);
		isHovered = true;
		hoverTimeout = setTimeout(() => {
			isHovered = false;
		}, 2000);
	};

	let hoverTimeout: NodeJS.Timeout;
	const mousemove = (e: MouseEvent) => {
		tempShowControls();
	};

	let dblClickTimeout: NodeJS.Timeout;
	const togglePause = () => {
		clearTimeout(dblClickTimeout);
		dblClickTimeout = setTimeout(() => {
			if (video?.paused) {
				video?.play?.();
			} else {
				video?.pause?.();
			}
		}, 300);
	};

	const dblclickFullscreen = () => {
		clearTimeout(dblClickTimeout);
		toggleFullscreen();
	};
</script>

<div
	class="video-player relative h-full w-full flex flex-col justify-center items-center overflow-hidden"
	class:cursor-none={!(paused || isHovered)}
>
	<KeyboardControls {video} {tempShowControls} />

	<video
		bind:this={video}
		bind:paused
		bind:currentTime
		class="object-contain h-screen w-full"
		on:dblclick={dblclickFullscreen}
		on:mousemove={mousemove}
		on:timeupdate={timeupdate}
		on:ended={ended}
		on:click={togglePause}
		on:loadedmetadata={() => document?.hasFocus() && video?.play?.()}
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
	<VideoPlayPausePopup {paused} />

	<VideoTop bind:isHovered {episode} {video} />

	<VideoControls
		bind:currentTime
		bind:autoplayNext
		bind:isHovered
		{video}
		{duration}
		{episode}
		{nextEpisode}
	/>

	<VideoEndScreen {duration} {nextEpisode} {video} {autoplayNext} />
</div>

<style lang="postcss">
	:global(html.fullscreen .video-player) {
		@apply h-screen;
	}
	:global(html:not(.fullscreen) .video-player .fullscreen-title-box) {
		@apply hidden;
	}
</style>
