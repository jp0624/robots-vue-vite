<template>
	<div class="space-y-6">
		<StatSummary
			:simulation-message="simulationMessage"
			:simulation-status="simulationStatus"
			:total-presents="totalPresents"
			:unique-houses-with-one-present="uniqueHousesWithOnePresent"
		/>

		<RobotPositionList :robot-positions="robotPositions" />

		<GridLegend />
	</div>
</template>

<script setup lang="ts">
	import StatSummary from "./StatSummary.vue";
	import RobotPositionList from "./RobotPositionList.vue";
	import GridLegend from "./GridLegend.vue";
	import type { RobotPosition } from "../types";

	defineProps<{
		simulationMessage: string;
		simulationStatus: string;
		totalPresents: number;
		uniqueHousesWithOnePresent: number;
		robotPositions: RobotPosition[];
	}>();
</script>
