import { Server } from "socket.io";
import os from "os";
import fs from "fs";
// hostname ip
const hostname = os?.networkInterfaces?.()?.en1?.[1]?.address ?? "";
export const BASE_VOLUME_PATH = "/Volumes/Extreme SSD/One Pace";

const devices: Record<string, any> = {};

const io = new Server(5432, {
	cors: {
		origin: `http://${hostname}:4321`,
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	console.log("connection");
	console.log(socket.id);

	socket.on("timeupdate", (data) => {
		console.log("watch");
		console.log(data);
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
		console.log(deviceName);
		if (deviceName) devices[deviceName] = socket.id;
		console.log({ devices });
		socket.emit("joined", { devices });
	});

	socket.on("passToDevice", ({ targetDeviceName, pathname }) => {
		const deviceId = devices[targetDeviceName];
		socket.to(deviceId).emit("passToDevice", pathname);
	});
});
