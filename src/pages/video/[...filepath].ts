import type { APIRoute } from "astro";
import fs from "fs";
import RangeParser from "range-parser";

export const BASE_VOLUME_PATH = "/Volumes/Extreme SSD/One Pace";

export const GET: APIRoute = async ({
	request,
	ResponseWithEncoding,
	params,
}) => {
	const filepath = params?.filepath ?? "";
	console.log({ filepath });
	// stream video
	const videoPath = `${BASE_VOLUME_PATH}/${filepath}.mp4`;
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
	return new Response(body as any, { status: 206, headers });
};
