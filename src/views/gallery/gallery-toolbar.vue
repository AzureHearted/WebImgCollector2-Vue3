<template>
	<div class="gallery-toolbar">
		<!-- 进度条 -->
		<el-progress
			class="toolbar-loading"
			striped
			striped-flow
			:class="{ 'loading-active': loadingStore.loading }"
			:status="loadingStore.percentage === 100 ? 'success' : ''"
			:stroke-width="12"
			:show-text="false"
			:text-inside="true"
			:percentage="loadingStore.percentage">
			<span style="font-size: 12px">
				{{ loadingStore.percentage.toFixed(2) }}%
			</span>
		</el-progress>
		<!-- 方案选择器 -->
		<div class="pattern-select">
			<n-select
				v-model:value="patternStore.used.id"
				placeholder="请选择一个方案"
				:to="false"
				:render-label="renderPatternSelectOptionsLabel"
				:options="patternSelectOptions" />
		</div>
		<!-- 操作栏 -->
		<div class="control-group-button">
			<!-- 控制按钮组 -->
			<n-badge
				:offset="[-8, 2]"
				style="z-index: 3"
				type="info"
				:max="999"
				:show="!!validCardList.length"
				:value="validCardList.length">
				<var-menu
					placement="bottom-start"
					:same-width="false"
					:trigger="isMobile() ? 'click' : 'hover'"
					close-on-click-reference
					:teleport="false">
					<var-button-group type="primary">
						<!--s 加载按钮 -->
						<var-button
							@click.stop="getCards"
							:loading="loadingStore.loading"
							block>
							加载
						</var-button>
						<var-button style="padding: 0 4px">
							<i-material-symbols-arrow-drop-down-rounded
								style="fill: white"
								width="24"
								height="24" />
						</var-button>
					</var-button-group>
					<template #menu>
						<var-cell
							@click="reload"
							title="重新加载"
							v-if="!loadingStore.loading"
							ripple>
							<template #icon>
								<i-ant-design-reload-outlined />
							</template>
						</var-cell>
						<var-cell @click="resetFilters" title="重置过滤器" ripple>
							<template #icon>
								<Icon
									icon="material-symbols:reset-settings-rounded"
									width="1.2em"
									height="1.2em" />
							</template>
						</var-cell>
						<var-cell
							@click="clear"
							title="清空所有"
							v-if="!!filteredCardList.length && !loadingStore.loading"
							ripple>
							<template #icon>
								<i-mdi-delete-empty style="color: red" />
							</template>
						</var-cell>
					</template>
				</var-menu>
			</n-badge>
		</div>
		<!-- 排序方式 -->
		<div class="sort-method-select">
			<n-select
				v-model:value="sort.method"
				placeholder="请选择一个排序方式"
				:to="false"
				:options="sort.groups" />
		</div>
		<!-- 选择器 -->
		<div class="control-group-button">
			<n-badge
				:offset="[-116, 2]"
				style="z-index: 2"
				type="success"
				:max="999"
				:show="!!filteredCardList.length"
				:value="filteredCardList.length">
				<!-- 选择器按钮组 -->
				<var-button-group class="control-button-group">
					<var-button type="primary" @click="checkAll"> 全选 </var-button>
					<var-button type="info" @click="inverseAll"> 反选 </var-button>
					<var-button @click="cancel"> 取消 </var-button>
				</var-button-group>
			</n-badge>
		</div>
		<!-- 下载控制 -->
		<div class="control-group-button">
			<!-- 下载按钮 -->
			<n-badge
				:offset="[0, 2]"
				style="z-index: 2"
				:max="999"
				:show="!!checkedCardList.length"
				:value="`${checkedCardList.length}${checkedTotalSizeTip}`">
				<var-menu
					placement="bottom-start"
					:trigger="isMobile() ? 'click' : 'hover'"
					:teleport="false">
					<var-button-group type="primary">
						<var-button
							:disabled="!checkedCardList.length"
							@click.stop="downloadSelected">
							下载
						</var-button>
						<var-button
							:disabled="!filteredCardList.length || loadingStore.loading"
							style="padding: 0 4px">
							<i-material-symbols-arrow-drop-down-rounded
								style="fill: white"
								width="24"
								height="24" />
						</var-button>
					</var-button-group>
					<template #menu>
						<var-cell title="全部下载" @click="downloadAll" ripple>
							<template #icon>
								<i-mdi-auto-download />
							</template>
						</var-cell>
						<var-cell
							title="删除选中项"
							@click="deleteSelected"
							v-if="!!selectionCardList.length"
							ripple>
							<template #icon>
								<i-mdi-delete-sweep style="color: red" />
							</template>
						</var-cell>
						<var-cell
							title="收藏选中项"
							@click="favoriteSelected"
							v-if="!!selectionCardList.length"
							ripple>
							<template #icon>
								<i-mdi-book-favorite style="color: purple" />
							</template>
						</var-cell>
					</template>
				</var-menu>
			</n-badge>
		</div>
		<!-- 过滤控制器 -->
		<div class="control-group">
			<!-- 类型过滤器 -->
			<div class="type-select">
				<n-select
					v-model:value="storeFilters.type"
					placeholder="类型过滤"
					multiple
					clearable
					:to="false"
					:render-tag="renderTag"
					:render-label="renderOptionLabelWithCount"
					:options="typeOptions"
					max-tag-count="responsive" />
			</div>
			<!-- 扩展名过滤器 -->
			<div class="ext-select">
				<n-select
					v-model:value="storeFilters.extension"
					placeholder="扩展名过滤"
					multiple
					clearable
					:to="false"
					:render-tag="renderTag"
					:render-label="renderOptionLabelWithCount"
					:options="extOptions"
					max-tag-count="responsive" />
			</div>
		</div>
		<!-- 尺寸过滤器 -->
		<div class="size-filter">
			<!-- 宽度过滤器 -->
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
			<!-- 高度过滤器 -->
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
	</div>
</template>

<script setup lang="ts">
	import { h, reactive, computed, watch } from "vue";
	import type { VNodeChild } from "vue";
	import { NEllipsis, NTag, NBadge } from "naive-ui";
	import type { SelectOption, SelectRenderTag } from "naive-ui";
	import type { ComputedRef } from "vue";
	import type { BaseCard } from "@/stores/CardStore/interface";
	import { Pattern } from "@/stores/PatternStore/class/Pattern";
	import BaseImg from "@/components/base/base-img.vue";
	import { Icon } from "@iconify/vue";

	// 导入公用ts库
	import { byteAutoUnit, isMobile } from "@/utils/common";

	// 导入仓库
	import { storeToRefs } from "pinia";
	import useLoadingStore from "@/stores/LoadingStore";
	import usePatternStore from "@/stores/PatternStore";
	import useCardStore from "@/stores/CardStore";
	import useFavoriteStore from "@/stores/FavoriteStore";

	const cardStore = useCardStore();
	const {
		sort,
		sizeRange,
		filteredCardList,
		validCardList,
		selectionCardList,
		typeOptions,
		extensionOptions: extOptions,
		filters: storeFilters,
	} = storeToRefs(cardStore);
	const favoriteStore = useFavoriteStore();
	const loadingStore = useLoadingStore();
	const patternStore = usePatternStore();

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

	// 监听card仓库卡片尺寸最大值变化
	watch(
		() => [cardStore.info.size.width[1], cardStore.info.size.height[1]],
		([width, height]) => {
			// console.log("过滤器变化", width, height);
			// 更新组件过滤器最大值
			if (filters.size.width[1] < width) {
				filters.size.width[1] = width;
			}
			if (filters.size.height[1] < height) {
				filters.size.height[1] = height;
			}
		}
	);

	// 被选中的卡片
	const checkedCardList: ComputedRef<BaseCard[]> = computed(() => {
		return validCardList.value.filter((x) => x.isSelected);
	});

	// 计算被选中的卡片对应的体积大小总和
	const checkedTotalSizeTip: ComputedRef = computed(() => {
		let existUnDownload = false; // 标记是否存在为下载的卡片
		// 先计算尺寸大小
		const totalByte = checkedCardList.value.reduce((total, curr) => {
			if (curr.source.blob) {
				return total + curr.source.blob.size;
			} else {
				existUnDownload = true;
				return total;
			}
		}, 0);
		// 合成显示文本
		if (totalByte) {
			return ` (${byteAutoUnit(totalByte)})${
				existUnDownload ? " 存在未下载" : ""
			}`;
		} else {
			return "";
		}
	});

	// f控制相关
	// 方案选项
	const patternSelectOptions = computed<SelectOption[]>(() => {
		return patternStore.list.map((p) => {
			return {
				key: p.id,
				label: p.mainInfo.name,
				value: p.id,
				rowData: p,
			} as SelectOption;
		});
	});
	// 方案选项标签渲染函数
	const renderPatternSelectOptionsLabel = (
		option: SelectOption
	): VNodeChild => {
		return h(
			"div",
			{
				style: "display:flex; align-items: center;",
			},
			[
				option && !(option.key as string).includes("#")
					? h(BaseImg, {
							src: (option.rowData as Pattern).mainInfo.icon,
							style: "width: 16px; height: 16px;margin-right:4px;",
					  })
					: null,
				h(
					NEllipsis,
					{ style: "user-select: none;" },
					{ default: () => option.label as string }
				),
			]
		);
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
						max: 999,
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

	//f 获取卡片
	async function getCards() {
		await cardStore.getPageCard();
	}

	//f 重新加载
	async function reload() {
		await clear(); // 先清空
		await getCards(); // 后重载
	}

	//f 清空
	async function clear() {
		cardStore.clearCardList();
		filters.size.width = storeFilters.value.size.width;
		filters.size.height = storeFilters.value.size.height;
	}

	//f 过滤器改变
	function filterChange(key: "width" | "height", value: [number, number]) {
		// console.log("过滤器变化", key, value);
		storeFilters.value.size[key] = value; // 更新仓库过滤器
	}

	//f 全选
	function checkAll() {
		filteredCardList.value.forEach((c) => (c.isSelected = true));
	}

	//f 反选
	function inverseAll() {
		filteredCardList.value.forEach((c) => (c.isSelected = !c.isSelected));
	}

	//f 取消
	function cancel() {
		validCardList.value.forEach((c) => (c.isSelected = false));
	}

	//f 重置过滤器
	function resetFilters() {
		cardStore.resetFilters();
		filters.size.width = storeFilters.value.size.width;
		filters.size.height = storeFilters.value.size.height;
	}

	//f 下载选中项
	function downloadSelected() {
		const cards = validCardList.value.filter((x) => x.isSelected) || [];
		cardStore.downloadCards(cards);
	}

	//f 下载全部
	function downloadAll() {
		const cards = filteredCardList.value || [];
		cardStore.downloadCards(cards);
	}

	//f 删除选中项
	function deleteSelected() {
		const ids = validCardList.value
			.filter((x) => x.isSelected)
			.map((x) => x.id);
		cardStore.removeCard(ids);
	}

	//f 收藏选中项
	function favoriteSelected() {
		favoriteStore.addCard(selectionCardList.value); // 添加卡片到Favorite仓库
		selectionCardList.value.forEach((c) => (c.isFavorite = true)); // 更新卡片收藏状态
	}
</script>

<style lang="scss" scoped>
	@use "@/styles/shadow.scss" as shadow;
	// 工具栏容器
	.gallery-toolbar {
		position: relative;
	}

	// loading样式
	.toolbar-loading {
		margin-bottom: 4px;
		width: 100%;
		transform: translateY(-20px);
		height: 0;
		// transform: scaleY(0);
		transition: 0.5s 1s;
		&.loading-active {
			transform: translateY(0);
			height: 20px;
			// transform: scaleY(1);
			transition: 0.3s;
		}
		:deep(.wic2-progress-bar__inner) {
			line-height: 0;
		}
	}

	// 工具栏样式
	.gallery-toolbar {
		flex: 0;
		display: flex;
		flex-flow: row wrap;
		// padding: 4px 4px 2px 4px;
		padding: 2px;
		gap: 2px;
		// background: rgba(255, 255, 255, 0.2);
		align-items: center;
		box-shadow: shadow.$elevation;
	}

	// 方案选择器样式
	.pattern-select {
		width: 130px;
	}

	// 排序方式选择器
	.sort-method-select {
		width: 130px;
		:deep(.wic2-n-base-selection-input__content) {
			user-select: none;
		}
	}
	// 控制按钮组样式
	.control-button-group {
		height: fit-content;
	}

	// 控制组样式
	.control-group {
		flex: 0;
		display: flex;
		flex-flow: row nowrap;
		gap: 2px;
	}

	// 类型、扩展名选择器样式
	.type-select,
	.ext-select {
		width: 150px;
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

	// 样式修复
	:deep(.wic2-badge) {
		display: block;
	}

	:deep(.wic2-n-base-select-option__content) {
		flex: 1;
	}
	:deep(.var-menu__menu) {
		width: max-content;
	}
</style>
