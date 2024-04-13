import { defineProps, defineEmits, withDefaults, computed } from "vue";
import BaseImg from "./base-img.vue";
const { defineSlots, defineExpose, defineModel, defineOptions, } = await import('vue');
// 定义事件
const emit = defineEmits(["loaded", "error"]);
// 定义props
const props = withDefaults(defineProps(), {
    data: {},
    imgUrl: "",
    useThumb: false,
    imgThumb: "", // 默认值为空字符串，表示没有缩略图
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    layout: "absolute",
});
// 卡片样式
const cardStyle = computed(() => {
    return { backgroundColor: props.backgroundColor };
});
// 顶部样式
const headerStyle = computed(() => {
    let css = {};
    if (props.layout == "absolute") {
        css = {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
        };
    }
    return css;
});
// 底部样式
const footerStyle = computed(() => {
    let css = {};
    if (props.layout == "absolute") {
        css = {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            // zIndex: 1,
        };
    }
    return css;
});
// 图片加载完成后的回调
function loaded(...args) {
    emit("loaded", ...args);
}
// 图片失败后的回调
function error(...args) {
    emit("error", ...args);
}
const __VLS_withDefaultsArg = (function (t) { return t; })({
    data: {},
    imgUrl: "",
    useThumb: false,
    imgThumb: "", // 默认值为空字符串，表示没有缩略图
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    layout: "absolute",
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
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_components.BaseImg;
    __VLS_components.BaseImg;
    // @ts-ignore
    [BaseImg,];
    {
        const __VLS_0 = __VLS_intrinsicElements["div"];
        const __VLS_1 = __VLS_elementAsFunctionalComponent(__VLS_0);
        const __VLS_2 = __VLS_1({ ...{}, class: ("img-card-container"), style: ((__VLS_ctx.cardStyle)), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        ({}({ ...{}, class: ("img-card-container"), style: ((__VLS_ctx.cardStyle)), }));
        {
            const __VLS_5 = {}.slot;
            const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({ ...{}, data: ((__VLS_ctx.data)), src: ((__VLS_ctx.imgUrl)), thumb: ((__VLS_ctx.imgThumb)), }));
            const __VLS_7 = __VLS_6({ ...{}, data: ((__VLS_ctx.data)), src: ((__VLS_ctx.imgUrl)), thumb: ((__VLS_ctx.imgThumb)), }, ...__VLS_functionalComponentArgsRest(__VLS_6));
            ({}({ ...{}, data: ((__VLS_ctx.data)), src: ((__VLS_ctx.imgUrl)), thumb: ((__VLS_ctx.imgThumb)), }));
            var __VLS_9 = {
                data: (__VLS_ctx.data),
                src: (__VLS_ctx.imgUrl),
                thumb: (__VLS_ctx.imgThumb),
            };
            {
                const __VLS_10 = {}.BaseImg;
                const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({ ...{ 'onLoaded': {}, 'onError': {}, }, src: ((__VLS_ctx.imgUrl)), thumb: ((__VLS_ctx.imgThumb)), useThumb: ((__VLS_ctx.useThumb)), }));
                ({}.BaseImg);
                const __VLS_12 = __VLS_11({ ...{ 'onLoaded': {}, 'onError': {}, }, src: ((__VLS_ctx.imgUrl)), thumb: ((__VLS_ctx.imgThumb)), useThumb: ((__VLS_ctx.useThumb)), }, ...__VLS_functionalComponentArgsRest(__VLS_11));
                ({}({ ...{ 'onLoaded': {}, 'onError': {}, }, src: ((__VLS_ctx.imgUrl)), thumb: ((__VLS_ctx.imgThumb)), useThumb: ((__VLS_ctx.useThumb)), }));
                let __VLS_15 = { 'loaded': __VLS_pickEvent(__VLS_14['loaded'], {}.onLoaded) };
                __VLS_15 = { loaded: (__VLS_ctx.loaded) };
                let __VLS_16 = { 'error': __VLS_pickEvent(__VLS_14['error'], {}.onError) };
                __VLS_16 = { error: (__VLS_ctx.error) };
                const __VLS_13 = __VLS_pickFunctionalComponentCtx(__VLS_10, __VLS_12);
                let __VLS_14;
            }
            (__VLS_3.slots).default;
        }
        {
            const __VLS_17 = __VLS_intrinsicElements["div"];
            const __VLS_18 = __VLS_elementAsFunctionalComponent(__VLS_17);
            const __VLS_19 = __VLS_18({ ...{}, class: ("card-header"), style: __VLS_ctx.headerStyle, }, ...__VLS_functionalComponentArgsRest(__VLS_18));
            ({}({ ...{}, class: ("card-header"), style: __VLS_ctx.headerStyle, }));
            {
                const __VLS_22 = {}.slot;
                const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({ ...{}, data: ((__VLS_ctx.data)), }));
                const __VLS_24 = __VLS_23({ ...{}, data: ((__VLS_ctx.data)), }, ...__VLS_functionalComponentArgsRest(__VLS_23));
                ({}({ ...{}, data: ((__VLS_ctx.data)), }));
                var __VLS_26 = {
                    data: (__VLS_ctx.data),
                };
            }
            (__VLS_20.slots).default;
            const __VLS_20 = __VLS_pickFunctionalComponentCtx(__VLS_17, __VLS_19);
        }
        {
            const __VLS_27 = __VLS_intrinsicElements["div"];
            const __VLS_28 = __VLS_elementAsFunctionalComponent(__VLS_27);
            const __VLS_29 = __VLS_28({ ...{}, class: ("card-footer"), style: __VLS_ctx.footerStyle, }, ...__VLS_functionalComponentArgsRest(__VLS_28));
            ({}({ ...{}, class: ("card-footer"), style: __VLS_ctx.footerStyle, }));
            {
                const __VLS_32 = {}.slot;
                const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({ ...{}, data: ((__VLS_ctx.data)), }));
                const __VLS_34 = __VLS_33({ ...{}, data: ((__VLS_ctx.data)), }, ...__VLS_functionalComponentArgsRest(__VLS_33));
                ({}({ ...{}, data: ((__VLS_ctx.data)), }));
                var __VLS_36 = {
                    data: (__VLS_ctx.data),
                };
            }
            (__VLS_30.slots).default;
            const __VLS_30 = __VLS_pickFunctionalComponentCtx(__VLS_27, __VLS_29);
        }
        (__VLS_3.slots).default;
        const __VLS_3 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
    }
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses["img-card-container"];
        __VLS_styleScopedClasses["card-header"];
        __VLS_styleScopedClasses["card-footer"];
    }
    var __VLS_slots;
    // @ts-ignore
    [cardStyle, data, imgUrl, imgThumb, imgUrl, imgThumb, useThumb, loaded, error, headerStyle, data, footerStyle, data,];
    return __VLS_slots;
}
const __VLS_internalComponent = (await import('vue')).defineComponent({
    setup() {
        return {
            BaseImg: BaseImg,
            cardStyle: cardStyle,
            headerStyle: headerStyle,
            footerStyle: footerStyle,
            loaded: loaded,
            error: error,
        };
    },
    props: {},
    emits: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    props: {},
    emits: {},
});
export default {};
