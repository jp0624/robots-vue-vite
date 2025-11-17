<template>
	<!-- 
		Main input panel for simulation configuration.
		This component is intentionally kept "dumb":
		it receives state via props and emits updates upward,
		which makes it reusable and keeps source-of-truth data
		in the parent component (standard Vue patterns).
	-->
	<div class="grid md:grid-cols-3 gap-6">
		<!-- -----------------------------------------
		     INPUT: NUMBER OF ROBOTS
		     -----------------------------------------
		     This section allows the user to specify N,
		     the number of robots participating in the simulation.
		     It uses a controlled input pattern:
		     - The parent provides the current value via props.
		     - The child emits an update event instead of mutating it.
		     This enforces one-way data flow while maintaining reactivity.
		-->
		<div>
			<label for="numRobots" class="block text-sm font-medium text-gray-700">
				Number of Robots (N)
			</label>

			<input type="number" id="numRobots"

			<!-- 
					Bind the input's displayed value to the prop.
					We do *not* use v-model here because the parent
					explicitly controls the entire state.
				-->
			:value="numRobotsInput"

			<!-- 
					Emit the new numeric value whenever the user types.
					$emit sends an event upward to the parent.
					The parent updates the source data, which flows back in.
					
					parseInt(...) ensures we convert the input text into
					a real integer, protecting the parent from invalid types.
				-->
			@input=" $emit( 'update:num-robots-input', parseInt(($event.target as
			HTMLInputElement)?.value ?? '0') ) "

			<!-- Disable editing while simulation is running -->
			:disabled="isRunning" min="1"

			<!-- Tailwind styling for consistent UX -->
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border
			focus:ring-blue-500 focus:border-blue-500" />
		</div>

		<!-- -----------------------------------------
		     INPUT: MOVEMENT SEQUENCE
		     -----------------------------------------
		     This is the string of directional commands:
		     ^ = up, V = down, < = left, > = right.
		     The component does NOT validate the sequence here—
		     responsibility stays with the parent or engine.
		-->
		<div class="md:col-span-2">
			<label for="moveSequence" class="block text-sm font-medium text-gray-700">
				Movement Sequence (^V<>)
			</label>

			<input type="text" id="moveSequence"

			<!-- Controlled input: value passed from parent -->
			:value="moveSequenceInput"

			<!-- Emit updated text on each keystroke -->
			@input=" $emit( 'update:move-sequence-input', ($event.target as
			HTMLInputElement)?.value ?? '' ) "

			<!-- Prevent edits during live simulation playback -->
			:disabled="isRunning"

			<!-- 
					Use monospaced font and uppercase to reinforce
					the "command sequence" nature of the field.
				-->
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border
			font-mono uppercase tracking-widest focus:ring-blue-500
			focus:border-blue-500" />
		</div>
	</div>
</template>

<script setup lang="ts">
	/* 
		Props definition:
		This defines the external API of the component.

		We do NOT mutate these locally—Vue’s best practice.
		The parent holds the single source of truth.
	*/
	defineProps<{
		numRobotsInput: number; // Current N value passed from parent
		moveSequenceInput: string; // User’s command sequence (^V<>)
		stepsPerSecond: number; // Not used here but passed down for UI consistency
		isRunning: boolean; // Whether controls should be locked
	}>();

	/* 
		Events this component can emit.
		These follow Vue’s "update:propName" v-model style pattern.
		The parent listens for these and updates its own state.
	*/
	defineEmits(["update:num-robots-input", "update:move-sequence-input"]);
</script>
