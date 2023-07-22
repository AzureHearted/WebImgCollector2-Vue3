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
		<Toolbar ref="toolbar" class="toolBar" />
		<List ref="list" class="listContainer" />
	</div>
</template>

<script setup lang="ts">
	const appInfo = useAppInfoStore(); //* 实例化appInfo数据仓库
	const cardsStore = useCardsStore(); //* 实例化cardsStore数据仓库

	let toolbar = ref();

	//* 信息
	const info = reactive({
		nowColumn: 4,
		allSelected: false,
	});

	//* 数据
	const data = cardsStore.data;

	//* 进度(条)
	const loading = appInfo.loading;

	//* 记录子组件方法
	let getCards = () => {
		toolbar.value.getCards();
	};

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
