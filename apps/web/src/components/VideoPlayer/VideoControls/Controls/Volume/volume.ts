import { get, writable } from "svelte/store";

export const volume = writable(
	typeof window !== "undefined"
		? parseFloat(localStorage?.getItem("volume") ?? "1")
		: 1,
);
export const muted = writable(false);
export const volumeBeforeMuted = writable(1);

export const toggleMute = () => {
	const m = get(muted);
	const vb = get(volumeBeforeMuted);
	console.log({
		m,
		vb,
	});
	volume.set(m ? vb : 0);
};

volume.subscribe((newVolume) => {
	const m = get(muted);
	if (newVolume <= 0) {
		muted.set(true);
	} else if (m && newVolume > 0) {
		muted.set(false);
	}
	if (newVolume !== 0) volumeBeforeMuted.set(get(volume));
	typeof window !== "undefined" &&
		localStorage.setItem("volume", `${newVolume}`);
});
