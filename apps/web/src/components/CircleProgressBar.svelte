<script>
	export let progress = 0;
	const max = 100;

	$: progressPath = () => {
		if (progress <= 0) {
			return "";
		} else if (progress >= max) {
			return "M50,5A45 45 0 1 1 49.9999 5";
		} else {
			const angle = Math.PI * 2 * (progress / max);
			const x = 50 + Math.cos(angle - Math.PI / 2) * 45;
			const y = 50 + Math.sin(angle - Math.PI / 2) * 45;

			let path = "M50,5";

			if (angle > Math.PI) {
				path += "A45 45 0 0 1 50 95";
			}

			path += `A45 45 0 0 1 ${x} ${y}`;

			return path;
		}
	};
</script>

<div class="aspect-square h-full relative">
	<svg viewBox="0 0 100 100">
		<path d="M50,5A45 45 0 1 1 49.9999 5" />
		<path d={progressPath()} />
	</svg>
</div>

<style>
	svg {
		fill: var(--progress-fill, transparent);
		stroke-linecap: var(--progress-linecap, round);
	}
	path:first-child {
		stroke: var(--progress-trackcolor, grey);
		stroke-width: var(--progress-trackwidth, 9px);
	}
	path:last-child {
		stroke: var(--progress-color, lightgreen);
		stroke-width: var(--progress-width, 10px);
	}
</style>
