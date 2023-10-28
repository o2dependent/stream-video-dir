<script lang="ts">
	import { io } from "socket.io-client";
	export let filepath: string;
	export let startTime: number | undefined;
	export let hostname: string;

	$: socket = io(`${hostname}:5432`);
	console.log("hell");
	const timeupdate = (e: Event) => {
		socket.emit("timeupdate", {
			filepath,
			time: (e.currentTarget as HTMLVideoElement).currentTime,
		});
	};
</script>

<video on:timeupdate={timeupdate} width="640" height="360" controls>
	<source
		src={`/video/${filepath}${startTime ? `#t=${startTime}` : ""}`}
		type="video/mp4"
	/>
	Your browser does not support the video tag.
</video>
