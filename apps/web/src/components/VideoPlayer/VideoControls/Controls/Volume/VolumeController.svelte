<script lang="ts">
	import VolumeSlider from "./VolumeSlider.svelte";
	import MuteButton from "./MuteButton.svelte";

	export let video: HTMLVideoElement;
	export let containEl: HTMLElement;

	let volume = 1;
	let mutedVolume = volume;
	let muted = volume <= 0;

	const toggleMute = () => {
		if (video) {
			muted = !muted;
			if (muted) mutedVolume = video.volume;
			volume = muted ? 0 : mutedVolume;
		}
	};

	$: {
		if (video) {
			if (volume <= 0) {
				video.muted = true;
				muted = true;
			} else {
				video.muted = false;
				muted = false;
			}
			video.volume = volume;
			// Cookie.set("volume", `${volume}`);
		}
	}
</script>

<div class="h-full flex items-center group" role="group">
	<MuteButton {toggleMute} {muted} {containEl} />
	<VolumeSlider bind:muted bind:volume {containEl} />
</div>
