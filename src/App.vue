<template>
	<!-- 脚本应用容器 -->
	<div ref="appContainer" class="online-gallery-container">
		<!-- 路由出口 -->
		<RouterView />
		<!-- 悬浮按钮 -->
		<HoverButton :teleport-to="false" />
		<!-- 顶层元素的承载容器 -->
		<div ref="windowContainer" class="online-gallery-top-container"></div>
	</div>
</template>

<script setup lang="ts">
	import { ref, defineAsyncComponent, onMounted } from "vue";
	import { RouterView } from "vue-router";
	import { useGlobalStore } from "@/stores";
	import { GM_getValue } from "$";

	console.log("获取油猴配置", GM_getValue("ruleList"));

	const globalStore = useGlobalStore();
	// globalStore.visibleScrollbar(false);

	const appContainer = ref<HTMLElement | null>(null);
	const windowContainer = ref<HTMLElement | null>(null);

	// 异步导入HoverButton组件
	const HoverButton = defineAsyncComponent(
		() => import("@/components/hover-button.vue")
	);
</script>

<style lang="less" scoped>
	// 布局容器(鼠标可以穿透，只用于划定组件的活动范围，不遮挡其他内容)
	.online-gallery-container {
		box-sizing: border-box;
		position: fixed !important;
		overflow: hidden;
		width: unset;
		height: unset;
		inset: 0;
		background-color: transparent;
		// backdrop-filter: blur(4px);
		// 设置 z-index 为最大值
		// z-index: 2147483647;
		z-index: 1050;
		// 仅仅让容器本身不响应鼠标事件
		pointer-events: none;

		// 子元素默认还能响应
		:deep(*) {
			pointer-events: auto;
		}
	}

	//! 子窗口容器样式(主要作为弹窗的容器)
	.online-gallery-top-container {
		position: fixed !important;
		inset: 0;
		// background: wheat;
		// 仅仅让容器本身不响应鼠标事件
		pointer-events: none;

		// 子元素默认还能响应
		:deep(*) {
			pointer-events: auto;
		}
	}
	:deep(*) {
		margin: unset;
		padding: unset;
		border-radius: unset;
		border: unset;
		font-size: unset;
		color: unset;
		border: unset;
		box-shadow: unset;
		min-width: unset;
		min-height: unset;
	}
	:deep(.v-slider) input {
		display: unset;
		background: unset;
		border: unset;
		box-shadow: unset;
		margin: unset;
		padding: unset;
		border-radius: unset;
		border: unset;
		font-size: unset;
		color: unset;
	}
</style>
