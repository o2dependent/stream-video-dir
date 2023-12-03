<script lang="ts">
	import { navProgress } from "$stores/navProgress";
	import { onMount } from "svelte";

	const beforepreparation = () => {
		if (progressTimeout) clearTimeout(progressTimeout);
		$navProgress = 15;
		console.log("$navProgress = 15;");
	};
	const beforeswap = () => {
		$navProgress = 75;
		console.log("$navProgress = 75;");
	};
	const afterswap = () => {
		$navProgress = 90;
		console.log("$navProgress = 90;");
	};
	const pageload = () => {
		$navProgress = 100;
		console.log("$navProgress = 100;");
		if (progressTimeout) clearTimeout(progressTimeout);
		progressTimeout = setTimeout(() => {
			$navProgress = 0;
			console.log("$navProgress = 0;");
		}, 500);
	};

	let progressTimeout: NodeJS.Timeout;
	onMount(() => {
		document.addEventListener("astro:before-preparation", beforepreparation);
		document.addEventListener("astro:before-swap", beforeswap);
		document.addEventListener("astro:after-swap", afterswap);
		document.addEventListener("astro:page-load", pageload);
		return () => {
			document.removeEventListener(
				"astro:before-preparation",
				beforepreparation,
			);
			document.removeEventListener("astro:before-swap", beforeswap);
			document.removeEventListener("astro:after-swap", afterswap);
			document.removeEventListener("astro:page-load", pageload);
		};
	});
</script>
