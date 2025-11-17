<template>
	<div class="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
		<!--
      ============================================================
      START / PAUSE / CONTINUE BUTTON
      ------------------------------------------------------------
      This button is dynamic and acts as a finite-state controller
      for the animation system.

      - When the simulation is NOT running:
          → Shows "Start" or "Continue"
          → Emits "start-viz" to begin the visualization loop

      - When the simulation IS running:
          → Shows "Pause"
          → Emits "stop-viz" to halt the visualization loop

      The button's visual state (color/hover) also reflects its
      functional state to reinforce UX clarity.
      ============================================================
    -->
		<button
			@click="togglePlay"
			:class="[
				'px-4 py-2 font-semibold rounded-lg shadow-md transition duration-150 ease-in-out',

				// If the simulation is running, the button becomes yellow (Pause)
				// Otherwise it is blue (Start/Continue)
				isRunning
					? 'bg-yellow-500 text-white hover:bg-yellow-600'
					: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400',
			]"
		>
			{{ playButtonLabel }}
		</button>

		<!--
      ============================================================
      PLAY FULL SIMULATION
      ------------------------------------------------------------
      Runs the entire sequence of robot moves from the current
      index until completion.

      - Disabled while animation is running
      - Also disabled when the move cursor has reached the end
      ============================================================
    -->
		<button
			@click="$emit('run-full')"
			:disabled="isRunning || moveIndex >= moveSequenceLength"
			class="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-150 ease-in-out disabled:bg-gray-400"
		>
			Play Full Simulation
		</button>

		<!--
      ============================================================
      STEP FORWARD
      ------------------------------------------------------------
      Moves forward exactly one action in the sequence.

      - Disabled during continuous play
      - Disabled when we reach the end of the list
      ============================================================
    -->
		<button
			@click="$emit('step-forward')"
			:disabled="isRunning || moveIndex >= moveSequenceLength"
			class="px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition duration-150 ease-in-out disabled:bg-gray-400"
		>
			Step Forward
		</button>

		<!--
      ============================================================
      STEP BACK
      ------------------------------------------------------------
      Moves the simulation back exactly one step.

      The parent component computes "canStepBack" because it knows
      about the global state and history stack.

      - Disabled when no backward history is available
      ============================================================
    -->
		<button
			@click="$emit('step-back')"
			:disabled="!canStepBack"
			class="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition duration-150 ease-in-out disabled:bg-gray-400"
		>
			Step Back
		</button>

		<!--
      ============================================================
      RESET SIMULATION
      ------------------------------------------------------------
      Returns simulation to its initial state.
      Parent decides what reset means (robot positions, counters,
      presents, collisions, etc.)
      ============================================================
    -->
		<button
			@click="$emit('reset')"
			class="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition duration-150 ease-in-out"
		>
			Reset
		</button>

		<!--
      ============================================================
      MOVE COUNTER (Display Only)
      ------------------------------------------------------------
      Shows user their progress through the instruction sequence:
      "Move 7 / 31", for example.

      Placed with "ml-auto" so it docks to the far right.
      ============================================================
    -->
		<div
			class="flex items-center ml-auto px-4 py-2 text-sm font-medium rounded-lg bg-gray-50 text-gray-600"
		>
			Move: <span class="font-bold text-gray-800 ml-1">{{ moveIndex }}</span> /
			{{ moveSequenceLength }}
		</div>
	</div>
</template>

<script setup lang="ts">
	// Importing Vue Composition API utilities
	import { ref, computed } from "vue";

	/*
    ==============================================================
    PROPS
    --------------------------------------------------------------
    These are controlled entirely by the parent component, which
    manages:

    - isRunning → whether the simulation animation loop is active
    - moveIndex → current step position in the move list
    - moveSequenceLength → total steps available
    - canStepBack → whether backward navigation is possible

    This component is intentionally stateless except for managing
    the paused state of the start/pause button.
    ==============================================================
  */
	const props = defineProps<{
		isRunning: boolean;
		moveIndex: number;
		moveSequenceLength: number;
		canStepBack: boolean;
	}>();

	/*
    ==============================================================
    EVENTS EMITTED TO THE PARENT
    --------------------------------------------------------------
    The parent owns all simulation state. This component only emits
    intent signals:

      - run-full      → run from current step to end
      - start-viz     → begin animation
      - stop-viz      → pause animation
      - step-forward  → advance one step
      - step-back     → undo one step
      - reset         → return to initial state
    ==============================================================
  */
	const emit = defineEmits([
		"run-full",
		"start-viz",
		"stop-viz",
		"step-forward",
		"step-back",
		"reset",
	]);

	/*
    ==============================================================
    INTERNAL LOCAL STATE
    --------------------------------------------------------------
    isPaused is tracked here because the parent only knows whether
    the simulation loop is running or not. It does not track
    whether we are "paused" versus "not started yet".

    This allows the button label to switch cleanly:
    → Start → Pause → Continue
    ==============================================================
  */
	const isPaused = ref(false);

	/*
    ==============================================================
    DYNAMIC BUTTON LABEL
    --------------------------------------------------------------
    This computed property manages the tri-state button label logic.
    It reflects one of:
      • "Start"    (initial state)
      • "Pause"    (when animation is currently running)
      • "Continue" (when animation was paused)
    ==============================================================
  */
	const playButtonLabel = computed(() => {
		if (props.isRunning) return "Pause";
		if (isPaused.value) return "Continue";
		return "Start";
	});

	/*
    ==============================================================
    MAIN BUTTON LOGIC
    --------------------------------------------------------------
    togglePlay is the primary event handler for the Start/Pause/
    Continue button.

    - If the simulation is currently running:
         → emit("stop-viz")
         → mark component state as paused

    - If the simulation is NOT running:
         → emit("start-viz")
         → clear paused state

    This maintains smooth UX across continuous playback and manual
    stepping.
    ==============================================================
  */
	const togglePlay = () => {
		if (props.isRunning) {
			emit("stop-viz");
			isPaused.value = true;
		} else {
			emit("start-viz");
			isPaused.value = false;
		}
	};
</script>
