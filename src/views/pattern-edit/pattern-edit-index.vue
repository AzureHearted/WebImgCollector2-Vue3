<template>
	<div class="rule-edit-container">
		<!-- 规则侧栏 -->
		<aside class="rule-tree-container">
			<Tree />
		</aside>
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
		position: relative;
		display: flex;
		.rule-tree-container {
			position: sticky;
			top: 0;
			width: 225px;
			padding: 4px;
			height: 100%;
			// background-color: skyblue;
		}
		.rule-form-container {
			flex: 1;
			padding: 4px;
			// background-color: orange;
		}
	}

	:deep(input) {
		background: white;
		box-shadow: unset;
		color: #606266;
	}
</style>
