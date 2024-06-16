<template>
	<div ref="containerDOM" class="gallery-container">
		<!-- 顶部工具栏 -->
		<GalleryToolbar />
		<!-- 瀑布流 -->
		<n-flex class="content-wrap">
			<n-tabs
				type="line"
				size="small"
				v-model:value="active"
				tab-style="min-width: 80px"
				style="width: 100%; height: 100%">
				<!--s 图片类 -->
				<n-tab-pane
					class="tab-pane"
					name="image"
					:disabled="!filterCardList.image.length">
					<template #tab>
						<n-flex :size="4" align="center" :wrap="false">
							图片
							<n-badge
								:value="filterCardList.image.length"
								:max="999"
								type="default">
							</n-badge>
						</n-flex>
					</template>
					<keep-alive>
						<GalleryBaseWaterfall :card-list="filterCardList.image" />
					</keep-alive>
				</n-tab-pane>
				<!--s 网页类 -->
				<n-tab-pane
					class="tab-pane"
					name="html"
					:disabled="!filterCardList.html.length">
					<template #tab>
						<n-flex :size="4" align="center" :wrap="false">
							网页
							<n-badge
								:value="filterCardList.html.length"
								:max="999"
								type="default">
							</n-badge>
						</n-flex>
					</template>
					<GalleryBaseWaterfall :card-list="filterCardList.html" />
				</n-tab-pane>
				<!--s 其他类 -->
				<n-tab-pane
					class="tab-pane"
					name="other"
					:disabled="!filterCardList.other.length">
					<template #tab>
						<n-flex :size="4" align="center" :wrap="false">
							其他
							<n-badge
								:value="filterCardList.other.length"
								:max="999"
								type="default">
							</n-badge>
						</n-flex>
					</template>
					<GalleryBaseWaterfall :card-list="filterCardList.other" />
				</n-tab-pane>
			</n-tabs>
		</n-flex>
	</div>
</template>

<script setup lang="ts">
	import {
		ref,
		watch,
		onMounted,
		onUpdated,
		onUnmounted,
		onActivated,
		onDeactivated,
	} from "vue";
	import { storeToRefs } from "pinia";
	import GalleryToolbar from "./gallery-toolbar.vue";
	import GalleryBaseWaterfall from "./gallery-base-waterfall.vue";
	import type { BaseMeta } from "@/stores/CardStore/interface";

	import useCardStore from "@/stores/CardStore";
	const cardStore = useCardStore();
	const { filterCardList } = storeToRefs(cardStore);

	//t 排除false的工具类型
	type ExcludeFalse<T> = T extends false ? never : T;
	//s 当前激活的标签
	const active = ref<ExcludeFalse<BaseMeta["type"] | "other">>("image");
	//w 修正监听器
	watch(
		[
			active,
			() => filterCardList.value.image,
			() => filterCardList.value.html,
			() => filterCardList.value.other,
		],
		([nowActive, imageList, htmlList, otherList]) => {
			// console.log(nowActive);
			if (nowActive === "image") {
				if (!imageList.length) {
					if (htmlList.length) {
						active.value = "html";
					} else if (otherList.length) {
						active.value = "other";
					}
				}
			} else if (nowActive === "html") {
				if (!htmlList.length) {
					if (imageList.length) {
						active.value = "image";
					} else if (otherList.length) {
						active.value = "other";
					}
				}
			} else if (nowActive === "other") {
				if (!otherList.length) {
					if (imageList.length) {
						active.value = "image";
					} else if (htmlList.length) {
						active.value = "html";
					}
				}
			}
		},
		{ immediate: true }
	);

	const containerDOM = ref<HTMLElement | null>(null);
	//* 导入Fancybox和相关配置
	import { Fancybox, configFancybox } from "@/plugin/fancyapps-ui";
	onMounted(() => FancyboxBind(containerDOM.value, "[data-fancybox]"));
	onActivated(() => FancyboxBind(containerDOM.value, "[data-fancybox]"));
	onUnmounted(() => Fancybox.destroy());
	onDeactivated(() => Fancybox.destroy());

	onUpdated(() => {
		Fancybox.unbind(containerDOM.value);
		Fancybox.close();
		FancyboxBind(containerDOM.value, "[data-fancybox]");
	});

	//f 执行FancyBox绑定
	function FancyboxBind(
		listContainerDOM: HTMLElement | null,
		itemSelector: string = "[data-fancybox]",
		teleportToDOMs?: HTMLElement
	) {
		Fancybox.bind(listContainerDOM, itemSelector, {
			...configFancybox,
			parentEl: teleportToDOMs ? teleportToDOMs : listContainerDOM,
			hideScrollbar: false,
		});
	}
</script>

<style lang="scss" scoped>
	// 画廊容器样式
	.gallery-container {
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		display: flex;
		flex-flow: column;
		overflow: hidden;
	}
	:deep(input) {
		background: unset;
		box-shadow: unset;
	}

	// 瀑布流容器样式
	.content-wrap {
		padding: 4px;
		flex: 1; // 必须设置用来撑满容器
		overflow: hidden; // 必须要设置溢出隐藏
	}

	.tab-pane {
		height: 100%;
		overflow: hidden;
		box-sizing: border-box;
	}

	:deep(.wic2-n-tabs-tab) {
		padding-left: 12px;
		padding-right: 0px;
	}
</style>
