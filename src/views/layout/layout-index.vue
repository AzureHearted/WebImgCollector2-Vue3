<template>
	<section
		class="layout-container"
		ref="containerDOM"
		:class="{ open: globalStore.openWindow }"
		@wheel.stop.passive>
		<AppBar class="layout-app-bar" />
		<Main class="layout-main" />
		<Menu />
	</section>
</template>

<script setup lang="ts">
	import { ref, onMounted, watch, onUnmounted, onUpdated } from "vue";

	import useGlobalStore from "@/stores/global"; //导入全局仓库
	const globalStore = useGlobalStore();

	// 导入组件
	import AppBar from "./layout-app-bar.vue";
	import Main from "./layout-main.vue";
	import Menu from "./layout-menu.vue";

	let containerDOM = ref<HTMLElement | null>(null);

	watch(
		() => globalStore.openWindow,
		(val) => {
			if (val) {
				// 每当窗口打开后都自动聚焦到该容器
				containerDOM.value?.focus();
			}
		}
	);

	// 导入Fancybox和相关配置
	import { Fancybox, configFancybox } from "@/plugin/fancyapps-ui";
	onMounted(() => {
		FancyboxBind(containerDOM.value, "[data-fancybox]");
	});
	onUpdated(() => {
		Fancybox.unbind(containerDOM.value);
		Fancybox.close();
		FancyboxBind(containerDOM.value, "[data-fancybox]");
	});
	onUnmounted(() => {
		Fancybox.destroy();
	});

	// 执行FancyBox绑定
	function FancyboxBind(
		listContainerDOM: HTMLElement | null,
		itemSelector: string = "[data-fancybox]",
		teleportToDOMs?: HTMLElement
	) {
		Fancybox.bind(listContainerDOM, itemSelector, {
			...configFancybox,
			parentEl: teleportToDOMs ? teleportToDOMs : listContainerDOM,
		});
	}
</script>

<style lang="scss" scoped>
	// 布局容器样式
	.layout-container {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		flex-flow: column nowrap;

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
