<script lang="ts">
	import { onMount } from "svelte";
	import PocketBase, { type RecordModel } from "pocketbase";
	import EpisodeItem from "./EpisodeItem.svelte";

	export let episodes: RecordModel[] | null;
	onMount(() => {
		const pb = new PocketBase("http://127.0.0.1:8090");

		pb.collection("episodes").subscribe("*", ({ record }) => {
			const episodeId = record?.id;
			const episodeIndex = episodes?.findIndex((e) => e.id === episodeId);

			if (!episodes || typeof episodeIndex !== "number" || episodeIndex === -1)
				return;

			const newEpisodes = [...episodes];
			newEpisodes[episodeIndex] = { ...record };
			episodes = [...newEpisodes];
		});

		return () => {
			pb.collection("episodes").unsubscribe("*");
		};
	});
</script>

<div class="flex flex-col h-full overflow-y-auto w-full bg-black/50">
	{#each episodes ?? [] as episode}
		<EpisodeItem {episode} />
	{:else}
		<div
			class="p-4 bg-neutral-700/0 hover:bg-neutral-700/5 opacity-90 hover:opacity-100 shadow-sm hover:shadow-md transition-all duration-75"
		>
			<h3 class="text-lg font-semibold">Nothing here!</h3>
		</div>
	{/each}
</div>
