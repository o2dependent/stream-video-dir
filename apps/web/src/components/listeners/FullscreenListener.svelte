<script lang="ts">
	import {
		_onFullscreenChange,
		_onFullscreenWindowLoad,
	} from "$stores/isFullscreen";
	import { onMount } from "svelte";

	onMount(() => {
		_onFullscreenWindowLoad();
		window.addEventListener("fullscreenchange", _onFullscreenChange);

		return () => {
			window.removeEventListener("fullscreenchange", _onFullscreenChange);
		};
	});
</script>
