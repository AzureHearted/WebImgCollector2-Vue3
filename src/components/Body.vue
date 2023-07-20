<template>
	<div class="onlineGallery-body" ref="body">
		<!-- *进度条 -->
		<el-progress
			class="loadingBar"
			v-show="loading.show"
			:percentage="Math.round(loading.percentage)"
			:status="loading.state"
			striped
			striped-flow />
		<!-- *工具栏 -->
		<Toolbar ref="toolbar" :data="data" :info="info" :loading="loading" class="toolBar" />
		<List ref="list" class="listContainer" :cards="data.filterCards" :nowColumn="info.nowColumn" />
	</div>
</template>

<script setup>
	import List from "./List.vue";
	import Toolbar from "./Toolbar.vue";

	import {useAppInfoStore} from "../store/mainStore.js";

	const appInfo = useAppInfoStore();

	let toolbar = ref(null);

	//* 记录子组件方法
	let getCards = () => {
		toolbar.value.getCards();
	};

	//* 信息
	const info = reactive({
		nowColumn: 4,
		allSelected: false,
	});

	//* 数据
	const data = appInfo.data;

	//* 进度(条)
	const loading = reactive({
		value: false,
		show: false,
		state: "",
		percentage: 0,
		//f 进度条初始化函数
		init: () => {
			loading.value = true;
			loading.show = true;
			loading.percentage = 0;
			loading.state = "";
		},
		//f 进度条重置函数
		reset: () => {
			setTimeout(() => {
				loading.value = false;
				loading.state = "success";

				setTimeout(() => {
					loading.show = false;
					loading.percentage = 0;
					loading.state = "";
				}, 1500);
			}, 500);
		},
	});

	defineExpose({
		data,
		info,
		loading,
		getCards,
	});
</script>

<style lang="scss" scoped>
	* {
		border: 0;
		margin: 0;
		box-sizing: border-box;
	}

	/* *主体样式 */
	.onlineGallery-body {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		flex-flow: column;
		justify-content: stretch;
		align-items: center;

		--header-height: 80px;

		/* *工具栏样式 */
		.toolBar {
			flex-shrink: 0;
			position: relative;

			max-width: 100%;
			width: 100%;
			height: max-content;
			// height: var(--header-height);
		}

		/* *列表样式 */
		.listContainer {
			flex-grow: 1;
			position: relative;
			width: 100%;
			// height: calc(100% - var(--header-height));
			border-radius: 6px;
			box-shadow: var(--el-box-shadow-light);
			overflow: hidden;
		}

		/* *进度条样式 */
		.loadingBar {
			position: absolute;
			margin: 0 auto;
			top: 2px;
			left: 0;
			right: 0;
			width: 50%;
			@media (max-width: 500px) {
				width: 80%;
			}
		}
	}
</style>
