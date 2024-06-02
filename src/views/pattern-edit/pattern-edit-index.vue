<template>
	<div class="rule-edit-container">
		<!-- 规则侧栏 -->
		<!-- <aside class="rule-tree-container">
			
		</aside> -->
		<el-card class="rule-tree-container">
			<Tree />
		</el-card>
		<!-- 规则表单 -->
		<main class="rule-form-container">
			<Form />
		</main>
	</div>
</template>

<script setup lang="ts">
	import Tree from "./pattern-edit-tree.vue";
	import Form from "./pattern-edit-form.vue";
</script>

<style lang="scss" scoped>
	.rule-edit-container {
		display: flex;
		flex-flow: row wrap;
		gap: 8px;
		height: 100%;
		padding: 4px;
		.rule-tree-container {
			width: 225px;
			// padding: 4px;
			height: 100%;
			// max-height: 100%;

			z-index: 1;

			:deep(.wic2-card__body) {
				padding: 4px;
				height: 100%;
			}
		}
		.rule-form-container {
			flex: 1;
			// background-color: orange;
			min-width: 425px;
		}
	}

	:deep(input) {
		background: white;
		box-shadow: unset;
		color: #606266;
	}
</style>
