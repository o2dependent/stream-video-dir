<script lang="ts">
	import EndScreenUI from "./EndScreenUI.svelte";
	import type { RecordModel } from "pocketbase";
	import EndScreenLogic from "./EndScreenLogic.svelte";

	export let autoplayNext: boolean;
	export let video: HTMLVideoElement;
	export let duration: number | undefined;
	export let nextEpisode: RecordModel | undefined;
</script>

<EndScreenLogic
	{autoplayNext}
	{video}
	{duration}
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
