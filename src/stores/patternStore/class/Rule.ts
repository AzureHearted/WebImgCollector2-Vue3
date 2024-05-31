import _ from "lodash";
import type {
	BaseMatchDescription,
	BaseMatchPreview,
	BaseMatchRegion,
	BaseRule,
	BaseMatchSource,
	BaseFilter,
	BaseStatus,
	BaseRuleRowData,
} from "../interface/Pattern";
import { buildUUID } from "@/utils/common";

export class Rule implements BaseRule {
	public readonly id: string;
	public enable: boolean = true;
	public name: string = "新规则";
	public region: BaseMatchRegion = {
		enable: false,
		selector: "",
	};
	public source: BaseMatchSource = {
		selector: "",
		infoType: "property",
		name: "",
	};
	public preview: BaseMatchPreview = {
		enable: false,
		origin: "source",
		selector: "",
		infoType: "property",
		name: "",
	};
	public description: BaseMatchDescription = {
		enable: false,
		origin: "source",
		selector: "",
		infoType: "innerText",
		name: "",
	};
	public filter: BaseFilter = {
		formats: [],
		width: [0, -1],
		height: [0, -1],
	};
	public state: BaseStatus = {
		editing: false,
	};
	public backup: BaseRuleRowData | null = null;

	constructor(options?: Partial<BaseRule>) {
		this.id = options?.id || buildUUID();
		if (options?.enable !== undefined) {
			this.enable = options?.enable;
		}
		this.name = options?.name || this.name;
		this.name = options?.name || this.name;
		this.region = {
			...this.region,
			...options?.region,
		};
		this.source = {
			...this.source,
			...options?.source,
		};
		this.preview = {
			...this.preview,
			...options?.preview,
		};
		this.description = {
			...this.description,
			...options?.description,
		};
		this.filter = {
			...this.filter,
			...options?.filter,
		};
		this.state = {
			...this.state,
			...options?.state,
		};
		this.backupData();
	}

	// 获取纯数据对象
	public getRowData(options?: { includeId: boolean }): BaseRuleRowData {
		const defaultOptions: { includeId: boolean } = {
			includeId: true,
		};
		const { includeId } = { ...defaultOptions, ...options };
		return _.cloneDeep({
			id: includeId ? this.id : undefined,
			enable: this.enable,
			name: this.name,
			region: this.region,
			source: this.source,
			preview: this.preview,
			description: this.description,
			filter: this.filter,
		});
	}

	// 数据备份
	public backupData() {
		this.backup = this.getRowData();
	}

	// 恢复数据
	public recoveryData() {
		// 如果备份存在才进行恢复
		if (this.backup) {
			this.name = _.cloneDeep(this.backup.name);
			this.region = _.cloneDeep(this.backup.region);
			this.source = _.cloneDeep(this.backup.source);
			this.preview = _.cloneDeep(this.backup.preview);
			this.description = _.cloneDeep(this.backup.description);
			this.filter = _.cloneDeep(this.backup.filter);
		}
	}

	// 判断是否发生更改
	public isChange() {
		return !_.isEqual(this.backup, this.getRowData());
	}
}
