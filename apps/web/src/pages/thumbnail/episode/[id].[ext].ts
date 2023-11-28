import type { APIRoute } from "astro";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { BASE_VOLUME_PATH } from "$lib/constants";

export const GET: APIRoute = async ({
	request,
	ResponseWithEncoding,
	params,
	locals,
}) => {
	const id = params?.id ?? "";
	if (!id)
		return new Response(undefined, {
			status: 404,
			statusText: "Id not provided",
		});

	const episode = await locals.pb.collection("episodes").getOne(id, {
		expand: "series,season",
	});

	let filepathFolder = "";
	if (episode?.expand?.season)
		filepathFolder = `${episode?.expand?.season?.pathname}/${filepathFolder}`;
	if (episode?.expand?.series)
		filepathFolder = `${episode?.expand?.series?.pathname}/${filepathFolder}`;

	const filepathFile = episode?.pathname;

	const filepath = `${filepathFolder ?? ""}${
		filepathFolder ? "/" : ""
	}${filepathFile}`;

	const ext = params?.ext ?? "";
	const folder = `${BASE_VOLUME_PATH}/${filepathFolder}/.${filepathFile}`;
	// if video doesn't exist || ext is not "png" or "gif" return 404
	if (
		!["png", "gif"].includes(ext) ||
		!fs.existsSync(`${BASE_VOLUME_PATH}/${filepath}`)
	) {
		return new Response(undefined, {
			status: 400,
			statusText: "Invalid extension.",
		});
	}
	// if folder doesn't already exist create it
	if (!fs.existsSync(folder)) {
		fs.mkdirSync(folder);
	}
	const imagePath = `${folder}/thumbnail.${ext}`;
	// check if thumbnail exists
	if (!fs.existsSync(imagePath)) {
		const video = ffmpeg(`${BASE_VOLUME_PATH}/${filepath}`);
		// generate thumbnail
		if (ext === "gif") {
			await new Promise((resolve, reject) =>
				video.ffprobe((err, metadata) => {
					if (err) reject(err);
					const duration = metadata?.format?.duration ?? 0;
					console.log({ duration });
					video
						.setStartTime(duration * 0.1)
						.setDuration(8)
						.fps(10)
						.save(`${folder}/thumbnail.gif`)
						.on("end", () => resolve(undefined))
						.on("err", (err) => reject(err));
				}),
			);
		} else if (ext === "png") {
			await new Promise((resolve, reject) =>
				video
					.screenshots({
						count: 1,
						timestamps: ["10%"],
						folder,
						filename: "thumbnail.png",
					})
					.on("end", () => resolve(undefined))
					.on("err", (err) => reject(err)),
			);
		}
	}
	// get image file
	const arrayBuffer = fs.readFileSync(imagePath);

	return new Response(arrayBuffer);
};
