<template>
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
											<IconTrashCan style="width: 20px; fill: white" />
										</var-button>
									</var-button-group>
									<var-button-group size="mini">
										<!-- 在页面中定位 -->
										<var-button type="primary" @click="toLocate(item)">
											<IconMapMarker style="width: 20px; fill: white" />
										</var-button>
										<!-- 下载 -->
										<var-button type="default" @click="toDownload(item)">
											<IconDownload style="width: 20px; fill: #333" />
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
</template>

<script setup lang="ts">
	import { ref, reactive, computed, watch } from "vue";
	import type { ComputedRef } from "vue";
	import type { BaseCard } from "@/stores/cardStore/interface";
	import type { returnInfo } from "@/components/base/base-img.vue";

	import WaterFallList from "@/components/base/waterfall-list.vue"; // 瀑布流组件
	import BaseImgCard from "@/components/base/base-img-card.vue";
	import BaseImg from "@/components/base/base-img.vue";
	import BaseCheckbox from "@/components/base/base-checkbox.vue";
	import BaseVirtualScrollbar from "@/components/base/base-virtual-scrollbar.vue";
	import IconDownload from "@svg/download-2.svg";
	import IconMapMarker from "@svg/map-marker-outline.svg";
	import IconTrashCan from "@svg/trash-can.svg";

	import { useGlobalStore, useCardStore } from "@/stores";

	const globalStore = useGlobalStore();
	const cardStore = useCardStore();

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

	// 处理卡片加载完成的事件
	function handleCardLoaded(item: Pick<BaseCard, "id">, info: returnInfo) {
		// 仓库找到对应的数据
		const index = cardStore.data.cardList.findIndex((x) => x.id === item.id);
		const card = cardStore.data.cardList[index];
		// 刷新仓库对应卡片的preview.meta信息
		card.preview.meta = { ...card.preview.meta, ...info.meta };
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
</script>

<style lang="less" scoped>
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

		// 修正样式
		:deep(.var-button-group) {
			overflow: hidden;
		}
	}

	.card-checkbox {
		position: absolute;
		top: 4px;
		left: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		filter: drop-shadow(0 0 1px #ffffff);
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
