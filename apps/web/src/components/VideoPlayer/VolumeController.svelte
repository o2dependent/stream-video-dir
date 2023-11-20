<script lang="ts">
	import { cubicOut } from "svelte/easing";

	export let video: HTMLVideoElement;
	let volume = 1;
	let hovered = false;
	let focused = false;

	let muted = volume <= 0;

	$: {
		if (video) {
			if (volume <= 0) {
				video.muted = true;
				muted = true;
			} else {
				video.muted = false;
				muted = false;
			}
			video.volume = volume;
			// Cookie.set("volume", `${volume}`);
		}
	}

	const mouseenter = () => {
		hovered = true;
	};

	const mouseleave = () => {
		if (!focused) hovered = false;
	};
</script>

<div
	class="h-full flex items-center group"
	on:mouseenter={mouseenter}
	on:mouseleave={mouseleave}
	role="group"
>
	<button class="flex items-center" type="button">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
		>
			<g fill="none">
				<path
					d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"
				/>
				<path
					fill="currentColor"
					d={muted
						? "M13.26 3.3a1.1 1.1 0 0 1 1.734.78l.006.114v15.612a1.1 1.1 0 0 1-1.643.957l-.096-.062L6.68 16H4a2 2 0 0 1-1.995-1.85L2 14v-4a2 2 0 0 1 1.85-1.994L4 8h2.68l6.58-4.7Zm4.326 5.872L19 10.586l1.414-1.414a1 1 0 1 1 1.414 1.414L20.414 12l1.414 1.414a1 1 0 0 1-1.414 1.415L19 13.413l-1.414 1.415a1 1 0 0 1-1.414-1.415L17.586 12l-1.414-1.414a1 1 0 1 1 1.414-1.414Z"
						: "M13.26 3.3a1.1 1.1 0 0 1 1.734.78l.006.114v15.612a1.1 1.1 0 0 1-1.643.957l-.096-.062L6.68 16H4a2 2 0 0 1-1.995-1.85L2 14v-4a2 2 0 0 1 1.85-1.995L4 8h2.68l6.58-4.7Zm6.407 3.483A6.985 6.985 0 0 1 22 12a6.985 6.985 0 0 1-2.333 5.217a1 1 0 1 1-1.334-1.49A4.985 4.985 0 0 0 20 12c0-1.48-.642-2.81-1.667-3.727a1 1 0 1 1 1.334-1.49Zm-2 2.236A3.992 3.992 0 0 1 19 11.999a3.991 3.991 0 0 1-1.333 2.982a1 1 0 0 1-1.422-1.4l.088-.09c.41-.368.667-.899.667-1.491a1.99 1.99 0 0 0-.548-1.376l-.119-.115a1 1 0 1 1 1.334-1.49Z"}
				/>
			</g>
		</svg>
	</button>
	<div
		class="overflow-hidden w-0 group-hover:w-24 group-focus-within:w-24 px-0 group-hover:px-2 group-focus-within:px-2 h-full flex items-center transition-all"
	>
		<div class="w-full relative h-full flex items-center">
			<input
				class="w-full appearance-none h-full bg-transparent accent-white opacity-0 peer"
				min="0"
				max="1"
				step="0.01"
				type="range"
				on:keydown={(e) => {
					e.stopPropagation();
				}}
				bind:value={volume}
			/>
			<div
				class="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-white rounded-full pointer-events-none"
				style="width: {volume * 100}%;"
			/>
			<div
				class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-0 w-0 peer-hover:h-2 peer-hover:w-2 peer-focus:h-2
					peer-focus:w-2 bg-white rounded-full pointer-events-none"
				style="left: {volume *
					100}%; transition: height 300ms ease-in-out, width 300ms ease-in-out;"
			/>
			<div
				class="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-white/50 rounded-full pointer-events-none"
			/>
		</div>
	</div>
</div>
