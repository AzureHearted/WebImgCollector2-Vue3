<template>
	<div>
		<v-sheet class="gallery-container-toolbar" width="100%" :elevation="4">
			<!-- 操作栏 -->
			<v-sheet
				class="gallery-container-control-panel"
				:elevation="0"
				width="fit-content">
				<!-- 控制按钮组 -->
				<var-button-group class="control-button-group" size="normal">
					<var-button type="primary" @click="getCards" :loading="state.loading">
						加载
					</var-button>
					<var-button type="danger" @click="clear">清空</var-button>
				</var-button-group>
			</v-sheet>
			<!-- 选择器 -->
			<v-sheet
				class="gallery-container-control-panel"
				:elevation="0"
				width="fit-content">
				<!-- 选择器按钮组 -->
				<var-button-group class="control-button-group" size="normal">
					<var-button type="primary" @click="checkAll"> 全选 </var-button>
					<var-button type="primary" @click="inverseAll"> 反选 </var-button>
					<var-button type="primary" @click="cancel"> 取消 </var-button>
				</var-button-group>
			</v-sheet>
			<!-- 下载控制 -->
			<v-sheet
				class="gallery-container-control-panel"
				:elevation="0"
				width="fit-content">
				<!-- 下载按钮 -->
				<var-badge
					type="info"
					:offset-y="4"
					style="z-index: 1"
					:hidden="!checkedCardList.length"
					:value="checkedCardList.length">
					<var-menu
						placement="bottom"
						same-width
						:trigger="isMobile() ? 'click' : 'hover'"
						teleport=".online-gallery-top-container">
						<var-button-group type="primary">
							<var-button type="primary" @click="downloadSelected">
								选中下载
							</var-button>
							<var-button style="padding: 0 4px">
								<IconArrowDown style="width: 24px; fill: white" />
							</var-button>
						</var-button-group>
						<template #menu>
							<var-cell
								class="gallery-toolbar-menu-cell"
								ripple
								title="全部下载"
								@click="downloadAll">
								<template #icon>
									<IconDownload
										class="gallery-toolbar-icon"
										style="margin: 0 4px 0 0" />
								</template>
							</var-cell>
						</template>
					</var-menu>
				</var-badge>
			</v-sheet>
			<!-- 过滤器 -->
			<v-sheet
				class="gallery-container-control-panel filter-control-panel"
				:elevation="0"
				:width="200">
				<v-range-slider
					class="filter-input-slider"
					label="宽度"
					v-model="filters.size.width"
					color="primary"
					density="compact"
					rounded
					hide-details
					step="1"
					:max="cardStore.info.size.width[1]"
					:min="cardStore.info.size.width[0]"
					:ripple="false"
					@end="filterChange('width', $event)">
					<template #label>
						<v-label class="input-slider-label">宽度</v-label>
					</template>
					<template #prepend>
						<v-text-field
							class="filter-input-number"
							v-model="filters.size.width[0]"
							type="number"
							variant="plain"
							disabled
							hide-details>
						</v-text-field>
					</template>
					<template #append>
						<v-text-field
							class="filter-input-number"
							v-model="filters.size.width[1]"
							type="number"
							variant="plain"
							disabled
							hide-details></v-text-field>
					</template>
				</v-range-slider>
				<!-- 高度过滤器 -->
				<v-range-slider
					class="filter-input-slider"
					label="高度"
					v-model="filters.size.height"
					color="primary"
					density="comfortable"
					rounded
					hide-details
					step="1"
					:max="cardStore.info.size.height[1]"
					:min="cardStore.info.size.height[0]"
					:ripple="false"
					@end="filterChange('height', $event)">
					<template #label>
						<v-label class="input-slider-label">高度</v-label>
					</template>
					<template #prepend>
						<v-text-field
							class="filter-input-number"
							v-model="filters.size.height[0]"
							type="number"
							variant="plain"
							disabled
							hide-details></v-text-field>
					</template>
					<template #append>
						<v-text-field
							class="filter-input-number"
							v-model="filters.size.height[1]"
							type="number"
							variant="plain"
							disabled
							hide-details></v-text-field>
					</template>
				</v-range-slider>
			</v-sheet>
		</v-sheet>
	</div>
</template>

<script setup lang="ts">
	import { ref, reactive, computed } from "vue";
	import type { ComputedRef } from "vue";
	import type { BaseCard } from "@/stores/cardStore/interface";

	import IconDownload from "@svg/download.svg";
	import IconArrowDown from "@svg/arrow-down.svg";

	import { useCardStore } from "@/stores";
	import { isMobile } from "@/utils/common";
	const cardStore = useCardStore();

	// 状态数据
	const state = reactive({
		loading: false,
	});

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

	// 被选中的卡片
	const checkedCardList: ComputedRef<BaseCard[]> = computed(() => {
		return cardStore.data.cardList.filter((x) => x.isSelected);
	});

	// 获取卡片
	async function getCards() {
		state.loading = true;
		await cardStore.getPageCard();
		state.loading = false;
	}

	// 过滤器改变
	function filterChange(key: "width" | "height", value: [number, number]) {
		// console.log("过滤器变化", key, value);
		cardStore.filters.size[key] = value; // 更新仓库过滤器
	}

	// 全选
	function checkAll() {
		cardStore.data.cardList.forEach((c) => (c.isSelected = true));
	}

	// 反选
	function inverseAll() {
		cardStore.data.cardList.forEach((c) => (c.isSelected = !c.isSelected));
	}

	// 取消
	function cancel() {
		cardStore.data.cardList.forEach((c) => (c.isSelected = false));
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
		const ids = cardStore.data.cardList
			.filter((x) => x.isSelected)
			.map((x) => x.id);
		cardStore.downloadCards(ids);
	}

	// 下载全部
	function downloadAll() {
		const ids = cardStore.data.cardList.map((x) => x.id);
		cardStore.downloadCards(ids);
	}
</script>

<style lang="less" scoped>
	// 工具栏样式
	.gallery-container-toolbar {
		flex: 0;
		display: flex;
		flex-flow: row wrap;
		padding: 10px 4px 0 4px;
		background: transparent;
		align-content: center;
	}
	// 控制面板样式
	.gallery-container-control-panel {
		flex: 0;
		// padding: 2px;
		margin-right: 2px;
		margin-bottom: 2px;
		display: flex;
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
		flex: 1 360px;
		display: flex;
		flex-flow: row wrap;
		// background: wheat;
		padding: 4px 0;

		.filter-input-slider {
			flex: 1;
			min-width: 350px;
			max-width: 500px;
			font-size: 12px;
		}
		// 标签样式
		.filter-input-slider .input-slider-label {
			margin: 0 10px 2px 0;
			font-size: 14px;
		}
		.filter-input-number {
			position: relative;
			height: 30px;
			width: 60px;
			border: 0;
		}
		::v-deep .v-field,
		::v-deep .v-field__field,
		::v-deep .v-field__input {
			height: 30px !important;
			min-height: unset;
		}
		::v-deep input {
			padding: 0 4px;
		}
	}
</style>
