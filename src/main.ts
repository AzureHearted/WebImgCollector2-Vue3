import "@/ts/global_mount"; //s 先挂载全局依赖的js库

import { createApp } from "vue";
import Vue3TouchEvents from "vue3-touch-events"; //s vue3移动端touch事件支持
import "@/styles/global.scss"; //s 自定义全局样式引入
import "@fancyapps/ui/dist/fancybox/fancybox.css"; //s fancybox样式
import "@varlet/touch-emulator"; //s varlet ui的桌面端支持

import App from "@/App.vue";

// GM_addStyle(globalStyle); //s 部分注入样式
document.documentElement.dataset.showScrollbar = "true"; //s 还原页面滚动条

// 创建 Vue 容器
const appContainer = document.createElement("div");
// 创建 Vue 应用
const app = createApp(App);

app.use(createPinia());
app.use(Vue3TouchEvents);

app.mount(appContainer); // 挂载app
document.body.appendChild(appContainer);
