<template>
	<!--s 组件主体 -->
	<div class="line-overflow-list__container" ref="containerDOM">
		<div class="line-overflow-list__wrap" :style="[wrapStyle]" ref="wrapDOM">
			<!--s 列表区域 -->
			<slot name="all-content">
				<div v-for="(item, index) in list" :key="item.id" style="display: flex">
					<slot
						:item="item"
						:index="index"
						:id="item.id"
						:isOverflow="
							childrenBounding[index]
								? childrenBounding[index].isOverflow
								: false
						"
						:openShowMore="openShowMore">
						<span>{{ item.label }}</span>
					</slot>
				</div>
			</slot>
			<!--s 溢出时显示的按钮 -->
			<div
				ref="overflowButtonDOM"
				class="line-overflow-list__button overflow-button"
				:data-show="!!overflowIndexes.length"
				:style="overflowButtonStyle"
				@click.stop="showMore = !showMore">
				<n-icon :size="buttonHeight">
					<i-mdi-more-horiz />
				</n-icon>
			</div>
			<!--s 数据为空时显示的按钮 -->
			<div
				ref="voidButtonDOM"
				class="line-overflow-list__button void-button"
				:data-show="!list.length"
				:style="voidButtonStyle"
				@click.stop="showMore = !showMore">
				<n-icon :size="!!list.length ? maxHeight : undefined">
					<i-mdi-plus />
				</n-icon>
			</div>
		</div>
		<!--s 更多展示面板 -->
		<BaseDragModal
			v-if="showMore"
			:show="true"
			:title="title"
			@closed="showMore = false"
			:teleport-to="modelTo">
			<div>
				<slot name="more-modal-content" :showMore="showMore">
					<template v-for="(item, index) in list" :key="item.id">
						<slot
							name="more-modal-content-item"
							:item="item"
							:index="index"
							:id="item.id">
							<span>{{ item.label }}</span>
						</slot>
					</template>
				</slot>
			</div>
		</BaseDragModal>
		<!--t 调试面板 -->
		<!-- <div v-if="false" style="background: rgba(256, 256, 256, 0.5)">
			<n-collapse
				:default-expanded-names="[
					'容器信息',
					'溢出按钮信息',
					'溢出元素的下标列表',
				]">
				<n-collapse-item name="容器信息">
					<template #header> 容器信息 </template>
					<n-code
						language="javascript"
						show-line-numbers
						:code="JSON.stringify(warpInfo, null, 2)"
						word-wrap>
					</n-code>
				</n-collapse-item>
				<n-collapse-item name="溢出按钮信息">
					<template #header> 溢出按钮信息 </template>
					<n-code
						language="javascript"
						show-line-numbers
						:code="JSON.stringify(overflowButtonInfo, null, 2)"
						word-wrap>
					</n-code>
				</n-collapse-item>
				<n-collapse-item name="溢出元素的下标列表">
					<template #header> 溢出元素的下标列表 </template>
					<n-code
						language="javascript"
						show-line-numbers
						:code="JSON.stringify(overflowIndexes)"
						word-wrap>
					</n-code>
				</n-collapse-item>
				<n-collapse-item name="元素信息">
					<template #header> 元素信息 </template>
					<n-code
						language="javascript"
						show-line-numbers
						:code="JSON.stringify(childrenBounding, null, 2)"
						word-wrap>
					</n-code>
				</n-collapse-item>
			</n-collapse>
		</div> -->
	</div>
</template>

<script lang="ts" setup>
	import {
		ref,
		reactive,
		watch,
		onMounted,
		onUpdated,
		onUnmounted,
		nextTick,
	} from "vue";
	import type { HTMLAttributes } from "vue";
	import {
		useElementBounding,
		useElementSize,
		useElementVisibility,
		useMutationObserver,
	} from "@vueuse/core";
	import { computed } from "vue";
	import { getDOMBoxValue } from "@/utils/common";
	import BaseDragModal from "@/components/base/base-drag-modal.vue";

	withDefaults(
		defineProps<{
			list?: {
				id: string;
				label: string;
				[key: string]: any;
			}[];
			title?: string;
			wrapStyle?: HTMLAttributes["style"];
			modelTo?: string;
		}>(),
		{
			list: () => [],
			modelTo: ".line-overflow-list__container",
			title: "更多",
		}
	);

	//s 是否展示更多
	const showMore = defineModel("showMore", { type: Boolean, default: false });
	//f  打开显示更多窗口
	const openShowMore = () => {
		showMore.value = true;
	};

	const containerDOM = ref<HTMLElement | null>(null);

	const wrapDOM = ref<HTMLElement | null>(null);
	//s wrap边界尺寸
	const warpBounding = reactive({
		...useElementBounding(wrapDOM),
	});
	//s warp内容区尺寸
	const warpSize = reactive({
		...useElementSize(wrapDOM),
	});

	//j 按钮样式
	const buttonHeight = computed<number>(() => {
		return warpInfo.value.bounding.height;
	});

	//s 溢出按钮DOM
	const overflowButtonDOM = ref<HTMLElement | null>(null);
	//s 溢出按钮边界尺寸
	const overflowButtonInfo = reactive({
		...useElementBounding(overflowButtonDOM),
	});

	//j 溢出按钮样式
	const overflowButtonStyle = computed<HTMLAttributes["style"]>(() => {
		return {
			right: `${
				wrapDOM.value ? getDOMBoxValue(wrapDOM.value, "padding-right") : 0
			}px`,
		};
	});

	//j 空按钮样式
	const voidButtonStyle = computed<HTMLAttributes["style"]>(() => {
		return {
			left: `${
				wrapDOM.value ? getDOMBoxValue(wrapDOM.value, "padding-left") : 0
			}px`,
		};
	});

	//j 计算warp元素所有尺寸信息
	const warpInfo = computed<{
		[key in "bounding" | "inner"]: {
			top: number;
			left: number;
			right: number;
			bottom: number;
			width: number;
			height: number;
		};
	}>(() => {
		const innerTop =
			warpBounding.top +
			(wrapDOM.value
				? getDOMBoxValue(wrapDOM.value, "padding-top") +
				  getDOMBoxValue(wrapDOM.value, "border-bottom-width")
				: (warpBounding.height - warpSize.height) / 2);
		const innerLeft =
			warpBounding.left +
			(wrapDOM.value
				? getDOMBoxValue(wrapDOM.value, "padding-left") +
				  getDOMBoxValue(wrapDOM.value, "border-left-width")
				: (warpBounding.width - warpSize.width) / 2);
		return {
			bounding: {
				top: warpBounding.top,
				left: warpBounding.left,
				right: warpBounding.right,
				bottom: warpBounding.bottom,
				width: warpBounding.width,
				height: warpBounding.height,
			},
			inner: {
				top: innerTop,
				left: innerLeft,
				right: innerLeft + warpSize.width,
				bottom: innerTop + warpSize.height,
				width: warpSize.width,
				height: warpSize.height,
			},
		};
	});

	//s 所有子元素
	const children = ref<Element[]>([]);

	onMounted(() => {
		if (!wrapDOM.value) return;
		// console.log("挂载", { ...warpBounding }, { ...warpSize });
		//s 创建一个 MutationObserver 实例来监听子元素的变化
		const { stop } = useMutationObserver(
			wrapDOM.value,
			() => {
				if (!wrapDOM.value) return;
				children.value = Array.from(wrapDOM.value.children);
			},
			{ childList: true }
		);

		//s 初始时设置 children 的值
		children.value = Array.from(wrapDOM.value.children);

		//s (组件卸载时)清理
		onUnmounted(() => {
			stop();
		});
	});

	//j 计算子元素中最大高度
	const maxHeight = computed(() => {
		return Math.max(...childrenBounding.value.map((x) => x.height));
	});
	//j 计算所有子元素边界信息
	const childrenBounding = computed<
		{
			index: number;
			width: number;
			height: number;
			left: number;
			right: number;
			isOverflow: boolean;
		}[]
	>(() => {
		return children.value
			.filter((x) => !x.classList.contains("line-overflow-list__button")) // 排除悬浮按钮
			.map((x, i) => {
				const { width, height, left, right } = x.getBoundingClientRect();
				return {
					index: i,
					width,
					height,
					left,
					right,
					isOverflow: right > overflowButtonInfo.left,
				};
			});
	});

	//j 计算溢出元素的下标
	const overflowIndexes = computed<number[]>(() => {
		return childrenBounding.value
			.filter((x) => x.isOverflow)
			.map((x) => x.index);
	});

	watch(
		() => childrenBounding.value,
		() => {
			nextTick(() => {
				updateChildrenState();
			});
		}
	);

	onUpdated(() => {
		nextTick(() => {
			// console.log("更新");
			updateChildrenState();
		});
	});
	const updateChildrenState = () => {
		childrenBounding.value.forEach((info) => {
			const dom = children.value[info.index] as HTMLElement;
			// if (dom.classList.contains("overflow-button")) return;
			if (info.isOverflow) {
				dom.classList.add("overflow");
			} else {
				dom.classList.remove("overflow");
			}
		});
	};
</script>

<style lang="scss" scoped>
	.line-overflow-list__wrap {
		box-sizing: border-box;
		position: relative;
		display: flex;
		flex-flow: row nowrap;
		gap: 2px;

		height: fit-content;
		min-height: 16px;

		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		transition: 0.5s;

		& > :deep(*) {
			transition: 0.5s;
		}
	}
	//s 溢出元素样式
	.line-overflow-list__wrap > :deep(.overflow) {
		position: relative;
		mask: linear-gradient(to right, rgb(255, 255, 255), transparent 50%);
	}

	//s 按钮样式
	.line-overflow-list__button {
		position: absolute;

		top: 50%;
		transform: translateY(-50%);
		height: 100%;
		aspect-ratio: 1;

		display: flex;
		align-items: center;
		justify-content: center;
	}
	.line-overflow-list__button[data-show="false"] {
		opacity: 0;
	}
	.line-overflow-list__button[data-show="true"] {
		opacity: 1;
	}
	.line-overflow-list__button:hover {
		background: rgba(135, 207, 235, 0.8);
	}

	.overflow-button {
		right: 0;
		border: 0.1px dashed rgba(0, 0, 0, 0.5);
		background: rgba(135, 207, 235, 0.5);
		cursor: pointer;
		border-radius: 4px;
		transition: 0.5s;
	}
	.void-button {
		left: 0;
		border: 0.1px dashed rgba(0, 0, 0, 0.5);
		background: rgba(135, 207, 235, 0.5);
		cursor: pointer;
		border-radius: 4px;
		transition: 0.5s;
	}

	/* 对移动中的元素应用的过渡 */
	.fade-move {
		// position: absolute;
		transition: 0.5s;
	}

	/* 确保将离开的元素从布局流中删除
	 以便能够正确地计算移动的动画。 */
	.fade-leave-active {
		position: absolute;
	}

	// 进场过渡
	.fade-enter-from {
		opacity: 0;
		transform: translateY(10px);
	}
	// 退场过渡
	.fade-leave-to {
		opacity: 0;
		// transform: translateY(10px);
	}

	// 进入的过程中
	.fade-enter-active {
		transition: 0.5s;
	}
	// 离开的过程中
	.fade-leave-active {
		transition: 0.3s;
	}
</style>
