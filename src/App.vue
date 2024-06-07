<template>
	<!-- 脚本应用容器 -->
	<div :data-host="host" class="web-img-collector-container">
		<!-- 消息通知类信息容器 -->
		<el-config-provider namespace="el">
			<div class="web-img-collector-notification-container"></div>
		</el-config-provider>
		<!-- 内容区 -->
		<el-config-provider namespace="wic2">
			<!-- 路由出口 -->
			<!-- <RouterView /> -->
			<Layout />
			<!-- 悬浮按钮 -->
			<HoverButton :show="!globalStore.openWindow" :teleport-to="false" />
			<!-- 顶层元素的承载容器 -->
			<div ref="windowContainer" class="web-img-collector-top-container"></div>
		</el-config-provider>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted, defineAsyncComponent } from "vue";
	import { useGlobalStore, usePatternStore } from "@/stores";

	// 异步导入Layout组件
	const Layout = defineAsyncComponent(
		() => import("@/views/layout/layout-index.vue")
	);

	// 异步导入HoverButton组件
	const HoverButton = defineAsyncComponent(
		() => import("@/views/hover-button.vue")
	);

	const globalStore = useGlobalStore();
	const patternStore = usePatternStore();

	// 子窗口容器
	const windowContainer = ref<HTMLElement | null>(null);

	// 当前站点host
	const host = ref(location.host);

	onMounted(() => {
		// 配置信息获取
		patternStore.getUserPatternInfo(); //获取本地方案信息
		patternStore.setInitPattern(); // 获取初始方案
	});
</script>

<style lang="scss" scoped>
	// 布局容器(鼠标可以穿透，只用于划定组件的活动范围，不遮挡其他内容)
	.web-img-collector-container {
		box-sizing: border-box;
		position: fixed;
		overflow: hidden;
		width: unset;
		height: unset;
		inset: 0;
		background-color: transparent;
		// backdrop-filter: blur(4px);
		// 设置 z-index 为最大值
		z-index: 2147483646;
		// 仅让容器本身不响应鼠标事件
		pointer-events: none;

		:deep(*) {
			// 子元素默认还能响应
			pointer-events: auto;
		}

		body,
		div,
		h1,
		h2,
		h3,
		h4,
		h5,
		h6,
		p,
		ul,
		li,
		dd,
		dt {
			color: initial;
		}
	}

	//! 子窗口容器样式(主要作为弹窗的容器)
	.web-img-collector-top-container {
		position: absolute;
		inset: 0;
		// background: wheat;
		// 仅让容器本身不响应鼠标事件
		pointer-events: none;

		// 子元素默认还能响应
		:deep(*) {
			pointer-events: auto;
		}
	}
</style>

<style lang="scss">
	// 导入修复样式
	@import "./styles/website/index.scss";
</style>
