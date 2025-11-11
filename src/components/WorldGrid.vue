<template>
	<div
		class="inline-block p-4 border border-gray-300 rounded-lg shadow-inner bg-gray-50 max-h-[80vh] overflow-auto"
	>
		<div
			v-for="row in houseGrid.rows"
			:key="`y-${row[0].y}`"
			class="flex flex-nowrap"
		>
			<GridTile
				v-for="tile in row"
				:key="tile.key"
				:x="tile.x"
				:y="tile.y"
				:presents="tile.presents"
				:robots-present="tile.robotsPresent"
			/>
		</div>
	</div>
	<p class="mt-4 text-sm text-gray-500">
		Grid shows visited tiles and current robot locations. **Positive Y is up,
		Negative Y is down.** The grid dynamically expands to show all visited
		houses and robot positions, maintaining a center around (0,0).
	</p>
</template>

<script setup lang="ts">
	import GridTile from "./GridTile.vue";

	interface RobotPresence {
		id: number;
		colorClass: string; // e.g., 'bg-red-500'
	}

	interface Tile {
		x: number;
		y: number;
		key: string;
		presents: number;
		robotsPresent: RobotPresence[];
	}

	interface HouseGrid {
		rows: Tile[][];
		minX: number;
		minY: number;
		maxX: number;
		maxY: number;
	}

	defineProps<{
		houseGrid: HouseGrid;
	}>();
</script>
