import {
	createRouter,
	createWebHistory,
	// createWebHashHistory,
} from "vue-router";
import type { RouterOptions } from "vue-router";
import Layout from "@/views/layout/layout-index.vue";

const routes: RouterOptions["routes"] = [
	{
		path: "/",
		name: "Layout",
		component: Layout,
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

// 全局前置守卫
// router.beforeEach((to, from) => {
// 	console.log("当前路由-->", from);
// 	console.log("目标路由-->", to);
// });

export default router;
