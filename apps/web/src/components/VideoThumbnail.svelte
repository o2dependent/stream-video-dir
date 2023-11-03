<script lang="ts">
	export let videoPath: string;
	export let videoTitle: string;
	export let idx: number | undefined = undefined;
	export let duration: number | undefined;
	export let timestamp: number | undefined;
	export let isCurrentVideo: boolean = false;

	$: itemPercent = ((timestamp ?? 0) / (duration ?? 1)) * 100;
	let isHovering = false;

	const mouseenter = () => {
		isHovering = true;
	};
	const mouseleave = () => {
		isHovering = false;
	};
</script>

<a
	data-duration={duration}
	id={`directory-list-item${typeof idx === "number" ? "-" + idx : ""}`}
	href={`/directory/${videoPath}/watch`}
	class={`!w-full flex flex-col ring-1  ${
		isCurrentVideo
			? "ring-orange-700/50 hover:ring-orange-700 bg-orange-900/25 hover:bg-orange-700/25"
			: "ring-slate-700/0 hover:ring-purple-700 bg-purple-900/10 hover:bg-purple-700/10"
	} transition-shadow duration-150 ease-in-out`}
>
	<div class="relative">
		<img
			class="w-full max-w-md aspect-video object-contain"
			on:mouseenter={mouseenter}
			on:mouseleave={mouseleave}
			src="/thumbnail/{videoPath}.{isHovering ? 'gif' : 'png'}"
			alt={videoTitle}
		/>
		<div
			class:border-green-500={itemPercent >= 99.9}
			class={`directory-list-item-progress-container absolute bottom-0 left-0 w-full overflow-hidden h-2`}
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

	<p class="px-4 py-2">{videoTitle}</p>
</a>
