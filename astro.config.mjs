import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
	output: "server",
	integrations: [svelte(), tailwind()],
	vite: {
		ssr: {
			external: ['mock-aws-s3', 'aws-sdk', 'nock'],
		}
	},
	adapter: node({
		mode: "standalone",
	}),
});
