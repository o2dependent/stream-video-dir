import { atom } from "nanostores";

export const windowScrollY = atom<number>(0);

const SCROLL_TOP_THRESHOLD = 8;

const handleChange = () => {
	const newWindowScrollY = window.scrollY;
	if (newWindowScrollY <= SCROLL_TOP_THRESHOLD)
		document.querySelector("html")?.classList.add("scroll-top");
	else document.querySelector("html")?.classList.remove("scroll-top");
	windowScrollY.set(newWindowScrollY);
};

export const _onWindowLoad = () => {
	handleChange();
};

export const _onWindowScroll = () => {
	handleChange();
};

export const _onWindowResize = () => {
	handleChange();
};
