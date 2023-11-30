<script lang="ts">
	// client:load not enabled for this component
	// be sure client:load is added before adding client code
	// if you don't you will be sad
</script>

<div id="video-container" class="w-full h-full relative">
	<div
		class="absolute top-0 left-0 h-full w-full flex flex-col items-center justify-center bg-black ring-gray-900 -z-10"
	/>
	<slot />
</div>
