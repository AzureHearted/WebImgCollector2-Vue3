import "./assets/css/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// Vuetify组件库
import vuetify from "@/plugin/vuetify";

// Varlet组件库
import Varlet from "@/plugin/varlet";

import { GM_xmlhttpRequest } from "$";
console.log({ GM_xmlhttpRequest });

// 创建 Vue 容器
const appContainer = document.createElement("div");
// 创建 Vue 应用
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);
app.use(Varlet);

console.log("准备挂载");
document.documentElement.appendChild(appContainer);
app.mount(appContainer); // 挂载app
console.log("挂载成功");
