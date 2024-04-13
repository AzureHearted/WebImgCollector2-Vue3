import { ref, reactive, onMounted, computed, watch, nextTick } from "vue";
import { useElementBounding, useDraggable } from "@vueuse/core";
export default await (async () => {
    const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
    // 视口DOM
    const viewportDOM = ref(null);
    const viewportInfo = reactive({
        ...useElementBounding(viewportDOM),
    });
    // 滚动容器
    const wrapperDOM = ref(null);
    // 内容区DOM
    const contentDOM = ref(null);
    const contentInfo = reactive({
        ...useElementBounding(contentDOM),
    });
    watch(() => [
        viewportInfo.width,
        viewportInfo.height,
        contentInfo.width,
        contentInfo.height,
    ], () => {
        // console.log("contentInfo", contentInfo);
        calculateScrollbarSize(); //计算滚动条尺寸
        setScrollbarPosition(); //计算滚动条位置
    });
    // 状态数据
    const scrollbar = reactive({
        show: false,
        vertical: {
            width: 8, // 滚动条宽度，根据实际情况调整
            length: -1, // -1 表示默认无滚动条
            top: 0, // 滚动条位置
            isDragging: false,
        },
        horizontal: {
            width: 8, // 滚动条宽度，根据实际情况调整
            length: -1, // -1 表示默认无滚动条
            left: 0, // 滚动条位置
            isDragging: false,
        },
    });
    // 滚动条DOM(垂直)
    const verticalBar = ref(null);
    onMounted(() => {
        const { y, isDragging } = useDraggable(verticalBar, {
            axis: "y", // 限制垂直拖拽
            containerElement: viewportDOM.value, // 设置父容器
        });
        // 监听拖拽参数变化
        watch([y, isDragging], ([x, isDragging]) => {
            scrollbar.vertical.top = x; // 更新滚动条位置
            scrollbar.vertical.isDragging = isDragging;
            // 计算滚动距离
            const top = (contentInfo.height / viewportInfo.height) * scrollbar.vertical.top;
            const left = (contentInfo.width / viewportInfo.width) * scrollbar.horizontal.left;
            // 更新滚动距离
            updateScrollPosition(top, left);
        });
    });
    // 滚动条样式(垂直)
    const verticalStyle = computed(() => {
        return {
            // 根据滚动条长度决定是否显示滚动条
            height: `${scrollbar.vertical.length}px`,
            top: `${scrollbar.vertical.top}px`,
        };
    });
    // 滚动条DOM(水平)
    const horizontalBar = ref(null);
    onMounted(() => {
        const { x, isDragging } = useDraggable(horizontalBar, {
            axis: "x", // 限制水平拖拽
            containerElement: viewportDOM.value, // 设置父容器
        });
        // 监听拖拽参数变化
        watch([x, isDragging], ([x, isDragging]) => {
            scrollbar.horizontal.left = x; // 更新滚动条位置
            scrollbar.horizontal.isDragging = isDragging;
            // 计算滚动距离
            const top = (contentInfo.height / viewportInfo.height) * scrollbar.vertical.top;
            const left = (contentInfo.width / viewportInfo.width) * scrollbar.horizontal.left;
            // 更新滚动距离
            updateScrollPosition(top, left);
        });
    });
    // 滚动条样式(水平)
    const horizontalStyle = computed(() => {
        return {
            // 根据滚动条长度决定是否显示滚动条
            width: `${scrollbar.horizontal.length}px`,
            left: `${scrollbar.horizontal.left}px`,
        };
    });
    // 计算滚动条尺寸
    function calculateScrollbarSize() {
        if (!wrapperDOM.value)
            return;
        const { width, height } = viewportInfo; // 提取出视口宽高
        const { scrollWidth, scrollHeight } = wrapperDOM.value; // 提取滚动容器内容区宽高
        // 计算垂直滚动条长度
        scrollbar.vertical.length =
            scrollHeight > height ? (height / scrollHeight) * height : -1;
        // 计算水平滚动条长度
        scrollbar.horizontal.length =
            scrollWidth > width ? (width / scrollWidth) * width : -1;
    }
    // 设置滚动条位置
    function setScrollbarPosition() {
        if (wrapperDOM.value) {
            const scrollTop = wrapperDOM.value.scrollTop;
            const scrollLeft = wrapperDOM.value.scrollLeft;
            // console.log("内容滚动", scrollLeft, scrollTop);
            // 更新滚动条位置
            scrollbar.vertical.top =
                (viewportInfo.height / contentInfo.height) * scrollTop;
            scrollbar.horizontal.left =
                (viewportInfo.width / contentInfo.width) * scrollLeft;
            // console.log("滚动事件", scrollTop);
        }
    }
    // 设置wrapper的滚动位置
    function updateScrollPosition(top, left, behavior = "instant") {
        if (wrapperDOM.value) {
            // console.log("触发滚动contentDOM");
            wrapperDOM.value.scrollTo({ top, left, behavior });
        }
    }
    let __VLS_modelEmitsType;
    const __VLS_componentsOption = {};
    const __VLS_name = "BaseVirtualScrollbar";
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
        __VLS_intrinsicElements.div;
        __VLS_intrinsicElements.div;
        __VLS_intrinsicElements.div;
        __VLS_intrinsicElements.div;
        __VLS_components.Transition;
        __VLS_components.transition;
        __VLS_components.Transition;
        __VLS_components.transition;
        __VLS_components.Transition;
        __VLS_components.transition;
        __VLS_components.Transition;
        __VLS_components.transition;
        // @ts-ignore
        [Transition, Transition, Transition, Transition,];
        {
            const __VLS_0 = __VLS_intrinsicElements["div"];
            const __VLS_1 = __VLS_elementAsFunctionalComponent(__VLS_0);
            const __VLS_2 = __VLS_1({ ...{ 'onMouseover': {}, 'onMouseleave': {}, }, ref: ("viewportDOM"), class: ("base-virtual-scrollbar-viewport"), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
            ({}({ ...{ 'onMouseover': {}, 'onMouseleave': {}, }, ref: ("viewportDOM"), class: ("base-virtual-scrollbar-viewport"), }));
            // @ts-ignore
            (__VLS_ctx.viewportDOM);
            let __VLS_5 = { 'mouseover': __VLS_pickEvent(__VLS_4['mouseover'], {}.onMouseover) };
            __VLS_5 = { mouseover: $event => {
                    __VLS_ctx.scrollbar.show = true;
                    // @ts-ignore
                    [viewportDOM, scrollbar,];
                }
            };
            let __VLS_6 = { 'mouseleave': __VLS_pickEvent(__VLS_4['mouseleave'], {}.onMouseleave) };
            __VLS_6 = { mouseleave: $event => {
                    __VLS_ctx.scrollbar.show = false;
                    // @ts-ignore
                    [scrollbar,];
                }
            };
            {
                const __VLS_7 = __VLS_intrinsicElements["div"];
                const __VLS_8 = __VLS_elementAsFunctionalComponent(__VLS_7);
                const __VLS_9 = __VLS_8({ ...{ 'onScroll': {}, }, ref: ("wrapperDOM"), class: ("base-virtual-scrollbar-wrapper"), }, ...__VLS_functionalComponentArgsRest(__VLS_8));
                ({}({ ...{ 'onScroll': {}, }, ref: ("wrapperDOM"), class: ("base-virtual-scrollbar-wrapper"), }));
                // @ts-ignore
                (__VLS_ctx.wrapperDOM);
                let __VLS_12 = { 'scroll': __VLS_pickEvent(__VLS_11['scroll'], {}.onScroll) };
                __VLS_12 = { scroll: (__VLS_ctx.setScrollbarPosition) };
                {
                    const __VLS_13 = __VLS_intrinsicElements["div"];
                    const __VLS_14 = __VLS_elementAsFunctionalComponent(__VLS_13);
                    const __VLS_15 = __VLS_14({ ...{ 'onTransitionend': {}, }, ref: ("contentDOM"), class: ("base-virtual-scrollbar-content"), }, ...__VLS_functionalComponentArgsRest(__VLS_14));
                    ({}({ ...{ 'onTransitionend': {}, }, ref: ("contentDOM"), class: ("base-virtual-scrollbar-content"), }));
                    // @ts-ignore
                    (__VLS_ctx.contentDOM);
                    let __VLS_18 = { 'transitionend': __VLS_pickEvent(__VLS_17['transitionend'], {}.onTransitionend) };
                    __VLS_18 = { transitionend: (__VLS_ctx.calculateScrollbarSize) };
                    {
                        const __VLS_19 = {}.slot;
                        const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({ ...{}, }));
                        const __VLS_21 = __VLS_20({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_20));
                        ({}({ ...{}, }));
                        var __VLS_23 = {};
                    }
                    (__VLS_16.slots).default;
                    const __VLS_16 = __VLS_pickFunctionalComponentCtx(__VLS_13, __VLS_15);
                    let __VLS_17;
                }
                (__VLS_10.slots).default;
                const __VLS_10 = __VLS_pickFunctionalComponentCtx(__VLS_7, __VLS_9);
                let __VLS_11;
            }
            {
                const __VLS_24 = {}.transition;
                const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({ ...{}, persisted: (true), }));
                ({}.transition);
                ({}.transition);
                const __VLS_26 = __VLS_25({ ...{}, persisted: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_25));
                ({}({ ...{}, persisted: (true), }));
                {
                    const __VLS_29 = __VLS_intrinsicElements["div"];
                    const __VLS_30 = __VLS_elementAsFunctionalComponent(__VLS_29);
                    const __VLS_31 = __VLS_30({ ...{}, class: ("custom-virtual-scrollbar custom-virtual-scrollbar-vertical"), ref: ("verticalBar"), style: ((__VLS_ctx.verticalStyle)), }, ...__VLS_functionalComponentArgsRest(__VLS_30));
                    ({}({ ...{}, class: ("custom-virtual-scrollbar custom-virtual-scrollbar-vertical"), ref: ("verticalBar"), style: ((__VLS_ctx.verticalStyle)), }));
                    __VLS_directiveFunction(__VLS_ctx.vShow)(((__VLS_ctx.scrollbar.show && __VLS_ctx.scrollbar.vertical.length > 0) ||
                        __VLS_ctx.scrollbar.vertical.isDragging));
                    // @ts-ignore
                    (__VLS_ctx.verticalBar);
                    const __VLS_32 = __VLS_pickFunctionalComponentCtx(__VLS_29, __VLS_31);
                }
                (__VLS_27.slots).default;
                const __VLS_27 = __VLS_pickFunctionalComponentCtx(__VLS_24, __VLS_26);
            }
            {
                const __VLS_34 = {}.transition;
                const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({ ...{}, persisted: (true), }));
                ({}.transition);
                ({}.transition);
                const __VLS_36 = __VLS_35({ ...{}, persisted: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_35));
                ({}({ ...{}, persisted: (true), }));
                {
                    const __VLS_39 = __VLS_intrinsicElements["div"];
                    const __VLS_40 = __VLS_elementAsFunctionalComponent(__VLS_39);
                    const __VLS_41 = __VLS_40({ ...{}, class: ("custom-virtual-scrollbar custom-virtual-scrollbar-horizontal"), ref: ("horizontalBar"), style: ((__VLS_ctx.horizontalStyle)), }, ...__VLS_functionalComponentArgsRest(__VLS_40));
                    ({}({ ...{}, class: ("custom-virtual-scrollbar custom-virtual-scrollbar-horizontal"), ref: ("horizontalBar"), style: ((__VLS_ctx.horizontalStyle)), }));
                    __VLS_directiveFunction(__VLS_ctx.vShow)((__VLS_ctx.scrollbar.show && __VLS_ctx.scrollbar.horizontal.length > 0));
                    // @ts-ignore
                    (__VLS_ctx.horizontalBar);
                    const __VLS_42 = __VLS_pickFunctionalComponentCtx(__VLS_39, __VLS_41);
                }
                (__VLS_37.slots).default;
                const __VLS_37 = __VLS_pickFunctionalComponentCtx(__VLS_34, __VLS_36);
            }
            (__VLS_3.slots).default;
            const __VLS_3 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
            let __VLS_4;
        }
        if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
            __VLS_styleScopedClasses["base-virtual-scrollbar-viewport"];
            __VLS_styleScopedClasses["base-virtual-scrollbar-wrapper"];
            __VLS_styleScopedClasses["base-virtual-scrollbar-content"];
            __VLS_styleScopedClasses["custom-virtual-scrollbar"];
            __VLS_styleScopedClasses["custom-virtual-scrollbar-vertical"];
            __VLS_styleScopedClasses["custom-virtual-scrollbar"];
            __VLS_styleScopedClasses["custom-virtual-scrollbar-horizontal"];
        }
        var __VLS_slots;
        // @ts-ignore
        [wrapperDOM, setScrollbarPosition, contentDOM, calculateScrollbarSize, verticalStyle, scrollbar, scrollbar, scrollbar, verticalBar, horizontalStyle, scrollbar, scrollbar, horizontalBar,];
        return __VLS_slots;
    }
    const __VLS_internalComponent = (await import('vue')).defineComponent({
        setup() {
            return {
                viewportDOM: viewportDOM,
                wrapperDOM: wrapperDOM,
                contentDOM: contentDOM,
                scrollbar: scrollbar,
                verticalBar: verticalBar,
                verticalStyle: verticalStyle,
                horizontalBar: horizontalBar,
                horizontalStyle: horizontalStyle,
                calculateScrollbarSize: calculateScrollbarSize,
                setScrollbarPosition: setScrollbarPosition,
            };
        },
        name: "BaseVirtualScrollbar", // 组件名，用于调试和注册组件时使用
    });
    const __VLS_component = (await import('vue')).defineComponent({
        setup() {
            return {};
        },
        name: "BaseVirtualScrollbar", // 组件名，用于调试和注册组件时使用
    });
    return {};
})();
