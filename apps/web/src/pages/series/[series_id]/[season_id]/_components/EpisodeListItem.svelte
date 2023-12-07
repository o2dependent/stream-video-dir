<script lang="ts">
	import { type RecordModel } from "pocketbase";
	import DownloadEpisodeItem from "./DownloadEpisodeItem.svelte";
	import EpisodeItem from "$components/EpisodeItem.svelte";

	export let episode: RecordModel | null;
</script>

{#if episode?.id}
	{#if episode?.downloaded}
		<EpisodeItem {episode} />
	{:else}
		<DownloadEpisodeItem {episode} />
	{/if}
{/if}
