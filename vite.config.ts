import { fileURLToPath, URL } from "node:url";
import path from "path";
const pathSrc = path.resolve(__dirname, "src");

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// import VueDevTools from "vite-plugin-vue-devtools";

import monkey, { util } from "vite-plugin-monkey";
import type { GreasemonkeyUserScript } from "vite-plugin-monkey";

// 自动按需引入配置
import components from "unplugin-vue-components/vite";
import autoImport from "unplugin-auto-import/vite";
// varlet组件库的自动引入配置
import { VarletImportResolver } from "@varlet/import-resolver";
// element-plus组件库的自动引入配置
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";

//s 用于在vue项目中使用svg文件
import svgLoader from "vite-svg-loader";

// 打包分析插件
import { visualizer } from "rollup-plugin-visualizer";

import vuetify from "vite-plugin-vuetify";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		// VueDevTools(),
		//f 用于在vue项目中使用svg文件
		svgLoader(),
		components({
			resolvers: [
				VarletImportResolver(),
				ElementPlusResolver({
					importStyle: "sass",
				}),
				// 自动注册图标组件
				IconsResolver({
					// prefix: "Icon", //图标组件前缀,默认是“i”
					enabledCollections: ["ep", "ant-design", "material-symbols"],
				}),
			],
			dts: "./types/components.d.ts",
		}),
		autoImport({
			resolvers: [
				VarletImportResolver({ autoImport: true }),
				ElementPlusResolver({
					importStyle: "sass",
				}),
			],
			imports: [util.unimportPreset],
			dts: "./types/auto-imports.d.ts",
		}),
		Icons({
			autoInstall: true,
		}),
		vuetify({
			autoImport: {
				ignore: ["Ripple"], // vuetify的ripple组件有bug进行排除
				// labs: true,
			},
		}),
		visualizer({
			open: true, //注意这里要设置为true，否则无效
			gzipSize: true,
			brotliSize: true,
		}),
		monkey({
			entry: "./src/main.ts",
			userscript: <GreasemonkeyUserScript>{
				name: "WebImgCollector2",
				description: "图片聚合器",
				author: "ls", // 作者
				// updateURL: "", //更新地址
				version: "1.2.3",
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
		}),
	],
	css: {
		// 预处理器配置项
		preprocessorOptions: {
			scss: {
				additionalData: `@use "@/styles/element/index.scss" as *;`,
			},
			less: {
				math: "always", //启用 Less 预处理器中的数学运算功能
			},
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
	// 打包配置
	build: {
		target: "es2015",
		// 使用terser进行压缩混淆
		minify: "terser",
		terserOptions: {
			compress: {
				drop_console: true, // 删除所有 console
				drop_debugger: true, // 删除 debugger
			},
		},
	},
});
