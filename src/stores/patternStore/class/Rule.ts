import type {
	BaseMatchDescription,
	BaseMatchPreview,
	BaseMatchRegion,
	BaseRule,
	BaseMatchSource,
	BaseFilter,
	BaseStatus,
} from "../interface/Pattern";
import { buildUUID } from "@/utils/common";

export class Rule implements BaseRule {
	public readonly id: string;
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

	constructor(options?: Partial<BaseRule>) {
		this.id = options?.id || buildUUID();
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
		}
	}
}
