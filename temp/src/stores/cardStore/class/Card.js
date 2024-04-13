import { buildUUID } from "@/utils/common";
// 卡片对象
export default class Card {
    id;
    source = {
        url: "", // 卡片来源url，可能为空，因为可能从本地创建的卡片，没有url
        dom: null,
    };
    preview = {
        url: "", // 预览图url,
        dom: null,
    };
    description = {
        title: "", // 卡片标题，可能为空，因为可能从本地创建的卡片，没有标题
        dom: null,
    };
    isMatch;
    isLoaded;
    isSelected;
    constructor(source, preview, description) {
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
    // 设置卡片描述
    setDescription(description) {
        this.description = description;
    }
    // 设置卡片预览图
    setPreview(preview) {
        this.preview = preview;
    }
    // 设置卡片来源
    setSource(source) {
        this.source = source;
    }
}
