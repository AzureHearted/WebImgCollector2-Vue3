import { GM_storage } from "@/utils/common";
import type { Pattern } from "../class/Pattern";

// 设置用户方案数据
export function setUserPatternList(list: Pattern[] = []) {
	GM_storage({
		method: "set",
		name: "UserPatternList",
		value: JSON.stringify(list),
	});
}

// 获取用户方案数据
export function getUserPatternList() {
	const result: string | false = GM_storage({
		method: "get",
		name: "UserPatternList",
		default: false,
	});
	// 如果没有找到用户数据则进行用户数据创建
	if (!result) {
		setUserPatternList();
		return [] as Pattern[];
	}
	// 如果存在用户数据则将其解析为对象
	return JSON.parse(result) as Pattern[];
}
