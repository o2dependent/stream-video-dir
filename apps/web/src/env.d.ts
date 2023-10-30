/// <reference types="astro/client" />
declare namespace App {
	interface Locals {
		pb: import("pocketbase").default;
		profile?: {
			id: string;
			name: string;
		};
		device?: {
			id: string;
			name: string;
			deviceId: string;
		};
	}
}
