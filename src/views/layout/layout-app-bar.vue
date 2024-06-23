<template>
	<div class="app-bar__container">
		<!--s 移动端的菜单按钮 -->
		<n-button
			v-if="isMobile()"
			circle
			:bordered="false"
			@click="navCollapse = !navCollapse">
			<template #icon>
				<i-ep-menu />
			</template>
		</n-button>
		<!--s 标题 -->
		<div class="app-bar__title">
			<n-gradient-text type="primary"> Web Img Collector 2 </n-gradient-text>
			<n-tag type="info" size="tiny" round :bordered="false">
				{{ VERSION }}
			</n-tag>
		</div>
		<!--s  关闭按钮 -->
		<n-button
			type="error"
			circle
			ghost
			:bordered="false"
			class="app-bar__close-button"
			@click="globalStore.openWindow = false">
			<template #icon>
				<i-ant-design-close-circle-filled />
			</template>
		</n-button>
	</div>
</template>

<script setup lang="ts">
	import { GM_info } from "$";
	import { storeToRefs } from "pinia";
	import useGlobalStore from "@/stores/GlobalStore"; //导入全局仓库
	import { isMobile } from "@/utils/common";
	const globalStore = useGlobalStore();
	const { navCollapse } = storeToRefs(globalStore);
	const VERSION = GM_info.script.version; // 导入版本号
</script>

<style lang="scss" scoped>
	@use "@/styles/shadow.scss" as shadow;

	.app-bar__container {
		display: flex;
		height: 34px;
		// padding: 0 4px;

		background: white;
		align-items: center;
		box-shadow: shadow.$elevation, inset 0 0 10px rgba(128, 128, 128, 0.6);
	}

	.layout-app-bar__menu-button {
		aspect-ratio: 1;
		margin-left: 6px;
		font-size: 20px;
		svg {
			color: black;
		}
	}

	.app-bar__title {
		margin-left: 16px;
		margin-right: auto;
		font-size: 20px;
		text-align: left;
	}

	.app-bar__close-button {
		aspect-ratio: 1;
		font-size: 24px;
		--n-icon-size: 24px;
	}
</style>
