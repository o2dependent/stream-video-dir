import { get, writable } from "svelte/store";

export const volume = writable(1);
export const muted = writable(false);
export const volumeBeforeMuted = writable(1);

export const toggleMute = () => {
	muted.update((muted) => {
		if (muted) {
			volume.set(get(volumeBeforeMuted));
		} else {
			volumeBeforeMuted.set(get(volume));
			volume.set(0);
		}
		return !muted;
	});
};
