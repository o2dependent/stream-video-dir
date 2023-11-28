import fs from "fs/promises";
import path from "path";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import { OAuth2Client, UserRefreshClient } from "google-auth-library";
import { TMP_FOLDER } from "$lib/constants";

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = `${TMP_FOLDER}/token.json`;
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
	try {
		const content = (await fs.readFile(TOKEN_PATH)) as unknown as string;
		const credentials = JSON.parse(content);
		return google.auth.fromJSON(credentials);
	} catch (err) {
		return null;
	}
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client: OAuth2Client) {
	const content = (await fs.readFile(CREDENTIALS_PATH)) as unknown as string;
	const keys = JSON.parse(content);
	const key = keys.installed || keys.web;
	const payload = JSON.stringify({
		type: "authorized_user",
		client_id: key.client_id,
		client_secret: key.client_secret,
		refresh_token: client.credentials.refresh_token,
	});
	await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
	let client = (await loadSavedCredentialsIfExist()) as UserRefreshClient;
	if (client) {
		return client;
	}
	client = (await authenticate({
		scopes: SCOPES,
		keyfilePath: CREDENTIALS_PATH,
	})) as UserRefreshClient;
	if (client?.credentials) {
		await saveCredentials(client);
	}
	return client;
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 */
async function listFiles(authClient: OAuth2Client) {
	const drive = google.drive({ version: "v3", auth: authClient });
	const res = await drive.files.list({
		pageSize: 10,
		fields: "nextPageToken, files(id, name)",
	});
	const files = res.data.files;
	if (files?.length === 0) {
		console.log("No files found.");
		return;
	}

	console.log("Files:");
	files?.map((file) => {
		console.log(`${file.name} (${file.id})`);
	});
}

export const getAuthClient = async () => {
	const authClient = await authorize();
	// @ts-ignore
	await listFiles(authClient);
	return authClient;
};
