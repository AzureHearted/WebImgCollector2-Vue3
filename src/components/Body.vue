<template>
	<div
		class="onlineGallery-body"
		ref="body"
	>
		<!-- s进度条 -->
		<el-progress
			class="loadingBar"
			v-show="loading.show"
			:percentage="Math.round(loading.percentage)"
			:status="(loading.state as any)"
			striped
			striped-flow
		/>
		<!-- s工具栏 -->
		<Toolbar
			ref="toolbar"
			class="onlineGallery-toolBar"
		/>
		<List
			ref="list"
			class="listContainer"
		/>
	</div>
</template>

<script setup lang="ts">
	const appInfo = useAppInfoStore(); //s 实例化appInfo数据仓库
	const cardsStore = useCardsStore(); //s 实例化cardsStore数据仓库

	let toolbar = ref();

	//s 数据
	const data = cardsStore.data;

	//s 进度(条)
	const loading = appInfo.loading;
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
		.onlineGallery-toolBar {
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
