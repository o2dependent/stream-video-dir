<script lang="ts">
	import Tooltip from "$components/Tooltip.svelte";
	import { paused, video } from "$components/VideoPlayer/video";
	import PlayPauseIcon from "../../PlayPauseIcon.svelte";

	export let containEl: HTMLElement;
	export let className: string = "";
	export let width: number = 24;
	export let height: number = 24;
</script>

<Tooltip
	{containEl}
	className="aspect-square h-full"
	tip={$paused ? "Play" : "Pause"}
	pos="top center"
	shortcut="k"
>
	<button
		data-tip="Play/Pause"
		type="button"
		class="play w-full h-full flex items-center justify-center group {className}"
		class:paused={$paused}
		on:click={() => ($paused ? $video.play() : $video.pause())}
	>
		<PlayPauseIcon
			className="group-hover:drop-shadow-sm group-hover:-translate-y-0.5 transition-all drop-shadow-none"
			paused={$paused}
			{width}
			{height}
		/>
	</button>
</Tooltip>
