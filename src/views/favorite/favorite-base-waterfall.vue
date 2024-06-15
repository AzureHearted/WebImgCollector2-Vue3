<template>
	<BaseScrollbar>
		<WaterFallList
			:data="cardList"
			:pause-layout="!globalStore.openWindow"
			item-padding="2px">
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
</template>

<script setup lang="ts">
	import { defineProps, withDefaults, onActivated } from "vue";
	import BaseScrollbar from "@/components/base/base-scrollbar.vue";
	import WaterFallList from "@/components/base/waterfall-list.vue";
	import GalleryCard from "../gallery/gallery-card.vue";
	import Card from "@/stores/CardStore/class/Card";

	import useFavoriteStore from "@/stores/FavoriteStore";
	import useGlobalStore from "@/stores/GlobalStore";

	const favoriteStore = useFavoriteStore();
	const globalStore = useGlobalStore();

	const {
		updateCard,
		deleteCard,
		unFavoriteCard,
		downloadCards,
		refreshStore,
	} = favoriteStore;

	const props = withDefaults(
		defineProps<{
			cardList: Card[];
		}>(),
		{
			cardList: () => [],
		}
	);

	//* 挂载和激活时都进行一次filter刷新
	// onMounted(() => refreshStore());
	// onActivated(() => refreshStore());
	onActivated(() => console.log("激活", props.cardList));

	//f 处理卡片下载
	const handleDownload = async (card: Card) => {
		await downloadCards([card]);
		// 更新卡片
		updateCard([card]);
	};

	//f 处理收藏/取消收藏
	const handleToggleFavorite = (card: Card) => {
		unFavoriteCard([card]);
		refreshStore();
	};
</script>

<style lang="scss" scoped></style>
