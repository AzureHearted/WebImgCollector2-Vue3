import "@/ts/global_mount";//* 先挂载全局依赖的js库

import {createApp} from "vue";
import Vue3TouchEvents from "vue3-touch-events"; //* vue3移动端touch事件支持
import {createPinia} from "pinia"; //* 引入Pinia构造器
import "@/style/scss/global.scss"; //* 自定义全局样式引入
import "@fancyapps/ui/dist/fancybox/fancybox.css"; //* fancybox样式
import "@varlet/touch-emulator"; //* varlet ui的桌面端支持

import App from "@/App.vue";

// GM_addStyle(globalStyle); //* 部分注入样式
document.documentElement.dataset.showScrollbar = "true"; //* 还原页面滚动条

const appDom = document.createElement("div");
const id = `app_vue_${Date.now()}`;
appDom.id = id;

const pinia = createPinia(); //* 创建pinia
const app = createApp(App).use(pinia).use(Vue3TouchEvents);
document.documentElement.append(appDom);
app.mount(`#${id}`);
// console.log("挂载成功！", unsafeWindow);
