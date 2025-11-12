<template>
	<div class="w-full flex items-center justify-center">
		<div
			ref="gridContainer"
			class="p-4 border w-auto max-w-full inline-block border-gray-300 rounded-lg shadow-inner bg-gray-50 max-h-[75vh] overflow-auto relative"
		>
			<!-- Tiles -->
			<div
				v-for="row in houseGrid.rows"
				:key="`y-${row[0]?.y}`"
				class="flex flex-nowrap"
			>
				<GridTile
					v-for="tile in row"
					:key="tile.key"
					:x="tile.x"
					:y="tile.y"
					:presents="tile.presents"
					:hasCollision="tile.robotsPresent?.some((r) => r.collision) || false"
				/>
			</div>

			<!-- Robot overlay -->
			<div class="absolute top-0 left-0 w-full h-full pointer-events-none">
				<div
					v-for="robot in robots"
					:key="robot.id"
					class="robot rounded-full border border-white shadow-lg absolute pointer-events-auto group"
					:class="robot.colorClass"
					:style="robotStyle(robot)"
					aria-hidden="false"
				>
					<!-- Tooltip -->
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

	const props = defineProps<{
		houseGrid: HouseGrid;
		robots: Robot[];
		tileSize?: number;
	}>();

	const gridContainer = ref<HTMLElement | null>(null);
	const tileSize = props.tileSize || 48;

	const robotStyle = (robot: Robot) => {
		const left = (robot.x - props.houseGrid.minX) * tileSize + tileSize / 2 - 6; // 12px robot
		const top = (props.houseGrid.maxY - robot.y) * tileSize + tileSize / 2 - 6;
		return {
			width: "12px",
			height: "12px",
			top: "1em",
			left: "1em",
			transform: `translate(${left}px, ${top}px)`,
			transition: "transform 0.3s ease",
			zIndex: 50,
		};
	};
</script>

<style scoped>
	.robot {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 9999px;
		width: 12px;
		height: 12px;
	}

	.robot-tooltip {
		background: rgba(0, 0, 0, 0.75);
		color: white;
		padding: 0.25rem 0.5rem;
		border-radius: 0.375rem;
		pointer-events: none;
		transform-origin: bottom center;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.robot-tooltip .truncate {
		max-width: 8rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
