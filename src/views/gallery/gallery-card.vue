<template>
	<BaseImgCard
		class="gallery-card"
		style="overflow: hidden; border: unset"
		:data-show="isMobile()"
		:data-checked="data.isSelected">
		<!-- 卡片顶部 -->
		<template #header>
			<div class="gallery-card-header">
				<div class="gallery-card-header-left">
					<!-- 复选框 -->
					<div class="card-checkbox">
						<BaseCheckbox
							v-if="showCheckBox"
							:checked="data.isSelected"
							@change="emits('change:selected', $event)" />
						<BaseCheckbox
							v-if="showFavoriteButton"
							:checked="data.isFavorite"
							checked-color="red"
							@change="emits('toggle-favorite', $event)">
							<template #checked>
								<i-mdi-favorite />
							</template>
							<template #un-checked>
								<i-mdi-favorite-border />
							</template>
						</BaseCheckbox>
					</div>
				</div>
				<div class="gallery-card-header-right">
					<!-- 卡片按钮组 -->
					<div class="card-button-group">
						<el-button-group size="small">
							<!--s 删除 -->
							<el-button
								v-if="showDeleteButton"
								type="danger"
								@click="emits('delete', data.id)"
								v-ripple>
								<template #icon>
									<i-material-symbols-delete />
								</template>
							</el-button>
						</el-button-group>
						<el-button-group size="small">
							<!--s 重命名 -->
							<el-button type="primary" @click="rename(data)" v-ripple>
								<template #icon>
									<i-ep-edit />
								</template>
							</el-button>
						</el-button-group>
						<el-button-group size="small">
							<!--s 在页面中定位 -->
							<el-button
								type="primary"
								@click="toLocate(data)"
								v-if="data.source.dom"
								v-ripple>
								<template #icon>
									<i-material-symbols-location-on-outline />
								</template>
							</el-button>
							<!--s 下载(图片类) -->
							<el-button
								v-if="
									(data.source.meta.type === 'image' ||
										data.preview.meta.type === 'image') &&
									showDownloadButton
								"
								:loading="data.loading"
								type="success"
								@click="emits('download', data.id)"
								v-ripple>
								<template #icon>
									<i-material-symbols-download />
								</template>
							</el-button>
							<!--s 打开(网址类) -->
							<el-button
								v-if="data.source.meta.type === 'html'"
								type="default"
								@click="openUrl(data.source.url)"
								v-ripple>
								<template #icon>
									<i-material-symbols-open-in-new-rounded />
								</template>
							</el-button>
						</el-button-group>
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
				:data-preload="showType === 'iframe' ? false : true"
				:data-thumb="data.preview.url"
				:data-download-src="data.source.url">
				<BaseImg
					v-if="data.source.meta.type === 'image'"
					:src="data.source.url"
					use-thumb
					:viewport-selector="viewportSelector"
					:thumb="data.preview.url"
					:init-width="data.preview.meta.width"
					:init-height="data.preview.meta.height"
					@loaded="emits('loaded', data.id, $event)"
					:draggable="false"></BaseImg>
				<BaseImg
					v-else-if="
						data.source.meta.type === 'html' &&
						data.preview.meta.type === 'image'
					"
					:viewport-selector="viewportSelector"
					:src="data.preview.url"
					:init-width="data.preview.meta.width"
					:init-height="data.preview.meta.height"
					@loaded="emits('loaded', data.id, $event)"
					:draggable="false"></BaseImg>
				<BaseImg
					v-else
					src=""
					:init-show="true"
					@loaded="emits('loaded', data.id, $event)"
					:draggable="false">
					<htmlTypeImg
						style="width: 100%; height: auto; transform: scale(0.5)" />
				</BaseImg>
			</div>
		</template>
		<!-- 卡片底部 -->
		<template #footer>
			<div class="gallery-card-footer">
				<n-flex :size="4"> </n-flex>
				<!--s 尺寸信息 -->
				<var-chip
					v-if="data.source.meta.type === 'image'"
					type="primary"
					size="mini"
					:round="false">
					{{ data.source.meta.width }}x{{ data.source.meta.height }}
				</var-chip>
				<!--s 扩展名信息 -->
				<var-chip
					v-if="!!data.source.meta.ext"
					type="success"
					size="mini"
					:round="false">
					{{ data.source.meta.ext }}
				</var-chip>
				<!--s 网页标签 -->
				<var-chip
					v-if="data.source.meta.type === 'html'"
					type="warning"
					size="mini"
					:round="false">
					网页
				</var-chip>
				<!--s 文件大小信息 -->
				<var-chip
					v-if="!!data.source.blob && !!data.source.blob.size"
					type="info"
					size="mini"
					:round="false">
					{{ size }}
				</var-chip>
				<!--s 描述标签 -->
				<el-tooltip
					:content="data.description.title.trim()"
					placement="top-start">
					<var-chip
						class="title-chip"
						type="primary"
						size="mini"
						:round="false">
						{{ data.description.title.trim() }}
					</var-chip>
				</el-tooltip>
			</div>
		</template>
	</BaseImgCard>
</template>

<script setup lang="ts">
	import { computed, withDefaults, getCurrentInstance } from "vue";
	import type { ComputedRef } from "vue";
	import BaseImgCard from "@/components/base/base-img-card.vue";
	import BaseImg from "@/components/base/base-img.vue";
	import BaseCheckbox from "@/components/base/base-checkbox.vue";
	import Card from "@/stores/CardStore/class/Card";
	import type { returnInfo } from "@/components/base/base-img.vue";

	const { appContext } = getCurrentInstance()!;

	// 导入公用TS库
	import {
		byteAutoUnit,
		isMobile,
		legalizationPathString,
	} from "@/utils/common";

	// 导入svg
	import htmlTypeImg from "@svg/html.svg";

	// 导入仓库
	import { useGlobalStore } from "@/stores";
	import { GM_openInTab } from "$";
	import { ElMessageBox } from "@/plugin/element-plus";
	const globalStore = useGlobalStore();

	// const data = defineModel({ type: Card, required: true });
	const props = withDefaults(
		defineProps<{
			data: Card;
			viewportSelector?: string;
			showCheckBox?: boolean;
			showDeleteButton?: boolean;
			showDownloadButton?: boolean;
			showFavoriteButton?: boolean;
			showToLocateButton?: boolean;
		}>(),
		{
			showCheckBox: true,
			showDeleteButton: true,
			showDownloadButton: true,
			showFavoriteButton: true,
			showToLocateButton: true,
		}
	);
	const emits = defineEmits<{
		(e: "change:selected", val: boolean): Promise<void>; // 选中状态变化事件
		(e: "change:title", id: string, val: string): Promise<void>; // 标题变化事件
		(e: "toggle-favorite", val: boolean): Promise<void>; // 卡片收藏事件
		(e: "loaded", id: string, info: returnInfo): Promise<void>; // 卡片加载成功事件
		(e: "download", id: string): Promise<void>; // 下载事件
		(e: "delete", id: string): Promise<void>; // 删除事件
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

	// 页面定位元素
	function toLocate(item: Card) {
		const dom = item.source.dom;
		if (!dom) return;
		// console.log("定位元素", item);
		dom.scrollIntoView({
			behavior: "smooth",
			inline: "center",
			block: "center",
		}); // 滚动到指定元素位置，平滑滚动，并居中显示。
		globalStore.openWindow = false;
	}
	// 重命名
	function rename(item: Card) {
		// 删除卡片数据模型中的卡片。
		ElMessageBox.prompt(
			`重命名卡片"${item.description.title}"为……`,
			"重命名",
			{
				appendTo: ".web-img-collector-notification-container",
				confirmButtonText: "确认",
				cancelButtonText: "取消",
				inputPlaceholder: "请输入新卡片名称",
				inputValue: legalizationPathString(item.description.title),
				draggable: true,
			},
			appContext
		)
			.then(({ value: newName }) => {
				// 确认
				item.description.title = legalizationPathString(newName);
				// 触发标题变化事件
				emits("change:title", item.id!, item.description.title);
			})
			.catch(() => {
				// 取消
			});
	}

	// 打开网址
	async function openUrl(url: string) {
		GM_openInTab(url, { active: true, insert: true, setParent: true });
	}
</script>

<style lang="scss" scoped>
	// 卡片顶部
	.gallery-card-header {
		position: relative;
		display: flex;
		padding: 4px;

		pointer-events: none;
		* {
			pointer-events: auto;
		}
	}

	:deep(.wic2-button) {
		padding: 2px 4px;
		border: unset;
		box-shadow: var(--el-box-shadow);
		.wic2-icon {
			font-size: 16px;
		}
	}

	// header左侧
	.gallery-card-header-left {
		flex: 0;
		// transform: translateY(-150%);
		transition: transform 0.3s;
	}
	.gallery-card[data-show="true"] .gallery-card-header-left,
	.gallery-card:hover .gallery-card-header-left,
	.gallery-card[data-checked="true"] .gallery-card-header-left {
		transform: translateY(0);
		transition: transform 0.3s;
	}

	// header右侧
	.gallery-card-header-right {
		margin-left: auto;
		display: flex;
		flex-flow: row-reverse;
		align-items: center;

		transform: translateY(-150%);
		transition: transform 0.2s;
	}

	.gallery-card[data-show="true"] .gallery-card-header-right,
	.gallery-card:hover .gallery-card-header-right {
		transform: translateY(0);
		transition: transform 0.2s;
	}

	.card-button-group {
		height: fit-content;
		display: flex;
		gap: 4px;
	}

	.card-checkbox {
		position: absolute;
		display: flex;
		// top: -2px;
		// left: -2px;
		transform: translate(-2px, -2px);
		filter: drop-shadow(0 0 1px #ffffff);
	}

	// 卡片底部
	.gallery-card-footer {
		padding: 2px;
		// margin: 2px;
		display: flex;
		flex-flow: row wrap;
		overflow: hidden;
		gap: 4px;
		// background-color: wheat;

		// transform: translateY(100%);
		transition: transform 0.3s;

		pointer-events: none;
		* {
			pointer-events: auto;
		}

		:deep(.var-chip) {
			justify-content: start;
			max-width: 50%;
			overflow: hidden;
			text-overflow: ellipsis;
			&.title-chip {
				max-width: 50%;
				flex: 1;
			}
			& > span {
				overflow: hidden;
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
