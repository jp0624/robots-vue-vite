<template>
	<div class="playback">
		<div class="playback-progress">
			<label for="route-progress">Route progress</label>
			<span>{{ moveIndex }} / {{ moveSequenceLength }}</span>
			<progress id="route-progress" :value="moveIndex" :max="moveSequenceLength || 1" />
		</div>
		<div class="playback-buttons">
			<button class="primary" :disabled="!isRunning && atEnd" @click="togglePlay">{{ playButtonLabel }}</button>
			<button :disabled="isRunning || atEnd" @click="$emit('run-full')">Run all</button>
			<button :disabled="isRunning || !canStepBack" @click="$emit('step-back')">Step back</button>
			<button :disabled="isRunning || atEnd" @click="$emit('step-forward')">Step forward</button>
			<button @click="$emit('reset')">Reset</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";

	const props = defineProps<{
		isRunning: boolean;
		moveIndex: number;
		moveSequenceLength: number;
		canStepBack: boolean;
	}>();

	const emit = defineEmits([
		"run-full",
		"start-viz",
		"stop-viz",
		"step-forward",
		"step-back",
		"reset",
	]);

	const atEnd = computed(() => props.moveIndex >= props.moveSequenceLength);
	const playButtonLabel = computed(() => {
		if (props.isRunning) return "Pause";
		if (props.moveIndex > 0 && !atEnd.value) return "Continue";
		return "Start";
	});
	const togglePlay = () => {
		if (props.isRunning) emit("stop-viz");
		else emit("start-viz");
	};
</script>
