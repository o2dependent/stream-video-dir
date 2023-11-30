import { atom } from "nanostores";

export const isFullscreen = atom<boolean>(false);

export const toggleFullscreen = () => {
	if (document.fullscreenElement) document.exitFullscreen();
	else document.querySelector("html")?.requestFullscreen();
};

export const removeFullscreen = () => {
	if (document.fullscreenElement) document.exitFullscreen();
};

const handleChange = () => {
	const newIsFullscreen = !!document.fullscreenElement;
	isFullscreen.set(newIsFullscreen);
	if (newIsFullscreen)
		document.querySelector("html")?.classList.add("fullscreen");
	else document.querySelector("html")?.classList.remove("fullscreen");
};

export const _onFullscreenWindowLoad = () => {
	handleChange();
};

export const _onFullscreenChange = () => {
	handleChange();
};
