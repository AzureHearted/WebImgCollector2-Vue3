<template>
	<div class="gallery-toolbar-container">
		<!-- 工具栏 -->
		<div class="gallery-toolbar">
			<!-- 进度条 -->
			<el-progress
				class="gallery-toolbar-loading"
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
			<!-- 操作栏 -->
			<div class="gallery-container-control-panel">
				<!-- 控制按钮组 -->
				<var-badge
					:offset-y="0"
					:offset-x="-8"
					style="z-index: 2"
					:hidden="!cardStore.validCardList.length"
					:value="cardStore.validCardList.length">
					<var-menu
						placement="bottom-start"
						:default-style="false"
						:trigger="isMobile() ? 'click' : 'hover'"
						:teleport="false">
						<var-button-group
							:size="isMobile() ? 'small' : 'normal'"
							type="success">
							<!-- 加载按钮 -->
							<var-button
								@click.stop="getCards"
								:loading="loadingStore.loading"
								block
								icon-container>
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
							<var-button-group
								:size="isMobile() ? 'small' : 'normal'"
								vertical>
								<!-- 清空按钮 -->
								<var-button type="danger" icon-container block @click="clear">
									所有清空
								</var-button>
							</var-button-group>
						</template>
					</var-menu>
				</var-badge>
			</div>
			<!-- 选择器 -->
			<div class="gallery-container-control-panel">
				<var-badge
					:offset-y="0"
					:offset-x="isMobile() ? -95 : -115"
					style="z-index: 2"
					:hidden="!cardStore.filteredCardList.length"
					:value="cardStore.filteredCardList.length">
					<!-- 选择器按钮组 -->
					<var-button-group
						class="control-button-group"
						:size="isMobile() ? 'small' : 'normal'">
						<var-button type="primary" @click="checkAll"> 全选 </var-button>
						<var-button type="info" @click="inverseAll"> 反选 </var-button>
						<var-button @click="cancel"> 取消 </var-button>
					</var-button-group>
				</var-badge>
			</div>

			<!-- 下载控制 -->
			<div class="gallery-container-control-panel">
				<!-- 下载按钮 -->
				<var-badge
					type="info"
					:offset-y="0"
					style="z-index: 1"
					:hidden="!checkedCardList.length"
					:value="`${checkedCardList.length} (${checkedTotalSize})`">
					<var-menu
						placement="bottom-start"
						:default-style="false"
						:trigger="isMobile() ? 'click' : 'hover'"
						:teleport="false">
						<var-button-group
							:size="isMobile() ? 'small' : 'normal'"
							type="primary">
							<var-button
								:disabled="!checkedCardList.length"
								@click.stop="downloadSelected">
								下载
							</var-button>
							<var-button
								:disabled="!cardStore.validCardList.length"
								style="padding: 0 4px">
								<i-material-symbols-arrow-drop-down-rounded
									style="fill: white"
									width="24"
									height="24" />
							</var-button>
						</var-button-group>
						<template #menu>
							<var-button-group
								:size="isMobile() ? 'small' : 'normal'"
								vertical>
								<var-button @click="downloadAll"> 全部下载 </var-button>
								<var-button type="danger" @click="deleteSelected">
									删除选中项
								</var-button>
							</var-button-group>
						</template>
					</var-menu>
				</var-badge>
			</div>
			<!-- 其他过滤器 -->
			<div class="filter-control-panel other-filter">
				<!-- 类型过滤器 -->
				<el-select
					class="filter-input-select"
					v-model="cardStore.filters.type"
					multiple
					clearable
					collapse-tags
					:max-collapse-tags="1"
					collapse-tags-tooltip
					placeholder="类型过滤">
					<el-option
						v-for="item in cardStore.typeOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value">
						<span style="float: left">{{ item.label }} </span>
						<span style="float: right; font-size: 12px">
							({{ item.count }}个)
						</span>
					</el-option>
				</el-select>

				<!-- 扩展名过滤器 -->
				<el-select
					class="filter-input-select"
					v-model="cardStore.filters.extension"
					multiple
					clearable
					collapse-tags
					:max-collapse-tags="1"
					collapse-tags-tooltip
					placeholder="扩展名过滤">
					<el-option
						v-for="item in cardStore.extensionOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value">
						<span style="float: left">{{ item.label }} </span>
						<span style="float: right; font-size: 12px">
							({{ item.count }}个)
						</span>
					</el-option>
				</el-select>
			</div>
			<!-- 尺寸过滤器 -->
			<div class="filter-control-panel size-filter">
				<!-- 宽度过滤器 -->
				<div class="filter-input">
					<el-text type="primary" class="input-slider-label">宽度</el-text>
					<el-text>{{ filters.size.width[0] }}px</el-text>
					<el-slider
						class="filter-input-slider"
						:size="isMobile() ? 'small' : 'default'"
						v-model="filters.size.width"
						range
						:step="1"
						:max="cardStore.info.size.width[1]"
						:min="cardStore.info.size.width[0]"
						:marks="cardStore.filters.size.marks"
						@change="filterChange('width', $event as [number, number])" />
					<el-text style="margin-left: 8px">
						{{ filters.size.width[1] }}px
					</el-text>
				</div>
				<!-- 高度过滤器 -->
				<div class="filter-input">
					<el-text type="primary" class="input-slider-label">高度</el-text>
					<el-text>{{ filters.size.height[0] }}px</el-text>
					<el-slider
						class="filter-input-slider"
						:size="isMobile() ? 'small' : 'default'"
						v-model="filters.size.height"
						range
						:step="1"
						:max="cardStore.info.size.height[1]"
						:min="cardStore.info.size.height[0]"
						:marks="cardStore.filters.size.marks"
						@change="filterChange('height', $event as [number, number])" />
					<el-text style="margin-left: 8px">
						{{ filters.size.height[1] }}px
					</el-text>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, reactive, computed, watch } from "vue";
	import type { ComputedRef } from "vue";
	import type { BaseCard } from "@/stores/cardStore/interface";

	// 导入公用ts库
	import { byteAutoUnit, isMobile } from "@/utils/common";

	// 导入仓库
	import { useCardStore, useLoadingStore } from "@/stores";

	const cardStore = useCardStore();
	const loadingStore = useLoadingStore();

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

	// 获取卡片
	async function getCards() {
		await cardStore.getPageCard();
	}

	// 过滤器改变
	function filterChange(key: "width" | "height", value: [number, number]) {
		console.log("过滤器变化", key, value);
		cardStore.filters.size[key] = value; // 更新仓库过滤器
	}

	// 全选
	function checkAll() {
		cardStore.filteredCardList.forEach((c) => (c.isSelected = true));
	}

	// 反选
	function inverseAll() {
		cardStore.filteredCardList.forEach((c) => (c.isSelected = !c.isSelected));
	}

	// 取消
	function cancel() {
		cardStore.validCardList.forEach((c) => (c.isSelected = false));
	}

	// 清空
	function clear() {
		// data.cardList = [];
		cardStore.clearCardList();
		filters.size.width = cardStore.filters.size.width;
		filters.size.height = cardStore.filters.size.height;
	}

	// 下载选中项
	function downloadSelected() {
		const ids = cardStore.validCardList
			.filter((x) => x.isSelected)
			.map((x) => x.id);
		cardStore.downloadCards(ids);
	}

	// 下载全部
	function downloadAll() {
		const ids = cardStore.filteredCardList.map((x) => x.id);
		cardStore.downloadCards(ids);
	}

	// 删除选中项
	function deleteSelected() {
		const ids = cardStore.validCardList
			.filter((x) => x.isSelected)
			.map((x) => x.id);
		cardStore.removeCard(ids);
	}
</script>

<style lang="scss" scoped>
	@use "@/styles/shadow.scss" as shadow;
	// 工具栏容器
	.gallery-toolbar-container {
		position: relative;
	}

	.gallery-toolbar-loading {
		margin: 2px 0;
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
		padding: 4px 4px 0 4px;
		background: transparent;
		align-content: center;
		box-shadow: shadow.$elevation;
	}
	// 控制面板样式
	.gallery-container-control-panel {
		flex: 0;
		// padding: 2px;
		margin-right: 2px;
		margin-bottom: 2px;
		display: flex;
		align-items: center;
		background: inherit;
	}
	// 图标样式
	.gallery-toolbar-icon {
		width: 20px;
	}
	// menu选项样式
	.gallery-toolbar-menu-cell {
		cursor: pointer;
	}
	// 控制按钮组样式
	.control-button-group {
		height: fit-content;
	}
	// 过滤器面板样式
	.filter-control-panel {
		display: flex;
		flex-flow: row wrap;
		// background: wheat;
		margin: 0 2px 2px 0;

		// 尺寸过滤器
		&.size-filter {
			flex: 2;
			flex-wrap: wrap;

			.filter-input {
				flex: 1;
				min-width: 320px;
				max-width: 600px;
				font-size: 12px;
				display: flex;
				align-items: center;
				margin: 0 4px;
				padding: 6px 0;

				.filter-input-slider {
					margin: 0 8px;
				}
				:deep(.wic2-input__wrapper) {
					padding-left: 0;
					padding-right: 26px;
					.wic2-input__inner {
						text-align: start;
					}
				}
				:deep(.wic2-slider__button-wrapper) {
					width: unset;
				}
			}

			// 标签样式
			.filter-input .input-slider-label {
				display: flex;
				align-items: center;
				width: 60px;
				font-size: 14px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin-bottom: 0;
				user-select: none;
			}
		}

		// 其他选择器
		&.other-filter {
			flex: 1;
			flex-wrap: wrap;
			align-items: center;
			// 选择器样式
			.filter-input-select {
				flex: 1;
				width: 150px;
				min-width: 150px;
				max-width: 200px;
				margin: 0 2px;
			}

			:deep(.v-field),
			:deep(.v-input) {
				height: fit-content;
			}
		}

		:deep(input) {
			padding: 0 4px;
			background-color: unset;
		}
	}

	:deep(.v-slider) input {
		background: unset;
		border: unset;
		box-shadow: unset;
		margin: unset;
		padding: unset;
		border-radius: unset;
		border: unset;
		font-size: unset;
		color: unset;
	}
</style>
