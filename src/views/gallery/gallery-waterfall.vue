<template>
	<div
		ref="waterfallContainer"
		class="waterfall-wrapper"
		@wheel.stop
		@scroll.stop>
		<BaseVirtualScrollbar ref="scrollbar" :show-scrollbar="showScrollbar">
			<WaterFallList :data="(cardList as any)" item-padding="2px">
				<template #default="{ item }">
					<GalleryCard
						:data="(item as any)"
						@change:selected="item.isSelected = $event" />
				</template>
			</WaterFallList>
		</BaseVirtualScrollbar>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, watch, nextTick } from "vue";
	import type { ComputedRef } from "vue";
	import type { BaseCard } from "@/stores/cardStore/interface";

	import WaterFallList from "@/components/base/waterfall-list.vue"; // 瀑布流组件
	import BaseVirtualScrollbar from "@/components/base/base-virtual-scrollbar.vue";
	import GalleryCard from "./gallery-card.vue";

	import { useCardStore } from "@/stores";
	import { isMobile } from "@/utils/common";

	const cardStore = useCardStore();

	const waterfallContainer = ref<HTMLElement | null>(null);

	// 卡片列表
	const cardList: ComputedRef<BaseCard[]> = computed(() => {
		return cardStore.filteredCardList;
	});

	const scrollbar = ref<InstanceType<typeof BaseVirtualScrollbar> | null>(null);
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
</script>

<style lang="scss" scoped>
	// 瀑布流容器样式
	.waterfall-wrapper {
		flex: 1;
		padding: 2px;
		scroll-behavior: smooth;
		overflow: clip; // 必须要设置溢出裁切
	}
</style>
