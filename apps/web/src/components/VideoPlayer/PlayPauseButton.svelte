<script lang="ts">
	import PlayPauseIcon from "./PlayPauseIcon.svelte";

	export let video: HTMLVideoElement;
	export let className: string = "";
	export let width: number = 24;
	export let height: number = 24;
</script>

<button
	data-tip="Play/Pause"
	type="button"
	class="play {className}"
	class:paused={video?.paused}
	on:click={() => (video?.paused ? video.play() : video.pause())}
>
	<PlayPauseIcon {width} {height} />
</button>
