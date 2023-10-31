<script lang="ts">
	export let directory: {
		id: string;
		path: string;
		timestamp?: number;
		updated?: string;
		duration?: number;
	}[] = [];
	export let filepath = "";
	export let latestVideoId: string | undefined;

	const formatDate = (date: string) => {
		const d = new Date(date);
		return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
	};
</script>

<div class="flex flex-col gap-1.5">
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
					class="flex flex-col rounded ring-1 ring-slate-700/0 hover:ring-purple-700 px-4 py-2 transition-shadow duration-150 ease-in-out bg-purple-900/10 hover:bg-purple-700/10"
				>
					<p>{item.path}</p>
					<div class="grid grid-cols-2 w-full">
						<div
							class:border-green-500={itemPercent >= 99.9}
							class="w-full overflow-hidden rounded-full h-2 border border-purple-500"
						>
							<div
								class:bg-green-500={itemPercent >= 99.9}
								class:bg-purple-500={itemPercent < 99.9}
								class="h-full"
								style="width: {itemPercent}%"
							/>
						</div>
						<div class="flex justify-end gap-2">
							{#if item.id === latestVideoId}
								<div class="group">
									<button class="relative" type="button">
										<div
											class="hidden z-40 group-focus-within:flex group-hover:flex flex-col absolute bottom-full right-3/4 rounded-3xl rounded-br-none bg-purple-700/25 backdrop-blur-md ring-1 ring-purple-700/50 px-2 py-1 w-max"
										>
											<p class="text-sm">Most recently watched</p>
										</div>
										📌
									</button>
								</div>
							{/if}

							{#if item.timestamp}
								<div class="group">
									<button class="relative" type="button">
										<div
											class="hidden z-40 group-focus-within:flex group-hover:flex flex-col absolute bottom-full right-3/4 rounded-3xl rounded-br-none bg-purple-700/25 backdrop-blur-md ring-1 ring-purple-700/50 px-2 py-1 w-max"
										>
											<p class="text-sm opacity-75">Last Watched</p>
											<p class="text-sm">
												{formatDate(item?.updated ?? "")}
											</p>
										</div>
										👀
									</button>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</a>
		{:else}
			<a href="/directory/{filepath}/{item.path}">{item.path}</a>
		{/if}
	{:else}
		<p>Nothing here.</p>
	{/each}
</div>
