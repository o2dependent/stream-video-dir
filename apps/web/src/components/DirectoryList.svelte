<script lang="ts">
	export let directory: Array<string> = [];
	export let filepath = "";
</script>

<div class="directory__list__container">
	{#each directory as item}
		{#if item.endsWith(".mp4")}
			<a href="/directory/{filepath}/{item.substring(0, item.length - 4)}/watch"
				>{item}</a
			>
		{:else}
			<a href="/directory/{filepath}/{item}">{item}</a>
		{/if}
	{:else}
		<p>Nothing here.</p>
	{/each}
</div>

<style>
	.directory__list__container {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
</style>
