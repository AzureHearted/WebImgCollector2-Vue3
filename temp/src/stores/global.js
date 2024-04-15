import { ref, watch } from "vue";
import { defineStore } from "pinia";
export default defineStore("global", () => {
    const openWindow = ref(false); // 窗口打开状态
    //给滚动条注入样式
    visibleScrollbar(true);
    watch(openWindow, (newValue) => {
        if (newValue) {
            // 窗口打开后隐藏页面滚动条
            visibleScrollbar(false);
        }
        else {
            // 窗口关闭后显示页面滚动条
            visibleScrollbar(true);
        }
    });
    // 控制滚动条可见度
    function visibleScrollbar(value) {
        document.documentElement.dataset.showScrollbar = value ? "true" : "false";
    }
    return { openWindow, visibleScrollbar };
});
