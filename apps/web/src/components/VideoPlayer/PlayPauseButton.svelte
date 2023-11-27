<script lang="ts">
	import Tooltip from "$components/Tooltip.svelte";
	import PlayPauseIcon from "./PlayPauseIcon.svelte";

	export let video: HTMLVideoElement;
	export let containEl: HTMLElement;
	export let className: string = "";
	export let width: number = 24;
	export let height: number = 24;
</script>

<Tooltip
	tip={video?.paused ? "Play" : "Pause"}
	className="aspect-square h-full"
	pos="top center"
	{containEl}
>
	<button
		data-tip="Play/Pause"
		type="button"
		class="play w-full h-full flex items-center justify-center group {className}"
		class:paused={video?.paused}
		on:click={() => (video?.paused ? video.play() : video.pause())}
	>
		<PlayPauseIcon
			className="group-hover:drop-shadow-sm group-hover:-translate-y-0.5 transition-all drop-shadow-none"
			paused={video?.paused}
			{width}
			{height}
		/>
	</button>
</Tooltip>
