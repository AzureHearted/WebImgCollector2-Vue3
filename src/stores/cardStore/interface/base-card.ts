// 卡片接口
export interface BaseCard extends BaseState {
	id?: string;
	description: CardDescription;
	preview: CardPreview;
	source: CardSource;
	[key: string]: any;
}

// 基础信息接口
export interface BaseState {
	isMatch: boolean; // ? 匹配标识符
	isSelected: boolean; // ? 选中标识符
	isLoaded: boolean; // ? 加载标识符，用于懒加载的卡片
}

// 元信息接口
export interface BaseMeta {
	valid: boolean; //有效性
	width: number;
	height: number;
	aspectRatio?: number;
	type?: "image" | "video" | "audio" | "html" | null;
	size?: number;
	ext?: string; // 后缀如果有
	[key: string]: any; // 允许添加其他属性
}

// 基础链接类接口
export interface BaseLink {
	url: string; // 链接地址
	host?: string; // 链接请求所在域
}

// 来源接口
export interface CardSource extends BaseLink {
	originUrls?: string[];
	dom: HTMLElement | null;
	meta?: BaseMeta;
	blob?: Blob;
	[key: string]: any;
}
// 预览接口
export interface CardPreview extends BaseLink {
	dom: HTMLElement | null;
	meta?: BaseMeta;
	blob?: Blob;
	[key: string]: any;
}
// 描述类型
export interface CardDescription extends Partial<BaseLink> {
	title: string; // 标题
	content?: string; // 内容
	dom: HTMLElement | null;
	[key: string]: any;
}
