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

	let container: HTMLDivElement;
	let video: HTMLVideoElement;
	let controlsContainer: HTMLDivElement;
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
	let isFullscreen = false;
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

	const toggleFullscreen = () => {
		clearTimeout(dblClickTimeout);
		const curFullscreen = document.fullscreenElement;
		if (curFullscreen) document.exitFullscreen();
		else container.requestFullscreen();
		isFullscreen = !isFullscreen;
	};
</script>

<div
	bind:this={container}
	class="video-player relative h-full w-full flex flex-col justify-center items-center overflow-hidden"
	class:cursor-none={!(paused || isHovered)}
>
	<!-- <div class="absolute top-0 left-0 w-full">
		<h2 class="text-xl">{filepath?.split("/")?.at(-1)}</h2>
	</div> -->
	<KeyboardControls {video} {tempShowControls} />
	<video
		bind:this={video}
		bind:paused
		bind:currentTime
		class:max-h-[90vh]={!isFullscreen}
		class:h-full={isFullscreen}
		class="object-contain h-full w-full"
		on:dblclick={toggleFullscreen}
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
		aria-label="Video controls"
		id="controls"
		class="peer grid grid-cols-1 grid-rows-[1rem_3rem] px-3 absolute bottom-0 left-0 w-full z-20 h-16 bg-gradient-to-t from-black via-black/25 to-black/0 hover:opacity-100 hover:translate-y-0 opacity-0 transition-all duration-300 cursor-default"
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
				<div class="h-full w-full flex gap-2">
					<PlayPauseButton {video} />
					<NextVideoButton
						containEl={controlsContainer}
						duration={nextVid?.duration}
						videoPath={nextVid?.videoPath}
						timestamp={nextVid?.timestamp}
						videoTitle={nextVid?.videoTitle ?? "No title found"}
					/>
					<VolumeController {video} />

					<p class="flex justify-center items-center h-full">
						{durationTime?.hours > 0 ? `${curTime?.hours}:` : ""}
						{durationTime?.hours > 0
							? padNum(curTime?.minutes)
							: curTime?.minutes}:
						{padNum(curTime?.seconds)}
						/
						{durationTime?.hours > 0 ? `${durationTime?.hours}:` : ""}
						{durationTime?.hours > 0
							? padNum(durationTime?.minutes ?? 0)
							: durationTime?.minutes}:
						{padNum(durationTime?.seconds ?? 0)}
					</p>
				</div>
				<div class="w-full flex justify-end gap-2">
					<label
						class="flex h-full items-center justify-center relative w-6 cursor-pointer"
						class:paused={autoplayNext}
					>
						<input
							type="checkbox"
							class="absolute top-0 left-0 appearance-none h-full w-full peer cursor-pointer"
							bind:checked={autoplayNext}
						/>
						<div
							class="h-3 w-full absolute top-1/2 left-0 -translate-y-1/2 rounded-full bg-slate-700 peer-checked:bg-slate-600 transition-all"
						/>
						<div
							class="absolute top-1/2 -translate-x-1/2 peer-checked:left-full left-0 w-4 h-4 rounded-full peer-checked:text-black text-black bg-white transition-all duration-150 ease-in-out transform -translate-y-1/2 flex items-center justify-center"
						>
							<PlayPauseIcon className="w-3 h-3" height={16} width={16} />
						</div>
					</label>
					<FullscreenButton {container} bind:isFullscreen />
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
