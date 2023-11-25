import type { APIRoute } from "astro";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { BASE_VOLUME_PATH } from "$lib/constants";

export const GET: APIRoute = async ({
	request,
	ResponseWithEncoding,
	params,
}) => {
	const query = new URL(request.url).searchParams;
	const filepath = params?.filepath ?? "";
	const ext = params?.ext ?? "";
	const filepathFolder = filepath.split("/").slice(0, -1).join("/");
	const filepathFile = filepath.split("/").slice(-1)[0];
	const folder = `${BASE_VOLUME_PATH}/${filepathFolder}/.${filepathFile}`;
	// if video doesn't exist || ext is not "png" or "gif" return 404
	if (
		!["png", "gif"].includes(ext) ||
		!fs.existsSync(`${BASE_VOLUME_PATH}/${filepath}.mp4`)
	) {
		return new Response(undefined, { status: 404 });
	}
	// if folder doesn't already exist create it
	if (!fs.existsSync(folder)) {
		fs.mkdirSync(folder);
	}
	const imagePath = `${folder}/thumbnail.${ext}`;
	// check if thumbnail exists
	if (!fs.existsSync(imagePath)) {
		const video = ffmpeg(`${BASE_VOLUME_PATH}/${filepath}.mp4`);
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
