<template>
	<!-- s悬浮按钮 -->
	<var-fab
		v-model:active="active"
		type="primary"
		bottom="20vh"
		right="10vh"
		direction="top"
		:trigger="isMobile() ? 'click' : 'hover'"
		drag
		:elevation="24"
		:teleport="teleportTo">
		<template #trigger>
			<!-- 图库显示切换按钮 -->
			<var-badge
				style="z-index: 1"
				type="danger"
				:max-value="999"
				:hidden="true">
				<var-button
					color="#29B6F6"
					:elevation="10"
					round
					:loading="loading"
					@dblclick="toggleWindow(route.name as string)">
					<!-- 图标 -->
					<IconGridRound style="width: 36px" />
				</var-button>
				<!-- 底部悬浮按钮 -->
				<div class="bottom-fab" :data-active="active || state.scrolling">
					<!-- 页面下滚按钮 -->
					<var-button
						class="scroll-button"
						round
						:loading="state.scrollingToDown"
						@click="scrollTo('down')">
						<IconArrowheadDown style="width: 24px" />
					</var-button>
					<!-- 页面上滚按钮 -->
					<var-button
						class="scroll-up"
						round
						:loading="state.scrollingToUp"
						@click="scrollTo('up')">
						<IconArrowheadUp style="width: 24px" />
					</var-button>
				</div>
			</var-badge>
		</template>
		<template #default>
			<!-- 图库 -->
			<var-badge
				style="z-index: 1"
				type="danger"
				:max-value="999"
				:hidden="true">
				<var-button type="success" round @click="toggleWindow('Gallery')">
					<IconDashboard />
				</var-button>
			</var-badge>
			<!-- 规则管理 -->
			<var-button type="info" round @click="toggleWindow('RuleEdit')">
				<IconBxsBookBookmark />
			</var-button>
			<!-- 设置 -->
			<var-button color="rgb(217, 121, 252)" round>
				<IconToolsFill />
			</var-button>
			<!-- 测试窗口 -->
			<var-button color="rgb(117, 121, 252)" round>
				<IconTestTube />
			</var-button>
		</template>
	</var-fab>
</template>

<script setup lang="ts">
	import { defineProps, ref, reactive } from "vue";
	import { useRoute, useRouter } from "vue-router";
	const route = useRoute();
	const router = useRouter();
	// 引入公共方法
	import { isMobile } from "@/utils/common";
	// 引入图标
	import IconGridRound from "@/assets/svg/dots-grid.svg";
	import IconDashboard from "@/assets/svg/dashboard.svg";
	import IconBxsBookBookmark from "@/assets/svg/bxs-book-bookmark.svg";
	import IconToolsFill from "@/assets/svg/tools-fill.svg";
	import IconTestTube from "@/assets/svg/bx-test-tube.svg";
	import IconArrowheadDown from "@svg/arrowhead-down.svg";
	import IconArrowheadUp from "@svg/arrowhead-up.svg";

	import useGlobalStore from "@/stores/global"; //导入全局仓库
	const globalStore = useGlobalStore();

	const active = ref(false); // 控制悬浮按钮的显示状态

	// 定义Props
	const props = withDefaults(
		defineProps<{
			teleportTo?: string | HTMLElement | false; // 指定浮动按钮的挂载点
			loading?: boolean;
		}>(),
		{
			teleportTo: () => "body",
			loading: false,
		}
	);

	const state = reactive({
		scrolling: false,
		scrollingToDown: false,
		scrollingToUp: false,
	});
	// const scrollingToDown = ref(false); // 控制滚动按钮的显示状态
	// const scrollingToUp = ref(false); // 控制滚动按钮的显示状态

	// 切换窗口显示
	function toggleWindow(name?: string) {
		if (name) {
			if (name === route.name) {
				console.log(name, route.name);
				globalStore.openWindow = !globalStore.openWindow;
			} else {
				router.push({ name });
				globalStore.openWindow = true;
			}
		} else {
			console.log("切换显示");
			globalStore.openWindow = !globalStore.openWindow;
		}
	}

	// 滚动容器到底部
	function scrollTo(
		direction: "up" | "down" = "down", // 滚动方向，默认向下滚动
		container: HTMLElement = document.documentElement, // 滚动元素
		interval: number = 1000 // 滚动间隔
	): void {
		let scrollInterval: NodeJS.Timeout | null = null;

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
				scrollInterval = setInterval(() => {
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

		window.addEventListener("wheel", stopScrollInterval);
		window.addEventListener("click", stopScrollInterval);
		window.addEventListener("touchstart", stopScrollInterval);
	}
</script>

<style lang="less" scoped>
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
