<script lang="ts">
	import { type RecordModel } from "pocketbase";
	import ThumbnailImage from "$components/ThumbnailImage.svelte";

	export let episode: RecordModel | null;

	let isHovering = false;
	let watched_timestamp = episode?.expand?.["watched_timestamps(episode)"]?.[0];
	let fullyWatched =
		(watched_timestamp?.timestamp ?? 0) / (watched_timestamp?.duration ?? 1) >=
		0.98;
	let percentPlayed = watched_timestamp?.duration
		? ((watched_timestamp?.timestamp ?? 0) /
				(watched_timestamp?.duration ?? 1)) *
		  100
		: 0;
</script>

<a
	on:mouseenter={() => (isHovering = true)}
	on:mouseleave={() => (isHovering = false)}
	href={`/episode/${episode?.id}`}
	class:opacity-50={fullyWatched}
	class:opacity-90={!fullyWatched}
	class="hover:opacity-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col w-full group"
>
	<div
		class="aspect-video overflow-hidden group-hover:rounded-lg rounded-3xl transition-all duration-300 relative"
	>
		{#if fullyWatched}
			<div
				class="absolute inset-0 flex items-center justify-center w-full h-full bg-neutral-800/50 backdrop-blur-[2px] group-hover:bg-black/0 group-hover:backdrop-blur-none transition-all duration-300 ring-8 group-hover:ring-0 ring-neutral-500/50 ring-inset group-hover:rounded-lg rounded-3xl"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="lg:w-16 lg:h-16 w-12 h-12 transition-all group-hover:opacity-0 duration-300"
					viewBox="0 0 24 24"
				>
					<g fill="none" fill-rule="evenodd">
						<path
							d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"
						/>
						<path
							fill="currentColor"
							d="M2.614 5.426A1.5 1.5 0 0 1 4 4.5h10a7.5 7.5 0 1 1 0 15H5a1.5 1.5 0 0 1 0-3h9a4.5 4.5 0 1 0 0-9H7.621l.94.94a1.5 1.5 0 0 1-2.122 2.12l-3.5-3.5a1.5 1.5 0 0 1-.325-1.634Z"
						/>
					</g>
				</svg>
			</div>
		{:else}
			<div
				class="absolute inset-0 flex items-center justify-center w-full h-full transition-all duration-300 ring-8 group-hover:ring-0 ring-black/50 group-hover:ring-black/25 ring-inset group-hover:rounded-lg rounded-3xl"
			></div>
		{/if}
		<ThumbnailImage
			id={episode?.id ?? ""}
			name={episode?.name}
			type="episode"
			parentListeners
			bind:isHovering
		/>
		<div
			class:opacity-0={fullyWatched}
			class="absolute inset-0 h-full w-full overflow-hidden transition-all duration-500 group-hover:delay-75 group-hover:scale-110 flex items-end justify-start"
		>
			{#if (percentPlayed ?? 0) > 0}
				<div
					class="w-full h-2 transition-all bg-rose-500 group-hover:bg-rose-500/25 group-hover:rounded-lg rounded-3xl"
					style="-webkit-clip-path: inset(0 {100 -
						percentPlayed}% 0 0 round 0%);
				clip-path: inset(0 {100 - percentPlayed}% 0 0 round 0%);"
				></div>
			{/if}
		</div>
	</div>
	<div class="flex flex-col">
		<div class="flex-grow px-3 py-2">
			<h3 class="font-semibold">{episode?.name}</h3>
		</div>
	</div>
</a>
