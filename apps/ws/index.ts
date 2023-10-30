import { Server } from "socket.io";
import os from "os";
import fs from "fs";
import cookie from "cookie";
import PocketBase from "pocketbase";
// hostname ip
const hostname = os?.networkInterfaces?.()?.en1?.[1]?.address ?? "";
export const BASE_VOLUME_PATH = "/Volumes/Extreme SSD/One Pace";
const pb = new PocketBase("http://127.0.0.1:8090");

const devices: Record<string, any> = {};

const io = new Server(5432, {
	cors: {
		origin: `http://${hostname}:4321`,
		methods: ["GET", "POST"],
		credentials: true,
	},
});

io.on("connection", (socket) => {
	console.log("------------ connection ------------");

	const cookies = socket.request.headers.cookie;
	const { device_id, profile } = cookie.parse(cookies ?? "");
	console.log({ device_id });
	!!profile &&
		socket.on("timeupdate", (data) => {
			let { filepath, time } = data;
			// get file or create a new one
			const filepathArr = filepath.split("/");
			const videoName = filepathArr.pop();
			filepath = filepathArr.join("/");
			const videoDataPath = `${BASE_VOLUME_PATH}/${filepath}/._meta_${videoName}.mp4.json`;
			fs.writeFileSync(
				videoDataPath,
				JSON.stringify({ time, updatedAt: Date.now() }),
			);
			socket.emit("timeupdated", { success: true });
		});

	socket.on("join", (deviceName) => {
		console.log("join");
		if (deviceName) devices[deviceName] = socket.id;
		socket.emit("joined", { devices });
	});

	socket.on("passToDevice", ({ targetDeviceName, pathname }) => {
		const deviceId = devices[targetDeviceName];
		socket.to(deviceId).emit("passToDevice", pathname);
	});
	console.log("//////////// connection ////////////");
});
