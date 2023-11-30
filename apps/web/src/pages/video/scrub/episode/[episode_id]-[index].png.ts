import type { APIRoute } from "astro";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import {
	BASE_VOLUME_PATH,
	SCRUB_MAX_CHUNK_INDEX,
	SCRUB_SCREENSHOT_HEIGHT,
	SCRUB_SCREENSHOT_WIDTH,
	SCRUB_TIMESTAMP_PER_CHUNK,
} from "$lib/constants";
import type { RecordModel } from "pocketbase";
import path from "path";

export const GET: APIRoute = async ({ request, params, locals }) => {
	// const APP_NAME = import.meta?.env?.APP_NAME ?? "lowky-video";
	const episode_id = params?.episode_id ?? "";

	if (!episode_id)
		return new Response(JSON.stringify({}), {
			status: 400,
			statusText: "Id not provided",
		});

	let episode: RecordModel;
	try {
		episode = await locals.pb.collection("episodes").getOne(episode_id, {
			expand: "series,season",
		});
		if (!episode)
			return new Response(JSON.stringify({}), {
				status: 404,
				statusText: "Episode not found",
			});
	} catch (error) {
		return new Response(JSON.stringify({}), {
			status: 404,
			statusText: "Episode not found",
		});
	}

	let filepathFolder = "";
	if (episode?.expand?.season)
		filepathFolder = path.join(
			episode?.expand?.season?.pathname,
			filepathFolder,
		);
	if (episode?.expand?.series)
		filepathFolder = path.join(
			episode?.expand?.series?.pathname,
			filepathFolder,
		);

	const filepathFile = episode?.pathname as string;

	let filepath = path.join(filepathFolder ?? "", filepathFile);

	const folder = path.join(
		BASE_VOLUME_PATH,
		filepathFolder,
		`.${filepathFile.split(".").slice(0, -1).join(".")}`,
	);
	const index = Number(params?.index ?? NaN);
	const scrubChunkImagePath = path.join(folder, `scrub-C${index}.png`);

	if (isNaN(index) || index > SCRUB_MAX_CHUNK_INDEX || index < 0)
		return new Response(undefined, { status: 400 });

	// if folder doesn't already exist create it
	if (!fs.existsSync(folder)) {
		fs.mkdirSync(folder);
	}

	if (filepath.substring(filepath.length - 4) !== ".mp4") filepath += ".mp4";
	const video = ffmpeg(`${BASE_VOLUME_PATH}/${filepath}`);

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
	}

	const arrayBuffer = fs.readFileSync(scrubChunkImagePath);

	return new Response(arrayBuffer);
};
