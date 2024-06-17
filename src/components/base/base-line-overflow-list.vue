<!-- 单行溢出 -->
<template>
	<div ref="container" class="line-overflow-list-container">
		<div class="line-overflow-list">
			<span
				ref="items"
				v-for="(item, index) in list"
				:key="idProp ? item[idProp] : index">
				<!-- 默认插槽 -->
				<slot :item="item" :index="index">
					{{ valueProp ? item[valueProp] : item }}
				</slot>
			</span>
		</div>

		<!-- Popover -->
		<el-popover
			popper-class="line-overflow-list-popover"
			placement="top"
			width="350"
			trigger="click">
			<!-- 溢出内容全部展示 -->
			<div class="overflow-content-all">
				<!-- 默认的全部内容展示时的选内容插槽 -->
				<span
					v-for="(item, index) in list"
					:key="idProp ? item[idProp] : index">
					<!-- 默认插槽 -->
					<slot :item="item" :index="index">
						{{ valueProp ? item[valueProp] : item }}
					</slot>
				</span>
			</div>
			<!-- 溢出按钮 -->
			<template #reference>
				<el-button>
					<template #icon>
						<i-ep-more @click="showMore = !showMore" />
					</template>
				</el-button>
			</template>
		</el-popover>
	</div>
</template>

<script lang="ts" setup>
	import { throttle } from "@/utils/common"; // 引入节流函数，避免频繁触发resize事件
	import { ref, computed, watch, onMounted } from "vue";
	const list = defineModel("list", { type: Array<any>, default: () => [] });

	const props = withDefaults(
		defineProps<{
			idProp?: string;
			valueProp?: string;
			// 单行宽度，用于计算容器高度，避免溢出
			width?: number | string;
			// 单行高度，用于计算容器高度，避免溢出
			height?: number | string;
		}>(),
		{
			idProp: "",
			valueProp: "",
			width: "auto",
			height: 36,
		}
	);

	const emits = defineEmits<{
		(e: "update", val: any[]): void;
		(e: "change:overflow-index", val: number): void;
	}>();

	const container = ref<HTMLElement | null>(null);
	const items = ref<HTMLElement[]>();
	const overflowIndex = ref(-1);
	const showMore = ref(false);

	const style = computed(() => {
		return {
			height:
				typeof props.height === "string" ? props.height : `${props.height}px`, // 兼容传入数字或字符串的情况
		};
	});

	watch(overflowIndex, (val, oldVal) => {
		if (val !== oldVal) {
			emits("change:overflow-index", val);
		}
	});

	/** 计算子元素宽度之和是否超出了容器宽度(并且返回从哪一个元素开始溢出)
	 * 	@returns {number} 溢出开始的位置
	 */
	const getOverflowIndex = () => {
		if (!items.value?.length || !container.value) return -1; // 如果没有子元素，直接返回false
		// 获取容器的宽度
		let { width } = container.value.getBoundingClientRect();
		let total = 0; // 子元素宽度之和
		for (let i = 0; i < items.value.length; i++) {
			let item = items.value[i];
			total = total + item.offsetWidth; // 累加子元素宽度
			// 检查是否溢出
			if (total > width) {
				return i;
			}
		}
		return -1;
	};
	// 处理resize事件
	const handleResize = () => {
		// console.log("尺寸变化");
		overflowIndex.value = getOverflowIndex();
		// console.log("溢出位置", this.overflowIndex);
	};
	// 为容器注册resize事件监听器，以便在窗口大小变化时重新计算溢出位置。
	const registerResizeListener = () => {
		let callback = () => {
			// 更新溢出下标
			handleResize();
		};
		let handle = throttle(callback, 200); // 使用节流函数包装
		// 创建ResizeObserver实例
		const resizeObserver = new ResizeObserver(handle);
		// 监听容器元素
		if (!container.value) return;
		resizeObserver.observe(container.value);
	};

	onMounted(() => {
		handleResize(); // 初始化时计算溢出位置
	});
</script>

<style lang="scss" scoped>
	.line-overflow-list-container {
		position: relative; // 为了放置按钮定位的基准
		box-sizing: border-box;
		display: flex;
		flex-flow: row nowrap;
		overflow: hidden;
	}
	.line-overflow-list {
		width: 100%;
		display: flex;
		flex-flow: row nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.overflow-button {
		position: absolute;
		right: 0.05rem;
		padding: 0.14rem 0.3rem;

		top: 50%; // 按钮位置调整，根据实际情况调整
		transform: translate(0, -50%);
		-webkit-transform: translate(0, -50%);
		-ms-transform: translate(0, -50%);

		cursor: pointer;
		z-index: 10;

		color: #fff;
		background-color: #409eff;
		border-color: #409eff;
		border-radius: 4px;

		&:hover {
			background: #66b1ff;
			border-color: #66b1ff;
			color: #fff;
		}
	}
</style>
<!-- 全局样式 -->
<style lang="scss">
	.el-popover.line-overflow-list-popover {
		background: #ffffff71;
		backdrop-filter: blur(10px);
		box-shadow: 0 0 10px 0 #333;
		line-height: 1.3rem;
	}
</style>
