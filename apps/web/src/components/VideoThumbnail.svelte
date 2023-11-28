<script lang="ts">
	import { curVideoPercent } from "$stores/watch/curVideoPercent";
	import type { RecordModel } from "pocketbase";
	import ThumbnailImage from "./ThumbnailImage.svelte";

	export let episode: RecordModel | undefined;
	export let duration: number | undefined = undefined;
	export let timestamp: number | undefined = undefined;
	export let isCurrentVideo: boolean = false;
	export let startTime: number | undefined = undefined;

	$: itemPercent = isCurrentVideo
		? $curVideoPercent
		: ((timestamp ?? 0) / (duration ?? 1)) * 100;
</script>

{#if episode && episode?.id}
	<a
		data-duration={duration}
		id={`directory-list-item${
			typeof episode?.episode_index === "number"
				? "-" + episode?.episode_index
				: ""
		}`}
		href={`/episode/${episode?.id}${startTime ? `?t=${startTime}` : ""}`}
		class={`!w-full flex flex-col ring-1  ${
			isCurrentVideo
				? "ring-orange-700/50 hover:ring-orange-700"
				: "ring-slate-700/0 hover:ring-purple-700"
		} transition-shadow duration-150 ease-in-out`}
	>
		<div class="relative rounded-lg overflow-hidden">
			<ThumbnailImage id={episode?.id} name={episode?.name} />
			<div
				class:border-green-500={itemPercent >= 99.9}
				class={`directory-list-item-progress-container absolute bottom-0 left-0 w-full overflow-hidden h-1`}
			>
				<div
					class={`directory-list-item-progress h-full ${
						itemPercent >= 99.9
							? "bg-green-500"
							: isCurrentVideo
							? "bg-orange-500"
							: "bg-purple-500"
					}`}
					style={`width: ${itemPercent}%`}
				/>
			</div>
		</div>

		<p class="px-4 py-2">{episode?.name}</p>
	</a>
{/if}
