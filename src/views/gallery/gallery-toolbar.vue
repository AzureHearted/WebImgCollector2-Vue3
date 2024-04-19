<template>
	<div class="gallery-toolbar-container">
		<!-- 工具栏 -->
		<v-sheet
			class="gallery-toolbar"
			width="100%"
			color="transparent"
			:elevation="4">
			<!-- 进度条 -->
			<v-progress-linear
				class="gallery-toolbar-loading"
				color="primary"
				:active="loadingStore.loading"
				:max="loadingStore.total"
				:model-value="loadingStore.current"
				height="14"
				rounded
				rounded-bar>
				<template #default="{ value }">
					<strong> {{ value.toFixed(2) }}% </strong>
				</template>
			</v-progress-linear>
			<!-- 操作栏 -->
			<v-sheet
				class="gallery-container-control-panel"
				:elevation="0"
				color="transparent"
				width="fit-content">
				<!-- 控制按钮组 -->
				<var-badge
					:offset-y="2"
					:offset-x="-8"
					style="z-index: 2"
					:hidden="!cardStore.validCardList.length"
					:value="cardStore.validCardList.length">
					<var-menu
						placement="bottom"
						:default-style="false"
						same-width
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
								<IconArrowDown style="width: 24px; fill: white" />
							</var-button>
						</var-button-group>
						<template #menu>
							<var-button-group
								:size="isMobile() ? 'small' : 'normal'"
								vertical>
								<!-- 清空按钮 -->
								<var-button type="danger" icon-container block @click="clear">
									<IconCloseCircleMultiple
										class="gallery-toolbar-icon"
										style="margin: 0 12px 0 0; fill: white" />
									清空
								</var-button>
							</var-button-group>
						</template>
					</var-menu>
				</var-badge>
			</v-sheet>
			<!-- 选择器 -->
			<v-sheet
				class="gallery-container-control-panel"
				:elevation="0"
				color="transparent"
				width="fit-content">
				<!-- 选择器按钮组 -->
				<var-button-group
					class="control-button-group"
					:size="isMobile() ? 'small' : 'normal'">
					<var-button type="primary" @click="checkAll"> 全选 </var-button>
					<var-button type="info" @click="inverseAll"> 反选 </var-button>
					<var-button @click="cancel"> 取消 </var-button>
				</var-button-group>
			</v-sheet>
			<!-- 下载控制 -->
			<v-sheet
				class="gallery-container-control-panel"
				:elevation="0"
				color="transparent"
				width="fit-content">
				<!-- 下载按钮 -->
				<var-badge
					type="info"
					:offset-y="2"
					style="z-index: 1"
					:hidden="!checkedCardList.length"
					:value="checkedCardList.length">
					<var-menu
						placement="bottom"
						:default-style="false"
						:trigger="isMobile() ? 'click' : 'hover'"
						:teleport="false">
						<var-button-group
							:size="isMobile() ? 'small' : 'normal'"
							type="primary">
							<var-button @click.stop="downloadSelected"> 选中下载 </var-button>
							<var-button style="padding: 0 4px">
								<IconArrowDown style="width: 24px; fill: white" />
							</var-button>
						</var-button-group>
						<template #menu>
							<var-button-group
								:size="isMobile() ? 'small' : 'normal'"
								vertical>
								<var-button
									icon-container
									block
									@click="downloadAll"
									:elevation="false">
									<IconDownload
										class="gallery-toolbar-icon"
										style="margin: 0 8px 0 0" />
									全部下载
								</var-button>
							</var-button-group>
						</template>
					</var-menu>
				</var-badge>
			</v-sheet>
			<!-- 其他过滤器 -->
			<v-sheet
				class="filter-control-panel other-filter"
				width="fit-content"
				color="transparent"
				:elevation="0">
				<!-- 类型过滤器 -->
				<v-select
					class="filter-input-select select-type"
					v-model="cardStore.filters.type"
					:items="cardStore.typeOptions"
					variant="solo"
					label="类型过滤"
					item-title="label"
					item-value="value"
					density="compact"
					chips
					hide-details
					multiple>
					<template #chip="{ item, index }">
						<v-chip v-if="index < 2" density="compact">
							<span>{{ item.title }}</span>
						</v-chip>
						<span
							v-if="index === 2"
							class="text-grey text-caption align-self-center">
							+ {{ cardStore.filters.type.length - 2 }}
						</span>
					</template>
					<template #item="{ item, props }">
						<v-list-item
							v-bind="props"
							density="compact"
							:subtitle="`${item.raw.count}个`">
							<template #prepend="{ isActive }">
								<v-checkbox
									density="compact"
									:model-value="isActive"
									:ripple="false"
									hide-details></v-checkbox>
							</template>
							<template #title="{ title }">
								<span style="font-size: 14px">
									{{ title }}
								</span>
							</template>
							<template #subtitle="{ subtitle }">
								<span style="font-size: 12px">
									{{ subtitle }}
								</span>
							</template>
						</v-list-item>
					</template>
				</v-select>
				<!-- 扩展名过滤器 -->
				<v-select
					class="filter-input-select select-type"
					v-model="cardStore.filters.extension"
					:items="cardStore.extensionOptions"
					variant="solo"
					label="扩展名过滤"
					item-title="label"
					item-value="value"
					density="compact"
					chips
					hide-details
					multiple>
					<template #chip="{ item, index }">
						<v-chip v-if="index < 2" density="compact">
							<span>{{ item.title }}</span>
						</v-chip>
						<span
							v-if="index === 2"
							class="text-grey text-caption align-self-center">
							+ {{ cardStore.filters.extension.length - 2 }}
						</span>
					</template>
					<template #item="{ item, props }">
						<v-list-item
							v-bind="props"
							density="compact"
							:subtitle="`${item.raw.count}个`">
							<template #prepend="{ isActive }">
								<v-checkbox
									density="compact"
									:model-value="isActive"
									:ripple="false"
									hide-details></v-checkbox>
							</template>
							<template #title="{ title }">
								<span style="font-size: 14px">
									{{ title }}
								</span>
							</template>
							<template #subtitle="{ subtitle }">
								<span style="font-size: 12px">
									{{ subtitle }}
								</span>
							</template>
						</v-list-item>
					</template>
				</v-select>
			</v-sheet>
			<!-- 尺寸过滤器 -->
			<v-sheet
				class="filter-control-panel size-filter"
				color="transparent"
				:elevation="0">
				<!-- 宽度过滤器 -->
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
	import { ref, reactive, computed, watch } from "vue";
	import type { ComputedRef } from "vue";
	import type { BaseCard } from "@/stores/cardStore/interface";
	// 导入svg
	import IconDownload from "@svg/download.svg";
	import IconArrowDown from "@svg/arrow-down.svg";
	import IconCloseCircleMultiple from "@svg/close-circle-multiple.svg";

	// 导入公用ts库
	import { isMobile } from "@/utils/common";

	// 导入仓库
	import { useCardStore, useLoadingStore } from "@/stores";
	import { Snackbar } from "@varlet/ui";
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

	// 获取卡片
	async function getCards() {
		await cardStore.getPageCard();
	}

	// 过滤器改变
	function filterChange(key: "width" | "height", value: [number, number]) {
		// console.log("过滤器变化", key, value);
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
</script>

<style lang="less" scoped>
	// 工具栏容器
	.gallery-toolbar-container {
		position: relative;
	}

	.gallery-toolbar-loading {
		margin: 4px 0;
	}

	// 工具栏样式
	.gallery-toolbar {
		flex: 0;
		display: flex;
		flex-flow: row wrap;
		padding: 4px 4px 0 4px;
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
		padding: 4px 0;

		// 尺寸过滤器
		&.size-filter {
			flex: 1;
			flex-wrap: wrap;

			.filter-input-slider {
				flex: 1;
				min-width: 320px;
				max-width: 600px;
				font-size: 12px;
			}

			// 标签样式
			.filter-input-slider .input-slider-label {
				margin: 0 10px 2px 0;
				font-size: 14px;
			}
			.filter-input-number {
				flex: 0 1 auto;
				position: relative;
				width: 70px;
				border: 0;
			}
		}

		// 其他选择器
		&.other-filter {
			flex: 0 content;
			flex-wrap: wrap;

			// 选择器样式
			.filter-input-select {
				flex: 1;
				width: 200px;
				min-width: 150px;
				max-width: 200px;
				margin: 0 2px;
			}
		}

		:deep(input) {
			padding: 0 4px;
		}
	}
</style>
