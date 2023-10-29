import type { APIRoute } from "astro";
import fs from "fs";

export const BASE_VOLUME_PATH = "/Volumes/Extreme SSD/One Pace";

export const GET: APIRoute = async ({ request, params }) => {
	let filepath = params?.filepath ?? "";
	const filepathArr = filepath.split("/");
	const videoName = filepathArr.pop();
	filepath = filepathArr.join("/");
	const videoDataPath = `${BASE_VOLUME_PATH}/${filepath}/._meta_${videoName}.mp4.json`;
	try {
		const videoData = await fs.readFileSync(videoDataPath, "utf-8");
		return new Response(videoData);
	} catch (error) {
		return new Response(JSON.stringify({}));
	}
};
