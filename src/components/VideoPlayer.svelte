<script lang="ts">
	export let filepath: string;
	export let startTime: number | undefined;
	export let hostname: string;
</script>

<video
	on:timeupdate={(e) => console.log(e.currentTarget.currentTime)}
	width="640"
	height="360"
	controls
>
	<source
		src={`/video/${filepath}${startTime ? `#t=${startTime}` : ""}`}
		type="video/mp4"
	/>
	Your browser does not support the video tag.
</video>
