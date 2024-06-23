<template>
	<div class="setting__container">
		<Scrollbar>
			<StyleSheetManage />
		</Scrollbar>
	</div>
</template>

<script setup lang="ts">
	// 等待实现:需要对设置页面进行二级菜单分类
	import Scrollbar from "@/components/base/base-scrollbar.vue";
	import StyleSheetManage from "@/views/setting/setting-style-sheet-manage.vue";
	// import { onMounted } from "vue";
	// onMounted(() => {
	// 	console.log("设置页面挂载！");
	// });
</script>

<style lang="scss" scoped>
	.setting__container {
		position: relative;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		padding: 4px;
		// overflow: hidden;
		display: flex;
		flex-flow: column;
	}
</style>
