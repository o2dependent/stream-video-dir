<script lang="ts">
	import Tooltip from "$components/Tooltip.svelte";
	import PlayPauseIcon from "./PlayPauseIcon.svelte";

	export let video: HTMLVideoElement;
	export let className: string = "";
	export let width: number = 24;
	export let height: number = 24;
</script>

<Tooltip
	tip={video?.paused ? "Play" : "Pause"}
	className="aspect-square h-full"
	pos="top left"
>
	<button
		data-tip="Play/Pause"
		type="button"
		class="play w-full h-full flex items-center justify-center {className}"
		class:paused={video?.paused}
		on:click={() => (video?.paused ? video.play() : video.pause())}
	>
		<PlayPauseIcon paused={video?.paused} {width} {height} />
	</button>
</Tooltip>
