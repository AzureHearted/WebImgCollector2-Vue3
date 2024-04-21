import { ref, reactive, computed } from "vue";
import type { ComputedRef } from "vue";
import { defineStore } from "pinia";
import { Pattern, defaultPattern } from "./class/Pattern";
import { Rule } from "./class/Rule";

export default defineStore("patternStore", () => {
	// 方案列表
	const list = ref<Pattern[]>([defaultPattern]);
	// 当前方案信息
	const current = reactive({
		id: "#",
	});
	// 当前编辑中的方案信息
	const editing = reactive({
		id: "#", // 方案id
		ruleId: "", // 规则id (默认为空)
	});

	// 当前编辑的方案
	const editingPattern: ComputedRef<Pattern | null> = computed(() => {
		return findPattern(editing.id);
	});
	// 查询方案
	function findPattern(id: string): Pattern | null {
		const pattern = list.value.find((pattern) => pattern.id === id);
		if (!pattern) return null;
		return pattern;
	}

	// 当前编辑的规则
	const editingRule: ComputedRef<Rule | null> = computed(() => {
		const rule = findRule(editing.ruleId, editing.id);
		return rule;
	});
	// 查询规则
	function findRule(ruleId: string, patternId: string): Rule | null {
		const pattern = findPattern(patternId);
		if (!pattern) return null;
		const rule = pattern.rules.find((rule) => rule.id === ruleId);
		if (!rule) return null;
		return rule;
	}

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

	return {
		list,
		current,
		editing,
		editingPattern,
		editingRule,
		createPattern,
		deletePattern,
		findPattern,
		findRule,
	};
});
