<script lang="ts">
	export let filepath: string;
</script>

{#if filepath !== ""}
	<a
		class="flex justify-center items-center w-fit px-2 py-1 rounded-md bg-purple-700/25 backdrop-blur-md ring-1 ring-purple-700/50 hover:bg-purple-700/50 transition-colors duration-150 ease-in-out text-base"
		href={`/directory/${
			filepath.split("/").length === 1
				? ""
				: filepath.split("/").slice(0, -1).join("/")
		}`}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-4 w-4 inline-block"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M15 19l-7-7 7-7"
			/>
		</svg>
		Back</a
	>
{/if}

<style>
	div {
		margin: auto;
		padding: 1rem;
		width: 800px;
		max-width: calc(100% - 2rem);
		color: white;
		font-size: 20px;
		line-height: 1.6;
	}
</style>
