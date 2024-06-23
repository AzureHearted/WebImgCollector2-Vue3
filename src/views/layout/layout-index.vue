<template>
	<div
		class="layout__container"
		ref="containerDOM"
		:class="{ open: globalStore.openWindow }">
		<AppBar class="layout__app-bar" />
		<Main class="layout__main" />
	</div>
</template>

<script setup lang="ts">
	import { ref, watch, onMounted } from "vue";
	import { useDisableScroll } from "@/utils/disable-scroll";

	import useGlobalStore from "@/stores/GlobalStore"; //导入全局仓库
	const globalStore = useGlobalStore();

	// 导入组件
	import AppBar from "./layout-app-bar.vue";
	import Main from "./layout-main.vue";

	let containerDOM = ref<HTMLElement>();

	onMounted(() => {
		const { start, stop } = useDisableScroll(document.documentElement);
		watch(
			() => globalStore.openWindow,
			(isOpen) => {
				if (!containerDOM.value) return;
				if (isOpen) {
					// 每当窗口打开后都自动聚焦到该容器
					containerDOM.value.focus();
					// containerDOM.value.showModal();
					//s 页面滚动元素进行滚动
					start();
				} else {
					//s 取消页面元素的滚动阻止事件
					stop();
					// containerDOM.value.close();
				}
			}
		);
	});
</script>

<style lang="scss" scoped>
	// 布局容器样式
	.layout__container {
		position: absolute;
		width: 100%;
		height: 100%;
		margin: unset !important;
		padding: unset !important;
		border: unset !important;
		outline: unset;

		display: flex;
		flex-flow: column nowrap;

		overflow: hidden;

		background: rgba(255, 255, 255, 0.3);
		backdrop-filter: blur(10px);

		transition: top 0.5s ease-in-out;
		top: 0;

		// 未打开时的样式
		top: -100%;
		// 打开时的样式
		&.open {
			top: 0;
		}
	}
	// .layout__app-bar {
	// 	flex: 0 0;
	// }
	.layout__main {
		flex: auto; // 设置为auto用于自动占满剩余空间
		overflow: auto; // 设置hidden用于确保内容溢出可以隐藏
		display: flex;
	}
</style>
