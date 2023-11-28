import { BASE_VOLUME_PATH } from "$lib/constants";
import type { APIRoute } from "astro";
import fs from "fs";
import RangeParser from "range-parser";

export const GET: APIRoute = async ({ request, params }) => {
	let filepath = params?.filepath ?? "";
	if (!filepath)
		return new Response(JSON.stringify({}), {
			status: 400,
			statusText: "Filepath not provided",
		});
	if (!filepath.includes(".mp4")) {
		filepath += ".mp4";
	}
	// stream video
	const videoPath = `${BASE_VOLUME_PATH}/${filepath}`;
	const fileSize = fs.statSync(`${videoPath}`).size;
	const range = request.headers.get("range") || "bytes=0-";
	const positions = RangeParser(fileSize, range, { combine: true }) as any;
	const start = positions[0].start;
	const end = positions[0].end;
	const chunksize = end - start + 1;

	const headers = {
		"Content-Range": `bytes ${start}-${end}/${fileSize}`,
		"Accept-Ranges": "bytes",
		"Content-Length": chunksize,
		"Content-Type": "video/mp4",
	};

	const body = fs.createReadStream(videoPath, { start, end });
	return new Response(body as any, { status: 206, headers } as any);
};
