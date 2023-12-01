<script lang="ts">
	import type { RecordModel } from "pocketbase";

	export let seasons: RecordModel[] | undefined;
	export let series_id: string;
	export let season_id: string | undefined;
</script>

<div class="group">
	<div class="group-focus-within:h-96 h-0 transition-all">
		<div class="flex flex-col overflow-y-auto overflow-x-hidden gap-1">
			{#each seasons ?? [] as { id, name }}
				<a
					href={`/series/${series_id}/${id}`}
					class={`px-4 py-2 opacity-90 hover:opacity-100 shadow-sm hover:shadow-md transition-all duration-75 rounded-xl ${
						season_id === id
							? "bg-rose-600/75"
							: "bg-neutral-700/0 hover:bg-neutral-700/25"
					}`}
				>
					<h3 class="text-lg font-semibold">{name}</h3>
				</a>
			{:else}
				<!-- empty list -->
			{/each}
		</div>
	</div>
</div>
