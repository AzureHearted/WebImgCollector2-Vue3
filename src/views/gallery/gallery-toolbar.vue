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
			<el-badge
				:offset="[-8, 0]"
				style="z-index: 3"
				type="info"
				:max="999"
				:hidden="!cardStore.validCardList.length"
				:value="cardStore.validCardList.length">
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
							v-if="
								!!cardStore.filteredCardList.length && !loadingStore.loading
							"
							ripple>
							<template #icon>
								<i-mdi-delete-empty style="color: red" />
							</template>
						</var-cell>
					</template>
				</var-menu>
			</el-badge>
		</div>
		<!-- 排序方式 -->
		<div class="sort-method-select">
			<n-select
				v-model:value="cardStore.sort.method"
				placeholder="请选择一个排序方式"
				:to="false"
				:options="cardStore.sort.groups" />
		</div>
		<!-- 选择器 -->
		<div class="control-group-button">
			<el-badge
				:offset="[-118, 0]"
				style="z-index: 2"
				type="primary"
				:max="999"
				:hidden="!cardStore.filteredCardList.length"
				:value="cardStore.filteredCardList.length">
				<!-- 选择器按钮组 -->
				<var-button-group class="control-button-group">
					<var-button type="primary" @click="checkAll"> 全选 </var-button>
					<var-button type="info" @click="inverseAll"> 反选 </var-button>
					<var-button @click="cancel"> 取消 </var-button>
				</var-button-group>
			</el-badge>
		</div>
		<!-- 下载控制 -->
		<div class="control-group-button">
			<!-- 下载按钮 -->
			<el-badge
				type="success"
				style="z-index: 2"
				:max="999"
				:hidden="!checkedCardList.length"
				:value="`${checkedCardList.length} (${checkedTotalSize})`">
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
							:disabled="
								!cardStore.filteredCardList.length || loadingStore.loading
							"
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
							v-if="!!cardStore.selectionCardList.length"
							ripple>
							<template #icon>
								<i-mdi-delete-sweep style="color: red" />
							</template>
						</var-cell>
						<var-cell
							title="收藏选中项"
							@click="favoriteSelected"
							v-if="!!cardStore.selectionCardList.length"
							ripple>
							<template #icon>
								<i-mdi-book-favorite style="color: purple" />
							</template>
						</var-cell>
					</template>
				</var-menu>
			</el-badge>
		</div>
		<!-- 过滤控制器 -->
		<div class="control-group">
			<!-- 类型过滤器 -->
			<div class="type-select">
				<n-select
					v-model:value="cardStore.filters.type"
					placeholder="类型过滤"
					multiple
					clearable
					:to="false"
					:render-tag="renderTag"
					:render-label="renderOptionLabelWithCount"
					:options="cardStore.typeOptions"
					max-tag-count="responsive" />
			</div>
			<!-- 扩展名过滤器 -->
			<div class="ext-select">
				<n-select
					v-model:value="cardStore.filters.extension"
					placeholder="扩展名过滤"
					multiple
					clearable
					:to="false"
					:render-tag="renderTag"
					:render-label="renderOptionLabelWithCount"
					:options="cardStore.extensionOptions"
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
					:max="cardStore.info.size.width[1]"
					:min="cardStore.info.size.width[0]"
					:marks="cardStore.filters.size.marks"
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
					:max="cardStore.info.size.height[1]"
					:min="cardStore.info.size.height[0]"
					:marks="cardStore.filters.size.marks"
					@change="filterChange('height', $event as [number, number])" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { h, ref, reactive, computed, watch } from "vue";
	import type { VNodeChild } from "vue";
	import { NEllipsis, NTag } from "naive-ui";
	import type { SelectOption, SelectRenderTag } from "naive-ui";
	import type { ComputedRef } from "vue";
	import type { BaseCard } from "@/stores/CardStore/interface";
	import BaseImg from "@/components/base/base-img.vue";
	import { Icon } from "@iconify/vue";

	// 导入公用ts库
	import { byteAutoUnit, isMobile } from "@/utils/common";

	// 导入仓库
	import {
		useCardStore,
		useLoadingStore,
		usePatternStore,
		useFavoriteStore,
	} from "@/stores";
	import { Pattern } from "@/stores/PatternStore/class/Pattern";

	const cardStore = useCardStore();
	const favoriteStore = useFavoriteStore();
	const loadingStore = useLoadingStore();
	const patternStore = usePatternStore();

	// 过滤器定义
	const filters = reactive({
		size: {
			width: ref([
				cardStore.filters.size.width[0],
				cardStore.filters.size.width[1],
			]),
			height: ref([
				cardStore.filters.size.height[0],
				cardStore.filters.size.height[1],
			]),
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
		return cardStore.validCardList.filter((x) => x.isSelected);
	});

	// 计算被选中的卡片对应的体积大小总和
	const checkedTotalSize: ComputedRef<string> = computed(() => {
		const totalByte = checkedCardList.value.reduce(
			(total, curr) =>
				total + (curr.source.blob! && curr.source.blob.size) || 0,
			0
		);
		return byteAutoUnit(totalByte);
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

	// 选择器多选Tag渲染函数
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

	// 带数量的选项标签渲染函数
	const renderOptionLabelWithCount = (option: SelectOption): VNodeChild => {
		return h(
			"div",
			{
				style: "display:flex; align-items: center;width:100%;",
			},
			[
				h(NEllipsis, {}, { default: () => option.label as string }),
				h(
					NTag,
					{
						type: "info",
						size: "small",
						style: "margin-left:auto;",
					},
					{ default: () => option.count + "个" }
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
		filters.size.width = cardStore.filters.size.width;
		filters.size.height = cardStore.filters.size.height;
	}

	//f 过滤器改变
	function filterChange(key: "width" | "height", value: [number, number]) {
		// console.log("过滤器变化", key, value);
		cardStore.filters.size[key] = value; // 更新仓库过滤器
	}

	//f 全选
	function checkAll() {
		cardStore.filteredCardList.forEach((c) => (c.isSelected = true));
	}

	//f 反选
	function inverseAll() {
		cardStore.filteredCardList.forEach((c) => (c.isSelected = !c.isSelected));
	}

	//f 取消
	function cancel() {
		cardStore.validCardList.forEach((c) => (c.isSelected = false));
	}

	//f 重置过滤器
	function resetFilters() {
		cardStore.resetFilters();
		filters.size.width = cardStore.filters.size.width;
		filters.size.height = cardStore.filters.size.height;
	}

	//f 下载选中项
	function downloadSelected() {
		const cards = cardStore.validCardList.filter((x) => x.isSelected) || [];
		cardStore.downloadCards(cards);
	}

	//f 下载全部
	function downloadAll() {
		const cards = cardStore.filteredCardList || [];
		cardStore.downloadCards(cards);
	}

	//f 删除选中项
	function deleteSelected() {
		const ids = cardStore.validCardList
			.filter((x) => x.isSelected)
			.map((x) => x.id);
		cardStore.removeCard(ids);
	}

	//f 收藏选中项
	function favoriteSelected() {
		favoriteStore.addCard(cardStore.selectionCardList); // 添加卡片到Favorite仓库
		cardStore.selectionCardList.forEach((c) => (c.isFavorite = true)); // 更新卡片收藏状态
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
