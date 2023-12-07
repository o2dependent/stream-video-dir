<script lang="ts">
	import { navProgress } from "$stores/navProgress";
	import { onMount } from "svelte";

	let progressTimeout: NodeJS.Timeout;

	const beforepreparation = () => {
		console.log("beforepreparation");
		if (progressTimeout) clearTimeout(progressTimeout);
		$navProgress = 15;
	};
	const beforeswap = () => {
		console.log("beforeswap");
		$navProgress = 75;
	};
	const afterswap = () => {
		console.log("afterswap");
		$navProgress = 90;
	};
	const pageload = () => {
		console.log("pageload");
		$navProgress = 100;
		if (progressTimeout) clearTimeout(progressTimeout);
		progressTimeout = setTimeout(() => {
			console.log("pageload timeout");
			$navProgress = 0;
		}, 500);
	};

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
