<template>
	<!--
		Main Controls Container:
		- flex-1 ensures this panel expands to fill available width beside other layout panels.
		- Provides left padding and vertical spacing to visually separate the control panel
		  from the grid visualization area.
	-->
	<div class="flex-1 pl-10 py-5">
		<!--
			Section Title:
			- Clear label indicating this panel manages all user inputs that control
			  simulation setup, speed, and playback flow.
			- Border-bottom improves visual separation from the controls below.
		-->
		<h2 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
			Simulation Controls
		</h2>

		<!--
			ControlInputs Component:
			- Responsible for capturing:
				• Number of robots to simulate
				• Movement sequence instructions (e.g., "^>v<")
			- This component is a pure UI input collector without simulation logic.
			- Props are passed down using parent state values.
			- Emits propagate back changes using the v-model pattern with custom prop names.
			- While isRunning disables editing during simulation to prevent inconsistent states.
		-->
		<ControlInputs
			:num-robots-input="numRobotsInput"
			:move-sequence-input="moveSequenceInput"
			:steps-per-second="stepsPerSecond"
			:is-running="isRunning"
			@update:num-robots-input="$emit('update:num-robots-input', $event)"
			@update:move-sequence-input="$emit('update:move-sequence-input', $event)"
		/>

		<!--
			Speed Slider Section:
			- Allows dynamic control of how fast steps are executed during visualization.
			- Uses a range input (1–20 steps/sec), ideal for smooth user control.
			- Disabled when isRunning = true to maintain simulation consistency during playback.
			- Emits updates to the parent using a fully typed numeric conversion.
		-->
		<div class="mb-6 mt-4">
			<label
				for="stepsPerSecond"
				class="block text-sm font-medium text-gray-700"
			>
				Visualization Speed:
				<!-- Display the current speed inline for real-time feedback -->
				<span class="font-bold text-blue-600">{{ stepsPerSecond }}</span>
				steps/sec
			</label>

			<!--
				Range Input:
				- Binds to stepsPerSecond but remains read-only except through onInput updates.
				- Emits updated numeric values to the parent.
				- Uses a custom appearance (range-lg) for improved UI.
			-->
			<input
				type="range"
				id="stepsPerSecond"
				:value="stepsPerSecond"
				@input="
					$emit(
						'update:steps-per-second',
						parseInt(($event.target as HTMLInputElement)?.value ?? '1')
					)
				"
				min="1"
				max="20"
				step="1"
				:disabled="isRunning"
				class="mt-2 w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer range-lg"
			/>
		</div>

		<!--
			ActionButtons Component:
			- Centralized control bar for simulation playback.
			- Provides buttons for:
				• Running the full simulation instantly
				• Starting/stopping step-by-step visualization playback
				• Manually stepping forward/backward
				• Resetting the simulation entirely
			- All button actions are emitted upward to keep this component stateless.
			- moveIndex + moveSequenceLength determine where the user is in the instruction stream.
			- canStepBack enforces safety when navigating backward.
		-->
		<ActionButtons
			:is-running="isRunning"
			:move-index="moveIndex"
			:move-sequence-length="moveSequenceLength"
			:can-step-back="canStepBack"
			@run-full="$emit('run-full')"
			@start-viz="$emit('start-viz')"
			@stop-viz="$emit('stop-viz')"
			@step-forward="$emit('step-forward')"
			@step-back="$emit('step-back')"
			@reset="$emit('reset')"
		/>
	</div>
</template>

<script setup lang="ts">
	/*
		Component Imports:
		- ControlInputs: Handles raw input fields for simulation configuration.
		- ActionButtons: Encapsulates all action triggers in one cohesive UI unit.
		- The separation of concerns results in highly reusable and testable subcomponents.
	*/
	import ControlInputs from "./ControlInputs.vue";
	import ActionButtons from "./ActionButtons.vue";

	/*
		defineProps:
		Declares all externally provided inputs from the parent container.

		Props explained:
		- numRobotsInput:
			The number of robots specified before simulation begins.

		- moveSequenceInput:
			A string of characters representing directional instructions
			for robots to follow (e.g., '^', '>', 'v', '<').

		- stepsPerSecond:
			Visualization playback speed for step-by-step simulation.

		- isRunning:
			A boolean flag preventing inputs from being modified mid-simulation.

		- moveIndex:
			Index of the current movement being processed or visualized.

		- moveSequenceLength:
			Total movements in the sequence, used for bounds checking and UI state.

		- canStepBack:
			Boolean indicating whether stepping backward is allowed
			given the current simulation state.
	*/
	defineProps<{
		numRobotsInput: number;
		moveSequenceInput: string;
		stepsPerSecond: number;
		isRunning: boolean;
		moveIndex: number;
		moveSequenceLength: number;
		canStepBack: boolean;
	}>();

	/*
		defineEmits:
		Exposes a set of events this component can send back to the parent.
		All interactions remain controlled externally, ensuring this component
		remains a presentational layer with no internal simulation logic.

		Emit Categories:
		- update:* events → For v-model–style reactive prop updates.
		- playback events (run-full, start-viz, stop-viz) → For controlling simulation flow.
		- navigation events (step-forward, step-back) → For single-step traversal.
		- reset → For restoring the simulation to its initial state.
	*/
	defineEmits([
		"update:num-robots-input",
		"update:move-sequence-input",
		"update:steps-per-second",
		"run-full",
		"start-viz",
		"stop-viz",
		"step-forward",
		"step-back",
		"reset",
	]);
</script>
