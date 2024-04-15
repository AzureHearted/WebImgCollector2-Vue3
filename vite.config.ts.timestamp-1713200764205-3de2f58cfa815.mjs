// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///E:/Desktop/code/%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91/onlineGallery-reset-2024-04/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/Desktop/code/%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91/onlineGallery-reset-2024-04/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import monkey, { util } from "file:///E:/Desktop/code/%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91/onlineGallery-reset-2024-04/node_modules/vite-plugin-monkey/dist/node/index.mjs";
import components from "file:///E:/Desktop/code/%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91/onlineGallery-reset-2024-04/node_modules/unplugin-vue-components/dist/vite.js";
import autoImport from "file:///E:/Desktop/code/%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91/onlineGallery-reset-2024-04/node_modules/unplugin-auto-import/dist/vite.js";
import { VarletImportResolver } from "file:///E:/Desktop/code/%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91/onlineGallery-reset-2024-04/node_modules/@varlet/import-resolver/lib/index.js";
import svgLoader from "file:///E:/Desktop/code/%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91/onlineGallery-reset-2024-04/node_modules/vite-svg-loader/index.js";
var __vite_injected_original_import_meta_url = "file:///E:/Desktop/code/%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91/onlineGallery-reset-2024-04/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    // VueDevTools(),
    //f 用于在vue项目中使用svg文件
    svgLoader(),
    components({
      resolvers: [VarletImportResolver()]
    }),
    autoImport({
      resolvers: [VarletImportResolver({ autoImport: true })],
      imports: [util.unimportPreset]
    }),
    monkey({
      entry: "./src/main.ts",
      userscript: {
        author: "ls",
        // 作者
        icon: "https://vitejs.dev/logo.svg",
        // 图标
        namespace: "npm/vite-plugin-monkey",
        // 命名空间
        match: ["http*://*", "http*://*/*"],
        // 要匹配的网站
        // exclude: ["*://element-plus.org/*"], // 要排除的网站
        noframes: true,
        //是否在iframe中使用
        "run-at": "document-body",
        // 嵌入时机
        require: []
      },
      server: {
        open: false
      }
    })
  ],
  css: {
    // 预处理器配置项
    preprocessorOptions: {
      less: {
        math: "always"
      }
    }
  },
  resolve: {
    // 路径别名设置
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
      "@svg": fileURLToPath(new URL("./src/assets/svg", __vite_injected_original_import_meta_url))
    }
  },
  server: {
    open: false
    // 项目运行时不自动打开浏览器
  },
  build: {
    // 使用terser进行压缩混淆
    minify: "terser"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxEZXNrdG9wXFxcXGNvZGVcXFxcXHU1MjREXHU3QUVGXHU1RjAwXHU1M0QxXFxcXFx1NEUyQVx1NEVCQVx1OTg3OVx1NzZFRVx1NUYwMFx1NTNEMVxcXFxvbmxpbmVHYWxsZXJ5LXJlc2V0LTIwMjQtMDRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXERlc2t0b3BcXFxcY29kZVxcXFxcdTUyNERcdTdBRUZcdTVGMDBcdTUzRDFcXFxcXHU0RTJBXHU0RUJBXHU5ODc5XHU3NkVFXHU1RjAwXHU1M0QxXFxcXG9ubGluZUdhbGxlcnktcmVzZXQtMjAyNC0wNFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovRGVza3RvcC9jb2RlLyVFNSU4OSU4RCVFNyVBQiVBRiVFNSVCQyU4MCVFNSU4RiU5MS8lRTQlQjglQUElRTQlQkElQkElRTklQTElQjklRTclOUIlQUUlRTUlQkMlODAlRTUlOEYlOTEvb25saW5lR2FsbGVyeS1yZXNldC0yMDI0LTA0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSBcIm5vZGU6dXJsXCI7XG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcbi8vIGltcG9ydCBWdWVEZXZUb29scyBmcm9tIFwidml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzXCI7XG5cbmltcG9ydCBtb25rZXksIHsgdXRpbCB9IGZyb20gXCJ2aXRlLXBsdWdpbi1tb25rZXlcIjtcblxuLy8gXHU4MUVBXHU1MkE4XHU2MzA5XHU5NzAwXHU1RjE1XHU1MTY1XHU5MTREXHU3RjZFXG5pbXBvcnQgY29tcG9uZW50cyBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZVwiO1xuaW1wb3J0IGF1dG9JbXBvcnQgZnJvbSBcInVucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGVcIjtcbi8vIHZhcmxldFx1N0VDNFx1NEVGNlx1NUU5M1x1NzY4NFx1ODFFQVx1NTJBOFx1NUYxNVx1NTE2NVx1OTE0RFx1N0Y2RVxuaW1wb3J0IHsgVmFybGV0SW1wb3J0UmVzb2x2ZXIgfSBmcm9tIFwiQHZhcmxldC9pbXBvcnQtcmVzb2x2ZXJcIjtcblxuLy9zIFx1NzUyOFx1NEU4RVx1NTcyOHZ1ZVx1OTg3OVx1NzZFRVx1NEUyRFx1NEY3Rlx1NzUyOHN2Z1x1NjU4N1x1NEVGNlxuaW1wb3J0IHN2Z0xvYWRlciBmcm9tIFwidml0ZS1zdmctbG9hZGVyXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuXHRwbHVnaW5zOiBbXG5cdFx0dnVlKCksXG5cdFx0Ly8gVnVlRGV2VG9vbHMoKSxcblx0XHQvL2YgXHU3NTI4XHU0RThFXHU1NzI4dnVlXHU5ODc5XHU3NkVFXHU0RTJEXHU0RjdGXHU3NTI4c3ZnXHU2NTg3XHU0RUY2XG5cdFx0c3ZnTG9hZGVyKCksXG5cdFx0Y29tcG9uZW50cyh7XG5cdFx0XHRyZXNvbHZlcnM6IFtWYXJsZXRJbXBvcnRSZXNvbHZlcigpXSxcblx0XHR9KSxcblx0XHRhdXRvSW1wb3J0KHtcblx0XHRcdHJlc29sdmVyczogW1ZhcmxldEltcG9ydFJlc29sdmVyKHsgYXV0b0ltcG9ydDogdHJ1ZSB9KV0sXG5cdFx0XHRpbXBvcnRzOiBbdXRpbC51bmltcG9ydFByZXNldF0sXG5cdFx0fSksXG5cdFx0bW9ua2V5KHtcblx0XHRcdGVudHJ5OiBcIi4vc3JjL21haW4udHNcIixcblx0XHRcdHVzZXJzY3JpcHQ6IHtcblx0XHRcdFx0YXV0aG9yOiBcImxzXCIsIC8vIFx1NEY1Q1x1ODAwNVxuXHRcdFx0XHRpY29uOiBcImh0dHBzOi8vdml0ZWpzLmRldi9sb2dvLnN2Z1wiLCAvLyBcdTU2RkVcdTY4MDdcblx0XHRcdFx0bmFtZXNwYWNlOiBcIm5wbS92aXRlLXBsdWdpbi1tb25rZXlcIiwgLy8gXHU1NDdEXHU1NDBEXHU3QTdBXHU5NUY0XG5cdFx0XHRcdG1hdGNoOiBbXCJodHRwKjovLypcIiwgXCJodHRwKjovLyovKlwiXSwgLy8gXHU4OTgxXHU1MzM5XHU5MTREXHU3Njg0XHU3RjUxXHU3QUQ5XG5cdFx0XHRcdC8vIGV4Y2x1ZGU6IFtcIio6Ly9lbGVtZW50LXBsdXMub3JnLypcIl0sIC8vIFx1ODk4MVx1NjM5Mlx1OTY2NFx1NzY4NFx1N0Y1MVx1N0FEOVxuXHRcdFx0XHRub2ZyYW1lczogdHJ1ZSwgLy9cdTY2MkZcdTU0MjZcdTU3MjhpZnJhbWVcdTRFMkRcdTRGN0ZcdTc1Mjhcblx0XHRcdFx0XCJydW4tYXRcIjogXCJkb2N1bWVudC1ib2R5XCIsIC8vIFx1NUQ0Q1x1NTE2NVx1NjVGNlx1NjczQVxuXHRcdFx0XHRyZXF1aXJlOiBbXSxcblx0XHRcdH0sXG5cdFx0XHRzZXJ2ZXI6IHtcblx0XHRcdFx0b3BlbjogZmFsc2UsXG5cdFx0XHR9LFxuXHRcdH0pLFxuXHRdLFxuXHRjc3M6IHtcblx0XHQvLyBcdTk4ODRcdTU5MDRcdTc0MDZcdTU2NjhcdTkxNERcdTdGNkVcdTk4Nzlcblx0XHRwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG5cdFx0XHRsZXNzOiB7XG5cdFx0XHRcdG1hdGg6IFwiYWx3YXlzXCIsXG5cdFx0XHR9LFxuXHRcdH0sXG5cdH0sXG5cdHJlc29sdmU6IHtcblx0XHQvLyBcdThERUZcdTVGODRcdTUyMkJcdTU0MERcdThCQkVcdTdGNkVcblx0XHRhbGlhczoge1xuXHRcdFx0XCJAXCI6IGZpbGVVUkxUb1BhdGgobmV3IFVSTChcIi4vc3JjXCIsIGltcG9ydC5tZXRhLnVybCkpLFxuXHRcdFx0XCJAc3ZnXCI6IGZpbGVVUkxUb1BhdGgobmV3IFVSTChcIi4vc3JjL2Fzc2V0cy9zdmdcIiwgaW1wb3J0Lm1ldGEudXJsKSksXG5cdFx0fSxcblx0fSxcblx0c2VydmVyOiB7XG5cdFx0b3BlbjogZmFsc2UsIC8vIFx1OTg3OVx1NzZFRVx1OEZEMFx1ODg0Q1x1NjVGNlx1NEUwRFx1ODFFQVx1NTJBOFx1NjI1M1x1NUYwMFx1NkQ0Rlx1ODlDOFx1NTY2OFxuXHR9LFxuXHRidWlsZDoge1xuXHRcdC8vIFx1NEY3Rlx1NzUyOHRlcnNlclx1OEZEQlx1ODg0Q1x1NTM4Qlx1N0YyOVx1NkRGN1x1NkRDNlxuXHRcdG1pbmlmeTogXCJ0ZXJzZXJcIixcblx0fSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtYixTQUFTLGVBQWUsV0FBVztBQUV0ZCxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFHaEIsT0FBTyxVQUFVLFlBQVk7QUFHN0IsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFFdkIsU0FBUyw0QkFBNEI7QUFHckMsT0FBTyxlQUFlO0FBZjJNLElBQU0sMkNBQTJDO0FBa0JsUixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMzQixTQUFTO0FBQUEsSUFDUixJQUFJO0FBQUE7QUFBQTtBQUFBLElBR0osVUFBVTtBQUFBLElBQ1YsV0FBVztBQUFBLE1BQ1YsV0FBVyxDQUFDLHFCQUFxQixDQUFDO0FBQUEsSUFDbkMsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1YsV0FBVyxDQUFDLHFCQUFxQixFQUFFLFlBQVksS0FBSyxDQUFDLENBQUM7QUFBQSxNQUN0RCxTQUFTLENBQUMsS0FBSyxjQUFjO0FBQUEsSUFDOUIsQ0FBQztBQUFBLElBQ0QsT0FBTztBQUFBLE1BQ04sT0FBTztBQUFBLE1BQ1AsWUFBWTtBQUFBLFFBQ1gsUUFBUTtBQUFBO0FBQUEsUUFDUixNQUFNO0FBQUE7QUFBQSxRQUNOLFdBQVc7QUFBQTtBQUFBLFFBQ1gsT0FBTyxDQUFDLGFBQWEsYUFBYTtBQUFBO0FBQUE7QUFBQSxRQUVsQyxVQUFVO0FBQUE7QUFBQSxRQUNWLFVBQVU7QUFBQTtBQUFBLFFBQ1YsU0FBUyxDQUFDO0FBQUEsTUFDWDtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ1AsTUFBTTtBQUFBLE1BQ1A7QUFBQSxJQUNELENBQUM7QUFBQSxFQUNGO0FBQUEsRUFDQSxLQUFLO0FBQUE7QUFBQSxJQUVKLHFCQUFxQjtBQUFBLE1BQ3BCLE1BQU07QUFBQSxRQUNMLE1BQU07QUFBQSxNQUNQO0FBQUEsSUFDRDtBQUFBLEVBQ0Q7QUFBQSxFQUNBLFNBQVM7QUFBQTtBQUFBLElBRVIsT0FBTztBQUFBLE1BQ04sS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxNQUNwRCxRQUFRLGNBQWMsSUFBSSxJQUFJLG9CQUFvQix3Q0FBZSxDQUFDO0FBQUEsSUFDbkU7QUFBQSxFQUNEO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDUCxNQUFNO0FBQUE7QUFBQSxFQUNQO0FBQUEsRUFDQSxPQUFPO0FBQUE7QUFBQSxJQUVOLFFBQVE7QUFBQSxFQUNUO0FBQ0QsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
