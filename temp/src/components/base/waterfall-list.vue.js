import { ref, reactive, defineProps, withDefaults, computed, nextTick, onMounted, onUpdated, watch, onActivated, } from "vue";
import BaseImgCard from "./base-img-card.vue";
const { defineSlots, defineEmits, defineExpose, defineModel, defineOptions, } = await import('vue');
// props定义
const props = withDefaults(defineProps(), {
    data: () => [], // 默认值为空数组。
    keyProp: "id", // 默认值为"id"。
    itemPadding: "", // 默认值为
    itemBaseWidth: 220, // 默认值为220。
    // 响应式瀑布流的映射配置
    sizeMap: () => {
        return {
            1280: { columns: 5 },
            1100: { columns: 4 },
            720: { columns: 3 },
            380: { columns: 2 },
            0: { columns: 1 },
        };
    }, // 默认值为空Map。
    loading: false, // 默认值为false。
});
// 数据信息
const dataInfo = reactive({
    list: [],
});
// 状态信息
const state = reactive({
    columns: ref(4), // 列数
    nextTops: ref([]), // 每列当前高度
    itemFixWidth: ref(null), // item当前宽度
    containerHeight: ref(0), // 容器高度
});
// 容器DOM
const containerDom = ref(null);
// 子元素DOM集合
const itemDOMs = ref(null);
// 容器样式定义
const containerStyle = computed(() => {
    return {
        height: dataInfo.list.length ? state.containerHeight + "px" : "",
    };
});
// 每个item的样式定义
const itemStyle = computed(() => {
    const padding = typeof props.itemPadding === "number"
        ? props.itemPadding + "px"
        : props.itemPadding; // 处理padding为px单位
    return { padding };
});
// f 数据改变(带防抖)
let timer = null; // 计时器
let handleTask = () => { }; // 任务
function handleResetPosition(task, options // 配置选项,可用于临时调整时间间隔
) {
    // 默认配置项
    const defaultOptions = {
        delay: 300,
    };
    // 先记录任务
    if (task instanceof Function) {
        handleTask = task;
    }
    // 如果计时器还没结束就又出触发该函数就清除计时器(重置计时)
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
    // 获取配置参数
    const { delay } = { ...defaultOptions, ...options };
    // 设置计时器等待时间到达执行重新布局
    timer = setTimeout(() => {
        // 时间到达则先将之前队列中存入的任务取出全部执行
        handleTask(); // 执行任务
        handleTask = () => { }; // 重置任务
        // 最后布局
        // console.time("布局");
        nextTick(() => {
            if (!resetPosition()) {
                // setTimeout(() => {
                // 	handleResetPosition();
                // }, 100);
                console.log("布局失败！");
            }
        });
        // console.timeEnd("布局");
    }, delay);
}
// 组件挂载后执行
onMounted(() => {
    useResizeObserver(containerDom.value.$el, () => {
        // 如果是窗口变化则将执行间隔调低至250ms
        // console.time("容器尺寸变化");
        // nextTick(() => {
        // 	handleResetPosition(null, { delay: 200 });
        // });
        handleResetPosition(null, { delay: 200 });
        // console.timeEnd("容器尺寸变化");
    });
    // 创建时如果数据不为空则进行进行一次布局
    if (props.data.length && !dataInfo.list.length) {
        dataInfo.list = props.data;
        nextTick(() => {
            resetPosition();
        });
    }
});
// 当组件被激活时执行
onActivated(() => {
    console.log("组件==>被激活");
});
// 元素离开前
const onBeforeLeave = (el) => {
    el.style.transitionDelay = "";
};
// 监听传入的数组变化
watch(() => props.data, (newList) => {
    // console.log("数组变化", newList, oldList);
    handleResetPosition(() => {
        dataInfo.list = newList;
    });
});
// 计算列数
function calcColumns() {
    let container = containerDom.value.$el;
    // console.log(container);
    // 用当前item宽度计算列数
    const containerWidth = container.clientWidth;
    let itemBaseWidth = props.itemBaseWidth;
    let sizeMap = props.sizeMap; // 预设尺寸映射表，用于响应式布局
    let nowColumns = 1; //默认列数
    // 判断是否使用了sizeMap
    if (Object.keys(sizeMap).length > 0) {
        // 查询当前窗口宽度
        let ww = window.innerWidth;
        // 找到对应的预设
        let sizeSet = null;
        for (const key in sizeMap) {
            if (ww > Number(key)) {
                // console.log(ww, Number(key));
                sizeSet = sizeMap[key];
            }
        }
        // console.log(ww, sizeMap, sizeSet);
        if (sizeSet) {
            nowColumns = sizeSet.columns;
            // 同时修改itemBaseWidth
            itemBaseWidth = containerWidth / nowColumns;
        }
        else {
            // 如果没有找到，则使用默认值或最大值
            nowColumns = Math.floor(containerWidth / itemBaseWidth);
        }
    }
    else {
        nowColumns = Math.floor(containerWidth / itemBaseWidth);
    }
    // console.log("当前列数", nowColumns);
    let FixWidth = state.itemFixWidth;
    // 列数判断
    if (nowColumns === 1) {
        // 处理只有一列的情况
        FixWidth = containerWidth;
    }
    else {
        // 大于1列的情况
        // 计算剩余空间
        let remainSpace = containerWidth - nowColumns * itemBaseWidth;
        // 计算每个图片的间距(作为补偿)
        FixWidth = itemBaseWidth + remainSpace / nowColumns;
    }
    state.itemFixWidth = FixWidth;
    state.columns = nowColumns;
    // console.log("当前每列宽度", itemFixWidth);
    return { columns: nowColumns, fixWidth: FixWidth };
}
// 重新设置item坐标
async function resetPosition() {
    // console.log("重新布局！！！");
    if (!containerDom.value) {
        // 没有容器就标记为布局未完成
        return false;
    }
    if (!itemDOMs.value?.length) {
        // 没有子元素则直接标记为布局完成
        // console.log("没有子元素==>布局完成");
        return true;
    }
    let info = calcColumns();
    // console.log("尺寸变化,容器高度", this.containerDom.clientHeight);
    // 该数组的长度为列数，每一项表示该列的下一个图片的纵坐标
    // 先按照序号排序
    let children = itemDOMs.value.sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));
    // 二次确认是否有子元素
    if (!children.length) {
        // 没有子元素则直接标记为布局完成
        // console.log("没有子元素==>布局完成");
        return true;
    }
    // 重置每列的高度
    let nextTopsInner = new Array(info.columns).fill(0);
    // 计算每个盒子的位置
    for (let i = 0; i < children.length; i++) {
        let box = children[i];
        // 执行逻辑
        const handle = () => {
            // 获取元素宽高比
            const aspectRatio = box.clientWidth / box.clientHeight;
            // 纵坐标
            let minTop = Math.min(...nextTopsInner); //找到最低的高度
            let index = nextTopsInner.indexOf(minTop); //找到最低的高度的列号
            // 横坐标
            let left = index * state.itemFixWidth;
            // 设置位置
            setItemPosition(box, minTop, left);
            // 如果是第一次加载则需要等待图片加载完成
            nextTopsInner[index] += state.itemFixWidth / aspectRatio; // 使用元素比例计算高度
            state.nextTops = nextTopsInner;
        };
        // 任务
        const task = () => {
            return new Promise((resolve) => {
                if (box.clientWidth !== state.itemFixWidth) {
                    box.style.width = state.itemFixWidth + "px";
                }
                nextTick(() => {
                    handle();
                    resolve();
                });
            });
        };
        await task();
    }
    setContainerHeight(nextTopsInner);
    return true;
}
// 设置元素位置
const setItemPosition = (itemDom, top, left) => {
    itemDom.style.top = top + "px";
    itemDom.style.left = left + "px";
};
// 设置容器高度
function setContainerHeight(nextTops) {
    // console.log("当前->nextTops", nextTops);
    state.containerHeight = Math.max(...nextTops);
}
// 容器内有元素过渡结束时的回调
function handleTransitionend(e) {
    console.log("元素过渡结束");
    // const propertyNames = ["width", "height", "top", "left", "aspect-ratio"];
    const propertyNames = ["height", "aspect-ratio"];
    if (propertyNames.includes(e.propertyName)) {
        // console.log("有元素过渡结束 => ", e.propertyName);
        handleResetPosition(null, { delay: 100 });
    }
}
// ResizeObserver API的封装
function useResizeObserver(target, callback) {
    // 检查浏览器是否支持 Resize Observer API
    if (!("ResizeObserver" in window))
        return null;
    // 创建 Resize Observer 实例，传入回调函数
    const observer = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
            // 在这里执行针对目标元素的 DOM 操作，例如根据尺寸调整样式等
            callback(entry.contentRect.width, entry.contentRect.height);
        });
    });
    // 开始观察目标元素
    observer.observe(target);
    // 返回观察者实例，以便可以停止观察
    return observer;
}
const __VLS_withDefaultsArg = (function (t) { return t; })({
    data: () => [], // 默认值为空数组。
    keyProp: "id", // 默认值为"id"。
    itemPadding: "", // 默认值为
    itemBaseWidth: 220, // 默认值为220。
    // 响应式瀑布流的映射配置
    sizeMap: () => {
        return {
            1280: { columns: 5 },
            1100: { columns: 4 },
            720: { columns: 3 },
            380: { columns: 2 },
            0: { columns: 1 },
        };
    }, // 默认值为空Map。
    loading: false, // 默认值为false。
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
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_components.TransitionGroup;
    __VLS_components.transitionGroup;
    __VLS_components.TransitionGroup;
    __VLS_components.transitionGroup;
    // @ts-ignore
    [TransitionGroup, TransitionGroup,];
    __VLS_components.BaseImgCard;
    __VLS_components.BaseImgCard;
    __VLS_components.BaseImgCard;
    __VLS_components.BaseImgCard;
    // @ts-ignore
    [BaseImgCard, BaseImgCard,];
    {
        const __VLS_0 = __VLS_intrinsicElements["div"];
        const __VLS_1 = __VLS_elementAsFunctionalComponent(__VLS_0);
        const __VLS_2 = __VLS_1({ ...{ 'onTransitionend': {}, }, class: ("waterfall-container"), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        ({}({ ...{ 'onTransitionend': {}, }, class: ("waterfall-container"), }));
        let __VLS_5 = { 'transitionend': __VLS_pickEvent(__VLS_4['transitionend'], {}.onTransitionend) };
        __VLS_5 = { transitionend: (__VLS_ctx.handleTransitionend) };
        {
            const __VLS_6 = {}.TransitionGroup;
            const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({ ...{ 'onBeforeLeave': {}, }, name: ("list-complete"), appear: (true), ref: ("containerDom"), style: (({ ...__VLS_ctx.containerStyle })), class: ("waterfall-list-container"), tag: ("div"), }));
            ({}.TransitionGroup);
            ({}.TransitionGroup);
            const __VLS_8 = __VLS_7({ ...{ 'onBeforeLeave': {}, }, name: ("list-complete"), appear: (true), ref: ("containerDom"), style: (({ ...__VLS_ctx.containerStyle })), class: ("waterfall-list-container"), tag: ("div"), }, ...__VLS_functionalComponentArgsRest(__VLS_7));
            ({}({ ...{ 'onBeforeLeave': {}, }, name: ("list-complete"), appear: (true), ref: ("containerDom"), style: (({ ...__VLS_ctx.containerStyle })), class: ("waterfall-list-container"), tag: ("div"), }));
            // @ts-ignore
            (__VLS_ctx.containerDom);
            let __VLS_11 = { 'before-leave': __VLS_pickEvent(__VLS_10['before-leave'], {}.onBeforeLeave) };
            __VLS_11 = { "before-leave": (__VLS_ctx.onBeforeLeave) };
            for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.dataInfo.list))) {
                {
                    const __VLS_12 = __VLS_intrinsicElements["div"];
                    const __VLS_13 = __VLS_elementAsFunctionalComponent(__VLS_12);
                    const __VLS_14 = __VLS_13({ ...{}, class: ("item-container list-complete-item"), ref: ("itemDOMs"), style: (({ ...__VLS_ctx.itemStyle })), "data-index": ((index)), }, ...__VLS_functionalComponentArgsRest(__VLS_13));
                    ({}({ ...{}, class: ("item-container list-complete-item"), ref: ("itemDOMs"), style: (({ ...__VLS_ctx.itemStyle })), "data-index": ((index)), }));
                    // @ts-ignore
                    (__VLS_ctx.itemDOMs);
                    {
                        const __VLS_17 = {}.slot;
                        const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({ ...{}, item: ((item)), index: ((index)), }));
                        const __VLS_19 = __VLS_18({ ...{}, item: ((item)), index: ((index)), }, ...__VLS_functionalComponentArgsRest(__VLS_18));
                        ({}({ ...{}, item: ((item)), index: ((index)), }));
                        var __VLS_21 = {
                            item: (item),
                            index: (index),
                        };
                        {
                            const __VLS_22 = {}.BaseImgCard;
                            const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({ ...{}, data: ((item)), imgUrl: ((item.url)), imgThumb: ((item.thumb)), }));
                            ({}.BaseImgCard);
                            ({}.BaseImgCard);
                            const __VLS_24 = __VLS_23({ ...{}, data: ((item)), imgUrl: ((item.url)), imgThumb: ((item.thumb)), }, ...__VLS_functionalComponentArgsRest(__VLS_23));
                            ({}({ ...{}, data: ((item)), imgUrl: ((item.url)), imgThumb: ((item.thumb)), }));
                            const __VLS_25 = __VLS_pickFunctionalComponentCtx(__VLS_22, __VLS_24);
                        }
                        (__VLS_15.slots).default;
                    }
                    (__VLS_15.slots).default;
                    const __VLS_15 = __VLS_pickFunctionalComponentCtx(__VLS_12, __VLS_14);
                }
                // @ts-ignore
                [handleTransitionend, containerStyle, containerDom, onBeforeLeave, dataInfo, itemStyle, itemDOMs,];
            }
            (__VLS_9.slots).default;
            const __VLS_9 = __VLS_pickFunctionalComponentCtx(__VLS_6, __VLS_8);
            let __VLS_10;
        }
        {
            const __VLS_27 = __VLS_intrinsicElements["div"];
            const __VLS_28 = __VLS_elementAsFunctionalComponent(__VLS_27);
            const __VLS_29 = __VLS_28({ ...{}, class: ("bottom"), }, ...__VLS_functionalComponentArgsRest(__VLS_28));
            ({}({ ...{}, class: ("bottom"), }));
            if (__VLS_ctx.loading) {
                {
                    const __VLS_32 = __VLS_intrinsicElements["div"];
                    const __VLS_33 = __VLS_elementAsFunctionalComponent(__VLS_32);
                    const __VLS_34 = __VLS_33({ ...{}, class: ("bottom-loading"), }, ...__VLS_functionalComponentArgsRest(__VLS_33));
                    ({}({ ...{}, class: ("bottom-loading"), }));
                    (__VLS_35.slots).default;
                    const __VLS_35 = __VLS_pickFunctionalComponentCtx(__VLS_32, __VLS_34);
                }
                // @ts-ignore
                [loading,];
            }
            (__VLS_30.slots).default;
            const __VLS_30 = __VLS_pickFunctionalComponentCtx(__VLS_27, __VLS_29);
        }
        (__VLS_3.slots).default;
        const __VLS_3 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
        let __VLS_4;
    }
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses["waterfall-container"];
        __VLS_styleScopedClasses["waterfall-list-container"];
        __VLS_styleScopedClasses["item-container"];
        __VLS_styleScopedClasses["list-complete-item"];
        __VLS_styleScopedClasses["bottom"];
        __VLS_styleScopedClasses["bottom-loading"];
    }
    var __VLS_slots;
    return __VLS_slots;
}
const __VLS_internalComponent = (await import('vue')).defineComponent({
    setup() {
        return {
            BaseImgCard: BaseImgCard,
            dataInfo: dataInfo,
            containerDom: containerDom,
            itemDOMs: itemDOMs,
            containerStyle: containerStyle,
            itemStyle: itemStyle,
            onBeforeLeave: onBeforeLeave,
            handleTransitionend: handleTransitionend,
        };
    },
    props: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    props: {},
});
export default {};
