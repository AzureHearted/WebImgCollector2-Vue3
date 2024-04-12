<template>
	<div class="gallery-container">
		<!-- 顶部工具栏 -->
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
				<var-space :wrap="false" :size="[4, 4]">
					<var-tooltip
						content="全部下载"
						teleport=".online-gallery-top-container">
						<var-button size="normal" type="primary" @click="checkAll">
							<var-icon name="download" />
						</var-button>
					</var-tooltip>
					<var-tooltip
						content="选中下载"
						teleport=".online-gallery-top-container">
						<var-badge
							type="info"
							:offset-y="4"
							:hidden="!checkedCardList.length"
							:value="checkedCardList.length">
							<var-button size="normal" type="primary" @click="inverseAll">
								<var-icon name="download-outline" />
							</var-button>
						</var-badge>
					</var-tooltip>
				</var-space>
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
					<template v-slot:prepend>
						<v-text-field
							class="filter-input-number"
							v-model="filters.size.width[0]"
							density="compact"
							type="number"
							variant="outlined"
							hide-details
							single-line></v-text-field>
					</template>
					<template v-slot:append>
						<v-text-field
							class="filter-input-number"
							v-model="filters.size.width[1]"
							density="compact"
							type="number"
							variant="outlined"
							hide-details
							single-line></v-text-field>
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
					<template v-slot:prepend>
						<v-text-field
							class="filter-input-number"
							v-model="filters.size.height[0]"
							density="compact"
							type="number"
							variant="outlined"
							hide-details
							single-line></v-text-field>
					</template>
					<template v-slot:append>
						<v-text-field
							class="filter-input-number"
							v-model="filters.size.height[1]"
							density="compact"
							type="number"
							variant="outlined"
							hide-details
							single-line></v-text-field>
					</template>
				</v-range-slider>
			</v-sheet>
		</v-sheet>
		<!-- 瀑布流 -->

		<div class="waterfall-wrapper" @wheel.stop>
			<BaseVirtualScrollbar>
				<WaterFallList :data="(cardList as any)" item-padding="1px">
					<template #default="{ item }">
						<BaseImgCard
							style="border-radius: 4px; overflow: hidden"
							:data="item"
							:img-url="item.url"
							:img-thumb="item.thumb">
							<!-- 卡片顶部 -->
							<template #header>
								<div class="card-header">
									<!-- 卡片按钮组 -->
									<!-- 删除 -->
									<div class="card-button-group">
										<var-button-group type="primary" size="mini">
											<var-button type="danger" @click="toRemove(item)">
												<var-icon name="trash-can" />
											</var-button>
										</var-button-group>
										<var-button-group size="mini">
											<!-- 在页面中定位 -->
											<var-button type="primary" @click="toLocate(item)">
												<var-icon name="map-marker-outline" />
											</var-button>
											<!-- 下载 -->
											<var-button type="default" @click="toDownload(item)">
												<var-icon name="download" />
											</var-button>
										</var-button-group>
									</div>
									<!-- 复选框 -->
									<div class="card-checkbox">
										<BaseCheckbox v-model="item.isSelected"> </BaseCheckbox>
									</div>
								</div>
							</template>
							<!-- 卡片主体(图片) -->
							<template #default>
								<BaseImg
									:src="item.url"
									:href="item.url"
									:thumb="item.thumb"
									:init-width="item.width"
									:init-height="item.height"
									data-fancybox="online-gallery"
									:data-thumb="item.thumb"
									:data-download-src="item.url"
									@loaded="handleCardLoaded(item, $event)"
									:draggable="false"></BaseImg>
							</template>
							<!-- 卡片底部 -->
							<template #footer>
								<div class="card-footer">
									<var-chip type="info" size="small">
										{{ item.width }}x{{ item.height }}
									</var-chip>
								</div>
							</template>
						</BaseImgCard>
					</template>
				</WaterFallList>
			</BaseVirtualScrollbar>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, reactive, computed, watch, toRef } from "vue";
	import type { ComputedRef } from "vue";
	import WaterFallList from "@/components/base/waterfall-list.vue"; // 瀑布流组件
	import BaseImgCard from "@/components/base/base-img-card.vue";
	import BaseImg from "@/components/base/base-img.vue";
	import BaseCheckbox from "@/components/base/base-checkbox.vue";
	import BaseVirtualScrollbar from "@/components/base/base-virtual-scrollbar.vue";
	import type { returnInfo } from "@/components/base/base-img.vue";

	// 导入仓库
	import { useGlobalStore, useCardStore } from "@/stores";
	import type { BaseCard } from "@/stores/cardStore/interface";
	import type { findLast } from "lodash";
	const globalStore = useGlobalStore();
	const cardStore = useCardStore();

	interface IData {
		url: string; // 图片URL
		thumb: string; // 缩略图URL
		width: number;
		height: number;
		[K: keyof BaseCard]: any; // 继承BaseCard的属性，确保类型安全。
	}

	// 卡片列表
	const cardList: ComputedRef<BaseCard[]> = computed(() => {
		return cardStore.filteredCardList.map((x) => {
			(x as BaseCard).url = x.source.url;
			(x as BaseCard).thumb = x.preview.url;
			(x as BaseCard).width = x.preview.meta?.width ? x.preview.meta.width : 0;
			(x as BaseCard).height = x.preview.meta?.height
				? x.preview.meta.height
				: 0;
			return x as any;
		});
	});

	// 状态数据
	const state = reactive({
		loading: false,
	});

	// 被选中的卡片
	const checkedCardList: ComputedRef<BaseCard[]> = computed(() => {
		return cardList.value.filter((x) => x.isSelected);
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

	// 监听card仓库卡片尺寸最大值变化
	watch(
		() => [cardStore.info.size.width[1], cardStore.info.size.height[1]],
		([width, height]) => {
			// console.log("过滤器变化", width, height);
			// 更新组件过滤器最大值
			filters.size.width[1] = width;
			filters.size.height[1] = height;
		}
	);

	// 过滤器变化的回调
	function filterChange(key: "width" | "height", value: [number, number]) {
		// console.log("过滤器变化", key, value);
		cardStore.filters.size[key] = value; // 更新仓库过滤器
	}

	// 获取卡片
	async function getCards() {
		state.loading = true;
		await cardStore.getPageCard();
		state.loading = false;
	}

	// 全选
	function checkAll() {
		cardList.value.forEach((c) => (c.isSelected = true));
	}

	// 反选
	function inverseAll() {
		cardList.value.forEach((c) => (c.isSelected = !c.isSelected));
	}

	// 取消
	function cancel() {
		cardList.value.forEach((c) => (c.isSelected = false));
	}

	// 清空
	function clear() {
		// data.cardList = [];
		cardStore.clearCardList();
		filters.size.width = cardStore.filters.size.width;
		filters.size.height = cardStore.filters.size.height;
	}

	// 页面定位元素
	function toLocate(item: BaseCard) {
		// console.log("定位元素", item);
		(item.source.dom as HTMLElement).scrollIntoView({
			behavior: "smooth",
			inline: "center",
			block: "center",
		}); // 滚动到指定元素位置，平滑滚动，并居中显示。
		globalStore.openWindow = false;
	}
	// 删除卡片
	function toRemove(item: Pick<BaseCard, "id">) {
		// 删除卡片数据模型中的卡片。
		cardStore.removeCard(item.id!); // 删除卡片数据模型中的卡片。
	}
	// 下载
	function toDownload(item: Pick<BaseCard, "id">) {
		console.log("下载", item);
	}

	// 处理卡片加载完成的事件
	function handleCardLoaded(item: Pick<BaseCard, "id">, info: returnInfo) {
		// 仓库找到对应的数据
		const index = cardStore.data.cardList.findIndex((x) => x.id === item.id);
		const card = cardStore.data.cardList[index];
		// 刷新仓库对应卡片的preview.meta信息
		card.preview.meta = { ...card.preview.meta, ...info.meta };
	}
</script>

<style lang="less" scoped>
	// 画廊容器样式
	.gallery-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-flow: column;
		overflow: hidden;
	}
	// 工具栏样式
	.gallery-container-toolbar {
		flex: 0;
		display: flex;
		flex-flow: row wrap;
		padding: 10px 4px 0 4px;
		background: transparent;
		align-content: center;
		justify-content: center;
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
			width: 64px;
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
	// 瀑布流容器样式
	.waterfall-wrapper {
		flex: 1;
		padding: 2px;
		scroll-behavior: smooth;
		overflow: clip; // 必须要设置溢出裁切
	}

	.card-button-group {
		position: absolute;
		top: 4px;
		right: 4px;
		height: fit-content;
		display: flex;
		gap: 4px;
	}

	.card-checkbox {
		position: absolute;
		top: 4px;
		left: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		filter: drop-shadow(0 0 1px #ffffff);

		::v-deep .var-checkbox__wrap {
			width: 26px;
			aspect-ratio: 1;
		}
	}

	.card-footer {
		padding: 4px;
	}

	/* 下面我们会解释这些 class 是做什么的 */
	.v-enter-active,
	.v-leave-active {
		transition: opacity 0.5s ease;
	}

	.v-enter-from,
	.v-leave-to {
		opacity: 0;
	}
</style>
