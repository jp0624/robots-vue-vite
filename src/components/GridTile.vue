<template>
	<div class="map-tile" :class="{ depot: isDepot, delivered: tile.presents, collision: tile.robotsPresent.some(robot => robot.collision) }"
		:title="description">
		<span v-if="tile.presents" class="parcel-count">{{ tile.presents }}</span>
		<span v-if="isDepot" class="depot-label">DEPOT</span>
		<div v-if="tile.robotsPresent.length" class="map-robots">
			<span v-for="robot in tile.robotsPresent.slice(0, 3)" :key="robot.id" class="map-robot" :class="robot.colorClass">{{ robot.id }}</span>
			<span v-if="tile.robotsPresent.length > 3" class="map-robot overflow-count">+{{ tile.robotsPresent.length - 3 }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import type { Tile } from "../types";

	const props = defineProps<{ tile: Tile }>();
	const isDepot = computed(() => props.tile.x === 0 && props.tile.y === 0);
	const description = computed(() => {
		const { x, y, presents, robotsPresent } = props.tile;
		const robots = robotsPresent.map(robot => `${robot.name}${robot.collision ? " (blocked)" : ""}`);
		return [`(${x}, ${y})`, `${presents} presents`, ...robots].join(" · ");
	});
</script>
