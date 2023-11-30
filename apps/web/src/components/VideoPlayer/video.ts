import { writable } from "svelte/store";

export const video = writable<HTMLVideoElement>();
export const paused = writable(true);
export const duration = writable(0);
export const currentTime = writable(0);
