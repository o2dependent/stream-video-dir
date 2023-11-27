<script lang="ts">
	import { fly } from "svelte/transition";
	import { formatTime } from "./../../lib/formatTime";
	import { padNum } from "./../../lib/padTime";
	import { io } from "socket.io-client";
	import NextVideoButton from "./NextVideoButton.svelte";
	import PlayPauseButton from "./PlayPauseButton.svelte";
	import VideoProgress from "./VideoProgress.svelte";
	import VideoPlayPausePopup from "./VideoPlayPausePopup.svelte";
	import FullscreenButton from "./FullscreenButton.svelte";
	import VideoEndScreen from "./VideoEndScreen.svelte";
	import PlayPauseIcon from "./PlayPauseIcon.svelte";
	import KeyboardControls from "./KeyboardControls.svelte";
	import VolumeController from "./VolumeController.svelte";
	import { curVideoPercent } from "$stores/watch/curVideoPercent";
	import { onMount } from "svelte";
	import { isFullscreen, toggleFullscreen } from "$stores/isFullscreen";
	import Tooltip from "$components/Tooltip.svelte";
	import AutoplayToggle from "./AutoplayToggle.svelte";

	export let filepath: string;
	export let duration: number | undefined;
	export let startTime: number | undefined;
	export let hostname: string;
	export let nextVid:
		| {
				videoPath: string;
				videoTitle: string;
				duration: number | undefined;
				timestamp: number | undefined;
		  }
		| undefined;

	let container: HTMLElement;
	onMount(() => {
		const videoContainer = document.querySelector("#video-container");
		if (videoContainer) {
			container = videoContainer as HTMLElement;
		}
	});
	let video: HTMLVideoElement;
	let controlsContainer: HTMLDivElement;
	let videoTopContainer: HTMLDivElement;
	let isEnded = false;
	let paused = true;
	let currentTime: number = startTime ?? 0;
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

	$: curTime = formatTime(currentTime);
	$: durationTime = formatTime(duration ?? 0);

	$: socket = io(`${hostname}:5432`, {
		withCredentials: true,
	});
	const timeupdate = (e: Event) => {
		const target = e.currentTarget as HTMLVideoElement;
		if (isEnded && target.currentTime !== target.duration) {
			isEnded = false;
			return;
		}
		curVideoPercent.set(
			((target?.currentTime ?? 0) / (target?.duration ?? 1)) * 100,
		);
		socket.emit("timeupdate", {
			filepath,
			time: target.currentTime,
			duration: video?.duration ?? 0,
			log: false,
		});
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
		autoplay
	>
		<source
			src={`/video/${filepath}${startTime ? `#t=${startTime}` : ""}`}
			type="video/mp4"
		/>
		<track kind="captions" />
		Your browser does not support the video tag.
	</video>
	<VideoPlayPausePopup {paused} />
	<div
		bind:this={videoTopContainer}
		class="peer flex justify-between px-3 absolute top-0 left-0 w-full z-20 h-16 bg-gradient-to-b from-black/50 via-black/25 to-black/0 hover:opacity-100 hover:translate-y-0 opacity-0 transition-all duration-300 cursor-default"
		class:opacity-100={video?.paused || isHovered}
		class:-translate-y-full={!(video?.paused || isHovered)}
	>
		<div class="h-full flex gap-2">
			<Tooltip containEl={videoTopContainer} tip="Back" pos="right center">
				<a
					href={`/directory/${
						filepath.split("/").length === 1
							? ""
							: filepath.split("/").slice(0, -1).join("/")
					}`}
					class="h-full aspect-square flex items-center justify-center group"
					type="button"
				>
					<svg
						class="w-8 h-8 sm:w-12 sm:h-12l text-white transition-transform group-hover:translate-y-0 translate-y-1 duration-300"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						><g fill="none"
							><path
								d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"
							/><path
								fill="currentColor"
								d="M3.283 10.94a1.5 1.5 0 0 0 0 2.12l5.656 5.658a1.5 1.5 0 1 0 2.122-2.122L7.965 13.5H19.5a1.5 1.5 0 0 0 0-3H7.965l3.096-3.096a1.5 1.5 0 1 0-2.122-2.121L3.283 10.94Z"
							/></g
						></svg
					>
				</a>
			</Tooltip>
		</div>
	</div>
	<div
		aria-label="Video controls"
		id="controls"
		class="peer grid grid-cols-1 grid-rows-[1rem_3rem] px-3 absolute bottom-0 left-0 w-full z-20 h-16 bg-gradient-to-t from-black via-black/25 to-black/0 hover:opacity-100 hover:translate-y-0 peer-hover:opacity-100 peer-hover:translate-y-0 opacity-0 transition-all duration-300 cursor-default"
		class:opacity-100={video?.paused || isHovered}
		class:translate-y-full={!(video?.paused || isHovered)}
	>
		<VideoProgress
			{filepath}
			{durationTime}
			{duration}
			bind:currentTime
			bind:video
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
							: curTime?.minutes}:{padNum(
							curTime?.seconds,
						)}/{durationTime?.hours > 0 ? `${durationTime?.hours}:` : ""}
						{durationTime?.hours > 0
							? padNum(durationTime?.minutes ?? 0)
							: durationTime?.minutes}:{padNum(durationTime?.seconds ?? 0)}
					</p>
					<p
						class="hidden sm:block text-base font-bold w-full text-ellipsis whitespace-nowrap overflow-hidden"
					>
						{filepath?.split("/")?.at(-1)}
					</p>
				</div>
				<div class="flex justify-end gap-2">
					<NextVideoButton
						containEl={controlsContainer}
						duration={nextVid?.duration}
						videoPath={nextVid?.videoPath}
						timestamp={nextVid?.timestamp}
						videoTitle={nextVid?.videoTitle ?? "No title found"}
					/>
					<AutoplayToggle bind:autoplayNext containEl={controlsContainer} />
					<FullscreenButton containEl={controlsContainer} />
				</div>
			</div>
		</div>
	</div>
	{#if nextVid && (currentTime / video?.duration) * 100 >= 99.5}
		<div
			in:fly={{ y: 16, duration: 300 }}
			out:fly={{ y: -16, duration: 300 }}
			class:-translate-y-16={video?.paused || isHovered}
			class:translate-y-0={!(video?.paused || isHovered)}
			class="absolute peer-hover:-translate-y-16 h-8 right-4 bottom-4 transition-all duration-300"
		>
			<a
				href={`/directory/${nextVid.videoPath}/watch`}
				class="rounded-md px-2 py-1 lg:text-lg bg-black/20 backdrop-blur-md text-white/80 border border-white/10 hover:border-white/25 hover:text-white transition-colors duration-300"
				type="button">Play Next</a
			>
		</div>
	{/if}

	<VideoEndScreen {duration} {nextVid} {video} {autoplayNext} />
</div>

<style lang="postcss">
	:global(html.fullscreen .video-player) {
		@apply h-screen;
	}
	:global(html:not(.fullscreen) .video-player .fullscreen-title-box) {
		@apply hidden;
	}
</style>
