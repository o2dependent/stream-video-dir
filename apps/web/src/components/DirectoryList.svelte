<script lang="ts">
	export let directory: {
		path: string;
		timestamp?: number;
		updated?: string;
		duration?: number;
	}[] = [];
	export let filepath = "";
	const formatDate = (date: string) => {
		const d = new Date(date);
		return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
	};
</script>

<div class="directory__list__container">
	{#each directory as item}
		{#if item.path.endsWith(".mp4")}
			{@const itemPercent =
				((item?.timestamp ?? 0) / (item?.duration ?? 1)) * 100}
			<a
				href="/directory/{filepath}/{item.path.substring(
					0,
					item.path.length - 4,
				)}/watch"
			>
				<div
					class="flex flex-col rounded border border-slate-700 bg-slate-900/25 px-4 py-2"
				>
					<p>{item.path}</p>
					<div class="grid grid-cols-2 w-full">
						<div
							class:border-green-500={itemPercent >= 99.9}
							class="w-full overflow-hidden rounded-full h-4 border border-purple-500"
						>
							<div
								class:bg-green-500={itemPercent >= 99.9}
								class:bg-purple-500={itemPercent < 99.9}
								class="h-full"
								style="width: {itemPercent}%"
							/>
						</div>
						<div class="flex justify-end">
							<p class="text-sm opacity-75">
								{#if item.timestamp}
									{formatDate(item?.updated ?? "")}
								{/if}
							</p>
						</div>
					</div>
				</div>
			</a>
		{:else}
			<a href="/directory/{filepath}/{item}">{item.path}</a>
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
