<template>
	<n-flex class="favorite__container" vertical :size="4">
		<n-flex :size="4">
			<n-input
				style="width: 200px"
				v-model:value="filterKeyword"
				type="text"
				placeholder="输入检索关键词"
				clearable />
		</n-flex>
		<n-flex class="waterfall-wrapper" :size="4">
			<BaseScrollbar>
				<WaterFallList :data="(filterCardList as any)" item-padding="2px">
					<template #default="{ item }">
						<GalleryCard
							:data="(item as any)"
							viewport-selector=".favorite__container .waterfall-wrapper"
							@change:selected="item.isSelected = $event"
							@download="handleDownload(item as any)"
							@delete="deleteCard(item as any)" />
					</template>
				</WaterFallList>
			</BaseScrollbar>
		</n-flex>
	</n-flex>
</template>

<script setup lang="ts">
	import { ref, reactive, onMounted, onUnmounted, onActivated } from "vue";
	import { storeToRefs } from "pinia";
	import BaseScrollbar from "@/components/base/base-scrollbar.vue";
	import WaterFallList from "@/components/base/waterfall-list.vue";
	import GalleryCard from "../gallery/gallery-card.vue";
	import Card from "@/stores/CardStore/class/Card";

	import { useFavoriteStore } from "@/stores";
	const favoriteStore = useFavoriteStore();
	const { cardList, filterCardList, filterKeyword } =
		storeToRefs(favoriteStore);
	const { refreshStore, clearStore, addCard, deleteCard, downloadCards } =
		favoriteStore;

	onMounted(() => refreshStore());
	onActivated(() => refreshStore());

	// 处理卡片下载
	const handleDownload = async (card: Card) => {
		await downloadCards([card]);
		// 重新添加,以更新卡片在数据库中的数据
		addCard([card]);
	};

	// 等待实现: 需要对收藏页面进行多级分类
</script>

<style lang="scss" scoped>
	.favorite__container {
		position: relative;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		padding: 4px;
		overflow: hidden;
	}

	.waterfall-wrapper {
		flex: 1;
		scroll-behavior: smooth;
		overflow: clip; // 必须要设置溢出裁切
		border-radius: 4px;
	}
</style>
