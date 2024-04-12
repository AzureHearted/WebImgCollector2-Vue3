<template>
	<div
		class="layout-container"
		ref="layoutContainer"
		:class="{ open: globalStore.openWindow }"
		@wheel.stop.passive>
		<v-app class="layout-app-container">
			<v-layout>
				<!-- 应用栏 -->
				<v-app-bar
					:elevation="2"
					density="compact"
					height="50"
					:collapse="appBarIsCollapse">
					<template v-slot:prepend>
						<v-app-bar-nav-icon
							density="compact"
							v-ripple
							@click="appBarIsCollapse = !appBarIsCollapse">
							<var-icon name="menu" />
						</v-app-bar-nav-icon>
					</template>
					<v-app-bar-title>图片收集器</v-app-bar-title>
				</v-app-bar>
				<!-- 抽屉导航 -->
				<!-- <v-navigation-drawer> 抽屉导航 </v-navigation-drawer> -->
				<!-- 内容区 -->
				<v-main>
					<!-- 容器 -->
					<RouterView />
				</v-main>
			</v-layout>
		</v-app>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import { RouterView } from "vue-router";
	import useGlobalStore from "@/stores/global"; //导入全局仓库
	const globalStore = useGlobalStore();

	let layoutContainer = ref<HTMLElement | null>(null);

	let appBarIsCollapse = ref(true); // 应用栏是否折叠的标志位

	// 导入Fancybox和相关配置
	import { Fancybox, configFancybox } from "@/plugin/fancyapps-ui";
	onMounted(() => {
		Fancybox.bind(layoutContainer.value, "[data-fancybox]", {
			...configFancybox,
			parentEl: layoutContainer.value, // 设置Fancybox的父容器为layoutContainer
		}); // 绑定Fancybox到指定的元素上
	});

	// console.log(globalStore.openWindow);
</script>

<style lang="less" scoped>
	// 布局容器样式
	.layout-container {
		position: absolute;
		background: rgba(255, 255, 255, 0.304);
		width: 100%;
		height: 100%;
		left: -100%;

		backdrop-filter: blur(10px);
		transition: 0.3s;

		&.open {
			left: 0;
		}
	}

	.layout-app-container {
		background: transparent;
		height: 100%;
	}
</style>
