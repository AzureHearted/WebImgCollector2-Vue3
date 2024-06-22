<template>
	<div class="base-drag-dialog__layout" v-if="showLayout">
		<transition
			@before-enter="handleBeforeEnter"
			@enter="handleEnter"
			@after-enter="handleAfterEnter"
			@before-leave="handleBeforeLeave"
			@after-leave="handleAfterLeave"
			appear>
			<dialog
				v-if="showDialog"
				:data-is-dragging="dragBarIsDragging"
				class="base-drag-dialog"
				ref="dialogDOM"
				:style="[dialogPosStyle, dialogSizeStyle]">
				<!--s 可拖拽区(header)  -->
				<div ref="draggableDOM" class="base-drag-dialog__header">
					<slot name="header">
						<!-- 默认header -->
						<div class="base-drag-dialog__drag-bar-default"></div>
					</slot>
				</div>
				<!--s 主要内容区 -->
				<div class="base-drag-dialog__main">
					<slot>
						<n-flex vertical :size="4" style="padding: 4px">
							调试
							<n-flex :size="4" :wrap="false">
								<span style="white-space: nowrap">宽度</span>
								<n-slider
									v-if="dialogSize"
									v-model:value="dialogSize.width"
									:min="minWidth"
									:max="winSize.width.value"
									:step="1" />
							</n-flex>
							<n-flex :size="4" :wrap="false">
								<span style="white-space: nowrap">高度</span>
								<n-slider
									v-if="dialogSize"
									v-model:value="dialogSize.height"
									:min="minHeight"
									:max="winSize.height.value"
									:step="1" />
							</n-flex>
						</n-flex>
					</slot>
				</div>
				<!--s 底部区域 -->
				<div class="base-drag-dialog__footer"></div>
			</dialog>
		</transition>
	</div>
</template>

<script setup lang="ts">
	import {
		ref,
		reactive,
		computed,
		watch,
		onMounted,
		onUnmounted,
		onActivated,
		onDeactivated,
		nextTick,
	} from "vue";
	import type { ComputedRef, TeleportProps } from "vue";
	import {
		useDraggable,
		useElementBounding,
		useWindowSize,
	} from "@vueuse/core";
	import type { Position, UseDraggableReturn } from "@vueuse/core";
	import type { HTMLAttributes } from "vue";

	const props = withDefaults(
		defineProps<{
			closeResetState?: boolean; //s 关闭后重置状态？
			initPercentY?: number; //s 初始垂直位置百分比(相对窗口)
			initPercentX?: number; //s 初始水平位置百分比(相对窗口)
			initSize?: { width: number; height: number }; //s 初始尺寸
			minWidth?: number; // 最小宽度
			minHeight?: number; // 最小高度
		}>(),
		{
			initPercentX: 0.5,
			initPercentY: 0.5,
			minWidth: 100,
			minHeight: 100,
		}
	);
	const emits = defineEmits(["open", "closed", "beforeClose"]);

	//s dialog容器DOM
	const dialogDOM = ref<HTMLDialogElement | null>(null);
	//s dialog位置
	let dialogPosition: UseDraggableReturn["position"];
	//j dialog位置样式
	let dialogPosStyle: ComputedRef<HTMLAttributes["style"]>;
	//s dialog容器边界信息
	const dialogBounding = useElementBounding(dialogDOM);
	//s dialog尺寸
	let dialogSize:
		| {
				width: number;
				height: number;
		  }
		| undefined;
	//j dialog尺寸样式
	let dialogSizeStyle: ComputedRef<HTMLAttributes["style"]>;

	//s window尺寸
	const winSize = useWindowSize(); //s 响应式视口尺寸

	//w 监视可拖拽区域的尺寸变化
	watch([() => winSize.width.value, () => winSize.height.value], () => {
		if (show.value) {
			nextTick(() => {
				handleFixPosSize();
			});
		}
	});

	//s 可拖拽区域DOM
	const draggableDOM = ref<HTMLElement | null>(null);
	//j 是否拖拽中
	let dragBarIsDragging: ComputedRef<boolean>;

	//s 标记是否已经初始化了
	const isInit = ref(false);
	//f 初始化函数
	function init() {
		const { style, position, isDragging } = useDraggable(dialogDOM, {
			handle: draggableDOM,
			preventDefault: true,
			stopPropagation: true,
			initialValue: () => {
				const { x, y } = calcPos({
					width: dialogDOM.value
						? dialogDOM.value.clientWidth
						: props.initSize?.width,
					height: dialogDOM.value
						? dialogDOM.value.clientHeight
						: props.initSize?.height,
					percentX: props.initPercentX,
					percentY: props.initPercentY,
				});
				console.log({ x, y });
				return { x, y };
			},
			onMove() {
				dialogBounding.update();
				//! 防止modal超出边界视口
				nextTick(() => {
					handleFixPosSize();
				});
			},
		});
		//! 记录响应式数据
		dialogPosStyle = style;
		dialogPosition = position;
		dragBarIsDragging = isDragging;
	}

	//w 监听dialogDOM是否获取到
	watch(dialogDOM, (dom) => {
		// console.log("dialogDOM", dom);
		if (dom) {
			if (!isInit.value) {
				//! 进行初始化
				isInit.value = true;
				if (!props.initSize) {
					dialogSize = reactive({
						width: dom.clientWidth,
						height: dom.clientHeight,
					});
				} else {
					dialogSize = reactive({
						width: props.initSize.width,
						height: props.initSize.height,
					});
				}

				//w 监听dialog尺寸变化
				watch([() => dialogSize?.width, () => dialogSize?.height], () => {
					if (show.value) {
						nextTick(() => {
							handleFixPosSize();
						});
					}
				});

				dialogSizeStyle = computed(() => {
					return {
						width: `${dialogSize?.width}px`,
						height: `${dialogSize?.height}px`,
					};
				});

				//s 执行初始化
				init();
				//s 刷新显示状态
				showDialog.value = false;
				nextTick(() => {
					showDialog.value = true;
				});
			} else {
				//! 已经初始化过了(判断是否重置位置和尺寸)
				if (props.closeResetState) {
					dialogPosition.value = calcPos({
						width: dialogDOM.value
							? dialogDOM.value.clientWidth
							: props.initSize?.width,
						height: dialogDOM.value
							? dialogDOM.value.clientHeight
							: props.initSize?.height,
						percentX: props.initPercentX,
						percentY: props.initPercentY,
					});

					if (!props.initSize) {
						dialogSize = reactive({
							width: dom.clientWidth,
							height: dom.clientHeight,
						});
					} else {
						dialogSize = reactive({
							width: props.initSize.width,
							height: props.initSize.height,
						});
					}
				}
			}
		}
	});

	//s 组件是否已挂载
	const isMounted = ref(false);
	//s 组件是否被冻结
	const isFreeze = ref(false);

	//! 是否显示dialog
	const show = defineModel("show", { type: Boolean, default: false });
	//s 显示dialog
	const showDialog = ref(false);
	//s 是否显示框架
	const showLayout = ref(false);

	//w 监听是否显示dialog
	watch(
		() => show.value,
		(isShow) => {
			if (isShow) {
				//s 先渲染框架
				showLayout.value = true;
				//s 然后异步渲染dialog
				setTimeout(() => {
					showDialog.value = true;
				});
			} else {
				showDialog.value = false;
			}
		}
	);

	//* 修复重新挂载后该显示不显示的bug
	onMounted(() => {
		if (show.value) {
			show.value = false;
			nextTick(() => {
				show.value = true;
			});
		}
	});

	//! 组件挂载时
	onMounted(() => {
		console.log("onMounted");
		isMounted.value = true;
	});

	//! 组件卸载时
	onUnmounted(() => {
		isMounted.value = false;
	});

	//! 组件被激活时
	onActivated(() => {
		isFreeze.value = false;
		//! 被冻结时进行显示/隐藏
		showDialog.value = show.value;
	});

	//! 组件被冻结时
	onDeactivated(() => {
		isFreeze.value = true;
		//! 被冻结时进行隐藏
		showDialog.value = false;
	});

	//f dialog关闭前的回调
	function handleBeforeLeave() {
		emits("beforeClose");
	}
	//f dialog关闭后的回调
	function handleAfterLeave() {
		emits("closed");
	}

	//f dialog进入前的回调
	function handleBeforeEnter() {
		// console.log(
		// 	"before-enter",
		// 	dialogDOM.value?.clientWidth,
		// 	dialogDOM.value?.clientHeight
		// );
	}

	//f dialog进入时的回调
	function handleEnter() {
		// console.log(
		// 	"enter",
		// 	dialogDOM.value?.clientWidth,
		// 	dialogDOM.value?.clientHeight,
		// 	winSize.width.value,
		// 	winSize.height.value
		// );
	}

	//f dialog进入后的回调
	function handleAfterEnter() {
		emits("open");
		// console.log(
		// 	"after-enter",
		// 	dialogDOM.value?.clientWidth,
		// 	dialogDOM.value?.clientHeight
		// );
		nextTick(() => {
			handleFixPosSize();
		});
	}

	interface CalcPosOption {
		width: number;
		height: number;
		percentY: number; // 垂直方向百分比(0~1)
		percentX: number; // 水平方向百分比(0~1)
	}
	//f 计算位置
	function calcPos(options: Partial<CalcPosOption>): Position {
		const defaultOptions: CalcPosOption = {
			width: 0,
			height: 0,
			percentY: 0.5,
			percentX: 0.5,
		};
		const { width, height, percentY, percentX } = {
			...defaultOptions,
			...options,
		};
		const [x, y] = [
			(winSize.width.value - width) * percentX,
			(winSize.height.value - height) * percentY,
		];
		return { x, y };
	}

	//f 修正位置&尺寸
	function handleFixPosSize() {
		if (!dialogPosition || !dialogSize || !dialogDOM.value) return;
		//s 水平方向纠正
		if (dialogSize.width > winSize.width.value) {
			//s 溢出的处理方式
			const newX = 0,
				newWidth = winSize.width.value;
			dialogPosition.value.x = newX;
			dialogSize.width = newWidth;
		} else {
			//s 没有溢出的处理方式
			if (dialogBounding.right.value > winSize.width.value) {
				dialogPosition.value.x =
					winSize.width.value - dialogBounding.width.value;
			}
			if (dialogBounding.left.value < 0) {
				dialogPosition.value.x = 0;
			}
		}

		//s 垂直方向纠正
		if (dialogSize.height > winSize.height.value) {
			//s 溢出的处理方式
			const newY = 0,
				newHeight = winSize.height.value;
			dialogPosition.value.x = newY;
			dialogSize.height = newHeight;
		} else {
			//s 没有溢出的处理方式

			if (dialogBounding.bottom.value > winSize.height.value) {
				dialogPosition.value.y =
					winSize.height.value - dialogBounding.height.value;
			}
			if (dialogBounding.top.value < 0) {
				dialogPosition.value.y = 0;
			}
		}
	}
</script>

<style lang="scss" scoped>
	* {
		box-sizing: border-box;
	}
	// $radius: 4px;
	.base-drag-dialog {
		position: fixed;
		// max-width: 100vw;
		// max-height: 100vh;
		min-width: v-bind("minWidth+'px'");
		min-height: v-bind("minHeight+'px'");
		// width: v-bind("dialogSize?dialogSize.width+'px':''");
		// height: v-bind("dialogSize?dialogSize.width+'px':''");

		margin: unset;
		padding: unset;
		border: unset;

		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(10px);
		box-shadow: 0 0 8px 0.5px rgba(0, 0, 0, 0.6),
			inset 0 0 10px 8px rgba(128, 128, 128, 0.6);

		// border-radius: 4px;
		z-index: 2000;

		display: flex;
		flex-flow: column nowrap;

		&[data-is-dragging="false"] {
			transition: 0.5s ease;
		}

		&[data-show="false"] {
			opacity: 0 !important;
		}
	}

	//s 拖拽条容器
	.base-drag-dialog__header {
		position: relative;
		height: 10px;
		// background: skyblue;
		background: rgba(255, 255, 255, 0.5);

		// border-top-left-radius: $radius;
		// border-top-right-radius: $radius;

		touch-action: none; //! 必须设为none否则useDraggable不能正常使用
		/* 禁止选中文字 */
		user-select: none;
		/* 禁止图文拖拽 */
		-webkit-user-drag: none;
	}
	//s (默认)拖拽条
	.base-drag-dialog__drag-bar-default {
		width: 100%;
		height: 100%;
		// border-top-left-radius: $radius;
		// border-top-right-radius: $radius;
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

		// & > :nth-child(n) {
		// 	border-radius: 0;
		// }
		// & > :first-child {
		// 	border-bottom-left-radius: $radius;
		// }
		// & > :last-child {
		// 	border-bottom-right-radius: $radius;
		// }
	}

	//s 关闭按钮
	.base-dock__close-button {
		height: 100%;
		aspect-ratio: 1;
		display: flex;
		background: red;
	}

	//? transition效果
	//s	默认淡出淡入
	.v-enter-active,
	.v-leave-active {
		transition: 0.5s ease;
	}
	.v-enter-from,
	.v-leave-to {
		// position: fixed;
		opacity: 0 !important;
		top: 100% !important;
	}
</style>
