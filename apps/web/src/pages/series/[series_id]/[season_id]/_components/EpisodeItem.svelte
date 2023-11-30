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
			class="bg-neutral-700/0 hover:bg-neutral-700/5 opacity-90 hover:opacity-100 shadow-sm hover:shadow-md transition-all duration-75 flex"
		>
			<div class="h-28 aspect-video">
				<ThumbnailImage
					id={episode?.id}
					name={episode?.name}
					type="episode"
					parentListeners
					bind:isHovering
				/>
			</div>
			<div class="flex flex-col h-full w-full">
				<div class="flex-grow px-2 py-1">
					<h3 class="text-lg font-semibold">{episode?.name}</h3>
				</div>
				<div class="w-full h-1 overflow-hidden rounded-full bg-neutral-700">
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
		</a>
	{:else}
		<DownloadEpisodeItem {episode} />
	{/if}
{/if}
