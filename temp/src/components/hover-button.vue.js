import { defineProps, ref, reactive } from "vue";
// 引入公共方法
import { isMobile } from "@/utils/common";
// 引入图标
import IconGridRound from "@/assets/svg/dots-grid.svg";
import IconDashboard from "@/assets/svg/dashboard.svg";
import IconBxsBookBookmark from "@/assets/svg/bxs-book-bookmark.svg";
import IconToolsFill from "@/assets/svg/tools-fill.svg";
import IconTestTube from "@/assets/svg/bx-test-tube.svg";
import IconArrowheadDown from "@svg/arrowhead-down.svg";
import IconArrowheadUp from "@svg/arrowhead-up.svg";
import useGlobalStore from "@/stores/global"; //导入全局仓库
const { defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const globalStore = useGlobalStore();
const active = ref(false); // 控制悬浮按钮的显示状态
// 定义Props
const props = withDefaults(defineProps(), {
    teleportTo: () => "body",
    loading: false,
});
const state = reactive({
    scrolling: false,
    scrollingToDown: false,
    scrollingToUp: false,
});
// const scrollingToDown = ref(false); // 控制滚动按钮的显示状态
// const scrollingToUp = ref(false); // 控制滚动按钮的显示状态
// 切换窗口显示
function toggleWindow() {
    globalStore.openWindow = !globalStore.openWindow;
}
// 滚动容器到底部
function scrollTo(direction = "down", // 滚动方向，默认向下滚动
container = document.documentElement, // 滚动元素
interval = 1000 // 滚动间隔
) {
    let scrollInterval = null;
    // 执行一次滚动操作
    function scrollOnce() {
        if ((container.scrollTop === 0 && direction === "up") ||
            (Number(container.scrollTop.toFixed(0)) + container.clientHeight ===
                container.scrollHeight &&
                direction === "down")) {
            state.scrollingToUp = false; // 取消显示滚动按钮的加载状态
            state.scrollingToDown = false; // 取消显示滚动按钮的加载状态
        }
        container.scrollTo({
            top: direction === "up" ? 0 : container.scrollHeight,
            behavior: "smooth",
        });
    }
    // 开始执行滚动操作的定时器
    function startScrollInterval() {
        if (!scrollInterval) {
            scrollInterval = setInterval(() => {
                // console.log(`滚动中:${direction}`);
                if (direction === "up") {
                    state.scrollingToUp = true; // 取消显示滚动按钮的加载状态
                }
                else {
                    state.scrollingToDown = true; // 取消显示滚动按钮的加载状态
                }
                requestAnimationFrame(scrollOnce);
            }, interval);
        }
    }
    // 停止执行滚动操作的定时器
    function stopScrollInterval() {
        if (scrollInterval) {
            // console.log("滚动停止");
            state.scrolling = false; // 取消显示滚动按钮的加载状态
            clearInterval(scrollInterval);
            scrollInterval = null;
            if (container.scrollTop === 0 && direction === "up") {
                state.scrollingToUp = false; // 取消显示滚动按钮的加载状态
            }
            else {
                state.scrollingToDown = false; // 取消显示滚动按钮的加载状态
            }
        }
    }
    state.scrolling = true; // 显示滚动按钮的加载状态
    if (direction === "up") {
        state.scrollingToUp = true; // 取消显示滚动按钮的加载状态
    }
    else {
        state.scrollingToDown = true; // 取消显示滚动按钮的加载状态
    }
    // 开始执行滚动操作的定时器
    startScrollInterval();
    // 一经触发立即执行
    scrollOnce();
    window.addEventListener("wheel", stopScrollInterval);
    window.addEventListener("click", stopScrollInterval);
    window.addEventListener("touchstart", stopScrollInterval);
}
const __VLS_withDefaultsArg = (function (t) { return t; })({
    teleportTo: () => "body",
    loading: false,
});
let __VLS_modelEmitsType;
const __VLS_componentsOption = {};
let __VLS_name;
function __VLS_template() {
    let __VLS_ctx;
    /* Components */
    let __VLS_otherComponents;
    let __VLS_own;
    let __VLS_localComponents;
    let __VLS_components;
    let __VLS_styleScopedClasses;
    /* CSS variable injection */
    /* CSS variable injection end */
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_components.VarFab;
    __VLS_components.varFab;
    __VLS_components.VarFab;
    __VLS_components.varFab;
    // @ts-ignore
    [VarFab, VarFab,];
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_components.VarBadge;
    __VLS_components.varBadge;
    __VLS_components.VarBadge;
    __VLS_components.varBadge;
    __VLS_components.VarBadge;
    __VLS_components.varBadge;
    __VLS_components.VarBadge;
    __VLS_components.varBadge;
    // @ts-ignore
    [VarBadge, VarBadge, VarBadge, VarBadge,];
    __VLS_components.VarButton;
    __VLS_components.varButton;
    __VLS_components.VarButton;
    __VLS_components.varButton;
    __VLS_components.VarButton;
    __VLS_components.varButton;
    __VLS_components.VarButton;
    __VLS_components.varButton;
    __VLS_components.VarButton;
    __VLS_components.varButton;
    __VLS_components.VarButton;
    __VLS_components.varButton;
    __VLS_components.VarButton;
    __VLS_components.varButton;
    __VLS_components.VarButton;
    __VLS_components.varButton;
    __VLS_components.VarButton;
    __VLS_components.varButton;
    __VLS_components.VarButton;
    __VLS_components.varButton;
    __VLS_components.VarButton;
    __VLS_components.varButton;
    __VLS_components.VarButton;
    __VLS_components.varButton;
    __VLS_components.VarButton;
    __VLS_components.varButton;
    __VLS_components.VarButton;
    __VLS_components.varButton;
    // @ts-ignore
    [VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton,];
    __VLS_components.IconGridRound;
    __VLS_components.IconGridRound;
    // @ts-ignore
    [IconGridRound,];
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_components.IconArrowheadDown;
    __VLS_components.IconArrowheadDown;
    // @ts-ignore
    [IconArrowheadDown,];
    __VLS_components.IconArrowheadUp;
    __VLS_components.IconArrowheadUp;
    // @ts-ignore
    [IconArrowheadUp,];
    __VLS_components.IconDashboard;
    __VLS_components.IconDashboard;
    // @ts-ignore
    [IconDashboard,];
    __VLS_components.IconBxsBookBookmark;
    __VLS_components.IconBxsBookBookmark;
    // @ts-ignore
    [IconBxsBookBookmark,];
    __VLS_components.IconToolsFill;
    __VLS_components.IconToolsFill;
    // @ts-ignore
    [IconToolsFill,];
    __VLS_components.IconTestTube;
    __VLS_components.IconTestTube;
    // @ts-ignore
    [IconTestTube,];
    {
        const __VLS_0 = {}.VarFab;
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{}, active: ((__VLS_ctx.active)), type: ("primary"), bottom: ("20vh"), right: ("10vh"), direction: ("top"), trigger: ((__VLS_ctx.isMobile() ? 'click' : 'hover')), drag: (true), elevation: ((24)), teleport: ((__VLS_ctx.teleportTo)), }));
        ({}.VarFab);
        ({}.VarFab);
        const __VLS_2 = __VLS_1({ ...{}, active: ((__VLS_ctx.active)), type: ("primary"), bottom: ("20vh"), right: ("10vh"), direction: ("top"), trigger: ((__VLS_ctx.isMobile() ? 'click' : 'hover')), drag: (true), elevation: ((24)), teleport: ((__VLS_ctx.teleportTo)), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        ({}({ ...{}, active: ((__VLS_ctx.active)), type: ("primary"), bottom: ("20vh"), right: ("10vh"), direction: ("top"), trigger: ((__VLS_ctx.isMobile() ? 'click' : 'hover')), drag: (true), elevation: ((24)), teleport: ((__VLS_ctx.teleportTo)), }));
        {
            const __VLS_5 = __VLS_intrinsicElements["template"];
            const __VLS_6 = __VLS_elementAsFunctionalComponent(__VLS_5);
            const __VLS_7 = __VLS_6({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_6));
            ({}({ ...{}, }));
            {
                (__VLS_3.slots).trigger;
                {
                    const __VLS_9 = {}.VarBadge;
                    const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({ ...{}, style: ({}), type: ("danger"), maxValue: ((999)), hidden: ((true)), }));
                    ({}.VarBadge);
                    ({}.VarBadge);
                    const __VLS_11 = __VLS_10({ ...{}, style: ({}), type: ("danger"), maxValue: ((999)), hidden: ((true)), }, ...__VLS_functionalComponentArgsRest(__VLS_10));
                    ({}({ ...{}, style: ({}), type: ("danger"), maxValue: ((999)), hidden: ((true)), }));
                    {
                        const __VLS_14 = {}.VarButton;
                        const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({ ...{ 'onDblclick': {}, }, color: ("#29B6F6"), elevation: ((10)), round: (true), loading: ((__VLS_ctx.loading)), }));
                        ({}.VarButton);
                        ({}.VarButton);
                        const __VLS_16 = __VLS_15({ ...{ 'onDblclick': {}, }, color: ("#29B6F6"), elevation: ((10)), round: (true), loading: ((__VLS_ctx.loading)), }, ...__VLS_functionalComponentArgsRest(__VLS_15));
                        ({}({ ...{ 'onDblclick': {}, }, color: ("#29B6F6"), elevation: ((10)), round: (true), loading: ((__VLS_ctx.loading)), }));
                        let __VLS_19 = { 'dblclick': __VLS_pickEvent(__VLS_18['dblclick'], {}.onDblclick) };
                        __VLS_19 = { dblclick: (__VLS_ctx.toggleWindow) };
                        {
                            const __VLS_20 = {}.IconGridRound;
                            const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({ ...{}, style: ({}), }));
                            ({}.IconGridRound);
                            const __VLS_22 = __VLS_21({ ...{}, style: ({}), }, ...__VLS_functionalComponentArgsRest(__VLS_21));
                            ({}({ ...{}, style: ({}), }));
                            const __VLS_23 = __VLS_pickFunctionalComponentCtx(__VLS_20, __VLS_22);
                        }
                        (__VLS_17.slots).default;
                        const __VLS_17 = __VLS_pickFunctionalComponentCtx(__VLS_14, __VLS_16);
                        let __VLS_18;
                    }
                    {
                        const __VLS_25 = __VLS_intrinsicElements["div"];
                        const __VLS_26 = __VLS_elementAsFunctionalComponent(__VLS_25);
                        const __VLS_27 = __VLS_26({ ...{}, class: ("bottom-fab"), "data-active": ((__VLS_ctx.active || __VLS_ctx.state.scrolling)), }, ...__VLS_functionalComponentArgsRest(__VLS_26));
                        ({}({ ...{}, class: ("bottom-fab"), "data-active": ((__VLS_ctx.active || __VLS_ctx.state.scrolling)), }));
                        {
                            const __VLS_30 = {}.VarButton;
                            const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({ ...{ 'onClick': {}, }, class: ("scroll-button"), round: (true), loading: ((__VLS_ctx.state.scrollingToDown)), }));
                            ({}.VarButton);
                            ({}.VarButton);
                            const __VLS_32 = __VLS_31({ ...{ 'onClick': {}, }, class: ("scroll-button"), round: (true), loading: ((__VLS_ctx.state.scrollingToDown)), }, ...__VLS_functionalComponentArgsRest(__VLS_31));
                            ({}({ ...{ 'onClick': {}, }, class: ("scroll-button"), round: (true), loading: ((__VLS_ctx.state.scrollingToDown)), }));
                            let __VLS_35 = { 'click': __VLS_pickEvent(__VLS_34['click'], {}.onClick) };
                            __VLS_35 = { click: $event => {
                                    __VLS_ctx.scrollTo('down');
                                    // @ts-ignore
                                    [active, isMobile, teleportTo, loading, toggleWindow, active, state, state, scrollTo,];
                                }
                            };
                            {
                                const __VLS_36 = {}.IconArrowheadDown;
                                const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({ ...{}, style: ({}), }));
                                ({}.IconArrowheadDown);
                                const __VLS_38 = __VLS_37({ ...{}, style: ({}), }, ...__VLS_functionalComponentArgsRest(__VLS_37));
                                ({}({ ...{}, style: ({}), }));
                                const __VLS_39 = __VLS_pickFunctionalComponentCtx(__VLS_36, __VLS_38);
                            }
                            (__VLS_33.slots).default;
                            const __VLS_33 = __VLS_pickFunctionalComponentCtx(__VLS_30, __VLS_32);
                            let __VLS_34;
                        }
                        {
                            const __VLS_41 = {}.VarButton;
                            const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({ ...{ 'onClick': {}, }, class: ("scroll-up"), round: (true), loading: ((__VLS_ctx.state.scrollingToUp)), }));
                            ({}.VarButton);
                            ({}.VarButton);
                            const __VLS_43 = __VLS_42({ ...{ 'onClick': {}, }, class: ("scroll-up"), round: (true), loading: ((__VLS_ctx.state.scrollingToUp)), }, ...__VLS_functionalComponentArgsRest(__VLS_42));
                            ({}({ ...{ 'onClick': {}, }, class: ("scroll-up"), round: (true), loading: ((__VLS_ctx.state.scrollingToUp)), }));
                            let __VLS_46 = { 'click': __VLS_pickEvent(__VLS_45['click'], {}.onClick) };
                            __VLS_46 = { click: $event => {
                                    __VLS_ctx.scrollTo('up');
                                    // @ts-ignore
                                    [state, scrollTo,];
                                }
                            };
                            {
                                const __VLS_47 = {}.IconArrowheadUp;
                                const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({ ...{}, style: ({}), }));
                                ({}.IconArrowheadUp);
                                const __VLS_49 = __VLS_48({ ...{}, style: ({}), }, ...__VLS_functionalComponentArgsRest(__VLS_48));
                                ({}({ ...{}, style: ({}), }));
                                const __VLS_50 = __VLS_pickFunctionalComponentCtx(__VLS_47, __VLS_49);
                            }
                            (__VLS_44.slots).default;
                            const __VLS_44 = __VLS_pickFunctionalComponentCtx(__VLS_41, __VLS_43);
                            let __VLS_45;
                        }
                        (__VLS_28.slots).default;
                        const __VLS_28 = __VLS_pickFunctionalComponentCtx(__VLS_25, __VLS_27);
                    }
                    (__VLS_12.slots).default;
                    const __VLS_12 = __VLS_pickFunctionalComponentCtx(__VLS_9, __VLS_11);
                }
            }
        }
        {
            const __VLS_52 = __VLS_intrinsicElements["template"];
            const __VLS_53 = __VLS_elementAsFunctionalComponent(__VLS_52);
            const __VLS_54 = __VLS_53({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_53));
            ({}({ ...{}, }));
            {
                (__VLS_3.slots).default;
                {
                    const __VLS_56 = {}.VarBadge;
                    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({ ...{}, style: ({}), type: ("danger"), maxValue: ((999)), hidden: ((true)), }));
                    ({}.VarBadge);
                    ({}.VarBadge);
                    const __VLS_58 = __VLS_57({ ...{}, style: ({}), type: ("danger"), maxValue: ((999)), hidden: ((true)), }, ...__VLS_functionalComponentArgsRest(__VLS_57));
                    ({}({ ...{}, style: ({}), type: ("danger"), maxValue: ((999)), hidden: ((true)), }));
                    {
                        const __VLS_61 = {}.VarButton;
                        const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({ ...{ 'onClick': {}, }, type: ("success"), round: (true), }));
                        ({}.VarButton);
                        ({}.VarButton);
                        const __VLS_63 = __VLS_62({ ...{ 'onClick': {}, }, type: ("success"), round: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_62));
                        ({}({ ...{ 'onClick': {}, }, type: ("success"), round: (true), }));
                        let __VLS_66 = { 'click': __VLS_pickEvent(__VLS_65['click'], {}.onClick) };
                        __VLS_66 = { click: (__VLS_ctx.toggleWindow) };
                        {
                            const __VLS_67 = {}.IconDashboard;
                            const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({ ...{}, }));
                            ({}.IconDashboard);
                            const __VLS_69 = __VLS_68({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_68));
                            ({}({ ...{}, }));
                            const __VLS_70 = __VLS_pickFunctionalComponentCtx(__VLS_67, __VLS_69);
                        }
                        (__VLS_64.slots).default;
                        const __VLS_64 = __VLS_pickFunctionalComponentCtx(__VLS_61, __VLS_63);
                        let __VLS_65;
                    }
                    (__VLS_59.slots).default;
                    const __VLS_59 = __VLS_pickFunctionalComponentCtx(__VLS_56, __VLS_58);
                }
                {
                    const __VLS_72 = {}.VarButton;
                    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({ ...{}, type: ("info"), round: (true), }));
                    ({}.VarButton);
                    ({}.VarButton);
                    const __VLS_74 = __VLS_73({ ...{}, type: ("info"), round: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_73));
                    ({}({ ...{}, type: ("info"), round: (true), }));
                    {
                        const __VLS_77 = {}.IconBxsBookBookmark;
                        const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({ ...{}, }));
                        ({}.IconBxsBookBookmark);
                        const __VLS_79 = __VLS_78({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_78));
                        ({}({ ...{}, }));
                        const __VLS_80 = __VLS_pickFunctionalComponentCtx(__VLS_77, __VLS_79);
                    }
                    (__VLS_75.slots).default;
                    const __VLS_75 = __VLS_pickFunctionalComponentCtx(__VLS_72, __VLS_74);
                }
                {
                    const __VLS_82 = {}.VarButton;
                    const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({ ...{}, color: ("rgb(217, 121, 252)"), round: (true), }));
                    ({}.VarButton);
                    ({}.VarButton);
                    const __VLS_84 = __VLS_83({ ...{}, color: ("rgb(217, 121, 252)"), round: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_83));
                    ({}({ ...{}, color: ("rgb(217, 121, 252)"), round: (true), }));
                    {
                        const __VLS_87 = {}.IconToolsFill;
                        const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({ ...{}, }));
                        ({}.IconToolsFill);
                        const __VLS_89 = __VLS_88({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_88));
                        ({}({ ...{}, }));
                        const __VLS_90 = __VLS_pickFunctionalComponentCtx(__VLS_87, __VLS_89);
                    }
                    (__VLS_85.slots).default;
                    const __VLS_85 = __VLS_pickFunctionalComponentCtx(__VLS_82, __VLS_84);
                }
                {
                    const __VLS_92 = {}.VarButton;
                    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({ ...{}, color: ("rgb(117, 121, 252)"), round: (true), }));
                    ({}.VarButton);
                    ({}.VarButton);
                    const __VLS_94 = __VLS_93({ ...{}, color: ("rgb(117, 121, 252)"), round: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_93));
                    ({}({ ...{}, color: ("rgb(117, 121, 252)"), round: (true), }));
                    {
                        const __VLS_97 = {}.IconTestTube;
                        const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({ ...{}, }));
                        ({}.IconTestTube);
                        const __VLS_99 = __VLS_98({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_98));
                        ({}({ ...{}, }));
                        const __VLS_100 = __VLS_pickFunctionalComponentCtx(__VLS_97, __VLS_99);
                    }
                    (__VLS_95.slots).default;
                    const __VLS_95 = __VLS_pickFunctionalComponentCtx(__VLS_92, __VLS_94);
                }
                // @ts-ignore
                [toggleWindow,];
            }
        }
        const __VLS_3 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
    }
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses["bottom-fab"];
        __VLS_styleScopedClasses["scroll-button"];
        __VLS_styleScopedClasses["scroll-up"];
    }
    var __VLS_slots;
    return __VLS_slots;
}
const __VLS_internalComponent = (await import('vue')).defineComponent({
    setup() {
        return {
            isMobile: isMobile,
            IconGridRound: IconGridRound,
            IconDashboard: IconDashboard,
            IconBxsBookBookmark: IconBxsBookBookmark,
            IconToolsFill: IconToolsFill,
            IconTestTube: IconTestTube,
            IconArrowheadDown: IconArrowheadDown,
            IconArrowheadUp: IconArrowheadUp,
            active: active,
            state: state,
            toggleWindow: toggleWindow,
            scrollTo: scrollTo,
        };
    },
    props: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    props: {},
});
