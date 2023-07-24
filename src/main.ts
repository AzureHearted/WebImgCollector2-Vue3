import {createApp} from "vue";
import Vue3TouchEvents from "vue3-touch-events"; //* vue3移动端touch事件支持
import {createPinia} from "pinia"; //* 引入Pinia构造器
import "./style/scss/global.scss"; //* 自定义全局样式引入
import "@fancyapps/ui/dist/fancybox/fancybox.css";
// import {globalStyle} from "./js/globalStyle.js";
import JSZip from "jszip";
import {saveAs} from "file-saver"; //* 用于原生浏览器"保存"来实现文件保存

import App from "./App.vue";


//* 向window挂载方法(方法全局挂载)
window['JSZip'] = JSZip;
window['saveAs'] = saveAs;



// GM_addStyle(globalStyle); //* 部分注入样式
document.documentElement.dataset.showScrollbar = "true"; //* 还原页面滚动条

const appDom = document.createElement("div");
const id = `app_vue_${Date.now()}`;
appDom.id = id;

const pinia = createPinia(); //* 创建pinia
const app = createApp(App).use(pinia).use(Vue3TouchEvents);
document.documentElement.append(appDom);
app.mount(`#${id}`);
console.log("挂载成功！", unsafeWindow);
