import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import type { HouseGrid, Robot, SimulationState, Tile } from "./types";
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
	const history = ref<SimulationState[]>([]);
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
		if (history.value.length >= MAX_HISTORY) history.value.shift();
		history.value.push({
			houses: Array.from(houses.value.entries()),
			robots: robots.value.map((r) => ({ ...r })),
			moveIndex: moveIndex.value,
		});
	};

	const canStepBack = computed(() => history.value.length > 1);

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
		if (!isRunning.value && robots.value.length && moveIndex.value < moveSequenceInput.value.length) {
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
		history.value.length = 0;

		const count = numRobotsInput.value;
		const validCount = Number.isInteger(count) && count >= 1 && count <= 100;
		const robotNames = getRobotNames(validCount ? count : 0);

		robots.value = robotNames.map((name, i) => ({
			id: i + 1,
			name,
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
		if (canStepBack.value && !isRunning.value) {
			history.value.pop();

			const prevState = history.value[history.value.length - 1];
			if (prevState) {
				moveIndex.value = prevState.moveIndex;
				houses.value = new Map(prevState.houses);
				robots.value = prevState.robots.map((r) => ({ ...r }));
			}
		}
	};

	// --- Full run ---
	const runFullSimulation = () => {
		stopVisualization();
		isRunning.value = false;
		while (robots.value.length && moveIndex.value < moveSequenceInput.value.length) stepForward();
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
		if (!robots.value.length) return "Enter a whole number of robots from 1 to 100.";
		if (totalMoves === 0) return "Enter a move sequence to start.";
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
		if (!robots.value.length || !totalMoves) return "";
		const currentTurn = Math.floor(moveIndex.value / numRobotsInput.value) + 1;
		const totalTurns = Math.ceil(totalMoves / numRobotsInput.value);

		if (moveIndex.value >= totalMoves)
			return `Simulation Ended: ${totalTurns} Turns Complete.`;
		return `Turn ${currentTurn} of ${totalTurns}: Move ${
			moveIndex.value + 1
		} of ${totalMoves}. Robot ${currentRobot?.id} to move.`;
	});

	const houseGrid = computed<HouseGrid>(() => {
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

		const robotsByTile = new Map<string, Robot[]>();
		for (const robot of robots.value) {
			const key = `${robot.x},${robot.y}`;
			const occupants = robotsByTile.get(key);
			if (occupants) occupants.push(robot);
			else robotsByTile.set(key, [robot]);
		}
		const rows: Tile[][] = [];
		for (let y = maxY; y >= minY; y--) {
			const row: Tile[] = [];
			for (let x = minX; x <= maxX; x++) {
				const key = `${x},${y}`;
				const presents = houses.value.get(key) || 0;
				const robotsPresent = robotsByTile.get(key) ?? [];
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
