<script lang="ts">
	import {
		SCRUB_SCREENSHOT_HEIGHT,
		SCRUB_SCREENSHOT_WIDTH,
		SCRUB_TIMESTAMP_PER_CHUNK,
	} from "$lib/constants";

	export let index: number;
	export let currentTime: number;
	export let id: string;
	export let CHUNK_SIZE: number;
	export let type: "episode" | "movie" = "episode";

	let img: HTMLImageElement;
	$: CHUNK_START = index * CHUNK_SIZE;
	$: currentIndex = Math.floor(currentTime / CHUNK_SIZE);
	$: offsetIndex =
		currentIndex === index
			? Math.floor(
					(Math.floor(((currentTime - CHUNK_START) / CHUNK_SIZE) * 100) / 100) *
						SCRUB_TIMESTAMP_PER_CHUNK,
			  )
			: null;
</script>

<img
	bind:this={img}
	width={SCRUB_SCREENSHOT_WIDTH}
	height={SCRUB_SCREENSHOT_HEIGHT}
	class="object-none h-full aspect-video select-none"
	class:hidden={currentIndex !== index}
	data-offsetIndex={offsetIndex}
	style="object-position: calc(calc({offsetIndex} / {SCRUB_TIMESTAMP_PER_CHUNK -
		1}) * 100%);"
	loading="lazy"
	src="/video/scrub/{type}/{id}-{index}.png"
	alt="Scrub chunk {index}"
/>
