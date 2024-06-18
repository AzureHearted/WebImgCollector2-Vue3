<template>
	<div class="line-overflow-list__wrap" :style="[wrapStyle]" ref="wrapDOM">
		<slot></slot>
	</div>
	<div v-if="true" style="background: wheat">
		容器信息
		<n-code
			language="javascript"
			show-line-numbers
			:code="JSON.stringify(warpInfo, null, 2)"
			word-wrap>
		</n-code>
		<n-divider />
		<n-code
			language="javascript"
			show-line-numbers
			:code="JSON.stringify(childrenBounding, null, 2)"
			word-wrap>
		</n-code>
	</div>
</template>

<script lang="ts" setup>
	import { ref, reactive, onMounted, onUpdated, onUnmounted } from "vue";
	import type { HTMLAttributes, CSSProperties } from "vue";
	import { useElementBounding, useElementSize } from "@vueuse/core";
	import { computed } from "vue";
	import type { StyleValue } from "vue";

	const props = withDefaults(
		defineProps<{
			list?: {
				label: string;
				[key: string]: any;
			}[];
			wrapStyle?: HTMLAttributes["style"];
		}>(),
		{
			list: () => [],
		}
	);

	const wrapDOM = ref<HTMLElement | null>(null);
	//s wrap边界尺寸
	const warpBounding = reactive({
		...useElementBounding(wrapDOM),
	});
	//s warp内容区尺寸
	const warpSize = reactive({
		...useElementSize(wrapDOM),
	});
	//j 计算warp元素所有尺寸信息
	const warpInfo = computed<{
		[key in "bounding" | "inner"]: {
			top: number;
			left: number;
			right: number;
			bottom: number;
			width: number;
			height: number;
		};
	}>(() => {
		const innerTop =
			warpBounding.top +
			(wrapDOM.value
				? getDOMBoxValue(wrapDOM.value, "padding-top") +
				  getDOMBoxValue(wrapDOM.value, "border-bottom-width")
				: (warpBounding.height - warpSize.height) / 2);
		const innerLeft =
			warpBounding.left +
			(wrapDOM.value
				? getDOMBoxValue(wrapDOM.value, "padding-left") +
				  getDOMBoxValue(wrapDOM.value, "border-left-width")
				: (warpBounding.width - warpSize.width) / 2);
		return {
			bounding: {
				top: warpBounding.top,
				left: warpBounding.left,
				right: warpBounding.right,
				bottom: warpBounding.bottom,
				width: warpBounding.width,
				height: warpBounding.height,
			},
			inner: {
				top: innerTop,
				left: innerLeft,
				right: innerLeft + warpSize.width,
				bottom: innerTop + warpSize.height,
				width: warpSize.width,
				height: warpSize.height,
			},
		};
	});

	//f 获取元素盒子相关的外形尺寸值
	function getDOMBoxValue(
		element: HTMLElement,
		property:
			| "padding-top"
			| "padding-right"
			| "padding-bottom"
			| "padding-left"
			| "margin-top"
			| "margin-right"
			| "margin-bottom"
			| "margin-left"
			| "border-top-width"
			| "border-right-width"
			| "border-bottom-width"
			| "border-left-width"
	) {
		const computedStyle = window.getComputedStyle(element);
		return parseInt(computedStyle.getPropertyValue(property as string), 10);
	}
	//s 所有子元素
	const children = ref<Element[]>([]);

	onMounted(() => {
		if (!wrapDOM.value) return;
		console.log("挂载", { ...warpBounding }, { ...warpSize });
		//s 创建一个 MutationObserver 实例来监听子元素的变化
		const observer = new MutationObserver(() => {
			if (!wrapDOM.value) return;
			children.value = Array.from(wrapDOM.value.children);
			// console.log("MutationObserver", children.value);
		});

		//s 配置观察器: 监视子元素的增减
		observer.observe(wrapDOM.value, { childList: true });

		//s 初始时设置 children 的值
		children.value = Array.from(wrapDOM.value.children);

		//s (组件卸载时)清理
		onUnmounted(() => {
			observer.disconnect();
		});
	});

	// onUpdated(() => {
	// 	console.log(
	// 		"更新",
	// 		children.value.map((x) => x.textContent)
	// 	);
	// });

	//f 计算子元素溢出下标
	const overflowIndex: () => number = () => {
		const doms = children.value;
		if (!doms.length) return -1;
		let index = -1;
		children.value.forEach((x) => {});
		return index;
	};

	//j 计算所有子元素边界信息
	const childrenBounding = computed<
		{
			width: number;
			left: number;
		}[]
	>(() => {
		return children.value.map((x) => {
			const { width, height, left, top } = x.getBoundingClientRect();
			return { width, left };
		});
	});
</script>

<style lang="scss" scoped>
	.line-overflow-list__wrap {
		position: relative;
		box-sizing: border-box;
		display: flex;
		flex-flow: row nowrap;
		background-color: skyblue;
		// margin: 4px;
		padding: 4px;
		// padding-left: 4px;
		border: 4px solid black;

		// overflow: hidden;
		// text-overflow: ellipsis;
		// white-space: nowrap;
	}
	.overflow {
		background: red;
	}
</style>
