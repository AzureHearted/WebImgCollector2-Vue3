<template>
	<n-flex class="test__container" vertical :size="4">
		<!-- s 单行溢出列表测试 -->
		<TestLineOverflowList />
		<!-- s Tabs组件测试 -->
		<TestTabs />
		<BaseDock>
			<n-button type="primary" size="medium">按钮1</n-button>
			<n-button type="primary" size="medium">按钮1</n-button>
			<n-button type="primary" size="medium">按钮1</n-button>
		</BaseDock>
	</n-flex>
</template>

<script setup lang="ts">
	import TestLineOverflowList from "./test-line-overflow-list.vue";
	import TestTabs from "./test-tabs.vue";
	import BaseDock from "@/components/base/base-dock.vue";
</script>

<style lang="scss" scoped>
	.test__container {
		position: relative;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		padding: 4px;
		// overflow: hidden;
	}
</style>
