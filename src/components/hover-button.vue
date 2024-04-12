<template>
	<!-- s悬浮按钮 -->
	<var-fab
		v-model:active="active"
		type="primary"
		bottom="20vh"
		right="100px"
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
					@dblclick="toggleWindow">
					<!-- 图标 -->
					<IconGridRound style="width: 36px" />
				</var-button>
				<!-- 底部悬浮按钮 -->
				<div class="bottom-fab" :data-active="active || scrolling">
					<!-- 页面滚动按钮 -->
					<var-tooltip content="滚动到底部" :teleport="teleportTo">
						<var-button
							class="scroll-button"
							round
							:loading="scrolling"
							@click="scrollToBottom()">
							<var-icon name="chevron-down" />
						</var-button>
					</var-tooltip>
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
				<var-button type="success" round @click="toggleWindow">
					<IconDashboard />
				</var-button>
			</var-badge>
			<!-- 规则管理 -->
			<var-button type="info" round>
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
	import { defineProps, ref } from "vue";
	// 引入公共方法
	import { isMobile } from "@/utils/common";
	// 引入图标
	import IconGridRound from "@/assets/svg/dots-grid.svg";
	import IconDashboard from "@/assets/svg/dashboard.svg";
	import IconBxsBookBookmark from "@/assets/svg/bxs-book-bookmark.svg";
	import IconToolsFill from "@/assets/svg/tools-fill.svg";
	import IconTestTube from "@/assets/svg/bx-test-tube.svg";

	import useGlobalStore from "@/stores/global"; //导入全局仓库
	const globalStore = useGlobalStore();

	const active = ref(false); // 控制悬浮按钮的显示状态

	// 定义Props
	const props = withDefaults(
		defineProps<{
			teleportTo?: string | HTMLElement; // 指定浮动按钮的挂载点
			loading?: boolean;
		}>(),
		{
			teleportTo: () => "body",
			loading: false,
		}
	);

	const scrolling = ref(false); // 控制滚动按钮的显示状态

	// 切换窗口显示
	function toggleWindow() {
		globalStore.openWindow = !globalStore.openWindow;
	}

	// 滚动容器到底部
	function scrollToBottom(
		container: HTMLElement = document.documentElement, // 滚动元素
		interval: number = 1000 // 滚动间隔
	): void {
		let scrollInterval: number | null = null;
		function scrollOnce(): void {
			container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
		}

		function startScrollInterval(): void {
			if (!scrollInterval) {
				// console.log("滚动开始");
				scrolling.value = true; // 显示滚动按钮的加载状态
				scrollInterval = setInterval(() => {
					// console.log("滚动……");
					requestAnimationFrame(scrollOnce);
				}, interval);
			}
		}

		function stopScrollInterval(): void {
			if (scrollInterval) {
				// console.log("滚动停止");
				clearInterval(scrollInterval);
				scrollInterval = null;
				scrolling.value = false; // 取消显示滚动按钮的加载状态
			}
		}

		startScrollInterval();

		// 一经触发立即执行
		scrollOnce();

		container.addEventListener("scroll", stopScrollInterval);
		container.addEventListener("wheel", stopScrollInterval);
		container.addEventListener("click", stopScrollInterval);
		container.addEventListener("touchstart", stopScrollInterval);
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

		transition: 0.3s;

		&[data-active="true"] {
			height: 200%;
		}
	}
</style>
