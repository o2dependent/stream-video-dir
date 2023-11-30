<script lang="ts">
	import EndScreenUI from "./EndScreenUI.svelte";
	import type { RecordModel } from "pocketbase";
	import EndScreenLogic from "./EndScreenLogic.svelte";

	export let autoplayNext: boolean;
	export let nextEpisode: RecordModel | undefined;
</script>

<EndScreenLogic
	{autoplayNext}
	{nextEpisode}
	let:videoEnded
	let:autoplayCancelled
	let:autoplayCountdown
>
	<EndScreenUI
		{autoplayNext}
		{nextEpisode}
		{videoEnded}
		{autoplayCancelled}
		{autoplayCountdown}
	/>
</EndScreenLogic>
