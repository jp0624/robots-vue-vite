<template>
	<section class="panel map-panel" aria-labelledby="map-title">
		<header class="map-header">
			<h2 class="panel-heading" id="map-title">Delivery map</h2>
			<span>{{ houseGrid.maxX - houseGrid.minX + 1 }} × {{ houseGrid.rows.length }} blocks</span>
		</header>
		<div class="map-viewport" tabindex="0" role="region" aria-label="Scrollable map">
			<div class="map-grid">
				<div v-for="row in houseGrid.rows" :key="row[0]?.y" class="map-row">
					<GridTile v-for="tile in row" :key="tile.key" :tile="tile" />
				</div>
			</div>
		</div>
		<GridLegend />
	</section>
</template>

<script setup lang="ts">
	import GridTile from "./GridTile.vue";
	import GridLegend from "./GridLegend.vue";
	import type { HouseGrid } from "../types";

	defineProps<{ houseGrid: HouseGrid }>();
</script>
