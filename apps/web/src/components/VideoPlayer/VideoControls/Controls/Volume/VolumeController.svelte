<script lang="ts">
	import VolumeSlider from "./VolumeSlider.svelte";
	import MuteButton from "./MuteButton.svelte";

	export let containEl: HTMLElement;
</script>

<div class="h-full flex items-center group" role="group">
	<MuteButton {containEl} />
	<VolumeSlider {containEl} />
</div>
