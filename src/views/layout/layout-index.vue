<template>
	<div
		class="layout-container"
		ref="layoutContainer"
		:class="{ open: globalStore.openWindow }"
		@wheel.stop.passive>
		<v-app class="layout-app-container">
			<v-layout>
				<!-- 应用栏 -->
				<v-app-bar :elevation="1" density="compact" height="50">
					<template v-slot:prepend>
						<v-app-bar-nav-icon
							density="compact"
							v-ripple
							@click="appBarIsCollapse = !appBarIsCollapse">
						</v-app-bar-nav-icon>
					</template>
					<v-app-bar-title>Web Img Collector 2</v-app-bar-title>
					<template v-slot:append>
						<v-btn
							color="red"
							density="compact"
							icon="$closeCircle"
							v-ripple
							@click="globalStore.openWindow = false">
						</v-btn>
					</template>
				</v-app-bar>
				<!-- 抽屉导航 -->
				<v-navigation-drawer
					temporary
					touchless
					width="fit-content"
					v-model="appBarIsCollapse">
					<v-list density="compact" nav>
						<v-list-item
							prepend-icon="$viewGallery"
							title="图库"
							value="Gallery"
							:to="{ name: 'Gallery' }"
							v-ripple></v-list-item>
						<v-list-item
							prepend-icon="$bookCog"
							title="方案管理"
							value="PatternEdit"
							:to="{ name: 'PatternEdit' }"
							v-ripple></v-list-item>
					</v-list>
				</v-navigation-drawer>
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
	import { ref, onMounted, watch, onUnmounted, onUpdated } from "vue";
	import { RouterView } from "vue-router";
	import useGlobalStore from "@/stores/global"; //导入全局仓库
	const globalStore = useGlobalStore();

	let layoutContainer = ref<HTMLElement | null>(null);

	let appBarIsCollapse = ref(false); // 应用栏是否折叠的标志位

	watch(
		() => globalStore.openWindow,
		(val) => {
			if (val) {
				layoutContainer.value?.focus();
			}
		}
	);

	// 导入Fancybox和相关配置
	import { Fancybox, configFancybox } from "@/plugin/fancyapps-ui";
	import type cardStore from "@/stores/cardStore";
	onMounted(() => {
		FancyboxBind(layoutContainer.value, "[data-fancybox]");
	});
	onUpdated(() => {
		Fancybox.unbind(layoutContainer.value);
		Fancybox.close();
		FancyboxBind(layoutContainer.value, "[data-fancybox]");
	});
	onUnmounted(() => {
		Fancybox.destroy();
	});

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

<style lang="less" scoped>
	// 布局容器样式
	.layout-container {
		position: absolute;
		width: 100%;
		height: 100%;
		top: -100%;

		background: rgba(255, 255, 255, 0.304);
		backdrop-filter: blur(10px);

		transition: top 0.5s ease-in-out;
		&.open {
			top: 0;
		}
	}

	.layout-app-container {
		background: unset;
		height: 100%;
	}
</style>
