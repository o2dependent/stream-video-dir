<script lang="ts">
	import { type RecordModel } from "pocketbase";
	import DownloadButton from "./DownloadButton.svelte";

	export let episode: RecordModel | null;
</script>

{#if episode?.id}
	{#if episode?.downloaded}
		<a
			href={`/episode/${episode?.id}`}
			class="p-4 bg-neutral-700/0 hover:bg-neutral-700/5 opacity-90 hover:opacity-100 shadow-sm hover:shadow-md transition-all duration-75"
		>
			<h3 class="text-lg font-semibold">{episode?.name}</h3>
		</a>
	{:else}
		<DownloadButton {episode} />
	{/if}
{/if}
