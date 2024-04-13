import { createRouter, createWebHistory, createWebHashHistory, } from "vue-router";
import Layout from "@/views/layout/layout-index.vue";
const Gallery = () => import("@/views/gallery/gallery-index.vue");
const routes = [
    {
        path: "/",
        component: Layout,
        children: [
            {
                path: "/",
                component: Gallery,
            },
        ],
    },
];
const router = createRouter({
    // history: createWebHistory(import.meta.env.BASE_URL),
    history: createWebHistory(location.pathname),
    // history: createWebHashHistory(location.pathname + location.hash), // 使用 hash 模式
    routes,
});
export default router;
