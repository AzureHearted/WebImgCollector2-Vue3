import {
	createRouter,
	createWebHistory,
	createWebHashHistory,
} from "vue-router";
import type { RouterOptions } from "vue-router";
import Layout from "@/views/layout/layout-index.vue";

const Gallery = () => import("@/views/gallery/gallery-index.vue");
const RuleEdit = () => import("@/views/rule-edit/rule-edit-index.vue");

const routes: RouterOptions["routes"] = [
	{
		path: "/",
		name: "Layout",
		component: Layout,
		redirect: "/gallery",
		children: [
			{
				path: "/gallery",
				name: "Gallery",
				component: Gallery,
			},
			{
				path: "/ruleEdit",
				name: "RuleEdit",
				component: RuleEdit,
			},
		],
	},
];

const router = createRouter({
	// history: createWebHistory(import.meta.env.BASE_URL),
	// history: createWebHistory(location.pathname),
	history: createWebHashHistory(), // 使用 hash 模式
	// history: createWebHashHistory(location.pathname + location.hash), // 使用 hash 模式
	routes,
});

// 全局前置守卫
router.beforeEach((to, from) => {
	console.log("当前路由-->", from);
	console.log("目标路由-->", to);
});

export default router;
