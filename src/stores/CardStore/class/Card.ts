import type {
	BaseCard,
	CardDescription,
	CardPreview,
	CardSource,
	BaseState,
} from "../interface";
import { buildUUID } from "@/utils/common";

export type ICard = Partial<BaseCard> & BaseState;

// 卡片对象
export default class Card implements ICard {
	public readonly id: string;
	public source: CardSource = {
		url: "", // 卡片来源url，可能为空，因为可能从本地创建的卡片，没有url
		dom: null,
		meta: { valid: false, width: 0, height: 0, type: "html", ext: "" },
	};
	public preview: CardPreview = {
		url: "", // 预览图url,
		dom: null,
		meta: { valid: false, width: 0, height: 0, type: "html", ext: "" },
	};
	public description: CardDescription = {
		title: "", // 卡片标题，可能为空，因为可能从本地创建的卡片，没有标题
		dom: null,
	};
	public isMatch: boolean;
	public isLoaded: boolean;
	public isSelected: boolean;

	// 构造函数
	constructor(
		source?: CardSource,
		preview?: CardPreview,
		description?: CardDescription
	) {
		// 初始化卡片对象属性
		this.id = buildUUID(); // 生成uuid作为id
		this.isMatch = false;
		this.isLoaded = false;
		this.isSelected = false;

		// 合并用户初始化传入的值，如果有的话。
		this.source = { ...this.source, ...source };
		this.preview = { ...this.preview, ...preview };
		this.description = {
			...this.description,
			...description,
		};
	}

	// 设置Preview blob
	public setPreviewBlob(blob: Blob): void {
		this.preview.blob = blob;
	}

	// 设置Source blob
	public setSourceBlob(blob: Blob): void {
		this.source.blob = blob;
	}

	// 设置卡片描述
	public setDescription(description: CardDescription): void {
		this.description = description;
	}

	// 设置卡片预览图
	public setPreview(preview: CardPreview): void {
		this.preview = preview;
	}

	// 设置卡片来源
	public setSource(source: CardSource & { originUrls?: string[] }): void {
		this.source = source;
	}
}
