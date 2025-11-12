<template>
	<div class="p-6 bg-gray-50 min-h-screen font-sans">
		<div
			class="bg-white py-0 px-6 rounded-xl shadow-lg mb-8 border border-gray-200 flex items-center mb-4"
		>
			<img
				src="/robot-delivery-logo.png"
				alt="Robbie's Present Delivery Logo"
				class="h-[10em] w-[10em] mr-3 object-contain"
			/>
			<hgroup class="flex flex-col mr-3">
				<h1 class="text-3xl font-bold text-teal-600">Robbie's Present</h1>
				<h2 class="text-2xl font-bold text-slate-600">Delivery Simulation</h2>
			</hgroup>

			<SimulationControls
				:num-robots-input="numRobotsInput"
				:move-sequence-input="moveSequenceInput"
				:is-running="isRunning"
				:move-index="moveIndex"
				:move-sequence-length="moveSequenceInput.length"
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
		</div>

		<div class="grid lg:grid-cols-3 gap-6">
			<div class="lg:col-span-2">
				<WorldGrid :house-grid="houseGrid" :robots="robots" />
			</div>
			<SimulationStats
				:simulation-message="simulationMessage"
				:simulation-status="simulationStatus"
				:total-presents="totalPresents"
				:unique-houses-with-one-present="uniqueHousesWithOnePresent"
				:robot-positions="robotPositions"
			/>
		</div>
	</div>
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
		robots,
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
