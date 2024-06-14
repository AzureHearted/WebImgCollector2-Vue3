<template>
	<n-flex class="favorite__container" vertical :size="4">
		<!-- 工具栏 -->
		<n-flex :size="4">
			<!-- s关键词过滤 -->
			<n-badge :value="filterCardList.length" :max="999" type="info">
				<n-input
					style="width: 200px"
					v-model:value="filterKeyword"
					type="text"
					placeholder="输入检索关键词"
					clearable />
			</n-badge>
			<!-- s类型过滤器 -->
			<n-select
				class="type-select"
				v-model:value="favoriteStore.filters.type"
				placeholder="类型过滤"
				multiple
				clearable
				:to="false"
				:render-tag="renderTag"
				:render-label="renderOptionLabelWithCount"
				:options="favoriteStore.typeOptions"
				max-tag-count="responsive" />
			<!-- s扩展名过滤器 -->
			<n-select
				class="ext-select"
				v-model:value="favoriteStore.filters.extension"
				placeholder="扩展名过滤"
				multiple
				clearable
				:to="false"
				:render-tag="renderTag"
				:render-label="renderOptionLabelWithCount"
				:options="favoriteStore.extensionOptions"
				max-tag-count="responsive" />
			<!-- 尺寸过滤器 -->
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
		<!-- 瀑布流 -->
		<n-flex class="waterfall-wrapper" :size="4">
			<BaseScrollbar>
				<WaterFallList :data="filterCardList" item-padding="2px">
					<template #default="{ item }">
						<GalleryCard
							:data="(item as Card)"
							:show-to-locate-button="false"
							:show-delete-button="false"
							:show-download-button="(item as Card).source.meta.type==='image'"
							viewport-selector=".web-img-collector-container"
							@change:selected="item.isSelected = $event"
							@change:title="updateCard([item as Card])"
							@download="handleDownload(item as Card)"
							@toggle-favorite="handleToggleFavorite(item as Card)"
							@delete="deleteCard([item as Card])" />
					</template>
				</WaterFallList>
			</BaseScrollbar>
		</n-flex>
	</n-flex>
</template>

<script setup lang="ts">
	import { h, ref, reactive, onMounted, onUnmounted, onActivated } from "vue";
	import type { VNodeChild } from "vue";
	import { isMobile } from "@/utils/common";
	import type { SelectOption, SelectRenderTag } from "naive-ui";
	import { NEllipsis, NTag, NBadge } from "naive-ui";
	import BaseScrollbar from "@/components/base/base-scrollbar.vue";
	import WaterFallList from "@/components/base/waterfall-list.vue";
	import GalleryCard from "../gallery/gallery-card.vue";
	import Card from "@/stores/CardStore/class/Card";

	import { storeToRefs } from "pinia";
	import useFavoriteStore from "@/stores/FavoriteStore";
	const favoriteStore = useFavoriteStore();
	const {
		cardList,
		filterCardList,
		filterKeyword,
		filters: storeFilters,
		sizeRange,
	} = storeToRefs(favoriteStore);
	const {
		refreshStore,
		clearStore,
		addCard,
		updateCard,
		deleteCard,
		unFavoriteCard,
		downloadCards,
	} = favoriteStore;

	//s 过滤器定义
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
	onMounted(() => {
		refreshStore();
		filters.size.width[1] = sizeRange.value.width[1];
		filters.size.height[1] = sizeRange.value.height[1];
		storeFilters.value.size.width[1] = sizeRange.value.width[1];
		storeFilters.value.size.height[1] = sizeRange.value.height[1];
	});
	onActivated(() => {
		refreshStore();
		filters.size.width[1] = sizeRange.value.width[1];
		filters.size.height[1] = sizeRange.value.height[1];
		storeFilters.value.size.width[1] = sizeRange.value.width[1];
		storeFilters.value.size.height[1] = sizeRange.value.height[1];
	});

	//f 处理卡片下载
	const handleDownload = async (card: Card) => {
		await downloadCards([card]);
		// 更新卡片
		updateCard([card]);
	};

	//f 处理收藏/取消收藏
	const handleToggleFavorite = (card: Card) => {
		unFavoriteCard([card]);
	};

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
	// 等待实现: 需要对收藏页面进行多级分类
</script>

<style lang="scss" scoped>
	.favorite__container {
		position: relative;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		padding: 4px;
		padding-top: 10px;
		overflow: hidden;
	}

	.waterfall-wrapper {
		flex: 1;
		scroll-behavior: smooth;
		overflow: clip; // 必须要设置溢出裁切
		border-radius: 4px;
	}

	// 控制组样式
	.control-group {
		display: flex;
		flex-flow: row nowrap;
		gap: 2px;
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
</style>
