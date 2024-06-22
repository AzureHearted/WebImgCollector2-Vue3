<template>
	<BaseDragDialog v-model:show="show" :init-percent-y="0.98" close-reset-state>
		<n-flex>
			<n-button type="error" size="medium" @click="show = false">
				<template #icon>
					<i-ep-close style="height: 100%; aspect-ratio: 1" />
				</template>
			</n-button>
		</n-flex>
	</BaseDragDialog>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import BaseDragDialog from "@/components/base/base-drag-dialog.vue";
	const show = defineModel("show", { type: Boolean, default: false });
</script>

<style lang="scss" scoped>
	* {
		box-sizing: border-box;
	}
</style>
