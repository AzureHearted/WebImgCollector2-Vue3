<template>
	<div class="waterfall-wrapper" @wheel.stop>
		<BaseVirtualScrollbar>
			<WaterFallList :data="(cardList as any)" item-padding="1px">
				<template #default="{ item }">
					<GalleryCard
						:data="item"
						@change:selected="item.isSelected = $event" />
				</template>
			</WaterFallList>
		</BaseVirtualScrollbar>
	</div>
</template>

<script setup lang="ts">
	import { ref, reactive, computed, watch } from "vue";
	import type { ComputedRef } from "vue";
	import type { BaseCard } from "@/stores/cardStore/interface";

	import WaterFallList from "@/components/base/waterfall-list.vue"; // 瀑布流组件
	import BaseVirtualScrollbar from "@/components/base/base-virtual-scrollbar.vue";
	import GalleryCard from "./gallery-card.vue";

	import { useCardStore } from "@/stores";

	const cardStore = useCardStore();

	// 卡片列表
	const cardList: ComputedRef<BaseCard[]> = computed(() => {
		return cardStore.filteredCardList;
	});
</script>

<style lang="less" scoped>
	// 瀑布流容器样式
	.waterfall-wrapper {
		flex: 1;
		padding: 2px;
		scroll-behavior: smooth;
		overflow: clip; // 必须要设置溢出裁切
	}
</style>
