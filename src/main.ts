import "./assets/css/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// Vuetify组件库
import vuetify from "@/plugin/vuetify";

// Varlet组件库
import Varlet from "@/plugin/varlet";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);
app.use(Varlet);

// 传统挂载方式
// app.mount("#app");

// 先在页面创建容器再挂载
const appContainer = document.createElement("div");
// 根据时间随机生成ID
const id = `onlineGallery-${Math.floor(Math.random() * Date.now() * 10000)}`;
appContainer.id = id; // 设置容器元素id
document.documentElement.append(appContainer); //将元素添加到页面
setTimeout(() => {
	app.mount(`#${id}`); // 挂载app
});
