<script lang="ts">
	export let id: string;
	export let type: "episode" | "movie" = "episode";
	export let name: string;
	export let isHovering = false;
	export let parentListeners: boolean = false;

	const mouseenter = () => {
		if (parentListeners) return;
		isHovering = true;
	};
	const mouseleave = () => {
		if (parentListeners) return;
		isHovering = false;
	};
</script>

<img
	class="w-full aspect-video object-contain object-center"
	on:mouseenter={mouseenter}
	on:mouseleave={mouseleave}
	src="/thumbnail/{type}/{id}.{isHovering ? 'gif' : 'png'}"
	alt={name}
/>
