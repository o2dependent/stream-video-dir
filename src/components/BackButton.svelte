<script lang="ts">
	export let filepath: string;
</script>

<div>
	{#if filepath !== ""}
		<a
			href={filepath.split("/").length === 1
				? "/"
				: filepath.split("/").slice(0, -1).join("/")}>Back</a
		>
	{/if}
</div>

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
