<template>
	<div
		class="tile relative flex justify-center items-center border transition-colors duration-200 ease-out"
		:class="tileClasses"
	>
		<!-- Presents -->
		<span
			v-if="presents > 0"
			class="present-count text-yellow-800 bg-yellow-200 rounded-full h-4 w-4 flex items-center justify-center font-bold"
		>
			{{ presents }}
		</span>

		<!-- Robots with tooltip -->
		<div
			v-for="robot in robotsPresent"
			:key="robot.id"
			class="absolute w-3 h-3 rounded-full flex items-center justify-center text-[0.5rem] text-white shadow-sm hover:scale-110 transition-transform duration-300 group"
			:class="[robot.colorClass, robot.collision ? 'ring-2 ring-red-500' : '']"
			:style="{
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				zIndex: 10,
			}"
		>
			<!-- Tooltip -->
			<span
				class="tooltip group-hover:opacity-100 group-hover:visible absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 invisible transition-opacity duration-300 z-20 whitespace-nowrap"
			>
				{{ robot.name }} ({{ x }},{{ y }})
				<span v-if="robot.collision" class="text-red-400 font-bold ml-1"
					>⚠</span
				>
			</span>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";

	const props = defineProps<{
		x: number;
		y: number;
		presents: number;
		hasCollision: boolean;
		robotsPresent: Array<{
			id: number;
			name: string;
			colorClass: string;
			collision?: boolean;
		}>;
	}>();

	const isEvenSum = computed(() => (props.x + props.y) % 2 === 0);

	const tileClasses = computed(() => {
		const classes: string[] = [];

		const isOrigin = props.x === 0 && props.y === 0;

		if (props.hasCollision) {
			classes.push("bg-red-400", "animate-pulse", "border-red-600");
		} else if (isOrigin) {
			classes.push("bg-blue-100", "border-2", "border-blue-500");
		} else if (props.presents > 0) {
			classes.push("bg-yellow-100", "border-yellow-300");
		} else {
			classes.push("border-gray-200");
			classes.push(isEvenSum.value ? "bg-white" : "bg-gray-100");
		}

		return classes;
	});
</script>

<style scoped>
	.tile {
		width: 3rem;
		height: 3rem;
		min-width: 3rem;
		min-height: 3rem;
	}

	.present-count {
		position: absolute;
		top: 0.25rem;
		right: 0.25rem;
		font-size: 0.65rem;
		line-height: 1;
		z-index: 20;
	}

	.tooltip {
		pointer-events: none;
	}
</style>
