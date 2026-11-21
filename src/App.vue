<template>
	<main class="dispatch">
		<header class="masthead">
			<img src="/robot-delivery-logo.png" alt="" width="76" height="76" />
			<h1>Robbie’s Present <span>Delivery System</span></h1>
		</header>

		<div class="dispatch-layout">
			<WorldGrid :house-grid="houseGrid" />
			<aside class="dispatch-sidebar" aria-label="Simulation controls and results">
				<SimulationControls
					:num-robots-input="numRobotsInput"
					:move-sequence-input="moveSequenceInput"
					:is-running="isRunning"
					:move-index="moveIndex"
					:move-sequence-length="robotPositions.length ? moveSequenceInput.length : 0"
					:steps-per-second="stepsPerSecond"
					:can-step-back="canStepBack"
					@update:num-robots-input="numRobotsInput = $event"
					@update:move-sequence-input="moveSequenceInput = $event"
					@update:steps-per-second="stepsPerSecond = $event"
					@run-full="runFullSimulation"
					@start-viz="startVisualization"
					@stop-viz="stopVisualization"
					@step-forward="stepForward"
					@step-back="stepBack"
					@reset="resetSimulation"
				/>
				<SimulationStats
					:simulation-message="simulationMessage"
					:simulation-status="simulationStatus"
					:total-presents="totalPresents"
					:unique-houses-with-one-present="uniqueHousesWithOnePresent"
					:robot-positions="robotPositions"
				/>
			</aside>
		</div>
	</main>
</template>

<script setup lang="ts">
	import WorldGrid from "./components/WorldGrid.vue";
	import SimulationStats from "./components/SimulationStats.vue";
	import SimulationControls from "./components/SimulationControls.vue";
	import { useSimulation } from "./useSimulation";

	const {
		numRobotsInput,
		moveSequenceInput,
		stepsPerSecond,
		moveIndex,
		isRunning,
		canStepBack,
		resetSimulation,
		stepForward,
		stepBack,
		runFullSimulation,
		startVisualization,
		stopVisualization,
		totalPresents,
		uniqueHousesWithOnePresent,
		robotPositions,
		simulationMessage,
		simulationStatus,
		houseGrid,
	} = useSimulation(
		3,
		"^>^^>v<>vVV<^^^>v<>v<>vVV<v^^^>v<^>v<>vVV<>v<^>v<^>v<VVV<^>v<",
		5
	);
</script>
