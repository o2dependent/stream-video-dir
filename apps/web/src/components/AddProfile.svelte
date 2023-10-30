<script lang="ts">
	let isModalOpen = false;
</script>

<button on:click={() => (isModalOpen = true)} />
<div
	class:hidden={!isModalOpen}
	aria-hidden={!isModalOpen}
	class="z-50 fixed flex items-center justify-center top-0 left-0 w-full h-full bg-black/25 backdrop-blur-md transition-all"
	on:click={(e) => {
		if (e.target === e.currentTarget) {
			isModalOpen = false;
		}
	}}
>
	<form
		method="POST"
		class="w-full p-4 rounded border border-slate-500/50 bg-slate-800 max-w-sm flex flex-col gap-2"
	>
		<input
			type="text"
			name="profileName"
			class="text-black rounded bg-slate-200 border border-slate-400"
		/>
		<div>
			<button
				class="px-2 py-1 rounded bg-red-500 text-white"
				type="button"
				on:click={() => {
					isModalOpen = false;
				}}>Cancel</button
			>

			<button class="px-2 py-1 rounded bg-green-500 text-white" type="submit"
				>Create Profile</button
			>
		</div>
	</form>
</div>
