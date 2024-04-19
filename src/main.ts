import "./assets/css/main.less";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// Vuetify组件库(配置)
import vuetify from "@/plugin/vuetify";

// Varlet组件库(配置)
import "@/plugin/varlet";

// 创建 Vue 容器
const appContainer = document.createElement("div");
// 创建 Vue 应用
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);

app.mount(appContainer); // 挂载app
document.body.appendChild(appContainer);

// 为止bug临时修复
document.body.classList.remove("tag");
