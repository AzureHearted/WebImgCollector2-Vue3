<template>
	<div class="gallery-container">
		<!-- 顶部工具栏 -->
		<GalleryToolbar />
		<!-- 瀑布流 -->
		<GalleryWaterfall />
	</div>
</template>

<script setup lang="ts">
	import GalleryToolbar from "./gallery-toolbar.vue";
	import GalleryWaterfall from "./gallery-waterfall.vue";
</script>

<style lang="less" scoped>
	// 画廊容器样式
	.gallery-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-flow: column;
		overflow: hidden;
	}
	:deep(input) {
		background: unset;
		box-shadow: unset;
	}
</style>
