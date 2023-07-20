import {reactive, ref} from "vue";
import {useWindowSize} from "@vueuse/core";
import {createPinia, defineStore} from "pinia";

/**
 ** appInfo 信息共享
 */
export const useAppInfoStore = defineStore("appInfo", () => {
	//* 容器信息
	const container = reactive({
		open: false, //* 开关标识符
		widthPercentage: 100, //* 宽度百分比
	});

	//* 窗口信息
	const window = reactive({
		width: useWindowSize().width,
		height: useWindowSize().height,
	});

	//* 数据
	const data = reactive({
		cardList: [], //* 卡片列表
		filterCards: [], //* 过滤后的结果
	});

	return {data, container, window};
});

/**
 * * 规则编辑窗口 共享信息
 */
export const useRuleEditorStore = defineStore("ruleEditor", () => {
	const container = reactive({
		open: false,
	});
	return {container};
});
