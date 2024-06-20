<template>
	<teleport v-if="mounted" :disabled="!!teleportTo" :to="teleportTo">
		<transition
			name="drag-modal"
			@after-leave="handleClosed"
			@after-appear="handelOpened">
			<div
				v-show="show"
				:data-is-dragging="dragBarIsDragging"
				:data-mounted="mounted"
				class="base-dock"
				ref="dockDOM"
				:style="[dockStyle, dockStyleFix]">
				<div ref="dragBarDOM" class="base-dock__drag-bar"></div>
				<div class="base-dock__button-wrap">
					<slot></slot>
					<n-button type="error" size="medium" @click="show = false">
						<template #icon>
							<i-ep-close style="height: 100%; aspect-ratio: 1" />
						</template>
					</n-button>
					<!-- <div class="base-dock__close-button" @click="show = false"></div> -->
				</div>
			</div>
		</transition>
	</teleport>
</template>

<script setup lang="ts">
	import { ref, reactive, watch, onMounted, nextTick } from "vue";
	import type { ComputedRef, TeleportProps } from "vue";
	import {
		useDraggable,
		useElementBounding,
		useElementSize,
		useWindowSize,
	} from "@vueuse/core";
	import type { Position, UseDraggableReturn } from "@vueuse/core";

	const props = withDefaults(
		defineProps<{
			teleportTo?: TeleportProps["to"];
			closeResetState?: boolean; // s 关闭后重置状态？
		}>(),
		{
			teleportTo: "body",
		}
	);
	const emits = defineEmits(["open", "closed"]);

	const show = defineModel("show", { type: Boolean, default: true });
	//f modal开启后的回调
	function handelOpened() {
		emits("open");
	}

	//f modal关闭后的回调
	function handleClosed() {
		emits("closed");
		// 判断是否重置窗口状态
		if (props.closeResetState) {
			initPosSize();
		}
	}

	const mounted = ref(false);
	onMounted(() => {
		nextTick(() => {
			mounted.value = true;
		});
	});

	//s dock容器DOM
	const dockDOM = ref<HTMLElement | null>(null);
	const dockSize = reactive({
		...useElementSize(dockDOM, undefined, {
			box: "border-box",
		}),
	});
	//s dock样式
	let dockStyle: ComputedRef<string>;
	const dockStyleFix = ref("transform: translate(0px, 0px);");
	//s dock位置
	let dockPosition: UseDraggableReturn["position"];
	//s dock容器边界信息
	const dockBounding = useElementBounding(dockDOM);
	//s window尺寸
	const winSize = reactive({
		...useWindowSize(), //s 响应式视口尺寸
	});

	//s 推拽条DOM
	const dragBarDOM = ref<HTMLElement | null>(null);
	//s 是否拖拽中
	let dragBarIsDragging: ComputedRef<boolean>;

	onMounted(() => {
		const { style, position, isDragging } = useDraggable(dockDOM, {
			handle: dragBarDOM,
			// preventDefault: true,
			stopPropagation: true,
			// initialValue: () => initPosSize() as Position,
			onMove() {
				//s 更新偏移
				dockBounding.update();
				//! 防止modal超出边界视口
				nextTick(() => {
					handleFixPos();
				});
			},
		});
		dockStyle = style;
		dockPosition = position;
		dragBarIsDragging = isDragging;

		setTimeout(() => {
			nextTick(() => {
				initPosSize();
			});
		});

		//w 监视可拖拽区域的尺寸变化
		watch([() => winSize.width, () => winSize.height], () => {
			// console.log([width, height]);
			if (show.value) {
				handleFixPos();
			}
		});
	});

	//f 重置位置和尺寸
	const initPosSize = (): Position | undefined => {
		if (!dockPosition.value) return;
		const [x, y] = [
			(winSize.width - dockSize.width) / 2,
			(winSize.height - dockSize.height) / (1 + 0.01),
		];
		dockPosition.value.x = x;
		dockPosition.value.y = y;
		return { x, y };
	};

	//f 修正位置
	function handleFixPos() {
		if (!dockPosition.value || !dockDOM.value) return;

		//s 水平方向纠正
		if (dockSize.width > winSize.width) {
			//s 溢出的处理方式
			const newX = 0,
				newWidth = winSize.width;
			dockPosition.value.x = newX;
			dockSize.width = newWidth;
		} else {
			//s 没有溢出的处理方式
			if (dockBounding.right.value > winSize.width) {
				dockPosition.value.x = winSize.width - dockBounding.width.value;
			}
			if (dockBounding.left.value < 0) {
				dockPosition.value.x = 0;
			}
		}

		//s 垂直方向纠正
		if (dockSize.height > winSize.height) {
			//s 溢出的处理方式
			const newY = 0,
				newHeight = winSize.height;
			dockPosition.value.x = newY;
			dockSize.width = newHeight;
		} else {
			//s 没有溢出的处理方式

			if (dockBounding.bottom.value > winSize.height) {
				dockPosition.value.y = winSize.height - dockBounding.height.value;
			}
			if (dockBounding.top.value < 0) {
				dockPosition.value.y = 0;
			}
		}
	}
</script>

<style lang="scss" scoped>
	* {
		box-sizing: border-box;
	}
	$radius: 4px;
	.base-dock {
		position: fixed;
		// min-width: 100px;
		min-height: 20px;

		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(10px);
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.6),
			inset 0 0 10px rgba(128, 128, 128, 0.6);

		border-radius: 4px;
		z-index: 2000;

		display: flex;
		flex-flow: column nowrap;

		// &[data-is-dragging="false"][data-mounted="false"] {
		// 	transition: 0.5s ease;
		// }

		&[data-mounted="false"] {
			// bottom: -100%;
			transition: none;
		}
	}

	//s 拖拽条
	.base-dock__drag-bar {
		position: relative;
		height: 10px;
		// background: skyblue;
		background: rgba(255, 255, 255, 0.5);

		border-top-left-radius: $radius;
		border-top-right-radius: $radius;

		touch-action: none; //! 必须设为none否则useDraggable不能正常使用
		/* 禁止选中文字 */
		user-select: none;
		/* 禁止图文拖拽 */
		-webkit-user-drag: none;

		transition: 0.5s ease;

		&:hover,
		&:active {
			background: rgba(135, 207, 235, 0.8);
		}

		&::after {
			content: "";
			position: absolute;
			height: 1px;
			width: 80%;
			top: 40%;
			left: 50%;
			transform: translate(-50%, 50%);
			background: black;
		}
	}

	//s 按钮容器
	.base-dock__button-wrap {
		position: relative;
		display: flex;
		align-items: center;

		& > :nth-child(n) {
			border-radius: 0;
		}
		& > :first-child {
			border-bottom-left-radius: $radius;
		}
		& > :last-child {
			border-bottom-right-radius: $radius;
		}
	}

	//s 关闭按钮
	.base-dock__close-button {
		height: 100%;
		aspect-ratio: 1;
		display: flex;
		background: red;
	}
</style>

<style lang="scss">
	//? transition效果
	//s	默认淡出淡入
	.drag-modal-enter-active,
	.drag-modal-leave-active {
		transition: 0.5s ease !important;
	}
	.drag-modal-enter-from,
	.drag-modal-leave-to {
		opacity: 0;
	}
</style>
