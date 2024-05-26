<template>
	<BaseImgCard
		:data-show="isMobile()"
		style="overflow: hidden; border: unset"
		:data-checked="data.isSelected"
		class="gallery-card"
		:data="data"
		:img-url="data.source.url"
		:img-thumb="data.preview.url">
		<!-- 卡片顶部 -->
		<template #header>
			<div class="gallery-card-header">
				<div class="gallery-card-header-left">
					<!-- 复选框 -->
					<div class="card-checkbox">
						<BaseCheckbox
							:checked="data.isSelected"
							@change="emits('change:selected', $event)" />
					</div>
				</div>
				<div class="gallery-card-header-right">
					<!-- 卡片按钮组 -->
					<div class="card-button-group">
						<!-- 删除 -->
						<var-button-group type="primary" size="mini">
							<var-button type="danger" @click="toRemove(data)">
								<IconTrashCan style="width: 20px; fill: white" />
							</var-button>
						</var-button-group>
						<var-button-group size="mini">
							<!-- 在页面中定位 -->
							<var-button type="primary" @click="toLocate(data)">
								<IconMapMarker style="width: 20px; fill: white" />
							</var-button>
							<!-- 下载 -->
							<var-button
								:loading="downloading"
								type="default"
								@click="toDownload(data)">
								<IconDownload style="width: 20px; fill: #333" />
							</var-button>
						</var-button-group>
					</div>
				</div>
			</div>
		</template>
		<!-- 卡片主体(图片) -->
		<template #default>
			<div
				data-fancybox="web-img-collector"
				:data-id="data.id"
				:href="data.source.url"
				:data-type="showType"
				:data-width="data.source.meta.width ? data.source.meta.width : false"
				:data-height="data.source.meta.height ? data.source.meta.height : false"
				:data-thumb="data.preview.url"
				:data-download-src="data.source.url">
				<BaseImg
					v-if="data.source.meta.type == 'image'"
					:src="data.source.url"
					use-thumb
					:thumb="data.preview.url"
					:init-width="data.source.meta.width"
					:init-height="data.source.meta.height"
					@loaded="handleCardLoaded(data, $event)"
					:draggable="false"></BaseImg>
				<BaseImg
					v-else
					src=""
					:init-show="true"
					:init-width="data.source.meta.width"
					:init-height="data.source.meta.height"
					@loaded="handleCardLoaded(data, $event)"
					:draggable="false">
					<htmlTypeImg
						style="width: 100%; height: auto; transform: scale(0.5)" />
				</BaseImg>
			</div>
		</template>
		<!-- 卡片底部 -->
		<template #footer>
			<div class="gallery-card-footer">
				<!-- 尺寸信息 -->
				<var-chip
					v-if="data.source.meta.type === 'image'"
					type="primary"
					:size="isMobile() ? 'mini' : 'small'"
					:round="false">
					{{ data.source.meta.width }}x{{ data.source.meta.height }}
				</var-chip>
				<!-- 扩展名信息 -->
				<var-chip
					v-if="!!data.source.meta.ext"
					type="success"
					:size="isMobile() ? 'mini' : 'small'"
					:round="false">
					{{ data.source.meta.ext }}
				</var-chip>
				<!-- 扩展名信息 -->
				<var-chip
					v-if="!!data.source.blob && !!data.source.blob.size"
					type="info"
					:size="isMobile() ? 'mini' : 'small'"
					:round="false">
					{{ size }}
				</var-chip>
			</div>
		</template>
	</BaseImgCard>
</template>

<script setup lang="ts">
	import { computed, defineProps, withDefaults } from "vue";
	import type { ComputedRef } from "vue";
	import BaseImgCard from "@/components/base/base-img-card.vue";
	import BaseImg from "@/components/base/base-img.vue";
	import type { BaseCard } from "@/stores/cardStore/interface";
	import type { returnInfo } from "@/components/base/base-img.vue";

	// 导入公用TS库
	import { byteAutoUnit, isMobile } from "@/utils/common";

	// 导入svg
	import IconDownload from "@svg/download-2.svg";
	import IconMapMarker from "@svg/map-marker-outline.svg";
	import IconTrashCan from "@svg/trash-can.svg";
	import htmlTypeImg from "@svg/html.svg";

	// 导入仓库
	import { useGlobalStore, useCardStore } from "@/stores";
	import { ref } from "vue";
	const globalStore = useGlobalStore();
	const cardStore = useCardStore();

	// const data = defineModel({ type: Card, required: true });
	const props = withDefaults(
		defineProps<{
			data: BaseCard;
		}>(),
		{}
	);
	const emits = defineEmits<{
		(e: "change:selected", val: boolean): void;
	}>();

	// 大小
	const size: ComputedRef<string> = computed(() => {
		const byteSize = props.data.source.blob?.size;
		if (byteSize) {
			return byteAutoUnit(byteSize);
		} else {
			return `0B`;
		}
	});

	// 定义Fancybox的默认类型
	type FancyboxType =
		| "image"
		| "iframe"
		| "youtube"
		| "vimeo"
		| "inline"
		| "html"
		| "ajax"
		| false;
	// 计算默认类型
	const showType: ComputedRef<FancyboxType> = computed(() => {
		const { type: metaType } = props.data.source.meta;
		let type: FancyboxType = "image";
		if (metaType && metaType === "html") {
			type = "iframe";
		}
		return type;
	});

	// 处理卡片加载完成的事件
	function handleCardLoaded(item: Pick<BaseCard, "id">, info: returnInfo) {
		// console.log(info);
		// 仓库找到对应的数据
		const index = cardStore.validCardList.findIndex((x) => x?.id === item.id);
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
		}
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
	const downloading = ref(false);
	async function toDownload(item: Pick<BaseCard, "id">) {
		downloading.value = true;
		console.log("下载", item);
		await cardStore.downloadCards([item.id!]);
		downloading.value = false;
	}
</script>

<style lang="scss" scoped>
	// 卡片顶部
	.gallery-card-header {
		position: relative;
		display: flex;
		padding: 2px 4px;
		justify-content: space-between;

		pointer-events: none;
		* {
			pointer-events: auto;
		}
	}

	// header左侧
	.gallery-card-header-left {
		flex: 0;
		align-items: center;
		transform: translateY(-150%);
		transition: transform 0.3s;
	}
	.gallery-card[data-show="true"] .gallery-card-header-left,
	.gallery-card:hover .gallery-card-header-left,
	.gallery-card[data-checked="true"] .gallery-card-header-left {
		transform: translateY(0);
	}

	// header右侧
	.gallery-card-header-right {
		flex: 0;
		display: flex;
		flex-flow: row-reverse;
		align-items: center;

		transform: translateY(-100%);
		transition: transform 0.3s;
	}
	.gallery-card[data-show="true"] .gallery-card-header-right,
	.gallery-card:hover .gallery-card-header-right {
		transform: translateY(0);
	}

	.card-button-group {
		height: fit-content;
		display: flex;
		gap: 4px;

		// 修正样式
		:deep(.var-button-group) {
			overflow: hidden;
		}
	}

	.card-checkbox {
		display: flex;
		align-items: center;
		justify-content: center;
		filter: drop-shadow(0 0 1px #ffffff);
	}

	// 卡片底部
	.gallery-card-footer {
		padding: 4px;
		display: flex;
		gap: 4px;

		transform: translateY(100%);
		transition: transform 0.3s;

		pointer-events: none;
		* {
			pointer-events: auto;
		}

		:deep(.var-chip) {
			justify-content: start;
			.var-chip__text-small {
				text-overflow: ellipsis;
				white-space: nowrap;
				text-align: left;
			}
		}
	}

	.gallery-card[data-show="true"] .gallery-card-footer,
	.gallery-card:hover .gallery-card-footer {
		transform: translateY(0);
	}
</style>
