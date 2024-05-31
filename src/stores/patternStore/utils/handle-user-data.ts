import { GM_storage } from "@/utils/common";
import { Pattern } from "../class/Pattern";
import type { BasePatternRowData } from "../interface/Pattern";

// 设置用户方案数据
export function setUserPatternList(list: BasePatternRowData[] = []) {
	GM_storage({
		method: "set",
		name: "UserPatternList",
		value: JSON.stringify(list),
	});
	// GM_setValue("UserPatternList", JSON.stringify(list));
}

// 获取用户方案数据
export function getUserPatternList(): Pattern[] {
	const result: string | false = GM_storage({
		method: "get",
		name: "UserPatternList",
		default: false,
	});
	// const result = GM_getValue("UserPatternList", null);
	// 如果没有找到用户数据则进行用户数据创建
	if (!result) {
		setUserPatternList();
		return [] as Pattern[];
	}
	// 如果存在用户数据则将其解析为对象
	return [...(JSON.parse(result) as Array<any>)].map((pattern: any) => {
		return new Pattern(pattern);
	});
}
