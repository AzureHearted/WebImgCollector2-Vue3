import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue"; //* vue解析插件
import path from "path";
import AutoImport from "unplugin-auto-import/vite"; //* 依赖自动导入插件
import Components from "unplugin-vue-components/vite"; //* 组件自动导入插件
import {
	ElementPlusResolver,
	VarletUIResolver,
	AntDesignVueResolver,
} from "unplugin-vue-components/resolvers";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import svgLoader from "vite-svg-loader"; //* 用于在vue项目中使用svg文件

import viteCompression from "vite-plugin-compression"; //? gzip打包压缩插件
import monkey, {util, cdn} from "vite-plugin-monkey"; //* 油猴支持插件

export default defineConfig({
	resolve: {
		alias: {
			//* 路径别名
			"@": path.resolve(__dirname, "./src"),
		},
	},
	//* 插件配置项
	plugins: [
		//f .vue文件的解析插件
		vue(),
		//f 用于在vue项目中使用svg文件
		svgLoader(),
		//f 自动引入(imports)的插件
		AutoImport({
			imports: [
				"vue",
				"vue-router",
				"vue-i18n",
				"@vueuse/head",
				"@vueuse/core",
				util.unimportPreset,
			],
			resolvers: [
				//f 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
				ElementPlusResolver(),
				//f 自动导入 VarletUI 相关api
				VarletUIResolver(),
				//f 自动导入图标组件
				IconsResolver({
					prefix: "Icon",
				}),
			],
			//* 自动包含的目录
			dirs: [
				"src/*.vue",
				"src/ts/**",
				"src/ts/class/**",
				"src/stores/**",
				"src/components/**",
				"src/**/*.ts",
				"src/**/*.d.ts",
				"src/**/*.vue",
				"src/stores/**.ts",
				"src/ts/*.ts",
				"file-saver",
				"jszip",
			],
			vueTemplate: true,
			//* 生成自动导入的TS声明文件
			dts: "types/auto-import.d.ts",
		}),
		Components({
			//? 配置文件生成位置
			resolvers: [
				//f 自动导入 Element Plus 组件
				ElementPlusResolver(),
				//f 自动导入 VarletUI 组件
				VarletUIResolver({autoImport: true}),
				//f 自动注册图标组件
				IconsResolver({
					enabledCollections: ["ep"],
				}),
				AntDesignVueResolver(),
			],
			dirs: ["src/*.vue", "src/components/**"],
			dts: "types/components.d.ts",
		}),
		Icons({
			autoInstall: true,
		}),
		//f gzip打包压缩插件
		// viteCompression({
		// 	threshold:512000,//* 对超过500kb的文件进行压缩
		// })
		//f 油猴插件支持的插件
		monkey({
			entry: "./src/main.ts",
			userscript: {
				author: "Lxs",
				icon: "https://vitejs.dev/logo.svg",
				namespace: "npm/vite-plugin-monkey",
				// match: ["*://*/*"],
				match: ["http*://*", "http*://*/*", "*://www.pixiv.net/*"],
				exclude: ["*://element-plus.org/*"],
				connect: ["*"],
				noframes: true,
				require: [],
				// "run-at": "document-start",
			},
			server: {
				open: false,
			},
			build: {
				externalGlobals: {
					jszip: cdn.bootcdn("JSZip", "jszip.min.js"),
				},
			},
		}),
	],
	//* 预处理器配置项
	css: {
		preprocessorOptions: {
			scss: {},
		},
	},
	server: {
		// host: 'localhost',
		port: 8888,
		open: false,
	},
	build: {
		target: ["es2015", "edge88", "firefox78", "chrome87", "safari14"],
	},
});
