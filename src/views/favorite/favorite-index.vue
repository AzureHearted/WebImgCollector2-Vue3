<template>
	<n-flex class="favorite__container" vertical :size="4">
		<!-- 工具栏 -->
		<n-flex :size="4">
			<n-badge :value="filterCardList.length" :max="999" type="info">
				<n-input
					style="width: 200px"
					v-model:value="filterKeyword"
					type="text"
					placeholder="输入检索关键词"
					clearable />
			</n-badge>
		</n-flex>
		<!-- 瀑布流 -->
		<n-flex class="waterfall-wrapper" :size="4">
			<BaseScrollbar>
				<WaterFallList :data="filterCardList" item-padding="2px">
					<template #default="{ item }">
						<GalleryCard
							:data="(item as Card)"
							:show-to-locate-button="false"
							:show-delete-button="false"
							:show-download-button="(item as Card).source.meta.type==='image'"
							viewport-selector=".web-img-collector-container"
							@change:selected="item.isSelected = $event"
							@change:title="updateCard([item as Card])"
							@download="handleDownload(item as Card)"
							@toggle-favorite="handleToggleFavorite(item as Card)"
							@delete="deleteCard([item as Card])" />
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
	const {
		refreshStore,
		clearStore,
		addCard,
		updateCard,
		deleteCard,
		unFavoriteCard,
		downloadCards,
	} = favoriteStore;

	onMounted(() => refreshStore());
	onActivated(() => refreshStore());

	// 处理卡片下载
	const handleDownload = async (card: Card) => {
		await downloadCards([card]);
		// 更新卡片
		updateCard([card]);
	};

	// 处理收藏/取消收藏
	const handleToggleFavorite = (card: Card) => {
		unFavoriteCard([card]);
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
		padding-top: 10px;
		overflow: hidden;
	}

	.waterfall-wrapper {
		flex: 1;
		scroll-behavior: smooth;
		overflow: clip; // 必须要设置溢出裁切
		border-radius: 4px;
	}
</style>
