<template>
	<div>
		<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
			<el-tab-pane label="区域约束" name="region">约束区域</el-tab-pane>
			<el-tab-pane label="匹配源(必填)" name="source">源匹配(必填)</el-tab-pane>
			<el-tab-pane label="匹配预览源" name="preview">预览源匹配</el-tab-pane>
			<el-tab-pane label="描述匹配" name="description">描述匹配</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts" setup>
	import { ref } from "vue";
	import type { TabsPaneContext } from "element-plus";

	const activeName = ref("source");

	const handleClick = (tab: TabsPaneContext, event: Event) => {
		console.log(tab, event);
	};
</script>

<style lang="sass"></style>
