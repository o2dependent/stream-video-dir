<script lang="ts">
	export let id: string;
	export let type: "episode" | "movie" = "episode";
	export let name: string;

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
	src="/thumbnail/${type}/{id}.{isHovering ? 'gif' : 'png'}"
	alt={name}
/>
