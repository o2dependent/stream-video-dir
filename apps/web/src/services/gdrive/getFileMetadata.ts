import { google } from "googleapis";
import { getAuthClient } from "./getAuthClient";

export const getFileMetadata = async (
	fileId: string,
	authClient?: Awaited<ReturnType<typeof getAuthClient>>,
) => {
	if (!authClient) {
		console.log("No auth client provided. Getting auth client...");
		authClient = await getAuthClient();
		if (!authClient) throw new Error("No auth client provided or returned.");
		console.log("Auth client created.");
	}

	const drive = google.drive({ version: "v3", auth: authClient });

	const res = await drive.files.get({ fileId });
};
