import {createApp} from "vue";
import {createPinia} from "pinia"; //* 引入Pinia构造器
import "./style/scss/global.scss"; //* 自定义全局样式引入
// import {globalStyle} from "./js/globalStyle.js";
import JSZip from "jszip";
import {saveAs} from "file-saver"; //* 用于原生浏览器"保存"来实现文件保存
import {TaskQueue, buildUUID} from "./js/public.js"; //* 导入自定义js库

//* 向window挂载方法(方法全局挂载)
window.JSZip = JSZip;
window.saveAs = saveAs;
window.TaskQueue = TaskQueue;
window.buildUUID = buildUUID;

import App from "./App.vue";

// GM_addStyle(globalStyle); //* 部分注入样式
document.documentElement.dataset.showScrollbar = true; //* 还原页面滚动条

const appDom = document.createElement("div");
const id = `app_vue_${Date.now()}`;
appDom.id = id;

const pinia = createPinia(); //* 创建pinia
const app = createApp(App).use(pinia);
document.documentElement.append(appDom);
// document.body.appendChild(appDom);
app.mount(`#${id}`);
console.log("挂载成功！", unsafeWindow);
