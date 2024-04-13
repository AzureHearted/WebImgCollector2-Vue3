import { ref, defineAsyncComponent, onMounted } from "vue";
import { RouterView } from "vue-router";
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const appContainer = ref(null);
const windowContainer = ref(null);
// 异步导入HoverButton组件
const HoverButton = defineAsyncComponent(() => import("@/components/hover-button.vue"));
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
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_components.RouterView;
    __VLS_components.RouterView;
    // @ts-ignore
    [RouterView,];
    __VLS_components.HoverButton;
    __VLS_components.HoverButton;
    // @ts-ignore
    [HoverButton,];
    {
        const __VLS_0 = __VLS_intrinsicElements["div"];
        const __VLS_1 = __VLS_elementAsFunctionalComponent(__VLS_0);
        const __VLS_2 = __VLS_1({ ...{}, ref: ("appContainer"), class: ("online-gallery-container"), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        ({}({ ...{}, ref: ("appContainer"), class: ("online-gallery-container"), }));
        // @ts-ignore
        (__VLS_ctx.appContainer);
        {
            const __VLS_5 = {}.RouterView;
            const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({ ...{}, }));
            ({}.RouterView);
            const __VLS_7 = __VLS_6({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_6));
            ({}({ ...{}, }));
            const __VLS_8 = __VLS_pickFunctionalComponentCtx(__VLS_5, __VLS_7);
        }
        {
            const __VLS_10 = {}.HoverButton;
            const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({ ...{}, teleportTo: ((__VLS_ctx.windowContainer)), }));
            ({}.HoverButton);
            const __VLS_12 = __VLS_11({ ...{}, teleportTo: ((__VLS_ctx.windowContainer)), }, ...__VLS_functionalComponentArgsRest(__VLS_11));
            ({}({ ...{}, teleportTo: ((__VLS_ctx.windowContainer)), }));
            const __VLS_13 = __VLS_pickFunctionalComponentCtx(__VLS_10, __VLS_12);
        }
        {
            const __VLS_15 = __VLS_intrinsicElements["div"];
            const __VLS_16 = __VLS_elementAsFunctionalComponent(__VLS_15);
            const __VLS_17 = __VLS_16({ ...{}, ref: ("windowContainer"), class: ("online-gallery-top-container"), }, ...__VLS_functionalComponentArgsRest(__VLS_16));
            ({}({ ...{}, ref: ("windowContainer"), class: ("online-gallery-top-container"), }));
            // @ts-ignore
            (__VLS_ctx.windowContainer);
            const __VLS_18 = __VLS_pickFunctionalComponentCtx(__VLS_15, __VLS_17);
        }
        (__VLS_3.slots).default;
        const __VLS_3 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
    }
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses["online-gallery-container"];
        __VLS_styleScopedClasses["online-gallery-top-container"];
    }
    var __VLS_slots;
    // @ts-ignore
    [appContainer, windowContainer, windowContainer,];
    return __VLS_slots;
}
const __VLS_internalComponent = (await import('vue')).defineComponent({
    setup() {
        return {
            RouterView: RouterView,
            appContainer: appContainer,
            windowContainer: windowContainer,
            HoverButton: HoverButton,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
;
export const __VLS_globalTypesStart = {};
export const __VLS_globalTypesEnd = {};
