<template>
	<div class="rule-edit-container">
		<!-- 规则侧栏 -->
		<aside class="rule-tree-container">
			<Tree />
		</aside>
		<!-- 规则表单 -->
		<main class="rule-form-container">
			<BaseScrollbar>
				<Form />
			</BaseScrollbar>
		</main>
	</div>
</template>

<script setup lang="ts">
	import Tree from "./pattern-edit-tree.vue";
	import Form from "./pattern-edit-form.vue";
	import BaseScrollbar from "@/components/base/base-scrollbar.vue";
</script>

<style lang="scss" scoped>
	.rule-edit-container {
		box-sizing: border-box;
		position: relative;
		display: flex;
		flex-flow: row nowrap;
		gap: 8px;
		height: 100%;
		padding: 4px;
		overflow-y: hidden;
		overflow-x: auto;

		.rule-tree-container {
			position: relative;
			flex: 0 0 225px;
			// padding: 4px;
			height: 100%;

			// background-color: wheat;
			// border-radius: 4px;
			overflow: hidden;

			z-index: 1;
		}

		.rule-form-container {
			flex: auto;
			// background-color: orange;
			min-width: 425px;
			max-width: 800px;

			height: 100%;
			overflow: auto;
			// padding: 4px;
		}
	}

	:deep(input) {
		background: white;
		box-shadow: unset;
		color: #606266;
	}
</style>
