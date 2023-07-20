import {createApp} from "vue";
import "./less/global.less";
import {globalStyle} from "./js/globalStyle.js";
import JSZip from "jszip-sync";
import {saveAs} from "file-saver"; //* 用于原生浏览器"保存"来实现文件保存

// import FileSaver from "file-saver";
// import JSZip from "jszip";//* 压缩包支持
import App from "./App.vue";

GM_addStyle(globalStyle); //* 部分注入样式
document.documentElement.dataset.showScrollbar = true; //* 还原页面滚动条

const appDom = document.createElement("div");
const id = `app_vue_${Date.now()}`;
appDom.id = id;

// const app = createApp(App).use(ElementPlus);

const app = createApp(App);
// document.documentElement.append(appDom);
document.body.append(appDom);
app.mount(`#${id}`);
console.log("挂载成功！");

console.log("JSZip支持情况", JSZip.support.blob);
let zipContainer = new JSZip();
zipContainer.sync(async () => {
	zipContainer.file("测试文件.txt", "压缩测试");
	const zip = await zipContainer.generateAsync({type: "blob"});
	console.log("生成成功", zip);
});
