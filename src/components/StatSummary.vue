<template>
	<section class="panel">
		<h2 class="panel-heading">Delivery report</h2>
		<dl class="delivery-metrics">
			<div><dt>Presents delivered</dt><dd>{{ totalPresents }}</dd></div>
			<div><dt>Houses visited</dt><dd>{{ uniqueHousesWithOnePresent }}</dd></div>
		</dl>
		<div class="delivery-status">
			<p>{{ simulationMessage }}</p>
			<p v-if="simulationStatus">{{ simulationStatus }}</p>
		</div>
	</section>
</template>

<script setup lang="ts">
	defineProps<{
		simulationMessage: string;
		simulationStatus: string;
		totalPresents: number;
		uniqueHousesWithOnePresent: number;
	}>();
</script>
