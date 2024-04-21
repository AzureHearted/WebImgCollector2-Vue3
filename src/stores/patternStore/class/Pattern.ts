import type {
	BasePattern,
	BaseStatus,
	BaseMainInfo,
	BaseRule,
} from "../interface/Pattern";
import { Rule } from "./Rule";
import { buildUUID } from "@/utils/common";

// 匹配方案
export class Pattern implements BasePattern {
	public readonly id: string; // 方案id
	public mainInfo: BaseMainInfo = {
		name: "新方案",
		host: location.hostname,
		icon: getFavicon(),
		titleSelector: "title",
		filter: {
			pattern: "",
			flags: [],
		},
	};
	public rules: Rule[]; // 规则列表
	public state: BaseStatus = {
		editing: false,
	};

	constructor(options?: Partial<BasePattern>) {
		this.id = options?.id || buildUUID(); // 为规则生成(拷贝)id
		this.mainInfo = {
			...this.mainInfo,
			...options?.mainInfo,
		};
		this.rules = options?.rules || [];
		this.state = {
			...this.state,
			...options?.state,
		};

		// 如果没有规则就创建规则
		if (!this.rules.length) {
			this.createRule();
		}
	}

	// 创建规则
	public createRule(options?: Partial<BaseRule>) {
		const rule = new Rule(options);
		this.rules.push(rule);
		return rule.id;
	}

	// 删除规则
	public deleteRule(id: string) {
		// 查询下标
		const index = this.rules.findIndex((rule) => rule.id === id);
		if (index >= 0) {
			this.rules.splice(index, 1);
		}
	}
}

//f 获取站点Favicon图标
export function getFavicon(): string {
	let iconUrl: string;
	//s [1]通过link标签查找
	const urls = (
		[...document.querySelectorAll("link[rel=icon]")] as HTMLLinkElement[]
	)
		.map((item: HTMLLinkElement) => item.href)
		.filter((url) => /\.(png|svg|jpg|jpeg|webp|icon?)$/i.test(url));

	if (urls.length > 0) {
		iconUrl = urls[0];
	} else {
		//s [2]若没找到直接使用域名拼接
		iconUrl = `${location.origin}/favicon.ico`;
	}
	return iconUrl;
}

// 默认方案
export const defaultPattern = new Pattern({
	id: "#",
	mainInfo: {
		name: "默认方案",
		host: "",
		titleSelector: "title",
		filter: {
			pattern: "",
			flags: [],
		},
		icon: "",
	},
	rules: [
		{
			id: "#default-rule#",
			name: "默认规则",
			region: {
				enable: false,
				selector: "",
			},
			source: {
				selector: "a:has(img),img[data-src],img[src]",
				infoType: "attribute",
				name: "href|srcset|data-src|src",
			},
			preview: {
				origin: "source",
				enable: false,
				selector: "",
				infoType: "property",
				name: "src",
			},
			description: {
				origin: "source",
				enable: false,
				selector: "",
				infoType: "property",
				name: "src",
			},
			filter: {
				formats: [],
				width: [300, 2000] as [number, number],
				height: [300, 2000] as [number, number],
			},
			state: {
				editing: false,
			},
		},
	],
});
