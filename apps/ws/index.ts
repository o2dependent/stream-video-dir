import { Server } from "socket.io";
import os from "os";
import fs from "fs";
import cookie from "cookie";
import PocketBase, { RecordModel } from "pocketbase";
// hostname ip
const hostname = os?.networkInterfaces?.()?.en1?.[1]?.address ?? "";
export const BASE_VOLUME_PATH = "/Volumes/Extreme SSD/One Pace";

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
	const pb = new PocketBase("http://127.0.0.1:8090");

	const cookies = socket.request.headers.cookie;
	const { device_id, profile_id } = cookie.parse(cookies ?? "");
	console.log({ device_id, profile_id });
	socket.on("timeupdate", async (data) => {
		if (!profile_id) return socket.emit("timeupdated", { success: false });
		let { filepath, time, duration, log } = data;
		if (log) console.log({ filepath, time, duration });
		let timestamp: RecordModel | undefined;
		// get file or create a new one
		try {
			timestamp = await pb.collection("watched_timestamps").getFirstListItem(
				pb.filter(`filepath = {:filepath} && profile = {:profile_id}`, {
					filepath,
					profile_id,
				}),
			);
			if (!timestamp) throw new Error("Timestamp not found");
			try {
				timestamp = await pb
					.collection("watched_timestamps")
					.update(timestamp.id, { timestamp: time, duration });
			} catch (error) {
				console.error("Failed to update timestamp", error);
				return;
			}
		} catch (error) {
			try {
				timestamp = await pb.collection("watched_timestamps").create({
					filepath,
					profile: profile_id,
					timestamp: time,
					duration,
				});
			} catch (error) {
				console.error("Failed to create timestamp", error);
				socket.emit("timeupdated", { success: false });
				return;
			}
		}
		socket.emit("timeupdated", { success: true });
	});

	socket.on("join", (deviceName) => {
		if (deviceName) devices[deviceName] = socket.id;
		socket.emit("joined", { devices });
	});

	socket.on("passToDevice", ({ targetDeviceName, pathname }) => {
		const deviceId = devices[targetDeviceName];
		socket.to(deviceId).emit("passToDevice", pathname);
	});
	console.log("//////////// connection ////////////");
});
