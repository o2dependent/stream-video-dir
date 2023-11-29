import { BASE_VOLUME_PATH, TMP_FOLDER } from "$lib/constants";
import type { APIRoute } from "astro";
import fs from "fs";
import type { RecordModel } from "pocketbase";
import { downloadFileById } from "services/gdrive/downloadFileById";

export const POST: APIRoute = async ({ request, params, locals }) => {
	const id = params?.id ?? "";
	console.log("id", id);

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

	const fileDownloaded = fs.existsSync(`${BASE_VOLUME_PATH}/${filepath}`);
	if (fileDownloaded) {
		if (episode?.downloaded) {
			return new Response(JSON.stringify({}), {
				status: 400,
				statusText: "Episode already downloaded",
			});
		}
		//  else {
		// 	await locals.pb.collection("episodes").update(episode.id, {
		// 		downloaded: true,
		// 		download_progress: 100,
		// 	});

		// 	return new Response(JSON.stringify({}), {
		// 		status: 200,
		// 		statusText: "Download finished",
		// 	});
		// }
	}

	await locals.pb.collection("episodes").update(episode.id, {
		downloaded: false,
		download_progress: 0,
	});

	const gdrive_file_id = episode.gdrive_file_id;
	if (!gdrive_file_id)
		return new Response(JSON.stringify({}), {
			status: 404,
			statusText: "Episode not found",
		});

	let progress = 1;
	await locals.pb.collection("episodes").update(episode.id, {
		download_progress: progress,
	});

	let progressUpdateAvailable = true;
	const handleProgressData = async (newProgress: number) => {
		console.log(`newProgress: ${newProgress}, progress: ${progress}`);
		if (Math.floor(newProgress) <= progress) return;
		progress = Math.floor(newProgress);
		await locals.pb.collection("episodes").update(episode.id, {
			downloaded: progress >= 100,
			download_progress: progress,
		});
	};

	await downloadFileById(
		gdrive_file_id,
		`${BASE_VOLUME_PATH}/${filepath}`,
		undefined,
		(newProgress) => {
			if (progressUpdateAvailable) {
				progressUpdateAvailable = false;
				handleProgressData(newProgress).then(() => {
					progressUpdateAvailable = true;
				});
			}
		},
	);
	console.log("download finished", id);

	if (progress < 100) {
		// update episode status
		await locals.pb.collection("episodes").update(episode.id, {
			downloaded: true,
			download_progress: 100,
		});
	}

	return new Response(JSON.stringify({}), {
		status: 200,
		statusText: "Download started",
	});
};
