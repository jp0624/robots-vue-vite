<template>
	<!--
		Main container for the world grid visualization.
		- Centers the grid horizontally and vertically using flexbox.
		- Ensures responsiveness.
	-->
	<div class="w-full flex items-center justify-center">
		<!--
			Grid wrapper:
			- Contains the entire house grid and robot overlay.
			- Ref is used to access the DOM element for potential measurements or scroll handling.
			- Styling: padding, border, shadow, rounded corners, max height with scroll.
		-->
		<div
			ref="gridContainer"
			class="p-4 border w-auto max-w-full inline-block border-gray-300 rounded-lg shadow-inner bg-gray-50 max-h-[75vh] overflow-auto relative"
		>
			<!--
				Render the house grid as a series of rows.
				- Iterates over houseGrid.rows, which is an array of arrays (2D grid).
				- Each row is a flex container to align tiles horizontally.
			-->
			<div
				v-for="row in houseGrid.rows"
				:key="`y-${row[0]?.y}`"
				class="flex flex-nowrap"
			>
				<!--
					Render each individual tile in the row using GridTile component.
					- Props passed:
						• x, y: tile coordinates
						• presents: number of presents at the tile
						• hasCollision: whether any robot at this tile has a collision
					- Computation of hasCollision uses optional chaining to handle undefined robotsPresent array.
				-->
				<GridTile
					v-for="tile in row"
					:key="tile.key"
					:x="tile.x"
					:y="tile.y"
					:presents="tile.presents"
					:hasCollision="tile.robotsPresent?.some((r) => r.collision) || false"
				/>
			</div>

			<!--
				Robot overlay container:
				- Positioned absolutely over the grid.
				- pointer-events-none on parent ensures underlying tiles are still interactable.
				- Robots themselves use pointer-events-auto to allow tooltip hover.
			-->
			<div class="absolute top-0 left-0 w-full h-full pointer-events-none">
				<div
					v-for="robot in robots"
					:key="robot.id"
					class="robot rounded-full border border-white shadow-lg absolute pointer-events-auto group"
					:class="robot.colorClass"
					:style="robotStyle(robot)"
					aria-hidden="false"
				>
					<!--
						Tooltip for each robot:
						- Hidden by default, becomes visible on hover via group-hover.
						- Displays robot name, coordinates, and collision warning if present.
						- Positioned above the robot using transform.
						- Accessible role="tooltip" for screen readers.
					-->
					<span
						class="robot-tooltip absolute -top-3 left-1/2 transform -translate-x-1/2 translate-y-[-100%] opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-opacity duration-200 text-xs whitespace-nowrap rounded px-2 py-1 z-50"
						role="tooltip"
					>
						<span class="font-medium block truncate max-w-[8rem] text-white">
							{{ robot.name }}
						</span>
						<span class="text-[0.7rem] text-gray-100 block">
							({{ robot.x }}, {{ robot.y }})
							<span v-if="robot.collision" class="text-red-200 ml-1">⚠</span>
						</span>
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import GridTile from "./GridTile.vue";
	import type { HouseGrid, Robot } from "../types";

	/*
		Props:
		- houseGrid: structured 2D array of tiles representing the world grid
		- robots: array of robots to render on top of the grid
		- tileSize: optional size of each grid tile in pixels (default 48px)
	*/
	const props = defineProps<{
		houseGrid: HouseGrid;
		robots: Robot[];
		tileSize?: number;
	}>();

	// Ref for the grid container DOM element for potential measurements or scroll handling
	const gridContainer = ref<HTMLElement | null>(null);

	// Use provided tileSize or default to 48px
	const tileSize = props.tileSize || 48;

	/*
		robotStyle function:
		- Computes inline styles to position each robot above the grid accurately.
		- left and top are calculated based on the robot's x/y coordinates relative to grid min/max.
		- Width/height fixed at 12px for consistent robot size.
		- Transition applied for smooth movement animation.
		- zIndex ensures robots appear above tiles.
	*/
	const robotStyle = (robot: Robot) => {
		const left = (robot.x - props.houseGrid.minX) * tileSize + tileSize / 2 - 6; // 6px offset for centering
		const top = (props.houseGrid.maxY - robot.y) * tileSize + tileSize / 2 - 6;
		return {
			width: "12px",
			height: "12px",
			top: "1em", // fallback positioning (overridden by transform)
			left: "1em", // fallback positioning (overridden by transform)
			transform: `translate(${left}px, ${top}px)`,
			transition: "transform 0.3s ease",
			zIndex: 50,
		};
	};
</script>

<style scoped>
	/* Base robot styling */
	.robot {
		position: absolute; /* position robots relative to parent overlay */
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 9999px; /* circular shape */
		width: 12px;
		height: 12px;
	}

	/* Tooltip styling for robot hover */
	.robot-tooltip {
		background: rgba(0, 0, 0, 0.75);
		color: white;
		padding: 0.25rem 0.5rem;
		border-radius: 0.375rem;
		pointer-events: none; /* ensures tooltips do not block hover or clicks */
		transform-origin: bottom center;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	/* Truncation for long robot names inside tooltips */
	.robot-tooltip .truncate {
		max-width: 8rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
