import { BASE_VOLUME_PATH, TMP_FOLDER } from "$lib/constants";
import type { APIRoute } from "astro";
import fs from "fs";
import type { RecordModel } from "pocketbase";
import { downloadFileById } from "services/gdrive/downloadFileById";

export const POST: APIRoute = async ({ request, params, locals }) => {
	const id = params?.id ?? "";
	console.log("id", id);
	// read tmp file tracking download queue
	let downloadQueue: string[] = [];
	// create file and folder if not exist
	if (!fs.existsSync(`${TMP_FOLDER}/download_queue.json`)) {
		await fs.mkdirSync(TMP_FOLDER, { recursive: true });
		await fs.writeFileSync(
			`${TMP_FOLDER}/download_queue.json`,
			JSON.stringify([]),
			{
				encoding: "utf-8",
			},
		);
	}
	try {
		downloadQueue = JSON.parse(
			await fs.readFileSync(`${TMP_FOLDER}/download_queue.json`, "utf-8"),
		);
		if (!Array.isArray(downloadQueue)) downloadQueue = [];
	} catch (error) {}

	if (downloadQueue.includes(id)) {
		return new Response(JSON.stringify({}), {
			status: 400,
			statusText: "Already downloading",
		});
	}

	if (!id)
		return new Response(JSON.stringify({}), {
			status: 400,
			statusText: "Id not provided",
		});
	let episode: RecordModel;
	try {
		episode = await locals.pb
			.collection("episodes")
			.getFirstListItem(`id = "${id}"`, {
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

	let filepath = episode.pathname;
	if (episode?.expand?.series?.pathname) {
		if (episode?.expand?.season?.pathname)
			filepath = `${episode.expand.season.pathname}/${filepath}`;
		filepath = `${episode.expand.series.pathname}/${filepath}`;
	}

	const gdrive_file_id = episode.gdrive_file_id;
	if (!gdrive_file_id)
		return new Response(JSON.stringify({}), {
			status: 404,
			statusText: "Episode not found",
		});
	fs.writeFileSync(
		`${TMP_FOLDER}/download_queue.json`,
		JSON.stringify([...downloadQueue, id]),
	);
	await downloadFileById(gdrive_file_id, `${BASE_VOLUME_PATH}/${filepath}`);
	console.log("download finished", id);
	// remove from download queue
	downloadQueue = JSON.parse(
		fs.readFileSync(`${TMP_FOLDER}/download_queue.json`, "utf-8"),
	);
	if (!Array.isArray(downloadQueue)) downloadQueue = [];
	downloadQueue = downloadQueue.filter((item) => item !== id);
	fs.writeFileSync(
		`${TMP_FOLDER}/download_queue.json`,
		JSON.stringify(downloadQueue),
	);

	// update episode status
	locals.pb.collection("episodes").update(episode.id, {
		downloaded: true,
	});

	return new Response(JSON.stringify({}), {
		status: 200,
		statusText: "Download started",
	});
};
