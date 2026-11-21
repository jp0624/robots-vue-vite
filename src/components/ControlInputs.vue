<template>
	<div class="route-fields">
		<div>
			<label for="numRobots" class="field-label"
				>Robots</label
			>
			<input
				type="number"
				id="numRobots"
				:value="numRobotsInput || ''"
                :aria-invalid="numRobotsInput < 1 || numRobotsInput > 100"
				@input="
					$emit(
						'update:num-robots-input',
						($event.target as HTMLInputElement).valueAsNumber || 0
					)
				"
				:disabled="isRunning"
				min="1" max="100"
				class="route-input"
			/>
		</div>

		<div >
			<label for="moveSequence" class="field-label"
				>Move sequence</label
			>
			<input
				type="text"
				id="moveSequence"
				:value="moveSequenceInput"
				@input="
					$emit(
						'update:move-sequence-input',
						($event.target as HTMLInputElement)?.value ?? ''
					)
				"
				:disabled="isRunning"
				class="route-input route-sequence"
                aria-describedby="move-guide" spellcheck="false"
			/>
		</div>
	</div>
    <p id="move-guide" class="move-guide"><kbd>^</kbd> Up <kbd>V</kbd> Down <kbd>&lt;</kbd> Left <kbd>&gt;</kbd> Right</p>
</template>

<script setup lang="ts">
	defineProps<{
		numRobotsInput: number;
		moveSequenceInput: string;
		stepsPerSecond: number;
		isRunning: boolean;
	}>();

	defineEmits(["update:num-robots-input", "update:move-sequence-input"]);
</script>
