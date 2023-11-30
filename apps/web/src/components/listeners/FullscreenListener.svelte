<script lang="ts">
	import {
		_onFullscreenChange,
		_onFullscreenWindowLoad,
		removeFullscreen,
	} from "$stores/isFullscreen";
	import { onMount } from "svelte";
	export let fullscreenPersist: boolean = false;

	onMount(() => {
		if (typeof window !== "undefined") {
			if (!fullscreenPersist) removeFullscreen();

			_onFullscreenWindowLoad();
			window.addEventListener("fullscreenchange", _onFullscreenChange);

			return () => {
				window.removeEventListener("fullscreenchange", _onFullscreenChange);
			};
		}
	});
</script>
