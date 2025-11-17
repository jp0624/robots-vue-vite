<template>
	<!--
		Main Application Container:
		- Applies consistent padding and background across the viewport.
		- min-h-screen ensures the content always fills the vertical space.
		- font-sans sets a clean, readable font for the entire app.
	-->
	<div class="p-6 bg-gray-50 min-h-screen font-sans">
		<!--
			Header Section:
			- White card with rounded corners, shadow, and border for elevation.
			- Flex container aligns logo, titles, and control panel horizontally.
			- The mb-8 margin separates it from the main simulation grid.
		-->
		<div
			class="bg-white py-0 px-6 rounded-xl shadow-lg mb-8 border border-gray-200 flex items-center mb-4"
		>
			<!--
				Logo Image:
				- Robbie's Present Delivery branding
				- Fixed dimensions for visual consistency
				- object-contain ensures the entire logo fits without distortion
			-->
			<img
				src="/robot-delivery-logo.png"
				alt="Robbie's Present Delivery Logo"
				class="h-[10em] w-[10em] mr-3 object-contain"
			/>

			<!--
				Title Group:
				- Uses hgroup for semantic grouping of related headings
				- Flex column to stack main and sub-titles vertically
				- mr-3 adds spacing between titles and control panel
			-->
			<hgroup class="flex flex-col mr-3">
				<h1 class="text-3xl font-bold text-teal-600">Robbie's Present</h1>
				<h2 class="text-2xl font-bold text-slate-600">Delivery Simulation</h2>
			</hgroup>

			<!--
				Simulation Controls Component:
				- Provides full user interaction for simulation configuration
				  and playback.
				- Props:
					• numRobotsInput / moveSequenceInput: configuration state
					• isRunning: disables inputs when simulation is active
					• moveIndex / moveSequenceLength: current progress of the simulation
					• stepsPerSecond: visualization speed
					• canStepBack: enables safe backward navigation
				- Emits:
					• All simulation actions propagate back to the useSimulation composable
					• Uses v-model-style updates for reactive binding
			-->
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

		<!--
			Main Simulation Grid + Stats Layout:
			- Uses a responsive 3-column grid
			- Left two columns display the main world grid
			- Right column displays statistics and robot positions
		-->
		<div class="grid lg:grid-cols-3 gap-6">
			<div class="lg:col-span-2">
				<!-- WorldGrid Component:
					- Responsible for rendering the 2D simulation grid
					- Receives the current house grid state and robot positions
					- Dynamically updates as robots move or presents are delivered
				-->
				<WorldGrid :house-grid="houseGrid" :robots="robots" />
			</div>

			<!-- SimulationStats Component:
				- Displays live statistics about the simulation
				- Props include:
					• simulationMessage: dynamic status messages
					• simulationStatus: running, paused, or completed state
					• totalPresents: total number of presents delivered
					• uniqueHousesWithOnePresent: count of unique houses that received at least one present
					• robotPositions: current positions of all robots
			-->
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
	/*
		Imports:
		- WorldGrid: visualizes the simulation grid and houses
		- SimulationStats: panel for displaying metrics and robot positions
		- SimulationControls: panel for inputs and playback controls
		- useSimulation: composable managing the entire simulation state
	*/
	import WorldGrid from "./components/WorldGrid.vue";
	import SimulationStats from "./components/SimulationStats.vue";
	import SimulationControls from "./components/SimulationControls.vue";
	import { useSimulation } from "./useSimulation";

	/*
		Destructuring the useSimulation composable:
		- Provides reactive state and functions controlling the entire simulation.
		- Initialized with:
			• 3 robots
			• Predefined movement sequence string
			• Initial grid size (5 houses per side)
		- Returns a fully reactive simulation state object:
			• numRobotsInput / moveSequenceInput: config values
			• stepsPerSecond: playback speed
			• robots: reactive robot array with positions/colors
			• moveIndex / isRunning / canStepBack: playback status flags
			• Simulation control functions: resetSimulation, stepForward, stepBack, runFullSimulation, startVisualization, stopVisualization
			• Metrics: totalPresents, uniqueHousesWithOnePresent, robotPositions
			• simulationMessage / simulationStatus: user-facing feedback
			• houseGrid: 2D array representing house states
	*/
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
		3, // default number of robots
		"^>^^>v<>vVV<^^^>v<>v<>vVV<v^^^>v<^>v<>vVV<>v<^>v<^>v<VVV<^>v<", // movement sequence string
		5 // initial grid size
	);
</script>
