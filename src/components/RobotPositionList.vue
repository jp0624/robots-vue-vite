<template>
	<div class="panel">
		<h3 class="panel-heading">
			Robot fleet
		</h3>

		<div class="fleet-list">
			<div
				v-for="robot in robotPositions"
				:key="robot.id"
				class="fleet-row"
			>
				<div class="flex items-center space-x-3">
					<div :class="['fleet-dot', robot.colorClass]"></div>
					<span class="fleet-name">{{ robot.name }}</span>
					<span class="text-xs text-gray-500">#{{ robot.id }}</span>
				</div>
				<span v-if="robot.collision" class="fleet-blocked">Blocked</span>
				<span class="fleet-coordinate">{{
					robot.position
				}}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { RobotPosition } from "../types";

	defineProps<{
		robotPositions: RobotPosition[];
	}>();
</script>
