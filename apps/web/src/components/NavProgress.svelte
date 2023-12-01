<script lang="ts">
	import { navProgress } from "$stores/navProgress";
</script>

<div class="z-50 bg-slate-500/25 w-full h-px pointer-events-none select-none">
	<div
		class="h-full bg-rose-600/75"
		class:ml-auto={!($navProgress > 0)}
		class:opacity-0={!($navProgress > 0)}
		style:transition="width {$navProgress > 0 ? "250ms" : "250ms"} ease-in-out, opacity
		500ms ease-in-out"
		style:width="{$navProgress}%"
	></div>
</div>
