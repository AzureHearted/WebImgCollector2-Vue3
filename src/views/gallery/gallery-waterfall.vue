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
						viewport-selector=".web-img-collector-container"
						@change:selected="item.isSelected = $event"
						@delete="handleDelete"
						@loaded="handleLoaded"
						@download="handleDownload"
						@toggle-favorite="handleToFavorite(item.id, $event)" />
				</template>
			</WaterFallList>
		</BaseScrollbar>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, watch, nextTick, onActivated } from "vue";
	import type { ComputedRef } from "vue";
	import type { BaseCard } from "@/stores/CardStore/interface";
	import WaterFallList from "@/components/base/waterfall-list.vue"; // 瀑布流组件
	import BaseScrollbar from "@/components/base/base-scrollbar.vue";
	import type { returnInfo } from "@/components/base/base-img.vue";
	import GalleryCard from "./gallery-card.vue";
	import { isMobile } from "@/utils/common";
	// import { useCardStore, useFavoriteStore } from "@/stores";
	import useCardStore from "@/stores/CardStore";
	import useFavoriteStore from "@/stores/FavoriteStore";

	const cardStore = useCardStore();
	const favoriteStore = useFavoriteStore();

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

	//f 卡片加载成功完成事件
	const handleLoaded = async (id: string, info: returnInfo) => {
		// 仓库找到对应的数据
		const index = cardStore.validCardList.findIndex((x) => x.id === id);
		if (index < 0) return;
		const card = cardStore.validCardList[index];
		if (card.isLoaded) return; //如果已经成功加载过了就不在执行
		card.isLoaded = true; // 置为加载成功
		// console.count("卡片加载完成");
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
		// 判断是否被收藏
		// 先刷新仓库数据
		await favoriteStore.refreshStore();
		// 然后判断该card是否被收藏
		card.isFavorite = await favoriteStore.isExist(card);
	};
	//f 执行卡片删除
	const handleDelete = (id: string) => {
		cardStore.removeCard([id]);
	};
	//f 处理下载事件
	const handleDownload = async (id: string) => {
		console.log("下载", id);
		const card = cardStore.findCard(id);
		if (!card) return;
		cardStore.downloadCards([card]);
	};

	//f 处理收藏切换
	const handleToFavorite = async (id: string, val: boolean) => {
		const card = cardStore.findCard(id);
		if (!card) return;
		if (val) {
			card.isFavorite = true;
			favoriteStore.addCard([card]);
		} else {
			card.isFavorite = false;
			favoriteStore.unFavoriteCard([card]);
		}
	};

	onActivated(() => {
		favoriteStore.refreshStore();
		cardStore.validCardList.forEach(async (c) => {
			c.isFavorite = await favoriteStore.isExist(c);
		});
	});
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
