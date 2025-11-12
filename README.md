# Robbie's Present Delivery Simulation

A Vue 3 + Vite application simulating robots delivering presents across a grid of houses. The app allows you to visualize robot movements, track deliveries, and view simulation stats in real-time.

- **Live Demo:** [https://robots-vue-vite.vercel.app/](https://robots-vue-vite.vercel.app/)
- **GitHub Repo:** [https://github.com/jp0624/robots-vue-vite](https://github.com/jp0624/robots-vue-vite/)

---

## Features

- Configurable number of robots.
- Customizable movement sequences (`^`, `V`, `<`, `>`).
- Step-by-step visualization or full simulation.
- Grid dynamically expands to include all visited tiles and robot positions.
- Tracks total presents delivered and unique houses visited.
- Robot collision detection.
- Color-coded robots for easy identification.
- Smooth and responsive UI with TailwindCSS.

---

## Components

### `WorldGrid.vue`

Displays the dynamic grid of houses and robot positions.  
Props:

- `houseGrid`: object containing grid rows and coordinates.
- `robots`: list of robots and their positions.

### `GridTile.vue`

Individual tile in the grid, shows number of presents and robots present.

### `SimulationControls.vue`

Holds all input controls for the simulation: number of robots, movement sequence, speed, and action buttons.

### `ControlInputs.vue`

Handles user input for:

- Number of robots.
- Movement sequence.

### `ActionButtons.vue`

Simulation action buttons:

- Start Visualization
- Stop Visualization
- Run Remainder
- Step Forward / Step Back
- Reset

### `SimulationStats.vue`

Displays simulation summary:

- Total presents delivered.
- Unique houses visited.
- Current simulation status and messages.

### `StatSummary.vue`

Used inside `SimulationStats.vue` to display totals and status messages with color-coded highlights.

### `RobotPositionList.vue`

Lists all robot positions with color-coded indicators.

### `GridLegend.vue`

Static legend showing meaning of colors and symbols on the grid.

---

## Types

- **Robot**

```ts
interface Robot {
	id: number;
	name: string;
	x: number;
	y: number;
	colorClass: string;
	collision?: boolean;
}
```

- **SimulationState**

```ts
interface SimulationState {
	houses: [string, number][];
	robots: Robot[];
	moveIndex: number;
}
```

---

## Installation

```bash
# Clone the repository
git clone https://github.com/jp0624/robots-vue-vite.git
cd robots-vue-vite

# Install dependencies
npm install

# Run the dev server
npm run dev
```

---

## Usage

1. Enter the number of robots.
2. Enter a movement sequence using `^`, `V`, `<`, `>`.
3. Set the simulation speed (steps per second).
4. Click **Start Viz** to visualize step-by-step.
5. Use **Step Forward** or **Step Back** for manual control.
6. Click **Run Remainder** to execute all remaining moves instantly.
7. Click **Reset** to restart the simulation.

---

## License

MIT License
