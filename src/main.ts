import "./styles/index.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
// import router from "./router";

// Vuetify组件库(配置)
// import vuetify from "@/plugin/vuetify";

// Varlet组件库(配置)
import "@/plugin/varlet";

//naive-ui组件库(相关)
import "@/plugin/naive-ui";

// 导入样式动态修复模块
// import { fixStyle } from "@/styles/website";

// 创建 Vue 容器
const appContainer = document.createElement("div");
// 创建 Vue 应用
const app = createApp(App);

app.use(createPinia());
// app.use(router);
// app.use(vuetify);

app.mount(appContainer); // 挂载app
// document.body.appendChild(appContainer);
document.documentElement.appendChild(appContainer);

// 为止bug临时修复
// document.body.classList.remove("tag");
