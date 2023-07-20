<template>
	<div
		class="onlineGallery-container"
		ref="container"
		:data-open="appInfo.container.open"
		:style="{
			'--width': appInfo.window.width * appInfo.container.widthPercentage * 0.01 + 'px',
		}">
		<Body ref="body"></Body>
		<!-- *关闭按钮 -->
		<el-button
			class="onlineGallery-button-close"
			type="danger"
			:icon="Close"
			circle
			@click="openSwitch" />
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
						<el-icon><ArrowRightBold style="pointer-events: none" /></el-icon>
					</template>
				</el-button>
			</template>
			<!-- *Popover内容 -->
			<template #default>
				<el-button type="success" size="small" @click="openSwitch" :icon="Grid">
					<el-badge :value="appInfo.data.cardList.length" :max="999"> 图库 </el-badge>
				</el-button>
				<el-button
					type="primary"
					size="small"
					@click="ruleEditor.container.open = true"
					:icon="Management"
					>规则管理</el-button
				>
				<el-button type="primary" size="small" @click="" :icon="Tools">设置</el-button>
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

<script setup>
	//* 从共享仓库引入共享信息
	import {useAppInfoStore, useRuleEditorStore} from "./store/mainStore.js";
	import Body from "./components/Body.vue";
	//* element图标导入
	import {ArrowRightBold, Close, Management, Tools, Grid} from "@element-plus/icons-vue";

	//* App - 信息
	const appInfo = useAppInfoStore();
	const ruleEditor = useRuleEditorStore();

	//* 组件或html元素的接收器定义
	const container = ref(null); //*接收container dom
	const body = ref(null); //*接收container dom

	//f 开关切换
	const openSwitch = async () => {
		// 开关切换
		appInfo.container.open = !appInfo.container.open;
		if (appInfo.container.open) {
			document.documentElement.dataset.showScrollbar = false.toString(); //* 页面隐藏滚动条
			if (appInfo.data.cardList.length < 1) {
				setTimeout(() => body.value.getCards(), 1000);
			}
			container.value.focus();
		} else {
			document.documentElement.dataset.showScrollbar = true.toString(); //* 还原页面滚动条
		}
	};

	//! 挂载完成时执行
	onMounted(async () => {
		ElNotification({
			title: "提示",
			message: h("i", {style: "color: teal"}, "onlineGallery 已加载"),
			// type: "success",
			duration: 3000,
		});
		if (appInfo.container.open) {
			document.documentElement.dataset.showScrollbar = false; //* 页面隐藏滚动条
			container.value.focus();
		} else {
			document.documentElement.dataset.showScrollbar = true; //* 还原页面滚动条
		}
		setTimeout(() => body.value.getCards(), 1000);
	});
</script>

<style scoped lang="scss">
	* {
		box-sizing: border-box;
		border: 0;
		pointer-events: auto;
	}

	/* *主容器样式 */
	.onlineGallery-container {
		box-sizing: border-box;
		position: fixed;

		z-index: 2147483646;
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
		z-index: 2147483646;
		overflow: visible;
	}
</style>
./store/mainStore.js
