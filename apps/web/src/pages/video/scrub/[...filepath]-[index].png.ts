import type { APIRoute } from "astro";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import {
	BASE_VOLUME_PATH,
	SCRUB_MAX_CHUNK_INDEX,
	SCRUB_SCREENSHOT_HEIGHT,
	SCRUB_SCREENSHOT_WIDTH,
	SCRUB_TIMESTAMP_PER_CHUNK,
	TMP_FOLDER,
} from "$lib/constants";
import { stitchImagesHorizontally } from "services/image/stitchImagesHorizontally";

export const GET: APIRoute = async ({
	request,
	ResponseWithEncoding,
	params,
}) => {
	const APP_NAME = import.meta?.env?.APP_NAME ?? "lowky-video";
	const query = new URL(request.url).searchParams;
	const filepath = params?.filepath ?? "";
	const index = Number(params?.index ?? NaN);
	const filepathFolder = filepath.split("/").slice(0, -1).join("/");
	const filepathFile = filepath.split("/").slice(-1)[0];
	const folder = `${BASE_VOLUME_PATH}/${filepathFolder}/.${filepathFile}`;
	const scrubChunkImagePath = `${folder}/scrub-C${index}.png`;

	if (isNaN(index) || index > SCRUB_MAX_CHUNK_INDEX || index < 0)
		return new Response(undefined, { status: 400 });

	// if folder doesn't already exist create it
	if (!fs.existsSync(folder)) {
		fs.mkdirSync(folder);
	}

	const video = ffmpeg(`${BASE_VOLUME_PATH}/${filepath}.mp4`);

	// check if screenshot chunk exists and create the thumbnail if not | `scrub-${index}.png`
	if (!fs.existsSync(scrubChunkImagePath)) {
		const duration = await new Promise<number>((resolve, reject) =>
			video.ffprobe((err, metadata) => {
				if (err) reject(err);
				const duration = metadata?.format?.duration ?? 0;
				resolve(duration);
			}),
		);

		// get chunk size based on duration
		const CHUNK_SIZE = Math.floor(duration / SCRUB_MAX_CHUNK_INDEX);
		const CHUNK_START = CHUNK_SIZE * index;
		// get timestamps based on chunk size
		const timestamps = Array.from(
			{ length: SCRUB_TIMESTAMP_PER_CHUNK },
			(_, i) => CHUNK_START + (i / SCRUB_TIMESTAMP_PER_CHUNK) * CHUNK_SIZE,
		);

		await new Promise(
			(resolve, reject) =>
				video
					.setStartTime(CHUNK_START)
					.withDuration(CHUNK_SIZE)
					.videoFilter(
						`fps=1/${
							CHUNK_SIZE / SCRUB_TIMESTAMP_PER_CHUNK
						},scale=${SCRUB_SCREENSHOT_WIDTH}:${SCRUB_SCREENSHOT_HEIGHT},tile=${SCRUB_TIMESTAMP_PER_CHUNK}x1`,
					)
					.output(scrubChunkImagePath)
					.on("end", (end) => {
						console.log({ CHUNK_START, CHUNK_SIZE, SCRUB_TIMESTAMP_PER_CHUNK });
						resolve(undefined);
					})
					.on("err", (err) => reject(err))
					.run(),
			// video
			// 	.screenshots({
			// 		timestamps,
			// 		folder: TMP_FOLDER,
			// 		filename: `scrub-C${index}-I%i.png`,
			// 		size: `${SCRUB_SCREENSHOT_WIDTH}x${SCRUB_SCREENSHOT_HEIGHT}`,

			// 	})
			// 	.videoFilter('tile=30x1')
			// 	.on("end", (end) => {
			// 		console.log({ end });
			// 		resolve(undefined);
			// 	})
			// 	.on("err", (err) => reject(err)),
		);
		// stitch screenshots together horizontally
		const imagePaths = timestamps?.map?.(
			(_, i) => `${TMP_FOLDER}/scrub-C${index}-I${i + 1}.png`,
		);
		console.log({ imagePaths });
		// await stitchImagesHorizontally(imagePaths, scrubChunkImagePath);
		// delete screenshots
		// for (const imagePath of imagePaths) {
		// 	fs.rm(imagePath, () => {});
		// }
	}

	const arrayBuffer = fs.readFileSync(scrubChunkImagePath);

	return new Response(arrayBuffer);
};
