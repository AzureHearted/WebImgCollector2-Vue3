<template>
	<div ref="listContainer">
		<el-scrollbar ref="scrollbarRef" @scroll="handleScroll">
			<transition-group
				id="onlineGallery-listBody"
				class="onlineGallery-listBody"
				ref="listBody"
				:style="getStyle"
				name="list"
				tag="div">
				<Card
					v-for="(card, index) in cardsStore.filterCards"
					:card="card"
					:key="card.id"
					:index="index"
					:data-index="index"
					:style="{
						'--aspect-ratio': card.meta.aspectRatio,
					}">
				</Card>
			</transition-group>
			<transition name="backTop">
				<div
					v-show="backTopShow"
					ref="backTop"
					class="onlineGallery-backTop"
					@click="backToTop">
					<el-icon><i-ep-CaretTop /></el-icon>
				</div>
			</transition>
		</el-scrollbar>
	</div>
</template>

<script setup lang="ts">
	const listContainer = ref(); //* 用于接收list容器的dom
	const listBody = ref(); //* 用于接收list本体的dom
	const scrollbarRef = ref();
	const wrapRef = ref();

	const cardsStore = useCardsStore();

	const toolBar = useToolBarStore();

	const listControl = toolBar.listControl;

	//f 获取list的样式(计算属性)
	const getStyle = computed(() => {
		if (listContainer.value == null) {
			return;
		}

		const containerInfo = listContainer.value.getBoundingClientRect();
		let style = {
			"--nowColumn": listControl.showColumn,
			"--listHeight":
				containerInfo.height - 8 * listControl.showColumn - 10 + "px",
			"--cardMaxHeight": `calc(var(--listHeight) / var(--nowColumn))`,
		};
		if (listControl.showColumn <= 0) {
			style["--cardMaxHeight"] = "1000%";
		}
		return style;
	});

	const backTop = ref(); //* 用于接收回到顶部按钮
	const backTopShow = ref(false);

	interface scrollEvent {
		scrollLeft: number;
		scrollTop: number;
	}
	//f 处理滚动事件
	const handleScroll = (scrollEvent: scrollEvent) => {
		// console.log("list滚动", scrollEvent.scrollTop);
		if (scrollEvent.scrollTop > 150) {
			backTopShow.value = true;
		} else {
			backTopShow.value = false;
		}
	};

	//f 触发事件(回到顶部)
	const backToTop = () => {
		scrollbarRef.value.setScrollTop(0);
	};
</script>

<style lang="scss" scoped>
	* {
		border: 0;
		margin: 0;
		box-sizing: border-box;
	}

	.onlineGallery-listBody {
		width: 100%;
		padding: 10px;
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
		align-items: stretch;
		align-content: start;

		gap: 8px;

		transition: 1s;

		/* 禁止选中文字 */
		user-select: none;
		/* 禁止图文拖拽 */
		-webkit-user-drag: none;
	}

	//* 返回顶部按钮样式
	.onlineGallery-backTop {
		--el-backtop-bg-color: var(--el-bg-color-overlay);
		--el-backtop-text-color: var(--el-color-primary);
		--el-backtop-hover-bg-color: var(--el-border-color-extra-light);

		position: absolute;
		width: 40px;
		height: 40px;

		right: 40px;
		bottom: 40px;

		border-radius: 50%;
		background-color: var(--el-bg-color-overlay);
		color: var(--el-color-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20px;
		box-shadow: var(--el-box-shadow-lighter);
		cursor: pointer;
		z-index: 5;
		transition: 0.5s;

		&:hover {
			background-color: var(--el-border-color-extra-light);
		}
	}

	.backTop-enter-active,
	.backTop-leave-active {
		transition: opacity 0.5s ease;
	}

	.backTop-enter-from,
	.backTop-leave-to {
		opacity: 0;
	}

	//* 对移动中的元素应用的过渡
	.list-move,
	.list-enter-active,
	.list-leave-active {
		transition: all 0.5s ease;
	}

	.list-enter-from,
	.list-leave-to {
		opacity: 0;
		transform: translateX(30px);
	}

	//* 确保将离开的元素从布局流中删除以便能够正确地计算移动的动画。
	.list-leave-active {
		position: absolute;
	}
</style>
