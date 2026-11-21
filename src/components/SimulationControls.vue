<template>
	<div class="panel">
		<h2 class="panel-heading">
			Route controls
		</h2>

		<ControlInputs
			:num-robots-input="numRobotsInput"
			:move-sequence-input="moveSequenceInput"
			:is-running="isRunning"
			@update:num-robots-input="$emit('update:num-robots-input', $event)"
			@update:move-sequence-input="$emit('update:move-sequence-input', $event)"
		/>

		<div class="speed-control">
			<label
				for="stepsPerSecond"
				class="field-label"
			>
				Playback speed
				<span class="speed-value">{{ stepsPerSecond }}</span>
				steps/sec
			</label>
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
				class="speed-slider"
			/>
		</div>

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
	import ControlInputs from "./ControlInputs.vue";
	import ActionButtons from "./ActionButtons.vue";

	defineProps<{
		numRobotsInput: number;
		moveSequenceInput: string;
		stepsPerSecond: number;
		isRunning: boolean;
		moveIndex: number;
		moveSequenceLength: number;
		canStepBack: boolean;
	}>();

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
