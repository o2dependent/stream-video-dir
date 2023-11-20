<script lang="ts">
	import { onMount } from "svelte";
	import VideoThumbnail from "./VideoThumbnail.svelte";
	import Swiper from "swiper";
	import "swiper/css";

	export let directory: {
		id: string;
		path: string;
		timestamp?: number | undefined;
		updated?: string | undefined;
		duration?: number | undefined;
	}[];
	export let filepath: string | undefined;
	export let latestVideoIdx: number | undefined;

	let container: HTMLDivElement;

	onMount(() => {
		if (container) {
			const swiper = new Swiper("#directory-list", {
				slidesPerView: 3,
				spaceBetween: 4,
				freeMode: {
					enabled: true,
					momentumRatio: 2,
					sticky: false,
					momentum: true,
				},
				breakpoints: {
					768: {
						slidesPerView: 3,
					},
					1024: {
						slidesPerView: 5,
					},
				},
			});
			if (typeof latestVideoIdx !== "undefined")
				swiper.slideTo(Math.max(0, latestVideoIdx - 1));
		}
	});
</script>

<div bind:this={container} id="directory-list" class="swiper py-1 w-full">
	<div class="swiper-wrapper">
		{#each directory as { path, timestamp, updated, duration, id }, idx}
			{#if path.includes(".mp4")}
				<div class="swiper-slide">
					<VideoThumbnail
						videoTitle={path.replace(".mp4", "")}
						videoPath={`${
							filepath?.split("/")?.slice(0, -1)?.join("/") ?? ""
						}/${path.replace(".mp4", "")}`}
						isCurrentVideo={idx === latestVideoIdx}
						{duration}
						{timestamp}
						{idx}
					/>
				</div>
			{/if}
		{/each}
	</div>

	<!-- If we need navigation buttons -->
	<!-- <div class="swiper-button-prev"></div>
	<div class="swiper-button-next"></div> -->

	<!-- If we need scrollbar -->
	<div class="swiper-scrollbar" />
</div>
