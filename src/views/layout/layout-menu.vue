<template>
	<el-drawer
		class="layout-menu-container"
		size="fit-content"
		direction="ltr"
		:show-close="false"
		:with-header="false"
		v-model="appBarIsCollapse">
		<el-menu :default-active="globalStore.tab">
			<el-menu-item
				index="Gallery"
				@click="globalStore.tab = 'Gallery'"
				v-ripple>
				<el-icon>
					<i-material-symbols-gallery-thumbnail />
				</el-icon>
				<span>图库</span>
			</el-menu-item>
			<el-menu-item
				index="PatternEdit"
				@click="globalStore.tab = 'PatternEdit'"
				v-ripple>
				<el-icon>
					<i-material-symbols-box-edit />
				</el-icon>
				<span>方案管理</span>
			</el-menu-item>
			<el-menu-item index="Test" @click="globalStore.tab = 'Test'" v-ripple>
				<el-icon>
					<i-material-symbols-experiment-outline />
				</el-icon>
				<span>测试页面</span>
			</el-menu-item>
		</el-menu>
	</el-drawer>
</template>

<script lang="ts" setup>
	import { storeToRefs } from "pinia";
	import useGlobalStore from "@/stores/global"; //导入全局仓库

	const globalStore = useGlobalStore();
	const { appBarIsCollapse } = storeToRefs(globalStore);
</script>

<style lang="scss" scoped>
	.layout-menu-container {
		.wic2-menu-item {
			height: 40px;
		}
		.wic2-menu--vertical:not(.wic2-menu--collapse):not(
				.wic2-menu--popup-container
			)
			.wic2-menu-item,
		.wic2-menu--vertical:not(.wic2-menu--collapse):not(
				.wic2-menu--popup-container
			)
			.wic2-sub-menu__title,
		.wic2-menu--vertical:not(.wic2-menu--collapse):not(
				.wic2-menu--popup-container
			)
			.wic2-menu-item-group__title {
			padding-left: unset;
			padding: 8px;
		}
	}
</style>
