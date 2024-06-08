<template>
	<div class="test__container">
		<n-split
			direction="horizontal"
			:resize-trigger-size="12"
			:max="0.75"
			:min="0.25">
			<template #1>
				<OldTree />
			</template>
			<template #2>
				<PatternTree />
			</template>
			<template #resize-trigger>
				<div
					:style="{
						height: '100%',
						backgroundColor: '#409eff',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						borderRadius: '8px',
					}">
					<n-icon color="white" :size="12">
						<i-material-symbols-swap-horiz-rounded />
					</n-icon>
				</div>
			</template>
		</n-split>
	</div>
</template>

<script setup lang="ts">
	import OldTree from "@/views/pattern-edit/pattern-edit-tree.vue";
	import PatternTree from "@/views/pattern-edit/pattern-tree.vue";
</script>

<style lang="scss" scoped>
	.test__container {
		box-sizing: border-box;
		width: 100%;
		padding: 4px;
		// background: orange;
		display: flex;
		gap: 4px;

		& > * {
			box-sizing: border-box;
			flex: 1;
			// background: wheat;
		}
	}
</style>
