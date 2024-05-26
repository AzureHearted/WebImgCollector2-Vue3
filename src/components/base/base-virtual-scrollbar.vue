<template>
	<!-- 视口区域 -->
	<div
		ref="viewportDOM"
		class="base-virtual-scrollbar-viewport"
		@mouseover="scrollbar.show = true"
		@mouseleave="scrollbar.show = false">
		<!-- 内容区域 -->
		<div
			ref="wrapperDOM"
			class="base-virtual-scrollbar-wrapper"
			@scroll.stop="setScrollbarPosition">
			<!-- 内容内部区域 -->
			<div ref="contentDOM" class="base-virtual-scrollbar-content">
				<slot></slot>
			</div>
		</div>
		<!-- 虚拟滚动条 -->
		<!-- 垂直滚动条 -->
		<transition>
			<div
				class="custom-virtual-scrollbar custom-virtual-scrollbar-vertical"
				ref="verticalBar"
				v-show="
					(scrollbar.show && scrollbar.vertical.length > 0) ||
					scrollbar.vertical.isDragging
				"
				:style="verticalStyle"></div>
		</transition>
		<!-- 水平滚动条 -->
		<transition>
			<div
				class="custom-virtual-scrollbar custom-virtual-scrollbar-horizontal"
				ref="horizontalBar"
				v-show="scrollbar.show && scrollbar.horizontal.length > 0"
				:style="horizontalStyle"></div>
		</transition>
	</div>
</template>

<script setup lang="ts">
	import { ref, reactive, onMounted, computed, watch } from "vue";
	import type { ComputedRef, CSSProperties } from "vue";
	import { useElementBounding, useDraggable } from "@vueuse/core";

	// 视口DOM
	const viewportDOM = ref<HTMLElement | null>(null);
	const viewportInfo = reactive({
		...useElementBounding(viewportDOM),
	});
	// 滚动容器
	const wrapperDOM = ref<HTMLElement | null>(null);
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
			// console.log("contentInfo", contentInfo);
			calculateScrollbarSize(); //计算滚动条尺寸
			setScrollbarPosition(); //计算滚动条位置
		}
	);

	// 状态数据
	const scrollbar = reactive({
		show: false,
		vertical: {
			width: 8, // 滚动条宽度，根据实际情况调整
			length: -1, // -1 表示默认无滚动条
			top: 0, // 滚动条位置
			isDragging: false,
		},
		horizontal: {
			width: 8, // 滚动条宽度，根据实际情况调整
			length: -1, // -1 表示默认无滚动条
			left: 0, // 滚动条位置
			isDragging: false,
		},
	});

	// 滚动条DOM(垂直)
	const verticalBar = ref<HTMLElement | null>(null);
	onMounted(() => {
		const { y, isDragging } = useDraggable(verticalBar, {
			axis: "y", // 限制垂直拖拽
			containerElement: viewportDOM.value, // 设置父容器
		});
		// 监听拖拽参数变化
		watch([y, isDragging], ([x, isDragging]) => {
			scrollbar.vertical.top = x; // 更新滚动条位置
			scrollbar.vertical.isDragging = isDragging;
			// 计算滚动距离
			const top =
				(contentInfo.height / viewportInfo.height) * scrollbar.vertical.top;
			const left =
				(contentInfo.width / viewportInfo.width) * scrollbar.horizontal.left;
			// 更新滚动距离
			updateScrollPosition(top, left);
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

	// 滚动条DOM(水平)
	const horizontalBar = ref<HTMLElement | null>(null);
	onMounted(() => {
		const { x, isDragging } = useDraggable(horizontalBar, {
			axis: "x", // 限制水平拖拽
			containerElement: viewportDOM.value, // 设置父容器
		});
		// 监听拖拽参数变化
		watch([x, isDragging], ([x, isDragging]) => {
			scrollbar.horizontal.left = x; // 更新滚动条位置
			scrollbar.horizontal.isDragging = isDragging;
			// 计算滚动距离
			const top =
				(contentInfo.height / viewportInfo.height) * scrollbar.vertical.top;
			const left =
				(contentInfo.width / viewportInfo.width) * scrollbar.horizontal.left;
			// 更新滚动距离
			updateScrollPosition(top, left);
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

	// 计算滚动条尺寸
	function calculateScrollbarSize() {
		if (!wrapperDOM.value) return;
		const { width, height } = viewportInfo; // 提取出视口宽高
		const { scrollWidth, scrollHeight } = wrapperDOM.value; // 提取滚动容器内容区宽高
		// 计算垂直滚动条长度
		scrollbar.vertical.length =
			scrollHeight > height ? (height / scrollHeight) * height : -1;
		// 计算水平滚动条长度
		scrollbar.horizontal.length =
			scrollWidth > width ? (width / scrollWidth) * width : -1;
	}

	// 设置滚动条位置
	function setScrollbarPosition() {
		if (wrapperDOM.value) {
			const scrollTop = wrapperDOM.value.scrollTop;
			const scrollLeft = wrapperDOM.value.scrollLeft;
			// console.log("内容滚动", scrollLeft, scrollTop);
			// 更新滚动条位置
			scrollbar.vertical.top =
				(viewportInfo.height / contentInfo.height) * scrollTop;
			scrollbar.horizontal.left =
				(viewportInfo.width / contentInfo.width) * scrollLeft;
			// console.log("滚动事件", scrollTop);
		}
	}

	// 设置wrapper的滚动位置
	function updateScrollPosition(
		top: number,
		left: number,
		behavior: ScrollBehavior = "instant"
	) {
		if (wrapperDOM.value) {
			// console.log("触发滚动contentDOM");
			wrapperDOM.value.scrollTo({ top, left, behavior });
		}
	}
</script>

<script lang="ts">
	export default {
		name: "BaseVirtualScrollbar", // 组件名，用于调试和注册组件时使用
	};
</script>

<style lang="scss" scoped>
	// 视口容器
	.base-virtual-scrollbar-viewport {
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
		overflow-x: auto;
		overflow-y: auto;
	}

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
		-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		background: #88888891;
		opacity: 1;

		// background: orange;

		user-select: none;
		-webkit-user-select: none;

		transition: background 0.5s, opacity 0.5s, width 0.5s, height 0.5s;

		&:hover {
			background: #7d7d7d;
		}
	}
	// 虚拟滚动条(垂直)
	.custom-virtual-scrollbar-vertical {
		top: 0;
		right: 0px;
		width: 8px;
		&:hover {
			width: 12px;
		}
	}
	// 虚拟滚动条(水平)
	.custom-virtual-scrollbar-horizontal {
		bottom: 0;
		left: 0px;
		height: 8px;
		&:hover {
			height: 12px;
		}
	}

	// 进入和退出时的过渡
	.v-enter-from,
	.v-leave-to {
		opacity: 0;
		transition: all 0.5s;
	}
</style>
