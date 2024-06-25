<template>
	<!-- s悬浮按钮 -->
	<var-fab
		:show="show && state.mounted"
		v-model:active="active"
		type="primary"
		bottom="20vh"
		right="8vh"
		direction="top"
		:trigger="isMobile ? 'click' : 'hover'"
		:drag="FabDragConfig"
		:teleport="false">
		<template #trigger>
			<!--s 图库显示切换按钮 -->
			<n-badge :value="filterCardList.all.length" :max="999" type="default">
				<var-button
					elevation
					type="primary"
					round
					icon-container
					:loading="loading"
					@dblclick="toggleWindow()">
					<!-- 图标 -->
					<i-mdi-dots-grid style="font-size: 30px" color="black" />
				</var-button>
				<!-- 底部悬浮按钮 -->
				<div class="bottom-fab" :data-active="active || state.scrolling">
					<!--t 页面下滚按钮 -->
					<var-button
						class="scroll-button"
						round
						:loading="state.scrollingToDown"
						@click="scrollTo('down')">
						<i-material-symbols-keyboard-double-arrow-down-rounded
							style="font-size: 24px"
							color="black" />
					</var-button>
					<!--t 页面上滚按钮 -->
					<var-button
						class="scroll-up"
						round
						:loading="state.scrollingToUp"
						@click="scrollTo('up')">
						<i-material-symbols-keyboard-double-arrow-up-rounded
							style="font-size: 24px"
							color="black" />
					</var-button>
				</div>
			</n-badge>
		</template>
		<template #default>
			<!--s 图库 -->
			<n-badge
				:value="filterCardList.all.length"
				:processing="loading"
				:max="999"
				type="default">
				<var-button
					type="success"
					round
					icon-container
					@click="toggleWindow('Gallery')">
					<i-material-symbols-team-dashboard color="black" />
				</var-button>
			</n-badge>
			<!--s 方案管理 -->
			<var-button type="info" round @click="toggleWindow('PatternEdit')">
				<i-material-symbols-box-edit color="black" />
			</var-button>
			<!--s 收藏 -->
			<var-button type="success" round @click="toggleWindow('Favorite')">
				<i-mdi-favorite color="red" />
			</var-button>
			<!--s 设置 -->
			<var-button
				color="rgb(217, 121, 252)"
				round
				@click="toggleWindow('Setting')">
				<i-ant-design-setting-twotone color="black" />
			</var-button>
			<!--s 测试窗口 -->
			<var-button
				color="rgb(117, 121, 252)"
				round
				@click="toggleWindow('Test')">
				<i-material-symbols-experiment-outline color="black" />
			</var-button>
		</template>
	</var-fab>
</template>

<script setup lang="ts">
	import { ref, reactive, onMounted } from "vue";
	import type { FabProps } from "@varlet/ui";
	import { isMobile as judgeIsMobile } from "@/utils/common";
	import { storeToRefs } from "pinia";
	import useGlobalStore from "@/stores/GlobalStore"; //导入全局仓库
	import useCardStore from "@/stores/CardStore";
	import useLoadingStore from "@/stores/LoadingStore";
	const globalStore = useGlobalStore();
	const { openWindow, tab } = storeToRefs(globalStore);
	const cardStore = useCardStore();
	const { filterCardList } = storeToRefs(cardStore);
	const loadingStore = useLoadingStore();
	const { loading } = storeToRefs(loadingStore);

	const active = ref(false); //s 控制悬浮按钮的显示状态

	// 定义Props
	withDefaults(
		defineProps<{
			teleportTo?: string | HTMLElement | false; // 指定浮动按钮的挂载点
			show?: boolean;
		}>(),
		{
			teleportTo: () => "body",
			show: true,
		}
	);

	//s 移动端标识符
	const isMobile = ref(false);
	onMounted(() => {
		isMobile.value = judgeIsMobile();
	});

	//s Fab配置信息
	const FabDragConfig = ref<FabProps["drag"]>({
		boundary: {
			top: "20px",
			left: "20px",
			right: "20px",
			bottom: "20px",
		},
	});

	//s 状态信息
	const state = reactive({
		scrolling: false,
		scrollingToDown: false,
		scrollingToUp: false,
		mounted: false,
	});

	onMounted(() => {
		state.mounted = true;
	});

	//f 切换窗口显示
	function toggleWindow(name?: string) {
		active.value = false;
		if (name) {
			tab.value = name;
			openWindow.value = true;
		} else {
			// tab.value = "Gallery";
			openWindow.value = !openWindow.value;
		}
	}

	//f 滚动容器到底部
	function scrollTo(
		direction: "up" | "down" = "down", // 滚动方向，默认向下滚动
		container: HTMLElement = document.documentElement, // 滚动元素
		interval: number = 1000 // 滚动间隔
	): void {
		let scrollInterval: number | null = null;

		// 执行一次滚动操作
		function scrollOnce(): void {
			if (
				(container.scrollTop === 0 && direction === "up") ||
				(Number(container.scrollTop.toFixed(0)) + container.clientHeight ===
					container.scrollHeight &&
					direction === "down")
			) {
				state.scrollingToUp = false; // 取消显示滚动按钮的加载状态
				state.scrollingToDown = false; // 取消显示滚动按钮的加载状态
			}

			container.scrollTo({
				top: direction === "up" ? 0 : container.scrollHeight,
				behavior: "smooth",
			});
		}

		// 开始执行滚动操作的定时器
		function startScrollInterval(): void {
			if (!scrollInterval) {
				scrollInterval = window.setInterval(() => {
					// console.log(`滚动中:${direction}`);
					if (direction === "up") {
						state.scrollingToUp = true; // 取消显示滚动按钮的加载状态
					} else {
						state.scrollingToDown = true; // 取消显示滚动按钮的加载状态
					}
					requestAnimationFrame(scrollOnce);
				}, interval);
			}
		}

		// 停止执行滚动操作的定时器
		function stopScrollInterval(): void {
			if (scrollInterval) {
				// console.log("滚动停止");
				state.scrolling = false; // 取消显示滚动按钮的加载状态
				clearInterval(scrollInterval);
				scrollInterval = null;
				if (container.scrollTop === 0 && direction === "up") {
					state.scrollingToUp = false; // 取消显示滚动按钮的加载状态
				} else {
					state.scrollingToDown = false; // 取消显示滚动按钮的加载状态
				}
			}
		}

		state.scrolling = true; // 显示滚动按钮的加载状态
		if (direction === "up") {
			state.scrollingToUp = true; // 取消显示滚动按钮的加载状态
		} else {
			state.scrollingToDown = true; // 取消显示滚动按钮的加载状态
		}

		// 开始执行滚动操作的定时器
		startScrollInterval();

		// 一经触发立即执行
		scrollOnce();

		window.addEventListener("wheel", stopScrollInterval, { passive: true });
		window.addEventListener("click", stopScrollInterval, { passive: true });
		window.addEventListener("touchmove", stopScrollInterval, {
			passive: true,
		});
	}
</script>

<style lang="scss" scoped>
	.bottom-fab {
		position: absolute;
		// background: orange;
		top: 0;
		width: 100%;
		height: 80%;

		z-index: -1;

		display: flex;
		flex-flow: column nowrap;
		flex-direction: column-reverse;
		align-items: center;
		gap: 10px;

		transition: 0.3s;

		&[data-active="true"] {
			height: 310%;
		}
	}

	:deep(.var-button__content) {
		font-size: 20px;
	}

	.bottom-fab :deep(.var-button--round) {
		width: 40px;
		height: 40px;
		opacity: 1;
		padding: unset;
		margin: unset;
		transition: 0.5s;
	}
	.bottom-fab[data-active="false"] {
		:deep(.var-button--round) {
			width: 0;
			height: 0;
			opacity: 0;
			padding: unset;
			margin: unset;
		}
	}
</style>
