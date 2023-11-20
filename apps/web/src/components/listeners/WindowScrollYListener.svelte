<script lang="ts">
	import {
		_onWindowScroll,
		_onWindowResize,
		_onWindowLoad,
	} from "$stores/windowScrollY";
	import { onMount } from "svelte";

	onMount(() => {
		_onWindowLoad();
		window.addEventListener("scroll", _onWindowScroll);
		window.addEventListener("resize", _onWindowResize);

		return () => {
			window.removeEventListener("scroll", _onWindowScroll);
			window.removeEventListener("resize", _onWindowResize);
		};
	});
</script>
