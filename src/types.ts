// --- Robot Interface ---
// Represents a single robot in the simulation
export interface Robot {
	id: number; // Unique identifier for the robot
	name: string; // Robot's display name
	x: number; // Current X-coordinate on the grid
	y: number; // Current Y-coordinate on the grid
	colorClass: string; // Tailwind CSS class for robot color
	collision?: boolean; // Optional flag indicating if the robot collided in the last move
}

// --- SimulationState Interface ---
// Represents a snapshot of the simulation at a specific point in time
export interface SimulationState {
	houses: [string, number][]; // Array of house entries: [key = "x,y", number of presents]
	robots: Robot[]; // Array of robots and their current state
	moveIndex: number; // Index of the move executed up to this snapshot
}

// --- RobotPosition Interface ---
// Used for displaying robot positions in the UI or summary
export interface RobotPosition {
	id: number; // Robot ID
	name: string; // Robot display name
	position: string; // Formatted position string e.g., "(x,y)"
	colorClass?: string; // Optional CSS class for robot color
}

// --- Tile Interface ---
// Represents a single cell/tile in the simulation grid
export interface Tile {
	x: number; // X-coordinate of the tile
	y: number; // Y-coordinate of the tile
	key: string; // Unique key for the tile e.g., "x,y"
	presents: number; // Number of presents delivered to this tile
	robotsPresent: RobotPresence[]; // Array of robots currently on this tile
	collision?: boolean; // Optional flag indicating a collision occurred here
}

// --- RobotPresence Interface ---
// Represents a robot's presence on a specific tile
export interface RobotPresence {
	id: number; // Robot ID
	colorClass: string; // Tailwind CSS class for robot color
	collision?: boolean; // Optional collision flag for this robot on this tile
}

// --- HouseGrid Interface ---
// Represents the full grid of tiles used for rendering the simulation
export interface HouseGrid {
	rows: Tile[][]; // 2D array of Tile objects for rendering rows and columns
	minX: number; // Minimum X-coordinate in the grid (used for dynamic sizing)
	minY: number; // Minimum Y-coordinate in the grid
	maxX: number; // Maximum X-coordinate in the grid
	maxY: number; // Maximum Y-coordinate in the grid
}
