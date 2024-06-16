<template>
	<n-flex ref="containerDOM" class="favorite__container" vertical :size="4">
		<!--s 工具栏 -->
		<n-flex class="toolbar-wrap" :size="4">
			<!-- s关键词过滤 -->
			<n-badge :value="filterCardList.all.length" :max="999" type="info">
				<n-input
					style="width: 180px"
					v-model:value="filterKeyword"
					type="text"
					placeholder="输入检索关键词"
					clearable />
			</n-badge>
			<!-- s排序方式选择 -->
			<n-select
				class="sort-method-select"
				v-model:value="sortInfo.method"
				placeholder="请选择一个排序方式"
				:to="false"
				:options="sortInfo.groups" />
			<!-- s扩展名过滤器 -->
			<n-select
				class="ext-select"
				v-model:value="storeFilters.extension"
				placeholder="扩展名过滤"
				multiple
				clearable
				:to="false"
				:render-tag="renderTag"
				:render-label="renderOptionLabelWithCount"
				:options="extensionOptions"
				max-tag-count="responsive" />
			<!--s 尺寸过滤器 -->
			<div class="size-filter">
				<!--s 宽度过滤器 -->
				<div class="width-filter">
					<el-text type="primary">宽度</el-text>
					<el-slider
						:size="isMobile() ? 'small' : 'default'"
						v-model="filters.size.width"
						range
						:step="1"
						:min="sizeRange.width[0]"
						:max="sizeRange.width[1]"
						:marks="storeFilters.size.marks"
						@change="filterChange('width', $event as [number, number])" />
				</div>
				<!--s 高度过滤器 -->
				<div class="height-filter">
					<el-text type="primary">高度</el-text>
					<el-slider
						:size="isMobile() ? 'small' : 'default'"
						v-model="filters.size.height"
						range
						:step="1"
						:min="sizeRange.height[0]"
						:max="sizeRange.height[1]"
						:marks="storeFilters.size.marks"
						@change="filterChange('height', $event as [number, number])" />
				</div>
			</div>
		</n-flex>
		<!--s 内容区 -->
		<n-flex class="content-wrap" :size="4">
			<n-tabs
				type="line"
				size="small"
				v-model:value="active"
				tab-style="width: 70px"
				style="height: 100%">
				<n-tab-pane
					class="tab-pane"
					name="image"
					:disabled="!filterCardList.image.length">
					<template #tab>
						<n-flex :size="4" align="center" :wrap="false">
							图片
							<n-badge
								style="margin-left: 4px"
								:value="filterCardList.image.length"
								:max="999"
								type="default">
							</n-badge>
						</n-flex>
					</template>
					<keep-alive>
						<BaseCardList :card-list="filterCardList.image" />
					</keep-alive>
				</n-tab-pane>
				<n-tab-pane
					class="tab-pane"
					name="html"
					:disabled="!filterCardList.html.length">
					<template #tab>
						<n-flex :size="4" align="center" :wrap="false">
							网页
							<n-badge
								style="margin-left: 4px"
								:value="filterCardList.html.length"
								:max="999"
								type="default">
							</n-badge>
						</n-flex>
					</template>
					<BaseCardList :card-list="filterCardList.html" />
				</n-tab-pane>
				<n-tab-pane
					class="tab-pane"
					name="other"
					:disabled="!filterCardList.other.length">
					<template #tab>
						<n-flex :size="4" align="center" :wrap="false">
							其他
							<n-badge
								style="margin-left: 4px"
								:value="filterCardList.other.length"
								:max="999"
								type="default">
							</n-badge>
						</n-flex>
					</template>
					<BaseCardList :card-list="filterCardList.other" />
				</n-tab-pane>
			</n-tabs>
		</n-flex>
	</n-flex>
</template>

<script setup lang="ts">
	import {
		h,
		ref,
		watch,
		reactive,
		onMounted,
		onUpdated,
		onUnmounted,
		onActivated,
	} from "vue";
	import type { VNodeChild } from "vue";
	import { isMobile } from "@/utils/common";
	import type { SelectOption, SelectRenderTag } from "naive-ui";
	import { NEllipsis, NTag, NBadge, NFlex } from "naive-ui";
	import BaseCardList from "./favorite-base-waterfall.vue";

	import { storeToRefs } from "pinia";
	import useFavoriteStore from "@/stores/FavoriteStore";
	import type { BaseMeta } from "@/stores/CardStore/interface";
	const favoriteStore = useFavoriteStore();

	const {
		filterCardList,
		filterKeyword,
		filters: storeFilters,
		extensionOptions,
		sortInfo,
		sizeRange,
	} = storeToRefs(favoriteStore);

	const { refreshStore } = favoriteStore;

	onMounted(() => {
		refreshStore();
	});

	//s 过滤器定义(组件内过滤器)
	const filters = reactive({
		size: {
			width: [
				storeFilters.value.size.width[0],
				storeFilters.value.size.width[1],
			],
			height: [
				storeFilters.value.size.height[0],
				storeFilters.value.size.height[1],
			],
		},
	});

	//f 刷新filter
	const reFreshFilter = () => {
		refreshStore();
		filters.size.width[1] = sizeRange.value.width[1];
		filters.size.height[1] = sizeRange.value.height[1];
		storeFilters.value.size.width[1] = sizeRange.value.width[1];
		storeFilters.value.size.height[1] = sizeRange.value.height[1];
	};
	//* 挂载和激活时都进行一次filter刷新
	onMounted(() => reFreshFilter());
	onActivated(() => reFreshFilter());
	// onActivated(() => console.log("激活"));

	//t 排除false的工具类型
	type ExcludeFalse<T> = T extends false ? never : T;
	//s 当前激活的标签
	const active = ref<ExcludeFalse<BaseMeta["type"] | "other">>("image");
	//w 修正监听器
	watch(
		[
			active,
			() => filterCardList.value.image,
			() => filterCardList.value.html,
			() => filterCardList.value.other,
		],
		([nowActive, imageList, htmlList, otherList]) => {
			// console.log(nowActive);
			if (nowActive === "image") {
				if (!imageList.length) {
					if (htmlList.length) {
						active.value = "html";
					} else if (otherList.length) {
						active.value = "other";
					}
				}
			} else if (nowActive === "html") {
				if (!htmlList.length) {
					if (imageList.length) {
						active.value = "image";
					} else if (otherList.length) {
						active.value = "other";
					}
				}
			} else if (nowActive === "other") {
				if (!otherList.length) {
					if (imageList.length) {
						active.value = "image";
					} else if (htmlList.length) {
						active.value = "html";
					}
				}
			}
		},
		{ immediate: true }
	);

	//f 选择器多选Tag渲染函数
	const renderTag: SelectRenderTag = ({ option, handleClose }) => {
		return h(
			NTag,
			{
				type: "info",
				closable: true,
				onMousedown: (e: FocusEvent) => {
					e.preventDefault();
				},
				onClose: (e: MouseEvent) => {
					e.stopPropagation();
					handleClose();
				},
			},
			{ default: () => option.label }
		);
	};

	//f 带数量的选项标签渲染函数
	const renderOptionLabelWithCount = (option: SelectOption): VNodeChild => {
		return h(
			"div",
			{
				style: "display:flex; align-items: center;width:100%;",
			},
			[
				h(NEllipsis, {}, { default: () => option.label as string }),
				h(
					NBadge,
					{
						type: "info",
						style: "margin-left:auto;",
					},
					{
						value: () =>
							(option.count as number) <= 999 ? option.count : "999+" + "个",
					}
				),
			]
		);
	};

	//f 过滤器改变
	function filterChange(key: "width" | "height", value: [number, number]) {
		console.log("过滤器变化", key, value);
		storeFilters.value.size[key] = value; // 更新仓库过滤器
	}

	const containerDOM = ref<InstanceType<typeof NFlex> | null>(null);
	//* 导入Fancybox和相关配置
	import { Fancybox, configFancybox } from "@/plugin/fancyapps-ui";
	import { onDeactivated } from "vue";
	onMounted(() => FancyboxBind(containerDOM.value?.$el, "[data-fancybox]"));
	onActivated(() => FancyboxBind(containerDOM.value?.$el, "[data-fancybox]"));
	onUnmounted(() => Fancybox.destroy());
	onDeactivated(() => Fancybox.destroy());
	onUpdated(() => {
		Fancybox.unbind(containerDOM.value?.$el);
		Fancybox.close();
		FancyboxBind(containerDOM.value?.$el, "[data-fancybox]");
	});

	//f 执行FancyBox绑定
	function FancyboxBind(
		listContainerDOM: HTMLElement | null,
		itemSelector: string = "[data-fancybox]",
		teleportToDOMs?: HTMLElement
	) {
		Fancybox.bind(listContainerDOM, itemSelector, {
			...configFancybox,
			parentEl: teleportToDOMs ? teleportToDOMs : listContainerDOM,
			hideScrollbar: false,
		});
	}

	// 等待实现: 需要对收藏页面进行多级分类
</script>

<style lang="scss" scoped>
	.favorite__container {
		// position: relative;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.toolbar-wrap {
		padding: 2px;
		margin-top: 8px;
	}

	.content-wrap {
		flex: 1; // 必须设置用来撑满容器
		padding: 4px;
		overflow: hidden; // 必须要设置溢出隐藏
	}

	// 控制组样式
	.control-group {
		display: flex;
		flex-flow: row nowrap;
		gap: 2px;
	}

	// 排序方式选择器
	.sort-method-select {
		width: 130px;
		:deep(.wic2-n-base-selection-input__content) {
			user-select: none;
		}
	}

	// 类型、扩展名选择器样式
	.type-select,
	.ext-select {
		width: 150px;

		:deep(.wic2-n-base-select-option__content) {
			flex: 1;
		}
	}

	// 尺寸过滤器样式
	.size-filter {
		flex: auto;
		display: flex;
		flex-flow: row wrap;
		gap: 8px;
		margin-top: 4px;
		// 宽度和高度过滤器的通用样式
		.width-filter,
		.height-filter {
			flex: 1 0;
			min-width: 200px;
			max-width: 400px;
			display: flex;
			flex-flow: row nowrap;
			padding-right: 10px;
			font-size: 12px;

			// 标签样式
			& > span {
				width: fit-content;
				margin-right: 12px;
				white-space: nowrap;
			}
		}
	}

	.tab-pane {
		height: 100%;
		overflow: hidden;
		box-sizing: border-box;
	}

	:deep(.wic2-n-tabs-tab) {
		padding-left: 12px;
		padding-right: 0px;
	}
</style>
