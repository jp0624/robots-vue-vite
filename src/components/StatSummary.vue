<template>
	<!--
		Main container for displaying a concise summary of the simulation's current state.
		- Uses padding, rounded corners, shadow, and border for clean UI styling.
	-->
	<div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
		<!--
			Header:
			- Title for the summary section.
			- Uses bold typography and bottom border for visual separation.
		-->
		<h2 class="text-xl font-bold text-gray-800 mb-3 border-b pb-2">
			Simulation Summary
		</h2>

		<!--
			Status Panel:
			- Dynamically styled based on simulationStatus via statusClass computed property.
			- Displays:
				• simulationMessage: brief descriptive message
				• simulationStatus: current state like "Running", "Paused", or "Ended"
			- Provides immediate visual feedback on simulation progress.
		-->
		<div class="p-3 mb-4 rounded-lg" :class="statusClass">
			<p class="font-medium text-sm">{{ simulationMessage }}</p>
			<p class="text-md font-bold">{{ simulationStatus }}</p>
		</div>

		<!--
			Stats Summary:
			- Horizontal flex container for key numeric metrics.
			- Total Presents Delivered:
				• Shows cumulative presents delivered by all robots
				• Emphasized with larger, bold, indigo-colored text
			- Unique Houses Visited:
				• Displays the number of houses that received at least one present
				• Emphasized with green-colored bold text
			- Flex layout ensures responsive, evenly spaced display.
		-->
		<div class="space-y-1 flex border-t text-sm">
			<div class="flex items-center pt-2 flex-1">
				<span class="text-gray-600 font-medium">Total Presents Delivered:</span>
				<span class="px-2.5 font-extrabold text-indigo-600 text-xl">{{
					totalPresents
				}}</span>
			</div>
			<div class="flex items-center flex-1">
				<span class="text-gray-600 font-medium">Unique Houses Visited:</span>
				<span class="px-2.5 font-extrabold text-green-600 text-xl">{{
					uniqueHousesWithOnePresent
				}}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";

	/*
		Props:
		- Optional props with default undefined values.
		- simulationMessage: brief textual description of the simulation state
		- simulationStatus: string indicating simulation status (e.g., "Running", "Paused", "Simulation Ended")
		- totalPresents: cumulative number of presents delivered
		- uniqueHousesWithOnePresent: count of houses receiving at least one present
		- Props are reactive and come from parent component (SimulationStats / useSimulation)
	*/
	const props = defineProps<{
		simulationMessage?: string;
		simulationStatus?: string;
		totalPresents?: number;
		uniqueHousesWithOnePresent?: number;
	}>();

	/*
		statusClass computed property:
		- Dynamically assigns Tailwind CSS classes based on the simulation status.
		- Provides color-coded visual feedback:
			• Green if simulation has ended
			• Blue if ready to start
			• Gray as default/neutral
		- Defensive programming: defaults to empty string to avoid calling .includes on undefined
	*/
	const statusClass = computed(() => {
		const status = props.simulationStatus ?? "";

		if (status.includes("Simulation Ended")) {
			return "bg-green-100 text-green-800 border border-green-300";
		}
		if (status.includes("Ready to start")) {
			return "bg-blue-100 text-blue-800 border border-blue-300";
		}
		return "bg-gray-50 text-gray-800 border border-gray-300";
	});
</script>
