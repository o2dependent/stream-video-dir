import type { APIRoute } from "astro";
import fs from "fs";

export const BASE_VOLUME_PATH = "/Volumes/Extreme SSD/One Pace";

export const GET: APIRoute = async ({ request, params }) => {
	let res: string;
	// read directory
	let dir = fs.readdirSync(
		`${BASE_VOLUME_PATH}${params?.filepath ? "/" + params?.filepath : ""}`,
	);
	dir = dir?.filter((file) => !file.startsWith("."));
	// return directory
	return new Response(JSON.stringify(dir ?? {}));
};
