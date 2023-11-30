<script lang="ts">
	import { duration } from "$components/VideoPlayer/video";
	import { SCRUB_MAX_CHUNK_INDEX } from "$lib/constants";
	import ScrubImage from "./ScrubImage.svelte";

	export let currentTime: number;
	export let id: string;

	$: CHUNK_SIZE = (($duration ?? 0) + 1) / SCRUB_MAX_CHUNK_INDEX;
</script>

<div
	class="w-full max-w-xs h-fit overflow-hidden aspect-video border border-black/50 rounded-md"
>
	{#each new Array(SCRUB_MAX_CHUNK_INDEX) as _, index}
		<ScrubImage {CHUNK_SIZE} {index} {id} {currentTime} />
	{/each}
</div>
