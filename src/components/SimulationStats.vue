<template>
	<!--
		Main container for all simulation statistics and supplementary information.
		- Uses vertical spacing between child components (space-y-6).
	-->
	<div class="space-y-6">
		<!--
			Status Summary Component:
			- Displays high-level simulation metrics:
				• simulationMessage: textual feedback about simulation state
				• simulationStatus: running, paused, or completed state
				• totalPresents: total number of presents delivered
				• uniqueHousesWithOnePresent: count of houses that received at least one present
			- Provides a concise overview for the user.
		-->
		<StatSummary
			:simulation-message="simulationMessage"
			:simulation-status="simulationStatus"
			:total-presents="totalPresents"
			:unique-houses-with-one-present="uniqueHousesWithOnePresent"
		/>

		<!--
			Robot Position List Component:
			- Displays a scrollable list of all robots and their current positions.
			- Uses the reactive robotPositions prop, showing both ID and color-coded identifier.
			- Helps users track individual robot locations in real-time.
		-->
		<RobotPositionList :robot-positions="robotPositions" />

		<!--
			Grid Legend Component:
			- Provides a static visual reference for interpreting the grid.
			- Explains tile colors, robot icons, collisions, origin, and presents.
			- Ensures users understand the visualization and metrics displayed in the grid.
		-->
		<GridLegend />
	</div>
</template>

<script setup lang="ts">
	/*
		Import Types and Components:
		- RobotPosition type defines the structure of each robot's state
		- StatSummary: component showing high-level metrics
		- RobotPositionList: component showing individual robot states
		- GridLegend: component explaining the visual key of the simulation grid
	*/
	import type { RobotPosition } from "../types";
	import StatSummary from "./StatSummary.vue";
	import RobotPositionList from "./RobotPositionList.vue";
	import GridLegend from "./GridLegend.vue";

	/*
		Props:
		- simulationMessage: textual feedback on simulation progress
		- simulationStatus: running, paused, or complete
		- totalPresents: total delivered presents
		- uniqueHousesWithOnePresent: number of houses with at least one present
		- robotPositions: array of RobotPosition objects for live robot tracking
		- All props are reactive and driven by the parent component (App.vue / useSimulation)
	*/
	defineProps<{
		simulationMessage: string;
		simulationStatus: string;
		totalPresents: number;
		uniqueHousesWithOnePresent: number;
		robotPositions: RobotPosition[];
	}>();
</script>
