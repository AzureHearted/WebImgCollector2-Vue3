<template>
	<!-- 脚本应用容器 -->
	<div ref="appContainer" class="web-img-collector-container">
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
	import { ref, defineAsyncComponent } from "vue";
	import { useGlobalStore } from "@/stores";
	// import Layout from "./views/layout/layout-index.vue";
	const Layout = defineAsyncComponent(
		() => import("@/views/layout/layout-index.vue")
	);

	// console.log("油猴信息：", GM_info);

	const globalStore = useGlobalStore();
	// globalStore.visibleScrollbar(false);

	const appContainer = ref<HTMLElement | null>(null);
	const windowContainer = ref<HTMLElement | null>(null);

	// 异步导入HoverButton组件
	const HoverButton = defineAsyncComponent(
		() => import("@/views/hover-button.vue")
	);
</script>

<style lang="less" scoped>
	// 布局容器(鼠标可以穿透，只用于划定组件的活动范围，不遮挡其他内容)
	.web-img-collector-container {
		box-sizing: border-box;
		position: fixed !important;
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

		:deep(*) {
			// 子元素默认还能响应
			pointer-events: auto;
			// margin: unset;
			// padding: unset;
			// border-radius: unset;
			// border: unset;
			// font-size: unset;
			// color: auto;
			// border: unset;
			// box-shadow: unset;
			&.layout-container *[class^="var-"] {
				margin: unset;
			}

			&[class^="v-"] {
				color: initial;
			}
			&[class^="v-"] > input {
				border: unset;
			}

			&[class^="v-"] > header.v-toolbar.v-theme--light {
				height: unset;
				background: white;
			}

			&[class^="v-input"] {
				margin-inline-end: unset;
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
				color: unset;
			}
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
