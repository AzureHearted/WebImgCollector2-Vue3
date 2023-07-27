<template>
	<var-drag
		:style="{
			left: init.left + 'px',
			top: init.top + 'px',
		}"
		teleport=".onlineGallery-child-window-container">
		<div class="test-container" ref="containerRef">
			<div class="test-body">
				<h3>测试窗口</h3>
			</div>
			<div class="test-footer">
				<var-button type="primary" @click="handleClose"> 确认 </var-button>
				<var-button @click="handleClose">取 消</var-button>
			</div>
		</div>
	</var-drag>
</template>

<script setup lang="ts">
	interface IProps {
		outerDialogVisible: boolean;
	}
	const props = withDefaults(defineProps<IProps>(), {
		outerDialogVisible: false,
	});
	const emits = defineEmits(["toClose"]);

	const appInfo = useAppInfoStore();

	const containerRef = ref<HTMLElement | null>();

	const init = reactive({
		left: 0,
		top: 0,
	});

	onMounted(() => {
		const {width: w_width, height: w_height} = appInfo.window;
		const {width: c_width, height: c_height} =
			containerRef.value!.getBoundingClientRect();
		// console.log(w_width, w_height);
		// console.log(c_width, c_height);
		const left = (w_width - c_width) / 2;
		const top = (w_height - c_height) / 2;
		console.log(left, top);
		init.left = left;
		init.top = top;
	});

	//* 窗口关闭处理
	function handleClose() {
		emits("toClose");
	}
</script>

<style lang="scss" scoped>
	.test-container {
		// position: relative;
		width: 80vw;
		height: 70vh;
		padding: 20px;

		background-color: rgba(245, 222, 179, 0.9);
		border-radius: 4px;

		display: flex;
		flex-flow: column nowrap;

		box-shadow: var(--el-box-shadow-dark);
	}
	.test-body {
		position: relative;
		flex-grow: 1;
		width: 100%;
		h3 {
			margin: 0;
			padding: 0;
		}
		//! 虚拟列表容器
		.listContainer {
			& {
				width: 100%;
				height: 100%;
			}
			//* 虚拟列表画布
			.listWrapper {
				width: 100%;

				display: flex;
				flex-flow: row;
				justify-content: center;
				align-items: center;
			}
		}
	}
	.test-footer {
		width: 100%;
		height: fit-content;
		display: flex;
		flex-flow: row nowrap;
		justify-content: end;
	}
</style>
