<template>
	<div
		class="layout-container"
		ref="layoutContainer"
		:class="{ open: globalStore.openWindow }"
		@wheel.stop.passive>
		<el-container style="height: 100%">
			<el-header class="layout-container-header" height="34px">
				<var-button
					style="aspect-ratio: 1; margin-left: 6px"
					text
					round
					icon-container
					@click="appBarIsCollapse = !appBarIsCollapse">
					<i-ant-design-menu-outlined
						width="20"
						height="20"
						style="color: black" />
				</var-button>
				<div
					style="flex: 1; margin-left: 16px; font-size: 20px; text-align: left">
					Web Img Collector 2
				</div>
				<var-button
					style="aspect-ratio: 1"
					text
					round
					icon-container
					@click="globalStore.openWindow = false">
					<i-ant-design-close-circle-filled
						width="24"
						height="24"
						style="color: red" />
				</var-button>
			</el-header>
			<el-main style="padding: unset">
				<!-- 内容区 -->
				<keep-alive>
					<component :is="nowPage"></component>
				</keep-alive>
				<!-- 导航菜单 -->
				<el-drawer
					class="layout-container-menu"
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
					</el-menu>
				</el-drawer>
			</el-main>
		</el-container>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted, watch, onUnmounted, onUpdated } from "vue";
	import useGlobalStore from "@/stores/global"; //导入全局仓库
	const globalStore = useGlobalStore();
	// 导入组件
	import Gallery from "@/views/gallery/gallery-index.vue";
	import PatternEdit from "@/views/pattern-edit/pattern-edit-index.vue";
	// 组件记对象
	const views: { [key: string]: any } = { Gallery, PatternEdit };
	// 动态组件
	const nowPage = computed(() => {
		return views[globalStore.tab];
	});

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

<style lang="scss" scoped>
	@use "@/styles/shadow.scss" as shadow;

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

	.layout-container-header {
		background: white;
		padding: 0 4px;
		display: flex;
		align-items: center;
		box-shadow: shadow.$elevation;
	}

	.layout-container-menu {
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
	.layout-app-container {
		background: unset;
		height: 100%;
	}
</style>
