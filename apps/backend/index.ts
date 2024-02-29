// @ts-ignore
import socket from "@socketsupply/socket-node";

socket.on("ping", async (value: string) => {
	await socket.send({
		window: 0,
		event: "pong",
	});
});
