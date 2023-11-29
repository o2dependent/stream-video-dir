import { google } from "googleapis";
import { getAuthClient } from "./getAuthClient";
import fs from "fs";

export const downloadFileById = async (
	fileId: string,
	destination: string,
	authClient?: Awaited<ReturnType<typeof getAuthClient>>,
	onDataProgress?: (progress: number) => void,
) => {
	if (!authClient) {
		console.log("No auth client provided. Getting auth client...");
		authClient = await getAuthClient();
		if (!authClient) throw new Error("No auth client provided or returned.");
		console.log("Auth client created.");
	}

	const drive = google.drive({ version: "v3", auth: authClient });

	const res = await drive.files.get(
		{ fileId, alt: "media" },
		{ responseType: "stream" },
	);
	console.log(res);

	return new Promise((resolve, reject) => {
		let progress = 0;
		let byteProgress = 0;
		const contentLength = parseInt(res.headers["content-length"]);

		// check if file already exists and if it matches the content length
		if (fs.existsSync(destination)) {
			const stats = fs.statSync(destination);
			if (stats.size === contentLength) {
				console.log("File already downloaded.");
				return resolve(destination);
			}
		}
		console.log(`writing to ${destination}`);
		const dest = fs.createWriteStream(destination);

		res.data
			.on("end", () => {
				console.log("Done downloading file.");
				resolve(destination);
			})
			.on("error", (err) => {
				console.error("Error downloading file.");
				reject(err);
			})
			.on("data", (d) => {
				byteProgress += d.length;
				progress = (byteProgress / contentLength) * 100;
				onDataProgress?.(progress);
			})
			.pipe(dest);
	});
};
