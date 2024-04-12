// 匹配方案
export interface MatchPattern {
	id: string; // 方案id
	mainInfo: MainInfo; // 方案信息
	rules: MatchRule[]; // 可以有多条匹配规则
}

// 主要信息
export interface MainInfo {
	name: string; //s 规则名称
	host: string; //s 域名
	// 路径过滤器
	filter: Pick<Regex, "pattern" | "flags">;
	icon: string; //s 站点图标链接
	titleSelector: string; //s 标题选择器
}

// 匹配规则
export interface MatchRule {
	region: MatchRegion; // 区域匹配
	preview: MatchPreview; // 预览源匹配
	source: MatchSource; // 源匹配
	description: MatchDescription; // 描述匹配
	filter: RuleFilter; // 过滤器
}

// 基础匹配接口
export interface BaseMatch {
	selector: string; // 选择器(多个时用竖线“|”分隔)
	infoType:
		| "value"
		| "attribute"
		| "property"
		| "innerText"
		| "innerHTML"
		| "outerHTML";
	name: string; // 属性名(多个时用竖线“|”分隔)
}

//s 匹配区域
export interface MatchRegion extends Pick<BaseMatch, "selector"> {
	//s 时候启用区域限定(开启后将以该项指定的区域作为起点查找查询其他项目)
	enable: boolean; // 是否开启
}

// s 匹配来源
export interface MatchSource extends BaseMatch {}

// s 匹配预览来源
export interface MatchPreview extends BaseMatch {
	enable: boolean;
	origin: "custom" | "region" | "source"; // 获取来源
}

// s 匹配描述内容
export interface MatchDescription extends BaseMatch {
	enable: boolean;
	origin: "custom" | "region" | "source"; // 获取来源
}

// 基础正则接口
interface Regex {
	pattern: string; //s 正则表达式
	replaceTo: string; //s 替换结果
	flags: string[]; //s 正则修饰符
}

//s 正则提取修正类型的接口
interface MatchRegExtract extends Pick<Regex, "pattern" | "flags"> {}

//s 正则替换类型的接口
interface MatchRegReplace extends Regex {}

//s 正则修正类型
type RegexFix = [MatchRegExtract | MatchRegReplace] | [];

//s 匹配过滤器
interface RuleFilter {
	formats: string[]; //格式列表
	width: [number, number]; // 宽度范围
	height: [number, number]; // 高度范围
}

//? 规则状态
interface RuleStatus {
	editing: boolean;
	isNewCreated: boolean;
}
