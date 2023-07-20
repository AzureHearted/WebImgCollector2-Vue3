import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue"; //* vue解析插件
import AutoImport from "unplugin-auto-import/vite"; //* 依赖自动导入插件
import Components from "unplugin-vue-components/vite"; //* 组件自动导入插件
import {ElementPlusResolver, AntDesignVueResolver} from "unplugin-vue-components/resolvers";
import svgLoader from "vite-svg-loader"; //* 用于在vue项目中使用svg文件
import viteCompression from "vite-plugin-compression"; //? gzip打包压缩插件
import monkey, {util, cdn} from "vite-plugin-monkey"; //* 油猴支持插件

export default defineConfig({
	//* 插件配置项
	plugins: [
		//f .vue文件的解析插件
		vue(),
		//f 用于在vue项目中使用svg文件
		svgLoader(),
		//f 自动引入(imports)的插件
		AutoImport({
			// include: [
			// 	/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
			// 	/\.vue$/,
			// 	/\.vue\?vue/, // .vue
			// 	/\.md$/, // .md
			// ],
			imports: [
				"vue",
				"vue-router",
				"vue-i18n",
				"@vueuse/head",
				"@vueuse/core",
				util.unimportPreset,
			],
			//? 可以选择auto-import.d.ts生成的位置，使用ts建议设置为'src/auto-import.d.ts'
			resolvers: [ElementPlusResolver()],
		}),
		Components({
			//? 配置文件生成位置
			resolvers: [ElementPlusResolver(), AntDesignVueResolver()],
			// dirs: ["src/components", "src/otherComponents"], //* 用户组件自动导入设置
		}),
		//f gzip打包压缩插件
		// viteCompression({
		// 	threshold:512000,//* 对超过500kb的文件进行压缩
		// })
		//f 油猴插件支持的插件
		monkey({
			entry: "/src/main.js",
			userscript: {
				author: "Lxs",
				icon: "https://vitejs.dev/logo.svg",
				namespace: "npm/vite-plugin-monkey",
				// match: ["*://*/*"],
				match: ["*://www.pixiv.net/*", "http*://*", "http*://*/*"],
				exclude: ["*://element-plus.org/*"],
				connect: ["*"],
				noframes: true,
				require: [],
				"run-at": "document-start",
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
			less: {
				match: "always",
			},
			scss: {},
		},
	},
});
