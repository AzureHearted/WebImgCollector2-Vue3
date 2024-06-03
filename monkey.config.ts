// import { util } from "vite-plugin-monkey";
import type { MonkeyOption } from "vite-plugin-monkey";

export default {
	entry: "./src/main.ts",
	userscript: {
		name: "WebImgCollector2",
		description: "图片聚合器",
		author: "ls", // 作者
		// updateURL: "", //更新地址
		version: "1.3.5",
		icon: "https://vitejs.dev/logo.svg", // 图标
		namespace: "npm/vite-plugin-monkey", // 命名空间
		match: ["*://*", "*://*/*"], // 要匹配的网站
		include: ["*"],
		// exclude: ["*://element-plus.org/*"], // 要排除的网站
		noframes: true, // 禁止在iframe中使用
		connect: ["*"],
		"run-at": "document-body", // 嵌入时机
		require: [],
	},
	server: {
		open: false,
	},
} as MonkeyOption;
