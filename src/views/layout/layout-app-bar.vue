<template>
	<div class="layout-app-bar">
		<!-- 菜单折叠按钮 -->
		<var-button
			class="layout-app-bar__menu-button"
			text
			round
			icon-container
			@click="appBarIsCollapse = !appBarIsCollapse">
			<i-ant-design-menu-outlined width="20" height="20" style="color: black" />
		</var-button>
		<!-- 标题 -->
		<div class="layout-app-bar__title">Web Img Collector 2</div>
		<var-button
			class="layout-app-bar__close-button"
			text
			round
			icon-container
			@click="globalStore.openWindow = false">
			<i-ant-design-close-circle-filled
				width="24"
				height="24"
				style="color: red" />
		</var-button>
	</div>
</template>

<script setup lang="ts">
	import { storeToRefs } from "pinia";
	import useGlobalStore from "@/stores/global"; //导入全局仓库
	const globalStore = useGlobalStore();
	const { appBarIsCollapse } = storeToRefs(globalStore);
</script>

<style lang="scss" scoped>
	@use "@/styles/shadow.scss" as shadow;

	.layout-app-bar {
		display: flex;
		height: 34px;
		// padding: 0 4px;

		background: white;
		align-items: center;
		box-shadow: shadow.$elevation;
	}

	.layout-app-bar__menu-button {
		aspect-ratio: 1;
		margin-left: 6px;
	}

	.layout-app-bar__title {
		margin-left: 16px;
		margin-right: auto;
		font-size: 20px;
		text-align: left;
	}

	.layout-app-bar__close-button {
		aspect-ratio: 1;
	}
</style>
