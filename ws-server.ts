import { Server } from "socket.io";

const io = new Server(5432, {
	/* options */
});

io.on("connection", (socket) => {
	console.log("connection");
	console.log(socket.id);
});
