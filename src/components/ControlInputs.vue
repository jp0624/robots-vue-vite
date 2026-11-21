<template>
	<div class="robot-count-field">
		<label for="numRobots" class="field-label">Robots</label>
		<input
			id="numRobots"
			type="number"
			:value="numRobotsInput || ''"
			:aria-invalid="!Number.isInteger(numRobotsInput) || numRobotsInput < 1 || numRobotsInput > 100"
			@input="$emit('update:num-robots-input', ($event.target as HTMLInputElement).valueAsNumber || 0)"
			:disabled="isRunning"
			min="1"
			max="100"
			class="route-input"
		/>
	</div>

	<div class="route-editor">
		<div class="route-editor-heading">
			<label for="moveSequence" class="field-label">Move sequence</label>
			<span>{{ moveSequenceInput.length }} {{ moveSequenceInput.length === 1 ? "move" : "moves" }}</span>
		</div>
		<textarea
			id="moveSequence"
			class="route-input route-sequence"
			:value="moveSequenceInput"
			:disabled="isRunning"
			:placeholder="exampleRoute"
			aria-describedby="move-guide"
			autocapitalize="off"
			spellcheck="false"
			rows="3"
			@input="editRoute"
		></textarea>
		<p id="move-guide" class="move-guide">Tap a direction to add it, or type or paste ^ V &lt; &gt;. Arrow symbols work too.</p>
		<p v-if="ignoredCharacters" class="route-feedback" role="status">Unsupported characters were skipped.</p>

		<div class="direction-buttons" role="group" aria-label="Add a move">
			<button
				v-for="direction in directions"
				:key="direction.command"
				type="button"
				:disabled="isRunning"
				@click="setRoute(moveSequenceInput + direction.command)"
			>
				<span aria-hidden="true">{{ direction.arrow }}</span>
				{{ direction.label }}
			</button>
		</div>
		<div class="route-tools">
			<button type="button" :disabled="isRunning || !moveSequenceInput" @click="setRoute(moveSequenceInput.slice(0, -1))">Remove last</button>
			<button type="button" :disabled="isRunning || !moveSequenceInput" @click="setRoute('')">Clear</button>
			<button type="button" :disabled="isRunning || moveSequenceInput === exampleRoute" @click="setRoute(exampleRoute)">Load example</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";

	defineProps<{
		numRobotsInput: number;
		moveSequenceInput: string;
		isRunning: boolean;
	}>();

	const emit = defineEmits<{
		"update:num-robots-input": [number];
		"update:move-sequence-input": [string];
	}>();

	const directions = [
		{ arrow: "↑", label: "Up", command: "^" },
		{ arrow: "↓", label: "Down", command: "V" },
		{ arrow: "←", label: "Left", command: "<" },
		{ arrow: "→", label: "Right", command: ">" },
	];
	const exampleRoute = "^>V^>V<^V<^V";
	const ignoredCharacters = ref(false);

	function normalizeRoute(input: string) {
		return input.replace(/↑/g, "^").replace(/↓|v/g, "V").replace(/←/g, "<").replace(/→/g, ">");
	}

	function editRoute(event: Event) {
		const field = event.target as HTMLTextAreaElement;
		const input = normalizeRoute(field.value);
		const route = input.replace(/[^\^V<>]/g, "");
		const caret = input.slice(0, field.selectionStart).replace(/[^\^V<>]/g, "").length;
		ignoredCharacters.value = /[^\s\^V<>]/.test(input);

		if (field.value !== route) {
			field.value = route;
			field.setSelectionRange(caret, caret);
		}
		emit("update:move-sequence-input", route);
	}

	function setRoute(route: string) {
		ignoredCharacters.value = false;
		emit("update:move-sequence-input", route);
	}
</script>
