<template>
	<BaseScrollbar>
		<WaterFallList
			:data="cardList"
			:pause-layout="!globalStore.openWindow"
			item-padding="2px">
			<template #default="{ item }">
				<GalleryCard
					v-model:data="(item as Card)"
					:show-to-locate-button="false"
					:show-delete-button="false"
					:show-download-button="(item as Card).source.meta.type!=='html'"
					viewport-selector=".web-img-collector-container"
					@change:selected="item.isSelected = $event"
					@change:title="updateCard([item as Card])"
					@loaded="handleLoaded"
					@download="handleDownload(item as Card)"
					@toggle-favorite="handleToggleFavorite(item as Card)"
					@save:tags="handleTagsSave(item as Card)"
					@delete="deleteCard([item as Card])" />
			</template>
		</WaterFallList>
	</BaseScrollbar>
</template>

<script setup lang="ts">
	import { defineProps, withDefaults } from "vue";
	import BaseScrollbar from "@/components/base/base-scrollbar.vue";
	import WaterFallList from "@/components/base/waterfall-list.vue";
	import GalleryCard from "../gallery/gallery-card.vue";
	import Card from "@/stores/CardStore/class/Card";
	import type { returnInfo } from "@/components/base/base-img.vue";

	import useFavoriteStore from "@/stores/FavoriteStore";
	import useGlobalStore from "@/stores/GlobalStore";
	import { isEqualUrl } from "@/utils/common";

	const favoriteStore = useFavoriteStore();
	const globalStore = useGlobalStore();

	const {
		updateCard,
		deleteCard,
		unFavoriteCard,
		downloadCards,
		refreshStore,
		findCardById,
	} = favoriteStore;

	withDefaults(
		defineProps<{
			cardList: Card[];
		}>(),
		{
			cardList: () => [],
		}
	);

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

	//f 卡片加载成功完成事件( 1.更新cardStore的尺寸范围信息;2.判断卡片是否被收藏 )
	const handleLoaded = async (id: string, info: returnInfo) => {
		//s 仓库找到对应的数据
		const card = await findCardById(id);
		if (!card) return; //* 如果卡片不存在也不在向下执行
		if (card.isLoaded) return; //* 如果已经成功加载过了就不在执行
		card.isLoaded = true; //s 置为加载成功
		// console.count("卡片加载完成");
		//s 刷新仓库对应卡片的preview.meta信息
		card.preview.meta = { ...card.preview.meta, ...info.meta };
		if (
			isEqualUrl(card.preview.url, card.source.url) &&
			(card.preview.meta.width > card.source.meta.width ||
				card.preview.meta.height > card.source.meta.height)
		) {
			card.source.meta = card.preview.meta;
			updateCard([card]);
		}
	};

	//f 处理卡片标签变化
	const handleTagsSave = async (card: Card) => {
		updateCard([card]);
	};
</script>

<style lang="scss" scoped></style>