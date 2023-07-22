<template>
	<div ref="listContainer">
		<el-scrollbar ref="scrollbarRef">
			<transition-group
				class="onlineGallery-listBody"
				ref="listBody"
				:style="getStyle"
				name="list"
				tag="div">
				<Card
					v-for="(card, index) in cardsStore.data.filterCards"
					:card="card"
					:key="card.id"
					:data-index="index"
					:style="{
						'--aspect-ratio': card.meta.aspectRatio,
					}">
				</Card>
			</transition-group>
		</el-scrollbar>
	</div>
</template>

<script setup lang="ts">
	const listContainer = ref(); //* 用于接收list容器的dom
	const listBody = ref(); //* 用于接收list本体的dom
	const scrollbarRef = ref();

	const listStore = useListInfoStore();
	const cardsStore = useCardsStore();

	//f 获取list的样式(计算属性)
	const getStyle = computed(() => {
		if (listContainer.value == null) {
			return;
		}

		const containerInfo = listContainer.value.getBoundingClientRect();
		let style = {
			"--nowColumn": listStore.info.nowColumn,
			"--listHeight":
				containerInfo.height - 8 * listStore.info.nowColumn - 10 + "px",
			"--cardMaxHeight": `calc(var(--listHeight) / var(--nowColumn))`,
		};
		if (listStore.info.nowColumn <= 0) {
			style["--cardMaxHeight"] = "1000%";
		}
		return style;
	});
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

	.v-enter-active,
	.v-leave-active {
		transition: opacity 0.5s ease;
	}

	.v-enter-from,
	.v-leave-to {
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
