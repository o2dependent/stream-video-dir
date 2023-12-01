<script lang="ts">
	import { type RecordModel } from "pocketbase";
	import DownloadEpisodeItem from "./DownloadEpisodeItem.svelte";
	import ThumbnailImage from "$components/ThumbnailImage.svelte";

	export let episode: RecordModel | null;

	let isHovering = false;
	let watched_timestamp = episode?.expand?.["watched_timestamps(episode)"]?.[0];
</script>

{#if episode?.id}
	{#if episode?.downloaded}
		<a
			on:mouseenter={() => (isHovering = true)}
			on:mouseleave={() => (isHovering = false)}
			href={`/episode/${episode?.id}`}
			class="bg-neutral-700/0 hover:bg-neutral-700/10 opacity-90 hover:opacity-100 shadow-sm hover:shadow-md transition-all duration-75 flex flex-col w-full"
		>
			<div class="aspect-video overflow-hidden rounded-xl relative">
				<ThumbnailImage
					id={episode?.id}
					name={episode?.name}
					type="episode"
					parentListeners
					bind:isHovering
				/>
				<div
					class="absolute bottom-0 left-0 w-full h-1 overflow-hidden bg-neutral-950/75"
				>
					<div
						class="bg-green-500 h-full"
						style="width: {watched_timestamp?.duration
							? ((watched_timestamp?.timestamp ?? 0) /
									(watched_timestamp?.duration ?? 1)) *
							  100
							: 0}%"
					></div>
				</div>
			</div>
			<div class="flex flex-col">
				<div class="flex-grow px-2 py-1">
					<h3 class="font-semibold">{episode?.name}</h3>
				</div>
			</div>
		</a>
	{:else}
		<DownloadEpisodeItem {episode} />
	{/if}
{/if}
