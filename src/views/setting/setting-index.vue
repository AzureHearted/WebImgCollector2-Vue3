<template>
	<div class="setting__container">
		<Scrollbar>
			<StyleSheetManage />
		</Scrollbar>
	</div>
</template>

<script setup lang="ts">
	import Scrollbar from "@/components/base/base-scrollbar.vue";
	import StyleSheetManage from "@/components/style-sheet-manage.vue";
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
