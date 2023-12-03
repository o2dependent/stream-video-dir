<script lang="ts">
	import Tooltip from "$components/Tooltip.svelte";

	export let autoplayNext: boolean;
	export let containEl: HTMLElement;
</script>

<Tooltip
	className="h-full aspect-square"
	pos="top center"
	{containEl}
	tip="Autoplay {autoplayNext ? 'enabled' : 'disabled'}"
>
	<label
		class="flex h-full items-center justify-center relative cursor-pointer transition-opacity"
		class:paused={autoplayNext}
		class:opacity-80={!autoplayNext}
	>
		<input
			type="checkbox"
			class="absolute top-0 left-0 appearance-none h-full w-full peer cursor-pointer"
			bind:checked={autoplayNext}
		/>
		<div
			class="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-end items-end"
		>
			<div
				class="w-0 h-0.5 rounded-full bg-white origin-right -translate-x-1 -translate-y-0.5 rotate-45"
				class:w-6={!autoplayNext}
				style="transition: width 0.2s {autoplayNext
					? '0.05s'
					: '0s'} ease-in-out;"
			/>
		</div>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			class="relative"
			style="transition: clip-path 0.2s ease-in-out;clip-path: {autoplayNext
				? 'polygon(0 0, 0% 100%, 90% 100%, 90% 100%, 100% 90%, 100% 90%, 100% 100%, 90% 100%, 100% 90%, 100% 0%)'
				: 'polygon(0 0, 0% 100%, 90% 100%, 0 10%, 10% 0, 100% 90%, 100% 100%, 100% 100%, 100% 90%, 100% 0%)'};"
		>
			<g fill="none">
				<path
					d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"
				/>
				<path
					fill="currentColor"
					d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2ZM8.964 8.65l-.053.5l-.03.333l-.042.6l-.024.46l-.018.505l-.01.549v.578l.01.549l.018.506l.024.46l.042.6l.071.73l.013.102a1.192 1.192 0 0 0 1.651.954l.456-.202l.651-.309l.39-.196l.43-.224l.466-.253l.498-.282l.493-.29l.231-.14l.43-.27l.388-.25l.342-.229l.653-.46l.177-.131a1.192 1.192 0 0 0-.001-1.909l-.406-.296l-.275-.193l-.32-.218l-.565-.368l-.428-.268l-.47-.282l-.499-.288l-.478-.265l-.447-.238l-.41-.21l-.54-.263l-.439-.202l-.23-.102a16.814 16.814 0 0 0-.095-.04a1.192 1.192 0 0 0-1.654.952Z"
				/>
			</g>
		</svg>
	</label>
</Tooltip>
