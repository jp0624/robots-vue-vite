<template>
	<!-- 
		Main container for the legend panel.
		This component visually explains how the grid should be interpreted:
		- Which tiles represent visited houses
		- What icon style corresponds to robots
		- How collisions are represented
		- How present counts appear

		The component is intentionally static so that it remains lightweight,
		purely declarative, and easy to maintain. 
	-->
	<div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
		<!-- Section Title -->
		<h3 class="text-xl font-bold text-gray-800 mb-3 border-b pb-2">
			Grid Key / Legend
		</h3>

		<!-- 
			Each legend item is visually represented with a demo square/icon.
			Using a vertical flex layout creates clear separation between items.
		-->
		<div class="space-y-3 text-sm">
			<!-- ---------------------------------------
			     PRESENT COUNT VISUALIZATION
			     ---------------------------------------
			     Displays how many presents have been dropped on a tile.
			     This number appears in the *top-right corner* of a tile 
			     inside the simulation grid.
			-->
			<div class="flex items-center space-x-3">
				<!-- Styled sample present counter (static "5" just for demo) -->
				<div
					class="w-6 h-6 flex items-center justify-center text-xs font-bold text-yellow-800 bg-yellow-200 rounded-md border border-yellow-400"
				>
					5
				</div>

				<span class="text-gray-700">
					Present Count (Displayed in the corner of visited houses).
				</span>
			</div>

			<!-- ---------------------------------------
			     ORIGIN TILE
			     ---------------------------------------
			     The starting position for all robots.
			     Highlighted using a blue background & border.
			-->
			<div class="flex items-center space-x-3">
				<div class="w-6 h-6 bg-blue-100 ring-2 ring-blue-500 rounded-md"></div>

				<span class="text-gray-700"> Origin House (The starting point). </span>
			</div>

			<!-- ---------------------------------------
			     VISITED HOUSE
			     ---------------------------------------
			     Any tile that has received >= 1 present.
			     Uses soft yellow shading for visibility.
			-->
			<div class="flex items-center space-x-3">
				<div class="w-6 h-6 bg-yellow-100 rounded-md"></div>

				<span class="text-gray-700">
					Visited House (Received at least 1 present).
				</span>
			</div>

			<!-- ---------------------------------------
			     ROBOT ICON
			     ---------------------------------------
			     Explanation of how a robot appears on the grid.
			     The actual simulation assigns each robot a unique color,
			     but this icon demonstrates the general appearance.
			-->
			<div class="flex items-center space-x-3">
				<div class="w-6 h-6 flex items-center justify-center">
					<!-- Example robot sample circle -->
					<div class="w-4 h-4 bg-slate-500 text-white rounded-full shadow-lg">
						<!-- 
							Using an SVG circle ensures visual consistency
							across browsers and scales well with resolution.
						-->
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
						</svg>
					</div>
				</div>

				<span class="text-gray-700">
					Robot Icon (Unique color identifies the specific robot).
				</span>
			</div>

			<!-- ---------------------------------------
			     EMPTY TILE
			     ---------------------------------------
			     A tile that has never been visited by any robot.
			     Clean white surface with a subtle grey border.
			-->
			<div class="flex items-center space-x-3">
				<div class="w-6 h-6 bg-white border border-gray-200 rounded-md"></div>

				<span class="text-gray-700"> Unvisited/Empty Tile. </span>
			</div>

			<!-- ---------------------------------------
			     COLLISION TILE
			     ---------------------------------------
			     Indicates that two or more robots entered the same tile
			     at the same timestep. Collisions do NOT deliver presents.
			     Red pulse animation used to draw immediate attention.
			-->
			<div class="flex items-center space-x-3">
				<div
					class="w-6 h-6 bg-red-400 border animate-pulse border-red-600 rounded-md"
				></div>

				<span class="text-gray-700">
					Collision Detected (No Present Delivered)
				</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	/*
		This component contains no dynamic data, state, or logic.

		It is intentionally a purely presentational component:
		- No props
		- No emits
		- No reactivity
		- All visuals are static examples

		Advantages of keeping this component static:
		- Zero rendering overhead
		- No recomputation on state updates
		- Very high maintainability
		- Perfect separation of UI documentation vs. live simulation
	*/
</script>
