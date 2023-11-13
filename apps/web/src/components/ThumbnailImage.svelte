<script lang="ts">
	export let videoPath: string;
	export let videoTitle: string;
	export let duration: number | undefined;
	export let timestamp: number | undefined;

	$: itemPercent = ((timestamp ?? 0) / (duration ?? 1)) * 100;
	let isHovering = false;

	const mouseenter = () => {
		isHovering = true;
	};
	const mouseleave = () => {
		isHovering = false;
	};
</script>

<img
	class="w-full max-w-md aspect-video object-contain"
	on:mouseenter={mouseenter}
	on:mouseleave={mouseleave}
	src="/thumbnail/{videoPath}.{isHovering ? 'gif' : 'png'}"
	alt={videoTitle}
/>
