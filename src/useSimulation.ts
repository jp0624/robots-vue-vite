// src/useSimulation.ts
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import type { Robot, SimulationState } from "./types";
import { getRobotNames } from "./robotNames";

export function useSimulation(
	initialRobots = 3,
	initialMoves = "",
	initialSpeed = 5
) {
	const numRobotsInput = ref(initialRobots);
	const moveSequenceInput = ref(initialMoves);
	const stepsPerSecond = ref(initialSpeed);

	const robots = ref<Robot[]>([]);
	const houses = ref(new Map<string, number>());
	const moveIndex = ref(0);
	const isRunning = ref(false);
	const visualizationInterval = ref<number | null>(null);
	const history = [] as SimulationState[];
	const MAX_HISTORY = 100;

	// --- Robot colors ---
	const getRobotColorClass = (robotId: number) => {
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
		return colors[(robotId - 1) % colors.length] || "bg-gray-500";
	};

	// --- History ---
	const saveHistory = () => {
		if (history.length >= MAX_HISTORY) history.shift();
		history.push({
			houses: Array.from(houses.value.entries()),
			robots: robots.value.map((r) => ({ ...r })),
			moveIndex: moveIndex.value,
		});
	};

	const canStepBack = computed(() => moveIndex.value > 0 || history.length > 1);

	// --- Visualization ---
	const runVizStep = () => stepForward();

	const stopVisualization = () => {
		if (visualizationInterval.value !== null) {
			clearInterval(visualizationInterval.value);
			visualizationInterval.value = null;
			isRunning.value = false;
		}
	};

	const startVisualization = () => {
		if (!isRunning.value) {
			isRunning.value = true;
			const delay = 1000 / stepsPerSecond.value;
			visualizationInterval.value = setInterval(
				runVizStep,
				delay
			) as unknown as number;
		}
	};

	// --- Reset simulation ---
	const resetSimulation = () => {
		stopVisualization();
		houses.value = new Map<string, number>();
		moveIndex.value = 0;
		isRunning.value = false;
		history.length = 0;

		const robotNames = getRobotNames(numRobotsInput.value); // string[]

		robots.value = Array.from({ length: numRobotsInput.value }, (_, i) => ({
			id: i + 1,
			name: robotNames[i] || "Default Name", // Provide a default value here
			x: 0,
			y: 0,
			colorClass: getRobotColorClass(i + 1),
			collision: false,
		}));

		saveHistory();
	};

	// --- Step forward ---
	const stepForward = () => {
		if (moveIndex.value >= moveSequenceInput.value.length) return;

		robots.value.forEach((r) => (r.collision = false));

		const moveChar = moveSequenceInput.value[moveIndex.value] ?? "";
		const robotIndex = moveIndex.value % numRobotsInput.value;
		const robot = robots.value[robotIndex];
		if (!robot) return;

		let newX = robot.x;
		let newY = robot.y;

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

		const collision = robots.value.some(
			(r) => r.id !== robot.id && r.x === newX && r.y === newY
		);

		if (!collision) {
			robot.x = newX;
			robot.y = newY;
			if (!(newX === 0 && newY === 0)) {
				const key = `${newX},${newY}`;
				houses.value.set(key, (houses.value.get(key) || 0) + 1);
			}
		} else {
			robot.collision = true;
		}

		moveIndex.value++;
		saveHistory();
		if (moveIndex.value >= moveSequenceInput.value.length) stopVisualization();
	};

	// --- Step back ---
	const stepBack = () => {
		if (moveIndex.value > 0) {
			history.pop();
			moveIndex.value--;
			const prevState = history[history.length - 1];
			if (prevState) {
				houses.value = new Map(prevState.houses);
				robots.value = prevState.robots.map((r) => ({ ...r }));
			}
		} else {
			resetSimulation();
		}
	};

	// --- Full run ---
	const runFullSimulation = () => {
		stopVisualization();
		isRunning.value = false;
		while (moveIndex.value < moveSequenceInput.value.length) stepForward();
	};

	// --- Watchers ---
	watch(stepsPerSecond, () => {
		if (isRunning.value) {
			stopVisualization();
			startVisualization();
		}
	});

	watch([numRobotsInput, moveSequenceInput], () => {
		if (!isRunning.value) resetSimulation();
	});

	// --- Computed outputs ---
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

		minX -= 1;
		minY -= 1;
		maxX += 1;
		maxY += 1;

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

	onMounted(resetSimulation);
	onUnmounted(stopVisualization);

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
