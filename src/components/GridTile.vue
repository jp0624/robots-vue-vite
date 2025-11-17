<template>
	<!-- 
    GRID TILE COMPONENT
    ----------------------------------------------------------------------------
    This component represents a single square (tile) in the world grid.

    Its responsibilities:
    - Display a background style depending on tile state (origin, collision,
      contains presents, or regular tile).
    - Render any presents located on this tile.
    - Render all robots currently occupying this tile.
    - Provide an inline tooltip for each robot on hover.

    Important:
    - The tile is purely presentational. It does not mutate application state.
    - All state is passed down as props from the grid engine.
    - This ensures a fully "unidirectional data flow", which is key in Vue and
      helps prevent synchronization issues.
  -->
	<div
		class="tile relative flex justify-center items-center border transition-colors duration-200 ease-out"
		:class="tileClasses" 
		<!-- tileClasses dynamically sets background/border based on tile state -->
	>
		<!-- 
      PRESENT BADGE
      ----------------------------------------------------------------------------
      If this tile contains presents (presents > 0), display a small badge in the
      top-right corner. 
      
      Notes:
      - We use v-if instead of v-show to avoid rendering unused DOM.
      - We use absolute positioning to ensure the badge appears "on top" without
        affecting tile layout.
    -->
		<span
			v-if="presents > 0"
			class="present-count text-yellow-800 bg-yellow-200 rounded-full h-4 w-4 flex items-center justify-center font-bold"
		>
			{{ presents }}
		</span>

		<!-- 
      ROBOT INSTANCES ON THIS TILE
      ----------------------------------------------------------------------------
      Multiple robots may be on a single tile at once (especially during
      collisions). We render each robot as a small colored dot.

      robotsPresent may be undefined when the tile is empty,
      so robotsPresent || [] avoids a runtime error.

      Each robot dot:
      - Is absolutely centered using CSS transform
      - Uses its assigned colorClass for identity
      - Adds a red ring when collision=true
      - Contains a tooltip that activates on hover via the "group" class
    -->
		<div
			v-for="robot in robotsPresent || []"
			:key="robot.id"
			class="absolute w-3 h-3 rounded-full flex items-center justify-center text-[0.5rem] text-white shadow-sm hover:scale-110 transition-transform duration-300 group"
			:class="[robot.colorClass, robot.collision ? 'ring-2 ring-red-500' : '']"
			:style="{
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)', 
        // translate(-50, -50) perfectly centers the robot dot
				zIndex: 10, // Ensures robots appear above grid/presents
			}"
		>
			<!-- 
        ROBOT TOOLTIP
        ----------------------------------------------------------------------------
        The tooltip shows:
        - Robot name
        - The tile coordinates the robot currently occupies
        - A warning icon if a collision occurred

        Tooltip behavior is CSS-only:
        - Hidden by default (opacity-0 + invisible)
        - Revealed when parent has hover state (via "group-hover")
        - pointer-events disabled to avoid flicker when hovering
        
        Positioned "bottom-5" above the robot dot for visual clarity.
      -->
			<span
				class="tooltip group-hover:opacity-100 group-hover:visible absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 invisible transition-opacity duration-300 z-20 whitespace-nowrap"
			>
				{{ robot.name }} ({{ x }},{{ y }})
				<span v-if="robot.collision" class="text-red-400 font-bold ml-1">
					⚠
				</span>
			</span>
		</div>
	</div>
</template>

<script setup lang="ts">
	// Vue's computed helper allows us to declare reactive derived state.
	import { computed } from "vue";

	/*
    PROPS DEFINITIONS
    ----------------------------------------------------------------------------
    Each tile receives:
      x, y          → grid coordinates
      presents      → number of presents on this tile
      hasCollision  → whether robots have collided on this tile
      robotsPresent → optional array of robots currently standing on this tile

    robotsPresent is optional because empty tiles often have no robots,
    and making this optional prevents unnecessary array allocations upstream.
  */
	const props = defineProps<{
		x: number;
		y: number;
		presents: number;
		hasCollision: boolean;
		robotsPresent?: Array<{
			id: number;
			name: string;
			colorClass: string;
			collision?: boolean; // optional: only present when robot is colliding
		}>;
	}>();

	/*
    isEvenSum
    ----------------------------------------------------------------------------
    Computed utility for rendering a classic checkerboard pattern on the grid.

    The formula (x + y) % 2 === 0 alternates background color by coordinate.
    - Even tiles → white
    - Odd tiles  → light-gray

    This improves readability and helps visually track robot movement.
  */
	const isEvenSum = computed(() => (props.x + props.y) % 2 === 0);

	/*
    tileClasses
    ----------------------------------------------------------------------------
    This computed block determines the visual styling for the tile based on a 
    priority system:

      Priority 1: Collision tile → flashing red
      Priority 2: Origin (0,0) → highlighted blue
      Priority 3: Present tile → soft yellow
      Priority 4: Normal tile → checkerboard background

    Using computed ensures:
    - Reactive updates when props change
    - No inline logic clutter in the template
    - Clean declarative styling logic
  */
	const tileClasses = computed(() => {
		const classes: string[] = [];

		const isOrigin = props.x === 0 && props.y === 0;

		if (props.hasCollision) {
			// Collision visualization: high contrast + animation
			classes.push("bg-red-400", "animate-pulse", "border-red-600");
		} else if (isOrigin) {
			// Special styling for the origin/start tile (0,0)
			classes.push("bg-blue-100", "border-2", "border-blue-500");
		} else if (props.presents > 0) {
			// Presents on this tile: yellow accent
			classes.push("bg-yellow-100", "border-yellow-300");
		} else {
			// Normal tile falls back to the checkerboard colors
			classes.push("border-gray-200");
			classes.push(isEvenSum.value ? "bg-white" : "bg-gray-100");
		}

		return classes;
	});
</script>

<style scoped>
	/* 
    TILE DIMENSIONS
    ----------------------------------------------------------------------------
    We explicitly size tiles to 3rem × 3rem to:
      - Guarantee uniform sizing
      - Avoid grid distortion
      - Ensure the grid scrolls smoothly in larger maps

    min-width/min-height keep tiles consistent across responsive scenarios.
  */
	.tile {
		width: 3rem;
		height: 3rem;
		min-width: 3rem;
		min-height: 3rem;
	}

	/*
    PRESENT BADGE POSITIONING
    ----------------------------------------------------------------------------
    Placed in the corner above robots, using a higher z-index so it never
    gets visually buried.
  */
	.present-count {
		position: absolute;
		top: 0.25rem;
		right: 0.25rem;
		font-size: 0.65rem;
		line-height: 1;
		z-index: 20;
	}

	/*
    TOOLTIP BEHAVIOR
    ----------------------------------------------------------------------------
    pointer-events: none prevents the tooltip from interfering with
    hover interactions, which eliminates flicker when hovering near the dot.
  */
	.tooltip {
		pointer-events: none;
	}
</style>
