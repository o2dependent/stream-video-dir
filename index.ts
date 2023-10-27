import express from "express";
import fs from "fs";
import rangeParser from "range-parser";
import path from "path";

const app = express();
const port = 8080;

const videoPath = "video.mp4";
let _log_num = 0;

app.post("/videos", (req, res) => {
	return res.json({
		video: "/video",
	});
});

app.get("/video", (req, res) => {
	const fileSize = fs.statSync(videoPath).size;
	const range = req.headers.range || "bytes=0-";
	// colored console.log
	console.log(`\x1b[3${_log_num}m%s\x1b[0m`, "Request timestamp: ", Date.now());
	console.log(`\x1b[3${_log_num}m%s\x1b[0m`, "Request range: ", range);
	console.log(`\x1b[3${_log_num}m%s\x1b[0m`, "Request fileSize: ", fileSize);

	const positions = rangeParser(fileSize, range, { combine: true }) as any;
	console.log({ positions });
	const start = positions[0].start;
	const end = positions[0].end;

	const chunksize = end - start + 1;

	res.writeHead(206, {
		"Content-Range": `bytes ${start}-${end}/${fileSize}`,
		"Accept-Ranges": "bytes",
		"Content-Length": chunksize,
		"Content-Type": "video/mp4",
	});
	console.log(`\x1b[3${_log_num}m%s\x1b[0m`, "Response chunksize: ", chunksize);
	console.log(`\x1b[3${_log_num}m%s\x1b[0m`, "Response start: ", start);
	console.log(`\x1b[3${_log_num}m%s\x1b[0m`, "Response end: ", end);

	const fileStream = fs.createReadStream(videoPath, { start, end });
	fileStream.pipe(res);
	_log_num = (_log_num + 1) % 8;
	fileStream.close();
});

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
