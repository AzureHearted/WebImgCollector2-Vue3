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
						</v-app-bar-nav-icon>
					</template>
					<v-app-bar-title>图片收集器</v-app-bar-title>
					<template v-slot:append>
						<v-btn density="compact" icon :ripple="false" v-ripple>
							<IconMoreVertical style="width: 24px" />
						</v-btn>
					</template>
				</v-app-bar>
				<!-- 抽屉导航 -->
				<!-- <v-navigation-drawer  > 抽屉导航 </v-navigation-drawer> -->
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
	import { ref, onMounted, watch, onBeforeMount, nextTick } from "vue";
	import { RouterView } from "vue-router";
	import useGlobalStore from "@/stores/global"; //导入全局仓库
	const globalStore = useGlobalStore();

	import IconMenu from "@svg/menu.svg";
	import IconMoreVertical from "@svg/more-vertical.svg";

	let layoutContainer = ref<HTMLElement | null>(null);

	let appBarIsCollapse = ref(true); // 应用栏是否折叠的标志位

	watch(
		() => globalStore.openWindow,
		(val) => {
			if (val) {
				layoutContainer.value?.focus();
			}
		}
	);

	// console.log(globalStore.openWindow);
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
