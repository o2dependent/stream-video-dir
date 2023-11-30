<script lang="ts">
	import Tooltip from "$components/Tooltip.svelte";
	import type { RecordModel } from "pocketbase";
	import VideoBackButton from "./VideoBackButton.svelte";

	export let video: HTMLVideoElement;
	export let isHovered: boolean;
	export let episode: RecordModel;

	let videoTopContainer: HTMLDivElement;
</script>

<div
	bind:this={videoTopContainer}
	class="peer flex justify-between px-3 absolute top-0 left-0 w-full z-40 h-16 bg-gradient-to-b from-black/50 via-black/25 to-black/0 hover:opacity-100 hover:translate-y-0 opacity-0 transition-all duration-300 cursor-default"
	class:opacity-100={video?.paused || isHovered}
	class:-translate-y-full={!(video?.paused || isHovered)}
>
	<div class="h-full flex gap-2">
		<VideoBackButton {videoTopContainer} {episode} />
	</div>
</div>
