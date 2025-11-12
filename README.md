# Robbie's Present Delivery Simulation

A Vue 3 + Vite application that simulates robot delivery of presents across a grid of houses.  
View the live demo here: [https://robots-vue-vite.vercel.app/](https://robots-vue-vite.vercel.app/)

---

## Table of Contents

- [Features](#features)
- [Components](#components)
- [Types](#types)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

---

## Features

- Simulate multiple robots delivering presents on a dynamic grid.
- Supports step-by-step visualization, full run, and reset.
- Tracks robot positions, collisions, and house visit counts.
- Live statistics of total presents delivered and unique houses visited.
- Smooth UI with TailwindCSS styling and responsive layout.

---

## Components

### WorldGrid.vue

Renders the grid of houses and robot positions.

### GridTile.vue

Represents a single tile on the grid (house/empty/robot overlay).

### SimulationControls.vue

Main controls for starting, stopping, stepping, and running the simulation.

### ControlInputs.vue

Inputs for number of robots and movement sequence.

### ActionButtons.vue

Buttons to start visualization, step forward/back, run remainder, or reset simulation.

### SimulationStats.vue

Shows overall simulation summary and key statistics.

### RobotPositionList.vue

Displays the positions of all robots.

### GridLegend.vue

Displays the key/legend for the grid, including color codes and icons.

### StatSummary.vue

Displays simulation messages, status, total presents delivered, and unique houses visited.

---

## Types

Defined in `src/types.ts`:

```ts
export interface Robot {
	id: number;
	name: string;
	x: number;
	y: number;
	colorClass: string;
	collision?: boolean;
}

export interface SimulationState {
	houses: [string, number][];
	robots: Robot[];
	moveIndex: number;
}

export interface RobotPosition {
	id: number;
	name: string;
	position: string;
	colorClass?: string;
}

export interface Tile {
	x: number;
	y: number;
	key: string;
	presents: number;
	robotsPresent: RobotPresence[];
	collision?: boolean;
}

export interface RobotPresence {
	id: number;
	colorClass: string;
	collision?: boolean;
}

export interface HouseGrid {
	rows: Tile[][];
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
}
```

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/jp0624/robots-vue-vite.git
cd robots-vue-vite
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

5. Preview the production build:

```bash
npm run preview
```

---

## Usage

- **Number of Robots (N):** Set the number of robots delivering presents.
- **Movement Sequence (^V<>):** Enter the movement sequence for the robots using `^` (up), `V` (down), `<` (left), `>` (right).
- **Start Viz:** Starts step-by-step visualization from the beginning.
- **Run Remainder:** Completes the remaining moves in the sequence.
- **Step Forward / Step Back:** Navigate through moves one at a time.
- **Reset:** Reset simulation and grid state.

Robots are color-coded and collisions are highlighted. The grid expands dynamically to show all visited houses.

---

## Repository

GitHub: [https://github.com/jp0624/robots-vue-vite](https://github.com/jp0624/robots-vue-vite)

Live demo: [https://robots-vue-vite.vercel.app/](https://robots-vue-vite.vercel.app/)

---

## License

MIT License
