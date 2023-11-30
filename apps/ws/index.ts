import { Server } from "socket.io";
import os from "os";
import fs from "fs";
import cookie from "cookie";
import PocketBase, { RecordModel } from "pocketbase";
// get network ip
export const ip = Object.values(os.networkInterfaces())
	.flat()
	.find((iface) => iface?.family === "IPv4" && !iface.internal)?.address;
export const BASE_VOLUME_PATH = "/Volumes/Extreme SSD/One Pace";

const devices: Record<string, any> = {};
const io = new Server(5432, {
	cors: {
		origin: `http://${ip}:4321`,
		methods: ["GET", "POST"],
		credentials: true,
	},
});

io.on("connection", (socket) => {
	const cookies = socket.request.headers.cookie;
	const { device_id, profile_id } = cookie.parse(cookies ?? "");

	socket.on("join", (deviceName) => {
		if (deviceName) devices[deviceName] = socket.id;
		socket.emit("joined", { devices });
	});

	socket.on("passToDevice", ({ targetDeviceName, pathname }) => {
		const deviceId = devices[targetDeviceName];
		socket.to(deviceId).emit("passToDevice", pathname);
	});
});
