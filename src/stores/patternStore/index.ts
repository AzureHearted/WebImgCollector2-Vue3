import { ref, reactive, computed } from "vue";
import type { ComputedRef } from "vue";
import { defineStore } from "pinia";
import { Pattern, defaultPattern } from "./class/Pattern";
import { Rule } from "./class/Rule";
import {
	getUserPatternList,
	setUserPatternList,
} from "./utils/handle-user-data";
// import { GM_getValue, GM_setValue } from "$";

export default defineStore("patternStore", () => {
	// console.log("用户方案列表：", userPatternList);
	// 方案列表
	const list = ref<Pattern[]>([defaultPattern]);
	// 获取用户方案信息
	function getUserPatternInfo() {
		list.value = [defaultPattern];
		// 用户方案数据
		const userPatternList: Pattern[] = getUserPatternList();
		console.log(
			"%c[日志]%cWebImgCollector2:",
			"color: #800080; background: #FFFF00; font-size: 14px;font-weight: bold; padding: 0 5px;",
			"color: #00FF00; font-size: 14px; padding: 0 5px;margin:5px",
			"读取用户方案",
			userPatternList
		);
		list.value.push(...userPatternList);
	}
	// 保存(设置)用户方案信息
	function saveUserPatternInfo() {
		// 使用备份数据进行存储
		const rowDataList = list.value
			.slice(1)
			.map((p) => p.getRowData({ type: "backup" }));
		console.log(
			"%c[日志]%cWebImgCollector2:",
			"color: #800080; background: #FFFF00; font-size: 14px;font-weight: bold; padding: 0 5px;",
			"color: #00FF00; font-size: 14px; padding: 0 5px;margin:5px",
			"存储用户方案",
			rowDataList
		);
		setUserPatternList(rowDataList);
	}

	// 当前使用的方案信息
	const used = reactive({
		id: "#",
	});

	// 获取初始方案id
	function getInitPattern() {
		let targetPattern: Pattern | null = null;

		const matchedPatterns: Pattern[] = list.value.filter((p) => {
			if (p.id.includes("#")) return false;
			// 先过滤域名
			return new RegExp(`${p.mainInfo.host}`).test(location.origin);
		});
		console.log("matchedPatterns", matchedPatterns, matchedPatterns.length);
		if (matchedPatterns.length) {
			// 路径过滤
			for (let i = 0; i < matchedPatterns.length; i++) {
				const pattern = matchedPatterns[i];

				if (pattern.mainInfo.filter.expression.trim().length > 0) {
					// 如果过滤器表达式不为空则进行匹配判断
					const expression = pattern.mainInfo.filter.expression;
					const flags = [
						...new Set(["g", ...pattern.mainInfo.filter.flags]),
					].join("");

					let regex: RegExp;

					try {
						regex = new RegExp(expression, flags);
					} catch (e) {
						console.error(e);
						continue;
					}
					let isMatch: boolean = false;
					if (!regex) {
						isMatch = true;
					} else {
						isMatch = regex.test(location.pathname + location.search);
					}

					if (isMatch) {
						targetPattern = pattern;
						break;
					}
				} else {
					// 过滤器表达式为空直接将当前方案定为目标方案
					targetPattern = pattern;
					break;
				}
			}
			console.log(targetPattern);
			if (!targetPattern) {
				targetPattern = defaultPattern;
			}
		}
		console.log("初始方案", targetPattern);
		if (targetPattern) {
			used.id = targetPattern.id;
			// return targetPattern.id;
			//? 初始化filter
			// initFilter(targetPattern);
		} else {
			//s 没有匹配到则使用默认规则
			used.id = "#";
			// return "#";
		}
	}

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

	// 获取当前方案
	function getCurrentPattern() {
		return findPattern(current.id);
	}

	// 创建方案
	function createPattern() {
		list.value.push(new Pattern());
		saveUserPatternInfo();
		// console.log(JSON.stringify(list.value));
	}
	// 删除方案
	function deletePattern(id: string) {
		// 获取按方案下标
		const index = list.value.findIndex((pattern) => pattern.id === id);
		// console.log(index);
		if (index >= 0) {
			list.value.splice(index, 1);
			saveUserPatternInfo();
		}
	}

	return {
		list,
		used,
		current,
		editing,
		editingPattern,
		editingRule,
		getUserPatternInfo,
		saveUserPatternInfo,
		getInitPattern,
		createPattern,
		deletePattern,
		findPattern,
		getCurrentPattern,
		findRule,
	};
});
