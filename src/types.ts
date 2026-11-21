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
	collision?: boolean;
}

export interface Tile {
	x: number;
	y: number;
	key: string;
	presents: number;
	robotsPresent: Robot[];
	collision?: boolean;
}

export interface HouseGrid {
	rows: Tile[][];
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
}
