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
	import Form from "./pattern-edit-form-tabs.vue";
</script>

<style lang="scss" scoped>
	.rule-edit-container {
		display: flex;
		max-height: 100%;
		.rule-tree-container {
			width: 225px;
			padding: 4px;
			max-height: 100%;
			// background-color: skyblue;
		}
		.rule-form-container {
			flex: 1;
			padding: 4px;
			// background-color: orange;
		}
	}
</style>
