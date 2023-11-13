<script lang="ts">
	import { io } from "socket.io-client";
	import VideoThumbnail from "../VideoThumbnail.svelte";
	import { fade } from "svelte/transition";
	import NextVideoButton from "./NextVideoButton.svelte";
	import PlayPauseButton from "./PlayPauseButton.svelte";

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
		| undefined
		| undefined;

	let container: HTMLDivElement;
	let video: HTMLVideoElement;
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
	let isFullscreen = false;
	let isHovered = false;

	const formatTime = (totalSeconds: number) => {
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = Math.floor(totalSeconds % 60);
		return {
			hours,
			minutes,
			seconds,
		};
	};
	const pad = (num: number) => {
		return num.toString().padStart(2, "0");
	};

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
		socket.emit("timeupdate", {
			filepath,
			time: target.currentTime,
			duration: video?.duration ?? 0,
		});
	};
	const ended = (e: Event) => {};

	let hoverTimeout: NodeJS.Timeout;
	const mousemove = (e: MouseEvent) => {
		clearTimeout(hoverTimeout);
		isHovered = true;
		hoverTimeout = setTimeout(() => {
			isHovered = false;
		}, 2000);
	};

	let dblClickTimeout: NodeJS.Timeout;
	const togglePause = () => {
		clearTimeout(dblClickTimeout);
		dblClickTimeout = setTimeout(() => {
			if (paused) {
				video?.play?.();
			} else {
				video?.pause?.();
			}
		}, 600);
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
	class="relative h-full w-full flex flex-col justify-center items-center"
>
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
	>
		<source
			src={`/video/${filepath}${startTime ? `#t=${startTime}` : ""}`}
			type="video/mp4"
		/>
		<track kind="captions" />
		Your browser does not support the video tag.
	</video>

	<div
		aria-label="Video controls"
		id="controls"
		class="grid grid-cols-1 grid-rows-[1rem_3rem] absolute bottom-0 left-0 w-full z-20 h-16 bg-gradient-to-t from-black via-black/25 to-black/0 hover:opacity-100 opacity-0 transition-opacity duration-300"
		class:opacity-100={paused || isHovered}
	>
		<div class="relative w-full">
			<input
				min="0"
				max={duration ?? 0}
				on:change={(e) => {
					video.currentTime = Number(e.currentTarget?.value);
				}}
				value={duration ? currentTime : 0}
				type="range"
			/>
		</div>
		<div class="flex flex-col w-full flex-grow h-[calc(100%+0.25rem)] -mt-1">
			<div class="flex justify-betweens h-full w-full px-3">
				<div class="h-full w-full flex gap-2">
					<PlayPauseButton {paused} {video} />
					<NextVideoButton
						duration={nextVid?.duration}
						videoPath={nextVid?.videoPath}
						timestamp={nextVid?.timestamp}
						videoTitle={nextVid?.videoTitle ?? "No title found"}
					/>

					<p class="flex justify-center items-center h-full">
						{durationTime?.hours > 0 ? `${curTime?.hours}:` : ""}
						{durationTime?.hours > 0
							? pad(curTime?.minutes)
							: curTime?.minutes}:
						{pad(curTime?.seconds)}
						/
						{durationTime?.hours > 0 ? `${durationTime?.hours}:` : ""}
						{durationTime?.hours > 0
							? pad(durationTime?.minutes ?? 0)
							: durationTime?.minutes}:
						{pad(durationTime?.seconds ?? 0)}
					</p>
				</div>
				<div class="w-full flex justify-end gap-2">
					{#if isFullscreen}
						<button
							id="fullscreen"
							type="button"
							on:click={() => {
								const curFullscreen = document.fullscreenElement;
								if (curFullscreen) document.exitFullscreen();
								else container.requestFullscreen();
								isFullscreen = !isFullscreen;
							}}
							><svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								><g fill="none" fill-rule="evenodd"
									><path
										d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"
									/><path
										fill="currentColor"
										d="M20 7h-3V4a1 1 0 1 0-2 0v3a2 2 0 0 0 2 2h3a1 1 0 1 0 0-2ZM7 9a2 2 0 0 0 2-2V4a1 1 0 1 0-2 0v3H4a1 1 0 1 0 0 2h3Zm0 8H4a1 1 0 1 1 0-2h3a2 2 0 0 1 2 2v3a1 1 0 1 1-2 0v-3Zm10-2a2 2 0 0 0-2 2v3a1 1 0 1 0 2 0v-3h3a1 1 0 1 0 0-2h-3Z"
									/></g
								></svg
							>
						</button>
					{:else}
						<button
							id="fullscreen"
							type="button"
							on:click={() => {
								const curFullscreen = document.fullscreenElement;
								if (curFullscreen) document.exitFullscreen();
								else container.requestFullscreen();
								isFullscreen = !isFullscreen;
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								><g fill="none"
									><path
										d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"
									/><path
										fill="currentColor"
										d="M4 15a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2H5a2 2 0 0 1-2-2v-3a1 1 0 0 1 1-1Zm16 0a1 1 0 0 1 .993.883L21 16v3a2 2 0 0 1-1.85 1.995L19 21h-3a1 1 0 0 1-.117-1.993L16 19h3v-3a1 1 0 0 1 1-1ZM19 3a2 2 0 0 1 1.995 1.85L21 5v3a1 1 0 0 1-1.993.117L19 8V5h-3a1 1 0 0 1-.117-1.993L16 3h3ZM8 3a1 1 0 0 1 .117 1.993L8 5H5v3a1 1 0 0 1-1.993.117L3 8V5a2 2 0 0 1 1.85-1.995L5 3h3Z"
									/></g
								></svg
							>
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
	{#if video?.currentTime && video?.currentTime === duration}
		<div
			in:fade={{ duration: 500 }}
			out:fade={{ duration: 150 }}
			class="absolute z-10 top-0 left-0 w-full h-full flex justify-center items-center bg-black/75"
		>
			{#if nextVid}
				<div
					class="flex flex-col h-full items-center justify-center w-full"
					style="background: radial-gradient(circle at 0% 100%,#a855f720, #a855f700), radial-gradient(circle at 100% 0%,#f9731630, #f9731600);"
				>
					<div class="grid grid-cols-2">
						<button
							type="button"
							class="!aspect-auto flex-col !justify-end relative"
						>
							<svg
								class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
								xmlns="http://www.w3.org/2000/svg"
								width="48"
								height="48"
								viewBox="0 0 24 24"
								><g fill="none" fill-rule="evenodd"
									><path
										d="M24 0v24H0V0h24ZM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018Zm.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01l-.184-.092Z"
									/><path
										fill="currentColor"
										d="M14.07 19.727a8.003 8.003 0 0 1-9.146-3.99a1 1 0 0 0-1.77.933c2.13 4.04 6.836 6.221 11.434 4.99c5.335-1.43 8.5-6.914 7.071-12.248c-1.43-5.335-6.913-8.5-12.247-7.071a10.003 10.003 0 0 0-7.414 9.58c-.007.903.995 1.402 1.713.919l2.673-1.801c1.008-.68.332-2.251-.854-1.986l-1.058.236a8 8 0 1 1 9.598 10.439Z"
									/></g
								></svg
							>
							<p>Replay</p>
						</button>
						<VideoThumbnail
							duration={nextVid.duration}
							videoPath={nextVid.videoPath}
							timestamp={nextVid.timestamp}
							videoTitle={nextVid.videoTitle}
						/>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style lang="postcss">
	button {
		@apply h-full aspect-square flex items-center justify-center bg-white/0 transition-colors;
	}
	button:hover {
		@apply bg-white/25;
	}
	input {
		/* --c: rgb(168 85 247 / var(--tw-text-opacity)); active color */
		--c: rgb(168 85 247); /* active color */
		--g: 0.25rem; /* the gap */
		--l: 0.25rem; /* line thickness*/
		--s: 1rem; /* thumb size*/

		width: 100%;
		height: var(--s); /* needed for Firefox*/
		--_c: color-mix(in srgb, var(--c), #000 var(--p, 0%));
		@apply w-full appearance-none bg-none bg-transparent cursor-pointer overflow-hidden transition-all origin-center;
	}
	input:focus-visible,
	input:hover {
		--p: 25%;
	}
	input:active,
	input:focus-visible {
		--_b: var(--s);
	}
	/* chromium */
	input[type="range" i]::-webkit-slider-thumb {
		height: var(--s);
		aspect-ratio: 1;
		border-radius: 50%;
		box-shadow: 0 0 0 var(--_b, var(--l)) inset var(--_c);
		border-image: linear-gradient(90deg, var(--c) 50%, #ababab 0) 1/0 100vw/0
			calc(100vw + var(--g));
		clip-path: polygon(
			0 calc(50% + var(--l) / 2),
			-100vw calc(50% + var(--l) / 2),
			-100vw calc(50% - var(--l) / 2),
			0 calc(50% - var(--l) / 2),
			0 0,
			100% 0,
			100% calc(50% - var(--l) / 2),
			100vw calc(50% - var(--l) / 2),
			100vw calc(50% + var(--l) / 2),
			100% calc(50% + var(--l) / 2),
			100% 100%,
			0 100%
		);
		-webkit-appearance: none;
		appearance: none;
		transition: 0.3s;
	}
	/* Firefox */
	input[type="range"]::-moz-range-thumb {
		height: var(--s);
		width: var(--s);
		background: none;
		border-radius: 50%;
		box-shadow: 0 0 0 var(--_b, var(--l)) inset var(--_c);
		border-image: linear-gradient(90deg, var(--_c) 50%, #ababab 0) 1/0 100vw/0
			calc(100vw + var(--g));
		clip-path: polygon(
			0 calc(50% + var(--l) / 2),
			-100vw calc(50% + var(--l) / 2),
			-100vw calc(50% - var(--l) / 2),
			0 calc(50% - var(--l) / 2),
			0 0,
			100% 0,
			100% calc(50% - var(--l) / 2),
			100vw calc(50% - var(--l) / 2),
			100vw calc(50% + var(--l) / 2),
			100% calc(50% + var(--l) / 2),
			100% 100%,
			0 100%
		);
		-moz-appearance: none;
		appearance: none;
		transition: 0.3s;
	}
	@supports not (color: color-mix(in srgb, red, red)) {
		input {
			--_c: var(--c);
		}
	}
</style>
