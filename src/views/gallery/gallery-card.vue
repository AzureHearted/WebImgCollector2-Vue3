<template>
	<BaseCard
		class="gallery-card"
		:data-id="data.id"
		background-color="transparent"
		style="border: unset"
		:data-show="isMobile()"
		:data-source-type="data.source.meta.type"
		:data-preview-type="data.preview.meta.type"
		:data-checked="data.isSelected">
		<!--s 卡片顶部 -->
		<template #header>
			<div class="gallery-card-header">
				<!--s header左侧 -->
				<div class="gallery-card-header-left">
					<!--s 复选框 -->
					<div class="card-checkbox">
						<!--s 选中复选框 -->
						<BaseCheckbox
							v-if="showCheckBox"
							:checked="data.isSelected"
							@change="emits('change:selected', $event)" />
						<!--s 收藏复选框 -->
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
				<!--s header右侧 -->
				<div class="gallery-card-header-right">
					<!--s 卡片按钮组 -->
					<div class="card-button-group">
						<!--s 自定义按钮组 -->
						<el-button-group size="small">
							<slot name="custom-button" :openUrl="openUrl"></slot>
						</el-button-group>
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
							<!--s 下载(图片或视频类) -->
							<el-button
								v-if="
									(data.source.meta.type === 'image' ||
										data.preview.meta.type === 'image' ||
										data.source.meta.type === 'zip' ||
										data.preview.meta.type === 'zip' ||
										data.source.meta.type === 'video' ||
										data.preview.meta.type === 'video') &&
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
		<!--s 卡片主体(图片) -->
		<template #default>
			<div
				ref="imgWrapRef"
				data-fancybox="web-img-collector"
				:data-id="data.id"
				:href="data.source.url"
				:data-type="showType"
				:data-preload="showType === 'iframe' ? false : true"
				:data-thumb="data.preview.url"
				:data-source-type="data.source.type"
				:data-preview-type="data.preview.type"
				:data-download-src="data.source.url">
				<template v-if="data.preview.meta.type === 'image'">
					<!--s 纯图片类型 -->
					<BaseImg
						v-if="data.source.meta.type === 'image'"
						:src="data.source.url"
						:viewport-selector="viewportSelector"
						use-thumb
						:thumb="data.preview.url"
						:init-width="data.preview.meta.width"
						:init-height="data.preview.meta.height"
						@loaded="emits('loaded', data.id, $event)"
						:draggable="false" />
					<!--s 网页类型(封面图片) -->
					<BaseImg
						v-else
						:viewport-selector="viewportSelector"
						:src="data.preview.url"
						:init-width="data.preview.meta.width"
						:init-height="data.preview.meta.height"
						@loaded="emits('loaded', data.id, $event)"
						:draggable="false" />
				</template>
				<template v-else-if="data.preview.meta.type === 'video'">
					<!--s 纯视频类型 或 网页类型(封面视频or图片)-->
					<BaseVideo
						v-if="
							data.source.meta.type === 'video' ||
							data.source.meta.type === 'image' ||
							data.source.meta.type === 'html'
						"
						muted
						hover-play
						hover-anew-start
						loop
						:show-controls="false"
						:src="data.preview.url"
						:viewport-selector="viewportSelector"
						:init-width="data.preview.meta.width"
						:init-height="data.preview.meta.height"
						@loaded="emits('loaded', data.id, $event)" />
				</template>
				<!--s html的其他类型 -->
				<BaseImg
					v-else
					src=""
					:init-show="true"
					@loaded="emits('loaded', data.id, $event)"
					:draggable="false">
					<HtmlTypeImg
						style="width: 100%; height: auto; transform: scale(0.5)" />
				</BaseImg>
			</div>
		</template>
		<!--s 卡片底部 -->
		<template #footer>
			<div class="gallery-card-footer" align="center" :size="2">
				<!--s 额外标签 -->
				<div class="extra-tag-list">
					<BaseLineOverFlowList
						:list="tags"
						model-to=".web-img-collector-top-container">
						<template #default="{ item, openShowMore }">
							<var-chip :key="item.id" size="mini" @click="openShowMore">
								{{ (item as Tag).label }}
							</var-chip>
						</template>
						<template #modal-title>
							<div style="font-size: 12px; white-space: wrap">
								{{ data.description.title }}
							</div>
						</template>
						<template #modal-content>
							<n-dynamic-tags
								:value="data.tags"
								type="info"
								@change="handleTagsSave" />
						</template>
						<template #modal-footer>
							<div>
								<n-popconfirm
									positive-text="确认"
									negative-text="取消"
									:to="false"
									@positive-click="data.tags.splice(0)">
									<template #trigger>
										<n-button type="warning" size="tiny" @click.stop>
											清空
										</n-button>
									</template>
									<div>
										<div style="color: red">确认清空？</div>
										<div>此操作将无法撤回</div>
									</div>
								</n-popconfirm>
							</div>
						</template>
					</BaseLineOverFlowList>
				</div>
				<div style="width: 100%; display: flex; gap: 4px">
					<!--s 描述标签 -->
					<var-chip class="title-tag" type="primary" size="mini">
						<n-ellipsis>
							{{ data.description.title.trim() }}
						</n-ellipsis>
					</var-chip>
					<!--s 尺寸信息 -->
					<var-chip
						v-if="data.source.meta.type === 'image'"
						type="info"
						size="mini">
						<n-ellipsis>
							{{ data.source.meta.width }}x{{ data.source.meta.height }}
						</n-ellipsis>
					</var-chip>
					<!--s 扩展名信息 -->
					<var-chip v-if="!!data.source.meta.ext" type="default" size="mini">
						<n-ellipsis>
							{{ data.source.meta.ext }}
						</n-ellipsis>
					</var-chip>
					<!--s 网页标签 -->
					<var-chip
						v-if="data.source.meta.type === 'html'"
						type="warning"
						size="mini">
						网页
					</var-chip>
					<!--s 文件大小信息 -->
					<var-chip
						v-if="!!data.source.blob && !!data.source.blob.size"
						type="success"
						size="mini">
						<n-ellipsis>
							{{ size }}
						</n-ellipsis>
					</var-chip>
				</div>
			</div>
		</template>
	</BaseCard>
</template>

<script setup lang="ts">
	import {
		ref,
		computed,
		withDefaults,
		// onMounted,
		// onActivated,
		// onDeactivated,
	} from "vue";
	import type { ComputedRef } from "vue";
	import BaseCard from "@/components/base/base-card.vue";
	import BaseImg from "@/components/base/base-img.vue";
	import BaseVideo from "@/components/base/base-video.vue";
	import BaseCheckbox from "@/components/base/base-checkbox.vue";
	import BaseLineOverFlowList from "@/components/base/base-line-overflow-list.vue";
	import Card from "@/stores/CardStore/class/Card";
	import type { returnInfo } from "@/components/base/base-img.vue";
	import { GM_openInTab } from "$";
	import { ElMessageBox } from "@/plugin/element-plus";
	import { useElementVisibility } from "@vueuse/core";

	// 导入公用TS库
	import {
		buildUUID,
		byteAutoUnit,
		isMobile,
		legalizationPathString,
	} from "@/utils/common";

	// 导入svg
	import HtmlTypeImg from "@svg/html.svg";

	// 导入仓库
	import useGlobalStore from "@/stores/GlobalStore";

	const globalStore = useGlobalStore();

	const imgWrapRef = ref<HTMLElement | null>(null);
	//s 图片可见性
	// const isVisible = useElementVisibility(imgWrapRef);

	const data = defineModel("data", { type: Card, default: () => new Card() });
	withDefaults(
		defineProps<{
			// data: Card;
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

	// onMounted(() => {
	// 	console.log("卡片被挂载", props.data.id);
	// });
	// onActivated(() => {
	// 	console.log("卡片被激活", props.data.id);
	// });
	// onDeactivated(() => {
	// 	console.log("卡片被冻结", props.data.id);
	// });

	const emits = defineEmits<{
		(e: "change:selected", val: boolean): Promise<void>; // 选中状态变化事件
		(e: "change:title", id: string, val: string): Promise<void>; // 标题变化事件
		(e: "toggle-favorite", val: boolean): Promise<void>; // 卡片收藏事件
		(e: "loaded", id: string, info: returnInfo): Promise<void>; // 卡片加载成功事件
		(e: "download", id: string): Promise<void>; // 下载事件
		(e: "delete", id: string): Promise<void>; // 删除事件
		(e: "change:visible", val: boolean): Promise<void>; // 可见性发生变化
		(e: "save:tags", id: string, newTags: string[]): Promise<void>; // 卡片tags保存事件
	}>();

	//j 大小
	const size: ComputedRef<string> = computed(() => {
		const byteSize = data.value.source.blob?.size;
		if (byteSize) {
			return byteAutoUnit(byteSize);
		} else {
			return `0B`;
		}
	});

	interface Tag {
		id: string;
		label: string;
	}
	//j 标签
	const tags = computed<Tag[]>(() => {
		return data.value.tags.map((t) => {
			return {
				id: buildUUID(),
				label: t,
			};
		});
	});

	// 定义Fancybox的默认类型
	type FancyboxType =
		| "image"
		| "iframe"
		| "youtube"
		| "html"
		| "ajax"
		| "html5video"
		| false;
	//j 计算默认类型
	const showType: ComputedRef<FancyboxType> = computed(() => {
		const { type: metaType } = data.value.source.meta;
		let type: FancyboxType = "image";
		if (!metaType) return type;
		if (metaType === "html") {
			type = "iframe";
		} else if (metaType === "video") {
			type = "html5video";
		}
		return type;
	});

	//f 页面定位元素
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
	//f 重命名
	function rename(item: Card) {
		// 删除卡片数据模型中的卡片。
		ElMessageBox.prompt(`重命名卡片"${item.description.title}"为……`, "重命名", {
			appendTo: ".web-img-collector-notification-container",
			confirmButtonText: "确认",
			cancelButtonText: "取消",
			inputPlaceholder: "请输入新卡片名称",
			inputValue: legalizationPathString(item.description.title),
			draggable: true,
		})
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

	//f 打开网址
	async function openUrl(url: string) {
		GM_openInTab(url, { active: true, insert: true, setParent: true });
	}

	//f 处理卡片标签变化
	const handleTagsSave = (newTags: string[]) => {
		newTags = [...new Set(newTags)]; //s 去重
		data.value.tags.splice(0);
		data.value.tags.push(...newTags);
		console.log("newTags", data.value.tags, newTags);
		emits("save:tags", data.value.id, newTags);
	};
</script>

<style lang="scss" scoped>
	// 卡片顶部
	:deep(.base-card-header) {
		overflow: hidden;
	}
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

	.gallery-card[data-show="true"][data-visible="true"]
		.gallery-card-header-right,
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
	:deep(.base-card-footer) {
		overflow: hidden;
	}
	.gallery-card-footer {
		display: flex;
		flex-flow: row wrap;
		overflow: hidden;
		gap: 2px;
		padding: 2px;

		transition: transform 0.3s;

		pointer-events: none;
		* {
			pointer-events: auto;
		}

		//s 标签样式
		:deep(.var-chip) {
			flex-basis: content;
			flex-grow: 0;
			flex-shrink: 0.1;
			box-sizing: border-box;
			overflow: hidden;
			text-overflow: ellipsis;

			&.title-tag {
				flex-grow: 0;
				flex-shrink: 500;
				min-width: 40px;
			}
			& > span {
				box-sizing: border-box;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				text-align: left;
			}
		}

		//s 额外标签
		.extra-tag-list {
			flex: 1;
			overflow: hidden;
		}
	}

	.gallery-card[data-show="true"][data-visible="true"] .gallery-card-footer,
	.gallery-card:hover .gallery-card-footer {
		transform: translateY(0);
	}

	// 进场过渡,退场过渡
	.v-enter-from,
	.v-leave-to {
		position: absolute;
		opacity: 0;
	}

	// 进入的过程中
	.v-enter-active {
		transition: 0.4s;
	}
	// 离开的过程中
	.v-leave-active {
		transition: 0.4s;
	}
</style>
