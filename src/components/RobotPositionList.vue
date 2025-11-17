<template>
	<!--
		Container Card:
		- Provides a visually separated section for displaying all robot positions.
		- Styled with padding, rounded corners, shadow, and a border for clear UI grouping.
	-->
	<div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
		<!--
			Section Title:
			- The heading clarifies that this component strictly lists robot positional data.
			- A bottom border visually anchors the title in the card.
		-->
		<h3 class="text-xl font-bold text-gray-800 mb-3 border-b pb-2">
			Robot Positions
		</h3>

		<!--
			Scrollable Robot List:
			- max-h-60 ensures the list remains compact, enabling scrolling for long robot lists.
			- overflow-y-auto avoids layout overflow and enhances UX by containing excessive content.
		-->
		<div class="space-y-2 max-h-60 overflow-y-auto">
			<!--
				v-for Loop:
				- Iterates through an array of RobotPosition objects.
				- Uses a unique :key based on robot.id for optimal DOM re-rendering.
				- Each row represents the state of a single robot at this moment in the simulation.
			-->
			<div
				v-for="robot in robotPositions"
				:key="robot.id"
				class="flex justify-between border-gray-300 items-center text-sm p-3 rounded-lg border transition duration-100 ease-in-out bg-gray-50"
			>
				<!--
					Robot Identity Section:
					- Displays a small colored dot (robot.colorClass) representing the robot.
					  Each robot receives a unique Tailwind color class passed from the parent.
					- Shows the robot's display name and ID to differentiate robots in multi-robot simulations.
				-->
				<div class="flex items-center space-x-3">
					<!--
						Color Dot:
						- A simple visual marker whose color reflects the robot's assigned identity.
						- Dynamically assigned classes allow each robot to maintain its color identity across the app.
					-->
					<div :class="['w-4 h-4 rounded-full shadow', robot.colorClass]"></div>

					<!-- Robot Friendly Name -->
					<span class="font-semibold text-gray-800">{{ robot.name }}</span>

					<!-- Robot ID (Useful for debugging and multi-robot simulations) -->
					<span class="text-xs text-gray-500">(ID: {{ robot.id }})</span>
				</div>

				<!--
					Robot Position Display:
					- Shows the robot's current grid coordinate.
					- The monospace font visually suggests coordinate-like or numeric data.
					- text-indigo-600 emphasizes the most important data on the row.
				-->
				<span class="font-bold text-indigo-600 text-lg font-mono">
					{{ robot.position }}
				</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	/*
		Type Import:
		RobotPosition defines the expected structure:
		{
			id: number | string,
			name: string,
			colorClass: string (Tailwind class),
			position: string (Format: "(x, y)" or custom)
		}
		This ensures strongly typed data coming from parents.
	*/
	import type { RobotPosition } from "../types";

	/*
		defineProps:
		- Declares that this component receives a prop called `robotPositions`.
		- The array is strictly typed, guaranteeing that template bindings and
		  property access remain safe and consistent.
		- This is a "presentation-only" component: no state mutation, only display.
	*/
	defineProps<{
		robotPositions: RobotPosition[];
	}>();
</script>
