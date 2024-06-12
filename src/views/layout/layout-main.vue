<template>
	<div class="main__container">
		<n-layout has-sider>
			<n-layout-sider
				style="z-index: 10"
				collapse-mode="width"
				:collapsed-width="isMobile() ? 0 : 64"
				width="130"
				:collapsed="collapsed"
				show-trigger
				trigger-style="transition: 0.5s;z-index:10000"
				:collapsed-trigger-style="
					isMobile() ? 'transform: translateX(80%) translateY(-50%)' : {}
				"
				@collapse="collapsed = true"
				@expand="collapsed = false">
				<n-menu
					v-model:value="activeKey"
					:collapsed="collapsed"
					:collapsed-width="64"
					:collapsed-icon-size="24"
					:indent="16"
					:render-label="renderLabel"
					:options="menuOptions" />
			</n-layout-sider>
			<n-layout class="main__content">
				<transition appear>
					<keep-alive :include="/gallery|pattern|favorite|setting/i" :max="10">
						<component :is="nowPage" />
					</keep-alive>
				</transition>
			</n-layout>
		</n-layout>
	</div>
</template>

<script setup lang="ts">
	import { h, computed } from "vue";
	import type { Component } from "vue";
	import { Icon } from "@iconify/vue";
	import { NIcon, NEllipsis } from "naive-ui";
	import type { MenuOption, MenuProps } from "naive-ui";

	import Gallery from "@/views/gallery/gallery-index.vue";
	import PatternEdit from "@/views/pattern-edit/pattern-edit-index.vue";
	import Setting from "@/views/setting/setting-index.vue";
	import Favorite from "@/views/favorite/favorite-index.vue";
	import Test from "@/views/test/test-index.vue";

	import { storeToRefs } from "pinia";
	import { useGlobalStore } from "@/stores";
	import { isMobile } from "@/utils/common";
	const globalStore = useGlobalStore();
	const { tab: activeKey, navCollapse: collapsed } = storeToRefs(globalStore);

	// 组件键值对
	const views: { [key: string]: Component } = {
		Gallery,
		PatternEdit,
		Favorite,
		Setting,
		Test,
	};
	// 动态组件
	const nowPage = computed(() => {
		return views[activeKey.value];
	});

	// 导航菜单选项
	const menuOptions: MenuOption[] = [
		{
			label: "图库",
			key: "Gallery",
			icon: renderIcon("material-symbols:gallery-thumbnail"),
		},
		{
			label: "方案管理",
			key: "PatternEdit",
			icon: renderIcon("material-symbols:box-edit"),
		},
		{
			label: "收藏",
			key: "Favorite",
			icon: renderIcon("mdi:favorite"),
		},
		{
			label: "设置",
			key: "Setting",
			icon: renderIcon("ant-design:setting-twotone"),
		},

		{
			label: "测试页面",
			key: "Test",
			icon: renderIcon("material-symbols:experiment-outline"),
		},
	];

	// 图标渲染
	function renderIcon(icon: string) {
		return () => h(NIcon, {}, { default: () => h(Icon, { icon }) });
	}

	// 标签渲染
	const renderLabel: MenuProps["renderLabel"] = ({ label }) => {
		return h(NEllipsis, { tooltip: true }, { default: () => label });
	};
</script>

<style lang="scss" scoped>
	.main__container {
		position: relative;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		// padding: 4px;
		// background: orange;
		overflow: hidden;
		display: flex;
		// gap: 4px;
	}

	:deep(.wic2-n-layout) {
		background: unset;

		.wic2-n-layout-sider {
			background: rgba(255, 255, 255, 0.3);
			backdrop-filter: blur(10px);
		}
		.wic2-n-card {
			background: unset;
		}
	}

	// 进场过渡,退场过渡
	.v-enter-from,
	.v-leave-to {
		position: absolute;
		opacity: 0;
		// transform: scale(0);
	}

	// 进入的过程中
	.v-enter-active {
		transition: 0.3s;
	}
	// 离开的过程中
	.v-leave-active {
		transition: 0.3s;
	}
</style>
