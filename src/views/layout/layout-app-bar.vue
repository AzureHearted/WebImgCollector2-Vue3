<template>
	<div class="layout-app-bar">
		<!-- 标题 -->
		<div class="layout-app-bar__title">Web Img Collector 2</div>
		<el-button
			class="layout-app-bar__close-button"
			type="danger"
			text
			circle
			v-ripple
			@click="globalStore.openWindow = false">
			<template #icon>
				<i-ant-design-close-circle-filled />
			</template>
		</el-button>
	</div>
</template>

<script setup lang="ts">
	import { storeToRefs } from "pinia";
	import useGlobalStore from "@/stores/global"; //导入全局仓库
	const globalStore = useGlobalStore();
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
		font-size: 20px;
		svg {
			color: black;
		}
	}

	.layout-app-bar__title {
		margin-left: 16px;
		margin-right: auto;
		font-size: 20px;
		text-align: left;
	}

	.layout-app-bar__close-button {
		aspect-ratio: 1;
		font-size: 24px;
	}
</style>
