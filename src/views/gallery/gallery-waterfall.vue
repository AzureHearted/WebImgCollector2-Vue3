<template>
	<div
		ref="waterfallContainer"
		class="waterfall-wrapper"
		@wheel.stop
		@scroll.stop>
		<BaseScrollbar
			ref="scrollbar"
			:show-scrollbar="showScrollbar"
			show-bakctop-button>
			<WaterFallList :data="(cardList as any)" item-padding="2px">
				<template #default="{ item }">
					<GalleryCard
						:data="(item as any)"
						@change:selected="item.isSelected = $event"
						@delete="handleDelete"
						@loaded="handleLoaded"
						@download="handleDownload" />
				</template>
			</WaterFallList>
		</BaseScrollbar>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, watch, nextTick } from "vue";
	import type { ComputedRef } from "vue";
	import type { BaseCard } from "@/stores/cardStore/interface";
	import WaterFallList from "@/components/base/waterfall-list.vue"; // 瀑布流组件
	import BaseScrollbar from "@/components/base/base-scrollbar.vue";
	import type { returnInfo } from "@/components/base/base-img.vue";
	import GalleryCard from "./gallery-card.vue";
	import { useCardStore } from "@/stores";
	import { isMobile } from "@/utils/common";

	const cardStore = useCardStore();

	const waterfallContainer = ref<HTMLElement | null>(null);

	// 卡片列表
	const cardList: ComputedRef<BaseCard[]> = computed(() => {
		return cardStore.filteredCardList;
	});

	const scrollbar = ref<InstanceType<typeof BaseScrollbar> | null>(null);
	const showScrollbar = ref(!isMobile());

	watch(
		() => cardStore.filteredCardList,
		(newList, oldList) => {
			if (scrollbar.value && newList.length === 0 && oldList.length > 0) {
				// 手动刷新showScrollbar,临时解决scrollbar组件中wrapper的scroll尺寸未及时更新的bug
				showScrollbar.value = !showScrollbar.value;
				nextTick(() => {
					setTimeout(() => {
						showScrollbar.value = !showScrollbar.value;
					}, 1000);
				});
			}
		}
	);

	// 卡片加载成功完成事件
	const handleLoaded = (id: string, info: returnInfo) => {
		// 仓库找到对应的数据
		const index = cardStore.validCardList.findIndex((x) => x.id === id);
		if (index < 0) return;
		const card = cardStore.validCardList[index];
		// 刷新仓库对应卡片的preview.meta信息
		card.preview.meta = { ...card.preview.meta, ...info.meta };
		if (
			card.preview.meta.width > card.source.meta.width &&
			card.preview.meta.height > card.source.meta.height
		) {
			card.source.meta.width = card.preview.meta.width;
			card.source.meta.height = card.preview.meta.height;
			// 更新仓库的尺寸范围信息
			cardStore.info.size.width[1] = Math.max(
				cardStore.info.size.width[1],
				card.source.meta.width
			);
			cardStore.info.size.height[1] = Math.max(
				cardStore.info.size.height[1],
				card.source.meta.height
			);
			// 同步更新仓库尺寸过滤器的最高值
		}
	};
	// 执行卡片删除
	const handleDelete = (id: string) => {
		cardStore.removeCard([id]);
	};
	// 处理下载事件
	const handleDownload = async (id: string) => {
		console.log("下载", id);
		cardStore.downloadCards([id]);
	};
</script>

<style lang="scss" scoped>
	// 瀑布流容器样式
	.waterfall-wrapper {
		flex: 1;
		padding: 4px;
		scroll-behavior: smooth;
		overflow: clip; // 必须要设置溢出裁切
	}
</style>
