<template>
	<!-- *主容器 -->
	<div
		class="onlineGallery-container"
		ref="container"
		:data-open="appInfo.container.open"
		:style="{
			'--width':
				appInfo.window.width * appInfo.container.widthPercentage * 0.01 + 'px',
		}">
		<Body />
		<!-- *关闭按钮 -->
		<el-button
			class="onlineGallery-button-close"
			type="danger"
			circle
			@click="appInfo.container.open = false">
			<template #icon>
				<el-icon><i-ep-Close /></el-icon>
			</template>
		</el-button>
	</div>

	<!-- *子窗口容器 -->
	<div class="onlineGallery-child-window-container">
		<!-- *规则管理器窗口 -->
		<RuleEditor />
		<TestBoard
			v-if="testBoardOpen"
			@toClose="() => (testBoardOpen = false)" />
		<!-- *设置窗口 -->
		<!-- <AppSettingMenu /> -->
	</div>

	<!-- *悬浮按钮 -->
	<var-fab
		type="primary"
		bottom="30vh"
		right="30px"
		direction="top"
		:drag="true"
		:trigger="isMobile() ? 'click' : 'hover'"
		:elevation="24"
		teleport=".onlineGallery-child-window-container">
		<template #trigger>
			<var-badge
				style="z-index: 1"
				type="danger"
				:value="cardsStore.data.cardList.length"
				:hidden="!cardsStore.data.cardList.length"
				:max-value="999">
				<!-- *图库显示切换按钮 -->
				<var-button
					color="rgb(64,158,255,1)"
					@dblclick="appInfo.container.open = !appInfo.container.open"
					class="onlineGallery-float-button">
					<IconGirdRound />
				</var-button>
			</var-badge>
		</template>
		<template #default>
			<!-- *图库 -->
			<var-badge
				style="z-index: 1"
				type="danger"
				:value="cardsStore.data.cardList.length"
				:hidden="!cardsStore.data.cardList.length"
				:max-value="999">
				<var-button type="success" @click="appInfo.container.open = true" round>
					<IconDashboard />
				</var-button>
			</var-badge>
			<!-- *规则管理 -->
			<var-button type="info" @click="ruleEditor.container.open = true" round>
				<IconBxsBookBookmark />
			</var-button>
			<!-- *设置 -->
			<var-button color="rgb(217, 121, 252)" @click="" round>
				<IconToolsFill />
			</var-button>
			<!-- ?测试窗口 -->
			<var-button
				color="rgb(117, 121, 252)"
				@click="testBoardOpen = true"
				round>
				<IconTestTube />
			</var-button>
		</template>
	</var-fab>
</template>

<script setup lang="ts">
	import IconGirdRound from "@/icon/grid_round.svg";
	import IconDashboard from "@/icon/dashboard.svg";
	import IconBxsBookBookmark from "@/icon/bxs-book-bookmark.svg";
	import IconToolsFill from "@/icon/tools-fill.svg";
	import IconTestTube from "@/icon/bx-test-tube.svg";
	// const {x, y} = useMouse({type: "client"}); //* 用户鼠标
	// const {element} = useElementByPoint({x, y}); //* 鼠标所指的元素

	//* App - 信息
	const appInfo = useAppInfoStore(); //* 实例化appInfo数据仓库
	const cardsStore = useCardsStore(); //* 实例化cardsStore数据仓库
	const toolBar = useToolBarStore(); //* 实例化cardsStore数据仓库
	const ruleEditor = useRuleEditorStore(); //* 实例化ruleEditor数据仓库

	//* 组件或html元素的接收器定义
	const container = ref(); //*接收container dom

	//* 悬浮功能按钮
	const floatButtonRef = ref();
	const {x, y, style} = useDraggable(floatButtonRef, {
		initialValue: {x: 0, y: appInfo.window.height / 2},
		preventDefault: true,
		stopPropagation: true,
		pointerTypes: ["touch", "mouse", "pen"],
	});

	const testBoardOpen = ref(false);

	watch(
		//f 监听 - 主容器container.open变化
		() => appInfo.container.open,
		(newVal, oldVal) => {
			if (newVal) {
				console.log("onlineGallery - 打开");
				document.documentElement.dataset.showScrollbar = false.toString(); //* 页面隐藏滚动条
				container.value.focus();
			} else {
				console.log("onlineGallery - 收起");
				document.documentElement.dataset.showScrollbar = true.toString(); //* 还原页面滚动条
			}
		}
	);

	//! 挂载完成时执行
	onMounted(async () => {
		await ruleEditor.getLocationRule(); //* 获取本地信息
		toolBar.selectingInitRule(); //* 选出首个匹配的规则
		ElNotification({
			title: "提示",
			message: h("i", {style: "color: teal"}, "onlineGallery 已加载"),
			// type: "success",
			duration: 3000,
		});
		if (appInfo.container.open) {
			document.documentElement.dataset.showScrollbar = "false"; //* 页面隐藏滚动条
			container.value.focus();
		} else {
			document.documentElement.dataset.showScrollbar = "true"; //* 还原页面滚动条
		}
	});
</script>

<style scoped lang="scss">
	* {
		box-sizing: border-box;
		border: 0;
		pointer-events: auto;
	}

	$z-index: 2147483646;
	// $z-index:1000;

	//! 主容器样式
	.onlineGallery-container {
		box-sizing: border-box;
		position: fixed;

		z-index: $z-index;
		padding: 0 30px 20px 30px;
		margin: 0;
		left: calc(0px - var(--width));
		top: 0 !important;
		bottom: 0;
		width: var(--width);
		max-width: 100vw !important;
		background-color: rgba(255, 255, 255, 0.8);
		box-shadow: var(--el-box-shadow-dark);

		backdrop-filter: blur(2px);

		display: flex;
		flex-flow: column;
		justify-content: start;
		align-items: center;
		transition: 0.5s ease;

		/* *开启时候的样式 */
		&[data-open="true"] {
			left: 0px !important;
		}

		/* *去除焦点样式 */
		&:focus {
			outline: none;
		}

		@media (max-width: 500px) {
			padding: 4px;
		}
	}

	/* *右上角关闭按钮样式 */
	.onlineGallery-button-close {
		position: absolute;
		right: 10px;
		top: 10px;

		width: fit-content;
		height: fit-content;

		box-shadow: var(--el-box-shadow-light);
	}

	//! 子窗口容器样式(主要作为弹窗的容器)
	.onlineGallery-child-window-container {
		position: fixed;
		z-index: $z-index;
		// left: 0;
		// right: 0;
		// top: 0;
		// bottom: 0;
	}

	//* 悬浮按钮样式
	.onlineGallery-float-button {
		position: relative;
		width: 46px;
		height: 46px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;

		font-size: xx-large !important;
		svg {
			scale: 1.3;
		}
	}
</style>
