<script lang="ts">
	import CircleProgressBar from "$components/CircleProgressBar.svelte";
	import { type RecordModel } from "pocketbase";

	export let episode: RecordModel;

	$: isDownloading = !episode?.downloaded && episode?.download_progress > 0;

	const startDownload = () => {
		fetch(`/video/download/episode/${episode?.id}`, {
			method: "POST",
		});
		isDownloading = true;
	};
</script>

<button
	type="button"
	on:click={startDownload}
	aria-label={`Download ${episode?.name}`}
	disabled={episode?.download_progress > 0}
	class:opacity-50={!isDownloading}
	class:text-opacity-50={isDownloading}
	class="p-4 bg-neutral-700/0 hover:bg-neutral-700/5 hover:opacity-100 shadow-sm hover:shadow-md text-white transition-all duration-75 md:flex"
>
	<h3 class="text-lg text-left font-semibold w-full">{episode?.name}</h3>
	{#if isDownloading}
		<CircleProgressBar progress={episode?.download_progress} />
	{/if}
	<svg
		class:visible={!isDownloading}
		class:hidden={isDownloading}
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
	>
		<g fill="none">
			<path
				d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092"
			/>
			<path
				fill="currentColor"
				d="M20 14.5a1.5 1.5 0 0 1 1.5 1.5v4a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 20v-4a1.5 1.5 0 0 1 3 0v3.5h13V16a1.5 1.5 0 0 1 1.5-1.5m-8-13A1.5 1.5 0 0 1 13.5 3v9.036l1.682-1.682a1.5 1.5 0 0 1 2.121 2.12l-4.066 4.067a1.75 1.75 0 0 1-2.474 0l-4.066-4.066a1.5 1.5 0 0 1 2.121-2.121l1.682 1.682V3A1.5 1.5 0 0 1 12 1.5"
			/>
		</g>
	</svg>
</button>
