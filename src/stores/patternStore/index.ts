import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import { Pattern, defaultPattern } from "./class/Pattern";

export default defineStore("patternStore", () => {
	const list = ref<Pattern[]>([defaultPattern]);

	// 创建方案
	function createPattern() {
		list.value.push(new Pattern());
	}
	// 删除方案
	function deletePattern(id: string) {
		// 获取按方案下标
		const index = list.value.findIndex((pattern) => pattern.id === id);
		console.log(index);
		if (index >= 0) {
			list.value.splice(index, 1);
		}
	}

	return { list, createPattern, deletePattern };
});
