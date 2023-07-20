import {reactive, ref} from "vue";
import {useWindowSize} from "@vueuse/core";
import {createPinia, defineStore} from "pinia";

/**
 ** appInfo 信息共享
 */
export const useAppInfoStore = defineStore("appInfo", () => {
	const open = ref(false); //* 开关标识符
	/**
	 * f 开关切换
	 */
	function switchOpen() {
		open.value = !open.value;
	}

	const widthPercentage = ref(100); //* 宽度百分比
	/**
	 * f 设置宽度百分比
	 * @param {number} num 百分比数值(0~100)
	 */
	function setWidthPercentage(num) {
		if (num > 0 && num <= 100) {
			widthPercentage.value = num;
		} else if (num > 100) {
			widthPercentage.value = 100;
		}
	}
	const window = reactive({
		width: useWindowSize().width,
		height: useWindowSize().height,
	});
	return {open, switchOpen, widthPercentage, setWidthPercentage, window};
});
