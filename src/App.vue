<template>
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
			@click="openSwitch">
			<template #icon>
				<el-icon><i-ep-Close /></el-icon>
			</template>
		</el-button>
		<!-- *切换按钮 -->
		<el-popover
			placement="top-start"
			title="快捷菜单"
			:width="'auto'"
			trigger="hover"
			:disabled="appInfo.container.open">
			<!-- *触发 Popover 显示的 HTML 元素(按钮) -->
			<template #reference>
				<el-button
					type="primary"
					size="default"
					@click="openSwitch"
					class="onlineGallery-button-drawerOpen">
					<template #icon>
						<el-icon
							><i-ep-ArrowRightBold style="pointer-events: none"
						/></el-icon>
					</template>
				</el-button>
			</template>
			<!-- *Popover内容 -->
			<template #default>
				<el-button type="success" size="small" @click="openSwitch">
					<template #icon>
						<el-icon><i-ep-Grid /></el-icon>
					</template>
					<el-badge :value="cardsStore.data.cardList.length" :max="999">
						图库
					</el-badge>
				</el-button>
				<el-button
					type="primary"
					size="small"
					@click="ruleEditor.container.open = true">
					<template #icon>
						<el-icon><i-ep-Management /></el-icon>
					</template>
					规则管理</el-button
				>
				<el-button type="primary" size="small" @click="">
					<template #icon>
						<el-icon><i-ep-Tools /></el-icon>
					</template>
					设置
				</el-button>
				<!-- <el-icon><i-ep-CameraFilled /></el-icon> -->
			</template>
		</el-popover>
	</div>
	<!-- *子窗口容器 -->
	<div class="onlineGallery-child-window-container">
		<!-- *规则管理器窗口 -->
		<RuleEditor />
		<!-- *设置窗口 -->
		<!-- <AppSettingMenu /> -->
	</div>
</template>

<script setup lang="ts">
	// const {x, y} = useMouse({type: "client"}); //* 用户鼠标
	// const {element} = useElementByPoint({x, y}); //* 鼠标所指的元素

	//* App - 信息
	const appInfo = useAppInfoStore(); //* 实例化appInfo数据仓库
	const cardsStore = useCardsStore(); //* 实例化cardsStore数据仓库
	const toolBar = useToolBarStore(); //* 实例化cardsStore数据仓库
	const ruleEditor = useRuleEditorStore(); //* 实例化ruleEditor数据仓库

	//* 组件或html元素的接收器定义
	const container = ref(); //*接收container dom

	//f 开关切换
	const openSwitch = async () => {
		// 开关切换
		appInfo.container.open = !appInfo.container.open;
		if (appInfo.container.open) {
			document.documentElement.dataset.showScrollbar = false.toString(); //* 页面隐藏滚动条
			container.value.focus();
		} else {
			document.documentElement.dataset.showScrollbar = true.toString(); //* 还原页面滚动条
		}
	};

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

	/* *主容器样式 */
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

	/* *抽屉按钮 */
	.onlineGallery-button-drawerOpen {
		position: absolute;

		z-index: 1;
		margin: auto 0;

		$size: 30px;

		width: $size - 0px;
		height: $size * 2;

		border-radius: 0 $size $size 0;

		right: 0;
		top: 0;
		bottom: 0;

		cursor: pointer;

		display: flex;
		justify-content: center;
		align-items: center;

		font-size: xx-large;

		:root:has(.onlineGallery-container[data-open="false"]) & {
			border-radius: 0 $size $size 0 !important;
			box-shadow: var(--el-box-shadow-light);
			right: -$size;
			transition: 0.25s 0.25s ease;
		}

		:root:has(.onlineGallery-container[data-open="true"]) & {
			border-radius: $size 0 0 $size !important;
			background-color: transparent;
			box-shadow: none;
			transition: 0.25s 0.25s ease;
		}

		/* *抽屉按钮图标样式 */
		& i {
			transition: 0.25s 0.25s ease;
			:root:has(.onlineGallery-container[data-open="false"]) & {
				transform: rotateY(0deg);
				color: auto;
			}
			:root:has(.onlineGallery-container[data-open="true"]) & {
				transform: rotateY(180deg);
				color: #409eff;
			}
		}

		@media (max-width: 500px) {
			& {
				right: -$size !important;
				i {
					transform: rotateY(0deg) !important;
				}
			}
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

	//* 子窗口容器样式(主要作为弹窗的容器)
	.onlineGallery-child-window-container {
		position: fixed;
		z-index: $z-index;
		overflow: visible;
	}
</style>
