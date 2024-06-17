<template>
	<div
		class="layout-container"
		ref="containerDOM"
		@scroll.stop
		@wheel.stop
		@keydown.stop
		@keypress.stop
		@keyup.stop
		:class="{ open: globalStore.openWindow }">
		<AppBar class="layout-app-bar" />
		<Main class="layout-main" />
	</div>
</template>

<script setup lang="ts">
	import { ref, watch, onMounted, onUpdated, onUnmounted } from "vue";

	import useGlobalStore from "@/stores/GlobalStore"; //导入全局仓库
	const globalStore = useGlobalStore();

	// 导入组件
	import AppBar from "./layout-app-bar.vue";
	import Main from "./layout-main.vue";

	let containerDOM = ref<HTMLElement | null>(null);

	watch(
		() => globalStore.openWindow,
		(isOpen) => {
			if (isOpen) {
				// 每当窗口打开后都自动聚焦到该容器
				containerDOM.value?.focus();
				// 页面滚动元素进行滚动
			} else {
				// 取消页面元素的滚动阻止事件
			}
		}
	);

	//* 导入Fancybox和相关配置
	import { Fancybox, configFancybox } from "@/plugin/fancyapps-ui";
	// onMounted(() => {
	// 	FancyboxBind(containerDOM.value, "[data-fancybox]");
	// });
	// onUpdated(() => {
	// 	Fancybox.unbind(containerDOM.value);
	// 	Fancybox.close();
	// 	FancyboxBind(containerDOM.value, "[data-fancybox]");
	// });
	// onUnmounted(() => {
	// 	Fancybox.destroy();
	// });

	//f 执行FancyBox绑定
	// function FancyboxBind(
	// 	listContainerDOM: HTMLElement | null,
	// 	itemSelector: string = "[data-fancybox]",
	// 	teleportToDOMs?: HTMLElement
	// ) {
	// 	Fancybox.bind(listContainerDOM, itemSelector, {
	// 		...configFancybox,
	// 		parentEl: teleportToDOMs ? teleportToDOMs : listContainerDOM,
	// 		hideScrollbar: false,
	// 	});
	// }
</script>

<style lang="scss" scoped>
	// 布局容器样式
	.layout-container {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		flex-flow: column nowrap;
		border: unset;

		background: rgba(255, 255, 255, 0.3);
		backdrop-filter: blur(10px);

		transition: top 0.5s ease-in-out;

		// 未打开时的样式
		top: -100%;
		// 打开时的样式
		&.open {
			top: 0;
		}
	}
	.layout-app-bar {
		flex: 0 0;
	}
	.layout-main {
		flex: auto; // 设置为auto用于自动占满剩余空间
		overflow: auto; // 设置hidden用于确保内容溢出可以隐藏
	}
</style>
