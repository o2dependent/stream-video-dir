import { google } from "googleapis";
import { getAuthClient } from "./getAuthClient";
import fs from "fs";

export const downloadFileById = async (
	fileId: string,
	destination: string,
	authClient?: Awaited<ReturnType<typeof getAuthClient>>,
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
		console.log(`writing to ${destination}`);
		let progress = 0;
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
				progress += d.length;
				if (process.stdout.isTTY) {
					process.stdout.clearLine(-1);
					process.stdout.cursorTo(0);
					process.stdout.write(`Downloaded ${progress} bytes`);
				}
			})
			.pipe(dest);
	});
};
