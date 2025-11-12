<template>
	<div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
		<h3 class="text-xl font-bold text-gray-800 mb-3 border-b pb-2">
			Grid Key / Legend
		</h3>

		<div class="space-y-3 text-sm">
			<!-- Presents -->
			<div class="flex items-center space-x-3">
				<div
					class="w-6 h-6 flex items-center justify-center text-xs font-bold text-yellow-800 bg-yellow-200 rounded-md border border-yellow-400"
				>
					5
				</div>
				<span class="text-gray-700"
					>Present Count (Displayed in the corner of visited houses).</span
				>
			</div>

			<!-- Origin -->
			<div class="flex items-center space-x-3">
				<div class="w-6 h-6 bg-blue-100 ring-2 ring-blue-500 rounded-md"></div>
				<span class="text-gray-700">Origin House (The starting point).</span>
			</div>

			<!-- Visited House -->
			<div class="flex items-center space-x-3">
				<div class="w-6 h-6 bg-yellow-100 rounded-md"></div>
				<span class="text-gray-700"
					>Visited House (Received atleast 1 present).</span
				>
			</div>

			<!-- Robots (Example Color) -->
			<div class="flex items-center space-x-3">
				<div class="w-6 h-6 flex items-center justify-center">
					<div class="w-4 h-4 bg-red-500 text-white rounded-full shadow-lg">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<circle cx="12" cy="12" r="10"></circle>
							<path d="M16 12H8"></path>
							<path d="M12 8V16"></path>
						</svg>
					</div>
				</div>
				<span class="text-gray-700"
					>Robot Icon (Unique color identifies the specific robot).</span
				>
			</div>

			<!-- Empty Tile -->
			<div class="flex items-center space-x-3">
				<div class="w-6 h-6 bg-white border border-gray-200 rounded-md"></div>
				<span class="text-gray-700">Unvisited/Empty Tile.</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	// No script logic needed for this static legend component
</script>
