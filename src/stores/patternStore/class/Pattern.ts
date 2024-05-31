import _ from "lodash";
import type {
	BasePattern,
	BaseStatus,
	BaseMainInfo,
	BaseRule,
	BasePatternRowData,
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
			expression: "",
			flags: [],
		},
	};
	public rules: Rule[]; // 规则列表
	public state: BaseStatus = {
		editing: false,
	};

	public backup: BasePattern["backup"] | null = null;

	// 构造
	constructor(options?: Partial<BasePattern>) {
		this.id = options?.id || buildUUID(); // 为规则生成(拷贝)id
		this.mainInfo = {
			...this.mainInfo,
			...options?.mainInfo,
		};
		this.rules = (options?.rules || []).map((x) => new Rule(x));
		this.state = {
			...this.state,
			...options?.state,
		};

		// 如果没有规则就创建规则
		if (!this.rules.length) {
			this.createRule();
		} else {
			this.rules = this.rules.map((r) => new Rule(r));
		}

		// 构造后进行数据备份
		this.backupData();
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

	// 获取纯数据对象

	public getRowData(options?: { includeId: boolean }): BasePatternRowData {
		const defaultOptions: { includeId: boolean } = {
			includeId: true,
		};
		const { includeId } = { ...defaultOptions, ...options };
		return _.cloneDeep({
			id: includeId ? this.id : undefined,
			mainInfo: this.mainInfo,
			rules: this.rules.map((r) =>
				r.getRowData({
					includeId,
				})
			),
		});
	}

	// 数据备份
	public backupData() {
		this.rules.forEach((r) => r.backupData());
		this.backup = {
			id: _.cloneDeep(this.id),
			mainInfo: _.cloneDeep(this.mainInfo),
			rules: _.cloneDeep(this.rules),
		};
	}

	// 恢复数据
	public recoveryData() {
		this.rules.forEach((r) => r.recoveryData());
		// 如果备份存在才进行恢复
		if (this.backup) {
			this.mainInfo = _.cloneDeep(this.backup.mainInfo);
			this.rules = _.cloneDeep(this.backup.rules).map((r) => new Rule(r));
		}
	}

	// 判断是否发生更改
	public isChange() {
		return (
			!_.isEqual(this.mainInfo, _.cloneDeep(this.backup?.mainInfo)) ||
			this.rules.some((x) => x.isChange()) ||
			this.rules.length !== this.backup?.rules.length
		);
	}

	// 获取JSON
	public getJson() {
		return JSON.stringify(this.getRowData());
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
		icon: "",
		titleSelector: "title",
		filter: {
			expression: "",
			flags: [],
		},
	},
	rules: [
		new Rule({
			id: "#default-rule#",
			enable: true,
			name: "默认规则",
			region: {
				enable: false,
				selector: "",
			},
			source: {
				selector:
					'meta[property="og:image"],a:has(img),[href*=\\.jpg],[href*=\\.png],[href*=\\.webp],[href*=\\.jpeg],img[data-src],img[src]',
				infoType: "attribute",
				name: "content|href|srcset|data-src|src",
			},
			preview: {
				enable: false,
				origin: "source",
				selector: "",
				infoType: "property",
				name: "src",
			},
			description: {
				enable: false,
				origin: "source",
				selector: "",
				infoType: "property",
				name: "src",
			},
			filter: {
				formats: [],
				width: [300, 2000],
				height: [300, 2000],
			},
		}),
	],
});
