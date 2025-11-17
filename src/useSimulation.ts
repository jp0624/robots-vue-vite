// Core composable function to manage the state and logic of the robot delivery simulation.
// Provides reactive state, computed outputs, and functions for controlling the simulation.
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import type { Robot, SimulationState } from "./types";
import { getRobotNames } from "./robotNames";

// Main composable function
export function useSimulation(
	initialRobots = 3, // Default number of robots
	initialMoves = "", // Default movement sequence (string of ^, V, <, >)
	initialSpeed = 5 // Default visualization speed (steps/sec)
) {
	// --- Reactive Inputs ---
	const numRobotsInput = ref(initialRobots); // Number of robots
	const moveSequenceInput = ref(initialMoves); // Movement sequence string
	const stepsPerSecond = ref(initialSpeed); // Visualization speed

	// --- Reactive State ---
	const robots = ref<Robot[]>([]); // Array of robot objects
	const houses = ref(new Map<string, number>()); // Map of houses with present counts, keyed by "x,y"
	const moveIndex = ref(0); // Index of the current move in the sequence
	const isRunning = ref(false); // Flag indicating if simulation is running
	const visualizationInterval = ref<number | null>(null); // Interval ID for automatic visualization
	const history = [] as SimulationState[]; // History of simulation states for undo/step-back
	const MAX_HISTORY = 100; // Max length of history to prevent memory bloat

	// --- Robot Colors ---
	const getRobotColorClass = (robotId: number) => {
		// Predefined set of colors for robots
		const colors = [
			"bg-red-500",
			"bg-blue-500",
			"bg-green-500",
			"bg-purple-500",
			"bg-yellow-600",
			"bg-pink-500",
			"bg-indigo-500",
			"bg-teal-500",
		];
		// Assign color based on robot ID modulo available colors
		return colors[(robotId - 1) % colors.length] || "bg-gray-500";
	};

	// --- History Management ---
	const saveHistory = () => {
		// Maintain history up to MAX_HISTORY
		if (history.length >= MAX_HISTORY) history.shift();

		// Save current state of robots and houses
		history.push({
			houses: Array.from(houses.value.entries()),
			robots: robots.value.map((r) => ({ ...r })),
			moveIndex: moveIndex.value,
		});
	};

	// Computed flag to check if we can step backward
	const canStepBack = computed(() => moveIndex.value > 0 || history.length > 1);

	// --- Visualization Controls ---
	const runVizStep = () => stepForward(); // Function called for each visualization step

	const stopVisualization = () => {
		// Stop the interval if running and mark simulation as stopped
		if (visualizationInterval.value !== null) {
			clearInterval(visualizationInterval.value);
			visualizationInterval.value = null;
			isRunning.value = false;
		}
	};

	const startVisualization = () => {
		// Start visualization only if not already running
		if (!isRunning.value) {
			isRunning.value = true;
			const delay = 1000 / stepsPerSecond.value; // Calculate interval delay in ms
			visualizationInterval.value = setInterval(
				runVizStep,
				delay
			) as unknown as number;
		}
	};

	// --- Reset Simulation ---
	const resetSimulation = () => {
		stopVisualization(); // Stop any running visualization
		houses.value = new Map<string, number>();
		moveIndex.value = 0;
		isRunning.value = false;
		history.length = 0;

		const robotNames = getRobotNames(numRobotsInput.value); // Generate robot names

		// Initialize robots with default positions and color classes
		robots.value = Array.from({ length: numRobotsInput.value }, (_, i) => ({
			id: i + 1,
			name: robotNames[i] || "Default Name", // Provide fallback name
			x: 0,
			y: 0,
			colorClass: getRobotColorClass(i + 1),
			collision: false,
		}));

		saveHistory(); // Save initial state
	};

	// --- Step Forward Logic ---
	const stepForward = () => {
		// Exit if all moves are completed
		if (moveIndex.value >= moveSequenceInput.value.length) return;

		// Reset collision flags
		robots.value.forEach((r) => (r.collision = false));

		const moveChar = moveSequenceInput.value[moveIndex.value] ?? "";
		const robotIndex = moveIndex.value % numRobotsInput.value;
		const robot = robots.value[robotIndex];
		if (!robot) return;

		let newX = robot.x;
		let newY = robot.y;

		// Determine new position based on move character
		switch (moveChar.toUpperCase()) {
			case "^":
				newY += 1;
				break;
			case "V":
				newY -= 1;
				break;
			case ">":
				newX += 1;
				break;
			case "<":
				newX -= 1;
				break;
		}

		// Check for collisions with other robots
		const collision = robots.value.some(
			(r) => r.id !== robot.id && r.x === newX && r.y === newY
		);

		if (!collision) {
			robot.x = newX;
			robot.y = newY;
			// Increment house present count if not the origin
			if (!(newX === 0 && newY === 0)) {
				const key = `${newX},${newY}`;
				houses.value.set(key, (houses.value.get(key) || 0) + 1);
			}
		} else {
			robot.collision = true; // Mark collision
		}

		moveIndex.value++; // Advance move index
		saveHistory(); // Save state for undo/step-back
		if (moveIndex.value >= moveSequenceInput.value.length) stopVisualization();
	};

	// --- Step Back Logic ---
	const stepBack = () => {
		if (moveIndex.value > 0) {
			history.pop(); // Remove latest state
			moveIndex.value--;
			const prevState = history[history.length - 1];
			if (prevState) {
				houses.value = new Map(prevState.houses);
				robots.value = prevState.robots.map((r) => ({ ...r }));
			}
		} else {
			resetSimulation(); // Reset if at beginning
		}
	};

	// --- Run Full Simulation ---
	const runFullSimulation = () => {
		stopVisualization();
		isRunning.value = false;
		while (moveIndex.value < moveSequenceInput.value.length) stepForward();
	};

	// --- Reactive Watchers ---
	// Restart visualization if speed changes
	watch(stepsPerSecond, () => {
		if (isRunning.value) {
			stopVisualization();
			startVisualization();
		}
	});

	// Reset simulation if robot count or move sequence changes
	watch([numRobotsInput, moveSequenceInput], () => {
		if (!isRunning.value) resetSimulation();
	});

	// --- Computed Outputs ---
	const totalPresents = computed(() =>
		Array.from(houses.value.values()).reduce((a, b) => a + b, 0)
	);

	const uniqueHousesWithOnePresent = computed(() => houses.value.size);

	const robotPositions = computed(() =>
		robots.value.map((r) => ({
			id: r.id,
			name: r.name,
			position: `(${r.x},${r.y})`,
			colorClass: r.colorClass,
			collision: r.collision,
		}))
	);

	const simulationMessage = computed(() => {
		const totalMoves = moveSequenceInput.value.length;
		if (totalMoves === 0) return "Simulation inputs empty.";
		if (moveIndex.value >= totalMoves) return "All moves executed.";
		if (isRunning.value)
			return `Visualizing at ${stepsPerSecond.value} steps/sec...`;

		const robot = robots.value[moveIndex.value % numRobotsInput.value];
		const moveChar = moveSequenceInput.value[moveIndex.value] ?? "";
		return robot
			? `Next: ${robot.name} moves '${moveChar}'`
			: "Ready for next step.";
	});

	const simulationStatus = computed(() => {
		const totalMoves = moveSequenceInput.value.length;
		const robotIndex = moveIndex.value % numRobotsInput.value;
		const currentRobot = robots.value[robotIndex];
		const currentTurn = Math.floor(moveIndex.value / numRobotsInput.value) + 1;
		const totalTurns = Math.ceil(totalMoves / numRobotsInput.value);

		if (moveIndex.value >= totalMoves)
			return `Simulation Ended: ${totalTurns} Turns Complete.`;
		return `Turn ${currentTurn} of ${totalTurns}: Move ${
			moveIndex.value + 1
		} of ${totalMoves}. Robot ${currentRobot?.id} to move.`;
	});

	// --- Grid Computation ---
	const houseGrid = computed(() => {
		let minX = -5,
			minY = -5,
			maxX = 5,
			maxY = 5;

		const positions = [
			...Array.from(houses.value.keys()).map((k) => {
				const [xStr, yStr] = k.split(",");
				return { x: Number(xStr ?? 0), y: Number(yStr ?? 0) };
			}),
			...robots.value.map((r) => ({
				x: r.x ?? 0,
				y: r.y ?? 0,
				collision: r.collision,
			})),
		];

		positions.forEach(({ x, y }) => {
			minX = Math.min(minX, x);
			minY = Math.min(minY, y);
			maxX = Math.max(maxX, x);
			maxY = Math.max(maxY, y);
		});

		// Add padding around grid
		minX -= 1;
		minY -= 1;
		maxX += 1;
		maxY += 1;

		// Build 2D grid representation for rendering
		const rows: Array<any> = [];
		for (let y = maxY; y >= minY; y--) {
			const row: Array<any> = [];
			for (let x = minX; x <= maxX; x++) {
				const key = `${x},${y}`;
				const presents = houses.value.get(key) || 0;
				const robotsPresent = robots.value.filter(
					(r) => r.x === x && r.y === y
				);
				row.push({ x, y, key, presents, robotsPresent });
			}
			rows.push(row);
		}

		return { rows, minX, minY, maxX, maxY };
	});

	// --- Lifecycle Hooks ---
	onMounted(resetSimulation); // Initialize simulation on mount
	onUnmounted(stopVisualization); // Stop running intervals on unmount

	// --- Return all state, computed, and functions ---
	return {
		numRobotsInput,
		moveSequenceInput,
		stepsPerSecond,
		robots,
		houses,
		moveIndex,
		isRunning,
		history,
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
	};
}
