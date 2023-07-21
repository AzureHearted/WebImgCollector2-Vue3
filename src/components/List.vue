<template>
	<div ref="listContainer">
		<el-scrollbar ref="scrollbarRef">
			<div class="onlineGallery-listBody" ref="listBody" :style="getStyle">
				<Card
					v-for="(card, index) in cards"
					:card="card"
					:key="card.id"
					:data-index="index"
					:style="{
						'--aspect-ratio': card.aspectRatio,
					}">
				</Card>
			</div>
		</el-scrollbar>
	</div>
</template>

<script setup lang="ts">
	const props = defineProps({
		nowColumn: {
			type: Number,
			default: 3,
		},
		cards: {
			type: Object,
			default: [],
		},
	});

	const listContainer = ref(null); //* 用于接收list容器的dom
	const listBody = ref(null); //* 用于接收list本体的dom
	const scrollbarRef = ref(null);

	//f 获取list的样式(计算属性)
	const getStyle = computed(() => {
		if (listContainer.value == null) {
			return;
		}

		const containerInfo = listContainer.value.getBoundingClientRect();
		let style = {
			"--nowColumn": props.nowColumn,
			"--listHeight": containerInfo.height - 8 * props.nowColumn - 10 + "px",
			"--cardMaxHeight": `calc(var(--listHeight) / var(--nowColumn))`,
		};
		if (props.nowColumn <= 0) {
			style["--cardMaxHeight"] = "1000%";
		}
		return style;
	});
</script>

<style lang="less" scoped>
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
</style>
