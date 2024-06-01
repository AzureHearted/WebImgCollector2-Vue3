<template>
	<!-- 视口区域 -->
	<div
		ref="viewportDOM"
		class="base-virtual-scrollbar"
		@mouseover="scrollbar.show = true"
		@mouseleave="scrollbar.show = false">
		<!-- 内容区域 -->
		<div
			ref="wrapperDOM"
			class="base-virtual-scrollbar-wrapper"
			@wheel.stop
			@scroll.stop>
			<!-- 内容内部区域 -->
			<div ref="contentDOM" class="base-virtual-scrollbar-content">
				<!-- 调试区域 -->
				<div v-if="false" class="debug">
					{{ viewportInfo.height }} ,{{ viewportInfo.width }}<br />
					{{ contentInfo.height }},{{ contentInfo.width }}<br />
					{{ wrapperDOM ? wrapperDOM!.scrollHeight : 0 }} ,{{
						wrapperDOM ? wrapperDOM!.scrollWidth : 0
					}}<br />
					{{ wrapperInfo }}<br />
				</div>
				<!-- 插槽出口 -->
				<slot></slot>
			</div>
			<!-- 虚拟滚动条 -->
			<!-- 垂直滚动条 -->
			<transition name="scrollbar">
				<div
					ref="verticalBar"
					class="custom-virtual-scrollbar custom-virtual-scrollbar-vertical"
					:class="{ 'is-dragging': scrollbar.vertical.isDragging }"
					v-show="verticalScrollbarVisible"
					@wheel.prevent
					@mousedown.stop
					@mouseup.stop
					@click.stop
					@touchstart.stop
					@touchmove.prevent
					@touchend.stop
					:style="verticalStyle"></div>
			</transition>
			<!-- 水平滚动条 -->
			<transition name="scrollbar">
				<div
					ref="horizontalBar"
					class="custom-virtual-scrollbar custom-virtual-scrollbar-horizontal"
					:class="{ 'is-dragging': scrollbar.horizontal.isDragging }"
					v-show="horizontalScrollbarVisible"
					:style="horizontalStyle"></div>
			</transition>
			<!-- 回到顶部按钮 -->
			<transition name="backTop">
				<div
					class="base-virtual-scrollbar-backTop"
					v-show="bakctopShow"
					@click="backToTop">
					<i class="backTop-icon">
						<svg
							data-v-e6ff9537=""
							viewBox="0 0 1024 1024"
							width="1.2em"
							height="1.2em">
							<path fill="currentColor" d="M512 320L192 704h639.936z"></path>
						</svg>
					</i>
				</div>
			</transition>
		</div>
	</div>
</template>

<script setup lang="ts">
	import {
		ref,
		reactive,
		onMounted,
		computed,
		watch,
		defineProps,
		withDefaults,
		watchEffect,
		onUpdated,
	} from "vue";
	import type { ComputedRef, CSSProperties } from "vue";
	import { useScroll, useElementBounding, useDraggable } from "@vueuse/core";

	// 定义props
	const props = withDefaults(defineProps<{ showScrollbar: boolean }>(), {
		showScrollbar: true,
	});

	// 视口DOM
	const viewportDOM = ref<HTMLElement | null>(null);
	const viewportInfo = reactive({
		...useElementBounding(viewportDOM),
	});
	// 滚动容器
	const wrapperDOM = ref<HTMLElement | null>(null);
	const wrapperInfo = reactive({
		...useElementBounding(wrapperDOM),
	});
	// 内容区DOM
	const contentDOM = ref<HTMLElement | null>(null);
	const contentInfo = reactive({
		...useElementBounding(contentDOM),
	});

	watch(
		() => [
			viewportInfo.width,
			viewportInfo.height,
			contentInfo.width,
			contentInfo.height,
		],
		() => {
			calculateScrollbarSize(); //计算滚动条尺寸
			setScrollbarPosition(); //计算滚动条位置
		}
	);

	onUpdated(() => {
		// console.log("更新,onUpdated");

		calculateScrollbarSize(); //计算滚动条尺寸
		setScrollbarPosition(); //计算滚动条位置
	});

	// 状态数据
	const scrollbar = reactive({
		show: false,
		vertical: {
			width: 8, // 滚动条宽度，根据实际情况调整
			length: -1, // -1 表示默认无滚动条
			top: 0, // 滚动条位置
			isDragging: false,
			y: 0,
		},
		horizontal: {
			width: 8, // 滚动条宽度，根据实际情况调整
			length: -1, // -1 表示默认无滚动条
			left: 0, // 滚动条位置
			isDragging: false,
			x: 0,
		},
	});

	// 滚动条DOM(垂直)
	const verticalBar = ref<HTMLElement | null>(null);
	onMounted(() => {
		const { y, isDragging } = useDraggable(verticalBar, {
			axis: "y", // 限制垂直拖拽
			containerElement: viewportDOM.value, // 设置父容器
		});
		watchEffect(() => {
			scrollbar.vertical.y = y.value;
		});
		// 监听拖拽参数变化
		watch([() => scrollbar.vertical.y, isDragging], ([sy, isDragging]) => {
			if (!wrapperDOM.value) return;
			scrollbar.vertical.top = sy; // 更新滚动条位置
			scrollbar.vertical.isDragging = isDragging;
			if (isScrolling.value) return; //如果此时页面正在滚动则不进行下面的操作
			// 计算滚动距离
			const { scrollWidth, scrollHeight } = wrapperDOM.value; // 提取滚动容器内容区宽高
			const top = (scrollHeight / viewportInfo.height) * scrollbar.vertical.top;
			const left =
				(scrollWidth / viewportInfo.width) * scrollbar.horizontal.left;
			// 更新滚动距离
			updateScrollPosition({ y: top, x: left, behavior: "instant" });
		});
	});

	// 滚动条样式(垂直)
	const verticalStyle: ComputedRef<CSSProperties> = computed(() => {
		return {
			// 根据滚动条长度决定是否显示滚动条
			height: `${scrollbar.vertical.length}px`,
			top: `${scrollbar.vertical.top}px`,
		};
	});

	// 垂直滚动条可见性
	const verticalScrollbarVisible = computed<boolean>(() => {
		return (
			((scrollbar.show && scrollbar.vertical.length > 0) ||
				scrollbar.vertical.isDragging) &&
			props.showScrollbar
		);
	});

	// 滚动条DOM(水平)
	const horizontalBar = ref<HTMLElement | null>(null);
	onMounted(() => {
		const { x, isDragging } = useDraggable(horizontalBar, {
			axis: "x", // 限制水平拖拽
			containerElement: viewportDOM.value, // 设置父容器
		});
		// 同步数据
		watchEffect(() => {
			scrollbar.horizontal.x = x.value;
		});
		// 监听拖拽参数变化
		watch([() => scrollbar.horizontal.x, isDragging], ([sx, isDragging]) => {
			if (!wrapperDOM.value) return;
			scrollbar.horizontal.left = sx; // 更新滚动条位置
			scrollbar.horizontal.isDragging = isDragging;
			if (isScrolling.value) return; //如果此时页面正在滚动则不进行下面的操作
			const { scrollWidth, scrollHeight } = wrapperDOM.value; // 提取滚动容器内容区宽高
			// 计算滚动距离
			const top = (scrollHeight / viewportInfo.height) * scrollbar.vertical.top;
			const left =
				(scrollWidth / viewportInfo.width) * scrollbar.horizontal.left;
			// 更新滚动距离
			updateScrollPosition({ y: top, x: left, behavior: "instant" });
		});
	});

	// 滚动条样式(水平)
	const horizontalStyle: ComputedRef<CSSProperties> = computed(() => {
		return {
			// 根据滚动条长度决定是否显示滚动条
			width: `${scrollbar.horizontal.length}px`,
			left: `${scrollbar.horizontal.left}px`,
		};
	});

	// 水平滚动条可见性
	const horizontalScrollbarVisible = computed<boolean>(() => {
		return (
			((scrollbar.show && scrollbar.horizontal.length > 0) ||
				scrollbar.horizontal.isDragging) &&
			props.showScrollbar
		);
	});

	// 计算滚动条尺寸
	function calculateScrollbarSize() {
		if (!wrapperDOM.value) return;
		const { width, height } = viewportInfo; // 提取出视口宽高
		const { scrollWidth, scrollHeight } = wrapperDOM.value; // 提取滚动容器内容区宽高
		// console.log("当前视口宽度", width, "当前wrapper宽度", scrollWidth);
		// 计算垂直滚动条长度
		scrollbar.vertical.length =
			scrollHeight > Math.ceil(height) ? (height / scrollHeight) * height : -1;
		// 计算水平滚动条长度
		scrollbar.horizontal.length =
			scrollWidth > Math.ceil(width) ? (width / scrollWidth) * width : -1;
	}

	const { x: wrapperX, y: wrapperY, isScrolling } = useScroll(wrapperDOM);
	// 监听wrapper滚动
	watch([wrapperX, wrapperY], ([x, y]) => {
		// console.log("wrapper滚动", x, y);
		if (!scrollbar.vertical.isDragging) {
			// 只有在scrollbar未被拖动时进行scrollbar位置设置(防止与拖动事件冲突)
			setScrollbarPosition();
		}
	});

	// 设置滚动条位置
	function setScrollbarPosition() {
		if (wrapperDOM.value) {
			// console.log("内容滚动", viewportInfo.width, wrapperDOM.value.scrollWidth);
			// 更新滚动条位置
			scrollbar.vertical.y =
				(viewportInfo.height / wrapperDOM.value.scrollHeight) * wrapperY.value;
			scrollbar.horizontal.x =
				(viewportInfo.width / wrapperDOM.value.scrollWidth) * wrapperX.value;
			// console.log("滚动事件", scrollTop);
		}
	}

	// 设置wrapper的滚动位置
	function updateScrollPosition(options: {
		x?: number;
		y?: number;
		behavior?: ScrollBehavior;
	}) {
		const { x, y, behavior } = options;
		if (wrapperDOM.value) {
			if (behavior !== undefined) {
				wrapperDOM.value.scrollTo({ top: y, left: x, behavior });
			} else {
				if (x !== undefined) {
					wrapperX.value = x;
				}
				if (y !== undefined) {
					wrapperY.value = y;
				}
			}
			// console.log("触发滚动contentDOM");
		}
	}

	// f backTop 回到顶部按钮
	const bakctopShow = computed<Boolean>(() => {
		return scrollbar.vertical.top > 20;
	});

	// 执行回到顶部
	function backToTop() {
		updateScrollPosition({ y: 0 });
	}
</script>

<script lang="ts">
	export default {
		name: "BaseVirtualScrollbar", // 组件名，用于调试和注册组件时使用
	};
</script>

<style lang="scss" scoped>
	// 视口容器
	.base-virtual-scrollbar {
		position: relative;
		width: 100%;
		height: 100%;
		// padding: 10px;
	}

	// 内容容器
	.base-virtual-scrollbar-wrapper {
		width: 100%;
		height: 100%;
		scroll-behavior: smooth;
		overflow: auto;
	}

	// .base-virtual-scrollbar-content {
	// 	background: wheat;
	// }

	/* 去除原生滚动条样式 */
	.base-virtual-scrollbar-wrapper::-webkit-scrollbar {
		display: none !important;
		width: 0px !important;
		height: 0px !important;
	}

	// 虚拟滚动条(共通)
	.custom-virtual-scrollbar {
		position: absolute;

		border-radius: 10px;
		-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
		background: #fefefeaa;
		opacity: 1;

		// background: orange;

		user-select: none;
		-webkit-user-select: none;

		transition: background 0.5s, opacity 0.5s, width 0.5s, height 0.5s;

		z-index: 1;

		&:hover,
		&.is-dragging {
			background: rgb(208, 208, 208);
		}
		&:active {
			background: #40a0ff;
		}
	}
	// 虚拟滚动条(垂直)
	.custom-virtual-scrollbar-vertical {
		top: 0;
		right: 0px;
		width: 8px;
		&:hover,
		&.is-dragging {
			width: 12px;
		}
	}
	// 虚拟滚动条(水平)
	.custom-virtual-scrollbar-horizontal {
		bottom: 0;
		left: 0px;
		height: 8px;
		&:hover,
		&.is-dragging {
			height: 12px;
		}
	}

	// 进入和退出时的过渡
	.scrollbar-enter-from,
	.scrollbar-leave-to {
		position: absolute;
		opacity: 0;
	}

	// 进入的过程中
	.scrollbar-enter-active {
		transition: 0.5s;
	}
	// 离开的过程中
	.scrollbar-leave-active {
		transition: 0.5s 1s;
	}

	//s 返回顶部按钮样式
	.base-virtual-scrollbar-backTop {
		position: absolute;
		width: 40px;
		height: 40px;

		right: 40px;
		bottom: 40px;

		border-radius: 50%;
		color: #409eff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20px;
		box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.12);
		cursor: pointer;
		z-index: 5;
		background-color: #ffffff;

		transition: 0.5s;

		&:hover {
			background-color: #d0e3ff;
		}

		.backTop-icon {
			--color: inherit;
			height: 1em;
			width: 1em;
			line-height: 1em;
			display: inline-flex;
			justify-content: center;
			align-items: center;
			position: relative;
			fill: currentColor;
			color: var(--color);
			font-size: inherit;
		}
	}

	.backTop-enter-active,
	.backTop-leave-active {
		transition: opacity 0.5s ease;
	}

	.backTop-enter-from,
	.backTop-leave-to {
		opacity: 0;
	}
</style>
