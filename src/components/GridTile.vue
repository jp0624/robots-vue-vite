<template>
	<div
		class="tile relative flex flex-col justify-center items-center text-xs p-1 transition duration-100 ease-out"
		:class="{
			// Visited House (Option 5)
			'bg-yellow-100 border-yellow-300': presents > 0 && !(x === 0 && y === 0),
			// Origin House (Option 5)
			'bg-blue-100 ring-2 ring-blue-500 border-blue-300': x === 0 && y === 0,
			// Unvisited
			'bg-white border-gray-200': presents === 0 && !(x === 0 && y === 0),
		}"
	>
		<!-- Present Count (Option 5) -->
		<span
			v-if="presents > 0"
			class="present-count text-yellow-800 bg-yellow-200 rounded-full h-4 w-4 flex items-center justify-center font-bold"
		>
			{{ presents }}
		</span>

		<!-- Coordinates (Optional - visible for debugging/context) -->
		<!-- <span class="text-xs text-gray-400 absolute bottom-0 right-0 p-0.5 opacity-50">{{ x }},{{ y }}</span> -->

		<!-- Robot Icons (Option 2) -->
		<div
			class="robot-icons absolute bottom-0 left-0 right-0 top-0 flex flex-wrap p-1 justify-center items-center"
		>
			<div
				v-for="(robot, index) in robotsPresent"
				:key="robot.id"
				class="robot-icon w-3 h-3 rounded-full shadow-lg border border-white"
				:class="[robot.colorClass]"
				:style="{
					zIndex: 10 + index,
					// Offset slightly to show multiple robots on the same tile
					transform: `translate(${
						index * 10 - (robotsPresent.length - 1) * 5
					}%, ${index * 10 - (robotsPresent.length - 1) * 5}%)`,
				}"
			></div>
		</div>
	</div>
</template>

<script setup lang="ts">
	interface RobotPresence {
		id: number;
		colorClass: string; // e.g., 'bg-red-500'
	}

	defineProps<{
		x: number;
		y: number;
		presents: number;
		robotsPresent: RobotPresence[];
	}>();
</script>

<style scoped>
	.tile {
		width: 3rem;
		height: 3rem;
		min-width: 3rem;
		min-height: 3rem;
		border: 1px solid;
		/* Override default Tailwind behavior for precise tile sizing */
	}

	.present-count {
		position: absolute;
		top: 0.25rem;
		right: 0.25rem;
		font-size: 0.65rem; /* Smaller font for counter */
		line-height: 1;
		z-index: 20; /* Ensure present count is always on top */
	}

	.robot-icon {
		position: absolute;
		/* Use relative positioning within the flex container */
	}
</style>
