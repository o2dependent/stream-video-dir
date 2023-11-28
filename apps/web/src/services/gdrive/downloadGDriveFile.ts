import axios from "axios";
import fs from "fs";

export const downloadGDriveFile = async (
	fileId: string,
	destination: string,
) => {
	const url = `https://drive.google.com/uc?id=${fileId}`;
	console.log("Downloading file:", url);
	console.log({
		fileId,
		destination,
	});

	try {
		const response = await axios({
			method: "get",
			url,
			responseType: "stream",
		});

		const writer = fs.createWriteStream(destination);

		response.data.pipe(writer);

		return new Promise((resolve, reject) => {
			writer.on("finish", resolve);
			writer.on("error", reject);
		});
	} catch (error: any) {
		console.error("Error downloading file:", error.message);
		throw error;
	}
};
