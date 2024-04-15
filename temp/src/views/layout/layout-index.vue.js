import { ref, onMounted, watch } from "vue";
import { RouterView } from "vue-router";
import useGlobalStore from "@/stores/global"; //导入全局仓库
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const globalStore = useGlobalStore();
import IconMenu from "@svg/menu.svg";
import IconMoreVertical from "@svg/more-vertical.svg";
let layoutContainer = ref(null);
let appBarIsCollapse = ref(true); // 应用栏是否折叠的标志位
// 导入Fancybox和相关配置
import { Fancybox, configFancybox } from "@/plugin/fancyapps-ui";
onMounted(() => {
    Fancybox.bind(layoutContainer.value, "[data-fancybox]", {
        ...configFancybox,
        parentEl: layoutContainer.value, // 设置Fancybox的父容器为layoutContainer
    }); // 绑定Fancybox到指定的元素上
});
watch(() => globalStore.openWindow, (val) => {
    if (val) {
        layoutContainer.value?.focus();
    }
});
// console.log(globalStore.openWindow);
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
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_components.VApp;
    __VLS_components.vApp;
    __VLS_components.VApp;
    __VLS_components.vApp;
    // @ts-ignore
    [VApp, VApp,];
    __VLS_components.VLayout;
    __VLS_components.vLayout;
    __VLS_components.VLayout;
    __VLS_components.vLayout;
    // @ts-ignore
    [VLayout, VLayout,];
    __VLS_components.VAppBar;
    __VLS_components.vAppBar;
    __VLS_components.VAppBar;
    __VLS_components.vAppBar;
    // @ts-ignore
    [VAppBar, VAppBar,];
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_components.VAppBarNavIcon;
    __VLS_components.vAppBarNavIcon;
    __VLS_components.VAppBarNavIcon;
    __VLS_components.vAppBarNavIcon;
    // @ts-ignore
    [VAppBarNavIcon, VAppBarNavIcon,];
    __VLS_components.IconMenu;
    __VLS_components.IconMenu;
    // @ts-ignore
    [IconMenu,];
    __VLS_components.VAppBarTitle;
    __VLS_components.vAppBarTitle;
    __VLS_components.VAppBarTitle;
    __VLS_components.vAppBarTitle;
    // @ts-ignore
    [VAppBarTitle, VAppBarTitle,];
    __VLS_components.VBtn;
    __VLS_components.vBtn;
    __VLS_components.VBtn;
    __VLS_components.vBtn;
    // @ts-ignore
    [VBtn, VBtn,];
    __VLS_components.IconMoreVertical;
    __VLS_components.IconMoreVertical;
    // @ts-ignore
    [IconMoreVertical,];
    __VLS_components.VMain;
    __VLS_components.vMain;
    __VLS_components.VMain;
    __VLS_components.vMain;
    // @ts-ignore
    [VMain, VMain,];
    __VLS_components.RouterView;
    __VLS_components.RouterView;
    // @ts-ignore
    [RouterView,];
    {
        const __VLS_0 = __VLS_intrinsicElements["div"];
        const __VLS_1 = __VLS_elementAsFunctionalComponent(__VLS_0);
        const __VLS_2 = __VLS_1({ ...{ 'onWheel': {}, }, class: ("layout-container"), ref: ("layoutContainer"), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        ({}({ ...{ 'onWheel': {}, }, class: ("layout-container"), ref: ("layoutContainer"), }));
        ({ open: __VLS_ctx.globalStore.openWindow });
        // @ts-ignore
        (__VLS_ctx.layoutContainer);
        __VLS_styleScopedClasses = ({ open: globalStore.openWindow });
        let __VLS_5 = { 'wheel': __VLS_pickEvent(__VLS_4['wheel'], {}.onWheel) };
        __VLS_5 = { wheel: () => { } };
        {
            const __VLS_6 = {}.VApp;
            const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({ ...{}, class: ("layout-app-container"), }));
            ({}.VApp);
            ({}.VApp);
            const __VLS_8 = __VLS_7({ ...{}, class: ("layout-app-container"), }, ...__VLS_functionalComponentArgsRest(__VLS_7));
            ({}({ ...{}, class: ("layout-app-container"), }));
            {
                const __VLS_11 = {}.VLayout;
                const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({ ...{}, }));
                ({}.VLayout);
                ({}.VLayout);
                const __VLS_13 = __VLS_12({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_12));
                ({}({ ...{}, }));
                {
                    const __VLS_16 = {}.VAppBar;
                    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({ ...{}, elevation: ((2)), density: ("compact"), height: ("50"), collapse: ((__VLS_ctx.appBarIsCollapse)), }));
                    ({}.VAppBar);
                    ({}.VAppBar);
                    const __VLS_18 = __VLS_17({ ...{}, elevation: ((2)), density: ("compact"), height: ("50"), collapse: ((__VLS_ctx.appBarIsCollapse)), }, ...__VLS_functionalComponentArgsRest(__VLS_17));
                    ({}({ ...{}, elevation: ((2)), density: ("compact"), height: ("50"), collapse: ((__VLS_ctx.appBarIsCollapse)), }));
                    {
                        const __VLS_21 = __VLS_intrinsicElements["template"];
                        const __VLS_22 = __VLS_elementAsFunctionalComponent(__VLS_21);
                        const __VLS_23 = __VLS_22({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_22));
                        ({}({ ...{}, }));
                        {
                            (__VLS_19.slots).prepend;
                            {
                                const __VLS_25 = {}.VAppBarNavIcon;
                                const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({ ...{ 'onClick': {}, }, density: ("compact"), }));
                                ({}.VAppBarNavIcon);
                                ({}.VAppBarNavIcon);
                                const __VLS_27 = __VLS_26({ ...{ 'onClick': {}, }, density: ("compact"), }, ...__VLS_functionalComponentArgsRest(__VLS_26));
                                ({}({ ...{ 'onClick': {}, }, density: ("compact"), }));
                                __VLS_directiveFunction(__VLS_ctx.vRipple)(undefined);
                                let __VLS_30 = { 'click': __VLS_pickEvent(__VLS_29['click'], {}.onClick) };
                                __VLS_30 = { click: $event => {
                                        __VLS_ctx.appBarIsCollapse = !__VLS_ctx.appBarIsCollapse;
                                        // @ts-ignore
                                        [globalStore, layoutContainer, appBarIsCollapse, appBarIsCollapse, appBarIsCollapse,];
                                    }
                                };
                                {
                                    const __VLS_31 = {}.IconMenu;
                                    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({ ...{}, style: ({}), }));
                                    ({}.IconMenu);
                                    const __VLS_33 = __VLS_32({ ...{}, style: ({}), }, ...__VLS_functionalComponentArgsRest(__VLS_32));
                                    ({}({ ...{}, style: ({}), }));
                                    const __VLS_34 = __VLS_pickFunctionalComponentCtx(__VLS_31, __VLS_33);
                                }
                                (__VLS_28.slots).default;
                                const __VLS_28 = __VLS_pickFunctionalComponentCtx(__VLS_25, __VLS_27);
                                let __VLS_29;
                            }
                        }
                    }
                    {
                        const __VLS_36 = {}.VAppBarTitle;
                        const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({ ...{}, }));
                        ({}.VAppBarTitle);
                        ({}.VAppBarTitle);
                        const __VLS_38 = __VLS_37({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_37));
                        ({}({ ...{}, }));
                        (__VLS_39.slots).default;
                        const __VLS_39 = __VLS_pickFunctionalComponentCtx(__VLS_36, __VLS_38);
                    }
                    {
                        const __VLS_41 = __VLS_intrinsicElements["template"];
                        const __VLS_42 = __VLS_elementAsFunctionalComponent(__VLS_41);
                        const __VLS_43 = __VLS_42({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_42));
                        ({}({ ...{}, }));
                        {
                            (__VLS_19.slots).append;
                            {
                                const __VLS_45 = {}.VBtn;
                                const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({ ...{}, density: ("compact"), icon: (true), ripple: ((false)), }));
                                ({}.VBtn);
                                ({}.VBtn);
                                const __VLS_47 = __VLS_46({ ...{}, density: ("compact"), icon: (true), ripple: ((false)), }, ...__VLS_functionalComponentArgsRest(__VLS_46));
                                ({}({ ...{}, density: ("compact"), icon: (true), ripple: ((false)), }));
                                __VLS_directiveFunction(__VLS_ctx.vRipple)(undefined);
                                {
                                    const __VLS_50 = {}.IconMoreVertical;
                                    const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({ ...{}, style: ({}), }));
                                    ({}.IconMoreVertical);
                                    const __VLS_52 = __VLS_51({ ...{}, style: ({}), }, ...__VLS_functionalComponentArgsRest(__VLS_51));
                                    ({}({ ...{}, style: ({}), }));
                                    const __VLS_53 = __VLS_pickFunctionalComponentCtx(__VLS_50, __VLS_52);
                                }
                                (__VLS_48.slots).default;
                                const __VLS_48 = __VLS_pickFunctionalComponentCtx(__VLS_45, __VLS_47);
                            }
                        }
                    }
                    const __VLS_19 = __VLS_pickFunctionalComponentCtx(__VLS_16, __VLS_18);
                }
                {
                    const __VLS_55 = {}.VMain;
                    const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({ ...{}, }));
                    ({}.VMain);
                    ({}.VMain);
                    const __VLS_57 = __VLS_56({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_56));
                    ({}({ ...{}, }));
                    {
                        const __VLS_60 = {}.RouterView;
                        const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({ ...{}, }));
                        ({}.RouterView);
                        const __VLS_62 = __VLS_61({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_61));
                        ({}({ ...{}, }));
                        const __VLS_63 = __VLS_pickFunctionalComponentCtx(__VLS_60, __VLS_62);
                    }
                    (__VLS_58.slots).default;
                    const __VLS_58 = __VLS_pickFunctionalComponentCtx(__VLS_55, __VLS_57);
                }
                (__VLS_14.slots).default;
                const __VLS_14 = __VLS_pickFunctionalComponentCtx(__VLS_11, __VLS_13);
            }
            (__VLS_9.slots).default;
            const __VLS_9 = __VLS_pickFunctionalComponentCtx(__VLS_6, __VLS_8);
        }
        (__VLS_3.slots).default;
        const __VLS_3 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
        let __VLS_4;
    }
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses["layout-container"];
        __VLS_styleScopedClasses["layout-app-container"];
    }
    var __VLS_slots;
    return __VLS_slots;
}
const __VLS_internalComponent = (await import('vue')).defineComponent({
    setup() {
        return {
            RouterView: RouterView,
            globalStore: globalStore,
            IconMenu: IconMenu,
            IconMoreVertical: IconMoreVertical,
            layoutContainer: layoutContainer,
            appBarIsCollapse: appBarIsCollapse,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
