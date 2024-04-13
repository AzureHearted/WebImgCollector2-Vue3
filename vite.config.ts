import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// import VueDevTools from "vite-plugin-vue-devtools";

import monkey, { util } from "vite-plugin-monkey";

// 自动按需引入配置
import components from "unplugin-vue-components/vite";
import autoImport from "unplugin-auto-import/vite";
// varlet组件库的自动引入配置
import { VarletImportResolver } from "@varlet/import-resolver";

//s 用于在vue项目中使用svg文件
import svgLoader from "vite-svg-loader";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		// VueDevTools(),
		//f 用于在vue项目中使用svg文件
		svgLoader(),
		components({
			resolvers: [VarletImportResolver()],
		}),
		autoImport({
			resolvers: [VarletImportResolver({ autoImport: true })],
			imports: [util.unimportPreset],
		}),
		monkey({
			entry: "./src/main.ts",
			userscript: {
				author: "ls", // 作者
				icon: "https://vitejs.dev/logo.svg", // 图标
				namespace: "npm/vite-plugin-monkey", // 命名空间
				match: ["http*://*", "http*://*/*"], // 要匹配的网站
				// exclude: ["*://element-plus.org/*"], // 要排除的网站
				noframes: true, //是否在iframe中使用
				"run-at": "document-body", // 嵌入时机
				require: [],
			},
			server: {
				open: false,
			},
		}),
	],
	css: {
		// 预处理器配置项
		preprocessorOptions: {
			less: {
				math: "always",
			},
		},
		postcss: {
			plugins: [],
		},
	},
	resolve: {
		// 路径别名设置
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			"@svg": fileURLToPath(new URL("./src/assets/svg", import.meta.url)),
		},
	},
	server: {
		open: false, // 项目运行时不自动打开浏览器
	},
	build: {
		// 使用terser进行压缩混淆
		minify: "terser",
	},
});
